/**
 * Chess hooks barrel export
 * Use this for clean imports when using the chess board system as a package
 */

export { useChessGame } from "./use-chess-game";
export type {
  Orientation,
  MoveResult,
  HighlightSquares,
  UseChessGameReturn,
} from "./use-chess-game";

export { useSound } from "./use-sound";
export type { ChessSoundType } from "./use-sound";

export { useSocket } from "./use-socket";
export type {
  SocketMessageType,
  SocketMessage,
  MovePayload,
  GameStatePayload,
} from "./use-socket";
