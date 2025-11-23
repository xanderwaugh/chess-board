"use client";

import React, { useState } from "react";
import {
  ArrowLeftRight,
  Download,
  RotateCcw,
  Settings,
  Undo,
  Upload,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import type { UseChessGameReturn } from "~/hooks/use-chess-game";
import type { BoardTheme } from "~/utils/theme-utils";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { downloadPGN } from "~/utils/pgn-utils";

interface ControlsProps {
  game: UseChessGameReturn;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: BoardTheme;
  onThemeChange: (theme: BoardTheme) => void;
  className?: string;
}

const THEMES: BoardTheme[] = ["default", "wood", "marble", "neon"];

/**
 * Game controls component (reset, undo, flip, settings)
 */
const Controls: React.FC<ControlsProps> = ({
  game,
  soundEnabled,
  onToggleSound,
  theme,
  onThemeChange,
  className,
}) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fenInput, setFenInput] = useState("");
  const [pgnInput, setPgnInput] = useState("");

  const handleUndo = () => {
    const success = game.undoMove();
    if (success) {
      toast.success("Move undone");
    } else {
      toast.error("No moves to undo");
    }
  };

  const handleReset = () => {
    game.resetGame();
    toast.success("Game reset");
  };

  const handleFlip = () => {
    game.flipBoard();
  };

  const handleExportPGN = () => {
    const pgn = game.exportPGN();
    downloadPGN(pgn, `chess-game-${Date.now()}.pgn`);
    toast.success("Game exported as PGN");
  };

  const handleImportFEN = () => {
    const success = game.loadFEN(fenInput);
    if (success) {
      toast.success("Position loaded from FEN");
      setImportDialogOpen(false);
      setFenInput("");
    } else {
      toast.error("Invalid FEN string");
    }
  };

  const handleImportPGN = () => {
    const success = game.loadPGN(pgnInput);
    if (success) {
      toast.success("Game loaded from PGN");
      setImportDialogOpen(false);
      setPgnInput("");
    } else {
      toast.error("Invalid PGN string");
    }
  };

  const handleCopyFEN = () => {
    const fen = game.exportFEN();
    navigator.clipboard.writeText(fen);
    toast.success("FEN copied to clipboard");
  };

  const handleCopyPGN = () => {
    const pgn = game.exportPGN();
    navigator.clipboard.writeText(pgn);
    toast.success("PGN copied to clipboard");
  };

  return (
    <motion.div
      className={cn("flex flex-wrap gap-2", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Undo */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleUndo}
        disabled={game.moveHistory.length === 0}
        title="Undo last move"
      >
        <Undo className="h-4 w-4" />
      </Button>

      {/* Reset */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleReset}
        title="Reset game"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>

      {/* Flip board */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleFlip}
        title="Flip board"
      >
        <ArrowLeftRight className="h-4 w-4" />
      </Button>

      {/* Sound toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSound}
        title={soundEnabled ? "Mute sounds" : "Enable sounds"}
      >
        {soundEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeOff className="h-4 w-4" />
        )}
      </Button>

      {/* Import */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" title="Import game">
            <Upload className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Game</DialogTitle>
            <DialogDescription>
              Load a game from FEN or PGN notation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fen-input">FEN String</Label>
              <Textarea
                id="fen-input"
                placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                value={fenInput}
                onChange={(e) => setFenInput(e.target.value)}
                rows={2}
              />
              <Button
                onClick={handleImportFEN}
                disabled={!fenInput}
                className="mt-2"
                size="sm"
              >
                Load FEN
              </Button>
            </div>
            <div>
              <Label htmlFor="pgn-input">PGN String</Label>
              <Textarea
                id="pgn-input"
                placeholder="1. e4 e5 2. Nf3..."
                value={pgnInput}
                onChange={(e) => setPgnInput(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleImportPGN}
                disabled={!pgnInput}
                className="mt-2"
                size="sm"
              >
                Load PGN
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" title="Export game">
            <Download className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Game</DialogTitle>
            <DialogDescription>
              Export current position as FEN or full game as PGN
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Position (FEN)</Label>
              <Textarea value={game.exportFEN()} readOnly rows={2} />
              <Button onClick={handleCopyFEN} className="mt-2" size="sm">
                Copy FEN
              </Button>
            </div>
            <div>
              <Label>Game Notation (PGN)</Label>
              <Textarea value={game.exportPGN()} readOnly rows={6} />
              <div className="mt-2 flex gap-2">
                <Button onClick={handleCopyPGN} size="sm">
                  Copy PGN
                </Button>
                <Button onClick={handleExportPGN} size="sm" variant="outline">
                  Download PGN
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" title="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Customize your chess board</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Board Theme</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {THEMES.map((t) => (
                  <Button
                    key={t}
                    variant={theme === t ? "default" : "outline"}
                    onClick={() => onThemeChange(t)}
                    className="capitalize"
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export { Controls };
