import React from 'react';
import { AlertTriangle, Home, Settings } from 'lucide-react';

interface MaintenanceScreenProps {
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
}

const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ onOpenAdmin, isAdmin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-slate-900 text-white p-4 font-dotgothic text-center">
      <AlertTriangle className="w-20 h-20 text-yellow-500 mb-6 animate-pulse" />
      <h1 className="text-4xl font-bold mb-4 tracking-wider">MAINTENANCE</h1>
      <p className="text-xl text-slate-300 mb-8 max-w-md leading-relaxed">
        現在メンテナンス中です。<br />
        時間を置いて再度アクセスしてください。
      </p>
      
      {isAdmin && onOpenAdmin && (
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors border border-slate-700"
        >
          <Settings className="w-5 h-5" />
          <span>管理画面へ (Admin)</span>
        </button>
      )}
    </div>
  );
};

export default MaintenanceScreen;
