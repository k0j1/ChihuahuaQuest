import React, { useState, useEffect } from 'react';
import sdk from "@farcaster/frame-sdk";
import { Clock, Skull, Trophy, Star, Loader2, Share2 } from 'lucide-react';
import { GameState, Treasure } from '../../types';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { TREASURE_CONTRACT_ADDRESS, TREASURE_CONTRACT_ABI, getRarity } from '../../constants';
import { TreasureIcon } from '../TreasureIcon';

interface GameOverScreenProps {
  gameState: GameState;
  gold: number;
  collectedTreasures: Treasure[];
  onRestart: () => void;
  onClaimSuccess?: () => void;
  lang: 'en' | 'ja';
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ gameState, gold, collectedTreasures, onRestart, onClaimSuccess, lang }) => {
  const isTimeUp = gameState === GameState.TIME_UP;
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanClose(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const copyError = () => {
    if (errorDetail) {
      navigator.clipboard.writeText(errorDetail);
      setClaimStatus(prev => prev + (lang === 'en' ? " (Copied!)" : " (コピーしました！)"));
    }
  };

  const handleClaim = async () => {
    if (!isConnected || !address) {
       setClaimStatus(lang === 'en' ? 'Wallet not connected' : 'ウォレットが接続されていません');
       return;
    }
    if (collectedTreasures.length === 0) {
       setClaimStatus(lang === 'en' ? 'No treasures collected' : '獲得した財宝がありません');
       return;
    }

    setIsClaiming(true);
    setClaimStatus(lang === 'en' ? 'Fetching signature...' : '署名を取得中...');
    setErrorDetail(null); // Reset error

    try {
        const treasureIds = collectedTreasures.map(t => t.catalogId);
        
        // Fetch current nonce from contract
        const nonce = await publicClient.readContract({
            address: TREASURE_CONTRACT_ADDRESS,
            abi: TREASURE_CONTRACT_ABI,
            functionName: 'nonces',
            args: [address]
        }) as bigint;
        
        const apiUrl = import.meta.env.VITE_SIGNATURE_API_URL || '/api/sign.php';
        
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: address,
                treasureIds,
                nonce: Number(nonce)
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(lang === 'en' ? `Failed to get signature (Status: ${res.status}): ${errorText}` : `署名の取得に失敗しました (Status: ${res.status}): ${errorText}`);
        }

        const data = await res.json();
        const signature = data.signature;

        if (!signature || !signature.startsWith('0x')) {
            throw new Error(lang === 'en' ? "Received invalid signature data: " + JSON.stringify(data) : "無効な署名データを受信しました: " + JSON.stringify(data));
        }

        setClaimStatus(lang === 'en' ? "Sending transaction..." : "トランザクション送信中...");

        const hash = await writeContractAsync({
            address: TREASURE_CONTRACT_ADDRESS,
            abi: TREASURE_CONTRACT_ABI,
            functionName: 'recordGameSession',
            args: [treasureIds.map(id => BigInt(id)), nonce, signature as `0x${string}`]
        });

        setClaimStatus(lang === 'en' ? `Waiting for confirmation... (${hash.slice(0, 10)}...)` : `承認待ち... (${hash.slice(0, 10)}...)`);

        if (publicClient) {
            await publicClient.waitForTransactionReceipt({ hash });
        }

        setClaimStatus(lang === 'en' ? "Successfully claimed rewards!" : "報酬の獲得に成功しました！");
        if (onClaimSuccess) onClaimSuccess();

    } catch (err: any) {
        console.error(err);
        setClaimStatus(lang === 'en' ? `Error: ${err.message || 'Unknown error'}` : `エラー: ${err.message || '不明なエラー'}`);
        setErrorDetail(err.toString());
    } finally {
        setIsClaiming(false);
    }
  };

  const handleShare = async () => {
    const treasuresText = collectedTreasures.map(t => {
      const rarityStars = getRarity(t.value).stars;
      return `- [★${rarityStars}] ${lang === 'en' ? t.nameEn || t.name : t.name}`;
    }).join('\n');
    
    const textEn = `Rewards Obtained:
CHH Amount: ${gold} $CHH
Treasures:
${treasuresText}

#ChihuahuaQuest
https://farcaster.xyz/miniapps/EnmWQ9uvTlHa/chihuahuaquest`;

    const textJa = `獲得報酬:
CHH枚数: ${gold} $CHH
宝物:
${treasuresText}

#ChihuahuaQuest
https://farcaster.xyz/miniapps/EnmWQ9uvTlHa/chihuahuaquest`;

    const baseText = lang === 'en' ? textEn : textJa;
    
    // Extract the URL and hashtag
    const urlMatches = baseText.match(/(https?:\/\/[^\s]+)/g);
    const appUrl = urlMatches ? urlMatches[urlMatches.length - 1] : 'https://farcaster.xyz/miniapps/EnmWQ9uvTlHa/chihuahuaquest';
    
    // Text without the app URL (to pass as embed instead)
    const textWithoutUrl = baseText.replace(appUrl, '').trim();

    try {
        const intentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(textWithoutUrl)}&embeds[]=${encodeURIComponent(appUrl)}`;
        sdk.actions.openUrl(intentUrl);
    } catch (e) {
        navigator.clipboard.writeText(baseText);
        alert(lang === 'en' ? 'Copied to clipboard!' : '共有用の文章をテキストコピーしました！');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] w-screen bg-gradient-to-b from-sky-300 to-sky-600 text-gray-800 z-50 p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-10 left-10 text-white/30 text-6xl animate-pulse">☁️</div>
      <div className="absolute top-40 right-10 text-white/30 text-8xl animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>
      <div className="absolute bottom-20 left-20 text-white/30 text-5xl animate-pulse" style={{ animationDelay: '2s' }}>☁️</div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-xl p-6 pixel-corners shadow-2xl flex flex-col items-center border-4 border-white animate-bounce-in relative">
        
        {/* Header Badge */}
        <div className="-mt-12 bg-yellow-400 text-white px-10 py-3 rounded-full border-4 border-white shadow-lg mb-4 flex flex-col items-center transform rotate-[-2deg]">
             <div className="flex items-center gap-2">
                <Star className="text-yellow-200 fill-yellow-200" size={24} />
                <h1 className="text-4xl font-bold tracking-widest pixel-text-shadow">RESULT</h1>
                <Star className="text-yellow-200 fill-yellow-200" size={24} />
             </div>
        </div>

        {/* Sub Status Message */}
        <div className="mb-6 text-center font-bold">
             {isTimeUp ? (
                <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-100 px-4 py-1 rounded-full">
                    <Clock size={18} /> 
                    <span>{lang === 'en' ? 'Time Up!' : 'タイムアップ！'}</span>
                </div>
             ) : (
                <div className="flex items-center justify-center gap-2 text-red-500 bg-red-100 px-4 py-1 rounded-full">
                    <Skull size={18} /> 
                    <span>{lang === 'en' ? 'You exhausted your energy...' : '力尽きてしまった...'}</span>
                </div>
             )}
        </div>

        {/* Score Box */}
        <div className="bg-slate-800 text-yellow-400 w-full p-4 rounded-lg mb-6 text-center pixel-corners relative overflow-hidden border-2 border-slate-600">
            <div className="text-xs text-slate-400 mb-1 tracking-widest uppercase">Total Score</div>
            <div className="text-4xl font-bold drop-shadow-md">{gold.toLocaleString()} <span className="text-xl">$CHH</span></div>
            <Trophy className="absolute -bottom-4 -right-4 text-yellow-600 opacity-20 rotate-12" size={80} />
        </div>

        {/* Treasure List */}
        <div className="w-full flex-1 min-h-0 flex flex-col mb-4">
            <h3 className="text-center text-gray-500 text-xs font-bold mb-2 tracking-widest uppercase flex items-center justify-center gap-2">
                <span>{lang === 'en' ? 'Treasures Collected' : '獲得したお宝'}</span>
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{collectedTreasures.length}</span>
            </h3>
            
            {collectedTreasures.length === 0 ? (
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400 border-2 border-dashed border-gray-300 font-bold">
                    {lang === 'en' ? 'No treasures... Better luck next time!' : 'お宝ゼロ...次は頑張ろう！'}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-2 overflow-y-auto max-h-[25vh] border-2 border-gray-200 space-y-2 scrollbar-hide">
                    {collectedTreasures.map((t) => (
                        <div key={t.id} className="flex items-center gap-3 bg-white p-2 rounded border border-gray-100 shadow-sm">
                            <div className="text-2xl bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full">
                                <TreasureIcon name={t.icon} value={t.value} className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <div className="text-sm font-bold truncate text-gray-800">{lang === 'en' ? t.nameEn || t.name : t.name}</div>
                                <div className="text-[10px] text-gray-500 truncate">{lang === 'en' ? (t.descriptionEn || t.description) : t.description}</div>
                            </div>
                            <div className="text-sm font-bold font-mono text-yellow-600">
                                {t.value} $CHH
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        {/* Claim Status Message */}
        {claimStatus && (
            <div className="w-full mb-4">
                <div className={`p-2 text-xs font-bold text-center rounded border ${claimStatus.includes('エラー') || claimStatus.includes('Error') ? 'bg-red-100 text-red-600 border-red-300' : claimStatus.includes('成功') || claimStatus.includes('Successfully') ? 'bg-green-100 text-green-600 border-green-300' : 'bg-blue-100 text-blue-600 border-blue-300'}`}>
                    {claimStatus}
                </div>
                {errorDetail && (
                    <div className="mt-2 p-2 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-300 font-mono break-all max-h-24 overflow-y-auto">
                        {errorDetail}
                        <button 
                            onClick={copyError}
                            className="block mt-1 w-full bg-slate-700 hover:bg-slate-600 text-white py-1 rounded"
                        >
                            {lang === 'en' ? 'Copy Details' : '詳細をコピー'}
                        </button>
                    </div>
                )}
            </div>
        )}


        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
            <button 
                onClick={handleClaim}
                disabled={isClaiming || collectedTreasures.length === 0 || !!(claimStatus && (claimStatus.includes('成功') || claimStatus.includes('Successfully')))}
                className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded hover:bg-yellow-500 pixel-corners disabled:bg-gray-300 disabled:text-gray-500 transition-transform active:scale-95 shadow-lg border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
            >
                {isClaiming ? <Loader2 className="animate-spin w-5 h-5" /> : null}
                {claimStatus && (claimStatus.includes('成功') || claimStatus.includes('Successfully')) ? (lang === 'en' ? 'Already Claimed!' : '獲得済み！') : (lang === 'en' ? 'Claim Rewards ($CHH)' : '報酬を獲得する ($CHH)')}
            </button>

            {claimStatus && (claimStatus.includes('成功') || claimStatus.includes('Successfully')) && (
              <button 
                  onClick={handleShare}
                  className="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 pixel-corners active:scale-95 transition-transform shadow-blue-200 shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
              >
                  <Share2 className="w-5 h-5" />
                  {lang === 'en' ? 'Share' : '共有する'}
              </button>
            )}

            <button 
                onClick={onRestart}
                disabled={!canClose}
                className="w-full py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 pixel-corners active:scale-95 transition-transform shadow-red-200 shadow-lg border-b-4 border-red-700 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {lang === 'en' ? 'Back to Title' : 'タイトルへ戻る'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default GameOverScreen;
