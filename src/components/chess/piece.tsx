"use client";

import Image from "next/image";
import { motion } from "motion/react";

import type { ChessPiece } from "~/utils/chess-helpers";
import { cn } from "~/lib/utils";
import { getPieceImagePath } from "~/utils/chess-helpers";

interface PieceProps {
  piece: ChessPiece;
  dragging?: boolean;
  animate?: boolean;
}

/**
 * Chess piece component with animation support
 */
const Piece: React.FC<PieceProps> = ({
  piece,
  dragging = false,
  animate = true,
}) => {
  const imagePath = getPieceImagePath(piece);

  if (!animate) {
    return (
      <Image
        src={imagePath}
        alt={`${piece.color === "w" ? "White" : "Black"} ${piece.type}`}
        width={60}
        height={60}
        className={cn(
          "pointer-events-none object-contain select-none",
          dragging && "opacity-50",
        )}
        draggable={false}
        priority={true}
      />
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: dragging ? 1.2 : 1,
        opacity: dragging ? 0.8 : 1,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className="relative size-full"
    >
      <Image
        src={imagePath}
        alt={`${piece.color === "w" ? "White" : "Black"} ${piece.type}`}
        fill={true}
        // width={64}
        // height={64}
        className="pointer-events-none size-full object-contain select-none"
        draggable={false}
        priority={true}
      />
    </motion.div>
  );
};

export { Piece };
