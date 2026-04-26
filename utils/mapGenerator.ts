import { TileType, Position, Enemy } from '../types';
import { GAME_CONFIG } from '../constants';

export const generateMap = (width: number, height: number): { tiles: TileType[][], startPos: Position, treasureMap: boolean[][], enemies: Enemy[] } => {
  let tiles: TileType[][] = [];
  const treasureMap: boolean[][] = [];
  const enemies: Enemy[] = [];

  // 1. Initial random fill for Land/Water CA
  let grid: number[][] = [];
  let biomeGrid: number[][] = []; // 0: Plains, 1: Desert, 2: Forest
  
  for (let y = 0; y < height; y++) {
    grid.push([]);
    biomeGrid.push([]);
    treasureMap.push([]);
    tiles.push([]);
    for (let x = 0; x < width; x++) {
      grid[y].push(Math.random() < 0.5 ? 1 : 0);
      biomeGrid[y].push(Math.floor(Math.random() * 3));
      treasureMap[y].push(false);
      tiles[y].push(TileType.WATER);
    }
  }

  // Ensure border is water
  const setBorderWater = (g: number[][]) => {
     for (let y = 0; y < height; y++) {
        g[y][0] = 0; g[y][width - 1] = 0;
     }
     for (let x = 0; x < width; x++) {
        g[0][x] = 0; g[height - 1][x] = 0;
     }
  };

  // 2. Cellular Automata Smoothing for Land
  const smoothMap = (g: number[][]) => {
    let newGrid = Array(height).fill(0).map(() => Array(width).fill(0));
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let neighborWalls = 0;
        for (let iy = -1; iy <= 1; iy++) {
          for (let ix = -1; ix <= 1; ix++) {
            if (iy === 0 && ix === 0) continue;
            if (g[y + iy]?.[x + ix] === 1) neighborWalls++;
          }
        }
        if (neighborWalls > 4) newGrid[y][x] = 1;
        else if (neighborWalls < 4) newGrid[y][x] = 0;
        else newGrid[y][x] = g[y][x];
      }
    }
    return newGrid;
  };

  for (let i = 0; i < 5; i++) {
    grid = smoothMap(grid);
    setBorderWater(grid);
  }

  // 3. Cellular Automata Smoothing for Biomes
  const smoothBiomes = (g: number[][]) => {
    let newGrid = Array(height).fill(0).map(() => Array(width).fill(0));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let counts = [0, 0, 0];
        for (let iy = -2; iy <= 2; iy++) {
          for (let ix = -2; ix <= 2; ix++) {
            const ny = y + iy, nx = x + ix;
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
               counts[g[ny]?.[nx]]++;
            }
          }
        }
        const maxIndex = counts.indexOf(Math.max(...counts));
        newGrid[y][x] = maxIndex;
      }
    }
    return newGrid;
  };

  for (let i = 0; i < 3; i++) {
     biomeGrid = smoothBiomes(biomeGrid);
  }

  // 4. Translate grids to TileTypes
  // Biome mapping:
  // 0: Plains -> GRASS, scatter DIRT, some ROCK
  // 1: Desert -> SAND, scatter ROCK, no GRASS
  // 2: Forest -> DIRT, heavy ROCK, GRASS boundaries
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 0) {
        tiles[y][x] = TileType.WATER;
      } else {
        const biome = biomeGrid[y][x];
        const r = Math.random();
        
        if (biome === 0) { // Plains
           if (r < 0.05) tiles[y][x] = TileType.DIRT;
           else if (r < 0.1) tiles[y][x] = TileType.ROCK;
           else tiles[y][x] = TileType.GRASS;
        } else if (biome === 1) { // Desert
           if (r < 0.15) tiles[y][x] = TileType.ROCK;
           else if (r < 0.25) tiles[y][x] = TileType.DIRT;
           else tiles[y][x] = TileType.SAND;
        } else { // Forest
           if (r < 0.3) tiles[y][x] = TileType.ROCK; // Rocks acts as trees/obstacles
           else if (r < 0.6) tiles[y][x] = TileType.DIRT;
           else tiles[y][x] = TileType.GRASS;
        }
      }
    }
  }

  // 5. Create Coastlines (SAND between Water and Land)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (tiles[y][x] !== TileType.WATER && tiles[y][x] !== TileType.ROCK) {
        let hasWaterNeighbor = false;
        for (let iy = -1; iy <= 1; iy++) {
          for (let ix = -1; ix <= 1; ix++) {
            if (tiles[y + iy]?.[x + ix] === TileType.WATER) {
               hasWaterNeighbor = true;
               break;
            }
          }
        }
        if (hasWaterNeighbor && Math.random() < 0.8) {
           tiles[y][x] = TileType.SAND;
        }
      }
    }
  }

  // 6. Generate Ruins (Small structures)
  const numRuins = Math.floor(Math.random() * 4) + 2;
  for (let i = 0; i < numRuins; i++) {
     const rw = Math.floor(Math.random() * 4) + 3; // 3 to 6
     const rh = Math.floor(Math.random() * 4) + 3;
     const rx = Math.floor(Math.random() * (width - rw - 4)) + 2;
     const ry = Math.floor(Math.random() * (height - rh - 4)) + 2;
     
     // Check if location is mostly land
     let landCount = 0;
     for (let y = ry; y < ry + rh; y++) {
        for (let x = rx; x < rx + rw; x++) {
           if (tiles[y]?.[x] !== TileType.WATER) landCount++;
        }
     }
     
     if (landCount > (rw * rh * 0.8)) {
         // Build ruin
         for (let y = ry; y < ry + rh; y++) {
            for (let x = rx; x < rx + rw; x++) {
               // Outline is rock
               if (y === ry || y === ry + rh - 1 || x === rx || x === rx + rw - 1) {
                  // Broken walls
                  if (Math.random() > 0.3) {
                     tiles[y][x] = TileType.ROCK;
                  } else {
                     tiles[y][x] = TileType.DIRT;
                  }
               } else {
                  // Inside is dirt/sand
                  tiles[y][x] = Math.random() > 0.5 ? TileType.DIRT : TileType.SAND;
               }
            }
         }
     }
  }

  // Find a valid start position (must be land, preferably GRASS or SAND, not surrounded by too many rocks)
  let startX = Math.floor(width / 2);
  let startY = Math.floor(height / 2);
  let found = false;
  
  // Search from center outwards
  for (let r = 0; r < Math.max(width, height); r++) {
     for (let y = Math.max(1, startY - r); y <= Math.min(height - 2, startY + r); y++) {
        for (let x = Math.max(1, startX - r); x <= Math.min(width - 2, startX + r); x++) {
           if (tiles[y][x] === TileType.GRASS || tiles[y][x] === TileType.SAND || tiles[y][x] === TileType.DIRT) {
               startX = x;
               startY = y;
               found = true;
               break;
           }
        }
        if (found) break;
     }
     if (found) break;
  }
  
  const startPos = { x: startX, y: startY };
  // Ensure exactly the spawn spot is walkable grass
  tiles[startY][startX] = TileType.GRASS;
  // Clear rocks near start
  for(let iy = -1; iy <= 1; iy++) {
     for(let ix = -1; ix <= 1; ix++) {
         if (tiles[startY + iy]?.[startX + ix] === TileType.ROCK) {
             tiles[startY + iy][startX + ix] = TileType.GRASS;
         }
     }
  }

  // 7. Place Treasures
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (tiles[y][x] !== TileType.WATER && tiles[y][x] !== TileType.ROCK) {
         // Slightly higher chance in ruins/dirt areas
         let chance = 0.04;
         if (tiles[y][x] === TileType.SAND) chance = 0.03;
         if (tiles[y][x] === TileType.DIRT) chance = 0.05;
         
         // If it's near a rock, slightly higher chance (hidden behind tree/rock)
         let nearRock = false;
         for (let iy = -1; iy <= 1; iy++) {
           for (let ix = -1; ix <= 1; ix++) {
               if (tiles[y+iy]?.[x+ix] === TileType.ROCK) nearRock = true;
           }
         }
         if (nearRock) chance += 0.02;

         if (Math.random() < chance && (y !== startY || x !== startX)) {
             treasureMap[y][x] = true;
         }
      }
    }
  }

  // 8. Place Enemies
  let enemiesPlaced = 0;
  // Max attempts to avoid infinite loops if map is too small/watery
  let attempts = 0; 
  while (enemiesPlaced < GAME_CONFIG.ENEMY_COUNT && attempts < 1000) {
    attempts++;
    const ex = Math.floor(Math.random() * width);
    const ey = Math.floor(Math.random() * height);
    
    // Valid spawn: Not water, not rock, and far enough from player
    const dist = Math.sqrt(Math.pow(ex - startPos.x, 2) + Math.pow(ey - startPos.y, 2));
    const tile = tiles[ey][ex];
    
    if (tile !== TileType.WATER && tile !== TileType.ROCK && dist > 5) {
      const rand = Math.random();
      let type: any = 'SLIME';
      
      // Biome-specific enemies
      const biome = biomeGrid[ey][ex];
      if (biome === 1) { // Desert
         if (rand > 0.6) type = 'SNAKE_VENOMOUS';
         else if (rand > 0.3) type = 'SNAKE';
         else type = 'SLIME';
      } else if (biome === 2) { // Forest
         if (rand > 0.7) type = 'GHOST';
         else if (rand > 0.4) type = 'SLIME_SPLITTING';
         else if (rand > 0.2) type = 'SNAKE';
         else type = 'SLIME';
      } else { // Plains
         if (rand > 0.8) type = 'GHOST'; 
         else if (rand > 0.6) type = 'SLIME_SPLITTING';
         else if (rand > 0.4) type = 'SNAKE'; 
      }

      enemies.push({
        id: crypto.randomUUID(),
        x: ex,
        y: ey,
        type: type,
        state: 'moving'
      });
      enemiesPlaced++;
    }
  }

  return { tiles, startPos, treasureMap, enemies };
};