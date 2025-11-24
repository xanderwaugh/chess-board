/**
 * @xander/chess-board
 * A modular, production-ready chess board system for Next.js and React
 */

// Export all components
export * from "./components/chess";

// Export all hooks
export * from "./hooks";

// Export all utilities
export * from "./utils";

// Export types
export type { UseChessGameReturn } from "./hooks/use-chess-game";
export type { BoardTheme, BoardColors } from "./utils/theme-utils";
export type {
  ChessPiece,
  ChessColor,
  BoardPosition,
  MoveHighlight,
} from "./utils/chess-helpers";
export type { PGNMetadata, ParsedPGN } from "./utils/pgn-utils";

// Re-export commonly used utilities
export { cn } from "./lib/utils";
