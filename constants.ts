import { TileType } from './types';

export const THEME = {
  colors: {
    primary: '#fcd34d', // Gold/Yellow for UI
    secondary: '#3b82f6', // Blue
    accent: '#ef4444', // Red
    background: '#1f2937', // Dark Grey
    text: '#ffffff',
    uiBg: 'rgba(0, 0, 0, 0.85)',
    border: '#ffffff',
  },
  // Base colors for fallback, patterns are defined in CSS
  tiles: {
    [TileType.GRASS]: '#4ade80', 
    [TileType.DIRT]: '#a16207', 
    [TileType.WATER]: '#60a5fa', 
    [TileType.ROCK]: '#4b5563', 
    [TileType.SAND]: '#fde047', 
    [TileType.HOLE]: '#271c19',
    [TileType.TREASURE_MARK]: '#fbbf24',
  }
};

export const GAME_CONFIG = {
  MAP_WIDTH: 30,
  MAP_HEIGHT: 30,
  TILE_SIZE: 48, // pixels
  PLAYER_SPEED: 0.15, // tiles per frame
  JOYSTICK_MAX_RADIUS: 60,
  VIEWPORT_WIDTH_TILES: 11,
  VIEWPORT_HEIGHT_TILES: 15,
  GAME_DURATION: 60, // Seconds
  
  // Initial Spawn Count
  ENEMY_COUNT: 4, 
};

// Unique Stats for each enemy type
export const ENEMY_STATS = {
  SLIME: {
    speed: 0.025,
    range: 10, // Chase range
    flying: false,
    ghost: false,
  },
  BAT: {
    speed: 0.05, // Fast
    range: 7, // Smaller detection range (ambush)
    flying: true, // Ignores terrain hazards
    ghost: false,
  },
  GHOST: {
    speed: 0.015, // Slow
    range: 50, // Infinite/Huge tracking range
    flying: true,
    ghost: true, // Ignores walls
  }
};

export const SPRITE_CONFIG = {
  FRAME_RATE: 10, // Animation speed
};