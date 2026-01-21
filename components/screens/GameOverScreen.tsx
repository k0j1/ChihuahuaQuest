import React from 'react';
import { Clock, Skull, Trophy, Star } from 'lucide-react';
import { GameState, Treasure } from '../../types';

interface GameOverScreenProps {
  gameState: GameState;
  gold: number;
  collectedTreasures: Treasure[];
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ gameState, gold, collectedTreasures, onRestart }) => {
  const isTimeUp = gameState === GameState.TIME_UP;

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] w-screen bg-gradient-to-b from-sky-300 to-sky-600 text-gray-800 z-50 p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-10 left-10 text-white/30 text-6xl animate-pulse">☁️</div>
      <div className="absolute top-40 right-10 text-white/30 text-8xl animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>
      <div className="absolute bottom-20 left-20 text-white/30 text-5xl animate-pulse" style={{ animationDelay: '2s' }}>☁️</div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-xl p-6 pixel-corners shadow-2xl flex flex-col items-center border-4 border-white animate-bounce-in relative">
        
        {/* Header Badge */}
        <div className="-mt-12 bg-yellow-400 text-white px-10 py-3 rounded-full border-4 border-white shadow-lg mb-4 flex flex-col items-center transform rotate-[-2deg]">
             <div className="flex items-center gap-2">
                <Star className="text-yellow-200 fill-yellow-200" size={24} />
                <h1 className="text-4xl font-bold tracking-widest pixel-text-shadow">RESULT</h1>
                <Star className="text-yellow-200 fill-yellow-200" size={24} />
             </div>
        </div>

        {/* Sub Status Message */}
        <div className="mb-6 text-center font-bold">
             {isTimeUp ? (
                <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-100 px-4 py-1 rounded-full">
                    <Clock size={18} /> 
                    <span>タイムアップ！</span>
                </div>
             ) : (
                <div className="flex items-center justify-center gap-2 text-red-500 bg-red-100 px-4 py-1 rounded-full">
                    <Skull size={18} /> 
                    <span>力尽きてしまった...</span>
                </div>
             )}
        </div>

        {/* Score Box */}
        <div className="bg-slate-800 text-yellow-400 w-full p-4 rounded-lg mb-6 text-center pixel-corners relative overflow-hidden border-2 border-slate-600">
            <div className="text-xs text-slate-400 mb-1 tracking-widest uppercase">Total Score</div>
            <div className="text-4xl font-bold drop-shadow-md">{gold.toLocaleString()} <span className="text-xl">G</span></div>
            <Trophy className="absolute -bottom-4 -right-4 text-yellow-600 opacity-20 rotate-12" size={80} />
        </div>

        {/* Treasure List */}
        <div className="w-full flex-1 min-h-0 flex flex-col mb-6">
            <h3 className="text-center text-gray-500 text-xs font-bold mb-2 tracking-widest uppercase flex items-center justify-center gap-2">
                <span>獲得したお宝</span>
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{collectedTreasures.length}</span>
            </h3>
            
            {collectedTreasures.length === 0 ? (
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400 border-2 border-dashed border-gray-300 font-bold">
                    お宝ゼロ...次は頑張ろう！
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-2 overflow-y-auto max-h-[30vh] border-2 border-gray-200 space-y-2 scrollbar-hide">
                    {collectedTreasures.map((t) => (
                        <div key={t.id} className="flex items-center gap-3 bg-white p-2 rounded border border-gray-100 shadow-sm">
                            <div className="text-2xl bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full">{t.icon}</div>
                            <div className="flex-1 min-w-0 text-left">
                                <div className="text-sm font-bold truncate text-gray-800">{t.name}</div>
                                <div className="text-[10px] text-gray-500 truncate">{t.description}</div>
                            </div>
                            <div className="text-sm font-bold font-mono text-yellow-600">
                                {t.value} G
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        {/* Restart Button */}
        <button 
            onClick={onRestart}
            className="w-full py-4 bg-red-500 text-white font-bold rounded hover:bg-red-600 pixel-corners active:scale-95 transition-transform shadow-red-200 shadow-lg border-b-4 border-red-700 active:border-b-0 active:translate-y-1"
          >
            タイトルへ戻る
        </button>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GameOverScreen;