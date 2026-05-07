import React from 'react';
import { 
  Sword, Shield, Book, FlaskConical, Gem, Coins, Crown, Scroll, Key,
  Star, Moon, Sun, Anchor, Shell, Crosshair, Hexagon, Sparkles, Feather,
  Skull, Compass, Medal, Clover, Telescope, Wand2, Hammer, Droplets, 
  Leaf, Snowflake, Box, Asterisk, Flame, Zap, Droplet, 
  Eye, Bone, BoxSelect, Castle, CircleDot, Mountain, Tent, 
  TreePine, Wind, Ban, Diamond, Wrench, Settings, Search, PackageOpen, Target, Cross,
  Circle, Square, Triangle, Hexagon as Hex, Dices, Sprout
} from 'lucide-react';
import { getRarity } from '../constants';

export const TreasureIcon = ({ name, className = "w-8 h-8", value = 0 }: { name: string; className?: string; value?: number }) => {
  const IconMap: Record<string, React.ElementType> = {
    Sword, Shield, Book, FlaskConical, Gem, Coins, Crown, Scroll, Key,
    Star, Moon, Sun, Anchor, Shell, Crosshair, Hexagon, Sparkles, Feather,
    Skull, Compass, Medal, Clover, Telescope, Wand2, Hammer, Droplets, 
    Leaf, Snowflake, Box, Asterisk, Flame, Zap, Droplet, 
    Eye, Bone, BoxSelect, Castle, CircleDot, Mountain, Tent, 
    TreePine, Wind, Ban, Diamond, Wrench, Settings, Search, PackageOpen, Target, Cross,
    Circle, Square, Triangle, Hex, Dices, Sprout
  };

  const IconComponent = IconMap[name] || Sparkles;

  if (!value) {
    return <IconComponent className={className} />;
  }

  const rarity = getRarity(value);
  const stars = rarity.stars;

  // We map the size classes passed in, defaulting to wrapper size.
  // The wrapper takes the dimension classes, and inside we scale the icon.
  // If no size is found, we fall back to a reasonable default.

  if (stars === 1) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded bg-gray-800/80 border border-gray-600 ${className} !text-gray-400`}>
        <IconComponent className="w-[60%] h-[60%] drop-shadow-md text-inherit" />
      </div>
    );
  } else if (stars === 2) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded-lg bg-green-900/60 border border-green-500/80 overflow-hidden ${className} !text-green-400`}>
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent"></div>
        <IconComponent className="w-[65%] h-[65%] drop-shadow-[0_2px_4px_rgba(74,222,128,0.6)] z-10 text-inherit" />
      </div>
    );
  } else if (stars === 3) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded-xl bg-blue-900/80 border-[1.5px] border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] overflow-hidden ${className} !text-white`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 via-blue-400/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-300/30 blur-md rounded-full"></div>
        <IconComponent className="w-[70%] h-[70%] drop-shadow-[0_2px_8px_rgba(96,165,250,0.9)] z-10 text-inherit" />
      </div>
    );
  } else if (stars === 4) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl bg-purple-900/90 border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.7)] overflow-hidden ${className} !text-[#f3e8ff]`}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-transparent to-purple-800/60"></div>
        <div className="absolute -inset-1 border-2 border-purple-400/40 rounded-2xl animate-[spin_6s_linear_infinite] border-dashed"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,180,254,0.3)_0%,transparent_60%)] animate-pulse"></div>
        <IconComponent className="w-[75%] h-[75%] filter drop-shadow-[0_0_12px_rgba(192,132,252,1)] z-10 text-inherit" />
        <Sparkles className="absolute top-[5%] right-[5%] w-[30%] h-[30%] text-purple-300 animate-pulse" />
      </div>
    );
  } else {
    // 5 stars: legendary
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded-full bg-gradient-to-br from-yellow-700 via-yellow-900 to-amber-950 border-[2.5px] border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] overflow-hidden ${className} !text-white`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.5)_0%,transparent_70%)] animate-pulse"></div>
        <div className="absolute inset-1 border-[3px] border-yellow-300/60 rounded-full animate-[spin_4s_linear_infinite] border-dotted mix-blend-overlay"></div>
        <div className="absolute -inset-2 border border-yellow-500/30 rounded-full animate-[spin_8s_linear_infinite_reverse] border-dashed"></div>
        <IconComponent className="w-[80%] h-[80%] filter drop-shadow-[0_0_15px_rgba(253,224,71,1)] z-10 text-inherit" />
        <Star className="absolute top-[8%] left-[12%] w-[25%] h-[25%] text-yellow-100 animate-ping" />
        <Sparkles className="absolute bottom-[8%] right-[12%] w-[35%] h-[35%] text-yellow-200 animate-pulse delay-150" />
      </div>
    );
  }
};
