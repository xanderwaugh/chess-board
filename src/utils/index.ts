/**
 * Chess utilities barrel export
 * Use this for clean imports when using the chess board system as a package
 */

// Chess helpers
export {
  getBoardPositions,
  getValidMoves,
  isLightSquare,
  getSquareFromCoords,
  getCoordsFromSquare,
  getPieceImagePath,
  isCapture,
  isCastling,
  isEnPassant,
  isPromotion,
  getGameStatus,
  formatMoveNotation,
  getOppositeColor,
  tryMakeMove,
} from "./chess-helpers";
export type {
  ChessColor,
  ChessPiece,
  BoardPosition,
  MoveHighlight,
} from "./chess-helpers";

// FEN utilities
export {
  STARTING_FEN,
  EMPTY_BOARD_FEN,
  FAMOUS_POSITIONS,
  isValidFEN,
  parseFEN,
  getFENPiecePlacement,
  createFEN,
  loadFEN,
  getFEN,
  compareFENPositions,
  getPositionKey,
  resetToStartingPosition,
  clearBoard,
} from "./fen-utils";

// PGN utilities
export {
  exportPGN,
  importPGN,
  parsePGN,
  getGameResult,
  formatMoveHistory,
  exportPGNWithMoves,
  isValidPGN,
  extractMovesFromPGN,
  addPositionComment,
  downloadPGN,
  createShareableLink,
  loadPGNFromURL,
} from "./pgn-utils";
export type { PGNMetadata, ParsedPGN } from "./pgn-utils";

// Theme utilities
export {
  BOARD_THEMES,
  getThemeColors,
  getSquareColorClasses,
  getHighlightClass,
  getAllThemes,
  getThemeDisplayName,
  getCoordinateLabelClasses,
  getBoardBorderClasses,
} from "./theme-utils";
export type { BoardTheme, BoardColors } from "./theme-utils";
