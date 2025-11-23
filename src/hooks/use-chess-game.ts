"use client";

import type { Move, PieceSymbol, Square } from "chess.js";
import { useCallback, useState } from "react";
import { Chess } from "chess.js";

import {
  getGameStatus,
  getValidMoves,
  isCapture,
  tryMakeMove,
} from "~/utils/chess-helpers";
import { getFEN, loadFEN, STARTING_FEN } from "~/utils/fen-utils";
import { exportPGN, getGameResult } from "~/utils/pgn-utils";

export type Orientation = "white" | "black";

export interface MoveResult {
  success: boolean;
  move?: Move;
  isCapture?: boolean;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isGameOver?: boolean;
}

export interface HighlightSquares {
  selected?: Square;
  validMoves: Square[];
  lastMove: Square[];
  check?: Square;
}

interface UseChessGameOptions {
  initialFen?: string;
  orientation?: Orientation;
  onMove?: (move: Move) => void;
  onGameOver?: (result: string) => void;
}

export interface UseChessGameReturn {
  // Game state
  chess: Chess;
  fen: string;
  turn: "w" | "b";
  gameOver: boolean;
  winner: "white" | "black" | "draw" | null;
  status: string;
  moveHistory: string[];
  currentMoveNumber: number;

  // Board state
  orientation: Orientation;
  highlights: HighlightSquares;
  inCheck: boolean;

  // Actions
  makeMove: (from: Square, to: Square, promotion?: PieceSymbol) => MoveResult;
  selectSquare: (square: Square) => void;
  clearSelection: () => void;
  undoMove: () => boolean;
  resetGame: () => void;
  flipBoard: () => void;

  // Import/Export
  loadFEN: (fen: string) => boolean;
  loadPGN: (pgn: string) => boolean;
  exportPGN: (metadata?: Record<string, string>) => string;
  exportFEN: () => string;

  // Utility
  isValidMove: (from: Square, to: Square) => boolean;
  getValidMovesForSquare: (square: Square) => Square[];
  getPieceAt: (
    square: Square,
  ) => { type: PieceSymbol; color: "w" | "b" } | null;
}

/**
 * Main chess game hook - encapsulates all game logic
 */
export function useChessGame(
  options: UseChessGameOptions = {},
): UseChessGameReturn {
  const {
    initialFen = STARTING_FEN,
    orientation: initialOrientation = "white",
    onMove,
    onGameOver,
  } = options;

  // Core game state
  const [chess] = useState(() => new Chess(initialFen));
  const [fen, setFen] = useState(initialFen);
  const [orientation, setOrientation] =
    useState<Orientation>(initialOrientation);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"white" | "black" | "draw" | null>(null);

  // Selection and highlighting
  const [selectedSquare, setSelectedSquare] = useState<Square | undefined>();
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<Square[]>([]);

  // Sync FEN state
  const updateGameState = useCallback(() => {
    const newFen = getFEN(chess);
    setFen(newFen);

    // Check game over conditions
    if (chess.isGameOver()) {
      setGameOver(true);

      if (chess.isCheckmate()) {
        setWinner(chess.turn() === "w" ? "black" : "white");
      } else {
        setWinner("draw");
      }

      if (onGameOver) {
        onGameOver(getGameResult(chess));
      }
    }
  }, [chess, onGameOver]);

  // Make a move
  const makeMove = useCallback(
    (from: Square, to: Square, promotion?: PieceSymbol): MoveResult => {
      const move = tryMakeMove(chess, from, to, promotion);

      if (!move) {
        return { success: false };
      }

      const isCaptureMove = isCapture(chess, move);

      setLastMove([from, to]);
      setSelectedSquare(undefined);
      setValidMoves([]);
      updateGameState();

      if (onMove) {
        onMove(move);
      }

      return {
        success: true,
        move,
        isCapture: isCaptureMove,
        isCheck: chess.isCheck(),
        isCheckmate: chess.isCheckmate(),
        isGameOver: chess.isGameOver(),
      };
    },
    [chess, onMove, updateGameState],
  );

  // Select a square
  const selectSquare = useCallback(
    (square: Square) => {
      const piece = chess.get(square);

      // If no piece or wrong color, try to move to this square
      if (!piece || piece.color !== chess.turn()) {
        if (selectedSquare) {
          makeMove(selectedSquare, square);
        }
        return;
      }

      // Select piece and show valid moves
      setSelectedSquare(square);
      const moves = getValidMoves(chess, square);
      setValidMoves(moves);
    },
    [chess, selectedSquare, makeMove],
  );

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedSquare(undefined);
    setValidMoves([]);
  }, []);

  // Undo last move
  const undoMove = useCallback((): boolean => {
    const move = chess.undo();
    if (move) {
      setLastMove([]);
      setSelectedSquare(undefined);
      setValidMoves([]);
      setGameOver(false);
      setWinner(null);
      updateGameState();
      return true;
    }
    return false;
  }, [chess, updateGameState]);

  // Reset game
  const resetGame = useCallback(() => {
    chess.reset();
    setLastMove([]);
    setSelectedSquare(undefined);
    setValidMoves([]);
    setGameOver(false);
    setWinner(null);
    updateGameState();
  }, [chess, updateGameState]);

  // Flip board
  const flipBoard = useCallback(() => {
    setOrientation((prev) => (prev === "white" ? "black" : "white"));
  }, []);

  // Load FEN
  const loadFENHandler = useCallback(
    (newFen: string): boolean => {
      const success = loadFEN(chess, newFen);
      if (success) {
        setLastMove([]);
        setSelectedSquare(undefined);
        setValidMoves([]);
        setGameOver(false);
        setWinner(null);
        updateGameState();
      }
      return success;
    },
    [chess, updateGameState],
  );

  // Load PGN
  const loadPGNHandler = useCallback(
    (pgn: string): boolean => {
      try {
        chess.loadPgn(pgn);
        setLastMove([]);
        setSelectedSquare(undefined);
        setValidMoves([]);
        updateGameState();
        return true;
      } catch {
        return false;
      }
    },
    [chess, updateGameState],
  );

  // Export PGN
  const exportPGNHandler = useCallback(
    (metadata?: Record<string, string>): string => {
      return exportPGN(chess, metadata);
    },
    [chess],
  );

  // Export FEN
  const exportFEN = useCallback((): string => {
    return getFEN(chess);
  }, [chess]);

  // Check if move is valid
  const isValidMove = useCallback(
    (from: Square, to: Square): boolean => {
      const moves = chess.moves({ square: from, verbose: true }) as Move[];
      return moves.some((move) => move.to === to);
    },
    [chess],
  );

  // Get valid moves for square
  const getValidMovesForSquare = useCallback(
    (square: Square): Square[] => {
      return getValidMoves(chess, square);
    },
    [chess],
  );

  // Get piece at square
  const getPieceAt = useCallback(
    (square: Square) => {
      const piece = chess.get(square);
      return piece || null;
    },
    [chess],
  );

  // Get check square
  const checkSquare = chess.isCheck()
    ? (chess
        .board()
        .flat()
        .find((sq) => sq && sq.type === "k" && sq.color === chess.turn())
        ?.square as Square | undefined)
    : undefined;

  return {
    // Game state
    chess,
    fen,
    turn: chess.turn(),
    gameOver,
    winner,
    status: getGameStatus(chess),
    moveHistory: chess.history(),
    currentMoveNumber: chess.moveNumber(),

    // Board state
    orientation,
    highlights: {
      selected: selectedSquare,
      validMoves,
      lastMove,
      check: checkSquare,
    },
    inCheck: chess.isCheck(),

    // Actions
    makeMove,
    selectSquare,
    clearSelection,
    undoMove,
    resetGame,
    flipBoard,

    // Import/Export
    loadFEN: loadFENHandler,
    loadPGN: loadPGNHandler,
    exportPGN: exportPGNHandler,
    exportFEN,

    // Utility
    isValidMove,
    getValidMovesForSquare,
    getPieceAt,
  };
}
