import React, { useRef, useEffect } from 'react';
import { TileType, Position, Enemy } from '../types';
import { GAME_CONFIG } from '../constants';
import { Map as MapIcon } from 'lucide-react';

interface MiniMapProps {
  tiles: TileType[][];
  playerPos: Position;
  enemies: Enemy[];
}

const MiniMap: React.FC<MiniMapProps> = ({ tiles, playerPos, enemies }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Configuration
  const CELL_SIZE = 4; // Size of one tile in pixels on the mini-map
  const MAP_WIDTH = GAME_CONFIG.MAP_WIDTH;
  const MAP_HEIGHT = GAME_CONFIG.MAP_HEIGHT;
  const CANVAS_WIDTH = MAP_WIDTH * CELL_SIZE;
  const CANVAS_HEIGHT = MAP_HEIGHT * CELL_SIZE;

  // Colors mapping
  const TILE_COLORS: Record<TileType, string> = {
    [TileType.GRASS]: '#225533', // Darker for radar look
    [TileType.DIRT]: '#443311', // Darker dirt
    [TileType.WATER]: '#1e3a8a', // Dark blue
    [TileType.ROCK]: '#374151',
    [TileType.SAND]: '#713f12',
    [TileType.HOLE]: '#000000',
    [TileType.TREASURE_MARK]: '#fbbf24', // Gold
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with dark radar background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Draw Terrain
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = tiles[y][x];
        
        // Only draw non-standard tiles to keep it looking like a radar (cleaner)
        if (tile !== TileType.GRASS) {
            ctx.fillStyle = TILE_COLORS[tile];
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else {
            // Faint grid for grass
            if ((x + y) % 2 === 0) {
                ctx.fillStyle = '#112211';
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }

        // Highlight Treasure
        if (tile === TileType.TREASURE_MARK) {
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            // Sparkle center
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, 2, 2);
        }
      }
    }

    // 2. Draw Enemies
    ctx.fillStyle = '#ef4444'; // Red blips
    enemies.forEach(enemy => {
      const ex = Math.floor(enemy.x * CELL_SIZE);
      const ey = Math.floor(enemy.y * CELL_SIZE);
      ctx.fillRect(ex, ey, CELL_SIZE, CELL_SIZE);
    });

    // 3. Draw Player
    ctx.fillStyle = '#ffffff'; // White blip
    const px = Math.floor(playerPos.x * CELL_SIZE);
    const py = Math.floor(playerPos.y * CELL_SIZE);
    
    // Player pulsing effect
    const playerSize = CELL_SIZE + 1;
    ctx.fillRect(px - 0.5, py - 0.5, playerSize, playerSize);
    
    // 4. Viewport Rectangle
    const vpW = GAME_CONFIG.VIEWPORT_WIDTH_TILES * CELL_SIZE;
    const vpH = GAME_CONFIG.VIEWPORT_HEIGHT_TILES * CELL_SIZE;
    
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'; // Blue radar line
    ctx.lineWidth = 1;
    ctx.strokeRect(
      px - vpW / 2 + CELL_SIZE / 2, 
      py - vpH / 2 + CELL_SIZE / 2, 
      vpW, 
      vpH
    );

  }, [tiles, playerPos, enemies, CANVAS_WIDTH, CANVAS_HEIGHT, MAP_WIDTH, MAP_HEIGHT]);

  return (
    <div className="absolute bottom-6 left-6 z-[55] flex flex-col items-center pointer-events-none animate-fade-in">
      {/* Radar Label */}
      <div className="mb-1 flex items-center gap-1 px-2 py-0.5 bg-gray-900/90 rounded-t text-[10px] text-blue-300 font-bold tracking-widest border-t border-x border-gray-600">
        <MapIcon size={10} />
        RADAR
      </div>
      
      {/* Map Container */}
      <div className="p-1 bg-gray-900/90 border-2 border-gray-600 rounded-b rounded-tr shadow-2xl backdrop-blur-md pixel-corners relative">
        <canvas 
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block"
          style={{ 
            width: CANVAS_WIDTH, 
            height: CANVAS_HEIGHT,
            imageRendering: 'pixelated' 
          }}
        />
        
        {/* Radar Scan Line Animation */}
        <div className="absolute inset-1 overflow-hidden pointer-events-none opacity-20">
             <div className="w-full h-full border-b-2 border-green-400 animate-scan"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MiniMap;