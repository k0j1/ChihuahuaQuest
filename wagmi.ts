import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`),
  },
  connectors: [farcasterFrame()],
});
