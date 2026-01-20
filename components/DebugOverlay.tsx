import React from 'react';

interface DebugOverlayProps {
  fps: number;
}

const DebugOverlay: React.FC<DebugOverlayProps> = ({ fps }) => {
  let color = 'text-green-400';
  if (fps < 30) color = 'text-red-500';
  else if (fps < 55) color = 'text-yellow-400';

  return (
    <div className="absolute top-2 left-2 z-[100] pointer-events-none">
      <div className={`font-mono text-xs font-bold bg-black/50 px-2 py-1 rounded ${color}`}>
        FPS: {Math.round(fps)}
      </div>
    </div>
  );
};

export default DebugOverlay;