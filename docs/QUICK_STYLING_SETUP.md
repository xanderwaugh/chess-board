# ⚡ Quick Styling Setup

**TL;DR: 3 steps to get components styled correctly**

## 1. Add to Tailwind Config

```typescript
// tailwind.config.ts
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@xanderwaugh/chess-board/dist/**/*.{js,mjs}", // 👈 ADD THIS
  ],
};
```

## 2. Import Styles

```css
/* app/globals.css or src/app/globals.css */
@import "tailwindcss";
@import "@xanderwaugh/chess-board/styles"; /* 👈 ADD THIS */
```

## 3. Add Theme Provider

```tsx
// app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Done! 🎉

Now restart your dev server:

```bash
pnpm dev
# or
npm run dev
```

---

📖 **Full guide**: [STYLING_GUIDE.md](./STYLING_GUIDE.md)  
🎯 **Complete example**: [docs/COMPLETE_SETUP_EXAMPLE.md](./docs/COMPLETE_SETUP_EXAMPLE.md)
