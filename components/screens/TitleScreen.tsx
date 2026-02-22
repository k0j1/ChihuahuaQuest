import React from 'react';
import { MapPin, BookOpen, FileText, Play } from 'lucide-react';
import { GAME_CONFIG } from '../../constants';
import Chihuahua from '../Chihuahua';
import Enemy from '../Enemy';
import { Direction } from '../../types';

interface TitleScreenProps {
  onStart: () => void;
  onOpenBook: () => void;
  onOpenLitepaper: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onOpenBook, onOpenLitepaper }) => {
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden font-dotgothic select-none">
      
      {/* --- Scenery Background --- */}
      
      {/* Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3b82f6] via-[#f9a8d4] to-[#fde047] h-[65%] z-0"></div>
      
      {/* Sun */}
      <div className="absolute top-[15%] right-[20%] w-24 h-24 bg-[#fef08a] rounded-full shadow-[0_0_60px_rgba(253,224,71,0.8)] z-0 animate-pulse-slow"></div>

      {/* Clouds */}
      <div className="absolute top-[10%] left-[10%] w-32 h-12 bg-white/40 rounded-full blur-xl animate-float-slow"></div>
      <div className="absolute top-[20%] right-[40%] w-48 h-16 bg-white/30 rounded-full blur-xl animate-float-slower"></div>

      {/* Mountains */}
      <div className="absolute top-[30%] left-0 w-full h-[35%] z-10 pointer-events-none">
          {/* Back Mountain */}
          <div className="absolute bottom-0 left-[-10%] w-[60%] h-[80%] bg-[#4c1d95] clip-mountain"></div>
          {/* Front Mountain */}
          <div className="absolute bottom-0 right-[-10%] w-[70%] h-[90%] bg-[#5b21b6] clip-mountain"></div>
          {/* Middle Peak */}
          <div className="absolute bottom-0 left-[30%] w-[40%] h-[100%] bg-[#6d28d9] clip-mountain"></div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-[35%] bg-[#4ade80] z-20 overflow-hidden">
          {/* Texture pattern */}
          <div className="absolute inset-0 opacity-10" 
            style={{ backgroundImage: `radial-gradient(#14532d 1px, transparent 1px)`, backgroundSize: '16px 16px' }} 
          />
          
          {/* Path */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[100%] bg-[#d97706] clip-path-perspective opacity-90"></div>
          
          {/* Grass Tufts Decoration */}
          <div className="absolute bottom-[20%] left-[10%] text-green-700 text-xl">🌱</div>
          <div className="absolute bottom-[30%] right-[15%] text-green-700 text-xl">🌿</div>
          <div className="absolute bottom-[10%] left-[25%] text-green-700 text-lg">🌱</div>
      </div>

      {/* Trees (CSS Triangles) */}
      <div className="absolute bottom-[30%] left-[-5%] z-20">
          <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[120px] border-b-[#1e3a8a]"></div>
          <div className="w-4 h-10 bg-[#3f2e18] mx-auto mt-[-10px]"></div>
      </div>
      <div className="absolute bottom-[32%] right-[-2%] z-20">
          <div className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[140px] border-b-[#1e3a8a]"></div>
          <div className="w-6 h-12 bg-[#3f2e18] mx-auto mt-[-10px]"></div>
      </div>


      {/* --- Characters & Objects in Scene --- */}
      
      {/* Treasure Chest (Closed) */}
      <div className="absolute bottom-[40%] left-[15%] z-30 scale-150">
          <div className="w-8 h-6 bg-yellow-700 border-2 border-yellow-900 rounded-sm relative">
              <div className="absolute top-2 left-0 w-full h-1 bg-black/20"></div>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-sm border border-yellow-900"></div>
          </div>
      </div>

      {/* Treasure Chest (Open with sparkles) */}
      <div className="absolute bottom-[38%] right-[20%] z-30 scale-150 animate-bounce-subtle">
           <div className="relative">
              {/* Lid (Open) */}
              <div className="w-8 h-3 bg-yellow-800 border-2 border-yellow-950 rounded-sm absolute -top-3 left-0 origin-bottom-left -rotate-12"></div>
              {/* Body */}
              <div className="w-8 h-5 bg-yellow-700 border-2 border-yellow-900 rounded-sm flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-yellow-400 opacity-50 animate-pulse"></div>
              </div>
              {/* Sparkles */}
              <div className="absolute -top-6 left-0 text-yellow-300 animate-ping text-xs">✨</div>
              <div className="absolute -top-4 right-[-10px] text-yellow-300 animate-ping delay-100 text-xs">✨</div>
           </div>
      </div>

      {/* Main Character: Chihuahua */}
      <div className="absolute bottom-[35%] left-[42%] z-40 scale-[2.5]">
          <Chihuahua direction={Direction.RIGHT} isMoving={false} isDigging={false} />
      </div>

      {/* Enemy: Slime */}
      <div className="absolute bottom-[35%] left-[58%] z-40 scale-[2.5]">
          <Enemy enemy={{ id: 'title-slime', x: 0, y: 0, type: 'SLIME' }} />
      </div>


      {/* --- UI Overlay --- */}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-between py-12 pointer-events-none">
          
          {/* Header Area */}
          <div className="flex flex-col items-center space-y-4 pointer-events-auto animate-drop-in mt-8">
              <div className="relative">
                  {/* Decorative Ornaments */}
                  <div className="absolute -top-8 -left-10 text-3xl animate-pulse select-none">✨</div>
                  <div className="absolute -bottom-4 -right-10 text-3xl animate-pulse delay-300 select-none">✨</div>
                  <div className="absolute top-0 -right-12 text-2xl animate-bounce select-none">⭐</div>
                  <div className="absolute -bottom-6 -left-12 text-2xl animate-bounce delay-150 select-none">⭐</div>
                  
                  {/* Decorative lines */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>

                  <h1 className="text-5xl md:text-7xl font-black text-black dq-text-shadow tracking-widest text-center" style={{ fontFamily: 'serif' }}>
                    CHIHUAHUA<br/>QUEST
                  </h1>
              </div>
              <div className="bg-black/60 px-6 py-2 rounded-xl backdrop-blur-sm border-2 border-[#9F7928] flex flex-col items-center gap-1">
                  <p className="text-[#FDB931] text-sm md:text-base font-bold tracking-wider uppercase">Digging Trap RPG</p>
                  <div className="w-full h-px bg-[#9F7928]/50 my-0.5"></div>
                  <p className="text-[#FDB931] text-xs font-bold tracking-wider uppercase">TIME LIMIT: {GAME_CONFIG.GAME_DURATION}s</p>
              </div>
          </div>

          {/* Center Action Area */}
          <div className="flex flex-col items-center gap-6 pointer-events-auto mt-auto mb-8 w-full max-w-md px-4">
              
              {/* START BUTTON */}
              <button 
                onClick={onStart}
                className="group relative flex items-center justify-center w-full py-6 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white border-2 border-white/40 shadow-[0_6px_0_#7f1d1d,0_10px_10px_rgba(0,0,0,0.5)] active:shadow-[0_2px_0_#7f1d1d,0_4px_4px_rgba(0,0,0,0.5)] active:translate-y-1 transition-all rounded-xl"
              >
                <div className="absolute inset-0 rounded-xl border-4 border-white/10"></div>
                <Play className="w-8 h-8 mr-3 fill-current group-hover:animate-pulse filter drop-shadow-md" />
                <span className="text-3xl font-bold tracking-widest pixel-text-shadow">START</span>
              </button>

              {/* Sub Buttons */}
              <div className="flex gap-4 w-full">
                  <button 
                    onClick={onOpenBook}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-yellow-950 border-2 border-white/40 shadow-[0_4px_0_#713f12,0_6px_6px_rgba(0,0,0,0.3)] active:shadow-[0_1px_0_#713f12,0_2px_2px_rgba(0,0,0,0.3)] active:translate-y-1 transition-all rounded-lg"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span className="font-bold">CATALOG</span>
                  </button>

                  <button 
                    onClick={onOpenLitepaper}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-b from-slate-500 to-slate-700 hover:from-slate-400 hover:to-slate-600 text-white border-2 border-white/40 shadow-[0_4px_0_#1e293b,0_6px_6px_rgba(0,0,0,0.3)] active:shadow-[0_1px_0_#1e293b,0_2px_2px_rgba(0,0,0,0.3)] active:translate-y-1 transition-all rounded-lg"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    <span className="font-bold">LITEPAPER</span>
                  </button>
              </div>
          </div>

          {/* Footer Info */}
          <div className="text-white/60 text-[10px] text-center pointer-events-auto bg-black/40 px-4 py-1 rounded-full backdrop-blur-md mb-2">
              <p>Ver 0.2.0</p>
          </div>
      </div>

      {/* CSS Styles for Shapes */}
      <style>{`
        .clip-mountain {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        .clip-path-perspective {
            clip-path: polygon(40% 0, 60% 0, 100% 100%, 0% 100%);
        }
        .pixel-text-shadow {
            text-shadow: 2px 2px 0 #000;
        }
        .dq-text-shadow {
            text-shadow: 
                3px 3px 0 #fffbeb,
                -1px -1px 0 #fffbeb,  
                1px -1px 0 #fffbeb,
                -1px 1px 0 #fffbeb,
                1px 1px 0 #fffbeb;
            filter: drop-shadow(0 5px 10px rgba(255, 251, 235, 0.6));
        }
        @keyframes float-slow {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10px, 5px); }
        }
        .animate-float-slow {
            animation: float-slow 8s infinite ease-in-out;
        }
        .animate-float-slower {
            animation: float-slow 12s infinite ease-in-out reverse;
        }
        @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-pulse-slow {
            animation: pulse-slow 4s infinite ease-in-out;
        }
        @keyframes drop-in {
            0% { transform: translateY(-50px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        .animate-drop-in {
            animation: drop-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0) scale(1.5); }
            50% { transform: translateY(-5px) scale(1.5); }
        }
        .animate-bounce-subtle {
            animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TitleScreen;