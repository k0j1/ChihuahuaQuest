import React from 'react';
import { Enemy as EnemyType } from '../types';

interface EnemyProps {
  enemy: EnemyType;
}

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  // Render different sprites based on enemy type
  
  if (enemy.type === 'BAT') {
    return (
      <div className="relative w-full h-full flex items-center justify-center animate-flap">
        <style>{`
          @keyframes flap {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          .animate-flap {
            animation: flap 0.3s infinite ease-in-out;
          }
        `}</style>
        {/* Bat Sprite */}
        <div className="w-10 h-6 relative">
             {/* Wings */}
             <div className="absolute top-0 left-0 w-4 h-4 bg-purple-900 rounded-full"></div>
             <div className="absolute top-0 right-0 w-4 h-4 bg-purple-900 rounded-full"></div>
             {/* Body */}
             <div className="absolute top-1 left-3 w-4 h-4 bg-gray-900 rounded-full pixel-corners"></div>
             {/* Eyes */}
             <div className="absolute top-2 left-4 w-1 h-1 bg-red-500"></div>
             <div className="absolute top-2 right-4 w-1 h-1 bg-red-500"></div>
             {/* Fangs */}
             <div className="absolute top-4 left-4 w-0.5 h-1 bg-white"></div>
             <div className="absolute top-4 right-5 w-0.5 h-1 bg-white"></div>
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

  // Default: SLIME
  return (
    <div className="relative w-full h-full flex items-center justify-center animate-bounce-slow">
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.9) translateY(2px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1s infinite ease-in-out;
        }
      `}</style>
      
      {/* Slime Sprite */}
      <div className="w-8 h-8 relative">
        {/* Body */}
        <div className="absolute bottom-0 left-1 right-1 h-6 bg-red-500 rounded-t-xl rounded-b-md pixel-corners opacity-90 shadow-lg"></div>
        
        {/* Shine */}
        <div className="absolute top-3 left-2 w-1 h-1 bg-white opacity-60 rounded-full"></div>
        
        {/* Eyes */}
        <div className="absolute top-4 left-2 w-1.5 h-1.5 bg-black rounded-sm"></div>
        <div className="absolute top-4 right-2 w-1.5 h-1.5 bg-black rounded-sm"></div>
        
        {/* Angry Eyebrows */}
        <div className="absolute top-3 left-1.5 w-2 h-0.5 bg-black rotate-12"></div>
        <div className="absolute top-3 right-1.5 w-2 h-0.5 bg-black -rotate-12"></div>
      </div>
    </div>
  );
};

export default Enemy;