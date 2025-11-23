import type { Move, PieceSymbol, Square } from "chess.js";
import { Chess } from "chess.js";

/**
 * Chess helper utilities for board state management and move processing
 */

export type ChessColor = "w" | "b";
export type ChessPiece = {
  type: PieceSymbol;
  color: ChessColor;
};

export interface BoardPosition {
  square: Square;
  piece: ChessPiece | null;
}

export interface MoveHighlight {
  square: Square;
  type: "selected" | "valid" | "lastMove" | "check";
}

/**
 * Convert chess.js board state to a flat array of positions
 */
export function getBoardPositions(chess: Chess): BoardPosition[] {
  const positions: BoardPosition[] = [];
  const board = chess.board();

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      const square = `${String.fromCharCode(97 + col)}${8 - row}` as Square;

      positions.push({
        square,
        piece: piece
          ? { type: piece.type, color: piece.color as ChessColor }
          : null,
      });
    }
  }

  return positions;
}

/**
 * Get valid moves for a piece at a given square
 */
export function getValidMoves(chess: Chess, square: Square): Square[] {
  const moves = chess.moves({ square, verbose: true }) as Move[];
  return moves.map((move) => move.to);
}

/**
 * Check if a square is light or dark
 */
export function isLightSquare(square: Square): boolean {
  const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
  const rank = parseInt(square[1]);
  return (file + rank) % 2 !== 0;
}

/**
 * Get square notation from coordinates
 */
export function getSquareFromCoords(
  row: number,
  col: number,
  orientation: "white" | "black" = "white",
): Square {
  const actualRow = orientation === "white" ? 7 - row : row;
  const actualCol = orientation === "white" ? col : 7 - col;
  const file = String.fromCharCode(97 + actualCol);
  const rank = actualRow + 1;
  return `${file}${rank}` as Square;
}

/**
 * Get coordinates from square notation
 */
export function getCoordsFromSquare(
  square: Square,
  orientation: "white" | "black" = "white",
): { row: number; col: number } {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;

  if (orientation === "white") {
    return { row: 7 - rank, col: file };
  } else {
    return { row: rank, col: 7 - file };
  }
}

/**
 * Get piece image path
 */
export function getPieceImagePath(piece: ChessPiece): string {
  const colorSuffix = piece.color === "w" ? "w" : "b";
  const pieceNames: Record<PieceSymbol, string> = {
    p: "pawn",
    n: "knight",
    b: "bishop",
    r: "rook",
    q: "queen",
    k: "king",
  };

  return `/pieces/${pieceNames[piece.type]}-${colorSuffix}.svg`;
}

/**
 * Check if a move is a capture
 */
export function isCapture(chess: Chess, move: Move): boolean {
  return move.captured !== undefined;
}

/**
 * Check if a move is castling
 */
export function isCastling(move: Move): boolean {
  return move.flags.includes("k") || move.flags.includes("q");
}

/**
 * Check if a move is en passant
 */
export function isEnPassant(move: Move): boolean {
  return move.flags.includes("e");
}

/**
 * Check if a move is promotion
 */
export function isPromotion(move: Move): boolean {
  return move.promotion !== undefined;
}

/**
 * Get game status message
 */
export function getGameStatus(chess: Chess): string {
  if (chess.isCheckmate()) {
    return `Checkmate! ${chess.turn() === "w" ? "Black" : "White"} wins`;
  }
  if (chess.isStalemate()) {
    return "Stalemate - Draw";
  }
  if (chess.isThreefoldRepetition()) {
    return "Draw by threefold repetition";
  }
  if (chess.isInsufficientMaterial()) {
    return "Draw by insufficient material";
  }
  if (chess.isDraw()) {
    return "Draw";
  }
  if (chess.isCheck()) {
    return `${chess.turn() === "w" ? "White" : "Black"} is in check`;
  }
  return `${chess.turn() === "w" ? "White" : "Black"} to move`;
}

/**
 * Format move for display (e.g., "e2-e4", "Nf3", etc.)
 */
export function formatMoveNotation(move: Move): string {
  return move.san;
}

/**
 * Get opposite color
 */
export function getOppositeColor(color: ChessColor): ChessColor {
  return color === "w" ? "b" : "w";
}

/**
 * Parse move string and attempt to make move
 */
export function tryMakeMove(
  chess: Chess,
  from: Square,
  to: Square,
  promotion?: PieceSymbol,
): Move | null {
  try {
    const move = chess.move({
      from,
      to,
      promotion: promotion || "q",
    });
    return move;
  } catch (error) {
    console.error(error);
    return null;
  }
}
