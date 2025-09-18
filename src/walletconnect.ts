// Example usage of @walletconnect/web3-provider in a Vue 3 + TypeScript project
// This file demonstrates how to initialize the provider and connect to a wallet

import WalletConnectProvider from "@walletconnect/web3-provider";

// 1. Create WalletConnect Provider
export const provider = new WalletConnectProvider({
  rpc: {
    1: "https://mainnet.infura.io/v3/INFURA_PROJECT_ID", // Replace with your Infura ID or other RPC
  },
  chainId: 1,
});

// 2. Enable session (triggers QR Code modal)
export async function connectWallet() {
  await provider.enable();
}

// 3. Disconnect wallet
export async function disconnectWallet() {
  await provider.disconnect();
}
