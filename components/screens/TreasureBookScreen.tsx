import React, { useState, useMemo } from 'react';
import { TREASURE_REGISTRY } from '../../services/geminiService';
import { Treasure } from '../../types';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import TreasureDialog from '../TreasureDialog';
import { getRarity } from '../../constants';

interface TreasureBookScreenProps {
  discoveredIds: number[];
  onBack: () => void;
}

const TreasureBookScreen: React.FC<TreasureBookScreenProps> = ({ discoveredIds, onBack }) => {
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);

  // Calculate completion percentage
  const total = TREASURE_REGISTRY.length;
  const discoveredCount = discoveredIds.length;
  const percentage = Math.round((discoveredCount / total) * 100);

  const handleTreasureClick = (treasure: typeof TREASURE_REGISTRY[0]) => {
      // Only show dialog if discovered
      if (discoveredIds.includes(treasure.catalogId)) {
          // Construct a full Treasure object (id is dummy here as it's just for display)
          setSelectedTreasure({
              ...treasure,
              id: 'book-display',
          });
      }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Header */}
        <div className="flex-none p-4 bg-gray-800 border-b-4 border-yellow-600 shadow-md z-20 flex justify-between items-center">
            <button 
                onClick={onBack}
                className="p-2 bg-gray-700 rounded hover:bg-gray-600 active:scale-95 pixel-corners"
            >
                <ArrowLeft />
            </button>
            
            <h2 className="text-xl font-bold text-yellow-400 pixel-text-shadow tracking-widest">
                お宝図鑑
            </h2>
            
            <div className="text-sm font-mono text-gray-300">
                {discoveredCount}/{total}
            </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-700">
            <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 pb-8">
                {TREASURE_REGISTRY.map((treasure) => {
                    const isDiscovered = discoveredIds.includes(treasure.catalogId);
                    const rarity = getRarity(treasure.value);
                    
                    return (
                        <div 
                            key={treasure.catalogId}
                            onClick={() => handleTreasureClick(treasure)}
                            className={`
                                relative aspect-square rounded-lg pixel-corners flex flex-col items-center justify-center p-1 transition-all
                                ${isDiscovered 
                                    ? `${rarity.bgClass} border-2 ${rarity.borderClass} cursor-pointer hover:brightness-110 active:scale-95` 
                                    : 'bg-gray-900 border-2 border-gray-700 opacity-60'
                                }
                            `}
                        >
                            <div className="absolute top-1 left-1 text-[10px] text-white/50 font-mono z-10">
                                {treasure.catalogId.toString().padStart(3, '0')}
                            </div>

                            {isDiscovered ? (
                                <>
                                    <div className="text-3xl mb-1 filter drop-shadow-md animate-bounce-in z-10">
                                        {treasure.icon}
                                    </div>
                                    <div className="text-[10px] text-center text-white font-bold leading-tight w-full truncate px-1 z-10 drop-shadow-md">
                                        {treasure.name}
                                    </div>
                                    {/* Rarity Stars */}
                                    <div className="text-[8px] text-yellow-300 absolute top-1 right-1">
                                        {"★".repeat(rarity.stars)}
                                    </div>
                                </>
                            ) : (
                                <div className="text-2xl text-gray-600 font-bold">
                                    ?
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
        
        {/* Detail Modal */}
        {selectedTreasure && (
            <TreasureDialog 
                treasure={selectedTreasure} 
                onClose={() => setSelectedTreasure(null)}
                buttonLabel="閉じる"
            />
        )}
        
        <style>{`
          /* Custom scrollbar hiding */
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
          @keyframes bounce-in {
            0% { transform: scale(0); }
            60% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          .animate-bounce-in {
            animation: bounce-in 0.4s ease-out;
          }
        `}</style>
    </div>
  );
};

export default TreasureBookScreen;