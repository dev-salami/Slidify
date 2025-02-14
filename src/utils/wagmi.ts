// wagmi.ts
import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { coreMainnet, coreTestnet, coreDevnet } from "./chains";

export const config = createConfig({
  chains: [coreMainnet, coreTestnet, coreDevnet],
  connectors: [injected()],
  transports: {
    [coreMainnet.id]: http(),
    [coreTestnet.id]: http(),
    [coreDevnet.id]: http(),
  },
});
