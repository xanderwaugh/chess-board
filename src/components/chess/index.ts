/**
 * Chess components barrel export
 * Use this for clean imports when using the chess board system as a package
 */

import "~/app/globals.css";
import "~/styles/chess-board.css";

export { Board } from "./board";
export type { BoardProps } from "./board";

export { Square } from "./square";
export { Piece } from "./piece";
export { Controls } from "./controls";
export { MoveHistory } from "./move-history";
export { Timers } from "./timers";
export { EngineControls } from "./engine-controls";
export { GameEndModal } from "./game-end-modal";
