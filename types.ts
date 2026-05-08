// Game States
export enum GameState {
  TITLE = 'TITLE',
  PLAYING = 'PLAYING',
  DYING = 'DYING', // Animation state before Game Over
  TREASURE_FOUND = 'TREASURE_FOUND',
  GAME_OVER = 'GAME_OVER',
  TIME_UP = 'TIME_UP',
  TREASURE_BOOK = 'TREASURE_BOOK', // 図鑑画面
  LITEPAPER = 'LITEPAPER', // ライトペーパー画面
  ADMIN = 'ADMIN', // 管理画面
}

export enum MapTheme {
  NORMAL = 'NORMAL',
  VOLCANO = 'VOLCANO',
  GLACIER = 'GLACIER',
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

export type EnemyTypeStr = 'SLIME' | 'SNAKE' | 'GHOST' | 'SNAKE_VENOMOUS' | 'SLIME_SPLITTING';

export interface Enemy {
  id: string;
  x: number;
  y: number;
  type: EnemyTypeStr;
  state?: 'moving' | 'attacking' | 'defeated';
  defeatedAt?: number;
}

export interface Treasure {
  id: string; // Instance ID (UUID)
  catalogId: number; // Book ID (1-100)
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  value: number; // Gold value
  baseValue?: number; // Original default value
  icon: string; // Emoji or icon name
}

// Farcaster User Type
export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  verifications?: string[];
  custodyAddress?: string;
}

// Config Types
export interface MapConfig {
  width: number;
  height: number;
  tileSize: number;
}