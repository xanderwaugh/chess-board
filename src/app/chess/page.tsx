"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

import type { BoardTheme } from "~/utils/theme-utils";
import { Board } from "~/components/chess/board";
import { Controls } from "~/components/chess/controls";
import { EngineControls } from "~/components/chess/engine-controls";
import { GameEndModal } from "~/components/chess/game-end-modal";
import { MoveHistory } from "~/components/chess/move-history";
import { Timers } from "~/components/chess/timers";
import { Button } from "~/components/ui/button";
import { useChessGame } from "~/hooks/use-chess-game";
import { useSound } from "~/hooks/use-sound";

/**
 * Main chess game page - demonstrates full integration
 */
const ChessPage: React.FC = () => {
  const [theme, setTheme] = useState<BoardTheme>("wood");
  const [engineEnabled, setEngineEnabled] = useState(false);
  const [engineThinking, setEngineThinking] = useState(false);
  const [showGameEndModal, setShowGameEndModal] = useState(false);

  // Timer state
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes
  const [blackTime, setBlackTime] = useState(600);
  const [timerRunning, setTimerRunning] = useState(false);

  // Initialize sound
  const sound = useSound({ enabled: true, volume: 0.5 });

  // Initialize chess game
  const game = useChessGame({
    onMove: (move) => {
      // Play sound based on move type
      if (move.captured) {
        sound.play("capture");
      } else {
        sound.play("move");
      }

      // Start timer if not running
      if (!timerRunning) {
        setTimerRunning(true);
      }
    },
    onGameOver: () => {
      sound.play("gameEnd");
      setShowGameEndModal(true);
      setTimerRunning(false);
    },
  });

  const handleRematch = () => {
    game.resetGame();
    setShowGameEndModal(false);
    setWhiteTime(600);
    setBlackTime(600);
    setTimerRunning(false);
  };

  const handleTimeUpdate = (color: "w" | "b", time: number) => {
    if (color === "w") {
      setWhiteTime(time);
    } else {
      setBlackTime(time);
    }
  };

  const handleTimeExpired = () => {
    sound.play("gameEnd");
    setTimerRunning(false);
    setShowGameEndModal(true);
  };

  const handleEngineMove = () => {
    setEngineThinking(true);
    // Simulate engine thinking
    setTimeout(() => {
      setEngineThinking(false);
      sound.play("notify");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 p-4 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="mb-6 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Chess Board</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </motion.div>

        {/* Game status */}
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-muted-foreground text-lg font-medium">
            {game.status}
          </p>
        </motion.div>

        {/* Main game layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_auto_300px]">
          {/* Left column - Move history and engine */}
          <div className="space-y-6">
            <MoveHistory
              moves={game.moveHistory}
              currentMoveNumber={game.currentMoveNumber}
            />
            <EngineControls
              enabled={engineEnabled}
              thinking={engineThinking}
              evaluation={0.5}
              depth={15}
              bestMove="e2e4"
              onToggle={() => setEngineEnabled(!engineEnabled)}
              onRequestMove={handleEngineMove}
            />
          </div>

          {/* Center - Chess board */}
          <div className="flex flex-col items-center gap-4">
            <Board
              game={game}
              theme={theme}
              showCoordinates={true}
              interactive={true}
              size="lg"
            />
            <Controls
              game={game}
              soundEnabled={sound.enabled}
              onToggleSound={() => sound.setEnabled(!sound.enabled)}
              theme={theme}
              onThemeChange={setTheme}
            />
          </div>

          {/* Right column - Timers */}
          <div className="flex items-start justify-center lg:justify-start">
            <Timers
              whiteTime={whiteTime}
              blackTime={blackTime}
              currentTurn={game.turn}
              running={timerRunning}
              onTimeUpdate={handleTimeUpdate}
              onTimeExpired={handleTimeExpired}
              onTogglePause={() => setTimerRunning(!timerRunning)}
            />
          </div>
        </div>

        {/* Info section */}
        <motion.div
          className="border-border bg-background/50 mt-8 rounded-lg border p-6 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-4 text-xl font-semibold">Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="mb-1 font-medium">🎮 Interactive Board</h3>
              <p className="text-muted-foreground text-sm">
                Drag & drop or click to move pieces
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium">🎨 Multiple Themes</h3>
              <p className="text-muted-foreground text-sm">
                Choose from 4 beautiful board themes
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium">⏱️ Chess Clocks</h3>
              <p className="text-muted-foreground text-sm">
                Time controls with pause/resume
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium">📝 Move History</h3>
              <p className="text-muted-foreground text-sm">
                Full game notation tracking
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium">💾 Import/Export</h3>
              <p className="text-muted-foreground text-sm">
                Load and save games as FEN/PGN
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium">🔊 Sound Effects</h3>
              <p className="text-muted-foreground text-sm">
                Audio feedback for all moves
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Game end modal */}
      <GameEndModal
        open={showGameEndModal}
        winner={game.winner}
        reason={game.status}
        whitePlayer="White"
        blackPlayer="Black"
        onRematch={handleRematch}
        onClose={() => setShowGameEndModal(false)}
      />
    </div>
  );
};

export default ChessPage;
