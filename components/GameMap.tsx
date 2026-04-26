import React, { useMemo, useCallback, useRef, useEffect, memo } from 'react';
import { TileType, Position, Direction, Enemy as EnemyType } from '../types';
import { GAME_CONFIG } from '../constants';
import Chihuahua from './Chihuahua';
import Enemy from './Enemy';
import { Shovel } from 'lucide-react';

interface GameMapProps {
  tiles: TileType[][];
  playerPos: Position;
  cameraPos: Position;
  direction: Direction;
  isMoving: boolean;
  isDigging: boolean;
  enemies: EnemyType[];
  onInteract: (clientX: number, clientY: number) => void;
  targetPos: Position | null;
  currentPath?: Position[];
  panCamera: (dx: number, dy: number) => void;
  isPendingDig?: boolean;
  isDefeated?: boolean;
}

const getTileClass = (type: TileType) => {
  switch(type) {
    case TileType.GRASS: return 'tile-grass';
    case TileType.DIRT: return 'tile-dirt';
    case TileType.WATER: return 'tile-water';
    case TileType.ROCK: return 'tile-rock';
    case TileType.SAND: return 'tile-sand';
    case TileType.HOLE: return 'tile-hole';
    case TileType.TREASURE_MARK: return 'tile-treasure-mark';
    default: return '';
  }
};


const StaticCanvasMap = memo(({ tiles, tileSize }: { tiles: TileType[][], tileSize: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < GAME_CONFIG.MAP_HEIGHT; y++) {
            for (let x = 0; x < GAME_CONFIG.MAP_WIDTH; x++) {
                const type = tiles[y]?.[x];
                if (type === undefined) continue;
                
                // Draw manual pixel art to match CSS
                if (type === TileType.WATER) {
                    ctx.fillStyle = '#3b82f6';
                    ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
                } else if (type === TileType.GRASS) {
                    ctx.fillStyle = '#4ade80';
                    ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
                    // checkerboard
                    ctx.fillStyle = 'rgba(0,0,0,0.05)';
                    ctx.fillRect(x*tileSize, y*tileSize, tileSize/2, tileSize/2);
                    ctx.fillRect(x*tileSize + tileSize/2, y*tileSize + tileSize/2, tileSize/2, tileSize/2);
                } else if (type === TileType.DIRT) {
                    ctx.fillStyle = '#a16207';
                    ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
                    // dirt marks
                    ctx.fillStyle = '#713f12';
                    ctx.fillRect(x*tileSize + 6, y*tileSize + 6, 4, 4);
                    ctx.fillRect(x*tileSize + 18, y*tileSize + 20, 6, 6);
                    ctx.fillRect(x*tileSize + 30, y*tileSize + 8, 4, 4);
                } else if (type === TileType.ROCK) {
                    ctx.fillStyle = '#4b5563';
                    ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
                    ctx.strokeStyle = '#374151';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x*tileSize+1, y*tileSize+1, tileSize-2, tileSize-2);
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.beginPath();
                    ctx.moveTo(x*tileSize, y*tileSize);
                    ctx.lineTo(x*tileSize + tileSize, y*tileSize);
                    ctx.lineTo(x*tileSize, y*tileSize + tileSize);
                    ctx.fill();
                } else if (type === TileType.SAND) {
                    ctx.fillStyle = '#fde047';
                    ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
                    ctx.fillStyle = '#d97706';
                    ctx.fillRect(x*tileSize + 8, y*tileSize + 8, 3, 3);
                    ctx.fillRect(x*tileSize + 24, y*tileSize + 30, 3, 3);
                    ctx.fillRect(x*tileSize + 36, y*tileSize + 16, 3, 3);
                } else if (type === TileType.HOLE) {
                    ctx.fillStyle = '#291d15';
                    ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
                    ctx.fillStyle = 'rgba(0,0,0,0.7)';
                    ctx.fillRect(x*tileSize + 4, y*tileSize + 4, tileSize - 8, tileSize - 8);
                } else if (type === TileType.TREASURE_MARK) {
                     // Draw dirt floor under treasure mark
                     ctx.fillStyle = '#b45309';
                     ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
                     ctx.strokeStyle = '#fcd34d';
                     ctx.lineWidth = 2;
                     ctx.strokeRect(x*tileSize+1, y*tileSize+1, tileSize-2, tileSize-2);
                }
            }
        }
    }, [tiles, tileSize]);

    return (
        <canvas
            ref={canvasRef}
            width={GAME_CONFIG.MAP_WIDTH * tileSize}
            height={GAME_CONFIG.MAP_HEIGHT * tileSize}
            className="absolute top-0 left-0"
        />
    )
});

const GameMap: React.FC<GameMapProps> = ({ 
    tiles, 
    playerPos, 
    cameraPos,
    direction, 
    isMoving, 
    isDigging, 
    enemies, 
    onInteract,
    targetPos,
    currentPath = [], // Added
    panCamera,
    isPendingDig = false,
    isDefeated = false
}) => {
  const tileSize = GAME_CONFIG.TILE_SIZE;
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag State Refs
  const dragRef = useRef({
      isDown: false,
      isDragging: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      isMultiTouch: false
  });

  // Calculate viewport based on CAMERA position
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Viewport Culling
  const viewportWidthTiles = Math.ceil(window.innerWidth / tileSize);
  const viewportHeightTiles = Math.ceil(window.innerHeight / tileSize);
  const buffer = 2; 
  
  const startX = Math.max(0, Math.floor(cameraPos.x - viewportWidthTiles / 2) - buffer);
  const endX = Math.min(GAME_CONFIG.MAP_WIDTH, Math.ceil(cameraPos.x + viewportWidthTiles / 2) + buffer);
  const startY = Math.max(0, Math.floor(cameraPos.y - viewportHeightTiles / 2) - buffer);
  const endY = Math.min(GAME_CONFIG.MAP_HEIGHT, Math.ceil(cameraPos.y + viewportHeightTiles / 2) + buffer);

  const treasureMarkers = useMemo(() => {
    const markers = [];
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (tiles[y]?.[x] === TileType.TREASURE_MARK) {
            markers.push(
               <div
                key={`mark-${x}-${y}`}
                className="absolute"
                style={{
                  width: tileSize,
                  height: tileSize,
                  transform: `translate3d(${x * tileSize}px, ${y * tileSize}px, 0)`,
                }}
              >
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold rounded-full border-2 border-red-500 text-red-500 animate-pulse">
                    X
                  </span>
               </div>
            );
        }
      }
    }
    return markers;
  }, [tiles, startX, endX, startY, endY, tileSize]);


  // Determine display target (final destination)
  const displayTarget = useMemo(() => {
      if (currentPath && currentPath.length > 0) {
          return currentPath[currentPath.length - 1];
      }
      return targetPos;
  }, [currentPath, targetPos]);

  const mapContainerStyle = {
    transform: `translate3d(
      ${-cameraPos.x * tileSize + centerX - tileSize / 2}px, 
      ${-cameraPos.y * tileSize + centerY - tileSize / 2}px, 
      0
    )`,
  };

  // --- Event Handling Implementation ---
  
  const handleStart = useCallback((clientX: number, clientY: number, isMulti: boolean) => {
      // Disable interaction if defeated
      if (isDefeated) return;

      dragRef.current = {
          isDown: true,
          isDragging: isMulti, // If multi-touch, start dragging immediately
          startX: clientX,
          startY: clientY,
          lastX: clientX,
          lastY: clientY,
          isMultiTouch: isMulti
      };
  }, [isDefeated]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
      if (!dragRef.current.isDown) return;

      const dx = clientX - dragRef.current.lastX;
      const dy = clientY - dragRef.current.lastY;

      // Check threshold if not yet dragging
      if (!dragRef.current.isDragging) {
          const totalDx = clientX - dragRef.current.startX;
          const totalDy = clientY - dragRef.current.startY;
          if (Math.sqrt(totalDx * totalDx + totalDy * totalDy) > 10) {
              dragRef.current.isDragging = true;
          }
      }

      if (dragRef.current.isDragging) {
          panCamera(dx, dy);
      }

      dragRef.current.lastX = clientX;
      dragRef.current.lastY = clientY;
  }, [panCamera]);

  const handleEnd = useCallback(() => {
      if (dragRef.current.isDown && !dragRef.current.isDragging) {
          // Tap detected
          onInteract(dragRef.current.startX, dragRef.current.startY);
      }
      dragRef.current.isDown = false;
      dragRef.current.isDragging = false;
      dragRef.current.isMultiTouch = false;
  }, [onInteract]);


  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
        const isMulti = e.touches.length >= 2;
        handleStart(e.touches[0].clientX, e.touches[0].clientY, isMulti);
    };

    const onTouchMove = (e: TouchEvent) => {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchEnd = (e: TouchEvent) => {
        if (e.touches.length === 0) {
            handleEnd();
        }
    };

    const onMouseDown = (e: MouseEvent) => {
        handleStart(e.clientX, e.clientY, false);
    };
    const onMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX, e.clientY);
    };
    const onMouseUp = () => {
        handleEnd();
    };
    const onMouseLeave = () => {
        dragRef.current.isDown = false;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchmove', onTouchMove);
        el.removeEventListener('touchend', onTouchEnd);
        el.removeEventListener('mousedown', onMouseDown);
        el.removeEventListener('mousemove', onMouseMove);
        el.removeEventListener('mouseup', onMouseUp);
        el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [handleStart, handleMove, handleEnd]);


  return (
    <div 
        ref={containerRef}
        className="absolute inset-0 overflow-hidden bg-black touch-none"
    >
      {/* Map Container */}
      <div 
        className="absolute top-0 left-0 map-container will-change-transform"
        style={mapContainerStyle}
      >
        <StaticCanvasMap tiles={tiles} tileSize={tileSize} />
        {treasureMarkers}

        {displayTarget && (
             <div 
                className={`absolute pointer-events-none z-10 target-marker ${isPendingDig ? 'text-yellow-400' : 'text-white'}`}
                style={{
                    left: displayTarget.x * tileSize,
                    top: displayTarget.y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
             >
                {isPendingDig && (
                    <Shovel size={24} className="drop-shadow-md animate-bounce" />
                )}
             </div>
        )}

        {enemies.map((enemy) => {
          if (enemy.x < startX || enemy.x > endX || enemy.y < startY || enemy.y > endY) {
            return null;
          }
          return (
            <div
              key={enemy.id}
              className="absolute z-10 transition-transform duration-100 linear will-change-transform"
              style={{
                width: tileSize,
                height: tileSize,
                transform: `translate3d(${enemy.x * tileSize}px, ${enemy.y * tileSize}px, 0)`
              }}
            >
              <Enemy enemy={enemy} />
            </div>
          );
        })}

        <div 
          className="absolute z-20 pointer-events-none transition-transform duration-100 linear will-change-transform"
          style={{
            width: tileSize,
            height: tileSize,
            transform: `translate3d(${playerPos.x * tileSize}px, ${playerPos.y * tileSize}px, 0)`
          }}
        >
          <Chihuahua direction={direction} isMoving={isMoving} isDigging={isDigging} isDefeated={isDefeated} />
        </div>

      </div>

      {/* Game Over Text Overlay */}
      {isDefeated && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-black/40 animate-fade-in-slow">
              <h1 className="text-6xl md:text-8xl font-bold text-red-600 pixel-text-shadow tracking-tighter animate-bounce-in">
                  GAME OVER
              </h1>
              <style>{`
                  @keyframes fade-in-slow {
                      0% { opacity: 0; }
                      100% { opacity: 1; }
                  }
                  .animate-fade-in-slow {
                      animation: fade-in-slow 1s ease-out forwards;
                  }
              `}</style>
          </div>
      )}
    </div>
  );
};

export default GameMap;