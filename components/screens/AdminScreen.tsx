import React, { useState, useEffect } from 'react';
import { ArrowLeft, Database, Upload, RefreshCw } from 'lucide-react';
import { createWalletClient, custom, createPublicClient } from 'viem';
import { TREASURE_REGISTRY } from '../../services/geminiService';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface AdminScreenProps {
  onBack: () => void;
}

const CONTRACT_ADDRESS = '0x9006cFA4bf5893586eDa1095E441998e059c440d';

const ABI = [
  {
    "inputs": [
      { "internalType": "uint256[]", "name": "treasureIds", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "chhAmounts", "type": "uint256[]" }
    ],
    "name": "setTreasureRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "treasureRewards",
    "outputs": [
      { "internalType": "uint256", "name": "chhAmount", "type": "uint256" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const [registeredCount, setRegisteredCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const BATCH_SIZE = 100;
  const totalTreasures = TREASURE_REGISTRY.slice(0, 500);

  useEffect(() => {
    checkRegisteredCount();
    checkWallet();
  }, []);

  const checkWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const client = createWalletClient({
          transport: custom(window.ethereum)
        });
        const [address] = await client.getAddresses();
        if (address) setWalletAddress(address);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const client = createWalletClient({
          transport: custom(window.ethereum)
        });
        const [address] = await client.requestAddresses();
        setWalletAddress(address);
      } catch (e) {
        setStatusMsg('ウォレット接続に失敗しました');
      }
    } else {
      setStatusMsg('MetaMaskなどのウォレットが見つかりません');
    }
  };

  const checkRegisteredCount = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setStatusMsg('ウォレットが見つからないため確認できません');
      return;
    }
    setIsLoading(true);
    setStatusMsg('登録件数を確認中...');
    try {
      const publicClient = createPublicClient({
        transport: custom(window.ethereum)
      });

      let count = 0;
      // Check in batches to avoid too many requests at once
      for (let i = 0; i < totalTreasures.length; i += 50) {
        const batch = totalTreasures.slice(i, i + 50);
        const promises = batch.map(t => 
          // @ts-ignore
          publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'treasureRewards',
            args: [BigInt(t.catalogId)]
          })
        );
        const results = await Promise.all(promises);
        count += results.filter((r: any) => r[1] === true).length;
      }
      setRegisteredCount(count);
      setStatusMsg('');
    } catch (error) {
      console.error(error);
      setStatusMsg('確認に失敗しました。ネットワークを確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const registerBatch = async (startIndex: number) => {
    if (!walletAddress) {
      setStatusMsg('ウォレットを接続してください');
      return;
    }

    setIsLoading(true);
    setStatusMsg(`${startIndex + 1}〜${Math.min(startIndex + BATCH_SIZE, totalTreasures.length)}件目を登録中...`);

    try {
      const walletClient = createWalletClient({
        transport: custom(window.ethereum)
      });

      const batch = totalTreasures.slice(startIndex, startIndex + BATCH_SIZE);
      const ids = batch.map(t => BigInt(t.catalogId));
      const amounts = batch.map(t => BigInt(t.value) * BigInt(10**18));

      // @ts-ignore
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'setTreasureRewards',
        args: [ids, amounts],
        account: walletAddress as `0x${string}`,
        chain: null
      });

      setStatusMsg(`トランザクション送信完了: ${hash.slice(0, 10)}... 承認待ち`);
      
      const publicClient = createPublicClient({
        transport: custom(window.ethereum)
      });
      
      await publicClient.waitForTransactionReceipt({ hash });
      
      setStatusMsg(`登録成功！`);
      checkRegisteredCount();
    } catch (error: any) {
      console.error(error);
      setStatusMsg(`エラー: ${error.message || '登録に失敗しました'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const batches = [];
  for (let i = 0; i < totalTreasures.length; i += BATCH_SIZE) {
    batches.push(i);
  }

  return (
    <div className="flex flex-col h-[100dvh] w-screen bg-gray-900 text-white relative overflow-hidden font-dotgothic">
      {/* Header */}
      <div className="flex-none p-4 bg-purple-900 border-b-4 border-purple-600 shadow-md z-20 flex justify-between items-center">
        <button 
            onClick={onBack}
            className="p-2 bg-purple-800 rounded hover:bg-purple-700 active:scale-95 pixel-corners"
        >
            <ArrowLeft />
        </button>
        
        <h2 className="text-xl font-bold text-purple-300 tracking-widest">
            ADMIN PANEL
        </h2>
        
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        
        {/* Contract Info */}
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700">
          <h3 className="text-gray-400 text-sm mb-1 flex items-center gap-2">
            <Database className="w-4 h-4" />
            コントラクトアドレス
          </h3>
          <p className="font-mono text-sm break-all text-yellow-400 bg-black/50 p-2 rounded">
            {CONTRACT_ADDRESS}
          </p>
        </div>

        {/* Wallet Info */}
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-gray-400 text-sm mb-1">ウォレット状態</h3>
            <p className="font-mono text-sm">
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '未接続'}
            </p>
          </div>
          {!walletAddress && (
            <button 
              onClick={connectWallet}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-bold"
            >
              接続
            </button>
          )}
        </div>

        {/* Status */}
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-400 text-sm">現在の登録状況</h3>
            <button 
              onClick={checkRegisteredCount}
              disabled={isLoading}
              className="p-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-3xl font-bold text-center py-2">
            {registeredCount !== null ? (
              <span className={registeredCount === totalTreasures.length ? 'text-green-400' : 'text-yellow-400'}>
                {registeredCount} <span className="text-lg text-gray-400">/ {totalTreasures.length}</span>
              </span>
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700">
          <h3 className="text-gray-400 text-sm mb-4">報酬データ登録 (一括 {BATCH_SIZE}件)</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {batches.map((startIndex, idx) => (
              <button
                key={startIndex}
                onClick={() => registerBatch(startIndex)}
                disabled={isLoading || !walletAddress}
                className="flex items-center justify-between px-4 py-3 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-bold transition-colors"
              >
                <span>バッチ {idx + 1} ({startIndex + 1}〜{Math.min(startIndex + BATCH_SIZE, totalTreasures.length)})</span>
                <Upload className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {statusMsg && (
          <div className="p-3 bg-black/50 border border-gray-600 rounded text-sm text-center">
            {statusMsg}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminScreen;
