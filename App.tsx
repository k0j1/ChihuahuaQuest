import React from 'react';
import { GameState } from './types';
import { useGameEngine } from './hooks/useGameEngine';

import GameMap from './components/GameMap';
import UIOverlay from './components/UIOverlay';
import DebugOverlay from './components/DebugOverlay';
import MiniMap from './components/MiniMap';
import TreasureDialog from './components/TreasureDialog';
import TitleScreen from './components/screens/TitleScreen';
import GameOverScreen from './components/screens/GameOverScreen';
import TreasureBookScreen from './components/screens/TreasureBookScreen';

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
    handleInteraction,
    handleDig,
    closeTreasureDialog,
    panCamera
  } = useGameEngine();

  // Screen Routing based on GameState
  switch (gameState) {
    case GameState.TITLE:
      return (
        <TitleScreen 
            onStart={startGame} 
            onOpenBook={openTreasureBook}
        />
      );

    case GameState.TREASURE_BOOK:
      return (
        <TreasureBookScreen 
            discoveredIds={discoveredCatalogIds} 
            onBack={resetGame} 
        />
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

export default App;