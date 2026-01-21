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
  const [cameraPos, setCameraPos] = useState<Position>({ x: 0, y: 0 }); // Camera center position
  const [targetPos, setTargetPos] = useState<Position | null>(null); 
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  
  const [direction, setDirection] = useState<Direction>(Direction.DOWN);
  const [isMoving, setIsMoving] = useState(false);
  const [gold, setGold] = useState(0);
  
  // Interaction State
  const [collectedTreasures, setCollectedTreasures] = useState<Treasure[]>([]);
  const [isDigging, setIsDigging] = useState(false);
  const [sysMessage, setSysMessage] = useState<string | null>(null);
  const [isPendingDig, setIsPendingDig] = useState(false); // UI表示用
  
  // Treasure State
  const [foundTreasure, setFoundTreasure] = useState<Treasure | null>(null);
  // Loading State for API / Animation
  const [isGeneratingTreasure, setIsGeneratingTreasure] = useState(false);

  // Persistent Treasure Book State
  const [discoveredCatalogIds, setDiscoveredCatalogIds] = useState<number[]>([]);

  // Debug State
  const [fps, setFps] = useState(0);

  // Refs for loop
  const mapDataRef = useRef<{ tiles: TileType[][], treasureMap: boolean[][] } | null>(null);
  const playerPosRef = useRef<Position>({ x: 0, y: 0 });
  const cameraPosRef = useRef<Position>({ x: 0, y: 0 });
  const targetPosRef = useRef<Position | null>(null);
  const enemiesRef = useRef<Enemy[]>([]); 
  const frameCountRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  
  // Dig Pending Ref (Move then Dig) - Logic sync
  const pendingDigRef = useRef<boolean>(false);

  // Sync mapDataRef with state
  useEffect(() => {
    mapDataRef.current = mapData;
  }, [mapData]);

  // Load Discovered Treasures from LocalStorage
  useEffect(() => {
    try {
        const saved = localStorage.getItem('chihuahua_quest_book');
        if (saved) {
            setDiscoveredCatalogIds(JSON.parse(saved));
        }
    } catch (e) {
        console.error("Failed to load treasure book", e);
    }
  }, []);

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
                else if (rand > 0.65) type = 'SNAKE'; 
                
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
    const initialMapData = { tiles, treasureMap };
    setMapData(initialMapData);
    mapDataRef.current = initialMapData; // Immediately sync ref
    
    setPlayerPos(startPos);
    playerPosRef.current = startPos;
    
    setCameraPos(startPos);
    cameraPosRef.current = startPos;

    setTargetPos(null);
    targetPosRef.current = null;
    
    setEnemies(initialEnemies);
    enemiesRef.current = JSON.parse(JSON.stringify(initialEnemies));

    setGold(0);
    setCollectedTreasures([]);
    setTimeLeft(GAME_CONFIG.GAME_DURATION);
    setGameState(GameState.PLAYING);
    setSysMessage("マップをタップして移動＆穴掘り！");
    setTimeout(() => setSysMessage(null), 3000);
    setFoundTreasure(null);
    setIsGeneratingTreasure(false);
    pendingDigRef.current = false;
    setIsPendingDig(false);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(GameState.TITLE);
  }, []);

  const openTreasureBook = useCallback(() => {
    setGameState(GameState.TREASURE_BOOK);
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
    if (!mapDataRef.current || isDigging || gameState !== GameState.PLAYING) return;

    // Stop moving when digging
    setTargetPos(null);
    targetPosRef.current = null;
    setIsMoving(false);
    pendingDigRef.current = false; // Clear pending
    setIsPendingDig(false);

    setIsDigging(true);
    
    // DELAY for animation (0.3s)
    setTimeout(async () => {
        // Use Ref to get the LATEST map data
        const currentMapData = mapDataRef.current;
        if (!currentMapData) {
            setIsDigging(false);
            return;
        }

        const tileX = Math.round(playerPosRef.current.x);
        const tileY = Math.round(playerPosRef.current.y);

        if (tileY < 0 || tileY >= GAME_CONFIG.MAP_HEIGHT || tileX < 0 || tileX >= GAME_CONFIG.MAP_WIDTH) {
            setIsDigging(false);
            return;
        }

        const tileType = currentMapData.tiles[tileY][tileX];
        
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

        // Update Map - Always turns to hole
        const newTiles = currentMapData.tiles.map(row => [...row]);
        newTiles[tileY][tileX] = TileType.HOLE;
        
        // Check for Treasure
        if (currentMapData.treasureMap[tileY][tileX]) {
            // Found Treasure! 
            // Remove from hidden map
            const newTreasureMap = currentMapData.treasureMap.map(row => [...row]);
            newTreasureMap[tileY][tileX] = false;
            
            // Update map state
            setMapData({ tiles: newTiles, treasureMap: newTreasureMap }); 
            
            // Stop digging animation and start treasure generation
            setIsDigging(false);
            setIsGeneratingTreasure(true);

            try {
                const treasure = await generateTreasure();
                setFoundTreasure(treasure);
                setCollectedTreasures(prev => [...prev, treasure]);
                setGold(prev => prev + treasure.value);

                // Update Discovery Book
                setDiscoveredCatalogIds(prev => {
                    if (!prev.includes(treasure.catalogId)) {
                        const newIds = [...prev, treasure.catalogId];
                        localStorage.setItem('chihuahua_quest_book', JSON.stringify(newIds));
                        return newIds;
                    }
                    return prev;
                });
                
                // Show result dialog
                setGameState(GameState.TREASURE_FOUND);
            } catch (e) {
                setGameState(GameState.PLAYING);
                setSysMessage("...何かあったようだが消えてしまったワン");
                setTimeout(() => setSysMessage(null), 1500);
            } finally {
                setIsGeneratingTreasure(false);
            }
            
        } else {
            // Just a hole
            setMapData({ ...currentMapData, tiles: newTiles });
            setIsDigging(false);
        }

    }, 300); // 300ms delay matches animation
  };

  const closeTreasureDialog = () => {
      setFoundTreasure(null);
      setGameState(GameState.PLAYING);
  };

  // Manual Camera Pan
  const panCamera = useCallback((deltaXPixels: number, deltaYPixels: number) => {
    const deltaTilesX = deltaXPixels / GAME_CONFIG.TILE_SIZE;
    const deltaTilesY = deltaYPixels / GAME_CONFIG.TILE_SIZE;

    let newX = cameraPosRef.current.x - deltaTilesX;
    let newY = cameraPosRef.current.y - deltaTilesY;

    // Clamp to map bounds
    const vpW = window.innerWidth / GAME_CONFIG.TILE_SIZE;
    const vpH = window.innerHeight / GAME_CONFIG.TILE_SIZE;
    
    const minCamX = vpW / 2 - 0.5;
    const maxCamX = GAME_CONFIG.MAP_WIDTH - vpW / 2 + 0.5;
    const minCamY = vpH / 2 - 0.5;
    const maxCamY = GAME_CONFIG.MAP_HEIGHT - vpH / 2 + 0.5;

    if (GAME_CONFIG.MAP_WIDTH > vpW) {
        newX = Math.max(minCamX, Math.min(maxCamX, newX));
    } else {
        newX = GAME_CONFIG.MAP_WIDTH / 2;
    }
    
    if (GAME_CONFIG.MAP_HEIGHT > vpH) {
        newY = Math.max(minCamY, Math.min(maxCamY, newY));
    } else {
        newY = GAME_CONFIG.MAP_HEIGHT / 2;
    }

    cameraPosRef.current = { x: newX, y: newY };
    setCameraPos({ x: newX, y: newY });
  }, []);

  // Handle Tap Interaction (Move or Dig)
  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    if (gameState !== GameState.PLAYING || isGeneratingTreasure) return;
    if (isDigging) return;

    // Adjust interaction coordinates based on Camera position
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const worldXPx = clientX + (cameraPosRef.current.x * GAME_CONFIG.TILE_SIZE) - centerX;
    const worldYPx = clientY + (cameraPosRef.current.y * GAME_CONFIG.TILE_SIZE) - centerY;
    
    const worldX = worldXPx / GAME_CONFIG.TILE_SIZE;
    const worldY = worldYPx / GAME_CONFIG.TILE_SIZE;
    
    // Check if tap is close to player (Self-Tap for Digging)
    const distToPlayer = Math.sqrt(Math.pow(worldX - playerPosRef.current.x, 2) + Math.pow(worldY - playerPosRef.current.y, 2));
    
    if (distToPlayer < 0.8) {
        handleDig();
        return; // Priority exit
    } 

    // New move target logic: Always move AND pending Dig
    const clampedX = Math.max(0, Math.min(GAME_CONFIG.MAP_WIDTH - 0.1, worldX));
    const clampedY = Math.max(0, Math.min(GAME_CONFIG.MAP_HEIGHT - 0.1, worldY));
    
    const newTarget = { x: clampedX, y: clampedY };
    setTargetPos(newTarget);
    targetPosRef.current = newTarget;
    setIsMoving(true);
    
    // Always pending dig on move
    pendingDigRef.current = true;
    setIsPendingDig(true);

  }, [gameState, isDigging, isGeneratingTreasure]);

  // Game Loop
  const update = useCallback((time: number) => {
    // If we are DYING, just render loop (camera updates etc if needed), but skip physics
    if (gameState === GameState.DYING) {
        // Just in case we want to render animations, we request frame but do no logic
        animationFrameRef.current = requestAnimationFrame(update);
        return;
    }

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
    // Only move camera automatically if player is moving
    const isPlayerMoving = !!targetPosRef.current;

    if (targetPosRef.current && !isDigging && !isGeneratingTreasure) {
        const dx = targetPosRef.current.x - playerPosRef.current.x;
        const dy = targetPosRef.current.y - playerPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Stop if reached target
        if (dist < 0.1) {
            // Reached destination!
            const wasPendingDig = pendingDigRef.current;
            
            targetPosRef.current = null;
            setTargetPos(null);
            setIsMoving(false);
            pendingDigRef.current = false; // Reset
            setIsPendingDig(false);

            if (wasPendingDig) {
                // If dig was pending, trigger it now
                handleDig();
            }

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
                const currentMapData = mapDataRef.current;
                if (!currentMapData) return true;
                const tx = Math.floor(x + 0.5); // Center check
                const ty = Math.floor(y + 0.5);
                if (tx < 0 || tx >= GAME_CONFIG.MAP_WIDTH || ty < 0 || ty >= GAME_CONFIG.MAP_HEIGHT) return true;
                const tile = currentMapData.tiles[ty][tx];
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
                pendingDigRef.current = false;
                setIsPendingDig(false);
            }

            setPlayerPos({ x: playerPosRef.current.x, y: playerPosRef.current.y });
        }
    }

    // --- Camera Update (Auto Follow / Deadzone Logic) ---
    if (isPlayerMoving) {
        const vpW = window.innerWidth / GAME_CONFIG.TILE_SIZE;
        const vpH = window.innerHeight / GAME_CONFIG.TILE_SIZE;
        
        const marginX = Math.min(3, vpW * 0.25);
        const marginY = Math.min(4, vpH * 0.25);
        
        const thresholdX = (vpW / 2) - marginX;
        const thresholdY = (vpH / 2) - marginY;

        let newCamX = cameraPosRef.current.x;
        let newCamY = cameraPosRef.current.y;
        
        const diffX = playerPosRef.current.x - newCamX;
        const diffY = playerPosRef.current.y - newCamY;
        
        if (diffX > thresholdX) newCamX += (diffX - thresholdX);
        if (diffX < -thresholdX) newCamX += (diffX + thresholdX);
        
        if (diffY > thresholdY) newCamY += (diffY - thresholdY);
        if (diffY < -thresholdY) newCamY += (diffY + thresholdY);
        
        // Clamp
        const minCamX = vpW / 2 - 0.5;
        const maxCamX = GAME_CONFIG.MAP_WIDTH - vpW / 2 + 0.5;
        const minCamY = vpH / 2 - 0.5;
        const maxCamY = GAME_CONFIG.MAP_HEIGHT - vpH / 2 + 0.5;

        if (GAME_CONFIG.MAP_WIDTH > vpW) {
            newCamX = Math.max(minCamX, Math.min(maxCamX, newCamX));
        }
        if (GAME_CONFIG.MAP_HEIGHT > vpH) {
            newCamY = Math.max(minCamY, Math.min(maxCamY, newCamY));
        }

        cameraPosRef.current = { x: newCamX, y: newCamY };
        setCameraPos({ x: newCamX, y: newCamY });
    }


    // --- Enemy Logic ---
    if (mapDataRef.current && !isGeneratingTreasure) {
        let currentEnemies = [...enemiesRef.current];
        let tilesChanged = false;
        // Use Ref for source of truth to avoid stale state
        const currentTilesOriginal = mapDataRef.current.tiles;
        const newTiles = currentTilesOriginal.map(row => [...row]);

        const spawnedEnemies: Enemy[] = [];

        currentEnemies = currentEnemies.filter(enemy => {
            const stats = ENEMY_STATS[enemy.type];

            // 1. Trap Check
            const tx = Math.round(enemy.x);
            const ty = Math.round(enemy.y);
            
            if (tx >= 0 && tx < GAME_CONFIG.MAP_WIDTH && ty >= 0 && ty < GAME_CONFIG.MAP_HEIGHT) {
                // Check against newTiles in case multiple enemies fall in same frame (rare but possible)
                if (newTiles[ty][tx] === TileType.HOLE && !stats.flying) {
                    // Turn HOLE into ROCK
                    newTiles[ty][tx] = TileType.ROCK;
                    tilesChanged = true;
                    
                    const newSpawns = spawnEnemy(1, newTiles, playerPosRef.current);
                    spawnedEnemies.push(...newSpawns);
                    
                    setSysMessage(`敵を倒した！`);
                    setTimeout(() => setSysMessage(null), 1000);
                    
                    // --- EMERGENCY UNSTUCK LOGIC ---
                    const px = Math.round(playerPosRef.current.x);
                    const py = Math.round(playerPosRef.current.y);
                    if (px === tx && py === ty) {
                        const neighbors = [
                            { x: px, y: py - 1 }, // Up
                            { x: px, y: py + 1 }, // Down
                            { x: px - 1, y: py }, // Left
                            { x: px + 1, y: py }  // Right
                        ];
                        // Find first safe neighbor
                        const safeSpot = neighbors.find(n => {
                            if (n.x < 0 || n.x >= GAME_CONFIG.MAP_WIDTH || n.y < 0 || n.y >= GAME_CONFIG.MAP_HEIGHT) return false;
                            const t = newTiles[n.y][n.x];
                            return t !== TileType.ROCK && t !== TileType.WATER;
                        });

                        if (safeSpot) {
                            playerPosRef.current = { x: safeSpot.x, y: safeSpot.y };
                            setPlayerPos({ x: safeSpot.x, y: safeSpot.y });
                            targetPosRef.current = null;
                            setTargetPos(null);
                            setIsMoving(false);
                            pendingDigRef.current = false;
                            setIsPendingDig(false);
                        }
                    }
                    // -------------------------------

                    return false; // Remove old enemy
                }
            }

            // 2. Collision with Player
            const dx = playerPosRef.current.x - enemy.x;
            const dy = playerPosRef.current.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.6) { 
                // HIT! Enter DYING state instead of GAME_OVER directly
                setGameState(GameState.DYING);
                
                // Stop movement
                setIsMoving(false);
                setTargetPos(null);
                targetPosRef.current = null;
                
                // Transition to results after animation
                setTimeout(() => {
                    setGameState(GameState.GAME_OVER);
                }, 2500);

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
                 // Use newTiles for wall checking to reflect immediate changes
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
        }

        enemiesRef.current = currentEnemies;
        setEnemies(currentEnemies);

        if (tilesChanged && mapDataRef.current) {
            setMapData({ ...mapDataRef.current, tiles: newTiles });
        }
    }

    animationFrameRef.current = requestAnimationFrame(update);
  }, [gameState, isDigging, isGeneratingTreasure]); // removed mapData from dependency

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
    cameraPos,
    targetPos,
    enemies,
    direction,
    isMoving,
    gold,
    collectedTreasures,
    isDigging,
    sysMessage,
    foundTreasure,
    isGeneratingTreasure,
    fps,
    discoveredCatalogIds,
    isPendingDig,
    startGame,
    resetGame,
    openTreasureBook,
    handleInteraction,
    handleDig,
    closeTreasureDialog,
    panCamera
  };
};