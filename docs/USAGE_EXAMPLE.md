# 📘 Usage Examples

Complete examples for using `@xanderwaugh/chess-board` in your projects.

## Installation

```bash
# Using pnpm
pnpm add @xanderwaugh/chess-board chess.js motion lucide-react sonner

# Using npm
npm install @xanderwaugh/chess-board chess.js motion lucide-react sonner

# Using yarn
yarn add @xanderwaugh/chess-board chess.js motion lucide-react sonner
```

## Required Peer Dependencies

The package requires these peer dependencies:

```json
{
  "chess.js": "^1.4.0",
  "lucide-react": ">=0.400.0",
  "motion": ">=12.0.0",
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "sonner": ">=2.0.0"
}
```

For Next.js projects, also install:

```bash
pnpm add next next-themes
```

## Setup in Next.js 15+

### 1. Configure Styles

Add the library source to your root CSS file (e.g., `app/globals.css`):

```css
@source "node_modules/@xanderwaugh/chess-board/dist/*.{js,ts,jsx,tsx}";
```

**Note:** You don't need to configure `tailwind.config.ts` or import styles in your `layout.tsx` file. Just add the `@source` line above to your CSS file.

### 2. Add Theme Provider (Optional)

For dark mode support, wrap your app with `ThemeProvider` in `layout.tsx`:

```tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 3. Add Toaster (Optional)

For notifications in controls, add Sonner's Toaster:

```tsx
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

## Basic Usage Examples

### Minimal Setup

```tsx
"use client";

import { Board, useChessGame } from "@xanderwaugh/chess-board";

export default function ChessPage() {
  const game = useChessGame();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Board game={game} />
    </div>
  );
}
```

### With Controls

```tsx
"use client";

import type { BoardTheme } from "@xanderwaugh/chess-board";
import { useState } from "react";
import {
  Board,
  Controls,
  useChessGame,
  useSound,
} from "@xanderwaugh/chess-board";

export default function ChessPage() {
  const [theme, setTheme] = useState<BoardTheme>("wood");
  const sound = useSound({ enabled: true });

  const game = useChessGame({
    onMove: (move) => {
      sound.play(move.captured ? "capture" : "move");
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

### Full-Featured Game

```tsx
"use client";

import type { BoardTheme } from "@xanderwaugh/chess-board";
import { useState } from "react";
import {
  Board,
  Controls,
  GameEndModal,
  MoveHistory,
  Timers,
  useChessGame,
  useSound,
} from "@xanderwaugh/chess-board";

export default function FullChessGame() {
  const [theme, setTheme] = useState<BoardTheme>("wood");
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes
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

  const handleRematch = () => {
    game.resetGame();
    setShowEndModal(false);
    setWhiteTime(600);
    setBlackTime(600);
    setTimerRunning(false);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[300px_auto_300px]">
          {/* Move History */}
          <MoveHistory
            moves={game.moveHistory}
            currentMoveNumber={game.currentMoveNumber}
          />

          {/* Board & Controls */}
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
              setTimerRunning(false);
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
        whitePlayer="Player 1"
        blackPlayer="Player 2"
        onRematch={handleRematch}
        onClose={() => setShowEndModal(false)}
      />
    </div>
  );
}
```

## Setup in Standard React App (Vite, CRA)

### 1. Install Dependencies

```bash
pnpm add @xanderwaugh/chess-board chess.js motion lucide-react sonner
pnpm add -D tailwindcss postcss autoprefixer
```

### 2. Configure Styles

Add the library source to your root CSS file:

```css
@source "node_modules/@xanderwaugh/chess-board/dist/*.{js,ts,jsx,tsx}";
```

**Note:** You don't need to configure `tailwind.config.js` or import styles in your component files. Just add the `@source` line above to your CSS file.

### 4. Use Components

```tsx
import { Board, useChessGame } from "@xanderwaugh/chess-board";

function App() {
  const game = useChessGame();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Board game={game} />
    </div>
  );
}

export default App;
```

## Advanced Examples

### Custom Move Validation

```tsx
const game = useChessGame({
  onMove: (move) => {
    // Custom validation
    if (move.to === "e4") {
      console.log("Central pawn move!");
    }

    // Track captures
    if (move.captured) {
      console.log(`Captured ${move.captured}`);
    }

    // Play custom sounds
    sound.play(move.flags.includes("c") ? "capture" : "move");
  },
});
```

### Load Position from FEN

```tsx
import { FAMOUS_POSITIONS, useChessGame } from "@xanderwaugh/chess-board";

function PuzzlePage() {
  const game = useChessGame();

  useEffect(() => {
    // Load a famous position
    game.loadFEN(FAMOUS_POSITIONS.sicilian);
  }, []);

  return <Board game={game} />;
}
```

### Import Game from PGN

```tsx
const game = useChessGame();

const handleImport = (pgn: string) => {
  const success = game.loadPGN(pgn);
  if (success) {
    toast.success("Game loaded!");
  } else {
    toast.error("Invalid PGN");
  }
};
```

### Export and Share Game

```tsx
import { downloadPGN } from "@xanderwaugh/chess-board";

const handleExport = () => {
  const pgn = game.exportPGN({
    Event: "Casual Game",
    White: "Player 1",
    Black: "Player 2",
    Date: new Date().toISOString().split("T")[0],
  });

  // Download as file
  downloadPGN(pgn, "my-game.pgn");

  // Or copy to clipboard
  navigator.clipboard.writeText(pgn);
};
```

### Multiplayer with WebSockets

```tsx
import { useChessGame, useSocket } from "@xanderwaugh/chess-board";

function MultiplayerChess() {
  const socket = useSocket({
    url: "wss://your-server.com",
    roomId: "game-123",
    autoConnect: true,
  });

  const game = useChessGame({
    onMove: (move) => {
      // Send move to opponent
      socket.send("move", {
        from: move.from,
        to: move.to,
        promotion: move.promotion,
      });
    },
  });

  // Receive opponent moves
  useEffect(() => {
    const unsubscribe = socket.subscribe("move", (data) => {
      game.makeMove(data.from, data.to, data.promotion);
    });

    return unsubscribe;
  }, [socket, game]);

  return <Board game={game} />;
}
```

### Server Actions Integration (Next.js)

```tsx
"use server";

import { prisma } from "@/lib/db";

export async function saveGame(pgn: string, userId: string) {
  return await prisma.game.create({
    data: { pgn, userId, createdAt: new Date() },
  });
}

// In component
("use client");

const game = useChessGame({
  onGameOver: async () => {
    const pgn = game.exportPGN();
    await saveGame(pgn, user.id);
    toast.success("Game saved!");
  },
});
```

## TypeScript Support

The package is fully typed. Import types as needed:

```tsx
import type {
  BoardTheme,
  ChessColor,
  ChessPiece,
  MoveResult,
  PGNMetadata,
  UseChessGameReturn,
} from "@xanderwaugh/chess-board";

const MyComponent = () => {
  const game: UseChessGameReturn = useChessGame();
  const [theme, setTheme] = useState<BoardTheme>("wood");

  const piece: ChessPiece = {
    type: "p",
    color: "w",
  };

  return <Board game={game} theme={theme} />;
};
```

## Styling & Customization

### Custom Theme Colors

The package uses Tailwind classes. Override in your CSS:

```css
/* Custom board colors */
.chess-board .light-square {
  @apply bg-blue-100;
}

.chess-board .dark-square {
  @apply bg-blue-800;
}
```

### Size Variants

```tsx
<Board game={game} size="sm" />  // 320x320px
<Board game={game} size="md" />  // 480x480px
<Board game={game} size="lg" />  // 640x640px (default)
<Board game={game} size="xl" />  // 800x800px
```

### Custom Piece Images

Replace SVGs in your project:

```
public/
  pieces/
    king-w.svg
    queen-w.svg
    ...
```

## Troubleshooting

### "Module not found" Error

Make sure all peer dependencies are installed:

```bash
pnpm add chess.js motion lucide-react sonner react react-dom
```

### Styles Not Applied

Ensure you added the `@source` line to your CSS file:

```css
@source "node_modules/@xanderwaugh/chess-board/dist/*.{js,ts,jsx,tsx}";
```

You don't need to configure `tailwind.config.js` - the `@source` directive is sufficient.

### TypeScript Errors

Install type definitions:

```bash
pnpm add -D @types/react @types/react-dom @types/chess.js
```

### Audio Not Playing

Copy audio files to your public directory:

```bash
cp -r node_modules/@xanderwaugh/chess-board/dist/audio public/
```

## Support

- **Issues**: [GitHub Issues](https://github.com/xanderwaugh/chess-board/issues)
- **Discussions**: [GitHub Discussions](https://github.com/xanderwaugh/chess-board/discussions)
- **Docs**: [README](https://github.com/xanderwaugh/chess-board#readme)

---

Happy coding! ♟️🎉
