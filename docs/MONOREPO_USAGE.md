# Using in a Turbo Monorepo

This guide explains how to use `@xanderwaugh/chess-board` in a turbo monorepo with full type safety.

## Setup Options

### Option 1: Published NPM Package (Recommended for External Use)

If the package is published to npm, you can use it like any other dependency:

```json
// apps/my-app/package.json
{
  "dependencies": {
    "@xanderwaugh/chess-board": "^1.0.13"
  }
}
```

### Option 2: Local Package Reference (For Development in Monorepo)

#### 1. Project Structure

```
my-monorepo/
├── apps/
│   └── my-chess-app/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── chess-board/          # This library
│       ├── package.json
│       ├── tsconfig.build.json
│       └── src/
├── package.json
└── turbo.json
```

#### 2. Root Configuration

**Root `package.json`:**
```json
{
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

**Root `turbo.json`:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

#### 3. Consumer App Configuration

**App `package.json`:**
```json
{
  "name": "my-chess-app",
  "dependencies": {
    "@xanderwaugh/chess-board": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.0",
    "chess.js": "^1.4.0",
    "lucide-react": "^0.554.0",
    "motion": "^12.0.0",
    "sonner": "^2.0.0",
    "next-themes": "^0.4.0"
  }
}
```

**App `tsconfig.json` (with project references):**
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@xanderwaugh/chess-board": ["../../packages/chess-board/src"],
      "@xanderwaugh/chess-board/*": ["../../packages/chess-board/src/*"]
    }
  },
  "references": [
    {
      "path": "../../packages/chess-board/tsconfig.build.json"
    }
  ],
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## Type Safety Features

### 1. Declaration Maps
The library now generates `.d.ts.map` files that allow your IDE to:
- Jump to the actual source code (not just `.d.ts` files)
- Show better error messages with source locations
- Enable better refactoring across the monorepo

### 2. Composite Projects
With `composite: true` in `tsconfig.build.json`:
- Faster incremental builds in the monorepo
- Better type-checking performance
- Proper project references support

### 3. Explicit Package Exports
The `package.json` now has explicit type exports for each condition:
```json
{
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": {
        "types": "./dist/types/index.d.ts",
        "default": "./dist/index.esm.js"
      },
      "require": {
        "types": "./dist/types/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  }
}
```

## Usage Example

```typescript
// apps/my-chess-app/app/page.tsx
'use client';

import { ChessBoard, useChessGame } from '@xanderwaugh/chess-board';
import '@xanderwaugh/chess-board/theme.css';

export default function ChessPage() {
  const game = useChessGame();
  
  return (
    <div className="p-4">
      <ChessBoard
        position={game.position}
        onMove={game.makeMove}
        orientation="white"
      />
    </div>
  );
}
```

## Build Commands

### For the Library (from library root):
```bash
pnpm build          # Builds JS + CSS + types
```

### For the Monorepo (from root):
```bash
turbo build         # Builds all packages in dependency order
turbo dev           # Runs all dev servers
```

## Troubleshooting

### TypeScript can't find types
1. Make sure the library is built: `cd packages/chess-board && pnpm build`
2. Check that `node_modules` is properly linked: `pnpm install`
3. Restart your TypeScript server in VSCode: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### Declaration map errors
- Ensure you're using TypeScript 4.7+ for proper declaration map support
- Check that `declarationMap: true` is in both `tsconfig.build.json` and rollup config

### Module resolution issues
If using Next.js 15+, ensure your `next.config.ts` transpiles the package:
```typescript
// apps/my-chess-app/next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@xanderwaugh/chess-board'],
};

export default config;
```

## Benefits in a Monorepo

1. **Single Source of Truth**: One version of the chess board across all apps
2. **Shared Development**: Changes immediately reflect in all consuming apps
3. **Type Safety**: Full TypeScript support with autocomplete and error checking
4. **Fast Iteration**: No need to publish to npm for every change
5. **Better Refactoring**: IDEs can refactor across package boundaries
6. **Consistent Builds**: Turbo caches and parallelizes builds efficiently

## Advanced: Using with pnpm Catalog

For version management across the monorepo, you can use pnpm's catalog feature:

**Root `pnpm-workspace.yaml`:**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'

catalog:
  react: ^19.0.0
  react-dom: ^19.0.0
  next: ^16.0.0
  chess.js: ^1.4.0
  lucide-react: ^0.554.0
  motion: ^12.0.0
```

Then reference versions with `catalog:`:
```json
{
  "dependencies": {
    "react": "catalog:",
    "react-dom": "catalog:"
  }
}
```

