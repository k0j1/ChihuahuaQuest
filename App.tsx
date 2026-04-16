import React, { useState } from 'react';
import { GameState } from './types';
import { useGameEngine } from './hooks/useGameEngine';
import { useFarcasterUser } from './hooks/useFarcasterUser';

import GameMap from './components/GameMap';
import UIOverlay from './components/UIOverlay';
import DebugOverlay from './components/DebugOverlay';
import MiniMap from './components/MiniMap';
import TreasureDialog from './components/TreasureDialog';
import TitleScreen from './components/screens/TitleScreen';
import GameOverScreen from './components/screens/GameOverScreen';
import TreasureBookScreen from './components/screens/TreasureBookScreen';
import LitepaperScreen from './components/screens/LitepaperScreen';
import UserBadge from './components/UserBadge';
import UserInfoModal from './components/UserInfoModal';

import AdminScreen from './components/screens/AdminScreen';

const App: React.FC = () => {
  const {
    gameState,
    timeLeft,
    mapData,
    playerPos,
    cameraPos,
    targetPos,
    enemies,
    direction,
    isMoving,
    gold,
    collectedTreasures,
    isDigging,
    sysMessage,
    foundTreasure,
    isGeneratingTreasure,
    fps,
    discoveredCatalogIds,
    isPendingDig,
    startGame,
    resetGame,
    openTreasureBook,
    openLitepaper, // Added
    openAdmin, // Added
    handleInteraction,
    handleDig,
    closeTreasureDialog,
    panCamera,
    currentPath // Added
  } = useGameEngine();

  // Farcaster User Integration
  const { user } = useFarcasterUser();
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const isAdmin = user?.fid === 406233;

  // Common UI Wrapper logic to include User Badge everywhere
  const renderUserLayer = () => {
    // Hide UserBadge on Litepaper and Admin screen to prevent overlap
    if (gameState === GameState.LITEPAPER || gameState === GameState.ADMIN) return null;

    return (
      <>
        <UserBadge user={user} onClick={() => setIsUserInfoOpen(true)} />
        {isUserInfoOpen && user && (
          <UserInfoModal 
              user={user} 
              gold={gold} 
              onClose={() => setIsUserInfoOpen(false)} 
          />
        )}
      </>
    );
  };

  // Screen Routing based on GameState
  const renderScreen = () => {
    switch (gameState) {
        case GameState.TITLE:
        return (
            <TitleScreen 
                onStart={startGame} 
                onOpenBook={openTreasureBook}
                onOpenLitepaper={openLitepaper}
                onOpenAdmin={openAdmin}
                isAdmin={isAdmin}
            />
        );

        case GameState.ADMIN:
        return (
            <AdminScreen onBack={resetGame} />
        );

        case GameState.TREASURE_BOOK:
        return (
            <TreasureBookScreen 
                discoveredIds={discoveredCatalogIds} 
                onBack={resetGame} 
            />
        );

        case GameState.LITEPAPER:
        return (
            <LitepaperScreen onBack={resetGame} />
        );

        case GameState.GAME_OVER:
        case GameState.TIME_UP:
        return (
            <GameOverScreen 
            gameState={gameState} 
            gold={gold} 
            collectedTreasures={collectedTreasures} 
            onRestart={resetGame} 
            />
        );

        case GameState.PLAYING:
        case GameState.TREASURE_FOUND:
        case GameState.DYING: // Render Game Map during Dying Animation
        return (
            <div className="relative w-screen h-[100dvh] bg-black overflow-hidden select-none">
            
            {mapData && (
                <GameMap 
                tiles={mapData.tiles} 
                playerPos={playerPos} 
                cameraPos={cameraPos}
                direction={direction}
                isMoving={isMoving}
                isDigging={isDigging}
                enemies={enemies}
                onInteract={handleInteraction}
                targetPos={targetPos}
                currentPath={currentPath} // Added
                panCamera={panCamera}
                isPendingDig={isPendingDig}
                isDefeated={gameState === GameState.DYING}
                />
            )}

            {/* Debug FPS Counter */}
            <DebugOverlay fps={fps} />
            
            {/* MiniMap */}
            {mapData && (
                <MiniMap 
                tiles={mapData.tiles} 
                playerPos={playerPos} 
                enemies={enemies} 
                />
            )}

            <UIOverlay 
                onDig={handleDig} 
                gold={gold} 
                isDigging={isDigging}
                message={sysMessage}
                timeLeft={timeLeft}
                isGeneratingTreasure={isGeneratingTreasure}
            />

            {foundTreasure && (
                <TreasureDialog treasure={foundTreasure} onClose={closeTreasureDialog} />
            )}
            </div>
        );
        
        default:
        return null;
    }
  };

  return (
    <>
        {renderScreen()}
        {renderUserLayer()}
    </>
  );
};

export default App;