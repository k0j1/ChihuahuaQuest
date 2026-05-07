import React, { useState } from 'react';
import { ArrowLeft, Shovel, Skull, Coins, BookOpen, Scroll, ShieldAlert, Sparkles, Map, Gem, Bone } from 'lucide-react';
import { THEME } from '../../constants';
import { GiDogBowl } from 'react-icons/gi';

interface LitepaperScreenProps {
  onBack: () => void;
  lang: 'en' | 'ja';
}

const LitepaperScreen: React.FC<LitepaperScreenProps> = ({ onBack, lang }) => {
  const isEnglish = lang === 'en';

  return (
    <div className="flex flex-col h-[100dvh] w-screen bg-[#0a0a0f] text-white relative overflow-hidden font-sans">
      
      {/* Background Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-700/40 via-transparent to-transparent z-0"></div>

      {/* Header */}
      <div className="flex-none p-4 bg-gray-900/80 backdrop-blur-md border-b border-yellow-900/50 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-20 flex justify-between items-center top-0 sticky">
        <button 
          onClick={onBack}
          className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-gray-300"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-600 tracking-widest flex items-center gap-2">
          <BookOpen strokeWidth={2.5} className="text-yellow-500" size={20} />
          {isEnglish ? 'LITEPAPER' : '冒険の書'}
        </h2>
        
        {/* Invisible placeholder to balance flex container if needed, or just let space-between work */}
        <div className="w-9" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 scrollbar-hide space-y-12 z-10 pb-32">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 mb-4">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl mb-2">
                 <Scroll className="text-yellow-500 w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]">
                 Chihuahua Quest
            </h1>
            <p className="text-yellow-500/80 uppercase tracking-[0.3em] text-xs font-bold">
                 {isEnglish ? 'Official Litepaper & Guide' : '公式ライトペーパー＆ガイド一覧'}
            </p>
        </section>

        {/* Intro Section */}
        <section className="backdrop-blur-sm bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-5">
              <GiDogBowl size={150} />
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Sparkles className="text-yellow-400" size={20}/>
            {isEnglish ? 'The Adventure Begins' : '冒険のはじまり'}
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-4 relative z-10 font-medium">
            {isEnglish ? (
                <>
                    Take on the role of a brave pixel-art Chihuahua and explore a vast, mysterious field.<br/>
                    Your mission: to unearth as many valuable treasures as possible within a strict 60-second time limit. Will you become the most legendary treasure hunter?
                </>
            ) : (
                <>
                    勇敢なドット絵チワワとなり、広大な謎のフィールドを駆け巡りましょう。<br/>
                    制限時間60秒以内に、どれだけ多くの価値あるお宝を見つけられるかが勝負の鍵です。伝説のトレジャーハンターになれるでしょうか？
                </>
            )}
          </p>
        </section>

        {/* How to Play Bento Grid */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
              <Map className="text-green-400" size={24} />
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {isEnglish ? 'Core Mechanics' : '遊び方'}
              </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Move Card */}
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-900/10 p-6 rounded-3xl border border-blue-500/20 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
              <div className="bg-blue-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                👆
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{isEnglish ? 'Tap to Dash' : 'タップでダッシュ'}</h4>
              <p className="text-sm text-blue-200/70 font-medium leading-relaxed">
                {isEnglish ? 
                  'Tap anywhere on the map, and your Chihuahua will sprint there instantly. No dragging, no holding—just pure agility.' : 
                  '行きたい場所をタップすると、チワワがそこまで一直線に走ります。長押しやドラッグ操作は一切不要の直感的な操作です。'
                }
              </p>
            </div>

            {/* Dig Card */}
            <div className="bg-gradient-to-br from-orange-900/40 to-orange-900/10 p-6 rounded-3xl border border-orange-500/20 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
              <div className="bg-orange-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-orange-400 group-hover:scale-110 transition-transform">
                <Shovel size={24} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{isEnglish ? 'Dig for Glory' : '穴を掘ってお宝ゲット'}</h4>
              <p className="text-sm text-orange-200/70 font-medium leading-relaxed">
                {isEnglish ? 
                  'When standing still, tap yourself. Or tap after the "Shovel Icon" appears during a run to dig down. If luck is on your side, treasure awaits!' : 
                  '立ち止まっている時に自分自身をタップ、または移動中に表示されるショベルアイコンが消えた後にタップで穴を掘ります！'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Entities (Enemies) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
              <ShieldAlert className="text-red-500" size={24} />
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {isEnglish ? 'Threats' : '注意すべき脅威'}
              </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Slime */}
            <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800 hover:border-red-500/30 transition-colors flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500/90 rounded-t-2xl rounded-b-lg flex items-center justify-center text-xs text-white font-black shadow-[0_4px_15px_rgba(59,130,246,0.4)] mb-4 transform hover:-translate-y-1 transition-transform">
                  SLIME
              </div>
              <div className="font-bold text-white mb-1">{isEnglish ? 'Slime' : 'スライム'}</div>
              <div className="text-xs text-gray-400">{isEnglish ? 'Approaches slowly but relentlessly.' : 'ゆっくりと、しかし確実に接近してくる。'}</div>
            </div>

            {/* Snake */}
            <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800 hover:border-red-500/30 transition-colors flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500/90 rounded-full flex items-center justify-center text-xs text-white font-black shadow-[0_4px_15px_rgba(34,197,94,0.4)] mb-4 transform hover:-translate-y-1 transition-transform">
                  SNAKE
              </div>
              <div className="font-bold text-white mb-1">{isEnglish ? 'Snake' : 'スネーク'}</div>
              <div className="text-xs text-gray-400">{isEnglish ? 'Moves erratically and quickly.' : '予測不能な素早い動きで妨害する。'}</div>
            </div>

            {/* Ghost */}
            <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800 hover:border-red-500/30 transition-colors flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-400/90 rounded-t-full flex items-center justify-center text-xs text-white font-black shadow-[0_4px_15px_rgba(129,140,248,0.4)] mb-4 transform hover:-translate-y-1 transition-transform">
                  GHOST
              </div>
              <div className="font-bold text-white mb-1">{isEnglish ? 'Ghost' : 'ゴースト'}</div>
              <div className="text-xs text-gray-400">{isEnglish ? 'Ignores obstacles, chases through walls.' : '障害物を無視し、壁をすり抜けて追跡。'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-red-300 text-sm bg-red-950/40 border border-red-900/50 p-4 rounded-2xl font-medium">
            <div className="bg-red-500/20 p-2 rounded-full shrink-0">
               <Skull size={18} className="text-red-400" />
            </div>
            {isEnglish ? 'Contact with any threat results in an immediate GAME OVER!' : 'いかなる脅威にも、触れた瞬間にゲームオーバーとなります！'}
          </div>
        </section>

        {/* Collection & Economy */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2">
                  <Gem className="text-purple-400" size={24} />
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {isEnglish ? 'Treasures & Economy' : 'コレクションと経済'}
                  </h3>
              </div>
              <div className="text-gray-400 text-sm font-medium">
                 {isEnglish ? 'Over ' : '総数 '}<span className="text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-md">400+</span>{isEnglish ? ' unique visual items' : ' 種類以上のアイテム'}
              </div>
          </div>

          <div className="bg-gray-900/40 rounded-3xl border border-gray-800 overflow-hidden">
             
             {/* Rarity Table */}
             <div className="grid grid-cols-1 divide-y divide-gray-800/80">
                <div className="flex items-center justify-between p-4 px-6 hover:bg-gray-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.8)]"></div>
                        <span className="text-gray-300 font-bold tracking-widest text-sm">COMMON</span>
                    </div>
                    <span className="font-mono text-gray-400 font-medium text-sm">1 ~ 99 <span className="text-[10px]">$CHH</span></span>
                </div>
                
                <div className="flex items-center justify-between p-4 px-6 hover:bg-gray-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                        <span className="text-green-400 font-bold tracking-widest text-sm">UNCOMMON</span>
                    </div>
                    <span className="font-mono text-gray-400 font-medium text-sm">100 ~ 999 <span className="text-[10px]">$CHH</span></span>
                </div>

                <div className="flex items-center justify-between p-4 px-6 hover:bg-gray-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                        <span className="text-blue-400 font-bold tracking-widest text-sm">RARE</span>
                    </div>
                    <span className="font-mono text-gray-400 font-medium text-sm">1,000 ~ 4,999 <span className="text-[10px]">$CHH</span></span>
                </div>

                <div className="flex items-center justify-between p-4 px-6 hover:bg-gray-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]"></div>
                        <span className="text-purple-400 font-bold tracking-widest text-sm">EPIC</span>
                    </div>
                    <span className="font-mono text-gray-400 font-medium text-sm">5,000 ~ 14,999 <span className="text-[10px]">$CHH</span></span>
                </div>

                <div className="flex items-center justify-between p-4 px-6 hover:bg-gray-800/40 transition-colors bg-yellow-500/5">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,1)]"></div>
                        <span className="text-yellow-400 font-black tracking-widest text-sm drop-shadow-md">LEGENDARY</span>
                    </div>
                    <span className="font-mono text-yellow-400/90 font-bold text-sm">15,000 ~ <span className="text-[10px]">$CHH</span></span>
                </div>
             </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-12 pb-8 flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
           <Bone className="text-gray-600 w-6 h-6 mb-3" />
           <div className="text-center text-gray-500 text-xs font-mono tracking-widest space-y-1">
             <p>POWERED BY FARCASTER FRAME SDK</p>
             <p>GENERATED WITH GOOGLE GEMINI</p>
             <p className="pt-2 text-gray-600">CREATED FOR THE COMMUNITY</p>
           </div>
        </div>

      </div>

      <style>{`
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

export default LitepaperScreen;