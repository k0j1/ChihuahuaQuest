import React, { useState, useEffect } from 'react';
import { ArrowLeft, Database, Upload, RefreshCw, Key } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useWriteContract, usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { TREASURE_REGISTRY } from '../../services/geminiService';

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
  },
  {
    "type": "event",
    "name": "RewardConfigUpdated",
    "inputs": [
      { "indexed": false, "name": "treasureId", "type": "uint256" },
      { "indexed": false, "name": "chhAmount", "type": "uint256" }
    ]
  }
] as const;

const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const [registeredSettings, setRegisteredSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const BATCH_SIZE = 100;
  const totalTreasures = TREASURE_REGISTRY.slice(0, 500);

  useEffect(() => {
    fetchRegisteredSettings();
  }, [publicClient]);

  const connectWallet = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    } else {
      setStatusMsg('ウォレットコネクターが見つかりません');
    }
  };

  const fetchRegisteredSettings = async () => {
    if (!publicClient) return;
    
    setIsLoading(true);
    setStatusMsg('報酬設定を読み込み中...');
    try {
      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: {
            "type": "event",
            "name": "RewardConfigUpdated",
            "inputs": [
              { "indexed": false, "name": "treasureId", "type": "uint256" },
              { "indexed": false, "name": "chhAmount", "type": "uint256" }
            ]
        },
        fromBlock: 0n
      });

      const currentSettings: Record<string, string> = {};
      logs.forEach(log => {
          const { treasureId, chhAmount } = log.args;
          if (treasureId !== undefined && chhAmount !== undefined) {
              currentSettings[treasureId.toString()] = formatUnits(chhAmount, 18);
          }
      });
      setRegisteredSettings(currentSettings);
      setStatusMsg('');
    } catch (error: any) {
      console.error(error);
      setStatusMsg(`読み込みに失敗しました: ${error.message || '不明なエラー'}`);
    } finally {
      setIsLoading(false);
    }
  };


  const registerBatch = async (startIndex: number) => {
    if (!isConnected || !address) {
      setStatusMsg('ウォレットを接続してください');
      return;
    }

    setIsLoading(true);
    setStatusMsg(`${startIndex + 1}〜${Math.min(startIndex + BATCH_SIZE, totalTreasures.length)}件目を登録中...`);

    try {
      const batch = totalTreasures.slice(startIndex, startIndex + BATCH_SIZE);
      const ids = batch.map(t => BigInt(t.catalogId));
      const amounts = batch.map(t => BigInt(t.value) * BigInt(10**18));

      // @ts-ignore
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'setTreasureRewards',
        args: [ids, amounts],
      });

      setStatusMsg(`トランザクション送信完了: ${hash.slice(0, 10)}... 承認待ち`);
      
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      
      setStatusMsg(`登録成功！`);
      fetchRegisteredSettings();
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
              {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '未接続'}
            </p>
          </div>
          {!isConnected ? (
            <button 
              onClick={connectWallet}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-bold"
            >
              接続
            </button>
          ) : (
            <button 
              onClick={() => disconnect()}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-sm font-bold"
            >
              切断
            </button>
          )}
        </div>

        {/* Status */}
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-400 text-sm">現在の登録状況</h3>
            <button 
              onClick={fetchRegisteredSettings}
              disabled={isLoading}
              className="p-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-3xl font-bold text-center py-2">
            <span className={Object.keys(registeredSettings).length === totalTreasures.length ? 'text-green-400' : 'text-yellow-400'}>
              {Object.keys(registeredSettings).length} <span className="text-lg text-gray-400">/ {totalTreasures.length}</span>
            </span>
          </p>

          {/* List display */}
          <div className="mt-4 max-h-40 overflow-y-auto bg-black/30 p-2 rounded text-xs font-mono">
            {Object.entries(registeredSettings).map(([id, amount]) => (
                <div key={id} className="flex justify-between py-1 border-b border-gray-700">
                    <span>ID: {id}</span>
                    <span className="text-yellow-400">{amount} CHH</span>
                </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700">
          <h3 className="text-gray-400 text-sm mb-4">報酬データ登録 (一括 {BATCH_SIZE}件)</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {batches.map((startIndex, idx) => (
              <button
                key={startIndex}
                onClick={() => registerBatch(startIndex)}
                disabled={isLoading || !isConnected}
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
