"use client";

import { useEffect } from "react";
import { Pause, Play } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface TimersProps {
  whiteTime: number; // in seconds
  blackTime: number; // in seconds
  currentTurn: "w" | "b";
  running: boolean;
  onTimeUpdate: (color: "w" | "b", time: number) => void;
  onTimeExpired: (color: "w" | "b") => void;
  onTogglePause: () => void;
  className?: string;
}

/**
 * Chess clock component with countdown timers
 */
const Timers: React.FC<TimersProps> = ({
  whiteTime,
  blackTime,
  currentTurn,
  running,
  onTimeUpdate,
  onTimeExpired,
  onTogglePause,
  className,
}) => {
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      if (currentTurn === "w") {
        onTimeUpdate("w", Math.max(0, whiteTime - 1));
        if (whiteTime <= 1) {
          onTimeExpired("w");
        }
      } else {
        onTimeUpdate("b", Math.max(0, blackTime - 1));
        if (blackTime <= 1) {
          onTimeExpired("b");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [running, currentTurn, onTimeUpdate, onTimeExpired, whiteTime, blackTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = (time: number, isActive: boolean): string => {
    if (!isActive) return "text-muted-foreground";
    if (time <= 10) return "text-red-500";
    if (time <= 30) return "text-orange-500";
    return "text-foreground";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Black timer */}
      <motion.div
        className={cn(
          "flex items-center justify-between rounded-lg border-2 p-4 transition-all",
          currentTurn === "b" && running
            ? "border-primary bg-accent"
            : "border-border bg-muted/20",
        )}
        animate={{
          scale: currentTurn === "b" && running ? 1.02 : 1,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-zinc-900" />
          <span className="font-semibold">Black</span>
        </div>
        <motion.span
          className={cn(
            "font-mono text-2xl font-bold tabular-nums",
            getTimeColor(blackTime, currentTurn === "b" && running),
          )}
          animate={{
            scale:
              currentTurn === "b" && running && blackTime <= 10
                ? [1, 1.1, 1]
                : 1,
          }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          {formatTime(blackTime)}
        </motion.span>
      </motion.div>

      {/* Pause/Play button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={onTogglePause}
          className="h-8 w-8"
        >
          {running ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* White timer */}
      <motion.div
        className={cn(
          "flex items-center justify-between rounded-lg border-2 p-4 transition-all",
          currentTurn === "w" && running
            ? "border-primary bg-accent"
            : "border-border bg-muted/20",
        )}
        animate={{
          scale: currentTurn === "w" && running ? 1.02 : 1,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-zinc-100 ring-1 ring-zinc-400" />
          <span className="font-semibold">White</span>
        </div>
        <motion.span
          className={cn(
            "font-mono text-2xl font-bold tabular-nums",
            getTimeColor(whiteTime, currentTurn === "w" && running),
          )}
          animate={{
            scale:
              currentTurn === "w" && running && whiteTime <= 10
                ? [1, 1.1, 1]
                : 1,
          }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          {formatTime(whiteTime)}
        </motion.span>
      </motion.div>
    </div>
  );
};

export { Timers };
