import { Chess } from "chess.js";

/**
 * FEN (Forsyth-Edwards Notation) utilities for board state serialization
 */

export const STARTING_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const EMPTY_BOARD_FEN = "8/8/8/8/8/8/8/8 w - - 0 1";

/**
 * Common chess positions for testing and examples
 */
export const FAMOUS_POSITIONS = {
  starting: STARTING_FEN,
  empty: EMPTY_BOARD_FEN,
  // Sicilian Defense
  sicilian: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
  // Scholar's Mate position (before mate)
  scholarsMate:
    "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
  // Endgame: King and Pawn vs King
  kingPawnEndgame: "8/8/8/4k3/4P3/4K3/8/8 w - - 0 1",
  // Back rank mate threat
  backRankMate: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
  // Lucena Position (winning endgame)
  lucena: "1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1",
  // Philidor Position (drawing endgame)
  philidor: "3k4/R7/8/8/8/8/r2KP3/8 b - - 0 1",
} as const;

/**
 * Validate a FEN string
 */
export function isValidFEN(fen: string): boolean {
  try {
    const chess = new Chess();
    chess.load(fen);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse FEN and return board details
 */
export function parseFEN(fen: string): {
  valid: boolean;
  turn: "w" | "b";
  castling: string;
  enPassant: string;
  halfmove: number;
  fullmove: number;
} {
  const defaultResult = {
    valid: false,
    turn: "w" as const,
    castling: "-",
    enPassant: "-",
    halfmove: 0,
    fullmove: 1,
  };

  if (!isValidFEN(fen)) {
    return defaultResult;
  }

  const parts = fen.split(" ");
  if (parts.length !== 6) {
    return defaultResult;
  }

  return {
    valid: true,
    turn: parts[1] as "w" | "b",
    castling: parts[2],
    enPassant: parts[3],
    halfmove: parseInt(parts[4]) || 0,
    fullmove: parseInt(parts[5]) || 1,
  };
}

/**
 * Get simplified board representation from FEN
 */
export function getFENPiecePlacement(fen: string): string {
  return fen.split(" ")[0];
}

/**
 * Create FEN from parts
 */
export function createFEN(
  piecePlacement: string,
  turn: "w" | "b" = "w",
  castling: string = "KQkq",
  enPassant: string = "-",
  halfmove: number = 0,
  fullmove: number = 1,
): string {
  return `${piecePlacement} ${turn} ${castling} ${enPassant} ${halfmove} ${fullmove}`;
}

/**
 * Load FEN into a chess instance safely
 */
export function loadFEN(chess: Chess, fen: string): boolean {
  try {
    chess.load(fen);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get FEN from chess instance
 */
export function getFEN(chess: Chess): string {
  return chess.fen();
}

/**
 * Compare two FEN strings (position only, ignoring move counters)
 */
export function compareFENPositions(fen1: string, fen2: string): boolean {
  const parts1 = fen1.split(" ");
  const parts2 = fen2.split(" ");

  // Compare first 4 parts (board, turn, castling, en passant)
  return (
    parts1[0] === parts2[0] &&
    parts1[1] === parts2[1] &&
    parts1[2] === parts2[2] &&
    parts1[3] === parts2[3]
  );
}

/**
 * Get position key for threefold repetition checking
 */
export function getPositionKey(fen: string): string {
  const parts = fen.split(" ");
  // Include board, turn, castling, and en passant for position key
  return parts.slice(0, 4).join(" ");
}

/**
 * Reset board to starting position
 */
export function resetToStartingPosition(chess: Chess): void {
  chess.reset();
}

/**
 * Clear board completely
 */
export function clearBoard(chess: Chess): void {
  chess.clear();
}
