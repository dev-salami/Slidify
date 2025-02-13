"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PuzzlePiece {
  id: number;
  currentPos: number;
}

const SlidingPuzzle = () => {
  const [gridSize, setGridSize] = useState(4);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [emptyPos, setEmptyPos] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isWon, setIsWon] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const PIECE_SIZE = 400 / gridSize; // px

  // Initialize puzzle
  useEffect(() => {
    initializePuzzle();
  }, [gridSize]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isWon) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  const initializePuzzle = () => {
    const totalPieces = gridSize * gridSize - 1;
    const initialPieces = Array.from({ length: totalPieces }, (_, index) => ({
      id: index + 1,
      currentPos: index
    }));
    setPieces(initialPieces);
    setEmptyPos(totalPieces);
    setMoveCount(0);
    setTime(0);
    setIsWon(false);
    setIsPlaying(false);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if puzzle is in won state
  const checkWinCondition = useCallback(() => {
    return pieces.every(piece => piece.currentPos === piece.id - 1) && 
           emptyPos === (gridSize * gridSize - 1);
  }, [pieces, emptyPos, gridSize]);

  // Check if move is valid (adjacent to empty space)
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

  // Move piece to empty space
  const movePiece = (piecePos: number) => {
    if (!isValidMove(piecePos) || isWon) return;

    if (!isPlaying) {
      setIsPlaying(true);
    }

    setPieces(prev => {
      const newPieces = prev.map(piece => {
        if (piece.currentPos === piecePos) {
          return { ...piece, currentPos: emptyPos };
        }
        return piece;
      });
      return newPieces;
    });

    setEmptyPos(piecePos);
    setMoveCount(prev => prev + 1);
  };

  // Effect to check win condition after each move
  useEffect(() => {
    if (pieces.length > 0 && checkWinCondition()) {
      setIsWon(true);
      setIsPlaying(false);
    }
  }, [pieces, emptyPos, checkWinCondition]);

  // Shuffle pieces
  const shufflePuzzle = () => {
    const totalPositions = gridSize * gridSize;
    const availablePositions = Array.from({ length: totalPositions }, (_, i) => i);
    const newPieces = [...pieces];
    let newEmptyPos = totalPositions - 1;

    // Fisher-Yates shuffle
    for (let i = availablePositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availablePositions[i], availablePositions[j]] = 
      [availablePositions[j], availablePositions[i]];
    }

    // Assign new positions to pieces
    newPieces.forEach((piece, index) => {
      piece.currentPos = availablePositions[index];
    });

    newEmptyPos = availablePositions[availablePositions.length - 1];

    setPieces(newPieces);
    setEmptyPos(newEmptyPos);
    setIsWon(false);
    setMoveCount(0);
    setTime(0);
    setIsPlaying(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getBackgroundPosition = (id: number) => {
    const originalRow = Math.floor((id - 1) / gridSize);
    const originalCol = (id - 1) % gridSize;
    return {
      x: originalCol * PIECE_SIZE,
      y: originalRow * PIECE_SIZE
    };
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 w-full justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold">Difficulty:</span>
            <Select 
              onValueChange={(value) => setGridSize(Number(value))}
              defaultValue="4"
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3x3 Easy</SelectItem>
                <SelectItem value="4">4x4 Medium</SelectItem>
                <SelectItem value="5">5x5 Hard</SelectItem>
              </SelectContent>
            </Select>
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

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        
        <div 
          className="relative w-[400px] h-[400px] border-2 border-gray-200"
        >
          {pieces.map((piece) => {
            const bgPos = getBackgroundPosition(piece.id);
            return (
              <div
                key={piece.id}
                className={`absolute transition-all duration-200
                  ${isValidMove(piece.currentPos) ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                style={{
                  width: PIECE_SIZE,
                  height: PIECE_SIZE,
                  left: (piece.currentPos % gridSize) * PIECE_SIZE,
                  top: Math.floor(piece.currentPos / gridSize) * PIECE_SIZE,
                  backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                  backgroundPosition: `-${bgPos.x}px -${bgPos.y}px`,
                  backgroundSize: '400px 400px',
                }}
                onClick={() => movePiece(piece.currentPos)}
              >
                {!imageUrl && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xl">
                    {piece.id}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button
          onClick={shufflePuzzle}
          className="mt-4"
          variant="outline"
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Shuffle
        </Button>

        {isWon && (
          <div className="text-green-600 font-bold mt-4">
            Congratulations! You solved the puzzle in {moveCount} moves and {formatTime(time)}!
          </div>
        )}
      </div>
    </Card>
  );
};

export default SlidingPuzzle;