"use client";

import type { Square as ChessSquare } from "chess.js";
import React, { useCallback, useState } from "react";
import { motion } from "motion/react";

import type { UseChessGameReturn } from "~/hooks/use-chess-game";
import type { BoardTheme } from "~/utils/theme-utils";
import { cn } from "~/lib/utils";
import { getBoardPositions, getSquareFromCoords } from "~/utils/chess-helpers";
import { getBoardBorderClasses } from "~/utils/theme-utils";
import { Square } from "./square";

interface BoardProps {
  game: UseChessGameReturn;
  theme?: BoardTheme;
  showCoordinates?: boolean;
  interactive?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  onMove?: (from: ChessSquare, to: ChessSquare) => void;
}

const BOARD_SIZES = {
  sm: "w-[320px] h-[320px]",
  md: "w-[480px] h-[480px]",
  lg: "w-[640px] h-[640px]",
  xl: "w-[800px] h-[800px]",
};

/**
 * Main chess board component
 */
const Board: React.FC<BoardProps> = ({
  game,
  theme = "default",
  showCoordinates = true,
  interactive = true,
  size = "lg",
  onMove,
}) => {
  const [draggedSquare, setDraggedSquare] = useState<ChessSquare | null>(null);
  const positions = getBoardPositions(game.chess);
  const { orientation, highlights } = game;

  const handleSquareClick = useCallback(
    (square: ChessSquare) => {
      if (!interactive) return;
      game.selectSquare(square);
    },
    [interactive, game],
  );

  const handleDragStart = useCallback((square: ChessSquare) => {
    setDraggedSquare(square);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (targetSquare: ChessSquare) => {
      if (!draggedSquare || !interactive) return;

      const result = game.makeMove(draggedSquare, targetSquare);

      if (result.success && onMove) {
        onMove(draggedSquare, targetSquare);
      }

      setDraggedSquare(null);
    },
    [draggedSquare, interactive, game, onMove],
  );

  const renderBoard = () => {
    const squares = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = getSquareFromCoords(row, col, orientation);
        const position = positions.find((p) => p.square === square);

        const isRankEdge = orientation === "white" ? row === 7 : row === 0;
        const isFileEdge = orientation === "white" ? col === 0 : col === 7;

        const isSelected = highlights.selected === square;
        const isValidMove = highlights.validMoves.includes(square);
        const isLastMove = highlights.lastMove.includes(square);
        const isCheck = highlights.check === square;

        squares.push(
          <Square
            key={square}
            square={square}
            piece={position?.piece || null}
            theme={theme}
            selected={isSelected}
            validMove={isValidMove}
            lastMove={isLastMove}
            check={isCheck}
            showCoordinates={showCoordinates}
            isFileEdge={isFileEdge}
            isRankEdge={isRankEdge}
            orientation={orientation}
            onClick={() => handleSquareClick(square)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />,
        );
      }
    }

    return squares;
  };

  return (
    <motion.div
      className={cn(
        "grid grid-cols-8 grid-rows-8 rounded-lg shadow-2xl",
        BOARD_SIZES[size],
        getBoardBorderClasses(theme),
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {renderBoard()}
    </motion.div>
  );
};

export { Board };
export type { BoardProps };
