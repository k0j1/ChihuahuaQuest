import React from 'react';

export type TreasureIconType = 'sword' | 'shield' | 'wand' | 'book' | 'potion' | 'gem' | 'ring' | 'amulet' | 'coin' | 'chest' | 'scroll' | 'monster' | 'junk' | 'crown' | 'ore' | 'key' | 'bone' | 'music' | 'flower';

interface TreasureSVGProps {
  type: string;
  className?: string;
  color?: string;
}

export const TreasureSVG: React.FC<TreasureSVGProps> = ({ type, className = "w-8 h-8", color = "#ffd700" }) => {
  const t = type as TreasureIconType | string;

  switch (t) {
    case 'sword':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M14.5 4h5v5l-10 10-5-5 10-10Z" />
          <path d="m10.5 13.5-6 6" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'wand':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="m21 3-6 6" />
          <path d="m6 18-3 3" />
          <path d="M8 12a4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4" />
        </svg>
      );
    case 'book':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      );
    case 'potion':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M10 2v3m4-3v3m-2-5v5m-4 5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2z" />
          <path d="M8 14h8" />
        </svg>
      );
    case 'gem':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M4.5 10 12 21l7.5-11L16 4H8l-3.5 6z" />
          <path d="M12 21 8 4m4 17 4-17" />
          <path d="M4.5 10h15" />
        </svg>
      );
    case 'ring':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <circle cx="12" cy="14" r="6" />
          <path d="M10 6l2-3 2 3-2 3-2-3Z" fill="currentColor" />
        </svg>
      );
    case 'amulet':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M12 4v4M8 2h8M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
          <path d="M12 22v-3" />
        </svg>
      );
    case 'coin':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <path d="M12 9v6" />
        </svg>
      );
    case 'chest':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M3 10V6c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v4M3 10v9c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9" />
          <path d="M3 10h18M10 10v2h4v-2" />
        </svg>
      );
    case 'scroll':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5z" />
          <path d="M16 3v5h5" />
        </svg>
      );
    case 'monster':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M12 2c2 5 6 5 8 10 0 4-4 10-8 10S4 16 4 12c2-5 6-5 8-10Z" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="15" cy="12" r="1" />
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
        </svg>
      );
    case 'ore':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M18 4l4 4-4 12H6L2 8l4-4h12Z" />
          <path d="M6 8l6 12 6-12" />
          <path d="M2 8h20" />
        </svg>
      );
    case 'key':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
      );
    case 'bone':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M17 10c.88-1.5 1.76-3.32 3.12-4.68A3 3 0 0 0 15.88 1.08c-1.36 1.36-3.18 2.24-4.68 3.12M17 10c-1.5-.88-3.32-1.76-4.68-3.12M17 10l-10 10M11 4.2c-1.5.88-3.32 1.76-4.68 3.12C4.96 5.96 3 5 3 5s1 2.04 2.32 3.32c-.88 1.5-1.76 3.32-3.12 4.68M7 14c1.5.88 3.32 1.76 4.68 3.12M7 14l10-10M13 19.8c1.5-.88 3.32-1.76 4.68-3.12C19.04 18.04 21 19 21 19s-1-2.04-2.32-3.32c.88-1.5 1.76-3.32 3.12-4.68" />
        </svg>
      );
    default: // junk
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
          <path d="M4 14l6-6 4 4 6-6" />
          <path d="M4 14v6h6" />
        </svg>
      );
  }
};
