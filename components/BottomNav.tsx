import React from 'react';
import { Home, Gem, BookOpen, LayoutGrid } from 'lucide-react';
import { GameState } from '../types';

interface BottomNavProps {
  currentGameState: GameState;
  onNavigate: (state: GameState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentGameState, onNavigate }) => {
  const navItems = [
    { name: 'Home', icon: Home, state: GameState.TITLE },
    { name: 'Treasure', icon: Gem, state: GameState.TREASURE_BOOK },
    { name: 'Paper', icon: BookOpen, state: GameState.LITEPAPER },
    { name: 'Apps', icon: LayoutGrid, state: GameState.OTHER_APPS },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t-2 border-slate-700 flex justify-around items-center p-2 z-[100] shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentGameState === item.state;
        return (
          <button
            key={item.name}
            onClick={() => onNavigate(item.state)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive ? 'text-yellow-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon size={24} />
            <span className="text-[10px] font-bold">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
