import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { TileType, Position, Direction, Enemy as EnemyType } from '../types';
import { GAME_CONFIG } from '../constants';
import Chihuahua from './Chihuahua';
import Enemy from './Enemy';
import { X, Shovel } from 'lucide-react';

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
  panCamera: (dx: number, dy: number) => void;
  isPendingDig?: boolean;
  isDefeated?: boolean;
}

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

  const visibleTiles = useMemo(() => {
    const renderedTiles = [];
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        renderedTiles.push({ x, y, type: tiles[y][x] });
      }
    }
    return renderedTiles;
  }, [tiles, startX, endX, startY, endY]);

  const mapContainerStyle = {
    transform: `translate3d(
      ${-cameraPos.x * tileSize + centerX - tileSize / 2}px, 
      ${-cameraPos.y * tileSize + centerY - tileSize / 2}px, 
      0
    )`,
  };

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
        className="absolute top-0 left-0 map-container"
        style={mapContainerStyle}
      >
        {visibleTiles.map((tile) => (
          <div
            key={`${tile.x}-${tile.y}`}
            className={`absolute ${getTileClass(tile.type)}`}
            style={{
              width: tileSize,
              height: tileSize,
              left: tile.x * tileSize,
              top: tile.y * tileSize,
            }}
          >
            {tile.type === TileType.GRASS && ((tile.x + tile.y) % 11 === 0) && (
                <div className="absolute bottom-1 right-1 w-1 h-1 bg-green-200 opacity-40"></div>
            )}
          </div>
        ))}

        {targetPos && (
             <div 
                className={`absolute animate-pulse pointer-events-none z-10 ${isPendingDig ? 'text-yellow-400' : 'text-red-500'}`}
                style={{
                    left: targetPos.x * tileSize,
                    top: targetPos.y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    transform: 'translate(0, 0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.9
                }}
             >
                {isPendingDig ? (
                    <Shovel size={32} className="drop-shadow-md animate-bounce" />
                ) : (
                    <X size={32} className="drop-shadow-md" />
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