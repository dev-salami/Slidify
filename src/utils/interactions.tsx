import { ABI, CA } from "./contract";
import { publicClient } from "./wagmi";

export const getCurrentGameId = async () => {
  const result = await publicClient.readContract({
    address: CA,
    abi: ABI,
    functionName: "currentGameId",
  });

  console.log(Number(result));
};
