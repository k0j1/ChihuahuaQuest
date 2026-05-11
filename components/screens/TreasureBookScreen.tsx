import React, { useState, useMemo } from 'react';
import { TREASURE_REGISTRY } from '../../services/geminiService';
import { Treasure } from '../../types';
import { ArrowLeft, BookOpen, Star, Sparkles, Trophy, Share2 } from 'lucide-react';
import TreasureDialog from '../TreasureDialog';
import { getRarity } from '../../constants';
import { TreasureIcon } from '../TreasureIcon';

interface TreasureBookScreenProps {
  discoveredIds: number[];
  inventory: Record<string, { count: number, lastFound: number }>;
  onBack: () => void;
  isAdmin?: boolean;
}

const getLuxuryRarityStyle = (stars: number) => {
    switch (stars) {
        case 5:
            return {
                bg: 'bg-gradient-to-br from-[#4a0000] via-[#2a0000] to-[#110000]',
                border: 'border-[#ff4444]',
                shadow: 'shadow-[0_0_15px_rgba(255,68,68,0.6)] hover:shadow-[0_0_25px_rgba(255,68,68,0.8)]',
                innerBorder: 'border-[#ff8888] mix-blend-overlay',
                text: 'text-[#ffcccc]',
                badgeBg: 'bg-[#4a0000]',
            };
        case 4:
            return {
                bg: 'bg-gradient-to-br from-[#2a004a] via-[#15002a] to-[#0a0011]',
                border: 'border-[#a855f7]',
                shadow: 'shadow-[0_0_12px_rgba(168,85,247,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.7)]',
                innerBorder: 'border-[#d8b4fe] mix-blend-overlay',
                text: 'text-[#f3e8ff]',
                badgeBg: 'bg-[#2a004a]',
            };
        case 3:
            return {
                bg: 'bg-gradient-to-br from-[#4a3500] via-[#2a1d00] to-[#110c00]',
                border: 'border-[#eab308]',
                shadow: 'shadow-[0_0_10px_rgba(234,179,8,0.4)] hover:shadow-[0_0_18px_rgba(234,179,8,0.6)]',
                innerBorder: 'border-[#fef08a] mix-blend-overlay',
                text: 'text-[#fefce8]',
                badgeBg: 'bg-[#4a3500]',
            };
        case 2:
            return {
                bg: 'bg-gradient-to-br from-[#001f3f] via-[#001122] to-[#00050a]',
                border: 'border-[#60a5fa]',
                shadow: 'shadow-[0_0_8px_rgba(96,165,250,0.3)] hover:shadow-[0_0_15px_rgba(96,165,250,0.5)]',
                innerBorder: 'border-[#bfdbfe] mix-blend-overlay',
                text: 'text-[#eff6ff]',
                badgeBg: 'bg-[#001f3f]',
            };
        case 1:
        default:
            return {
                bg: 'bg-gradient-to-br from-[#222222] via-[#111111] to-[#000000]',
                border: 'border-[#8b6508]',
                shadow: 'shadow-lg hover:shadow-[0_0_12px_rgba(139,101,8,0.4)]',
                innerBorder: 'border-[#a37e2c] mix-blend-overlay',
                text: 'text-[#e5e5e5]',
                badgeBg: 'bg-[#222222]',
            };
    }
};

const TreasureBookScreen: React.FC<TreasureBookScreenProps & { lang: 'en' | 'ja' }> = ({ discoveredIds, inventory, onBack, isAdmin, lang }) => {
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);
  const [showAllAsAdmin, setShowAllAsAdmin] = useState(false);

  // Calculate completion percentage
  const total = TREASURE_REGISTRY.length;
  const discoveredCount = discoveredIds.length;
  const percentage = total > 0 ? ((discoveredCount / total) * 100).toFixed(1) : '0.0';
  
  // Total acquired count
  const totalAcquired = useMemo(() => {
    return Object.values(inventory).reduce((acc, item) => acc + item.count, 0);
  }, [inventory]);

  const handleShare = () => {
    const rarityStats = TREASURE_REGISTRY.reduce((acc, t) => {
        const rarity = getRarity(t.value);
        acc[rarity.stars] = (acc[rarity.stars] || 0) + (inventory[t.catalogId]?.count || 0);
        return acc;
    }, {} as Record<number, number>);

    const rarityText = Object.entries(rarityStats)
        .reverse()
        .map(([stars, count]) => `★${stars}: ${count}`)
        .join('\n');

    const text = `図鑑進捗: ${discoveredCount}/${total}
累計獲得数: ${totalAcquired}/500

【レアリティ別集計】
${rarityText}

#ChihuahuaQuest
https://farcaster.xyz/miniapps/EnmWQ9uvTlHa/chihuahuaquest`;

    navigator.clipboard.writeText(text);
    alert('共有用の文章をテキストコピーしました！');
  };

  const handleTreasureClick = (treasure: typeof TREASURE_REGISTRY[0]) => {
      // Show dialog if discovered OR admin mode enabled
      if (discoveredIds.includes(treasure.catalogId) || (isAdmin && showAllAsAdmin)) {
          // Construct a full Treasure object (id is dummy here as it's just for display)
          setSelectedTreasure({
              ...treasure,
              id: 'book-display',
              name: lang === 'en' ? (treasure.nameEn || treasure.name) : treasure.name,
              description: lang === 'en' ? (treasure.descriptionEn || treasure.description) : treasure.description,
          });
      }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen bg-[#1c0f0a] text-[#f4ecd8] relative overflow-hidden font-serif">
        {/* Decorative Leather Texture Overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '6px 6px' }}></div>
        
        {/* Heavy Gold Border Container */}
        <div className="absolute inset-1.5 border-[6px] border-[#8b6508] shadow-[inset_0_0_20px_rgba(0,0,0,1)] pointer-events-none rounded-lg z-0"></div>
        <div className="absolute inset-3 border-2 border-[#daa520] opacity-40 pointer-events-none rounded z-0"></div>

        {/* Header */}
        <div className="flex-none pt-10 pb-6 px-6 relative z-20 flex flex-col items-center bg-gradient-to-b from-[#2c1810] via-[#1a0f0a] to-transparent border-b-2 border-[#8b6508] shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px)' }}></div>
            
            <button 
                onClick={onBack}
                className="absolute left-6 top-10 p-2 text-[#daa520] hover:text-[#ffd700] hover:bg-white/5 rounded-full transition-all active:scale-95 z-30"
            >
                <ArrowLeft className="w-7 h-7 drop-shadow-md" />
            </button>
            <button 
                onClick={handleShare}
                className="absolute right-6 top-10 p-2 text-[#daa520] hover:text-[#ffd700] hover:bg-white/5 rounded-full transition-all active:scale-95 z-30"
            >
                <Share2 className="w-7 h-7 drop-shadow-md" />
            </button>
            
            <div className="flex items-center gap-4 mb-4 relative">
                <Sparkles className="text-[#ffd700] w-6 h-6 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#fffacd] via-[#ffd700] to-[#b8860b] tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,1)] filter">
                    {lang === 'en' ? 'TREASURES' : '財宝図鑑'}
                </h2>
                <Sparkles className="text-[#ffd700] w-6 h-6 animate-pulse" />
            </div>
            
            {isAdmin && (
                <button 
                  onClick={() => setShowAllAsAdmin(!showAllAsAdmin)}
                  className={`mt-2 px-4 py-1 rounded text-sm font-bold border ${showAllAsAdmin ? 'bg-red-900 border-red-500 text-white' : 'bg-green-900 border-green-500 text-white'}`}
                >
                  Admin Mode: {showAllAsAdmin ? 'ON' : 'OFF'}
                </button>
            )}
            
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-2 bg-black/60 py-3 px-8 rounded-full border border-[#8b6508] shadow-[inset_0_0_15px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.5)] backdrop-blur-sm relative z-20">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] md:text-xs text-[#daa520] tracking-widest uppercase font-bold mb-1">{lang === 'en' ? 'DISCOVERED' : '発見数'}</span>
                    <span className="font-mono font-bold text-xl md:text-2xl text-white drop-shadow-md">
                        {discoveredCount}<span className="text-[#8b6508] text-sm md:text-base">/{total}</span>
                    </span>
                </div>
                
                <div className="w-[2px] h-10 bg-gradient-to-b from-transparent via-[#8b6508] to-transparent"></div>
                
                <div className="flex flex-col items-center">
                    <span className="text-[10px] md:text-xs text-[#daa520] tracking-widest uppercase font-bold mb-1">{lang === 'en' ? 'TOTAL ACQUIRED' : '累計獲得数'}</span>
                    <div className="flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-[#ffd700]" />
                        <span className="font-mono font-bold text-xl md:text-2xl text-white drop-shadow-md">
                            {totalAcquired}
                        </span>
                    </div>
                </div>

                <div className="w-[2px] h-10 bg-gradient-to-b from-transparent via-[#8b6508] to-transparent hidden md:block"></div>
                
                <div className="flex flex-col items-center hidden md:flex">
                    <span className="text-[10px] md:text-xs text-[#daa520] tracking-widest uppercase font-bold mb-1">{lang === 'en' ? 'COMPLETION' : 'コンプリート率'}</span>
                    <span className="font-mono font-bold text-xl md:text-2xl text-[#ffd700] drop-shadow-[0_2px_2px_rgba(184,134,11,0.8)]">
                        {percentage}%
                    </span>
                </div>
            </div>
            
            {/* Mobile Complete Rate */}
            <div className="flex md:hidden items-center justify-center gap-2 mt-3 text-sm">
                <span className="text-[#daa520] font-bold">{lang === 'en' ? 'COMPLETION:' : 'コンプリート率:'}</span>
                <span className="font-mono font-bold text-[#ffd700] drop-shadow-md pb-0.5">{percentage}%</span>
            </div>
        </div>

        {/* Fancy Progress Bar */}
        <div className="w-full h-2 bg-[#0a0502] relative z-20 shadow-[inset_0_2px_4px_rgba(0,0,0,1)] border-b border-[#302010]">
            <div 
                className="h-full bg-gradient-to-r from-[#8b6508] via-[#ffd700] to-[#fffacd] transition-all duration-1000 ease-out shadow-[0_0_15px_#ffd700]"
                style={{ width: `${percentage}%` }}
            >
                <div className="w-full h-full opacity-50" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 50%, transparent)' }}></div>
            </div>
        </div>

        {/* Grid Content - The "Pages" */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide relative z-10 custom-scrollbar">
            {/* Page texture */}
            <div className="absolute inset-0 bg-[#fbf5e6] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-5 pb-16 relative z-10 w-full max-w-6xl mx-auto">
                {TREASURE_REGISTRY.map((treasure) => {
                    const isDiscovered = discoveredIds.includes(treasure.catalogId) || (isAdmin && showAllAsAdmin);
                    const rarity = getRarity(treasure.value);
                    const itemCount = inventory[treasure.catalogId]?.count || 0;
                    const style = getLuxuryRarityStyle(rarity.stars);
                    
                    return (
                        <div 
                            key={treasure.catalogId}
                            onClick={() => handleTreasureClick(treasure)}
                            className={`
                                relative aspect-square rounded-lg overflow-hidden flex flex-col items-center justify-center p-2 transition-all duration-300
                                ${isDiscovered 
                                    ? `cursor-pointer transform hover:-translate-y-1 ${style.bg} border ${style.border} ${style.shadow}` 
                                    : 'bg-[#150a06] border border-[#301a10] opacity-80 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]'
                                }
                            `}
                        >
                            {/* Inner border for discovered items */}
                            {isDiscovered && (
                                <div className={`absolute inset-0 border-[1.5px] ${style.innerBorder} opacity-60 m-1 rounded-[4px] pointer-events-none`}></div>
                            )}

                            {/* ID Badge */}
                            <div className={`absolute top-1 left-1.5 text-[9px] md:text-[10px] font-mono z-10 font-bold ${isDiscovered ? 'text-white/60' : 'text-[#503020]'}`}>
                                No.{treasure.catalogId.toString().padStart(3, '0')}
                            </div>

                            {isDiscovered ? (
                                <>
                                    {/* Icon */}
                                    <div className="text-4xl md:text-5xl flex justify-center mb-3 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] animate-bounce-in z-10 mt-1">
                                <TreasureIcon name={treasure.icon as string} value={treasure.value} className="w-12 h-12 text-[#f4ecd8]" />
                                    </div>
                                    
                                    {/* Name Plaque */}
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-6 pb-1.5 px-1.5 z-10">
                                        <div className={`text-[10px] md:text-[11px] text-center font-bold leading-tight w-full truncate drop-shadow-[0_1px_2px_rgba(0,0,0,1)] ${style.text}`}>
                                            {lang === 'en' ? (treasure.nameEn || treasure.name) : treasure.name}
                                        </div>
                                    </div>

                                    {/* Amount Badge */}
                                    <div className={`absolute top-1.5 right-1.5 flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 ${style.badgeBg} border ${style.border} rounded-full text-[9px] font-mono font-extrabold text-white shadow-[0_2px_4px_rgba(0,0,0,0.6)] z-20`}>
                                        x{itemCount}
                                    </div>

                                    {/* Rarity Stars */}
                                    <div className="absolute bottom-5 inset-x-0 flex justify-center z-10 opacity-90 mb-0.5">
                                        <div className={`text-[8px] md:text-[9px] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,1)] ${rarity.stars === 5 ? 'text-[#ffb6c1]' : rarity.stars === 4 ? 'text-[#e9d5ff]' : rarity.stars === 3 ? 'text-[#fef08a]' : rarity.stars === 2 ? 'text-[#bfdbfe]' : 'text-gray-300'}`}>
                                            {"★".repeat(rarity.stars)}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-3xl md:text-4xl font-serif text-[#301a10] font-bold flex flex-col items-center gap-2">
                                    <span className="drop-shadow-sm">?</span>
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
                buttonLabel={lang === 'en' ? 'CLOSE' : '閉じる'}
            />
        )}
        
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(10, 5, 2, 0.8); 
              border-left: 1px solid rgba(139, 101, 8, 0.3);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, #8b6508, #daa520, #8b6508);
              border-radius: 4px;
              border: 1px solid #1a0f0a;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(180deg, #daa520, #ffd700, #daa520);
          }
          
          .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #daa520 rgba(10, 5, 2, 0.8);
          }
          
          @keyframes bounce-in {
            0% { transform: scale(0.5); opacity: 0; filter: blur(4px); }
            60% { transform: scale(1.15); opacity: 1; filter: blur(0px); }
            100% { transform: scale(1); opacity: 1; filter: blur(0px); }
          }
          .animate-bounce-in {
            animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
        `}</style>
    </div>
  );
};

export default TreasureBookScreen;