/* eslint-disable @typescript-eslint/no-unused-vars */
import { coreTestnet } from "./chains";
import { ABI, CA } from "./contract";
import { publicClient, walletClient } from "./wagmi";
import { toast } from "sonner";

export const createGame = async (gridSize: number) => {
  if (gridSize < 3 || gridSize > 5) {
    toast.error("Grid size must be between 3 and 5");
    throw new Error("Grid size must be between 3 and 5");
  }

  try {
    toast.loading("Creating new puzzle game...");

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

    return hash;
  } catch (err) {
    toast.dismiss();
    toast.error("Failed to create game");
  }
};

export const solvePuzzle = async (gameId: bigint) => {
  try {
    toast.loading("Submitting solution...");

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

    return hash;
  } catch (err) {
    console.log(err);
    toast.dismiss();
    toast.error("Failed to solve puzzle");
  }
};

export const cancelGame = async () => {
  try {
    toast.loading("Canceling game...");

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
    window.location.reload();

    return hash;
  } catch (err) {
    toast.dismiss();
    toast.error("Failed to cancel game");
    const error =
      err instanceof Error ? err : new Error("Failed to cancel game");
  }
};

export const buyHint = async ({
  gameId,
  hintType,
}: {
  gameId: bigint;
  hintType: number;
}) => {
  try {
    const hintTypeNames = ["Default", "Gold", "Silver"];
    toast.loading(`Buying ${hintTypeNames[hintType]} hint...`);

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

    const goldHintFee = goldPrice as bigint;
    const silverHintFee = silverPrice as bigint;

    const [account] = await walletClient.getAddresses();

    console.log(goldHintFee, silverHintFee);

    // Determine payment amount based on hint type
    const paymentAmount =
      hintType === 1 ? goldHintFee : hintType === 2 ? silverHintFee : 0;

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

    return hash;
  } catch (err) {
    console.log(err);
    toast.dismiss();
    toast.error("Failed to buy hint");
    const error = err instanceof Error ? err : new Error("Failed to buy hint");
  }
};
