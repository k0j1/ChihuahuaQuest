// Game States
export enum GameState {
  TITLE = 'TITLE',
  PLAYING = 'PLAYING',
  DYING = 'DYING', // Animation state before Game Over
  TREASURE_FOUND = 'TREASURE_FOUND',
  GAME_OVER = 'GAME_OVER',
  TIME_UP = 'TIME_UP',
  TREASURE_BOOK = 'TREASURE_BOOK', // 図鑑画面
}

// Map Tile Types
export enum TileType {
  GRASS = 0,
  DIRT = 1,
  WATER = 2,
  ROCK = 3,
  SAND = 4,
  HOLE = 5,
  TREASURE_MARK = 6,
}

// Direction for sprite animation
export enum Direction {
  DOWN = 0,
  UP = 1,
  LEFT = 2,
  RIGHT = 3,
}

// Entity Interfaces
export interface Position {
  x: number;
  y: number;
}

export type EnemyTypeStr = 'SLIME' | 'SNAKE' | 'GHOST';

export interface Enemy {
  id: string;
  x: number;
  y: number;
  type: EnemyTypeStr;
}

export interface Treasure {
  id: string; // Instance ID (UUID)
  catalogId: number; // Book ID (1-100)
  name: string;
  description: string;
  value: number; // Gold value
  icon: string; // Emoji or icon name
}

// Config Types
export interface MapConfig {
  width: number;
  height: number;
  tileSize: number;
}