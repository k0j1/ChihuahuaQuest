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
  SNAKE: {
    speed: 0.035, // Medium speed
    range: 12, 
    flying: false, // Falls in holes
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

// --- Rarity System ---

export interface RarityDef {
  stars: number;
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  shadowClass: string;
}

export const getRarity = (value: number): RarityDef => {
  if (value >= 1000) {
    return { 
      stars: 5, 
      label: "LEGENDARY", 
      colorClass: "text-yellow-400", 
      bgClass: "bg-gradient-to-br from-yellow-900 to-yellow-600",
      borderClass: "border-yellow-300",
      shadowClass: "shadow-yellow-500/50"
    };
  } else if (value >= 300) {
    return { 
      stars: 4, 
      label: "EPIC", 
      colorClass: "text-purple-400", 
      bgClass: "bg-gradient-to-br from-purple-900 to-purple-600",
      borderClass: "border-purple-300",
      shadowClass: "shadow-purple-500/50"
    };
  } else if (value >= 100) {
    return { 
      stars: 3, 
      label: "RARE", 
      colorClass: "text-blue-400", 
      bgClass: "bg-gradient-to-br from-blue-900 to-blue-600",
      borderClass: "border-blue-300",
      shadowClass: "shadow-blue-500/50"
    };
  } else if (value >= 50) {
    return { 
      stars: 2, 
      label: "UNCOMMON", 
      colorClass: "text-green-400", 
      bgClass: "bg-gradient-to-br from-green-900 to-green-700",
      borderClass: "border-green-300",
      shadowClass: "shadow-green-500/50"
    };
  } else {
    return { 
      stars: 1, 
      label: "COMMON", 
      colorClass: "text-gray-400", 
      bgClass: "bg-gradient-to-br from-gray-800 to-gray-700",
      borderClass: "border-gray-500",
      shadowClass: "shadow-gray-500/50"
    };
  }
};