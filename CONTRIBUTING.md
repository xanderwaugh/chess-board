# Contributing to Chess Board

Thank you for your interest in contributing to this modular chess board system! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Component Guidelines](#component-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

Please be respectful and constructive in all interactions. We're building this together!

## Getting Started

### Prerequisites

- Node.js 20+ or 22+
- pnpm (recommended) or npm
- Git

### Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/your-username/chess-board.git
   cd chess-board
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Create a branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Start development server:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Project Structure

```
src/
├── components/chess/    # Chess UI components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── app/                # Next.js pages
```

### Adding a New Component

1. Create the component file in `src/components/chess/`:

   ```tsx
   "use client";

   import React from "react";

   interface YourComponentProps {
     // Define props
   }

   const YourComponent: React.FC<YourComponentProps> = (props) => {
     // Implementation
   };

   export { YourComponent };
   ```

2. Export it in `src/components/chess/index.ts`:

   ```tsx
   export { YourComponent } from "./your-component";
   ```

3. Document the component in the README

### Adding a New Hook

1. Create the hook file in `src/hooks/`:

   ```tsx
   "use client";

   import { useCallback, useState } from "react";

   export function useYourHook() {
     // Implementation
     return {
       // Exposed API
     };
   }
   ```

2. Export it in `src/hooks/index.ts`

### Adding Utility Functions

1. Add to appropriate utility file in `src/utils/`
2. Export in `src/utils/index.ts`
3. Add JSDoc comments
4. Add tests if applicable

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define explicit interfaces for props
- Export types that consumers might need
- Avoid `any` types

```tsx
// Good
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

// Bad
interface ButtonProps {
  onClick: any;
  disabled: any;
}
```

### React Patterns

- Use functional components with hooks
- Mark client components with `"use client"`
- Use `React.FC` type for components
- Keep components focused and small

```tsx
// Good - Client component
"use client";

import React from "react";

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

export { Button };
```

### File Naming

- Use kebab-case for files: `use-chess-game.ts`
- Use PascalCase for component names: `Board`, `Square`
- Use camelCase for utilities: `getValidMoves`

### Import Order

1. React imports
2. Third-party imports
3. Internal components
4. Hooks
5. Utils
6. Types

```tsx
import type { BoardTheme } from "@/utils/theme-utils";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useChessGame } from "@/hooks/use-chess-game";
import { getPieceImagePath } from "@/utils/chess-helpers";
import { motion } from "motion/react";
```

## Component Guidelines

### Props Design

- Keep props minimal and focused
- Use optional props with sensible defaults
- Document complex props with JSDoc

```tsx
interface BoardProps {
  /** The chess game instance from useChessGame */
  game: UseChessGameReturn;
  /** Visual theme for the board @default "default" */
  theme?: BoardTheme;
  /** Board size @default "lg" */
  size?: "sm" | "md" | "lg" | "xl";
}
```

### Styling

- Use Tailwind CSS classes
- Support dark mode with `dark:` variants
- Extract repeated patterns to theme utilities
- Use `cn()` helper for conditional classes

```tsx
<div className={cn("rounded-lg border", isActive && "bg-primary", className)} />
```

### Animations

- Use Framer Motion for animations
- Keep animations subtle and purposeful
- Make animations optional/configurable
- Use spring physics for natural feel

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ type: "spring" }}
/>
```

## Testing

### Unit Tests

We use Jest and React Testing Library. Tests go alongside components:

```
square.tsx
square.test.tsx
```

### Writing Tests

```tsx
import { render, screen } from "@testing-library/react";

import { Square } from "./square";

describe("Square", () => {
  it("renders a piece when provided", () => {
    render(
      <Square square="e4" piece={{ type: "p", color: "w" }} theme="default" />,
    );

    expect(screen.getByAltText(/white pawn/i)).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
pnpm test:coverage # With coverage
```

## Pull Request Process

### Before Submitting

1. **Test your changes:**

   ```bash
   pnpm build
   pnpm lint
   ```

2. **Update documentation:**
   - Update README.md if adding features
   - Add JSDoc comments
   - Update ARCHITECTURE.md if changing structure

3. **Check for linting errors:**
   ```bash
   pnpm lint
   pnpm format
   ```

### PR Guidelines

1. **Title:** Use clear, descriptive title
   - Good: "Add evaluation heatmap to engine controls"
   - Bad: "Update files"

2. **Description:** Include:
   - What changed
   - Why it changed
   - How to test it
   - Screenshots if UI changes

3. **Keep PRs focused:**
   - One feature/fix per PR
   - Small, reviewable changes
   - Separate refactoring from features

4. **Commit messages:**
   ```
   feat: add stockfish integration
   fix: correct timer countdown logic
   docs: update API reference
   style: format with prettier
   refactor: extract theme logic
   test: add board component tests
   ```

### Review Process

1. A maintainer will review your PR
2. Address feedback by pushing new commits
3. Once approved, a maintainer will merge

## Areas for Contribution

### High Priority

- [ ] Stockfish WASM integration
- [ ] Comprehensive test coverage
- [ ] Accessibility improvements
- [ ] Performance optimizations

### Features

- [ ] Puzzle mode implementation
- [ ] Opening explorer
- [ ] Game analysis board
- [ ] Player profiles
- [ ] Tournament system
- [ ] Game database integration

### Improvements

- [ ] More board themes
- [ ] Additional sound packs
- [ ] Animation presets
- [ ] Mobile gesture controls
- [ ] Keyboard navigation

### Documentation

- [ ] Video tutorials
- [ ] More usage examples
- [ ] Storybook integration
- [ ] API reference improvements

## Questions?

- Open a GitHub issue for bugs
- Start a discussion for feature ideas
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
