"use client";

import React from "react";
import { motion } from "motion/react";

import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

interface MoveHistoryProps {
  moves: string[];
  currentMoveNumber: number;
  className?: string;
}

/**
 * Move history display component
 */
const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, className }) => {
  const formatMoveHistory = () => {
    const formatted: Array<{
      moveNumber: number;
      white: string;
      black?: string;
    }> = [];

    for (let i = 0; i < moves.length; i += 2) {
      formatted.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: moves[i],
        black: moves[i + 1],
      });
    }

    return formatted;
  };

  const formattedMoves = formatMoveHistory();

  if (moves.length === 0) {
    return (
      <div
        className={cn(
          "border-border bg-muted/20 flex h-64 items-center justify-center rounded-lg border p-4",
          className,
        )}
      >
        <p className="text-muted-foreground text-sm">No moves yet</p>
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "border-border bg-background rounded-lg border p-4",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="mb-3 text-sm font-semibold">Move History</h3>
      <ScrollArea className="h-64">
        <div className="space-y-1">
          {formattedMoves.map((move, index) => (
            <div
              key={index}
              className={cn(
                "grid grid-cols-[auto_1fr_1fr] gap-3 rounded px-2 py-1 text-sm transition-colors",
                index === formattedMoves.length - 1 && "bg-accent font-medium",
              )}
            >
              <span className="text-muted-foreground font-semibold">
                {move.moveNumber}.
              </span>
              <span className="font-mono">{move.white}</span>
              <span className="font-mono">{move.black || ""}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-border text-muted-foreground mt-3 border-t pt-3 text-xs">
        Total moves: {moves.length}
      </div>
    </motion.div>
  );
};

export { MoveHistory };
