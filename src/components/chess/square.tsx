"use client";

import type { Square as ChessSquare } from "chess.js";
import React from "react";
import { motion } from "motion/react";

import type { ChessPiece } from "~/utils/chess-helpers";
import type { BoardTheme } from "~/utils/theme-utils";
import { cn } from "~/lib/utils";
import { isLightSquare } from "~/utils/chess-helpers";
import { getHighlightClass, getSquareColorClasses } from "~/utils/theme-utils";
import { Piece } from "./piece";

interface SquareProps {
  square: ChessSquare;
  piece: ChessPiece | null;
  theme: BoardTheme;
  selected?: boolean;
  validMove?: boolean;
  lastMove?: boolean;
  check?: boolean;
  showCoordinates?: boolean;
  isFileEdge?: boolean;
  isRankEdge?: boolean;
  orientation?: "white" | "black";
  onClick?: () => void;
  onDragStart?: (square: ChessSquare) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (square: ChessSquare) => void;
}

/**
 * Individual chess board square with piece rendering
 */
const Square: React.FC<SquareProps> = ({
  square,
  piece,
  theme,
  selected = false,
  validMove = false,
  lastMove = false,
  check = false,
  showCoordinates = true,
  isFileEdge = false,
  isRankEdge = false,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const isLight = isLightSquare(square);
  const file = square[0];
  const rank = square[1];

  const baseClasses = getSquareColorClasses(isLight, theme);

  // Determine highlight
  let highlightClass = "";
  if (check) {
    highlightClass = getHighlightClass("check", theme);
  } else if (selected) {
    highlightClass = getHighlightClass("selected", theme);
  } else if (lastMove) {
    highlightClass = getHighlightClass("lastMove", theme);
  } else if (validMove) {
    highlightClass = piece
      ? getHighlightClass("validCapture", theme)
      : getHighlightClass("valid", theme);
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (piece && onDragStart) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", square);
      onDragStart(square);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (onDragOver) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      onDragOver(e);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDrop) {
      onDrop(square);
    }
  };

  const showFileLabel = showCoordinates && isRankEdge;
  const showRankLabel = showCoordinates && isFileEdge;

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center",
        baseClasses,
        highlightClass,
        "transition-colors duration-150",
        onClick && "cursor-pointer hover:brightness-110",
      )}
      onClick={onClick}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      draggable={!!piece}
    >
      {/* File label (bottom) */}
      {showFileLabel && (
        <span className="absolute right-0.5 bottom-0.5 text-xs font-semibold opacity-70">
          {file}
        </span>
      )}

      {/* Rank label (left) */}
      {showRankLabel && (
        <span className="absolute top-0.5 left-0.5 text-xs font-semibold opacity-70">
          {rank}
        </span>
      )}

      {/* Valid move indicator */}
      {validMove && !piece && (
        <motion.div
          className="absolute h-3 w-3 rounded-full bg-current opacity-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        />
      )}

      {/* Valid capture indicator */}
      {validMove && piece && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-current opacity-40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        />
      )}

      {/* Piece */}
      {piece && (
        <div className="absolute inset-0 flex items-center justify-center p-1">
          <Piece piece={piece} animate={true} />
        </div>
      )}
    </div>
  );
};

export { Square };
