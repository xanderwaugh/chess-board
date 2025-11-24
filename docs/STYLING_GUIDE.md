# Styling Guide for @xanderwaugh/chess-board

This library uses **Tailwind CSS v4** and requires proper setup in your consuming project to work correctly.

## Quick Start

### 1. Install Required Dependencies

```bash
npm install @xanderwaugh/chess-board chess.js motion lucide-react sonner next-themes
# or
pnpm add @xanderwaugh/chess-board chess.js motion lucide-react sonner next-themes
```

### 2. Configure Tailwind to Process the Library

You have **two options** for styling:

---

## Option A: Let Your Tailwind Process the Library Components (Recommended)

This is the best approach as it ensures all utility classes are generated and your theme is applied consistently.

### Step 1: Update Your Tailwind Config

Add the library to your Tailwind content array so it scans the components for utility classes:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Add this line to scan the chess-board library
    "./node_modules/@xanderwaugh/chess-board/dist/**/*.{js,mjs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

### Step 2: Import the Theme CSS Variables

In your root CSS file (e.g., `app/globals.css` or `src/styles/globals.css`):

```css
@import "tailwindcss";

/* Import the chess-board theme variables */
@import "@xanderwaugh/chess-board/styles";

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**OR** if you prefer to use the compiled theme:

```css
@import "tailwindcss";

/* Your custom theme */
@theme {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  /* ... other variables ... */
}

/* Import compiled theme CSS */
@import "@xanderwaugh/chess-board/theme.css";
```

### Step 3: Use the Components

```tsx
"use client";

import { ChessBoard, useChessGame } from "@xanderwaugh/chess-board";

export default function ChessPage() {
  const game = useChessGame();

  return <ChessBoard game={game} />;
}
```

---

## Option B: Pre-compiled CSS (Not Recommended)

If you cannot modify your Tailwind config, you can import the pre-compiled CSS, but this may result in missing styles:

```css
/* In your globals.css */
@import "@xanderwaugh/chess-board/theme.css";
```

⚠️ **Warning**: This only includes CSS variables, not all utility classes. Components may not be fully styled.

---

## Theme Customization

The library uses CSS variables for theming, which you can override:

```css
/* In your globals.css or component */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... other variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... other variables */
}
```

## Dark Mode Support

The library supports dark mode via the `next-themes` package:

```tsx
// app/layout.tsx
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

## Troubleshooting

### Components are unstyled or missing styles

**Solution**: Make sure you've added the library to your Tailwind `content` array (Option A, Step 1).

### TypeScript errors

**Solution**: Ensure you have the required peer dependencies installed:

- `chess.js`
- `motion` (Framer Motion)
- `lucide-react`
- `sonner`
- `next-themes`

### CSS variable undefined errors

**Solution**: Import the theme CSS in your root CSS file (Option A, Step 2).

### Build errors with PostCSS

**Solution**: Ensure you have `@tailwindcss/postcss` or `tailwindcss` postcss plugin installed:

```bash
npm install -D @tailwindcss/postcss
# or
npm install -D tailwindcss
```

Update `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    // or 'tailwindcss': {}
  },
};
```

## Example Implementation

Here's a complete example with proper styling setup:

**1. Install dependencies:**

```bash
pnpm add @xanderwaugh/chess-board chess.js motion lucide-react sonner next-themes
```

**2. Configure Tailwind (`tailwind.config.ts`):**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@xanderwaugh/chess-board/dist/**/*.{js,mjs}",
  ],
};

export default config;
```

**3. Import styles (`app/globals.css`):**

```css
@import "tailwindcss";
@import "@xanderwaugh/chess-board/styles";
```

**4. Setup theme provider (`app/layout.tsx`):**

```tsx
import { ThemeProvider } from "next-themes";

import "./globals.css";

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

**5. Use the component (`app/chess/page.tsx`):**

```tsx
"use client";

import { ChessBoard, useChessGame } from "@xanderwaugh/chess-board";

export default function ChessPage() {
  const game = useChessGame();

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Chess Game</h1>
      <ChessBoard game={game} />
    </div>
  );
}
```

## Additional Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Chess.js Documentation](https://github.com/jhlywa/chess.js)

## Support

If you encounter any issues, please open an issue on [GitHub](https://github.com/xanderwaugh/chess-board/issues).
