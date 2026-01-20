import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GAME_CONFIG, THEME } from '../constants';
import { Shovel } from 'lucide-react';

interface JoystickProps {
  onMove: (vector: { x: number; y: number }) => void;
  onStop: () => void;
  onDig: () => void; // New prop for digging
  isActive: boolean;
}

const Joystick: React.FC<JoystickProps> = ({ onMove, onStop, onDig, isActive }) => {
  // Persistent position of the joystick base
  const [basePosition, setBasePosition] = useState<{ x: number; y: number } | null>(null);
  // Current drag position relative to base
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  // State to track if the user is currently touching
  const [isTouching, setIsTouching] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  // Track the maximum distance dragged during a single touch session
  // This helps distinguish between a sloppy tap (dig) and a small movement (move)
  const maxDragDistanceRef = useRef<number>(0);
  
  const maxRadius = GAME_CONFIG.JOYSTICK_MAX_RADIUS;
  // The radius within which a release counts as a "click" / "dig"
  // The shovel button is w-20 (80px), so radius is 40. 
  // We use a slightly forgiving threshold.
  const TAP_THRESHOLD = 40; 

  // Touch/Mouse Start
  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!isActive) return;
    
    setIsTouching(true);
    maxDragDistanceRef.current = 0;
    
    // Logic: If clicking near the existing base, use it. If far, move base.
    let newBaseX = clientX;
    let newBaseY = clientY;

    if (basePosition) {
        const dist = Math.sqrt(
            Math.pow(clientX - basePosition.x, 2) + 
            Math.pow(clientY - basePosition.y, 2)
        );
        // If touching inside the existing joystick area, keep base there
        if (dist < maxRadius * 1.5) {
            newBaseX = basePosition.x;
            newBaseY = basePosition.y;
            
            // Calculate initial drag distance if we grabbed the stick off-center
            // But for the logic of "did I move it?", we care about movement *after* grab
            // So we start maxDragDistance from 0 relative to the grab point?
            // Actually, for a virtual joystick that re-centers or persists, 
            // usually "Tap" means "Stayed within center area".
            
            // If the user taps the edge of the button, the initial dragPosition will be non-zero.
            // We should record this initial offset as part of the "movement" if we want strict center tapping,
            // OR we can calculate distance from the base center.
            // Let's stick to distance from base center.
            const initialDist = Math.sqrt(Math.pow(clientX - newBaseX, 2) + Math.pow(clientY - newBaseY, 2));
            maxDragDistanceRef.current = initialDist;
        }
    }

    setBasePosition({ x: newBaseX, y: newBaseY });
    setDragPosition({ x: clientX - newBaseX, y: clientY - newBaseY }); 
  }, [isActive, basePosition, maxRadius]);

  // Touch/Mouse Move
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isActive || !isTouching || !basePosition) return;

    const dx = clientX - basePosition.x;
    const dy = clientY - basePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Update max drag distance observed
    maxDragDistanceRef.current = Math.max(maxDragDistanceRef.current, distance);

    // Normalize and limit radius
    let limitedX = dx;
    let limitedY = dy;

    if (distance > maxRadius) {
      const angle = Math.atan2(dy, dx);
      limitedX = Math.cos(angle) * maxRadius;
      limitedY = Math.sin(angle) * maxRadius;
    }

    setDragPosition({ x: limitedX, y: limitedY });

    // Calculate normalized output vector (-1 to 1)
    const normalizedX = limitedX / maxRadius;
    const normalizedY = limitedY / maxRadius;
    onMove({ x: normalizedX, y: normalizedY });

  }, [isActive, isTouching, basePosition, onMove, maxRadius]);

  // Touch/Mouse End
  const handleEnd = useCallback(() => {
    if (!isActive || !isTouching) return;
    
    setIsTouching(false);
    
    // Check for Tap vs Drag
    // If the finger stayed within the button area (TAP_THRESHOLD) throughout the interaction
    if (maxDragDistanceRef.current < TAP_THRESHOLD) {
        onDig();
    }

    // Reset knob to center, but keep base position (Persistent Joystick)
    setDragPosition({ x: 0, y: 0 });
    onStop();
  }, [isActive, isTouching, onDig, onStop, TAP_THRESHOLD]);

  // Event Listeners
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd = () => handleEnd();

    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', onTouchStart, { passive: false });
      container.addEventListener('mousedown', onMouseDown);
    }
    
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      if (container) {
        container.removeEventListener('touchstart', onTouchStart);
        container.removeEventListener('mousedown', onMouseDown);
      }
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleStart, handleMove, handleEnd]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-40"
      style={{ touchAction: 'none' }}
    >
      {/* 
        Helper text if joystick hasn't been placed yet 
        Only show if never touched and game is active
      */}
      {!basePosition && isActive && (
        <div className="absolute bottom-20 left-0 right-0 text-center text-white/50 text-sm animate-pulse pointer-events-none">
          画面をタップして操作
        </div>
      )}

      {basePosition && (
        <div 
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{ 
            left: basePosition.x, 
            top: basePosition.y,
            transform: `translate(-50%, -50%)`,
            opacity: isTouching ? 1 : 0.4, // Fade out when not touching
          }}
        >
          {/* Base of the joystick */}
          <div 
            className="w-32 h-32 rounded-full border-4 backdrop-blur-sm transition-transform duration-100"
            style={{ 
              borderColor: isTouching ? THEME.colors.primary : THEME.colors.text, 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: isTouching ? 'scale(1.1)' : 'scale(1)'
            }}
          />
          
          {/* Stick/Knob/Shovel Button */}
          <div 
            className="absolute w-20 h-20 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
            style={{
              backgroundColor: isTouching ? THEME.colors.primary : '#4b5563', // Yellow when active, Grey when idle
              top: '50%',
              left: '50%',
              marginTop: -40, 
              marginLeft: -40, 
              transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
              boxShadow: `0 4px 6px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)`
            }}
          >
             {/* Shovel Icon */}
             <Shovel 
                size={32} 
                className={`text-white filter drop-shadow-md ${!isTouching ? 'opacity-80' : ''}`} 
             />
             
             {/* Shine effect */}
             <div className="absolute top-2 left-4 w-6 h-4 rounded-full bg-white opacity-40"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Joystick;