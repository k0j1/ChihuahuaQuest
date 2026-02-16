import React from 'react';
import { MapPin, BookOpen, FileText } from 'lucide-react';
import { GAME_CONFIG, THEME } from '../../constants';
import Chihuahua from '../Chihuahua';
import { Direction } from '../../types';

interface TitleScreenProps {
  onStart: () => void;
  onOpenBook: () => void;
  onOpenLitepaper: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onOpenBook, onOpenLitepaper }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] w-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" 
        style={{ backgroundImage: `radial-gradient(${THEME.colors.primary} 2px, transparent 2px)`, backgroundSize: '32px 32px' }} 
      />
      
      {/* Litepaper Button */}
      <button 
        onClick={onOpenLitepaper}
        className="absolute top-4 left-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 active:scale-95 border-2 border-gray-600 shadow-lg z-50 pixel-corners group"
        aria-label="Litepaper"
      >
        <FileText className="text-gray-300 group-hover:text-yellow-400" />
        <span className="sr-only">ライトペーパー</span>
      </button>

      <div className="z-10 text-center space-y-8 animate-fade-in flex flex-col items-center">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 pixel-text-shadow tracking-widest">
            チワワ<br/>クエスト
          </h1>
          <p className="text-gray-400 text-sm md:text-base">穴掘りトラップRPG</p>
        </div>

        <div className="w-32 h-32 mx-auto bg-yellow-200 rounded-full flex items-center justify-center border-4 border-yellow-600 shadow-xl overflow-hidden relative">
            <div className="scale-[3]">
                <Chihuahua 
                    direction={Direction.DOWN} 
                    isMoving={true} 
                    isDigging={false} 
                />
            </div>
        </div>
        
        <div className="text-sm text-gray-400">
            <p>制限時間: {GAME_CONFIG.GAME_DURATION}秒</p>
            <p>タップで移動！自分をタップで穴掘り！<br/>宝箱を見つけたら連打だ！</p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
            <button 
              onClick={onStart}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-red-500 font-lg rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 active:scale-95 pixel-corners"
            >
              <span className="mr-2">冒険に出る</span>
              <MapPin className="group-hover:animate-bounce" />
            </button>

            <button 
              onClick={onOpenBook}
              className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-yellow-900 transition-all duration-200 bg-yellow-400 font-lg rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 active:scale-95 pixel-corners"
            >
              <span className="mr-2">お宝図鑑</span>
              <BookOpen className="group-hover:scale-110 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;