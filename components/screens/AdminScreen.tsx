import React, { useState, useEffect } from 'react';
import { ArrowLeft, Database, Upload, RefreshCw, Key, DollarSign } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useWriteContract, usePublicClient } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { TreasureIcon } from '../TreasureIcon';
import { TREASURE_REGISTRY } from '../../services/geminiService';
import { TREASURE_CONTRACT_ADDRESS, TREASURE_CONTRACT_ABI, CHH_CONTRACT_ADDRESS } from '../../constants';

interface AdminScreenProps {
  onBack: () => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const [registeredSettings, setRegisteredSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [contractBalances, setContractBalances] = useState({ chh: '0', usdc: '0' });
  
  // Payment Config State
  const [paymentToken, setPaymentToken] = useState('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'); // USDC on Base
  const [paymentFee, setPaymentFee] = useState('1'); // 1 USDC

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const BATCH_SIZE = 100;
  const totalTreasures = TREASURE_REGISTRY.slice(0, 500);

  const fetchBalances = async () => {
    if (!publicClient) return;
    try {
      const erc20Abi = [
        {
          "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
          "name": "balanceOf",
          "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
          "stateMutability": "view",
          "type": "function"
        }
      ] as const;

      const chhBal = await publicClient.readContract({
        address: CHH_CONTRACT_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [TREASURE_CONTRACT_ADDRESS as `0x${string}`],
      }).catch(() => 0n);

      const pToken = await publicClient.readContract({
        address: TREASURE_CONTRACT_ADDRESS as `0x${string}`,
        abi: TREASURE_CONTRACT_ABI,
        functionName: 'paymentToken',
      }).catch(() => null) as `0x${string}` | null;

      let usdcFormatted = '0';
      if (pToken) {
        const usdcBal = await publicClient.readContract({
          address: pToken,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [TREASURE_CONTRACT_ADDRESS as `0x${string}`],
        }).catch(() => 0n);
        
        const decimals = await publicClient.readContract({
          address: pToken,
          abi: erc20Abi,
          functionName: 'decimals',
        }).catch(() => 6);
        
        usdcFormatted = formatUnits(usdcBal as bigint, decimals as number);
      }

      setContractBalances({
        chh: formatUnits(chhBal as bigint, 18),
        usdc: usdcFormatted
      });

    } catch (e) {
      console.error("Failed to fetch contract balances", e);
    }
  };

  useEffect(() => {
    fetchRegisteredSettings();
    fetchBalances();
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
    setStatusMsg('報酬設定と支払い情報を読み込み中...');
    try {
      // 支払い情報取得
      const [tokenAddress, feeAmount] = await Promise.all([
        publicClient.readContract({
          address: TREASURE_CONTRACT_ADDRESS,
          abi: TREASURE_CONTRACT_ABI,
          functionName: 'paymentToken',
        }),
        publicClient.readContract({
          address: TREASURE_CONTRACT_ADDRESS,
          abi: TREASURE_CONTRACT_ABI,
          functionName: 'resetFee',
        })
      ]).catch(() => ['0x0000000000000000000000000000000000000000', 0n]);

      // @ts-ignore
      setPaymentToken(tokenAddress as string);
      // @ts-ignore
      setPaymentFee(formatUnits(feeAmount, 6)); // Assuming USDC 6 decimals default

      // 1-500までのIDリストを作成
      const ids = Array.from({ length: 500 }, (_, i) => i + 1);
      
      // プロミスを作成して並列で実行
      const results = await Promise.all(
        ids.map(id => 
          publicClient.readContract({
            address: TREASURE_CONTRACT_ADDRESS,
            abi: TREASURE_CONTRACT_ABI,
            functionName: 'treasureRewards',
            // @ts-ignore
            args: [BigInt(id)]
          }).catch(() => [0n, false]) // Fallback if contract doesn't have it yet
        )
      );

      // データの整形
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

  const updateIndividualReward = async (id: string, amount: string) => {
    if (!isConnected || !address) {
      setStatusMsg('ウォレットを接続してください');
      return;
    }

    setIsLoading(true);
    setStatusMsg(`ID ${id} を更新中...`);

    try {
      const hash = await writeContractAsync({
        address: TREASURE_CONTRACT_ADDRESS,
        abi: TREASURE_CONTRACT_ABI,
        functionName: 'setTreasureRewardsBatch',
        args: [[BigInt(id)], [parseUnits(amount, 18)]],
      });

      setStatusMsg(`トランザクション送信完了: ${hash.slice(0, 10)}... 承認待ち`);
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      setStatusMsg(`ID ${id} 更新成功！`);
      fetchRegisteredSettings();
    } catch (error: any) {
      console.error(error);
      setStatusMsg(`エラー: ${error.message || '更新に失敗しました'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBatchRewards = async () => {
    if (!isConnected || !address) {
      setStatusMsg('ウォレットを接続してください');
      return;
    }

    setIsLoading(true);
    try {
      const allIds = totalTreasures.map(t => t.catalogId);
      
      // Batch processing for exactly 100 items per transaction
      for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
        const chunkIds = allIds.slice(i, i + BATCH_SIZE);
        const chunkAmounts = chunkIds.map(id => {
            const amountStr = editableAmounts[id.toString()] || editableAmounts[id] || (totalTreasures.find(t => t.catalogId === id)?.value.toString() || '0');
            return parseUnits(amountStr, 18);
        });

        setStatusMsg(`バッチ更新中... (${i + 1} - ${i + chunkIds.length} / ${allIds.length})`);
        
        const hash = await writeContractAsync({
          address: TREASURE_CONTRACT_ADDRESS,
          abi: TREASURE_CONTRACT_ABI,
          functionName: 'setTreasureRewardsBatch',
          args: [chunkIds.map(id => BigInt(id)), chunkAmounts],
        });

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash });
        }
      }

      setStatusMsg(`全バッチの更新が完了しました！`);
      fetchRegisteredSettings();
    } catch (error: any) {
      console.error(error);
      setStatusMsg(`バッチ更新エラー: ${error.message || '更新に失敗しました'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentConfig = async () => {
    if (!isConnected || !address) {
      setStatusMsg('ウォレットを接続してください');
      return;
    }
    setIsLoading(true);
    setStatusMsg('支払い設定を更新中...');
    
    try {
      const hash = await writeContractAsync({
        address: TREASURE_CONTRACT_ADDRESS,
        abi: TREASURE_CONTRACT_ABI,
        functionName: 'setPaymentConfig',
        // @ts-ignore
        args: [paymentToken as `0x${string}`, parseUnits(paymentFee, 6)], // Assuming USDC 6 decimals default
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      setStatusMsg(`支払い設定が完了しました！`);
    } catch (error: any) {
      console.error(error);
      setStatusMsg(`支払い設定エラー: ${error.message || '設定に失敗しました'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawTokens = async () => {
    if (!isConnected || !address) {
      setStatusMsg('ウォレットを接続してください');
      return;
    }
    setIsLoading(true);
    setStatusMsg('トークンを引き出し中...');
    
    try {
      const hash = await writeContractAsync({
        address: TREASURE_CONTRACT_ADDRESS,
        abi: TREASURE_CONTRACT_ABI,
        functionName: 'withdrawPaymentTokens',
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      setStatusMsg(`引き出しが完了しました！`);
    } catch (error: any) {
      console.error(error);
      setStatusMsg(`引き出しエラー: ${error.message || '引き出しに失敗しました'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const autofillDefaults = () => {
      const newEditable: Record<string, string> = {};
      totalTreasures.forEach(t => {
          newEditable[t.catalogId.toString()] = t.value.toString();
      });
      setEditableAmounts(prev => ({ ...prev, ...newEditable }));
      setStatusMsg("デフォルトの報酬額をセットしました。バッチ更新してください。");
  };

  const resetToDefaults = async () => {
    if (!isConnected || !address) {
      setStatusMsg('ウォレットを接続してください');
      return;
    }

    const idsToUpdate: bigint[] = [];
    const amountsToUpdate: bigint[] = [];

    totalTreasures.forEach(t => {
      const idStr = t.catalogId.toString();
      const defaultVal = t.value.toString();
      const registeredVal = registeredSettings[idStr];
      
      const currentValStr = registeredVal !== undefined ? registeredVal : "-1"; 
      
      if (Number(currentValStr) !== Number(defaultVal)) {
          idsToUpdate.push(BigInt(t.catalogId));
          amountsToUpdate.push(parseUnits(defaultVal, 18));
      }
    });

    if (idsToUpdate.length === 0) {
        setStatusMsg('デフォルト値と異なる財宝はありませんでした。');
        return;
    }

    setIsLoading(true);
    try {
      const BATCH_SIZE = 100;
      for (let i = 0; i < idsToUpdate.length; i += BATCH_SIZE) {
        const chunkIds = idsToUpdate.slice(i, i + BATCH_SIZE);
        const chunkAmounts = amountsToUpdate.slice(i, i + BATCH_SIZE);

        setStatusMsg(`リセット更新中... (${i + 1} - ${i + chunkIds.length} / ${idsToUpdate.length})`);
        
        const hash = await writeContractAsync({
          address: TREASURE_CONTRACT_ADDRESS,
          abi: TREASURE_CONTRACT_ABI,
          functionName: 'setTreasureRewardsBatch',
          args: [chunkIds, chunkAmounts],
        });

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash });
        }
      }

      setStatusMsg(`${idsToUpdate.length}件の財宝をデフォルト値にリセットしました！`);
      fetchRegisteredSettings();
    } catch (error: any) {
      console.error(error);
      setStatusMsg(`リセットエラー: ${error.message || '更新に失敗しました'}`);
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
        
        {/* Messages */}
        {statusMsg && (
          <div className={`p-3 border rounded text-sm text-center sticky top-0 z-[50] shadow-md ${statusMsg.includes('失敗') || statusMsg.includes('エラー') ? 'bg-red-900/90 border-red-600 text-red-200' : 'bg-black/90 border-gray-600 text-green-300'}`}>
            {statusMsg}
          </div>
        )}

        {/* Contract Balances */}
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-gray-400 text-sm mb-1 flex items-center gap-2">
              <Database className="w-4 h-4" />
              コントラクト残高
            </h3>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2 bg-black/50 px-3 py-2 rounded">
                <span className="font-mono font-bold text-yellow-400 text-lg">{Number(contractBalances.chh).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                <span className="text-xs text-gray-400">CHH</span>
              </div>
              <div className="flex items-center gap-2 bg-black/50 px-3 py-2 rounded">
                <span className="font-mono font-bold text-blue-400 text-lg">{Number(contractBalances.usdc).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <span className="text-xs text-gray-400">USDC</span>
              </div>
            </div>
          </div>
          <button 
            onClick={fetchBalances}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title="残高を更新"
          >
            <RefreshCw className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Contract Info */}
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700">
          <h3 className="text-gray-400 text-sm mb-1 flex items-center gap-2">
            <Key className="w-4 h-4" />
            コントラクトアドレス
          </h3>
          <p className="font-mono text-xs break-all text-yellow-400 bg-black/50 p-2 rounded">
            {TREASURE_CONTRACT_ADDRESS}
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

        {/* Payment Configuration */}
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700 flex flex-col gap-4">
          <h3 className="text-gray-400 text-sm flex items-center gap-2">
             <DollarSign className="w-4 h-4" />
             支払い設定 (クールダウン解除用)
          </h3>
          
          <div className="flex flex-col gap-2">
             <label className="text-xs text-gray-500">トークンコントラクトアドレス</label>
             <input type="text" value={paymentToken} onChange={(e) => setPaymentToken(e.target.value)} className="bg-gray-900 border border-gray-600 rounded p-2 text-sm text-mono w-full" placeholder="0x..." />
          </div>
          
          <div className="flex flex-col gap-2">
             <label className="text-xs text-gray-500">解除費用 (例: 1 USDC)</label>
             <input type="text" value={paymentFee} onChange={(e) => setPaymentFee(e.target.value)} className="bg-gray-900 border border-gray-600 rounded p-2 text-sm text-mono w-full" placeholder="1.0" />
          </div>
          
          <div className="flex gap-2 justify-end mt-2">
             <button
               onClick={updatePaymentConfig}
               disabled={isLoading || !isConnected}
               className="px-4 py-2 bg-purple-600 hover:bg-purple-500 font-bold rounded text-sm disabled:opacity-50"
             >
               設定を更新
             </button>
             <button
               onClick={withdrawTokens}
               disabled={isLoading || !isConnected}
               className="px-4 py-2 bg-green-600 hover:bg-green-500 font-bold rounded text-sm disabled:opacity-50"
             >
               資金を取り出す
             </button>
          </div>
        </div>

        {/* Catalog */}
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">財宝一覧設定</h3>
            <div className="flex gap-2">
                <button 
                  onClick={resetToDefaults}
                  disabled={isLoading || !isConnected}
                  className="px-3 py-1 bg-red-800 hover:bg-red-700 rounded text-xs font-bold disabled:opacity-50"
                  title="サーバー側のデータがデフォルト値と異なるもの全てをデフォルト値でバッチ更新します"
                >
                  差分リセット
                </button>
                <button 
                  onClick={autofillDefaults}
                  disabled={isLoading}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                >
                  デフォルト値挿入
                </button>
                <button 
                  onClick={updateBatchRewards}
                  disabled={isLoading || !isConnected}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-xs font-bold disabled:opacity-50 flex items-center gap-1"
                >
                  <Upload size={14} /> 一括バッチ更新
                </button>
                <button 
                  onClick={fetchRegisteredSettings}
                  disabled={isLoading}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto bg-black/30 p-2 rounded">
            {totalTreasures.map((t) => (
                <div 
                    key={t.catalogId} 
                    className="flex items-center gap-2 py-2 px-2 border-b border-gray-700 text-xs hover:bg-gray-700 rounded transition-colors"
                >
                    <div className="w-8 h-8 flex items-center justify-center cursor-pointer" onClick={() => setStatusMsg(`${t.name}: ${t.description}`)}>
                        <TreasureIcon name={t.icon as string} value={t.value} className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setStatusMsg(`${t.name}: ${t.description}`)}>
                        <div className="font-bold truncate">{t.name}</div>
                        <div className="text-[10px] text-gray-500">ID: {t.catalogId} / 規定値: {t.value.toLocaleString()}</div>
                    </div>
                    <input 
                        type="number"
                        value={editableAmounts[t.catalogId.toString()] !== undefined ? editableAmounts[t.catalogId.toString()] : (editableAmounts[t.catalogId] !== undefined ? editableAmounts[t.catalogId] : '')}
                        onChange={(e) => updateAmount(t.catalogId.toString(), e.target.value)}
                        placeholder="設定なし"
                        className="w-16 bg-gray-900 border border-gray-600 rounded p-1 text-right text-yellow-400 font-mono"
                    />
                    <span className="w-8">CHH</span>
                    <button
                        onClick={() => updateIndividualReward(t.catalogId.toString(), editableAmounts[t.catalogId] || '0')}
                        disabled={isLoading || !isConnected}
                        className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-[10px] font-bold disabled:opacity-50 min-w-10"
                    >
                        更新
                    </button>
                </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminScreen;

