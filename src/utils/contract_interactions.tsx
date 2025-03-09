/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { type PublicClient, parseEventLogs } from "viem";
import { ABI, CA } from "./contract";
import { publicClient, walletClient } from "./wagmi";
import { coreTestnet } from "./chains";
import { toast } from "sonner";

// Types
export interface GameData {
  shuffleHash: `0x${string}`;
  gridSize: number;
  isActive: boolean;
  isSolved: boolean;
  hintType: number;
  gameId: number;
}

// Current Game ID Hook
export function useCurrentGameId(publicClient: PublicClient) {
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchCurrentGameId = useCallback(async () => {
    try {
      toast.loading("Fetching current game ID...");
      setError(null);

      const result = await publicClient.readContract({
        address: CA,
        abi: ABI,
        functionName: "currentGameId",
      });

      setCurrentGameId(Number(result));
      toast.dismiss();
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to fetch current game ID");
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch current game ID")
      );
    }
  }, [publicClient]);

  useEffect(() => {
    fetchCurrentGameId();
  }, [fetchCurrentGameId]);

  return {
    currentGameId,
    error,
    refetch: fetchCurrentGameId,
  };
}

// User Current Game Hook
export function useUserCurrentGame() {
  const [userGameId, setUserGameId] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserCurrentGame = useCallback(async () => {
    try {
      toast.loading("Fetching your current game...");
      setError(null);

      const result = await publicClient.readContract({
        address: CA,
        abi: ABI,
        functionName: "getUserCurrentGame",
      });

      setUserGameId(Number(result));
      toast.dismiss();
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to fetch your current game");
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch user's current game")
      );
    }
  }, []);

  useEffect(() => {
    fetchUserCurrentGame();
  }, [fetchUserCurrentGame]);

  return {
    userGameId,
    error,
    refetch: fetchUserCurrentGame,
  };
}

// Game Data Hook
export function useGameData() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchGameData = useCallback(async () => {
    // if (!gameId) return;

    try {
      setIsLoading(true);
      toast.loading("Fetching game data...");
      setError(null);
      const [account] = await walletClient.getAddresses();
      const gameId = await publicClient.readContract({
        address: CA,
        abi: ABI,
        account: account,
        functionName: "getUserCurrentGame",
      });
      console.log(gameId);
      const result = await publicClient.readContract({
        address: CA,
        abi: ABI,
        account: account,
        functionName: "getGame",
        args: [gameId],
      });

      setGameData({
        shuffleHash: (result as any)[0],
        gridSize: (result as any)[1],
        isActive: (result as any)[2],
        isSolved: (result as any)[3],
        hintType: (result as any)[4],
        gameId: gameId,
      } as GameData);
      toast.dismiss();
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to fetch game data");
      setError(
        err instanceof Error ? err : new Error("Failed to fetch game data")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  return {
    gameData,
    error,
    isLoading,
    refetch: fetchGameData,
  };
}

// Create Game Hook
export function useCreateGame() {
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const createGame = async (gridSize: number) => {
    if (gridSize < 3 || gridSize > 5) {
      toast.error("Grid size must be between 3 and 5");
      throw new Error("Grid size must be between 3 and 5");
    }

    try {
      toast.loading("Creating new puzzle game...");
      setError(null);
      setTxHash(null);

      const [account] = await walletClient.getAddresses();

      const { request } = await publicClient.simulateContract({
        address: CA,
        abi: ABI,
        functionName: "createNewGame",
        args: [gridSize],
        chain: coreTestnet,
        account: account,
      });

      const hash = await walletClient.writeContract(request);
      toast.dismiss();
      toast.success("Game created successfully!");

      setTxHash(hash);
      return hash;
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to create game");
      const error =
        err instanceof Error ? err : new Error("Failed to create game");
      setError(error);
      throw error;
    }
  };

  return {
    createGame,
    error,
    txHash,
  };
}

// Solve Puzzle Hook
export function useSolvePuzzle() {
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const solvePuzzle = async (gameId: bigint) => {
    try {
      toast.loading("Submitting solution...");
      setError(null);
      setTxHash(null);

      const [account] = await walletClient.getAddresses();

      const { request } = await publicClient.simulateContract({
        address: CA,
        abi: ABI,
        functionName: "solvePuzzle",
        args: [gameId],
        chain: coreTestnet,
        account: account,
      });

      const hash = await walletClient.writeContract(request);
      toast.dismiss();
      toast.success("Puzzle solved!");

      setTxHash(hash);
      return hash;
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to solve puzzle");
      const error =
        err instanceof Error ? err : new Error("Failed to solve puzzle");
      setError(error);
      throw error;
    }
  };

  return {
    solvePuzzle,
    error,
    txHash,
  };
}

// Cancel Game Hook
export function useCancelGame() {
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const cancelGame = async () => {
    try {
      toast.loading("Canceling game...");
      setError(null);
      setTxHash(null);

      const [account] = await walletClient.getAddresses();
      const gameId = await publicClient.readContract({
        address: CA,
        abi: ABI,
        account: account,
        functionName: "getUserCurrentGame",
      });
      const { request } = await publicClient.simulateContract({
        address: CA,
        abi: ABI,
        functionName: "cancelGame",
        args: [gameId],
        chain: coreTestnet,
        account: account,
      });

      const hash = await walletClient.writeContract(request);
      toast.dismiss();
      toast.success("Game canceled successfully");

      setTxHash(hash);
      return hash;
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to cancel game");
      const error =
        err instanceof Error ? err : new Error("Failed to cancel game");
      setError(error);
      throw error;
    }
  };

  return {
    cancelGame,
    error,
    txHash,
  };
}

// Buy Hint Hook
export function useBuyHint() {
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const buyHint = async (gameId: bigint, hintType: number) => {
    try {
      const hintTypeNames = ["Default", "Gold", "Silver"];
      toast.loading(`Buying ${hintTypeNames[hintType]} hint...`);
      setError(null);
      setTxHash(null);

      const [account] = await walletClient.getAddresses();

      // Determine payment amount based on hint type
      const paymentAmount =
        hintType === 1 ? BigInt(1) : hintType === 2 ? BigInt(2) : 0;

      if (paymentAmount === 0) {
        toast.dismiss();
        toast.error("Invalid hint type");
        throw new Error("Invalid hint type");
      }

      const { request } = await publicClient.simulateContract({
        address: CA,
        abi: ABI,
        functionName: "buyHint",
        args: [gameId, hintType],
        chain: coreTestnet,
        account: account,
        value: paymentAmount,
      });

      const hash = await walletClient.writeContract(request);
      toast.dismiss();
      toast.success(`${hintTypeNames[hintType]} hint purchased!`);

      setTxHash(hash);
      return hash;
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to buy hint");
      const error =
        err instanceof Error ? err : new Error("Failed to buy hint");
      setError(error);
      throw error;
    }
  };

  return {
    buyHint,
    error,
    txHash,
  };
}

// Event Watching Hook
export function useGameEvents() {
  const [gameCreatedEvents, setGameCreatedEvents] = useState<any[]>([]);
  const [gameSolvedEvents, setGameSolvedEvents] = useState<any[]>([]);
  const [gameCanceledEvents, setGameCanceledEvents] = useState<any[]>([]);

  useEffect(() => {
    const unwatchCreated = publicClient.watchContractEvent({
      address: CA,
      abi: ABI,
      eventName: "GameCreated",
      onLogs: (logs) => {
        const parsedLogs = parseEventLogs({
          abi: ABI,
          logs,
        });
        setGameCreatedEvents((prev) => [...prev, ...parsedLogs]);
        toast.info("New game created!");
      },
    });

    const unwatchSolved = publicClient.watchContractEvent({
      address: CA,
      abi: ABI,
      eventName: "GameSolved",
      onLogs: (logs) => {
        const parsedLogs = parseEventLogs({
          abi: ABI,
          logs,
        });
        setGameSolvedEvents((prev) => [...prev, ...parsedLogs]);
        toast.success("Game solved!");
      },
    });

    const unwatchCanceled = publicClient.watchContractEvent({
      address: CA,
      abi: ABI,
      eventName: "GameCanceled",
      onLogs: (logs) => {
        const parsedLogs = parseEventLogs({
          abi: ABI,
          logs,
        });
        setGameCanceledEvents((prev) => [...prev, ...parsedLogs]);
        toast.info("Game canceled");
      },
    });

    return () => {
      unwatchCreated();
      unwatchSolved();
      unwatchCanceled();
    };
  }, []);

  return {
    gameCreatedEvents,
    gameSolvedEvents,
    gameCanceledEvents,
  };
}

// Combined Game Hook
export function useSlidingPuzzleGame() {
  const {
    currentGameId,
    error: currentGameError,
    refetch: refetchGameId,
  } = useCurrentGameId(publicClient);

  const {
    userGameId,
    error: userGameError,
    refetch: refetchUserGame,
  } = useUserCurrentGame();

  const {
    gameData,
    error: gameDataError,
    refetch: refetchGameData,
  } = useGameData();

  const {
    createGame,
    error: createGameError,
    txHash: createTxHash,
  } = useCreateGame();

  const {
    solvePuzzle,
    error: solveError,
    txHash: solveTxHash,
  } = useSolvePuzzle();

  const {
    cancelGame,
    error: cancelError,
    txHash: cancelTxHash,
  } = useCancelGame();

  const { buyHint, error: buyHintError, txHash: buyHintTxHash } = useBuyHint();

  const { gameCreatedEvents, gameSolvedEvents, gameCanceledEvents } =
    useGameEvents();

  const handleCreateGame = async (gridSize: number) => {
    try {
      await createGame(gridSize);
      // Refetch data after creation
      await Promise.all([refetchGameId(), refetchUserGame()]);
      if (userGameId) {
        await refetchGameData();
      }
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleSolvePuzzle = async () => {
    if (!userGameId) {
      toast.error("No active game to solve");
      return;
    }
    try {
      await solvePuzzle(BigInt(userGameId));
      await Promise.all([refetchUserGame(), refetchGameData()]);
    } catch (error) {
      console.error("Error solving puzzle:", error);
    }
  };

  const handleCancelGame = async () => {
    if (!userGameId) {
      toast.error("No active game to cancel");
      return;
    }
    try {
      await cancelGame();
      await Promise.all([refetchUserGame(), refetchGameData()]);
    } catch (error) {
      console.error("Error canceling game:", error);
    }
  };

  const handleBuyHint = async (hintType: number) => {
    if (!userGameId) {
      toast.error("No active game for buying hints");
      return;
    }
    try {
      await buyHint(BigInt(userGameId), hintType);
      await refetchGameData();
    } catch (error) {
      console.error("Error buying hint:", error);
    }
  };

  return {
    // Data
    currentGameId,
    userGameId,
    gameData,
    gameCreatedEvents,
    gameSolvedEvents,
    gameCanceledEvents,
    createTxHash,
    solveTxHash,
    cancelTxHash,
    buyHintTxHash,

    // Errors
    error:
      currentGameError ||
      userGameError ||
      gameDataError ||
      createGameError ||
      solveError ||
      cancelError ||
      buyHintError,

    // Actions
    createGame: handleCreateGame,
    solvePuzzle: handleSolvePuzzle,
    cancelGame: handleCancelGame,
    buyHint: handleBuyHint,
    refetchUserGame,
    refetchGameData,
  };
}
