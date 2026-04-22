import React, { useState, useEffect } from 'react';
import { usePublicClient, useAccount } from 'wagmi';
import { TREASURE_CONTRACT_ADDRESS, TREASURE_CONTRACT_ABI } from './constants';
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
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [treasureInventory, setTreasureInventory] = useState<Record<string, { count: number, lastFound: number }>>({});
  const publicClient = usePublicClient();
  const { address } = useAccount();

  useEffect(() => {
      if (!publicClient || !address) return;

      const fetchInventory = async () => {
          try {
              const logs = await publicClient.getLogs({
                  address: TREASURE_CONTRACT_ADDRESS,
                  event: TREASURE_CONTRACT_ABI[0],
                  args: { user: address },
                  fromBlock: 0n
              });

              const inventory: Record<string, { count: number, lastFound: number }> = {};
              logs.forEach(log => {
                  const { treasureIds, timestamp } = log.args;
                  if (!treasureIds || !timestamp) return;
                  treasureIds.forEach(id => {
                      const tId = id.toString();
                      if (!inventory[tId]) {
                          inventory[tId] = { count: 0, lastFound: 0 };
                      }
                      inventory[tId].count += 1;
                      if (Number(timestamp) > inventory[tId].lastFound) {
                          inventory[tId].lastFound = Number(timestamp);
                      }
                  });
              });
              setTreasureInventory(inventory);
          } catch (error) {
              console.error("財宝取得エラー:", error);
          }
      };
      fetchInventory();
  }, [publicClient, address]);

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
    setGameState,
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
  
  // Blockchain-based Treasure Discovery
  const [discoveredIds, setDiscoveredIds] = useState<number[]>([]);

  useEffect(() => {
      if (!publicClient || !address) return;

      const fetchDiscovered = async () => {
          try {
              // Fetch Treasure events
              const logs = await publicClient.getLogs({
                  address: TREASURE_CONTRACT_ADDRESS,
                  event: TREASURE_CONTRACT_ABI[0], // SessionCompleted
                  args: { user: address },
                  fromBlock: 0n
              });
              
              const uniqueIds = new Set<number>();
              logs.forEach(log => {
                  const { treasureIds } = log.args;
                  if (treasureIds) {
                      treasureIds.forEach(id => uniqueIds.add(Number(id)));
                  }
              });
              setDiscoveredIds(Array.from(uniqueIds));
          } catch (error) {
              console.error("図鑑取得エラー:", error);
          }
      };
      fetchDiscovered();
  }, [publicClient, address]);

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
            <div className="h-[100dvh] flex flex-col relative">
                <div className="absolute top-2 left-2 z-[60] text-white/50 text-[10px] bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm">
                   Ver 0.2.9
                </div>
                <div className="flex-1 overflow-hidden">
                    <TitleScreen 
                        onStart={startGame} 
                        onOpenBook={openTreasureBook}
                        onOpenLitepaper={openLitepaper}
                        onOpenAdmin={openAdmin}
                        isAdmin={isAdmin}
                    />
                </div>
                <BottomNav currentGameState={gameState} onNavigate={(state) => setGameState(state)} />
            </div>
        );

        case GameState.ADMIN:
        return (
            <AdminScreen onBack={resetGame} />
        );

        case GameState.TREASURE_BOOK:
        return (
            <div className="h-[100dvh] flex flex-col bg-slate-900">
                <div className="absolute top-2 left-2 z-[60] text-white/50 text-[10px] bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm">
                   Ver 0.2.9
                </div>
                <div className="flex-1 overflow-hidden">
                    <TreasureBookScreen 
                        discoveredIds={discoveredIds} 
                        inventory={treasureInventory}
                        onBack={resetGame} 
                    />
                </div>
                <BottomNav currentGameState={gameState} onNavigate={(state) => setGameState(state)} />
            </div>
        );

        case GameState.LITEPAPER:
        return (
            <div className="h-[100dvh] flex flex-col bg-slate-900">
                <div className="flex-1 overflow-hidden">
                    <LitepaperScreen onBack={resetGame} />
                </div>
                <BottomNav currentGameState={gameState} onNavigate={(state) => setGameState(state)} />
            </div>
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