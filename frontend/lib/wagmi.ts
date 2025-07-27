import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  hardhat,
  localhost,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Foundry + Next.js Template',
  projectId: 'YOUR_PROJECT_ID', // Get your project ID at https://cloud.walletconnect.com
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NODE_ENV === 'development' ? [sepolia, hardhat, localhost] : []),
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
