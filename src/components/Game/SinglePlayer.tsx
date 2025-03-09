/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getGeneratedImageUrl } from "@/utils/image";
import Image from "next/image";
import {
  buyHint,
  cancelGame,
  solvePuzzle,
} from "@/utils/singlePlayerInteraction";
import GameSuccessModal from "./SuccessModal";
import { GoldMedal, SilverMedal } from "../General/Icons";

interface PuzzlePiece {
  id: number;
  currentPos: number;
}

export interface GameState {
  gameId: number;
  shuffleHash: string;
  isActive: boolean;
  isSolved: boolean;
}

const SinglePlayerPuzzle = ({
  shuffleHash,
  gameId,
  gridSize,
  hintType,
}: {
  shuffleHash: string;
  gameId: number;
  gridSize: number;
  hintType: number;
}) => {
  // Game state
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [emptyPos, setEmptyPos] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isWon, setIsWon] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [time, setTime] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);
  const [showAllHints, setShowAllHints] = useState(hintType === 1);
  const [showHoverHint, setShowHoverHint] = useState(hintType === 2);

  // Blockchain state
  const [gameState, setGameState] = useState<GameState | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PIECE_SIZE = 400 / gridSize; // px

  // Initialize puzzle
  useEffect(() => {
    initializePuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isWon) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  const initializePuzzle = async () => {
    const totalPieces = gridSize * gridSize - 1;
    const initialPieces = Array.from({ length: totalPieces }, (_, index) => ({
      id: index + 1,
      currentPos: index,
    }));

    console.log(initialPieces);
    setPieces(initialPieces);
    setEmptyPos(totalPieces);
    setMoveCount(0);
    setTime(0);
    setIsWon(false);
    setIsPlaying(false);
    setGameState(null);
    const url = await getGeneratedImageUrl(Number(gameId));
    console.log(url);
    setImageUrl(url);
  };

  // Deterministic shuffle based on blockchain hash
  const deterministicShuffle = (hash: string, currentPieces: PuzzlePiece[]) => {
    const hashNum = BigInt(hash);
    const totalPositions = gridSize * gridSize;
    const availablePositions = Array.from(
      { length: totalPositions },
      (_, i) => i
    );
    const newPieces = [...currentPieces];

    // Use the hash to create a deterministic shuffle
    for (let i = availablePositions.length - 1; i > 0; i--) {
      const value = (hashNum >> BigInt(i * 8)) & BigInt(0xff);
      const j = Number(value % BigInt(i + 1));
      [availablePositions[i], availablePositions[j]] = [
        availablePositions[j],
        availablePositions[i],
      ];
    }

    // Assign new positions to pieces
    newPieces.forEach((piece, index) => {
      piece.currentPos = availablePositions[index];
    });

    return {
      pieces: newPieces,
      emptyPos: availablePositions[availablePositions.length - 1],
    };
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Check if puzzle is in won state
  const checkWinCondition = useCallback(() => {
    return (
      pieces.every((piece) => piece.currentPos === piece.id - 1) &&
      emptyPos === gridSize * gridSize - 1
    );
  }, [pieces, emptyPos, gridSize]);

  // Check if move is valid
  const isValidMove = (piecePos: number) => {
    const pieceRow = Math.floor(piecePos / gridSize);
    const pieceCol = piecePos % gridSize;
    const emptyRow = Math.floor(emptyPos / gridSize);
    const emptyCol = emptyPos % gridSize;

    return (
      (pieceRow === emptyRow && Math.abs(pieceCol - emptyCol) === 1) ||
      (pieceCol === emptyCol && Math.abs(pieceRow - emptyRow) === 1)
    );
  };

  // Move piece
  const movePiece = (piecePos: number) => {
    if (!isValidMove(piecePos) || isWon) return;

    if (!isPlaying) {
      setIsPlaying(true);
    }

    setPieces((prev) => {
      const newPieces = prev.map((piece) => {
        if (piece.currentPos === piecePos) {
          return { ...piece, currentPos: emptyPos };
        }
        return piece;
      });
      return newPieces;
    });

    setEmptyPos(piecePos);
    setMoveCount((prev) => prev + 1);
  };

  // Effect to check win condition
  useEffect(() => {
    const verifyWin = async () => {
      if (pieces.length > 0 && checkWinCondition() && gameState && !isWon) {
        console.log(checkWinCondition());
        try {
          const isValid = true;
          if (isValid) {
            setIsWon(true);
            setIsPlaying(false);
            setGameState((prev) => (prev ? { ...prev, isSolved: true } : null));
            setShowSuccessModal(true);
          }
        } catch (error) {
          console.error("Error verifying solution:", error);
          setError("Failed to verify solution on blockchain");
        }
      }
    };

    verifyWin();
  }, [pieces, emptyPos, checkWinCondition, gameState, isWon]);

  // Shuffle puzzle using blockchain
  const shufflePuzzle = async () => {
    try {
      // Apply the deterministic shuffle
      const { pieces: newPieces, emptyPos: newEmptyPos } = deterministicShuffle(
        // shuffleHash.toString(),
        shuffleHash,
        pieces
      );
      setPieces(newPieces);
      setEmptyPos(newEmptyPos);
      setGameState({
        gameId: gameId,
        shuffleHash: shuffleHash.toString(),
        isActive: true,
        isSolved: false,
      });

      setIsWon(false);
      setMoveCount(0);
      setTime(0);
      setIsPlaying(true);
      setError(null);
    } catch (error) {
      console.error("Error creating new game:", error);
      setError("Failed to create new game on blockchain");
    } finally {
      setIsLoading(false);
    }
  };

  const getBackgroundPosition = (id: number) => {
    const originalRow = Math.floor((id - 1) / gridSize);
    const originalCol = (id - 1) % gridSize;
    return {
      x: originalCol * PIECE_SIZE,
      y: originalRow * PIECE_SIZE,
    };
  };

  const buyHintFunc = async (type: number) => {
    await buyHint({ gameId: BigInt(gameId), hintType: type });
  };

  return (
    <Card className="p-6 w-fit mx-auto mt-6 ">
      <div className="flex flex-row gap-8 items-start ">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => {
              setPieces([
                {
                  id: 1,
                  currentPos: 0,
                },
                {
                  id: 2,
                  currentPos: 1,
                },
                {
                  id: 3,
                  currentPos: 2,
                },
                {
                  id: 4,
                  currentPos: 3,
                },
                {
                  id: 5,
                  currentPos: 4,
                },
                {
                  id: 6,
                  currentPos: 5,
                },
                {
                  id: 7,
                  currentPos: 6,
                },
                {
                  id: 8,
                  currentPos: 7,
                },
              ]);
              setEmptyPos(gridSize * gridSize - 1);
            }}
          >
            WIN AUTO
          </button>
          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Game Controls */}
          <div className="flex items-center gap-4 w-full justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">Difficulty:</span>
              {gridSize === 3 && <span>3x3 Easy</span>}
              {gridSize === 4 && <span>4x4 Medium</span>}
              {gridSize === 5 && <span>5x5 Hard</span>}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm">
                Time: <span className="font-mono">{formatTime(time)}</span>
              </div>
              <div className="text-sm">
                Moves: <span className="font-mono">{moveCount}</span>
              </div>
            </div>
          </div>

          {/* Game Hint */}
          <div className="flex items-center gap-4 w-full justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Hint Type:</span>
              {hintType === 1 && (
                <div className="flex gap-2 items-center">
                  <span>Gold</span> <GoldMedal />
                </div>
              )}

              {hintType === 2 && (
                <div className="flex gap-2 items-center">
                  <span>Silver</span> <SilverMedal />
                </div>
              )}
              {hintType !== 1 && hintType !== 2 && <div>No Hint</div>}
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={() => buyHintFunc(1)}>Buy Gold Hint</Button>
              <Button onClick={() => buyHintFunc(2)}>Buy Silver Hint</Button>
            </div>
          </div>
          <section className="flex flex-col md:flex-row  items-center gap-8">
            {/* Game Board */}
            <div className="relative w-[400px] h-[400px] border-2 border-gray-200">
              {pieces.map((piece) => {
                const bgPos = getBackgroundPosition(piece.id);
                const showHint =
                  showAllHints || (showHoverHint && hoveredPiece === piece.id);

                return (
                  <div
                    key={piece.id}
                    className={`absolute transition-all duration-200
              ${
                isValidMove(piece.currentPos)
                  ? "cursor-pointer hover:scale-105"
                  : "cursor-default"
              }`}
                    style={{
                      width: PIECE_SIZE,
                      height: PIECE_SIZE,
                      left: (piece.currentPos % gridSize) * PIECE_SIZE,
                      top: Math.floor(piece.currentPos / gridSize) * PIECE_SIZE,
                      backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                      backgroundPosition: `-${bgPos.x}px -${bgPos.y}px`,
                      backgroundSize: "400px 400px",
                    }}
                    onClick={() => movePiece(piece.currentPos)}
                    onMouseEnter={() => setHoveredPiece(piece.id)}
                    onMouseLeave={() => setHoveredPiece(null)}
                  >
                    {/* Hint number overlay */}
                    {showHint && (
                      <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white rounded-md px-2 py-0.5 text-sm font-bold z-10">
                        {piece.id}
                      </div>
                    )}

                    {/* Fallback numbers when no image */}
                    {!imageUrl && (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xl">
                        {piece.id}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Solution Image */}
            {imageUrl && (
              <div className="hidden lg:block">
                <div className="w-[400px] h-[400px] border-2 border-gray-200 overflow-hidden">
                  <Image
                    width={400}
                    height={400}
                    src={imageUrl}
                    alt="Complete puzzle"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Game Actions */}
          <div className="flex gap-4 mt-4">
            <Button onClick={shufflePuzzle} variant="outline">
              <Shuffle className="mr-2 h-4 w-4" />
              {isLoading ? "Creating Game..." : "Start Game"}
            </Button>

            <Button onClick={cancelGame} variant="outline">
              Cancel Game
            </Button>
          </div>

          {/* Game State Display */}
          {/* {gameState && (
            <div className="text-sm mt-2 text-center">
              <div>Game ID: {gameState.gameId}</div>
              <div>Shuffle Hash: {gameState.shuffleHash.slice(0, 10)}...</div>
              {gameState.isSolved && (
                <div className="text-green-600 font-semibold">
                  Solution verified on blockchain!
                </div>
              )}
            </div>
          )} */}

          <GameSuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            time={formatTime(time)}
            gameId={gameId}
            moveCount={moveCount}
            onPlayAgain={() => {
              setShowSuccessModal(false);
              // Reset game logic here
            }}
          />

          {/* Win Message */}
          {/* {isWon && (
            <div className="text-green-600 font-bold mt-4 text-center">
              <div>Congratulations! You solved the puzzle!</div>
              <div className="text-sm">
                Time: {formatTime(time)} | Moves: {moveCount}
              </div>

              <Button onClick={() => solvePuzzle(BigInt(gameId))}>
                Claim onchain reward
              </Button>
            </div>
          )} */}
        </div>
      </div>
    </Card>
  );
};

export default SinglePlayerPuzzle;
