// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useState } from "react";

import PreGameUI from "@/components/Game/PreGameUI";
import { injected, useAccount, useConnect } from "wagmi";
import SinglePlayerPuzzle from "@/components/Game/SinglePlayer";

const Game = () => {
  // Game state
  const [gridSize, setGridSize] = useState(4);

  const [shuffleHash, setShuffleHash] = useState("");
  const [gameId, setGameId] = useState(0);
  const [hintType, setHintType] = useState(0);

  const { connect } = useConnect();
  const { isConnected } = useAccount();

  const handleConnect = async () => {
    try {
      await connect({ connector: injected() });
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };

  const startGame = (
    difficulty: 3 | 4 | 5,
    hash: string,
    id: number,
    hintType: number
  ) => {
    setShuffleHash(hash);
    setGameId(id);
    setGridSize(difficulty);
    setHintType(hintType);
  };

  if (!shuffleHash || !gameId)
    return (
      <PreGameUI
        isWalletConnected={isConnected}
        onConnect={handleConnect}
        onStartGame={startGame}
      />
    );

  return (
    <SinglePlayerPuzzle
      shuffleHash={shuffleHash}
      gameId={gameId}
      gridSize={gridSize}
      hintType={hintType}
    />
  );
};

export default Game;
