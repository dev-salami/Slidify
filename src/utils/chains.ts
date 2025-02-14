// chains.ts
import { type Chain } from "wagmi/chains";

export const coreMainnet = {
  id: 1116,
  name: "Core Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Core",
    symbol: "CORE",
  },
  rpcUrls: {
    public: { http: ["https://rpc.coredao.org"] },
    default: { http: ["https://rpc.coredao.org"] },
  },
  blockExplorers: {
    etherscan: { name: "Core Scan", url: "https://scan.coredao.org" },
    default: { name: "Core Scan", url: "https://scan.coredao.org" },
  },
  contracts: {
    multicall3: {
      address: "0xf3a3F05EF220D728ECe2273C3F1c69885E54F872",
      blockCreated: 1963576,
    },
  },
} as const satisfies Chain;

export const coreTestnet = {
  id: 1115,
  name: "Core Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Core",
    symbol: "tCORE",
  },
  rpcUrls: {
    public: { http: ["https://rpc.test.btcs.network"] },
    default: { http: ["https://rpc.test.btcs.network"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Core Testnet Scan",
      url: "https://scan.test.btcs.network",
    },
    default: {
      name: "Core Testnet Scan",
      url: "https://scan.test.btcs.network",
    },
  },
  contracts: {
    multicall3: {
      address: "0x7E2DD211F9F80D82246ebe5b8E104748df8763B6",
      blockCreated: 11907934,
    },
  },
} as const satisfies Chain;

export const coreDevnet = {
  id: 1114,
  name: "Core DevNet",
  nativeCurrency: {
    decimals: 18,
    name: "Core",
    symbol: "dCORE",
  },
  rpcUrls: {
    public: { http: ["https://rpc.dev.btcs.network"] },
    default: { http: ["https://rpc.dev.btcs.network"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Core DevNet Scan",
      url: "https://scan.dev.btcs.network",
    },
    default: { name: "Core DevNet Scan", url: "https://scan.dev.btcs.network" },
  },
} as const satisfies Chain;

// Custom type to identify testnet/devnet chains
export type ChainType = "mainnet" | "testnet" | "devnet";

export const getChainType = (chainId: number): ChainType => {
  if (chainId === coreMainnet.id) return "mainnet";
  if (chainId === coreTestnet.id) return "testnet";
  if (chainId === coreDevnet.id) return "devnet";
  return "mainnet";
};

export const chains = [coreMainnet, coreTestnet, coreDevnet];
