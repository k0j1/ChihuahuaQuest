import React from 'react';
import { FarcasterUser } from '../types';

interface UserBadgeProps {
  user: FarcasterUser | null;
  onClick: () => void;
}

const UserBadge: React.FC<UserBadgeProps> = ({ user, onClick }) => {
  if (!user) return null;

  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-[90] group active:scale-95 transition-transform"
      aria-label="User Profile"
    >
      <div className="relative">
        {/* Border / Background */}
        <div className="absolute inset-0 bg-yellow-400 rounded-full scale-110 border-2 border-white shadow-md"></div>
        
        {/* Avatar Image */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-900 bg-gray-200">
          {user.pfpUrl ? (
            <img 
              src={user.pfpUrl} 
              alt={user.displayName || "User"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl bg-blue-500 text-white font-bold">
              {user.username?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        {/* Status Dot */}
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
    </button>
  );
};

export default UserBadge;