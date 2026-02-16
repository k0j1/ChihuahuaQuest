import React from 'react';
import { FarcasterUser } from '../types';
import { X, User, ExternalLink } from 'lucide-react';
import { THEME } from '../constants';

interface UserInfoModalProps {
  user: FarcasterUser;
  onClose: () => void;
  gold: number;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ user, onClose, gold }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="w-full max-w-sm bg-white rounded-lg pixel-corners relative overflow-hidden flex flex-col items-center"
        style={{ border: `4px solid ${THEME.colors.primary}` }}
      >
        {/* Header Background */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-blue-500 to-blue-300"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white z-20 active:scale-90 transition-transform"
        >
          <X size={20} />
        </button>

        {/* Avatar */}
        <div className="relative mt-8 z-10">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-200">
                {user.pfpUrl ? (
                    <img 
                    src={user.pfpUrl} 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                        <User size={40} />
                    </div>
                )}
            </div>
            <div className="absolute bottom-1 right-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">
                ONLINE
            </div>
        </div>

        {/* User Info */}
        <div className="mt-4 pb-8 px-6 text-center w-full">
            <h2 className="text-2xl font-bold text-gray-800 pixel-text-shadow truncate">
                {user.displayName || user.username}
            </h2>
            <div className="text-gray-500 font-mono text-sm mb-4">
                @{user.username} (FID: {user.fid})
            </div>

            {/* Stats Card */}
            <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-200 mb-6 pixel-corners">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Current Wealth</div>
                <div className="text-3xl font-bold text-yellow-600 drop-shadow-sm">
                    {gold.toLocaleString()} <span className="text-lg text-yellow-700">G</span>
                </div>
            </div>

            {/* Action Buttons */}
            <a 
                href={`https://warpcast.com/${user.username}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white font-bold rounded pixel-corners hover:bg-purple-700 active:translate-y-1 transition-all"
            >
                <ExternalLink size={16} />
                Warpcastで見る
            </a>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;