import React, { useState, useEffect } from 'react';
import { usePublicClient, useAccount } from 'wagmi';
import { TREASURE_CONTRACT_ADDRESS, TREASURE_CONTRACT_ABI } from './constants';
import { TREASURE_REGISTRY } from './services/geminiService';
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
  const [lang, setLang] = useState<'en' | 'ja'>('en');
  const [treasureInventory, setTreasureInventory] = useState<Record<string, { count: number, lastFound: number }>>({});
  const publicClient = usePublicClient();
  const { address } = useAccount();

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
  const [canClaim, setCanClaim] = useState(true); // Default to true for preview/fallback
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [rewardsLoaded, setRewardsLoaded] = useState(false);

  useEffect(() => {
        // Load local inventory fallback
        const localInvStr = localStorage.getItem('treasureInventory');
        const localIdsStr = localStorage.getItem('discoveredIds');
        
        let localInv = {};
        let localIds: number[] = [];
        
        try {
            if (localInvStr) localInv = JSON.parse(localInvStr);
            if (localIdsStr) localIds = JSON.parse(localIdsStr);
        } catch (e) {
            console.error("Local storage parse error", e);
        }
        
        setTreasureInventory(localInv);
        setDiscoveredIds(localIds);

        if (!publicClient || !address) return;

        const fetchData = async () => {
            try {
                // Fetch canClaimToday
                const claimable = await publicClient.readContract({
                    address: TREASURE_CONTRACT_ADDRESS,
                    abi: TREASURE_CONTRACT_ABI,
                    functionName: 'canClaimToday',
                    args: [address]
                }) as boolean;
                setCanClaim(claimable);

                // Fetch getPlayerInventory
                const [ids, counts] = (await publicClient.readContract({
                    address: TREASURE_CONTRACT_ADDRESS,
                    abi: TREASURE_CONTRACT_ABI,
                    functionName: 'getPlayerInventory',
                    args: [address as `0x${string}`]
                })) as [readonly bigint[], readonly bigint[]];
                
                const uniqueIds = new Set<number>();
                const inventory: Record<string, { count: number, lastFound: number }> = {};

                ids.forEach((id: bigint, index: number) => {
                    const numId = Number(id);
                    const count = Number(counts[index]);
                    uniqueIds.add(numId);
                    const strId = numId.toString();
                    inventory[strId] = { count: count, lastFound: 0 };
                });
                
                setDiscoveredIds(Array.from(uniqueIds));
                setTreasureInventory(inventory);

            } catch (error) {
                console.error("データ取得エラー:", error);
            }
        };

        const fetchRewards = async () => {
            try {
                const maxId = 500;
                const tokenIds = Array.from({ length: maxId }, (_, i) => i + 1);
                
                const results = await Promise.all(
                    tokenIds.map(id => 
                        publicClient.readContract({
                            address: TREASURE_CONTRACT_ADDRESS,
                            abi: TREASURE_CONTRACT_ABI,
                            functionName: 'treasureRewards',
                            // @ts-ignore
                            args: [BigInt(id)]
                        }).catch(() => [0n, false])
                    )
                );

                results.forEach((res: any, index) => {
                    const chhAmount = res[0] as bigint;
                    const exists = res[1] as boolean;
                    if (exists && TREASURE_REGISTRY[index]) {
                         TREASURE_REGISTRY[index].value = Number(chhAmount / 10n**18n);
                    }
                });
                setRewardsLoaded(true);
            } catch (error) {
                console.error("報酬取得エラー:", error);
            }
        };
        
        fetchData();
        fetchRewards();
    }, [publicClient, address, refreshTrigger]);

  // Ensure refresh when returning to TITLE
  useEffect(() => {
      if (gameState === GameState.TITLE) {
          setRefreshTrigger(prev => prev + 1);
      }
  }, [gameState]);

  // Save to local storage on game end
  useEffect(() => {
    if (gameState === GameState.GAME_OVER || gameState === GameState.TIME_UP) {
        if (collectedTreasures.length > 0) {
            const newIds = new Set(discoveredIds);
            const newInv = { ...treasureInventory };
            const now = Math.floor(Date.now() / 1000);
            
            let changed = false;
            collectedTreasures.forEach(t => {
                const numId = t.catalogId;
                const strId = numId.toString();
                if (!newIds.has(numId)) {
                    newIds.add(numId);
                    changed = true;
                }
                if (!newInv[strId]) {
                    newInv[strId] = { count: 0, lastFound: 0 };
                }
                newInv[strId].count += 1;
                newInv[strId].lastFound = now;
                changed = true;
            });

            if (changed) {
                const finalIds = Array.from(newIds);
                setDiscoveredIds(finalIds);
                setTreasureInventory(newInv);
                localStorage.setItem('discoveredIds', JSON.stringify(finalIds));
                localStorage.setItem('treasureInventory', JSON.stringify(newInv));
            }
        }
    }
  }, [gameState]);

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
              lang={lang}
              setLang={setLang}
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
                   Ver 0.3.34
                </div>
                <div className="flex-1 overflow-hidden">
                    <TitleScreen 
                        onStart={startGame} 
                        onOpenBook={openTreasureBook}
                        onOpenLitepaper={openLitepaper}
                        onOpenAdmin={openAdmin}
                        onResetSuccess={() => setRefreshTrigger(prev => prev + 1)}
                        isAdmin={isAdmin}
                        canClaim={canClaim}
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
                   Ver 0.3.34
                </div>
                <div className="flex-1 overflow-hidden">
                    <TreasureBookScreen 
                        discoveredIds={discoveredIds} 
                        inventory={treasureInventory}
                        onBack={resetGame}
                        isAdmin={isAdmin}
                        lang={lang}
                    />
                </div>
                <BottomNav currentGameState={gameState} onNavigate={(state) => setGameState(state)} />
            </div>
        );

        case GameState.LITEPAPER:
        return (
            <div className="h-[100dvh] flex flex-col bg-slate-900">
                <div className="flex-1 overflow-hidden">
                    <LitepaperScreen onBack={resetGame} lang={lang} />
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