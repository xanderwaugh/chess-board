"use client";

import React from "react";
import { Minus, RotateCcw, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

interface GameEndModalProps {
  open: boolean;
  winner: "white" | "black" | "draw" | null;
  reason?: string;
  whitePlayer?: string;
  blackPlayer?: string;
  onRematch: () => void;
  onClose: () => void;
}

/**
 * Game end modal with animations
 */
const GameEndModal: React.FC<GameEndModalProps> = ({
  open,
  winner,
  reason = "Checkmate",
  whitePlayer = "White",
  blackPlayer = "Black",
  onRematch,
  onClose,
}) => {
  const getTitle = () => {
    if (winner === "draw") return "Game Draw";
    if (winner === "white") return `${whitePlayer} Wins!`;
    if (winner === "black") return `${blackPlayer} Wins!`;
    return "Game Over";
  };

  const getIcon = () => {
    if (winner === "draw") {
      return (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Minus className="text-muted-foreground h-16 w-16" />
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Trophy
          className={cn(
            "h-16 w-16",
            winner === "white"
              ? "text-yellow-500"
              : winner === "black"
                ? "text-yellow-600"
                : "text-muted-foreground",
          )}
        />
      </motion.div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center py-4">{getIcon()}</div>
          <DialogTitle className="text-center text-2xl">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-center">
            {reason}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-border bg-muted/50 space-y-2 rounded-lg border p-4"
            >
              <div className="flex justify-between text-sm">
                <span className="font-medium">Winner:</span>
                <span className="capitalize">
                  {winner === "draw" ? "Draw" : winner}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Result:</span>
                <span className="font-mono">
                  {winner === "white"
                    ? "1-0"
                    : winner === "black"
                      ? "0-1"
                      : "½-½"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
          <Button onClick={onRematch} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Rematch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { GameEndModal };
