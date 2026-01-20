import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, TileType, Position, Direction, Treasure, Enemy, EnemyTypeStr } from '../types';
import { GAME_CONFIG, ENEMY_STATS } from '../constants';
import { generateMap } from '../utils/mapGenerator';
import { generateTreasure } from '../services/geminiService';

export const useGameEngine = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>(GameState.TITLE);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.GAME_DURATION);
  
  // Map State
  const [mapData, setMapData] = useState<{ tiles: TileType[][], treasureMap: boolean[][] } | null>(null);
  
  // Entities State
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState<Position | null>(null); 
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  
  const [direction, setDirection] = useState<Direction>(Direction.DOWN);
  const [isMoving, setIsMoving] = useState(false);
  const [gold, setGold] = useState(0);
  
  // Interaction State
  const [collectedTreasures, setCollectedTreasures] = useState<Treasure[]>([]);
  const [isDigging, setIsDigging] = useState(false);
  const [sysMessage, setSysMessage] = useState<string | null>(null);
  
  // Chest Minigame State
  const [openingChest, setOpeningChest] = useState<{x: number, y: number, remaining: number} | null>(null);
  const [foundTreasure, setFoundTreasure] = useState<Treasure | null>(null);
  // Loading State for API
  const [isGeneratingTreasure, setIsGeneratingTreasure] = useState(false);

  // Debug State
  const [fps, setFps] = useState(0);

  // Refs for loop
  const playerPosRef = useRef<Position>({ x: 0, y: 0 });
  const targetPosRef = useRef<Position | null>(null);
  const enemiesRef = useRef<Enemy[]>([]); 
  const frameCountRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  // Spawn Enemy Helper with weighted random types
  const spawnEnemy = (count: number, currentTiles: TileType[][], playerP: Position): Enemy[] => {
    const newEnemies: Enemy[] = [];
    const width = GAME_CONFIG.MAP_WIDTH;
    const height = GAME_CONFIG.MAP_HEIGHT;
    
    for (let i = 0; i < count; i++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 20) {
            attempts++;
            const ex = Math.floor(Math.random() * width);
            const ey = Math.floor(Math.random() * height);
            
            const dist = Math.sqrt(Math.pow(ex - playerP.x, 2) + Math.pow(ey - playerP.y, 2));
            const tile = currentTiles[ey][ex];
            
            if (tile !== TileType.WATER && tile !== TileType.ROCK && dist > 8) {
                const rand = Math.random();
                let type: EnemyTypeStr = 'SLIME';
                if (rand > 0.85) type = 'GHOST'; 
                else if (rand > 0.65) type = 'BAT'; 
                
                newEnemies.push({
                    id: crypto.randomUUID(),
                    x: ex,
                    y: ey,
                    type: type
                });
                placed = true;
            }
        }
    }
    return newEnemies;
  };

  // Initialize Game
  const startGame = useCallback(() => {
    const { tiles, startPos, treasureMap, enemies: initialEnemies } = generateMap(GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);
    setMapData({ tiles, treasureMap });
    
    setPlayerPos(startPos);
    playerPosRef.current = startPos;
    setTargetPos(null);
    targetPosRef.current = null;
    
    setEnemies(initialEnemies);
    enemiesRef.current = JSON.parse(JSON.stringify(initialEnemies));

    setGold(0);
    setCollectedTreasures([]);
    setTimeLeft(GAME_CONFIG.GAME_DURATION);
    setGameState(GameState.PLAYING);
    setSysMessage("マップをタップして移動、自分で穴掘り！");
    setTimeout(() => setSysMessage(null), 3000);
    setOpeningChest(null);
    setFoundTreasure(null);
    setIsGeneratingTreasure(false);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(GameState.TITLE);
  }, []);

  // Timer Effect
  useEffect(() => {
    let timer: number;
    // Only run timer if in PLAYING state and NOT generating treasure
    if (gameState === GameState.PLAYING && !isGeneratingTreasure) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState(GameState.TIME_UP);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, isGeneratingTreasure]);

  // Dig Logic
  const handleDig = async () => {
    if (!mapData || isDigging || gameState !== GameState.PLAYING) return;

    // Stop moving when digging
    setTargetPos(null);
    targetPosRef.current = null;
    setIsMoving(false);

    setIsDigging(true);
    
    // DELAY for animation (0.3s)
    setTimeout(async () => {
        const tileX = Math.round(playerPosRef.current.x);
        const tileY = Math.round(playerPosRef.current.y);

        if (tileY < 0 || tileY >= GAME_CONFIG.MAP_HEIGHT || tileX < 0 || tileX >= GAME_CONFIG.MAP_WIDTH) {
            setIsDigging(false);
            return;
        }

        const tileType = mapData.tiles[tileY][tileX];
        
        // Cannot dig hard surfaces, already dug holes, or treasure marks
        if (tileType === TileType.WATER || tileType === TileType.ROCK) {
            setSysMessage("ここは硬くて掘れないワン...");
            setIsDigging(false);
            setTimeout(() => setSysMessage(null), 1000);
            return;
        }
        
        if (tileType === TileType.HOLE || tileType === TileType.TREASURE_MARK) {
            setSysMessage("ここはもう掘ったワン...");
            setIsDigging(false);
            setTimeout(() => setSysMessage(null), 1000);
            return;
        }

        // Update Map
        const newTiles = mapData.tiles.map(row => [...row]);
        let newTreasureMap = mapData.treasureMap;

        if (mapData.treasureMap[tileY][tileX]) {
            // Found Treasure! Mark it on map.
            // Do NOT collect yet. User must tap it.
            newTiles[tileY][tileX] = TileType.TREASURE_MARK;
            setMapData({ tiles: newTiles, treasureMap: newTreasureMap }); 

            // Remove from hidden map so it doesn't trigger again
            newTreasureMap = mapData.treasureMap.map(row => [...row]);
            newTreasureMap[tileY][tileX] = false;
            
            setSysMessage("！！何か埋まっているワン！！");
            setTimeout(() => setSysMessage(null), 2000);
            
        } else {
            // Just a hole
            newTiles[tileY][tileX] = TileType.HOLE;
            setMapData({ ...mapData, tiles: newTiles });
        }

        setIsDigging(false);
    }, 300); // 300ms delay matches animation
  };

  const handleChestTap = async (tx: number, ty: number) => {
    if (!mapData) return;

    // Initialize tap counter if not started
    if (!openingChest || openingChest.x !== tx || openingChest.y !== ty) {
        const requiredTaps = Math.floor(Math.random() * 6) + 5; // 5 to 10
        setOpeningChest({ x: tx, y: ty, remaining: requiredTaps - 1 });
        return;
    }

    // Decrement
    const newRemaining = openingChest.remaining - 1;
    
    if (newRemaining <= 0) {
        // OPENED!
        setOpeningChest(null);
        
        // Start Loading Animation (Pauses Timer via useEffect)
        setIsGeneratingTreasure(true);

        try {
            const treasure = await generateTreasure();
            setFoundTreasure(treasure);
            setCollectedTreasures(prev => [...prev, treasure]);
            setGold(prev => prev + treasure.value);
            
            // Show result dialog (This state also pauses timer)
            setGameState(GameState.TREASURE_FOUND);

            // Turn the chest into a hole
            const newTiles = mapData.tiles.map(row => [...row]);
            newTiles[ty][tx] = TileType.HOLE;
            setMapData(prev => prev ? ({ ...prev, tiles: newTiles }) : null);

        } catch (e) {
            setGameState(GameState.PLAYING);
            setSysMessage("...中身は空っぽだったワン");
            setTimeout(() => setSysMessage(null), 1500);
        } finally {
            setIsGeneratingTreasure(false);
        }
    } else {
        setOpeningChest({ ...openingChest, remaining: newRemaining });
    }
  };

  const closeTreasureDialog = () => {
      setFoundTreasure(null);
      setGameState(GameState.PLAYING);
  };

  // Handle Tap Interaction (Move or Dig or Chest)
  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    // Allow tapping only when playing (treasure dialog blocks interactions via overlay)
    // Also block interaction if generating treasure
    if (gameState !== GameState.PLAYING || isGeneratingTreasure) return;
    if (isDigging) return; // Ignore input while digging animation

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const dxPx = clientX - centerX;
    const dyPx = clientY - centerY;
    
    const dxTiles = dxPx / GAME_CONFIG.TILE_SIZE;
    const dyTiles = dyPx / GAME_CONFIG.TILE_SIZE;
    
    // Exact tile clicked (Adjust for 0.5 center offset of player view)
    const clickedTileX = Math.floor(playerPosRef.current.x + 0.5 + dxTiles);
    const clickedTileY = Math.floor(playerPosRef.current.y + 0.5 + dyTiles);

    // Check if clicked on a visible Treasure Mark
    if (
        clickedTileX >= 0 && clickedTileX < GAME_CONFIG.MAP_WIDTH &&
        clickedTileY >= 0 && clickedTileY < GAME_CONFIG.MAP_HEIGHT &&
        mapData?.tiles[clickedTileY][clickedTileX] === TileType.TREASURE_MARK
    ) {
        // Stop movement if any
        setTargetPos(null);
        targetPosRef.current = null;
        setIsMoving(false);
        
        handleChestTap(clickedTileX, clickedTileY);
        return;
    }
    
    // Normal Move/Dig logic
    const worldX = playerPosRef.current.x + dxTiles;
    const worldY = playerPosRef.current.y + dyTiles;
    
    // Check if tap is close to player (Self-Tap for Digging)
    const distToPlayer = Math.sqrt(dxTiles * dxTiles + dyTiles * dyTiles);
    
    if (distToPlayer < 0.8) {
        handleDig();
    } else {
        // Move
        const clampedX = Math.max(0, Math.min(GAME_CONFIG.MAP_WIDTH - 0.1, worldX));
        const clampedY = Math.max(0, Math.min(GAME_CONFIG.MAP_HEIGHT - 0.1, worldY));
        
        const newTarget = { x: clampedX, y: clampedY };
        setTargetPos(newTarget);
        targetPosRef.current = newTarget;
        setIsMoving(true);
        // Clear chest interaction if moving away
        setOpeningChest(null);
    }
  }, [gameState, mapData, isDigging, openingChest, isGeneratingTreasure]);

  // Game Loop
  const update = useCallback((time: number) => {
    if (gameState !== GameState.PLAYING) {
      animationFrameRef.current = requestAnimationFrame(update);
      return;
    }

    // FPS Calculation
    frameCountRef.current++;
    if (time - lastFpsTimeRef.current >= 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      lastFpsTimeRef.current = time;
    }

    // --- Player Movement Logic (Tap to Move) ---
    // Stop moving if generating treasure
    if (targetPosRef.current && !isDigging && !isGeneratingTreasure) {
        const dx = targetPosRef.current.x - playerPosRef.current.x;
        const dy = targetPosRef.current.y - playerPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Stop if reached target
        if (dist < 0.1) {
            targetPosRef.current = null;
            setTargetPos(null);
            setIsMoving(false);
        } else {
            // Move towards target
            const speed = GAME_CONFIG.PLAYER_SPEED;
            const vx = (dx / dist) * speed;
            const vy = (dy / dist) * speed;
            
            if (Math.abs(vx) > Math.abs(vy)) {
              setDirection(vx > 0 ? Direction.RIGHT : Direction.LEFT);
            } else {
              setDirection(vy > 0 ? Direction.DOWN : Direction.UP);
            }

            const nextX = playerPosRef.current.x + vx;
            const nextY = playerPosRef.current.y + vy;

            const checkCollision = (x: number, y: number) => {
                if (!mapData) return true;
                const tx = Math.floor(x + 0.5);
                const ty = Math.floor(y + 0.5);
                if (tx < 0 || tx >= GAME_CONFIG.MAP_WIDTH || ty < 0 || ty >= GAME_CONFIG.MAP_HEIGHT) return true;
                const tile = mapData.tiles[ty][tx];
                return tile === TileType.ROCK || tile === TileType.WATER;
            };

            let moved = false;
            if (!checkCollision(nextX, playerPosRef.current.y)) {
                playerPosRef.current.x = nextX;
                moved = true;
            }
            if (!checkCollision(playerPosRef.current.x, nextY)) {
                playerPosRef.current.y = nextY;
                moved = true;
            }
            
            if (!moved) {
                targetPosRef.current = null;
                setTargetPos(null);
                setIsMoving(false);
            }

            setPlayerPos({ x: playerPosRef.current.x, y: playerPosRef.current.y });
        }
    }

    // --- Enemy Logic ---
    // Pause enemies if generating treasure
    if (mapData && !isGeneratingTreasure) {
        let currentEnemies = [...enemiesRef.current];
        let tilesChanged = false;
        const newTiles = mapData.tiles.map(row => [...row]);

        const spawnedEnemies: Enemy[] = [];

        currentEnemies = currentEnemies.filter(enemy => {
            const stats = ENEMY_STATS[enemy.type];

            // 1. Trap Check
            const tx = Math.round(enemy.x);
            const ty = Math.round(enemy.y);
            
            if (tx >= 0 && tx < GAME_CONFIG.MAP_WIDTH && ty >= 0 && ty < GAME_CONFIG.MAP_HEIGHT) {
                if (newTiles[ty][tx] === TileType.HOLE && !stats.flying) {
                    newTiles[ty][tx] = TileType.DIRT;
                    tilesChanged = true;
                    const newSpawns = spawnEnemy(1, newTiles, playerPosRef.current);
                    spawnedEnemies.push(...newSpawns);
                    return false;
                }
            }

            // 2. Collision with Player
            const dx = playerPosRef.current.x - enemy.x;
            const dy = playerPosRef.current.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.6) { 
                setGameState(GameState.GAME_OVER);
                return true;
            }

            // 3. Movement
            if (dist > 30) return true; 

            let moveX = 0;
            let moveY = 0;

            if (dist < stats.range) {
                moveX = (dx / dist) * stats.speed;
                moveY = (dy / dist) * stats.speed;
            } else {
                if (Math.random() < 0.05) {
                   moveX = (Math.random() - 0.5) * stats.speed * 3;
                   moveY = (Math.random() - 0.5) * stats.speed * 3;
                }
            }

            const nextEX = enemy.x + moveX;
            const nextEY = enemy.y + moveY;
            
            const checkEnemyWall = (x: number, y: number) => {
                 const tX = Math.round(x);
                 const tY = Math.round(y);
                 if (tX < 0 || tX >= GAME_CONFIG.MAP_WIDTH || tY < 0 || tY >= GAME_CONFIG.MAP_HEIGHT) return true;
                 if (stats.ghost) return false;
                 const tile = newTiles[tY][tX];
                 if (stats.flying) return tile === TileType.ROCK;
                 return tile === TileType.ROCK || tile === TileType.WATER;
            };

            if (!checkEnemyWall(nextEX, enemy.y)) enemy.x = nextEX;
            if (!checkEnemyWall(enemy.x, nextEY)) enemy.y = nextEY;

            return true;
        });

        if (spawnedEnemies.length > 0) {
            currentEnemies = [...currentEnemies, ...spawnedEnemies];
            if (!sysMessage) {
                setSysMessage(`敵が現れた！`);
                setTimeout(() => setSysMessage(null), 1000);
            }
        }

        enemiesRef.current = currentEnemies;
        setEnemies(currentEnemies);

        if (tilesChanged) {
            setMapData({ ...mapData, tiles: newTiles });
        }
    }

    animationFrameRef.current = requestAnimationFrame(update);
  }, [gameState, mapData, sysMessage, isDigging, isGeneratingTreasure]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(update);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [update]);

  return {
    gameState,
    timeLeft,
    mapData,
    playerPos,
    targetPos,
    enemies,
    direction,
    isMoving,
    gold,
    collectedTreasures,
    isDigging,
    sysMessage,
    openingChest,
    foundTreasure,
    isGeneratingTreasure,
    fps,
    startGame,
    resetGame,
    handleInteraction,
    handleDig,
    closeTreasureDialog
  };
};