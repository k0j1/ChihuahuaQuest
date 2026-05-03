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
  SLIME_SPLITTING: {
    speed: 0.02,
    range: 15,
    flying: false,
    ghost: false,
  },
  SNAKE: {
    speed: 0.035, // Medium speed
    range: 12, 
    flying: false, // Falls in holes
    ghost: false,
  },
  SNAKE_VENOMOUS: {
    speed: 0.04,
    range: 15,
    flying: false,
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

export const TREASURE_CONTRACT_ADDRESS = '0xD3260f77CD0E38a3A4e55b6666C28257714C7101';

export const TREASURE_CONTRACT_ABI = [
  {
    "type": "event",
    "name": "SessionCompleted",
    "inputs": [
       { "indexed": true, "name": "user", "type": "address" },
       { "indexed": false, "name": "totalReward", "type": "uint256" },
       { "indexed": false, "name": "treasureIds", "type": "uint256[]" },
       { "indexed": false, "name": "timestamp", "type": "uint256" }
    ]
  },
  {
    "type": "function",
    "name": "recordGameSession",
    "inputs": [
      { "internalType": "uint256[]", "name": "treasureIds", "type": "uint256[]" },
      { "internalType": "uint256", "name": "nonce", "type": "uint256" },
      { "internalType": "bytes", "name": "signature", "type": "bytes" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "nonces",
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "canClaimToday",
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "treasureRewards",
    "outputs": [
      { "internalType": "uint256", "name": "chhAmount", "type": "uint256" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "type": "function",
    "name": "getPlayerInventory",
    "inputs": [
      { "internalType": "address", "name": "player", "type": "address" }
    ],
    "outputs": [
      { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "counts", "type": "uint256[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setTreasureRewardsBatch",
    "inputs": [
      { "internalType": "uint256[]", "name": "treasureIds", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "chhAmountsInEther", "type": "uint256[]" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setPaymentConfig",
    "inputs": [
      { "internalType": "address", "name": "_tokenAddress", "type": "address" },
      { "internalType": "uint256", "name": "_fee", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawPaymentTokens",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resetClaimCooldown",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;


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