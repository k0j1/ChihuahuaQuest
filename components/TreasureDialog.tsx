import React from 'react';
import { Treasure } from '../types';
import { THEME, getRarity } from '../constants';

interface TreasureDialogProps {
  treasure: Treasure;
  onClose: () => void;
  buttonLabel?: string;
}

const TreasureDialog: React.FC<TreasureDialogProps> = ({ treasure, onClose, buttonLabel = "ポケットに入れる" }) => {
  const rarity = getRarity(treasure.value);

  // Generate stars string
  const starsDisplay = "★".repeat(rarity.stars) + "☆".repeat(5 - rarity.stars);

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div 
        className={`w-full max-w-md rounded-lg p-1 pixel-corners animate-bounce-in shadow-2xl ${rarity.shadowClass}`}
        style={{ border: `4px solid ${THEME.colors.border}` }}
      >
        <div className={`p-6 rounded-inner flex flex-col items-center gap-4 text-center ${rarity.bgClass} relative overflow-hidden`}>
          
          {/* Background shine effect */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white opacity-10 rotate-45 blur-xl"></div>

          <div className="flex flex-col items-center z-10">
            <div className={`text-sm font-bold tracking-widest uppercase mb-1 ${rarity.colorClass} drop-shadow-md`}>
                {rarity.label}
            </div>
            <div className="text-white/70 text-xs font-mono">
                No.{treasure.catalogId.toString().padStart(3, '0')}
            </div>
            <div className="text-yellow-300 text-lg tracking-widest drop-shadow-md mt-1">
                {starsDisplay}
            </div>
          </div>

          <div className="text-7xl my-2 animate-pulse filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] z-10 scale-125">
            {treasure.icon}
          </div>

          <h2 className="text-2xl font-bold text-white pixel-text-shadow z-10 border-b-2 border-white/20 pb-2 w-full">
            {treasure.name}
          </h2>

          <p className="text-sm leading-relaxed text-white/90 z-10 bg-black/20 p-2 rounded">
            {treasure.description}
          </p>

          <div className="mt-2 px-6 py-2 bg-black/40 rounded-full border border-white/30 text-yellow-300 font-mono text-xl font-bold z-10">
            {treasure.value.toLocaleString()} G
          </div>

          <button
            onClick={onClose}
            className="mt-6 px-8 py-3 bg-red-500 hover:bg-red-600 border-b-4 border-red-800 text-white font-bold rounded pixel-corners active:translate-y-1 active:border-b-0 transition-all z-10 w-full"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TreasureDialog;