import React from 'react';
import { Enemy as EnemyType } from '../types';

interface EnemyProps {
  enemy: EnemyType;
}

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  const isDefeated = enemy.state === 'defeated';
  const isAttacking = enemy.state === 'attacking';

  const baseStyle = isDefeated ? "scale-0 opacity-0 transition-all duration-500" : "transition-transform duration-200";
  const attackStyle = isAttacking ? "scale-125 saturate-150" : "";

  // Common styles
  const wrapperClass = `relative w-full h-full flex items-center justify-center ${baseStyle} ${attackStyle}`;

  if (enemy.type === 'SNAKE' || enemy.type === 'SNAKE_VENOMOUS') {
    const isVenomous = enemy.type === 'SNAKE_VENOMOUS';
    const bodyColor = isVenomous ? 'bg-purple-600' : 'bg-green-600';
    const bodyColor2 = isVenomous ? 'bg-purple-500' : 'bg-green-500';
    const headColor = isVenomous ? 'bg-purple-400' : 'bg-green-400';
    const borderColor = isVenomous ? 'border-purple-700' : 'border-green-700';

    return (
      <div className={`${wrapperClass} animate-wiggle`}>
        
        {isDefeated && isVenomous && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-purple-500 mix-blend-screen animate-poison"></div>
            </div>
        )}
        
        {isAttacking && isVenomous && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-300 rounded-full blur-sm opacity-80 animate-pulse"></div>
        )}

        {/* Snake Sprite */}
        <div className="w-10 h-8 relative mt-2">
             {/* Body Segments */}
             <div className={`absolute bottom-0 left-0 w-8 h-3 ${bodyColor} rounded-full pixel-corners`}></div>
             <div className={`absolute bottom-2 left-1 w-6 h-3 ${bodyColor2} rounded-full`}></div>
             
             {/* Head */}
             <div className={`absolute bottom-3 left-4 w-4 h-4 ${headColor} rounded-full border-2 ${borderColor}`}></div>
             
             {/* Eyes */}
             <div className="absolute bottom-5 left-4.5 w-1 h-1 bg-yellow-300"></div>
             <div className="absolute bottom-5 left-6.5 w-1 h-1 bg-yellow-300"></div>
             
             {/* Tongue */}
             <div className="absolute bottom-4 left-7 w-2 h-0.5 bg-red-500 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (enemy.type === 'GHOST') {
    return (
        <div className={`${wrapperClass} animate-float opacity-80`}>
          
          {isDefeated && (
            <div className="absolute w-12 h-12 rounded-full border-4 border-blue-300 animate-ghost-die"></div>
          )}

          {/* Ghost Sprite */}
          <div className="w-8 h-8 relative">
               {/* Body */}
               <div className="absolute top-0 left-1 right-1 h-7 bg-blue-100 rounded-t-full pixel-corners shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
               {/* Tail */}
               <div className="absolute bottom-0 left-1 w-2 h-2 bg-blue-100 rounded-b-full"></div>
               <div className="absolute bottom-0 right-1 w-2 h-2 bg-blue-100 rounded-b-full"></div>
               <div className="absolute bottom-0 left-3 w-2 h-2 bg-blue-100 rounded-b-full"></div>
               
               {/* Eyes */}
               <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-blue-900 rounded-full"></div>
               <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-blue-900 rounded-full"></div>
               {/* Mouth */}
               <div className="absolute top-5 left-3 w-2 h-1 bg-blue-900 rounded-full"></div>
          </div>
        </div>
      );
  }

  // SLIME or SLIME_SPLITTING
  const isSplitting = enemy.type === 'SLIME_SPLITTING';
  const slimeColor = isSplitting ? 'bg-teal-400' : 'bg-blue-400';
  const highlightColor = isSplitting ? 'bg-teal-200' : 'bg-blue-200';

  return (
    <div className={`${wrapperClass} animate-bounce-slow`}>
      
      {isDefeated && isSplitting ? (
          // Split animation rendering
          <div className="absolute inset-0 flex items-center justify-center">
             <div className={`w-6 h-4 ${slimeColor} rounded-full shadow-sm animate-split-left`}></div>
             <div className={`w-6 h-4 ${slimeColor} rounded-full shadow-sm animate-split-right`}></div>
          </div>
      ) : isDefeated ? (
             <div className="absolute w-10 h-10 rounded-full bg-blue-300 animate-slime-die"></div>
      ) : (
          null
      )}

      {/* Slime Sprite */}
      <div className={`w-10 h-10 relative flex items-end justify-center pb-2 transition-opacity duration-200 ${isDefeated ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Tip (The little point on top) */}
        <div className={`absolute top-1 w-2 h-2 ${slimeColor} rounded-full`}></div>

        {/* Body */}
        <div className={`w-8 h-6 ${slimeColor} rounded-t-[1rem] rounded-b-xl pixel-corners shadow-sm relative z-10`}>
            
            {/* Shine/Highlight */}
            <div className="absolute top-1 left-1.5 w-2 h-1 bg-white opacity-40 rounded-full rotate-[-20deg]"></div>

            {/* Face Container */}
            <div className="absolute top-2 left-0 w-full h-full">
                {/* Eyes */}
                {isAttacking ? (
                    <>
                        <div className="absolute top-0.5 left-1 w-2 h-0.5 bg-red-600 rotate-45"></div>
                        <div className="absolute top-0.5 right-1 w-2 h-0.5 bg-red-600 -rotate-45"></div>
                    </>
                ) : (
                    <>
                        <div className="absolute top-0.5 left-1.5 w-1.5 h-1.5 bg-slate-800 rounded-full">
                            <div className="absolute top-0 right-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                        </div>
                        <div className="absolute top-0.5 right-1.5 w-1.5 h-1.5 bg-slate-800 rounded-full">
                             <div className="absolute top-0 right-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                        </div>
                    </>
                )}

                {/* Cheeks */}
                <div className="absolute top-2 left-0.5 w-1.5 h-1 bg-pink-300 opacity-60 rounded-full"></div>
                <div className="absolute top-2 right-0.5 w-1.5 h-1 bg-pink-300 opacity-60 rounded-full"></div>

                {/* Mouth */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-slate-800 rounded-b-full"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Enemy;