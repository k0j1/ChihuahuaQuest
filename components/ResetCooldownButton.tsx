import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, usePublicClient, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { Unlock } from 'lucide-react';
import { TREASURE_CONTRACT_ADDRESS, TREASURE_CONTRACT_ABI } from '../constants';

const ERC20_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

interface ResetCooldownButtonProps {
    onSuccess: () => void;
    lang: 'en' | 'ja';
}

const ResetCooldownButton: React.FC<ResetCooldownButtonProps> = ({ onSuccess, lang }) => {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    
    const [isLoading, setIsLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    const tokenRes = useReadContract({
        address: TREASURE_CONTRACT_ADDRESS,
        abi: TREASURE_CONTRACT_ABI,
        functionName: 'paymentToken',
    });

    const feeRes = useReadContract({
        address: TREASURE_CONTRACT_ADDRESS,
        abi: TREASURE_CONTRACT_ABI,
        functionName: 'resetFee',
    });

    const handleReset = async () => {
        if (!isConnected || !address) {
            setStatusMsg(lang === 'en' ? 'Wallet not connected' : 'ウォレットが接続されていません');
            return;
        }

        const paymentToken = tokenRes.data as `0x${string}`;
        const resetFee = feeRes.data as bigint;

        if (!paymentToken || resetFee === undefined || paymentToken === '0x0000000000000000000000000000000000000000') {
            setStatusMsg(lang === 'en' ? 'Payment token not set' : '支払い設定がありません');
            return;
        }

        setIsLoading(true);
        setStatusMsg(lang === 'en' ? 'Confirming approval...' : '承認を確認中...');

        try {
            if (!publicClient) throw new Error("Public client not found");

            // 1. Check Allowance
            const allowance = await publicClient.readContract({
                address: paymentToken,
                abi: ERC20_ABI,
                functionName: 'allowance',
                args: [address, TREASURE_CONTRACT_ADDRESS]
            }) as bigint;

            // 2. Approve if needed
            if (allowance < resetFee) {
                setStatusMsg(lang === 'en' ? 'Approving token...' : 'トークン承認中...');
                const approveHash = await writeContractAsync({
                    address: paymentToken,
                    abi: ERC20_ABI,
                    functionName: 'approve',
                    args: [TREASURE_CONTRACT_ADDRESS, resetFee]
                });
                await publicClient.waitForTransactionReceipt({ hash: approveHash });
            }

            // 3. Reset Cooldown
            setStatusMsg(lang === 'en' ? 'Resetting cooldown...' : 'クールダウン解除中...');
            const resetHash = await writeContractAsync({
                address: TREASURE_CONTRACT_ADDRESS,
                abi: TREASURE_CONTRACT_ABI,
                functionName: 'resetClaimCooldown'
            });

            await publicClient.waitForTransactionReceipt({ hash: resetHash });
            
            setStatusMsg(lang === 'en' ? 'Reset successful!' : '解除成功！');
            setTimeout(() => {
                onSuccess();
            }, 1000);

        } catch (error: any) {
            console.error(error);
            setStatusMsg(lang === 'en' ? `Error: ${error.message || 'Failed to process'}` : `エラー: ${error.message || '処理に失敗しました'}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!tokenRes.data || tokenRes.data === '0x0000000000000000000000000000000000000000') {
        return null;
    }

    const feeFormatted = feeRes.data !== undefined ? formatUnits(feeRes.data as bigint, 6) : '...';

    return (
        <div className="flex flex-col items-center w-full gap-2">
            <button
                onClick={handleReset}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-4 bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white border-2 border-white/40 shadow-[0_4px_0_#1e3a8a,0_6px_6px_rgba(0,0,0,0.3)] active:shadow-[0_1px_0_#1e3a8a,0_2px_2px_rgba(0,0,0,0.3)] active:translate-y-1 transition-all rounded-lg"
            >
                <Unlock className={`w-5 h-5 mr-2 ${isLoading ? 'animate-bounce' : ''}`} />
                <span className="font-bold tracking-widest">{lang === 'en' ? `Reset for ${feeFormatted} USDC` : `${feeFormatted} USDC で解除する`}</span>
            </button>
            {statusMsg && (
                <div className="text-xs text-center font-bold px-2 py-1 bg-black/50 text-white rounded">
                    {statusMsg}
                </div>
            )}
        </div>
    );
};

export default ResetCooldownButton;
