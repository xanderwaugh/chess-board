import { Chess } from "chess.js";

/**
 * PGN (Portable Game Notation) utilities for game import/export
 */

export interface PGNMetadata {
  Event?: string;
  Site?: string;
  Date?: string;
  Round?: string;
  White?: string;
  Black?: string;
  Result?: string;
  WhiteElo?: string;
  BlackElo?: string;
  TimeControl?: string;
  ECO?: string;
  Opening?: string;
  Annotator?: string;
}

export interface ParsedPGN {
  metadata: PGNMetadata;
  moves: string[];
  result: string;
  pgn: string;
}

/**
 * Export game to PGN format
 */
export function exportPGN(
  chess: Chess,
  metadata: Partial<PGNMetadata> = {},
): string {
  const defaultMetadata: PGNMetadata = {
    Event: "Casual Game",
    Site: "Chess Board",
    Date: new Date().toISOString().split("T")[0].replace(/-/g, "."),
    Round: "?",
    White: "Player 1",
    Black: "Player 2",
    Result: getGameResult(chess),
    ...metadata,
  };

  // Build PGN header
  const headers = Object.entries(defaultMetadata)
    .map(([key, value]) => `[${key} "${value}"]`)
    .join("\n");

  // Get move text
  const moveText = chess.pgn({
    maxWidth: 80,
    newline: "\n",
  });

  return `${headers}\n\n${moveText}`;
}

/**
 * Import PGN and load into chess instance
 */
export function importPGN(chess: Chess, pgn: string): boolean {
  try {
    chess.loadPgn(pgn);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse PGN string into metadata and moves
 */
export function parsePGN(pgn: string): ParsedPGN | null {
  try {
    const chess = new Chess();
    chess.loadPgn(pgn);

    const metadata: PGNMetadata = {};
    const headerRegex = /\[(\w+)\s+"([^"]+)"\]/g;
    let match;

    while ((match = headerRegex.exec(pgn)) !== null) {
      metadata[match[1] as keyof PGNMetadata] = match[2];
    }

    const history = chess.history();
    const result = metadata.Result || "*";

    return {
      metadata,
      moves: history,
      result,
      pgn,
    };
  } catch {
    return null;
  }
}

/**
 * Get game result string
 */
export function getGameResult(chess: Chess): string {
  if (chess.isCheckmate()) {
    return chess.turn() === "w" ? "0-1" : "1-0";
  }
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition()) {
    return "1/2-1/2";
  }
  return "*"; // Game in progress
}

/**
 * Format move history as numbered list
 */
export function formatMoveHistory(
  moves: string[],
  startMoveNumber: number = 1,
): string {
  let result = "";
  let moveNumber = startMoveNumber;

  for (let i = 0; i < moves.length; i += 2) {
    result += `${moveNumber}. ${moves[i]}`;
    if (i + 1 < moves.length) {
      result += ` ${moves[i + 1]}`;
    }
    result += "\n";
    moveNumber++;
  }

  return result.trim();
}

/**
 * Export game to PGN with move list
 */
export function exportPGNWithMoves(
  moves: string[],
  metadata: Partial<PGNMetadata> = {},
): string {
  const chess = new Chess();

  // Replay all moves
  for (const move of moves) {
    try {
      chess.move(move);
    } catch {
      // Invalid move, stop here
      break;
    }
  }

  return exportPGN(chess, metadata);
}

/**
 * Validate PGN string
 */
export function isValidPGN(pgn: string): boolean {
  try {
    const chess = new Chess();
    chess.loadPgn(pgn);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract moves from PGN
 */
export function extractMovesFromPGN(pgn: string): string[] {
  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
    return chess.history();
  } catch {
    return [];
  }
}

/**
 * Get current position as PGN comment
 */
export function addPositionComment(
  pgn: string,
  comment: string,
): string | null {
  try {
    const chess = new Chess();
    chess.loadPgn(pgn);

    const history = chess.history({ verbose: true });
    if (history.length === 0) return pgn;

    // Add comment to last move
    const pgnWithComment = pgn.replace(/\*$/, `{${comment}} *`);
    return pgnWithComment;
  } catch {
    return null;
  }
}

/**
 * Download PGN as file
 */
export function downloadPGN(pgn: string, filename: string = "game.pgn"): void {
  const blob = new Blob([pgn], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Create shareable game link with PGN data
 */
export function createShareableLink(pgn: string, baseUrl: string): string {
  const encoded = encodeURIComponent(pgn);
  return `${baseUrl}?pgn=${encoded}`;
}

/**
 * Load PGN from URL parameter
 */
export function loadPGNFromURL(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const pgnParam = params.get("pgn");

  if (!pgnParam) return null;

  try {
    return decodeURIComponent(pgnParam);
  } catch {
    return null;
  }
}
