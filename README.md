# ♟️ Modular Chess Board System

A production-ready, fully modular chess board application built with **Next.js 16**, **React 19**, **Framer Motion**, and **chess.js**. Features beautiful animations, multiple themes, timers, and complete PGN/FEN support.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## ✨ Features

### 🎮 Core Gameplay

- ✅ Full chess rules implementation via chess.js
- ✅ Drag-and-drop and click-to-move piece interaction
- ✅ Real-time move validation
- ✅ Legal move highlighting
- ✅ Check and checkmate detection
- ✅ Game state management (stalemate, draw, repetition)

### 🎨 Visual & UX

- ✅ 4 Beautiful board themes (Default, Wood, Marble, Neon)
- ✅ Smooth Framer Motion animations
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Light/dark mode support
- ✅ Coordinate labels
- ✅ Last move highlighting
- ✅ Valid move indicators

### ⏱️ Time Controls

- ✅ Chess clock implementation
- ✅ Configurable time controls
- ✅ Pause/resume functionality
- ✅ Time expiration handling
- ✅ Visual countdown animations

### 💾 Import/Export

- ✅ FEN position loading/saving
- ✅ PGN game import/export
- ✅ Move history tracking
- ✅ Game notation display
- ✅ Download games as .pgn files

### 🔊 Audio & Feedback

- ✅ Move sound effects
- ✅ Capture sounds
- ✅ Game end audio
- ✅ Notification sounds
- ✅ Volume controls

### 🔌 Extensibility

- ✅ Modular component architecture
- ✅ Custom hooks for game logic
- ✅ WebSocket-ready for multiplayer
- ✅ Engine integration support (Stockfish ready)
- ✅ Easy theme customization

## 🚀 Getting Started

### Installation

#### As an npm Package

```bash
# Using pnpm
pnpm add @xanderwaugh/chess-board chess.js motion lucide-react sonner

# Using npm
npm install @xanderwaugh/chess-board chess.js motion lucide-react sonner

# Using yarn
yarn add @xanderwaugh/chess-board chess.js motion lucide-react sonner
```

#### Development Setup (Cloning Repository)

```bash
# Clone the repository
git clone https://github.com/xanderwaugh/chess-board.git
cd chess-board

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the demo application.

### Building the Library

To build the library for npm publishing:

```bash
# Build library (creates dist/ folder)
pnpm build

# Or build Next.js demo app
pnpm build:next
pnpm start
```

## 📁 Project Structure

```
chess-board/
├── src/
│   ├── app/
│   │   ├── chess/
│   │   │   └── page.tsx           # Main chess game page
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── chess/
│   │   │   ├── board.tsx           # Main chess board
│   │   │   ├── square.tsx          # Individual square
│   │   │   ├── piece.tsx           # Chess piece component
│   │   │   ├── controls.tsx        # Game controls
│   │   │   ├── move-history.tsx    # Move list display
│   │   │   ├── timers.tsx          # Chess clock
│   │   │   ├── engine-controls.tsx # Engine integration
│   │   │   └── game-end-modal.tsx  # Game over modal
│   │   └── ui/                     # shadcn/ui components
│   ├── hooks/
│   │   ├── use-chess-game.ts       # Main game logic hook
│   │   ├── use-sound.ts            # Audio playback hook
│   │   └── use-socket.ts           # WebSocket hook
│   ├── utils/
│   │   ├── chess-helpers.ts        # Chess utility functions
│   │   ├── fen-utils.ts            # FEN parsing/generation
│   │   ├── pgn-utils.ts            # PGN import/export
│   │   └── theme-utils.ts          # Board theming
│   └── lib/
│       └── utils.ts                # General utilities
├── public/
│   ├── audio/                      # Sound effects
│   │   ├── move-self.mp3
│   │   ├── capture.mp3
│   │   ├── notify.mp3
│   │   └── game-end.webm
│   └── pieces/                     # SVG piece images
│       ├── king-w.svg
│       ├── queen-w.svg
│       └── ...
└── package.json
```

## 🎯 Usage

### Basic Implementation

```tsx
"use client";

import { Board } from "@/components/chess/board";
import { useChessGame } from "@/hooks/use-chess-game";

export default function MyChessGame() {
  const game = useChessGame({
    onMove: (move) => {
      console.log("Move made:", move.san);
    },
    onGameOver: (result) => {
      console.log("Game over:", result);
    },
  });

  return <Board game={game} theme="wood" size="lg" />;
}
```

### Custom Hook API

The `useChessGame` hook provides comprehensive game state management:

```tsx
const game = useChessGame({
  initialFen?: string,           // Starting position (default: standard)
  orientation?: "white" | "black", // Board orientation
  onMove?: (move: Move) => void,   // Move callback
  onGameOver?: (result: string) => void, // Game end callback
});

// Game state
game.fen                // Current FEN
game.turn               // Current turn ("w" or "b")
game.gameOver           // Is game finished?
game.winner             // Winner or "draw"
game.status             // Human-readable status
game.moveHistory        // Array of SAN moves
game.highlights         // Square highlights

// Actions
game.makeMove(from, to, promotion?)  // Make a move
game.selectSquare(square)            // Select a square
game.undoMove()                      // Undo last move
game.resetGame()                     // Reset to start
game.flipBoard()                     // Flip orientation

// Import/Export
game.loadFEN(fen)       // Load position from FEN
game.loadPGN(pgn)       // Load game from PGN
game.exportPGN(metadata?) // Export as PGN
game.exportFEN()        // Get current FEN
```

## 🎨 Theming

Four built-in themes are available:

```tsx
<Board game={game} theme="default" /> // Modern gray
<Board game={game} theme="wood" />    // Classic wood
<Board game={game} theme="marble" />  // Elegant marble
<Board game={game} theme="neon" />    // Cyberpunk neon
```

### Custom Themes

Extend the theme system in `utils/theme-utils.ts`:

```tsx
export const BOARD_THEMES: Record<BoardTheme, BoardColors> = {
  myTheme: {
    light: "bg-blue-100",
    dark: "bg-blue-800",
    highlight: "bg-yellow-300/50",
    selected: "bg-blue-400/60",
    // ... other colors
  },
};
```

## 🔌 Integration Examples

### With WebSocket (Multiplayer)

```tsx
import { useChessGame } from "@/hooks/use-chess-game";
import { useSocket } from "@/hooks/use-socket";

function MultiplayerChess() {
  const socket = useSocket({
    url: "ws://localhost:8080",
    roomId: "game-123",
    autoConnect: true,
  });

  const game = useChessGame({
    onMove: (move) => {
      socket.send("move", {
        from: move.from,
        to: move.to,
        promotion: move.promotion,
      });
    },
  });

  // Subscribe to opponent moves
  socket.subscribe("move", (payload) => {
    game.makeMove(payload.from, payload.to, payload.promotion);
  });

  return <Board game={game} />;
}
```

### With Stockfish Engine

```tsx
import { EngineControls } from "@/components/chess/engine-controls";

function ChessWithEngine() {
  const game = useChessGame();
  const [engineEnabled, setEngineEnabled] = useState(false);

  const handleEngineMove = async () => {
    // Integrate stockfish.js or stockfish.wasm here
    const bestMove = await getStockfishMove(game.fen, depth);
    game.makeMove(bestMove.from, bestMove.to);
  };

  return (
    <>
      <Board game={game} />
      <EngineControls
        enabled={engineEnabled}
        onToggle={() => setEngineEnabled(!engineEnabled)}
        onRequestMove={handleEngineMove}
      />
    </>
  );
}
```

## 📦 Publishing as npm Package

This project is structured to be publishable as an npm package:

1. Update `package.json`:

```json
{
  "name": "@your-scope/chess-board",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "public"],
  "exports": {
    "./components": "./dist/components/index.js",
    "./hooks": "./dist/hooks/index.js",
    "./utils": "./dist/utils/index.js"
  }
}
```

2. Create barrel exports:

```tsx
// src/index.ts
export * from "./components/chess";
export * from "./hooks";
export * from "./utils";
```

3. Build and publish:

```bash
pnpm build
npm publish
```

## 🎓 Component API Reference

### Board Component

```tsx
interface BoardProps {
  game: UseChessGameReturn; // Game state from useChessGame
  theme?: BoardTheme; // Visual theme
  showCoordinates?: boolean; // Show file/rank labels
  interactive?: boolean; // Enable interaction
  size?: "sm" | "md" | "lg" | "xl"; // Board size
  onMove?: (from, to) => void; // Move callback
}
```

### Controls Component

```tsx
interface ControlsProps {
  game: UseChessGameReturn;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: BoardTheme;
  onThemeChange: (theme: BoardTheme) => void;
}
```

### Timers Component

```tsx
interface TimersProps {
  whiteTime: number; // White time in seconds
  blackTime: number; // Black time in seconds
  currentTurn: "w" | "b";
  running: boolean;
  onTimeUpdate: (color, time) => void;
  onTimeExpired: (color) => void;
  onTogglePause: () => void;
}
```

## 🛠️ Development

### Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier
```

### Code Quality

- ✅ TypeScript for type safety
- ✅ ESLint for code quality
- ✅ Prettier for formatting
- ✅ React Compiler compliant
- ✅ Server Components where applicable

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:

- [ ] Stockfish WASM integration
- [ ] Puzzle mode
- [ ] Analysis board
- [ ] Opening explorer
- [ ] Game database
- [ ] Player profiles
- [ ] Tournament system

## 📄 License

MIT License - feel free to use in your projects!

## 🙏 Acknowledgments

- **chess.js** - Chess logic and validation
- **Framer Motion** - Smooth animations
- **shadcn/ui** - Beautiful UI components
- **Next.js** - React framework
- **Tailwind CSS** - Styling

## 📞 Support

For issues and feature requests, please open an issue on GitHub.

---

**Built with ❤️ using Next.js 16, React 19, and modern web technologies**
