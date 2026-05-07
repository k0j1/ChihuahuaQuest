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

export const TreasureIcon = ({ name, className }: { name: string, className?: string }) => {
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
  return <IconComponent className={className} />;
};
