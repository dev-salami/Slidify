/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { publicClient, walletClient } from "./wagmi";
import { ABI, CA, CONTRACT_ADMIN } from "./contract";

export function useWithdrawFunds() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const withdraw = useCallback(async () => {
    try {
      setIsWithdrawing(true);
      setIsSuccess(false);
      setError(null);

      toast.loading("Withdrawing funds...");

      // Get the connected wallet address
      const [account] = await walletClient.getAddresses();

      // Prepare the transaction
      const { request } = await publicClient.simulateContract({
        address: CA,
        abi: ABI,
        functionName: "withdrawFunds",
        account,
      });

      // Send the transaction
      const hash = await walletClient.writeContract(request);

      // Wait for transaction to be confirmed
      toast.loading(`Transaction sent: ${hash}`);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        toast.dismiss();
        toast.success("Funds withdrawn successfully!");
        setIsSuccess(true);
      } else {
        throw new Error("Transaction failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to withdraw funds");
      setError(err);
    } finally {
      setIsWithdrawing(false);
    }
  }, []);

  return {
    withdraw,
    isWithdrawing,
    isSuccess,
    error,
  };
}

/**
 * Hook to get contract balance
 */
export function useContractBalance() {
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the contract's balance
      const balance = await publicClient.getBalance({
        address: CA,
      });

      setBalance(balance);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, []);

  // For getting real-time balance updates, you'd want to add useEffect here
  // that calls fetchBalance periodically or on certain events

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance,
  };
}

// Hook to get prices for hints
export function useHintPrices() {
  const [prices, setPrices] = useState<{ gold: bigint; silver: bigint } | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPrices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch gold hint price
      const goldPrice = await publicClient.readContract({
        address: CA,
        abi: ABI,
        functionName: "GOLD_HINT_PRICE",
      });

      // Fetch silver hint price
      const silverPrice = await publicClient.readContract({
        address: CA,
        abi: ABI,
        functionName: "SILVER_HINT_PRICE",
      });

      setPrices({
        gold: goldPrice as bigint,
        silver: silverPrice as bigint,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch hint prices")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    prices,
    error,
    isLoading,
  };
}

// Hook to check if user is admin
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkIfAdmin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [account] = await walletClient.getAddresses();

      console.log(account);

      // Get contract admin address

      setIsAdmin(account === CONTRACT_ADMIN);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to check admin status")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkIfAdmin();
  }, [checkIfAdmin]);

  return {
    isAdmin,
    error,
    isLoading,
    refetch: checkIfAdmin,
  };
}

// Hook to get total games count
export function useTotalGames() {
  const [totalGames, setTotalGames] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTotalGames = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current game ID (represents total games created)
      const currentId = await publicClient.readContract({
        address: CA,
        abi: ABI,
        functionName: "currentGameId",
      });

      setTotalGames(Number(currentId));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch total games")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTotalGames();
  }, [fetchTotalGames]);

  return {
    totalGames,
    error,
    isLoading,
    refetch: fetchTotalGames,
  };
}
