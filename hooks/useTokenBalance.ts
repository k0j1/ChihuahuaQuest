import { useState, useEffect } from 'react';
import { parseAbi, formatUnits } from 'viem';
import { usePublicClient } from 'wagmi';

const CHH_CONTRACT_ADDRESS = '0xb0525542E3D818460546332e76E511562dFf9B07';
const CHH_ABI = parseAbi(['function balanceOf(address) view returns (uint256)']);

export const useTokenBalance = (addresses: string[] | undefined) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!addresses || addresses.length === 0 || !publicClient) {
        setBalance(null);
        return;
    }

    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        // Fetch balances for all addresses and sum them up
        const promises = addresses.map(addr => 
            // @ts-ignore
            publicClient.readContract({
                address: CHH_CONTRACT_ADDRESS,
                abi: CHH_ABI,
                functionName: 'balanceOf',
                args: [addr as `0x${string}`]
            })
        );

        const results = await Promise.all(promises);
        const total = results.reduce((acc, val) => acc + val, 0n);
        
        // CHH uses 18 decimals
        const formatted = formatUnits(total, 18);
        const numberVal = parseFloat(formatted);
        
        setBalance(numberVal.toLocaleString(undefined, { maximumFractionDigits: 2 }));

      } catch (e) {
        console.error("Failed to fetch CHH balance", e);
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [addresses, publicClient]);

  return { balance, isLoading };
};