"use client";
import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { coreMainnet, coreTestnet, coreDevnet } from "./chains";
import { createPublicClient, createWalletClient, custom } from "viem";

export const config = createConfig({
  chains: [coreMainnet, coreTestnet, coreDevnet],
  connectors: [injected()],
  transports: {
    [coreMainnet.id]: http(),
    [coreTestnet.id]: http(),
    [coreDevnet.id]: http(),
  },
});

// find a way to determine the chain id
export const publicClient = createPublicClient({
  chain: coreTestnet,
  transport: http(),
});

// Create wallet client only on the client side
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let walletClient: any;

// Check if we're in the browser environment
if (typeof window !== "undefined") {
  walletClient = createWalletClient({
    chain: coreTestnet,
    transport: custom(window.ethereum),
  });
}

export { walletClient };

// export const walletClient = createWalletClient({
//   chain: coreTestnet,
//   transport: custom(window.ethereum),
// });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
