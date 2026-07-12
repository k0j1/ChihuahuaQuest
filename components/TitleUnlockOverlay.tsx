import React, { useEffect } from 'react';
import { Title } from '../utils/titles';
import { Medal } from 'lucide-react';
import { THEME } from '../constants';

interface TitleUnlockOverlayProps {
  title: Title;
  lang: 'en' | 'ja';
  onClose: () => void;
}

const TitleUnlockOverlay: React.FC<TitleUnlockOverlayProps> = ({ title, lang, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-none">
      <div className="flex flex-col items-center justify-center animate-bounce-short">
        <div className="text-yellow-400 mb-4 animate-pulse">
          <Medal size={80} className="drop-shadow-lg" />
        </div>
        <div className="text-xl text-yellow-300 font-bold mb-1 drop-shadow-md tracking-widest uppercase">
          {lang === 'en' ? 'New Title Unlocked!' : '新しい称号を獲得！'}
        </div>
        <div className="text-4xl font-bold text-white drop-shadow-xl pixel-text-shadow bg-gradient-to-b from-yellow-100 to-yellow-500 bg-clip-text text-transparent p-2 text-center max-w-sm leading-tight">
          {lang === 'en' ? title.nameEn : title.nameJa}
        </div>
        <div className="mt-4 text-sm text-yellow-100/80 bg-black/40 px-4 py-1.5 rounded-full border border-yellow-500/30">
          {lang === 'en' ? title.conditionEn : title.conditionJa}
        </div>
      </div>
      
      {/* Sparkles/Confetti effect overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
              <div 
                  key={i} 
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                  style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`
                  }}
              />
          ))}
      </div>
    </div>
  );
};

export default TitleUnlockOverlay;
