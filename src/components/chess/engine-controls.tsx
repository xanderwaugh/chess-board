"use client";

import React, { useState } from "react";
import { Bot, Play, X } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { cn } from "~/lib/utils";

interface EngineControlsProps {
  enabled: boolean;
  thinking: boolean;
  evaluation?: number;
  depth?: number;
  bestMove?: string;
  onToggle: () => void;
  onRequestMove: () => void;
  onDepthChange?: (depth: number) => void;
  className?: string;
}

/**
 * Stockfish engine controls (placeholder for future integration)
 */
const EngineControls: React.FC<EngineControlsProps> = ({
  enabled,
  thinking,
  evaluation = 0,
  depth = 15,
  bestMove,
  onToggle,
  onRequestMove,
  onDepthChange,
  className,
}) => {
  const [localDepth, setLocalDepth] = useState(depth);

  const formatEvaluation = (evaluation: number): string => {
    if (Math.abs(evaluation) > 100) {
      return evaluation > 0 ? "M+" : "M-";
    }
    return (evaluation / 100).toFixed(2);
  };

  const getEvaluationColor = (evaluation: number): string => {
    if (evaluation > 2) return "text-green-600 dark:text-green-400";
    if (evaluation > 0.5) return "text-green-500 dark:text-green-500";
    if (evaluation < -2) return "text-red-600 dark:text-red-400";
    if (evaluation < -0.5) return "text-red-500 dark:text-red-500";
    return "text-muted-foreground";
  };

  const handleDepthChange = (value: number[]) => {
    setLocalDepth(value[0]);
    if (onDepthChange) {
      onDepthChange(value[0]);
    }
  };

  return (
    <motion.div
      className={cn(
        "border-border bg-background rounded-lg border p-4",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h3 className="text-sm font-semibold">Engine Analysis</h3>
        </div>
        <Button
          variant={enabled ? "default" : "outline"}
          size="sm"
          onClick={onToggle}
        >
          {enabled ? (
            <>
              <X className="mr-1 h-3 w-3" />
              Disable
            </>
          ) : (
            "Enable"
          )}
        </Button>
      </div>

      {enabled && (
        <div className="space-y-4">
          {/* Evaluation */}
          <div>
            <Label className="text-xs">Position Evaluation</Label>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Black</span>
              <motion.span
                className={cn(
                  "font-mono text-xl font-bold",
                  getEvaluationColor(evaluation),
                )}
                key={evaluation}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {formatEvaluation(evaluation)}
              </motion.span>
              <span className="text-muted-foreground text-xs">White</span>
            </div>
          </div>

          {/* Depth control */}
          <div>
            <Label className="text-xs">Search Depth: {localDepth}</Label>
            <Slider
              value={[localDepth]}
              onValueChange={handleDepthChange}
              min={5}
              max={25}
              step={1}
              className="mt-2"
            />
          </div>

          {/* Best move */}
          {bestMove && (
            <div>
              <Label className="text-xs">Best Move</Label>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="secondary" className="font-mono">
                  {bestMove}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRequestMove}
                  disabled={thinking}
                >
                  {thinking ? (
                    <>
                      <motion.div
                        className="mr-2 h-3 w-3 rounded-full border-2 border-current border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                      />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Play className="mr-1 h-3 w-3" />
                      Play Move
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Note */}
          <p className="text-muted-foreground text-xs">
            Note: Stockfish integration is a placeholder. Implement using
            stockfish.js or WASM.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export { EngineControls };
