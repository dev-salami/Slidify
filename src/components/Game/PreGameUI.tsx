/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Wallet2, Info, Badge } from "lucide-react";
import {
  useCancelGame,
  useCreateGame,
  useGameData,
  useGameEvents,
} from "@/utils/contract_interactions";
import { publicClient, walletClient } from "@/utils/wagmi";
import { ABI, CA } from "@/utils/contract";
import { cancelGame, createGame } from "@/utils/singlePlayerInteraction";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { GoldMedal, SilverMedal } from "../General/Icons";

interface PreGameUIProps {
  isWalletConnected: boolean;
  onConnect: () => void;
  onStartGame: (
    difficulty: 3 | 4 | 5,
    hash: string,
    id: number,
    hintType: number
  ) => void;
}

const PreGameUI = ({
  isWalletConnected,
  onConnect,
  onStartGame,
}: PreGameUIProps) => {
  const [difficulty, setDifficulty] = useState<3 | 4 | 5>(3);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  // const { createGame, error, txHash } = useCreateGame();
  const { gameData, refetch, isLoading } = useGameData();
  // const { cancelGame } = useCancelGame();
  const handleStartGame = async () => {
    if (gameData?.isActive) {
      console.log("old");
      const { gridSize, shuffleHash, gameId, hintType } = gameData;
      if (gridSize === 3 || gridSize === 4 || gridSize === 5) {
        onStartGame(gridSize, shuffleHash, gameId, hintType);
      } else {
        console.error("Invalid grid size");
      }
    } else {
      console.log("new");

      await createGame(difficulty);
      window.location.reload();
      refetch();
    }
  };
  console.log(gameData);

  const logEvent = async () => {
    // refetch();
    cancelGame();

    // console.log(logs);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Game Card */}
        <Card className="w-full">
          <CardHeader>
            <button onClick={() => logEvent()}>TEST</button>
            <CardTitle className="text-3xl">Sliding Puzzle Game</CardTitle>
            <CardDescription>
              Welcome to the blockchain-based sliding puzzle game!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wallet Connection */}
            {!isWalletConnected && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Wallet2 className="text-yellow-600" />
                  <p className="text-yellow-700">
                    Please connect your wallet to start playing
                  </p>
                </div>
                <Button onClick={onConnect} className="mt-2">
                  Connect Wallet
                </Button>
              </div>
            )}

            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <div>
                {gameData?.isActive ? (
                  <ActiveGameDetail
                    gridSize={gameData.gridSize}
                    gameId={gameData.gameId}
                    hintType={gameData.hintType}
                    shuffleHash={gameData.shuffleHash}
                  />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-lg font-semibold">
                        Select Difficulty
                      </Label>
                      <RadioGroup
                        defaultValue="3"
                        className="mt-2 space-y-2"
                        onValueChange={(value) =>
                          setDifficulty(Number(value) as 3 | 4 | 5)
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3" id="easy" />
                          <Label htmlFor="easy">Easy (3x3)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="4" id="medium" />
                          <Label htmlFor="medium">Medium (4x4)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5" id="hard" />
                          <Label htmlFor="hard">Hard (5x5)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="multiplayer"
                        checked={false}
                        disabled={true}
                        onCheckedChange={() => {
                          toast({
                            title: "Coming Soon",
                            description:
                              "Multiplayer mode will be available in a future update.",
                            duration: 3000,
                          });
                        }}
                      />
                      <Label
                        htmlFor="multiplayer"
                        className="text-muted-foreground"
                      >
                        Multiplayer Mode (Coming Soon)
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            {gameData?.isActive ? (
              <div className="flex space-x-4 w-full">
                <Button
                  onClick={handleStartGame}
                  disabled={!isWalletConnected || isLoading}
                  className="w-full"
                >
                  {" "}
                  Resume Game
                </Button>{" "}
                <Button
                  onClick={async () => {
                    await cancelGame();
                    refetch();
                  }}
                  disabled={!isWalletConnected || isLoading}
                  className="w-full"
                >
                  Cancel Game
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleStartGame}
                disabled={!isWalletConnected || isLoading}
                className="w-full"
              >
                Create Game
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Rules Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <CardTitle>How to Play</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Game Rules:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>
                    The game board consists of numbered tiles and one empty
                    space
                  </li>
                  <li>
                    Click or tap adjacent tiles to slide them into the empty
                    space
                  </li>
                  <li>Arrange the tiles in numerical order to win</li>
                  <li>The game is timed and your moves are counted</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Difficulty Levels:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Easy: 3x3 grid (8 tiles)</li>
                  <li>Medium: 4x4 grid (15 tiles)</li>
                  <li>Hard: 5x5 grid (24 tiles)</li>
                </ul>
              </div>

              {isMultiplayer && (
                <div>
                  <h3 className="font-semibold mb-2">Multiplayer Mode:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Compete with other players in real-time</li>
                    <li>First player to solve the puzzle wins</li>
                    <li>Your progress is tracked on the blockchain</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreGameUI;

const ActiveGameDetail = ({
  gameId,
  gridSize,
  hintType,
  shuffleHash,
}: {
  gameId: number;
  gridSize: number;
  hintType: number;
  shuffleHash: string;
}) => {
  // Helper function to determine difficulty label
  const getDifficultyLabel = (size: number) => {
    switch (size) {
      case 3:
        return { label: "Easy", color: "bg-green-500" };
      case 4:
        return { label: "Medium", color: "bg-yellow-500" };
      case 5:
        return { label: "Hard", color: "bg-red-500" };
      default:
        return { label: "Custom", color: "bg-gray-500" };
    }
  };

  // Helper function to determine hint type label
  const getHintTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return { label: "No Hints", color: "bg-gray-500" };
      case 1:
        return { label: "Gold Hints", color: "bg-amber-400" };
      case 2:
        return { label: "Silver Hints", color: "bg-slate-300" };
      default:
        return { label: "Unknown", color: "bg-gray-500" };
    }
  };

  // Truncate shuffle hash
  const truncatedHash =
    shuffleHash.length > 10
      ? `${shuffleHash.substring(0, 6)}...${shuffleHash.substring(
          shuffleHash.length - 4
        )}`
      : shuffleHash;

  const difficulty = getDifficultyLabel(gridSize);
  const hint = getHintTypeLabel(hintType);

  return (
    <Card className="w-full  shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            Game #{gameId.toString()}
          </CardTitle>
          <Badge className={`${difficulty.color} text-white`}>
            {difficulty.label}
          </Badge>
        </div>
        <CardDescription>Game configuration details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Grid Size:</span>
            <span className="font-mono">
              {gridSize}x{gridSize}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Hint Type:</span>
            {hintType === 1 && (
              <div className="flex items-center gap-2">
                <span>Gold</span> <GoldMedal />
              </div>
            )}

            {hintType === 2 && (
              <div className="flex items-center gap-2">
                <span>Silver</span> <SilverMedal />
              </div>
            )}
            {hintType !== 1 && hintType !== 2 && <div>No Hint</div>}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Shuffle Hash:</span>
            <span className="font-mono text-xs cursor-help">
              {truncatedHash}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="w-full space-y-4">
      {/* Header/Title skeleton */}
      <Skeleton className="h-8 w-3/4 mb-2" />

      {/* Content area skeletons */}
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />

      {/* Action area skeletons */}
      <div className="pt-4 space-y-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    </div>
  );
};
