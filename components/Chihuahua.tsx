import React from 'react';
import { Direction } from '../types';

interface ChihuahuaProps {
  direction: Direction;
  isMoving: boolean;
  isDigging: boolean;
}

const Chihuahua: React.FC<ChihuahuaProps> = ({ direction, isMoving, isDigging }) => {
  // Determine animation class
  let animationClass = "";
  if (isDigging) {
    animationClass = "animate-dig";
  } else if (isMoving) {
    animationClass = "animate-bounce-short";
  }

  // CSS for pixel art chihuahua and digging effect
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${animationClass}`}>
      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.3s infinite;
        }

        @keyframes dig {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(2px) rotate(-10deg); }
          50% { transform: translateY(4px) rotate(0deg); }
          75% { transform: translateY(2px) rotate(10deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .animate-dig {
          animation: dig 0.2s infinite;
        }
        
        @keyframes throw-left {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(-20px, -10px) scale(0); opacity: 0; }
        }
        .animate-throw-left {
            animation: throw-left 0.4s infinite ease-out;
        }

        @keyframes throw-right {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(20px, -10px) scale(0); opacity: 0; }
        }
        .animate-throw-right {
            animation: throw-right 0.4s infinite ease-out 0.2s; /* Delayed for staggered effect */
        }
      `}</style>
      
      {/* Dirt Particles (Visible only when digging) */}
      {isDigging && (
        <>
            <div className="absolute bottom-1 left-2 w-2 h-2 bg-yellow-900 rounded-sm animate-throw-left z-0"></div>
            <div className="absolute bottom-1 right-2 w-2 h-2 bg-yellow-900 rounded-sm animate-throw-right z-0"></div>
            <div className="absolute bottom-2 left-4 w-1.5 h-1.5 bg-yellow-800 rounded-sm animate-throw-left" style={{ animationDelay: '0.1s' }}></div>
        </>
      )}

      {/* Sprite Container */}
      <div className={`w-10 h-10 relative transition-transform duration-100 z-10 ${
        direction === Direction.LEFT ? 'scale-x-[-1]' : ''
      }`}>
        {/* Head */}
        <div className="absolute top-1 left-2 w-6 h-5 bg-yellow-200 pixel-corners">
          {/* Ears */}
          <div className="absolute -top-2 -left-1 w-2 h-3 bg-yellow-700"></div>
          <div className="absolute -top-2 right-0 w-2 h-3 bg-yellow-700"></div>
          {/* Eyes */}
          <div className="absolute top-2 left-1 w-1 h-1 bg-black"></div>
          <div className="absolute top-2 right-1 w-1 h-1 bg-black"></div>
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