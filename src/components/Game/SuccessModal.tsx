import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { solvePuzzle } from "@/utils/singlePlayerInteraction";
import ReactConfetti from "react-confetti";

const GameSuccessModal = ({
  isOpen,
  time,
  moveCount,
  gameId,
  onClose,
  onPlayAgain,
}: {
  onClose: () => void;
  isOpen: boolean;
  time: string;
  moveCount: number;
  gameId: number;
  onPlayAgain: () => void;
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  // Update dimensions when window size changes
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Control confetti visibility
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);

      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && showConfetti && (
        <ReactConfetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
        />
      )}

      <Dialog
        open={isOpen}
        onOpenChange={(isOpen: boolean) => !isOpen && onClose()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-600">
              Puzzle Solved!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              {` Congratulations! You've successfully completed the puzzle.`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="text-green-600 font-bold mt-4 text-center">
              <div>Congratulations! You solved the puzzle!</div>
              <div className="text-sm">
                Time: {time} | Moves: {moveCount}
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-center gap-2 flex-row">
            <Button variant="outline" onClick={onPlayAgain}>
              Play Again
            </Button>
            <Button
              onClick={() => solvePuzzle(BigInt(gameId))}
              className="bg-green-600 hover:bg-green-700"
            >
              Claim onchain reward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GameSuccessModal;
