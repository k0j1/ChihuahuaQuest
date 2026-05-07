import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import * as GiIcons from 'react-icons/gi';
import { getRarity } from '../constants';

export const TreasureIcon = ({ name, className = "w-8 h-8", value = 0 }: { name: string; className?: string; value?: number }) => {
  const IconComponent = (GiIcons as any)[name] || GiIcons.GiSparkles;

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
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded bg-stone-800 border border-stone-600 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] ${className} !text-stone-400`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <IconComponent className="w-[60%] h-[60%] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-inherit" strokeWidth={1.5} />
      </div>
    );
  } else if (stars === 2) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded-lg bg-emerald-900 border-[1.5px] border-emerald-600/80 shadow-[0_0_8px_rgba(16,185,129,0.2)] overflow-hidden ${className} !text-emerald-300`}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <IconComponent className="w-[80%] h-[80%] blur-sm text-inherit" strokeWidth={2} />
        </div>
        <IconComponent className="w-[65%] h-[65%] drop-shadow-[0_2px_4px_rgba(16,185,129,0.5)] z-10 text-inherit animate-[float-slow_4s_ease-in-out_infinite]" strokeWidth={2} />
      </div>
    );
  } else if (stars === 3) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded-xl bg-blue-900 border-[2px] border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)] overflow-hidden ${className} !text-[#e0f2fe]`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/50 via-blue-400/20 to-transparent"></div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <IconComponent className="w-[80%] h-[80%] text-blue-400 blur-md opacity-60" strokeWidth={2} />
        </div>
        
        <IconComponent className="w-[70%] h-[70%] drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] z-10 text-inherit animate-[float_3s_ease-in-out_infinite]" strokeWidth={2} />
      </div>
    );
  } else if (stars === 4) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl bg-fuchsia-950 border-[2px] border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.6),inset_0_0_10px_rgba(217,70,239,0.4)] overflow-hidden group ${className} !text-[#fae8ff]`}>
        <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-600/40 via-transparent to-purple-900/80"></div>
        
        {/* Animated geometric background */}
        <div className="absolute -inset-[50%] border-2 border-fuchsia-400/30 rounded-full animate-[spin-slow_8s_linear_infinite] border-dashed"></div>
        <div className="absolute -inset-[50%] border border-purple-500/30 rounded-full animate-[spin-slow-reverse_12s_linear_infinite] border-dotted"></div>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,121,249,0.4)_0%,transparent_70%)] animate-[pulse_2s_ease-in-out_infinite]"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <IconComponent className="w-[90%] h-[90%] text-fuchsia-500 blur-lg opacity-70" strokeWidth={2.5} />
        </div>

        <IconComponent className="w-[75%] h-[75%] filter drop-shadow-[0_0_10px_rgba(232,121,249,0.9)] z-10 text-inherit group-hover:scale-110 transition-transform duration-300 animate-[float_2.5s_ease-in-out_infinite]" strokeWidth={2.5} />
        
        <Sparkles className="absolute top-[8%] right-[8%] w-[30%] h-[30%] text-fuchsia-200 animate-[pulse_1.5s_ease-in-out_infinite]" />
        <Star className="absolute bottom-[10%] left-[10%] w-[20%] h-[20%] text-purple-200 animate-[pulse_2s_ease-in-out_infinite]" />
      </div>
    );
  } else {
    // 5 stars: legendary
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 rounded-full bg-gradient-to-br from-amber-700 via-yellow-900 to-amber-950 border-[3px] border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.8),inset_0_0_15px_rgba(250,204,21,0.5)] overflow-hidden group ${className} !text-[#fefce8]`}>
        
        {/* Glowing orb background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,224,71,0.6)_0%,transparent_80%)] animate-[pulse_2s_ease-in-out_infinite]"></div>
        
        {/* Intricate rotating rings */}
        <div className="absolute inset-1 border-[3px] border-yellow-300/80 rounded-full animate-[spin-slow_4s_linear_infinite] border-dotted mix-blend-overlay"></div>
        <div className="absolute -inset-2 border-[2px] border-amber-400/50 rounded-full animate-[spin-slow-reverse_6s_linear_infinite] border-dashed"></div>
        <div className="absolute inset-2 border-[1.5px] border-yellow-200/40 rounded-full animate-[spin-slow_10s_linear_infinite]"></div>
        
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <IconComponent className="w-[100%] h-[100%] text-yellow-500 blur-xl opacity-80" strokeWidth={2.5} />
        </div>

        {/* Main icon with float animation and heavy stroke */}
        <div className="relative z-10 w-[100%] h-[100%] flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
          <IconComponent className="w-[80%] h-[80%] filter drop-shadow-[0_0_15px_rgba(253,224,71,1)] text-inherit group-hover:scale-125 transition-transform duration-500" strokeWidth={2.5} />
        </div>

        {/* Floating particles/stars */}
        <Star className="absolute top-[10%] left-[15%] w-[20%] h-[20%] text-yellow-100 animate-[pulse_1.5s_ease-in-out_infinite]" />
        <Star className="absolute bottom-[15%] right-[10%] w-[15%] h-[15%] text-amber-100 animate-[pulse_2.5s_ease-in-out_infinite]" />
        <Sparkles className="absolute top-[50%] right-[5%] w-[25%] h-[25%] text-yellow-200 animate-[pulse_1s_ease-in-out_infinite] delay-75" />
        <Sparkles className="absolute bottom-[10%] left-[5%] w-[20%] h-[20%] text-yellow-300 animate-[pulse_2s_ease-in-out_infinite] delay-300" />
      </div>
    );
  }
};
