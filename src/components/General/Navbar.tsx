"use client"
import { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
  useBalance,
} from "wagmi";
import { injected } from "wagmi/connectors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { chains, getChainType } from "@/utils/chains";
import { getGeneratedImageUrl } from "@/utils/image";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  // Simplified balance hook configuration
  const { data: balance } = useBalance({
    address: address,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: bigint | undefined, decimals: number | undefined) => {
    if (!balance || !decimals) return "0";
    const numberValue = Number(balance) / Math.pow(10, decimals);
    return numberValue.toFixed(4);
  };

  const handleConnect = async () => {
    try {
      await connect({ connector: injected() });
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };

  const handleNetworkSwitch = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // If the network doesn't exist in the wallet, add it
      const targetChain = chains.find((chain) => chain.id === targetChainId);
      if (targetChain && window.ethereum) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: targetChain.name,
                nativeCurrency: targetChain.nativeCurrency,
                rpcUrls: [targetChain.rpcUrls.default.http[0]],
                blockExplorerUrls: [targetChain.blockExplorers.default.url],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
        }
      }
    }
  };

  const getCurrentChainName = () => {
    const currentChain = chains.find((chain) => chain.id === chainId);
    return currentChain?.name || "Select Network";
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold">Core Blockchain</span>

          {isConnected && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{getCurrentChainName()}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {chains.map((chainOption) => (
                  <DropdownMenuItem
                    key={chainOption.id}
                    onClick={() => handleNetworkSwitch(chainOption.id)}
                    className="cursor-pointer"
                  >
                    {chainOption.name}
                    {getChainType(chainOption.id) !== "mainnet" && (
                      <span className="ml-2 text-xs text-gray-500">
                        {getChainType(chainOption.id) === "devnet"
                          ? "(DevNet)"
                          : "(Testnet)"}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <button onClick={( async ()=> {
            const res = await  getGeneratedImageUrl(4)
            console.log(res)
        })}>TEST</button>

        <div className="flex items-center space-x-4">
          {isConnected ? (
            <>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">
                  {truncateAddress(address as string)}
                </span>
                <span className="text-xs text-gray-600">
                  {formatBalance(balance?.value, balance?.decimals)} {balance?.symbol}
                </span>
               </div>
              <Button variant="outline" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button onClick={handleConnect}>Connect Wallet</Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;