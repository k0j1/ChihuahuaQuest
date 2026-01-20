import React, { useMemo, useCallback } from 'react';
import { TileType, Position, Direction, Enemy as EnemyType } from '../types';
import { GAME_CONFIG } from '../constants';
import Chihuahua from './Chihuahua';
import Enemy from './Enemy';
import { X, Hand } from 'lucide-react';

interface GameMapProps {
  tiles: TileType[][];
  playerPos: Position;
  direction: Direction;
  isMoving: boolean;
  isDigging: boolean;
  enemies: EnemyType[];
  onInteract?: (clientX: number, clientY: number) => void;
  targetPos: Position | null;
  openingChest?: { x: number, y: number, remaining: number } | null;
}

const GameMap: React.FC<GameMapProps> = ({ 
    tiles, 
    playerPos, 
    direction, 
    isMoving, 
    isDigging, 
    enemies, 
    onInteract,
    targetPos,
    openingChest
}) => {
  const tileSize = GAME_CONFIG.TILE_SIZE;
  
  // Calculate viewport offset to keep player centered
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Viewport Culling Calculations
  const viewportWidthTiles = Math.ceil(window.innerWidth / tileSize);
  const viewportHeightTiles = Math.ceil(window.innerHeight / tileSize);
  
  const buffer = 2; 
  
  const startX = Math.max(0, Math.floor(playerPos.x - viewportWidthTiles / 2) - buffer);
  const endX = Math.min(GAME_CONFIG.MAP_WIDTH, Math.ceil(playerPos.x + viewportWidthTiles / 2) + buffer);
  
  const startY = Math.max(0, Math.floor(playerPos.y - viewportHeightTiles / 2) - buffer);
  const endY = Math.min(GAME_CONFIG.MAP_HEIGHT, Math.ceil(playerPos.y + viewportHeightTiles / 2) + buffer);

  // Generate only visible tiles
  const visibleTiles = useMemo(() => {
    const renderedTiles = [];
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        renderedTiles.push({
          x,
          y,
          type: tiles[y][x]
        });
      }
    }
    return renderedTiles;
  }, [tiles, startX, endX, startY, endY]);

  const mapContainerStyle = {
    transform: `translate3d(
      ${-playerPos.x * tileSize + centerX - tileSize / 2}px, 
      ${-playerPos.y * tileSize + centerY - tileSize / 2}px, 
      0
    )`,
  };

  const getTileClass = (type: TileType, x: number, y: number) => {
    let base = '';
    switch(type) {
      case TileType.GRASS: base = 'tile-grass'; break;
      case TileType.DIRT: base = 'tile-dirt'; break;
      case TileType.WATER: base = 'tile-water'; break;
      case TileType.ROCK: base = 'tile-rock'; break;
      case TileType.SAND: base = 'tile-sand'; break;
      case TileType.HOLE: base = 'tile-hole'; break;
      case TileType.TREASURE_MARK: base = 'tile-treasure-mark'; break;
      default: base = '';
    }
    
    // Add shake animation if this is the chest currently being opened
    if (openingChest && openingChest.x === x && openingChest.y === y) {
        return `${base} animate-shake`;
    }
    return base;
  };

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
      if (onInteract) {
          onInteract(e.clientX, e.clientY);
      }
  }, [onInteract]);

  return (
    <div 
        className="absolute inset-0 overflow-hidden bg-black"
        onPointerDown={handlePointerDown}
    >
      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .animate-shake {
          animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

      {/* Map Container - Moved by transform */}
      <div 
        className="absolute top-0 left-0 map-container"
        style={mapContainerStyle}
      >
        {/* Render visible tiles using absolute positioning relative to the map container */}
        {visibleTiles.map((tile) => (
          <div
            key={`${tile.x}-${tile.y}`}
            className={`absolute ${getTileClass(tile.type, tile.x, tile.y)}`}
            style={{
              width: tileSize,
              height: tileSize,
              left: tile.x * tileSize,
              top: tile.y * tileSize,
            }}
          >
            {/* Minimal Decor */}
            {tile.type === TileType.GRASS && ((tile.x + tile.y) % 11 === 0) && (
                <div className="absolute bottom-1 right-1 w-1 h-1 bg-green-200 opacity-40"></div>
            )}
            
            {/* Chest Tap UI Overlay */}
            {openingChest && openingChest.x === tile.x && openingChest.y === tile.y && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-red-600 font-bold text-lg animate-bounce drop-shadow-md bg-white/80 px-1 rounded">
                        TAP!
                    </span>
                    <span className="text-white font-black text-sm drop-shadow-md">
                        {openingChest.remaining}
                    </span>
                </div>
            )}
          </div>
        ))}

        {/* Target Cursor (Mark X) */}
        {targetPos && (
             <div 
                className="absolute text-red-500 animate-pulse pointer-events-none z-10"
                style={{
                    left: targetPos.x * tileSize,
                    top: targetPos.y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    transform: 'translate(0, 0)', // Aligned to tile
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.7
                }}
             >
                <X size={32} className="drop-shadow-md" />
             </div>
        )}

        {/* Enemies Layer */}
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
      </div>

      {/* Player Layer - Always centered on screen */}
      <div 
        className="absolute z-20 pointer-events-none"
        style={{
          width: tileSize,
          height: tileSize,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Chihuahua direction={direction} isMoving={isMoving} isDigging={isDigging} />
      </div>
    </div>
  );
};

export default GameMap;