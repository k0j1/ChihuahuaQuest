import { TileType, Position, Enemy } from '../types';
import { GAME_CONFIG } from '../constants';

export const generateMap = (width: number, height: number): { tiles: TileType[][], startPos: Position, treasureMap: boolean[][], enemies: Enemy[] } => {
  const tiles: TileType[][] = [];
  const treasureMap: boolean[][] = [];
  const enemies: Enemy[] = [];

  // Initialize with water/border
  for (let y = 0; y < height; y++) {
    const row: TileType[] = [];
    const treasureRow: boolean[] = [];
    for (let x = 0; x < width; x++) {
      row.push(TileType.WATER);
      treasureRow.push(false);
    }
    tiles.push(row);
    treasureMap.push(treasureRow);
  }

  // Cellular Automata / Random Walkish for land generation
  let currentX = Math.floor(width / 2);
  let currentY = Math.floor(height / 2);
  const startPos = { x: currentX, y: currentY };
  
  const steps = (width * height) * 0.7; // Cover about 70% with land variants

  for (let i = 0; i < steps; i++) {
    // Set current tile to land
    if (tiles[currentY][currentX] === TileType.WATER) {
      // Determine land type based on noise/randomness
      const rand = Math.random();
      if (rand > 0.8) tiles[currentY][currentX] = TileType.DIRT;
      else if (rand > 0.95) tiles[currentY][currentX] = TileType.ROCK;
      else tiles[currentY][currentX] = TileType.GRASS;
    }

    // Move random direction
    const dir = Math.floor(Math.random() * 4);
    if (dir === 0 && currentY > 1) currentY--;
    else if (dir === 1 && currentY < height - 2) currentY++;
    else if (dir === 2 && currentX > 1) currentX--;
    else if (dir === 3 && currentX < width - 2) currentX++;
  }

  // Smooth out standalone water tiles (simple cellular automata pass)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (tiles[y][x] === TileType.WATER) {
        let landNeighbors = 0;
        if (tiles[y-1][x] !== TileType.WATER) landNeighbors++;
        if (tiles[y+1][x] !== TileType.WATER) landNeighbors++;
        if (tiles[y][x-1] !== TileType.WATER) landNeighbors++;
        if (tiles[y][x+1] !== TileType.WATER) landNeighbors++;
        
        if (landNeighbors >= 3) {
          tiles[y][x] = TileType.SAND; // Coastline
        }
      }
    }
  }

  // Place Treasures (Randomly in Dirt or Grass)
  // About 5% of land tiles have treasure
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (tiles[y][x] === TileType.GRASS || tiles[y][x] === TileType.DIRT) {
        if (Math.random() < 0.05) {
          treasureMap[y][x] = true;
        }
      }
    }
  }

  // Ensure start pos is walkable
  tiles[startPos.y][startPos.x] = TileType.GRASS;

  // Place Enemies
  let enemiesPlaced = 0;
  while (enemiesPlaced < GAME_CONFIG.ENEMY_COUNT) {
    const ex = Math.floor(Math.random() * width);
    const ey = Math.floor(Math.random() * height);
    
    // Valid spawn: Not water, not rock, and far enough from player
    const dist = Math.sqrt(Math.pow(ex - startPos.x, 2) + Math.pow(ey - startPos.y, 2));
    const tile = tiles[ey][ex];
    
    if (tile !== TileType.WATER && tile !== TileType.ROCK && dist > 5) {
      enemies.push({
        id: crypto.randomUUID(),
        x: ex,
        y: ey,
        type: 'SLIME'
      });
      enemiesPlaced++;
    }
  }

  return { tiles, startPos, treasureMap, enemies };
};