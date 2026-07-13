import React from 'react';
import { Direction, CharacterType } from '../types';

interface PlayerCharacterProps {
  direction: Direction;
  isMoving: boolean;
  isDigging: boolean;
  isDefeated?: boolean;
  characterType?: CharacterType;
}

const PlayerCharacter: React.FC<PlayerCharacterProps> = ({ direction, isMoving, isDigging, isDefeated = false, characterType = CharacterType.CHIHUAHUA }) => {
  // Determine animation class
  let animationClass = "";
  if (isDefeated) {
      animationClass = "animate-defeat";
  } else if (isDigging) {
    animationClass = "animate-dig";
  } else if (isMoving) {
    animationClass = "animate-bounce-short";
  }

  const renderCharacter = () => {
    switch (characterType) {
      case CharacterType.CAT:
        return (
          <>
            {/* Cat Head */}
            <div className="absolute top-1 left-2 w-6 h-5 bg-slate-100 pixel-corners border-b border-slate-300">
              {/* Ears */}
              <div className="absolute -top-2 -left-0 w-2 h-2 bg-slate-100 border-l border-t border-slate-300"></div>
              <div className="absolute -top-2 right-0 w-2 h-2 bg-slate-100 border-r border-t border-slate-300"></div>
              {/* Inner Ears */}
              <div className="absolute -top-1.5 left-0.5 w-1 h-1.5 bg-pink-300"></div>
              <div className="absolute -top-1.5 right-0.5 w-1 h-1.5 bg-pink-300"></div>
              {/* Eyes */}
              {isDefeated ? (
                <>
                  <div className="absolute top-2 left-1 text-[8px] leading-none font-bold text-red-500">X</div>
                  <div className="absolute top-2 right-1 text-[8px] leading-none font-bold text-red-500">X</div>
                </>
              ) : (
                <>
                  <div className="absolute top-2 left-1 w-1 h-1 bg-green-500"></div>
                  <div className="absolute top-2 right-1 w-1 h-1 bg-green-500"></div>
                </>
              )}
              {/* Nose */}
              <div className="absolute top-3 left-2.5 w-1 h-1 bg-pink-400 rounded-full"></div>
            </div>
            
            {/* Cat Body */}
            <div className="absolute top-6 left-3 w-4 h-3 bg-slate-100 pixel-corners border-b border-slate-300">
              {/* Tail */}
              <div className={`absolute -top-1 -left-2 w-3 h-1 bg-slate-100 origin-right ${isDigging ? 'animate-bounce' : 'animate-pulse'}`}></div>
            </div>

            {/* Legs */}
            <div className="absolute top-9 left-3 w-1 h-1 bg-slate-400"></div>
            <div className="absolute top-9 left-6 w-1 h-1 bg-slate-400"></div>
            
            {/* Paws */}
            {isDigging && (
                <div className="absolute top-8 left-2 w-6 h-2 bg-slate-200 blur-[1px]"></div>
            )}
          </>
        );

      case CharacterType.SHIBA:
        return (
          <>
            {/* Shiba Head */}
            <div className="absolute top-1 left-2 w-6 h-5 bg-orange-400 pixel-corners border-b-2 border-white">
              {/* Ears */}
              <div className="absolute -top-2 -left-1 w-2 h-3 bg-orange-500"></div>
              <div className="absolute -top-2 right-0 w-2 h-3 bg-orange-500"></div>
              {/* Inner Ears */}
              <div className="absolute -top-1 left-0 w-1 h-1.5 bg-white"></div>
              <div className="absolute -top-1 right-0.5 w-1 h-1.5 bg-white"></div>
              {/* Eyebrows */}
              <div className="absolute top-0.5 left-1 w-1 h-1 bg-white rounded-full"></div>
              <div className="absolute top-0.5 right-1 w-1 h-1 bg-white rounded-full"></div>
              {/* Eyes */}
              {isDefeated ? (
                <>
                  <div className="absolute top-2 left-1 text-[8px] leading-none font-bold text-red-500">X</div>
                  <div className="absolute top-2 right-1 text-[8px] leading-none font-bold text-red-500">X</div>
                </>
              ) : (
                <>
                  <div className="absolute top-2 left-1 w-1 h-1 bg-black rounded-full"></div>
                  <div className="absolute top-2 right-1 w-1 h-1 bg-black rounded-full"></div>
                </>
              )}
              {/* Nose/Muzzle */}
              <div className="absolute top-3 left-1.5 w-3 h-2 bg-white rounded-full"></div>
              <div className="absolute top-3 left-2.5 w-1 h-1 bg-black rounded-full"></div>
            </div>
            
            {/* Shiba Body */}
            <div className="absolute top-6 left-3 w-5 h-3 bg-orange-400 pixel-corners border-b border-white">
              {/* Tail */}
              <div className={`absolute -top-1 -left-2 w-2 h-2 bg-orange-400 rounded-full origin-right ${isDigging ? 'animate-bounce' : 'animate-pulse'}`}></div>
            </div>

            {/* Legs */}
            <div className="absolute top-9 left-3 w-1 h-1 bg-white"></div>
            <div className="absolute top-9 left-6 w-1 h-1 bg-white"></div>
            
            {/* Paws */}
            {isDigging && (
                <div className="absolute top-8 left-2 w-6 h-2 bg-orange-200 blur-[1px]"></div>
            )}
          </>
        );
        
      case CharacterType.RABBIT:
        return (
          <>
            {/* Rabbit Head */}
            <div className="absolute top-2 left-2 w-5 h-4 bg-white pixel-corners shadow-sm">
              {/* Ears */}
              <div className="absolute -top-4 -left-0 w-1.5 h-5 bg-white border-l border-pink-100"></div>
              <div className="absolute -top-4 right-0 w-1.5 h-5 bg-white border-r border-pink-100"></div>
              {/* Inner Ears */}
              <div className="absolute -top-3 left-0.5 w-0.5 h-3 bg-pink-300"></div>
              <div className="absolute -top-3 right-0.5 w-0.5 h-3 bg-pink-300"></div>
              {/* Eyes */}
              {isDefeated ? (
                <>
                  <div className="absolute top-1.5 left-0.5 text-[6px] leading-none font-bold text-red-500">X</div>
                  <div className="absolute top-1.5 right-0.5 text-[6px] leading-none font-bold text-red-500">X</div>
                </>
              ) : (
                <>
                  <div className="absolute top-1.5 left-0.5 w-1 h-1.5 bg-red-400 rounded-full"></div>
                  <div className="absolute top-1.5 right-0.5 w-1 h-1.5 bg-red-400 rounded-full"></div>
                </>
              )}
              {/* Nose */}
              <div className="absolute top-2.5 left-2 w-1 h-1 bg-pink-300 rounded-full"></div>
            </div>
            
            {/* Rabbit Body */}
            <div className="absolute top-6 left-2 w-5 h-3 bg-white pixel-corners shadow-sm">
              {/* Tail */}
              <div className={`absolute top-0.5 -left-1 w-2 h-2 bg-white rounded-full shadow-sm origin-right ${isDigging ? 'animate-bounce' : 'animate-pulse'}`}></div>
            </div>

            {/* Legs */}
            <div className="absolute top-9 left-2.5 w-1 h-1 bg-pink-100"></div>
            <div className="absolute top-9 left-6 w-1 h-1 bg-pink-100"></div>
            
            {/* Paws */}
            {isDigging && (
                <div className="absolute top-8 left-1 w-6 h-2 bg-pink-50 blur-[1px]"></div>
            )}
          </>
        );

      case CharacterType.PENGUIN:
        return (
          <>
            {/* Penguin Head & Body */}
            <div className="absolute top-1 left-2 w-6 h-8 bg-black pixel-corners rounded-t-full">
               {/* White belly */}
               <div className="absolute top-2 left-1 w-4 h-6 bg-white rounded-t-full"></div>
               {/* Eyes */}
               {isDefeated ? (
                 <>
                   <div className="absolute top-3 left-1 text-[6px] leading-none font-bold text-red-500">X</div>
                   <div className="absolute top-3 right-1 text-[6px] leading-none font-bold text-red-500">X</div>
                 </>
               ) : (
                 <>
                   <div className="absolute top-3 left-1 w-1 h-1 bg-black rounded-full"></div>
                   <div className="absolute top-3 right-1 w-1 h-1 bg-black rounded-full"></div>
                 </>
               )}
               {/* Beak */}
               <div className="absolute top-4 left-2 w-2 h-1.5 bg-yellow-400 rounded-b-full"></div>
               {/* Flippers */}
               <div className={`absolute top-4 -left-1 w-1 h-3 bg-black rounded-l-full origin-right ${isDigging ? 'animate-bounce' : ''}`}></div>
               <div className={`absolute top-4 -right-1 w-1 h-3 bg-black rounded-r-full origin-left ${isDigging ? 'animate-bounce' : ''}`}></div>
            </div>
            {/* Feet */}
            <div className="absolute top-9 left-2.5 w-1 h-1 bg-yellow-500"></div>
            <div className="absolute top-9 left-5 w-1 h-1 bg-yellow-500"></div>
            {/* Paws */}
            {isDigging && (
                <div className="absolute top-8 left-2 w-6 h-2 bg-yellow-200 blur-[1px]"></div>
            )}
          </>
        );

      case CharacterType.BEAR:
        return (
          <>
            {/* Bear Head */}
            <div className="absolute top-0 left-1 w-8 h-6 bg-amber-800 pixel-corners">
              {/* Ears */}
              <div className="absolute -top-2 -left-1 w-3 h-3 bg-amber-800 rounded-full"></div>
              <div className="absolute -top-2 -right-1 w-3 h-3 bg-amber-800 rounded-full"></div>
              {/* Inner Ears */}
              <div className="absolute -top-1 left-0 w-1.5 h-1.5 bg-amber-900 rounded-full"></div>
              <div className="absolute -top-1 right-0 w-1.5 h-1.5 bg-amber-900 rounded-full"></div>
              {/* Eyes */}
              {isDefeated ? (
                <>
                  <div className="absolute top-2 left-2 text-[8px] leading-none font-bold text-red-500">X</div>
                  <div className="absolute top-2 right-2 text-[8px] leading-none font-bold text-red-500">X</div>
                </>
              ) : (
                <>
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                </>
              )}
              {/* Muzzle */}
              <div className="absolute top-3 left-2 w-4 h-3 bg-amber-600 rounded-full"></div>
              <div className="absolute top-3.5 left-3.5 w-1 h-1 bg-black rounded-full"></div>
            </div>
            
            {/* Bear Body */}
            <div className="absolute top-6 left-1 w-8 h-4 bg-amber-900 pixel-corners">
              {/* Tail */}
              <div className="absolute top-1 -left-1 w-2 h-2 bg-amber-800 rounded-full"></div>
            </div>
            {/* Legs */}
            <div className="absolute top-9 left-2 w-2 h-1 bg-amber-950"></div>
            <div className="absolute top-9 left-6 w-2 h-1 bg-amber-950"></div>
            
            {/* Paws */}
            {isDigging && (
                <div className="absolute top-8 left-1 w-8 h-2 bg-amber-700 blur-[1px]"></div>
            )}
          </>
        );

      case CharacterType.DRAGON:
        return (
          <>
            {/* Dragon Head */}
            <div className="absolute top-0 left-1 w-7 h-6 bg-green-600 pixel-corners">
              {/* Horns */}
              <div className="absolute -top-2 -left-1 w-2 h-3 bg-yellow-400"></div>
              <div className="absolute -top-2 right-1 w-2 h-3 bg-yellow-400"></div>
              {/* Eyes */}
              {isDefeated ? (
                <>
                  <div className="absolute top-2 left-1 text-[8px] leading-none font-bold text-red-500">X</div>
                  <div className="absolute top-2 right-2 text-[8px] leading-none font-bold text-red-500">X</div>
                </>
              ) : (
                <>
                  <div className="absolute top-2 left-1 w-2 h-1 bg-yellow-300"></div>
                  <div className="absolute top-2 right-2 w-2 h-1 bg-yellow-300"></div>
                </>
              )}
              {/* Snout */}
              <div className="absolute top-3 left-1.5 w-5 h-3 bg-green-500 rounded-b-full"></div>
              {/* Nostrils */}
              <div className="absolute top-4 left-2.5 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute top-4 right-1.5 w-1 h-1 bg-black rounded-full"></div>
            </div>
            
            {/* Dragon Body */}
            <div className="absolute top-6 left-1 w-8 h-4 bg-green-700 pixel-corners">
              {/* Wings */}
              <div className={`absolute -top-3 -left-2 w-4 h-4 bg-green-500 rounded-tl-full border-t-2 border-l-2 border-green-400 origin-bottom-right ${isMoving ? 'animate-bounce' : 'animate-pulse'}`}></div>
              <div className={`absolute -top-3 right-0 w-4 h-4 bg-green-500 rounded-tr-full border-t-2 border-r-2 border-green-400 origin-bottom-left ${isMoving ? 'animate-bounce' : 'animate-pulse'}`}></div>
              {/* Tail */}
              <div className={`absolute top-1 -left-3 w-4 h-2 bg-green-600 rounded-l-full origin-right ${isDigging ? 'animate-bounce' : ''}`}></div>
            </div>
            {/* Legs */}
            <div className="absolute top-9 left-2 w-2 h-1 bg-green-900"></div>
            <div className="absolute top-9 left-6 w-2 h-1 bg-green-900"></div>
            
            {/* Paws */}
            {isDigging && (
                <div className="absolute top-8 left-1 w-8 h-2 bg-green-400 blur-[1px]"></div>
            )}
          </>
        );

      case CharacterType.CHIHUAHUA:
      default:
        return (
          <>
            {/* Head */}
            <div className="absolute top-1 left-2 w-6 h-5 bg-yellow-200 pixel-corners">
              {/* Ears */}
              <div className="absolute -top-2 -left-1 w-2 h-3 bg-yellow-700"></div>
              <div className="absolute -top-2 right-0 w-2 h-3 bg-yellow-700"></div>
              {/* Eyes */}
              {isDefeated ? (
                <>
                    <div className="absolute top-2 left-1 text-[8px] leading-none font-bold text-red-500">X</div>
                    <div className="absolute top-2 right-1 text-[8px] leading-none font-bold text-red-500">X</div>
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

            {/* Legs */}
            <div className="absolute top-9 left-3 w-1 h-1 bg-yellow-800"></div>
            <div className="absolute top-9 left-6 w-1 h-1 bg-yellow-800"></div>
            
            {/* Paws */}
            {isDigging && (
                <div className="absolute top-8 left-2 w-6 h-2 bg-yellow-500 blur-[1px]"></div>
            )}
          </>
        );
    }
  };

  // CSS for pixel art character and digging effect
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
        {renderCharacter()}
      </div>
    </div>
  );
};

export default PlayerCharacter;