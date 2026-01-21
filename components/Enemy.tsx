import React from 'react';
import { Enemy as EnemyType } from '../types';

interface EnemyProps {
  enemy: EnemyType;
}

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  // Render different sprites based on enemy type
  
  if (enemy.type === 'SNAKE') {
    return (
      <div className="relative w-full h-full flex items-center justify-center animate-wiggle">
        <style>{`
          @keyframes wiggle {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px) rotate(-5deg); }
            75% { transform: translateX(2px) rotate(5deg); }
          }
          .animate-wiggle {
            animation: wiggle 0.5s infinite ease-in-out;
          }
        `}</style>
        {/* Snake Sprite */}
        <div className="w-10 h-8 relative mt-2">
             {/* Body Segments */}
             <div className="absolute bottom-0 left-0 w-8 h-3 bg-green-600 rounded-full pixel-corners"></div>
             <div className="absolute bottom-2 left-1 w-6 h-3 bg-green-500 rounded-full"></div>
             
             {/* Head */}
             <div className="absolute bottom-3 left-4 w-4 h-4 bg-green-400 rounded-full border-2 border-green-700"></div>
             
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
        <div className="relative w-full h-full flex items-center justify-center animate-float opacity-80">
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            .animate-float {
              animation: float 2s infinite ease-in-out;
            }
          `}</style>
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

  // Default: SLIME (Cute Blue Version)
  return (
    <div className="relative w-full h-full flex items-center justify-center animate-bounce-slow">
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: scale(1, 1) translateY(0); }
          50% { transform: scale(1.1, 0.9) translateY(4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s infinite ease-in-out;
        }
      `}</style>
      
      {/* Slime Sprite */}
      <div className="w-10 h-10 relative flex items-end justify-center pb-2">
        
        {/* Tip (The little point on top) */}
        <div className="absolute top-1 w-2 h-2 bg-blue-400 rounded-full"></div>

        {/* Body */}
        <div className="w-8 h-6 bg-blue-400 rounded-t-[1rem] rounded-b-xl pixel-corners shadow-sm relative z-10">
            
            {/* Shine/Highlight */}
            <div className="absolute top-1 left-1.5 w-2 h-1 bg-white opacity-40 rounded-full rotate-[-20deg]"></div>

            {/* Face Container */}
            <div className="absolute top-2 left-0 w-full h-full">
                {/* Eyes */}
                <div className="absolute top-0.5 left-1.5 w-1.5 h-1.5 bg-slate-800 rounded-full">
                    {/* Eye highlight */}
                    <div className="absolute top-0 right-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                </div>
                <div className="absolute top-0.5 right-1.5 w-1.5 h-1.5 bg-slate-800 rounded-full">
                     <div className="absolute top-0 right-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                </div>

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