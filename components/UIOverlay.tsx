import React from 'react';
import { THEME } from '../constants';
import { Coins, Clock, Loader } from 'lucide-react';

interface UIOverlayProps {
  onDig: () => void;
  gold: number;
  isDigging: boolean;
  message: string | null;
  timeLeft: number;
  isGeneratingTreasure?: boolean;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gold, message, timeLeft, isGeneratingTreasure }) => {
  // Format time mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isLowTime = timeLeft <= 10;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-50">
      
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        {/* Gold Counter */}
        <div 
          className="flex items-center gap-2 px-4 py-2 rounded-lg pixel-corners"
          style={{ backgroundColor: THEME.colors.uiBg, color: THEME.colors.primary }}
        >
          <Coins size={20} />
          <span className="text-xl font-bold tracking-widest">{gold.toLocaleString()} G</span>
        </div>

        {/* Timer */}
        <div 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg pixel-corners ${isLowTime ? 'animate-pulse' : ''}`}
          style={{ 
            backgroundColor: THEME.colors.uiBg, 
            color: isLowTime ? THEME.colors.accent : '#fff',
            border: isLowTime ? `2px solid ${THEME.colors.accent}` : 'none'
          }}
        >
          <Clock size={20} />
          <span className="text-xl font-bold tracking-widest font-mono">{timeString}</span>
        </div>
      </div>

      {/* Message Log - Centered and larger for notifications */}
      {message && (
        <div className="absolute top-1/4 left-0 right-0 flex justify-center pointer-events-none">
           <div 
             className="px-8 py-4 rounded-xl text-lg font-bold shadow-2xl bg-black/80 text-white backdrop-blur-md border-2 border-yellow-400 animate-bounce-in text-center"
           >
             {message}
           </div>
        </div>
      )}

      {/* Treasure Generation Loading Overlay */}
      {isGeneratingTreasure && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-[60] backdrop-blur-sm pointer-events-auto">
             <div className="flex flex-col items-center gap-4 bg-gray-900 p-8 rounded-lg pixel-corners border-4 border-white animate-fade-in">
                <div className="relative">
                    <Loader size={48} className="text-yellow-400 animate-spin" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">✨</div>
                </div>
                <div className="text-xl font-bold text-white pixel-text-shadow tracking-widest animate-pulse">
                    お宝を鑑定中...
                </div>
             </div>
        </div>
      )}
      
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default UIOverlay;