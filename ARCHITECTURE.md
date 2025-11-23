# 🏗️ Architecture Documentation

## Overview

This chess board system is designed with modularity, reusability, and extensibility as core principles. The architecture follows modern React patterns with a clear separation of concerns.

## Core Principles

### 1. **Modular Component Design**

- Each component is self-contained and reusable
- Clear props interfaces with TypeScript
- Components can be used independently or composed together

### 2. **Custom Hooks for Logic**

- Business logic is extracted into custom hooks
- Hooks are composable and testable
- No component-level game logic

### 3. **Server/Client Boundaries**

- Server Components for static content
- Client Components marked with "use client"
- Optimal data fetching patterns

### 4. **Type Safety**

- Full TypeScript coverage
- Exported types for consumers
- Strict type checking enabled

## Layer Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│   (Components: Board, Square, etc)  │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Logic Layer                 │
│   (Hooks: useChessGame, useSound)   │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Utility Layer               │
│  (chess-helpers, pgn-utils, etc)    │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         External Libraries          │
│      (chess.js, framer-motion)      │
└─────────────────────────────────────┘
```

## Component Hierarchy

```
Page (chess/page.tsx)
├── Board
│   └── Square (× 64)
│       └── Piece (optional)
├── Controls
│   ├── Undo Button
│   ├── Reset Button
│   ├── Flip Board Button
│   ├── Import Dialog
│   └── Export Dialog
├── MoveHistory
│   └── ScrollArea
│       └── Move List
├── Timers
│   ├── Black Timer
│   ├── Pause/Play
│   └── White Timer
├── EngineControls
│   ├── Enable/Disable
│   ├── Depth Slider
│   └── Best Move Display
└── GameEndModal
    ├── Winner Display
    └── Rematch Button
```

## State Management

### Game State (useChessGame)

- **Central source of truth** for the game
- Manages Chess.js instance
- Provides actions and derived state
- No props drilling

```tsx
const game = useChessGame({
  initialFen: "...",
  onMove: (move) => {},
  onGameOver: (result) => {},
});
```

**State Exposed:**

- `fen` - Current position
- `turn` - Current player
- `gameOver` - Game finished?
- `winner` - Game result
- `moveHistory` - List of moves
- `highlights` - Visual highlights

**Actions Exposed:**

- `makeMove()` - Execute move
- `undoMove()` - Take back
- `resetGame()` - New game
- `loadFEN()` - Import position
- `exportPGN()` - Export game

### UI State (Local Component State)

- Theme selection
- Sound settings
- Timer state
- Modal visibility
- Engine settings

### Sound State (useSound)

- Audio instance management
- Volume control
- Play/pause logic

### WebSocket State (useSocket)

- Connection status
- Message subscription
- Send/receive handlers

## Data Flow

### Move Execution Flow

```
User Action (Drag/Click)
    ↓
Square.onClick/onDrop
    ↓
Board.handleSquareClick/handleDrop
    ↓
game.makeMove(from, to)
    ↓
chess.js validation
    ↓
State Update (fen, history, etc)
    ↓
onMove callback
    ↓
Sound Effect + Timer Logic
    ↓
Re-render Components
```

### Import/Export Flow

```
Import FEN/PGN
    ↓
game.loadFEN() / game.loadPGN()
    ↓
chess.js parsing
    ↓
State reset + new position
    ↓
Re-render board

Export PGN
    ↓
game.exportPGN(metadata)
    ↓
pgn-utils formatting
    ↓
Download or copy
```

## Utility Functions

### chess-helpers.ts

Core chess operations and transformations:

- Board position parsing
- Move validation helpers
- Square/coordinate conversion
- Piece image path resolution
- Game status messages

### fen-utils.ts

FEN string operations:

- Validation
- Parsing position components
- Famous positions library
- Position comparison
- Board reset/clear

### pgn-utils.ts

PGN game notation:

- Export with metadata
- Import and parse
- Move history formatting
- Download functionality
- URL sharing

### theme-utils.ts

Visual theming system:

- Theme color definitions
- Square color calculation
- Highlight color mapping
- Board border styles

## Animation Strategy

### Framer Motion Usage

**Component Mount/Unmount:**

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
/>
```

**Piece Movement:**

- Layout animations for smooth position changes
- Spring physics for natural feel
- Drag gestures for interaction

**Highlights:**

- Scale animations for valid moves
- Fade in/out for selection
- Pulse for time pressure

**Game End:**

- Modal entrance with spring
- Trophy icon animation
- Backdrop blur transition

## Performance Considerations

### Optimization Techniques

1. **Memoization**
   - Callbacks wrapped in `useCallback`
   - Derived state computed once per render
   - Square components are lightweight

2. **Render Optimization**
   - Only changed squares re-render
   - Move validation cached by chess.js
   - Audio pre-loaded in memory

3. **Code Splitting**
   - Lazy load heavy components if needed
   - Dynamic imports for modals
   - Tree-shaking friendly exports

4. **Image Optimization**
   - SVG pieces for scalability
   - Next.js Image component where applicable
   - Preload critical assets

## Extensibility Points

### Adding New Features

**New Board Theme:**

```tsx
// theme-utils.ts
export const BOARD_THEMES = {
  myTheme: {
    light: "...",
    dark: "...",
    // ... other colors
  },
};
```

**Custom Sound:**

```tsx
// use-sound.ts
const SOUND_PATHS = {
  mySound: "/audio/my-sound.mp3",
};
```

**New Game Mode:**

```tsx
// Extend useChessGame
const usePuzzleMode = () => {
  const game = useChessGame();
  // Add puzzle-specific logic
  return { ...game /* puzzle methods */ };
};
```

**Engine Integration:**

```tsx
// Create new hook
const useStockfish = (depth: number) => {
  // Initialize Stockfish
  // Return evaluation and best move
};
```

## Testing Strategy

### Unit Tests

- Test utility functions in isolation
- Mock chess.js for predictable results
- Test theme color calculations

### Integration Tests

- Test hook behavior with React Testing Library
- Verify move execution flow
- Check state updates

### E2E Tests

- Full game playthrough
- Import/export functionality
- Timer behavior
- Modal interactions

## Deployment Considerations

### Environment Variables

```env
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com
NEXT_PUBLIC_STOCKFISH_PATH=/stockfish.wasm
```

### Build Optimization

```json
{
  "scripts": {
    "build": "next build",
    "analyze": "ANALYZE=true next build"
  }
}
```

### Asset Optimization

- Compress SVG files
- Optimize audio formats (MP3/WebM)
- Use CDN for static assets in production

## Security Considerations

1. **Move Validation**
   - All moves validated server-side in multiplayer
   - chess.js prevents illegal moves

2. **WebSocket Authentication**
   - Use JWT tokens for player identity
   - Validate room access

3. **Input Sanitization**
   - Validate FEN/PGN strings
   - Prevent XSS in game metadata

## Future Architecture Enhancements

### Planned Improvements

1. **State Management Library**
   - Consider Zustand/Jotai for complex state
   - Persist game state to localStorage

2. **Database Integration**
   - Store games in PostgreSQL/MongoDB
   - User profiles and ratings

3. **Real-time Sync**
   - Optimistic UI updates
   - Conflict resolution
   - Presence system

4. **PWA Support**
   - Offline gameplay
   - Install prompts
   - Push notifications

5. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - High contrast mode

6. **Analytics**
   - Move analytics
   - Time spent tracking
   - Popular openings

---

This architecture is designed to grow with your needs while maintaining code quality and developer experience.
