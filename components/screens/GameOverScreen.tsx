import React from 'react';
import { Clock, Skull } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-black text-white z-50 p-4">
      <div className="text-center mb-6">
          {isTimeUp ? (
              <Clock size={48} className="animate-bounce mx-auto mb-2 text-yellow-400" />
          ) : (
              <Skull size={48} className="animate-bounce mx-auto mb-2 text-red-500" />
          )}
          <h1 className="text-4xl font-bold pixel-text-shadow mb-2">
              {isTimeUp ? "TIME UP!" : "GAME OVER"}
          </h1>
          <div className="text-2xl text-yellow-400 font-bold pixel-text-shadow">
              TOTAL SCORE: {gold.toLocaleString()} G
          </div>
      </div>

      <div className="w-full max-w-md bg-gray-900 border-4 border-white rounded-lg p-4 mb-6 pixel-corners max-h-[45vh] overflow-y-auto">
          <h3 className="text-center text-gray-400 mb-4 border-b border-gray-700 pb-2 font-bold tracking-widest">
              獲得したお宝 ({collectedTreasures.length})
          </h3>
          
          {collectedTreasures.length === 0 ? (
              <div className="text-center text-gray-600 py-8">
                  お宝は見つからなかったワン...
              </div>
          ) : (
              <div className="space-y-3">
                  {collectedTreasures.map((t) => (
                      <div key={t.id} className="flex items-center gap-3 bg-gray-800 p-2 rounded pixel-corners">
                          <div className="text-2xl">{t.icon}</div>
                          <div className="flex-1 min-w-0 text-left">
                              <div className="text-sm font-bold truncate text-yellow-200">{t.name}</div>
                              <div className="text-xs text-gray-400 truncate">{t.description}</div>
                          </div>
                          <div className="text-sm font-mono text-right text-white">
                              {t.value} G
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
      
      <button 
          onClick={onRestart}
          className="px-8 py-4 bg-red-500 text-white font-bold rounded hover:bg-red-600 pixel-corners active:scale-95 transition-transform"
        >
          タイトルへ戻る
      </button>
    </div>
  );
};

export default GameOverScreen;