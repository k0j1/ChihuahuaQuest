import React from 'react';
import { MapPin } from 'lucide-react';
import { GAME_CONFIG, THEME } from '../../constants';

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" 
        style={{ backgroundImage: `radial-gradient(${THEME.colors.primary} 2px, transparent 2px)`, backgroundSize: '32px 32px' }} 
      />
      
      <div className="z-10 text-center space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 pixel-text-shadow tracking-widest">
            チワワ<br/>クエスト
          </h1>
          <p className="text-gray-400 text-sm md:text-base">穴掘りトラップRPG</p>
        </div>

        <div className="w-32 h-32 mx-auto bg-yellow-200 rounded-full flex items-center justify-center border-4 border-yellow-600 shadow-xl">
            <span className="text-6xl">🐕</span>
        </div>
        
        <div className="text-sm text-gray-400">
            <p>制限時間: {GAME_CONFIG.GAME_DURATION}秒</p>
            <p>タップで移動！自分をタップで穴掘り！<br/>宝箱を見つけたら連打だ！</p>
        </div>

        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-red-500 font-lg rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 active:scale-95 pixel-corners"
        >
          <span className="mr-2">冒険に出る</span>
          <MapPin className="group-hover:animate-bounce" />
        </button>
      </div>
    </div>
  );
};

export default TitleScreen;