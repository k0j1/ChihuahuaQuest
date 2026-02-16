import React from 'react';
import { ArrowLeft, Shovel, Skull, Coins, BookOpen, Scroll } from 'lucide-react';
import { THEME } from '../../constants';

interface LitepaperScreenProps {
  onBack: () => void;
}

const LitepaperScreen: React.FC<LitepaperScreenProps> = ({ onBack }) => {
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
        
        <h2 className="text-xl font-bold text-yellow-400 pixel-text-shadow tracking-widest flex items-center gap-2">
          <Scroll size={20} />
          冒険の書
        </h2>
        
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8 pb-20">
        
        {/* Intro Section */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-yellow-300 border-b-2 border-yellow-600 pb-2 inline-block">
            チワワクエストとは
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            勇敢なドット絵チワワとなり、広大なフィールドを駆け巡ってお宝を探す2DアクションRPGです。<br/>
            制限時間60秒以内に、どれだけ多くの価値あるお宝を見つけられるかが勝負です。
          </p>
        </section>

        {/* How to Play */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-green-400 border-b-2 border-green-700 pb-2 inline-block">
            遊び方
          </h3>
          
          <div className="bg-gray-800 p-4 rounded-lg pixel-corners border border-gray-700 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 p-2 rounded shrink-0">
                <span className="text-xl">👆</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-300">移動する</h4>
                <p className="text-xs text-gray-400">
                  行きたい場所をタップすると、チワワがそこまで走ります。<br/>
                  長押しやドラッグでの操作は不要です。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-600 p-2 rounded shrink-0">
                <Shovel size={24} />
              </div>
              <div>
                <h4 className="font-bold text-orange-300">穴を掘る</h4>
                <p className="text-xs text-gray-400">
                  止まっている時に<span className="text-yellow-400">自分自身をタップ</span>するか、移動時に表示される「ショベルアイコン」が消えた後にタップすると穴を掘ります。<br/>
                  運が良ければお宝が見つかります！
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Entities */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-red-400 border-b-2 border-red-700 pb-2 inline-block">
            注意すべき存在
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded pixel-corners">
              <div className="w-10 h-10 bg-blue-400 rounded-t-xl rounded-b-md flex items-center justify-center text-xs">スライム</div>
              <div className="text-sm">
                <div className="font-bold text-blue-300">スライム</div>
                <div className="text-xs text-gray-500">ゆっくり近づいてくる。</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded pixel-corners">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-xs">ヘビ</div>
              <div className="text-sm">
                <div className="font-bold text-green-300">スネーク</div>
                <div className="text-xs text-gray-500">素早く動き回る危険な奴。</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded pixel-corners">
              <div className="w-10 h-10 bg-indigo-200 rounded-t-full flex items-center justify-center text-xs text-black">おばけ</div>
              <div className="text-sm">
                <div className="font-bold text-indigo-300">ゴースト</div>
                <div className="text-xs text-gray-500">壁をすり抜けて追ってくる。</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-red-400 text-xs mt-2 bg-red-900/30 p-2 rounded">
            <Skull size={14} />
            敵に触れると即ゲームオーバー！
          </div>
        </section>

        {/* Collection */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-purple-400 border-b-2 border-purple-700 pb-2 inline-block">
            コレクション要素
          </h3>
          <p className="text-gray-300 text-sm">
            お宝は全部で<span className="text-yellow-400 font-bold">400種類以上</span>！<br/>
            見つけたお宝は「お宝図鑑」に記録されます。
          </p>

          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 space-y-2 pixel-corners">
             <h4 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                <Coins size={14} className="text-yellow-400"/>
                レアリティと獲得スコア
             </h4>
             
             <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between p-2 bg-gray-900/50 rounded border-l-4 border-gray-500">
                    <span className="text-gray-400 font-bold">COMMON</span>
                    <span className="font-mono text-gray-300">~ 49 <span className="text-[10px]">$CHH</span></span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-900/50 rounded border-l-4 border-green-500">
                    <span className="text-green-400 font-bold">UNCOMMON</span>
                    <span className="font-mono text-gray-300">50 ~ 99 <span className="text-[10px]">$CHH</span></span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-900/50 rounded border-l-4 border-blue-500">
                    <span className="text-blue-400 font-bold">RARE</span>
                    <span className="font-mono text-gray-300">100 ~ 299 <span className="text-[10px]">$CHH</span></span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-900/50 rounded border-l-4 border-purple-500">
                    <span className="text-purple-400 font-bold">EPIC</span>
                    <span className="font-mono text-gray-300">300 ~ 999 <span className="text-[10px]">$CHH</span></span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-900/50 rounded border-l-4 border-yellow-500">
                    <span className="text-yellow-400 font-bold">LEGENDARY</span>
                    <span className="font-mono text-gray-300">1,000 ~ <span className="text-[10px]">$CHH</span></span>
                </div>
             </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 text-center text-gray-500 text-xs font-mono">
          Powered by Farcaster Frame SDK & Google Gemini<br/>
          Created for the Community
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