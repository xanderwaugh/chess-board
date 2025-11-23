# ⚡ Quick Start Guide

Get up and running with the chess board in 5 minutes!

## Installation

If using as a standalone project:

```bash
git clone <repo-url>
cd chess-board
pnpm install
pnpm dev
```

If using as a package (after publishing):

```bash
pnpm add @your-scope/chess-board chess.js motion
```

## Basic Usage

### Minimal Setup

```tsx
"use client";

import { Board } from "@/components/chess/board";
import { useChessGame } from "@/hooks/use-chess-game";

export default function ChessPage() {
  const game = useChessGame();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Board game={game} theme="wood" size="lg" />
    </div>
  );
}
```

### With Controls

```tsx
"use client";

import { useState } from "react";
import { Board } from "@/components/chess/board";
import { Controls } from "@/components/chess/controls";
import { useChessGame } from "@/hooks/use-chess-game";
import { useSound } from "@/hooks/use-sound";

export default function ChessPage() {
  const [theme, setTheme] = useState("wood");
  const sound = useSound({ enabled: true });

  const game = useChessGame({
    onMove: (move) => {
      if (move.captured) {
        sound.play("capture");
      } else {
        sound.play("move");
      }
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <Board game={game} theme={theme} size="lg" />
      <Controls
        game={game}
        soundEnabled={sound.enabled}
        onToggleSound={() => sound.setEnabled(!sound.enabled)}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}
```

### Full Featured

```tsx
"use client";

import { useState } from "react";
import { Board } from "@/components/chess/board";
import { Controls } from "@/components/chess/controls";
import { GameEndModal } from "@/components/chess/game-end-modal";
import { MoveHistory } from "@/components/chess/move-history";
import { Timers } from "@/components/chess/timers";
import { useChessGame } from "@/hooks/use-chess-game";
import { useSound } from "@/hooks/use-sound";

export default function FullChessPage() {
  const [theme, setTheme] = useState("wood");
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  const sound = useSound({ enabled: true });

  const game = useChessGame({
    onMove: (move) => {
      sound.play(move.captured ? "capture" : "move");
      if (!timerRunning) setTimerRunning(true);
    },
    onGameOver: () => {
      sound.play("gameEnd");
      setShowEndModal(true);
      setTimerRunning(false);
    },
  });

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[300px_auto_300px]">
          {/* Move History */}
          <MoveHistory
            moves={game.moveHistory}
            currentMoveNumber={game.currentMoveNumber}
          />

          {/* Board */}
          <div className="flex flex-col items-center gap-4">
            <Board game={game} theme={theme} size="lg" />
            <Controls
              game={game}
              soundEnabled={sound.enabled}
              onToggleSound={() => sound.setEnabled(!sound.enabled)}
              theme={theme}
              onThemeChange={setTheme}
            />
          </div>

          {/* Timers */}
          <Timers
            whiteTime={whiteTime}
            blackTime={blackTime}
            currentTurn={game.turn}
            running={timerRunning}
            onTimeUpdate={(color, time) => {
              color === "w" ? setWhiteTime(time) : setBlackTime(time);
            }}
            onTimeExpired={() => {
              sound.play("gameEnd");
              setShowEndModal(true);
            }}
            onTogglePause={() => setTimerRunning(!timerRunning)}
          />
        </div>
      </div>

      {/* Game End Modal */}
      <GameEndModal
        open={showEndModal}
        winner={game.winner}
        reason={game.status}
        onRematch={() => {
          game.resetGame();
          setShowEndModal(false);
          setWhiteTime(600);
          setBlackTime(600);
        }}
        onClose={() => setShowEndModal(false)}
      />
    </div>
  );
}
```

## Common Patterns

### Load Position from FEN

```tsx
const game = useChessGame();

// Load a specific position
game.loadFEN(
  "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
);
```

### Export Game as PGN

```tsx
const game = useChessGame();

// Export with metadata
const pgn = game.exportPGN({
  Event: "Casual Game",
  White: "Player 1",
  Black: "Player 2",
  Date: "2025.11.23",
});

console.log(pgn);
// Download
downloadPGN(pgn, "my-game.pgn");
```

### Custom Move Handling

```tsx
const game = useChessGame({
  onMove: (move) => {
    console.log(`Move: ${move.san}`);
    console.log(`From: ${move.from}, To: ${move.to}`);

    if (move.captured) {
      console.log(`Captured: ${move.captured}`);
    }

    if (move.promotion) {
      console.log(`Promoted to: ${move.promotion}`);
    }
  },
});
```

### Programmatic Moves

```tsx
const game = useChessGame();

// Make a move
const result = game.makeMove("e2", "e4");

if (result.success) {
  console.log("Move successful!");
  console.log("Is check?", result.isCheck);
  console.log("Is checkmate?", result.isCheckmate);
} else {
  console.log("Invalid move");
}
```

### Board Themes

```tsx
// Available themes
const themes = ["default", "wood", "marble", "neon"];

const [theme, setTheme] = useState<BoardTheme>("wood");

<Board game={game} theme={theme} />;
```

### Sound Control

```tsx
const sound = useSound({
  enabled: true,
  volume: 0.7,
});

// Play specific sounds
sound.play("move");
sound.play("capture");
sound.play("notify");
sound.play("gameEnd");

// Toggle sound
sound.setEnabled(!sound.enabled);

// Adjust volume
sound.setVolume(0.5);
```

## API Quick Reference

### useChessGame Hook

```tsx
const {
  // State
  fen, // Current FEN string
  turn, // "w" or "b"
  gameOver, // boolean
  winner, // "white" | "black" | "draw" | null
  status, // Human-readable status
  moveHistory, // string[] of SAN moves
  highlights, // Current square highlights
  inCheck, // boolean

  // Actions
  makeMove, // (from, to, promotion?) => MoveResult
  selectSquare, // (square) => void
  undoMove, // () => boolean
  resetGame, // () => void
  flipBoard, // () => void

  // Import/Export
  loadFEN, // (fen) => boolean
  loadPGN, // (pgn) => boolean
  exportPGN, // (metadata?) => string
  exportFEN, // () => string

  // Utilities
  isValidMove, // (from, to) => boolean
  getPieceAt, // (square) => Piece | null
} = useChessGame(options);
```

### Board Component Props

```tsx
interface BoardProps {
  game: UseChessGameReturn; // Required
  theme?: BoardTheme; // "default" | "wood" | "marble" | "neon"
  showCoordinates?: boolean; // Default: true
  interactive?: boolean; // Default: true
  size?: "sm" | "md" | "lg" | "xl"; // Default: "lg"
  onMove?: (from, to) => void; // Optional callback
}
```

## Tips

### Performance

- The board re-renders efficiently - only changed squares update
- Audio files are preloaded for instant playback
- Animations are GPU-accelerated

### Customization

- All components accept `className` prop for custom styling
- Theme colors defined in `utils/theme-utils.ts`
- Sound files in `public/audio/`
- Piece SVGs in `public/pieces/`

### Integration

- Works great with tRPC for multiplayer
- WebSocket support via `useSocket` hook
- Ready for Stockfish integration
- Compatible with server actions

## Troubleshooting

### Audio Not Playing

Make sure audio files exist in `public/audio/`:

- `move-self.mp3`
- `capture.mp3`
- `notify.mp3`
- `game-end.webm`

### Pieces Not Showing

Verify SVG files in `public/pieces/`:

- `king-w.svg`, `king-b.svg`
- `queen-w.svg`, `queen-b.svg`
- etc.

### TypeScript Errors

Make sure you have the types installed:

```bash
pnpm add -D @types/chess.js
```

## Next Steps

- Read the [full documentation](./README.md)
- Check out [architecture details](./ARCHITECTURE.md)
- See [contributing guidelines](./CONTRIBUTING.md)
- View the [live demo](http://localhost:3000/chess)

## Example Integrations

### With Next.js Server Actions

```tsx
"use server";

import { prisma } from "@/lib/db";

export async function saveGame(pgn: string, userId: string) {
  return await prisma.game.create({
    data: { pgn, userId },
  });
}

// In component
const game = useChessGame({
  onGameOver: async () => {
    const pgn = game.exportPGN();
    await saveGame(pgn, user.id);
  },
});
```

### With TanStack Query

```tsx
import { useMutation, useQuery } from "@tanstack/react-query";

function ChessWithQuery() {
  const game = useChessGame();

  const { data: savedGames } = useQuery({
    queryKey: ["games"],
    queryFn: fetchUserGames,
  });

  const saveMutation = useMutation({
    mutationFn: (pgn: string) => saveGame(pgn),
  });

  const handleGameEnd = () => {
    saveMutation.mutate(game.exportPGN());
  };

  return <Board game={game} />;
}
```

---

**Ready to build amazing chess experiences! 🎉**
