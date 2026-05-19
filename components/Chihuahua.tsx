import React from 'react';
import { Direction } from '../types';

interface ChihuahuaProps {
  direction: Direction;
  isMoving: boolean;
  isDigging: boolean;
  isDefeated?: boolean;
}

const Chihuahua: React.FC<ChihuahuaProps> = ({ direction, isMoving, isDigging, isDefeated = false }) => {
  // Determine animation class
  let animationClass = "";
  if (isDefeated) {
      animationClass = "animate-defeat";
  } else if (isDigging) {
    animationClass = "animate-dig";
  } else if (isMoving) {
    animationClass = "animate-bounce-short";
  }

  // CSS for pixel art chihuahua and digging effect
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${animationClass}`}>
      {/* Dirt Particles & Shovel (Visible only when digging) */}
      {isDigging && (
        <>
            <div className="absolute bottom-1 left-0 w-2.5 h-2.5 bg-yellow-900 rounded-sm animate-throw-left z-20"></div>
            <div className="absolute bottom-1 right-0 w-2 h-2 bg-amber-800 rounded-sm animate-throw-right z-20"></div>
            <div className="absolute bottom-2 left-4 w-1.5 h-1.5 bg-yellow-800 rounded-sm animate-throw-left" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute bottom-3 right-4 w-2 h-2 bg-amber-900 rounded-sm animate-throw-right" style={{ animationDelay: '0.15s' }}></div>

            {/* Shovel */}
            <div className="absolute top-0 -right-2 w-4 h-8 animate-shovel z-30">
               {/* Shovel Handle */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-5 bg-[#8b4513] rounded-sm"></div>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-1 bg-[#8b4513] rounded-sm"></div>
               {/* Shovel Head */}
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-3 bg-slate-300 rounded-b-md shadow-sm border border-slate-400"></div>
            </div>
        </>
      )}

      {/* Sprite Container */}
      <div className={`w-10 h-10 relative transition-transform duration-100 z-10 ${
        direction === Direction.LEFT && !isDefeated ? 'scale-x-[-1]' : ''
      }`}>
        {/* Head */}
        <div className="absolute top-1 left-2 w-6 h-5 bg-yellow-200 pixel-corners">
          {/* Ears */}
          <div className="absolute -top-2 -left-1 w-2 h-3 bg-yellow-700"></div>
          <div className="absolute -top-2 right-0 w-2 h-3 bg-yellow-700"></div>
          {/* Eyes (Change to X when defeated) */}
          {isDefeated ? (
             <>
                <div className="absolute top-2 left-1 text-[8px] leading-none font-bold text-black">X</div>
                <div className="absolute top-2 right-1 text-[8px] leading-none font-bold text-black">X</div>
             </>
          ) : (
             <>
                <div className="absolute top-2 left-1 w-1 h-1 bg-black"></div>
                <div className="absolute top-2 right-1 w-1 h-1 bg-black"></div>
             </>
          )}
          {/* Nose */}
          <div className="absolute top-3 left-2.5 w-1 h-1 bg-black"></div>
        </div>
        
        {/* Body */}
        <div className="absolute top-6 left-3 w-4 h-3 bg-yellow-600 pixel-corners">
          {/* Tail */}
          <div className={`absolute top-0 -left-2 w-2 h-1 bg-yellow-200 origin-right ${isDigging ? 'animate-bounce' : 'animate-pulse'}`}></div>
        </div>

        {/* Legs (visible based on direction slightly) */}
        <div className="absolute top-9 left-3 w-1 h-1 bg-yellow-800"></div>
        <div className="absolute top-9 left-6 w-1 h-1 bg-yellow-800"></div>
        
        {/* Paws (Visible when digging) */}
        {isDigging && (
            <div className="absolute top-8 left-2 w-6 h-2 bg-yellow-500 blur-[1px]"></div>
        )}
      </div>
    </div>
  );
};

export default Chihuahua;