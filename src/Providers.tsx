"use client"; // Required for Next.js App Router (if using `app` directory)

import { WagmiProvider } from "wagmi"; // Named import for Wagmi v2
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./utils/wagmi";

// Create a QueryClient instance
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
         {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
