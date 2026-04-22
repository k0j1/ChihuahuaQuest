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
      // 1-500までのIDリストを作成
      const ids = Array.from({ length: 500 }, (_, i) => i + 1);
      
      // プロミスを作成して並列で実行
      const results = await Promise.all(
        ids.map(id => 
          publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'treasureRewards',
            args: [BigInt(id)]
          })
        )
      );

      // データの整形 (resは [chhAmount, exists] のタプル)
      const currentSettings: Record<string, string> = {};
      results.forEach((res: any, index) => {
        const chhAmount = res[0];
        const exists = res[1];
        if (exists) {
          currentSettings[ids[index].toString()] = formatUnits(chhAmount, 18);
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


  const [editableAmounts, setEditableAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    setEditableAmounts(registeredSettings);
  }, [registeredSettings]);

  const updateAmount = (id: string, value: string) => {
    setEditableAmounts(prev => ({ ...prev, [id]: value }));
  };

  const saveRewards = async () => {
    if (!isConnected || !address) {
      setStatusMsg('ウォレットを接続してください');
      return;
    }

    setIsLoading(true);
    setStatusMsg('報酬データを保存中...');

    try {
      const ids: bigint[] = [];
      const amounts: bigint[] = [];

      totalTreasures.forEach(t => {
        const id = t.catalogId;
        const amount = editableAmounts[id] || '0';
        ids.push(BigInt(id));
        amounts.push(BigInt(Math.floor(parseFloat(amount) * 10**18)));
      });

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
      setStatusMsg(`保存成功！`);
      fetchRegisteredSettings();
    } catch (error: any) {
      console.error(error);
      setStatusMsg(`エラー: ${error.message || '保存に失敗しました'}`);
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Catalog */}
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">財宝一覧 (編集可)</h3>
            <div className="flex gap-2">
                <button 
                  onClick={fetchRegisteredSettings}
                  disabled={isLoading}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  onClick={saveRewards}
                  disabled={isLoading || !isConnected}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm font-bold disabled:opacity-50"
                >
                  一括保存
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto bg-black/30 p-2 rounded">
            {totalTreasures.map((t) => (
                <div 
                    key={t.catalogId} 
                    className="flex items-center gap-3 py-2 px-2 border-b border-gray-700 text-xs hover:bg-gray-700 cursor-pointer rounded transition-colors"
                    onClick={() => setStatusMsg(`${t.name}: ${t.description}`)}
                >
                    <div className="text-2xl">{t.icon}</div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{t.name}</div>
                        <div className="text-gray-400 truncate">{t.description}</div>
                    </div>
                    <input 
                        type="number"
                        value={editableAmounts[t.catalogId] || '0'}
                        onChange={(e) => updateAmount(t.catalogId, e.target.value)}
                        className="w-20 bg-gray-900 border border-gray-600 rounded p-1 text-right text-yellow-400 font-mono"
                    />
                    <span className="w-8">CHH</span>
                </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        {statusMsg && (
          <div className={`p-3 border rounded text-sm text-center ${statusMsg.includes('失敗') ? 'bg-red-900/50 border-red-600 text-red-200' : 'bg-black/50 border-gray-600'}`}>
            {statusMsg}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminScreen;
