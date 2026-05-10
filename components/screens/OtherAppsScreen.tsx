import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface OtherAppsScreenProps {
  onBack: () => void;
  lang?: 'en' | 'ja';
}

const apps = [
  {
    name: 'RunningChihuahua',
    icon: 'https://runningchihuahua.k0j1.v2002.coreserver.jp/images/icon.png',
    link: 'https://farcaster.xyz/miniapps/3Si5HSEtMpTX/running-chihuahua'
  },
  {
    name: 'Reversi',
    icon: 'https://reversi.k0j1.v2002.coreserver.jp/images/icon.png',
    link: 'https://farcaster.xyz/miniapps/FYXr6t3KSLwo/reversi'
  },
  {
    name: 'MiningQuest',
    icon: 'https://miningquest.k0j1.v2002.coreserver.jp/images/icon.png',
    link: 'https://farcaster.xyz/k0j1/0x5c603e59'
  },
  {
    name: 'ChihuahuaStatus',
    icon: 'https://chihuahuaportal.k0j1.v2002.coreserver.jp/images/icon.png',
    link: 'https://farcaster.xyz/miniapps/do4iXTd8WOcp/chihuahua-status'
  }
];

const OtherAppsScreen: React.FC<OtherAppsScreenProps> = ({ onBack, lang = 'en' }) => {
  return (
    <div className="h-full w-full flex flex-col bg-slate-900 border-x-4 border-slate-700 relative text-white pb-[60px] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-800 border-b-4 border-slate-700 top-0 sticky z-10">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6 mr-1" />
          <span className="font-bold">{lang === 'ja' ? '戻る' : 'BACK'}</span>
        </button>
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 pixel-text-shadow tracking-widest uppercase">
          {lang === 'ja' ? 'その他のアプリ' : 'OTHER APPS'}
        </h2>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto w-full">
        {apps.map((app) => (
          <a
            key={app.name}
            href={app.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-slate-800 border-2 border-slate-600 rounded-xl hover:border-blue-400 transition-colors group"
          >
            <img 
              src={app.icon} 
              alt={app.name} 
              className="w-16 h-16 rounded-xl mr-4 object-cover border-2 border-slate-700 group-hover:border-blue-400 transition-colors" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/64?text=Icon';
              }}
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{app.name}</h3>
            </div>
            <ExternalLink className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default OtherAppsScreen;
