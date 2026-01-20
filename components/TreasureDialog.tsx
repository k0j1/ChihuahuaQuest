import React from 'react';
import { Treasure } from '../types';
import { THEME } from '../constants';

interface TreasureDialogProps {
  treasure: Treasure;
  onClose: () => void;
}

const TreasureDialog: React.FC<TreasureDialogProps> = ({ treasure, onClose }) => {
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md bg-white text-black rounded-lg p-1 pixel-corners animate-bounce-in"
        style={{ border: `4px solid ${THEME.colors.primary}` }}
      >
        <div className="bg-gray-800 text-white p-6 rounded-inner flex flex-col items-center gap-4 text-center">
          
          <div className="text-yellow-400 text-sm font-bold tracking-widest uppercase mb-2">
            お宝発見！
          </div>

          <div className="text-6xl animate-pulse filter drop-shadow-lg">
            {treasure.icon}
          </div>

          <h2 className="text-2xl font-bold text-yellow-300 pixel-text-shadow">
            {treasure.name}
          </h2>

          <div className="w-full h-px bg-gray-600 my-2"></div>

          <p className="text-sm leading-relaxed text-gray-300">
            {treasure.description}
          </p>

          <div className="mt-4 px-4 py-2 bg-blue-900 rounded border border-blue-500 text-blue-100 font-mono">
            価値: {treasure.value} G
          </div>

          <button
            onClick={onClose}
            className="mt-6 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded pixel-corners active:translate-y-1 transition-all"
          >
            ポケットに入れる
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