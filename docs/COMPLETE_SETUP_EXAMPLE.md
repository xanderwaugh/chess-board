# Complete Setup Example

This guide provides a **step-by-step walkthrough** for integrating `@xanderwaugh/chess-board` into a **new or existing Next.js project** with Tailwind CSS.

## Prerequisites

- Node.js 18+ installed
- pnpm, npm, or yarn package manager
- Next.js 15+ project (or create a new one)

## Step-by-Step Setup

### 1. Create a New Next.js Project (Optional)

If you don't have an existing project:

```bash
npx create-next-app@latest my-chess-app
cd my-chess-app
```

When prompted:

- ✅ TypeScript? **Yes**
- ✅ ESLint? **Yes**
- ✅ Tailwind CSS? **Yes**
- ✅ `src/` directory? **Yes** (recommended)
- ✅ App Router? **Yes**
- ❌ Turbopack? **No** (optional)
- ❌ Customize default import alias? **No**

### 2. Install Dependencies

```bash
pnpm add @xanderwaugh/chess-board chess.js motion lucide-react sonner next-themes

# If using npm:
# npm install @xanderwaugh/chess-board chess.js motion lucide-react sonner next-themes
```

### 3. Configure Styles

Edit `src/app/globals.css`:

```css
@import "tailwindcss";

/* Add chess-board source for Tailwind CSS v4 */
@source "node_modules/@xanderwaugh/chess-board/dist/*.{js,ts,jsx,tsx}";

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

**Note:** You don't need to configure `tailwind.config.ts` or import styles in your `layout.tsx` file. Just add the `@source` line above to your CSS file.

### 4. Setup Theme Provider

Edit `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Game",
  description: "Play chess with a beautiful UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 5. Create a Chess Page

Create `src/app/chess/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ChessBoard, useChessGame } from "@xanderwaugh/chess-board";

export default function ChessPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const game = useChessGame({
    onMove: (move) => {
      console.log("Move made:", move.san);
    },
    onGameOver: (result) => {
      console.log("Game over:", result);
    },
  });

  return (
    <main className="container mx-auto min-h-screen p-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-center text-3xl font-bold">Chess Game</h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Chess Board */}
          <div className="flex-1">
            <ChessBoard
              game={game}
              theme="wood"
              showCoordinates={true}
              soundEnabled={soundEnabled}
            />
          </div>

          {/* Game Info Sidebar */}
          <div className="space-y-4 lg:w-80">
            <div className="bg-card text-card-foreground rounded-lg border p-4">
              <h2 className="mb-2 text-lg font-semibold">Game Status</h2>
              <p className="text-muted-foreground text-sm">{game.status}</p>
              <p className="mt-2 text-sm">
                Turn:{" "}
                <span className="font-medium">
                  {game.turn === "w" ? "White" : "Black"}
                </span>
              </p>
            </div>

            <div className="bg-card text-card-foreground rounded-lg border p-4">
              <h2 className="mb-2 text-lg font-semibold">Controls</h2>
              <div className="space-y-2">
                <button
                  onClick={game.undoMove}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full rounded px-4 py-2"
                  disabled={game.moveHistory.length === 0}
                >
                  Undo Move
                </button>
                <button
                  onClick={game.resetGame}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full rounded px-4 py-2"
                >
                  Reset Game
                </button>
                <button
                  onClick={game.flipBoard}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded px-4 py-2"
                >
                  Flip Board
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="bg-accent text-accent-foreground hover:bg-accent/80 w-full rounded px-4 py-2"
                >
                  {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
                </button>
              </div>
            </div>

            <div className="bg-card text-card-foreground rounded-lg border p-4">
              <h2 className="mb-2 text-lg font-semibold">Move History</h2>
              <div className="max-h-64 overflow-y-auto text-sm">
                {game.moveHistory.length === 0 ? (
                  <p className="text-muted-foreground">No moves yet</p>
                ) : (
                  <ol className="space-y-1">
                    {game.moveHistory.map((move, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-muted-foreground">
                          {Math.floor(idx / 2) + 1}.
                        </span>
                        <span>{move}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
```

### 6. Update Home Page (Optional)

Edit `src/app/page.tsx`:

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="space-y-6 text-center">
        <h1 className="text-5xl font-bold">♟️ Chess Board</h1>
        <p className="text-muted-foreground text-xl">
          A beautiful, modular chess application
        </p>
        <Link
          href="/chess"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-lg px-8 py-3 transition-colors"
        >
          Play Chess
        </Link>
      </div>
    </main>
  );
}
```

### 7. Run Your Application

```bash
pnpm dev

# If using npm:
# npm run dev
```

Visit [http://localhost:3000/chess](http://localhost:3000/chess) to see your chess board!

## Verification Checklist

✅ **Styles are working** - Components have proper colors and spacing  
✅ **Dark mode works** - Toggle theme and verify board updates  
✅ **Pieces move** - Click or drag pieces to make moves  
✅ **Sounds play** - Enable sound and verify move/capture sounds (if soundEnabled prop is true)  
✅ **Responsive** - Resize browser window to check mobile layout

## Common Issues & Solutions

### Issue: Components are unstyled (no colors, no spacing)

**Solution**: Make sure you added the `@source` line to your CSS file:

```css
@source "node_modules/@xanderwaugh/chess-board/dist/*.{js,ts,jsx,tsx}";
```

Then restart your dev server:

```bash
pnpm dev
```

### Issue: Dark mode doesn't work

**Solution**: Verify ThemeProvider is set up correctly in `layout.tsx`:

```tsx
<html suppressHydrationWarning>
  <ThemeProvider attribute="class">{children}</ThemeProvider>
</html>
```

### Issue: TypeScript errors about missing types

**Solution**: Install peer dependencies:

```bash
pnpm add chess.js motion lucide-react sonner next-themes
```

### Issue: Build errors with PostCSS

**Solution**: If using Tailwind v4, ensure you have the correct PostCSS config:

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**Note:** You don't need to add the library to your `tailwind.config.ts` content array. The `@source` directive in your CSS file is sufficient.

## Advanced Configuration

### Custom Theme Colors

Override CSS variables in your `globals.css`:

```css
@source "node_modules/@xanderwaugh/chess-board/dist/*.{js,ts,jsx,tsx}";

:root {
  /* Override default colors */
  --primary: oklch(0.5 0.2 250);
  --primary-foreground: oklch(1 0 0);
}

.dark {
  /* Override dark mode colors */
  --primary: oklch(0.7 0.2 250);
}
```

### Using Different Board Themes

```tsx
<ChessBoard game={game} theme="wood" />     // Classic wood
<ChessBoard game={game} theme="marble" />   // Elegant marble
<ChessBoard game={game} theme="neon" />     // Cyberpunk neon
<ChessBoard game={game} theme="default" />  // Modern gray (default)
```

### Adding Custom Controls

```tsx
import { Controls } from "@xanderwaugh/chess-board";

<Controls
  game={game}
  soundEnabled={soundEnabled}
  onToggleSound={() => setSoundEnabled(!soundEnabled)}
  theme="wood"
  onThemeChange={(theme) => console.log("Theme changed:", theme)}
/>;
```

### Timer/Clock Support

```tsx
import { useEffect, useState } from "react";
import { Timers } from "@xanderwaugh/chess-board";

const [whiteTime, setWhiteTime] = useState(600); // 10 minutes
const [blackTime, setBlackTime] = useState(600);

<Timers
  whiteTime={whiteTime}
  blackTime={blackTime}
  currentTurn={game.turn}
  running={!game.gameOver}
  onTimeUpdate={(color, time) => {
    if (color === "w") setWhiteTime(time);
    else setBlackTime(time);
  }}
  onTimeExpired={(color) => {
    console.log(`${color === "w" ? "White" : "Black"} ran out of time!`);
  }}
/>;
```

## Next Steps

- 📖 Read the [main README](../README.md) for full API documentation
- 🎨 See [STYLING_GUIDE.md](../STYLING_GUIDE.md) for detailed styling info
- 🏗️ Check [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- 🤝 View [CONTRIBUTING.md](../CONTRIBUTING.md) to contribute

## Need Help?

If you encounter issues not covered here:

1. Check the [STYLING_GUIDE.md](../STYLING_GUIDE.md) troubleshooting section
2. Review your Tailwind config carefully
3. Make sure all peer dependencies are installed
4. Open an issue on [GitHub](https://github.com/xanderwaugh/chess-board/issues)

---

Happy chess playing! ♟️
