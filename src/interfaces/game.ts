// types.ts
export interface PuzzlePiece {
  id: number;
  currentPos: number;
}

export interface GameState {
  gameId: string | null;
  mode: "SINGLE" | "MULTIPLAYER";
  opponent: string | null;
  timeLimit: number;
  hasStarted: boolean;
}

export type GameMode = "SINGLE" | "MULTIPLAYER";
