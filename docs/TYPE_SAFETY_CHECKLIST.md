# Type Safety Checklist for Monorepo Usage

## ✅ Changes Made

### 1. TypeScript Configuration (`tsconfig.build.json`)

- [x] Added `composite: true` - enables project references
- [x] Added `declarationMap: true` - source navigation in IDEs
- [x] Added `sourceMap: true` - runtime source maps
- [x] Fixed typo: `forceConsistentCasingInFilenames` → proper camelCase

### 2. Rollup Configuration (`rollup.config.js`)

- [x] Added `declarationMap: true` to typescript plugin
- [x] Ensures `.d.ts.map` files are generated alongside `.d.ts`

### 3. Package.json Exports

- [x] Explicit type exports for import/require conditions
- [x] Added `./package.json` export for package access
- [x] Types precede implementation in export conditions

## 🎯 Type Safety Features

| Feature            | Benefit                          | Status             |
| ------------------ | -------------------------------- | ------------------ |
| Declaration Maps   | IDE jumps to source, not `.d.ts` | ✅ Enabled         |
| Composite Projects | Fast incremental builds          | ✅ Enabled         |
| Project References | Cross-package type checking      | ✅ Enabled         |
| Source Maps        | Runtime debugging                | ✅ Enabled         |
| Strict Mode        | Catches more errors              | ✅ Already enabled |
| Explicit Exports   | Clear module boundaries          | ✅ Configured      |

## 📦 Build Outputs

After building, your `dist/` should contain:

```
dist/
├── index.js                 # CommonJS bundle
├── index.js.map            # CJS source map
├── index.esm.js            # ESM bundle
├── index.esm.js.map        # ESM source map
├── theme.css               # Styles
├── types/
│   ├── index.d.ts          # Type declarations
│   ├── index.d.ts.map      # Declaration source maps (NEW!)
│   ├── components/
│   │   └── chess/
│   │       ├── board.d.ts
│   │       ├── board.d.ts.map  (NEW!)
│   │       └── ...
│   ├── hooks/
│   └── utils/
├── pieces/                 # SVG assets
└── audio/                  # Sound files
```

## 🔧 Consuming in Monorepo

### Minimal Setup (Apps)

```json
// apps/my-app/package.json
{
  "dependencies": {
    "@xanderwaugh/chess-board": "workspace:*"
  }
}
```

### With Project References (Recommended)

```json
// apps/my-app/tsconfig.json
{
  "references": [{ "path": "../../packages/chess-board/tsconfig.build.json" }]
}
```

### TypeScript Will Now:

- ✅ Type-check across package boundaries
- ✅ Navigate to source code (not just types)
- ✅ Show inline parameter hints
- ✅ Autocomplete component props
- ✅ Validate hook return types
- ✅ Catch type errors before runtime

## 🚀 Quick Test

After building, test type safety:

```typescript
import { ChessBoard, useChessGame } from '@xanderwaugh/chess-board';

const game = useChessGame();
// Hover over 'game' - you should see full UseChessGameReturn type
// Cmd+Click 'useChessGame' - should jump to source, not .d.ts

<ChessBoard
  position={game.position}  // Type-checked
  onMove={game.makeMove}    // Type-checked
  orientation="white"        // Type-checked (literal type)
/>
```

## 🐛 Common Issues

### Issue: Types not found

**Solution**:

```bash
pnpm build  # Rebuild the library
```

### Issue: IDE shows wrong source location

**Solution**:

```bash
rm -rf dist && pnpm build  # Clean rebuild
# Restart TypeScript server in IDE
```

### Issue: Slow type checking

**Solution**: Ensure `composite: true` is enabled (already done)

### Issue: Can't find module

**Solution**: Add to `next.config.ts`:

```typescript
transpilePackages: ["@xanderwaugh/chess-board"];
```

## 📚 Next Steps

1. **Rebuild the package**: `pnpm build`
2. **Verify declaration maps exist**: Check `dist/types/**/*.d.ts.map`
3. **Test in consuming app**: Import and verify IDE navigation
4. **Setup CI/CD**: Use `turbo build` for efficient builds
5. **Document for team**: Share MONOREPO_USAGE.md

## 🎓 Learn More

- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Declaration Maps](https://www.typescriptlang.org/tsconfig#declarationMap)
- [Turbo Monorepo Guide](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
