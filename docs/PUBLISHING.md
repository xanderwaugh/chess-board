# 📦 Publishing Guide

Complete guide for publishing `@xanderwaugh/chess-board` to npm.

## Prerequisites

1. **npm Account**: Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **npm Login**: Run `npm login` or `pnpm login`
3. **Git Repository**: Code should be committed and pushed to GitHub

## Pre-Publishing Checklist

Before publishing, ensure:

- [ ] All tests pass
- [ ] Build completes successfully
- [ ] Version number is updated
- [ ] CHANGELOG is updated
- [ ] README is complete
- [ ] LICENSE file exists
- [ ] `.npmignore` is configured
- [ ] No sensitive data in source code

## Publishing Steps

### 1. Update Version

Follow [Semantic Versioning](https://semver.org/):

```bash
# Patch version (bug fixes): 1.0.0 -> 1.0.1
pnpm version patch

# Minor version (new features): 1.0.0 -> 1.1.0
pnpm version minor

# Major version (breaking changes): 1.0.0 -> 2.0.0
pnpm version major
```

Or manually edit `package.json`:

```json
{
  "version": "1.0.0"
}
```

### 2. Build the Package

```bash
# Clean previous build
rm -rf dist

# Build library
pnpm build
```

Verify the build output:

```bash
ls -la dist/
```

You should see:

- `index.js` - CommonJS build
- `index.esm.js` - ES Module build
- `types/` - TypeScript declarations
- `pieces/` - Chess piece SVGs
- `audio/` - Sound effects

### 3. Test the Package Locally

Before publishing, test the package in another project:

```bash
# In your chess-board directory, create a tarball
pnpm pack

# This creates @xanderwaugh-chess-board-1.0.0.tgz
```

Then in another Next.js project:

```bash
pnpm add /path/to/chess-board/@xanderwaugh-chess-board-1.0.0.tgz
```

Test importing and using components:

```tsx
import { Board, useChessGame } from "@xanderwaugh/chess-board";

function TestPage() {
  const game = useChessGame();
  return <Board game={game} />;
}
```

### 4. Publish to npm

#### First-Time Publishing

If publishing for the first time:

```bash
# Login to npm (if not already)
npm login

# Publish (access public for scoped packages)
pnpm publish --access public
```

#### Subsequent Releases

```bash
# Make sure you're on main branch
git checkout main
git pull

# Update version
pnpm version patch  # or minor/major

# Build
pnpm build

# Publish
pnpm publish
```

### 5. Create Git Tag

```bash
# Commit the version bump
git add package.json
git commit -m "Release v1.0.0"

# Create and push tag
git tag v1.0.0
git push origin main --tags
```

### 6. Create GitHub Release

1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Choose the tag you just created
4. Add release notes
5. Publish release

## Version Management Strategy

### Version Format: MAJOR.MINOR.PATCH

**MAJOR** (Breaking Changes)

- Removed or renamed exported components
- Changed prop interfaces (removed/renamed props)
- Changed hook APIs
- Requires migration guide

Example: `1.0.0` → `2.0.0`

**MINOR** (New Features)

- Added new components
- Added new hooks
- Added new utility functions
- New optional props
- Backwards compatible

Example: `1.0.0` → `1.1.0`

**PATCH** (Bug Fixes)

- Bug fixes
- Performance improvements
- Documentation updates
- Internal refactoring
- No API changes

Example: `1.0.0` → `1.0.1`

## npm Scripts Reference

```json
{
  "build": "rollup -c", // Build the library
  "prepublishOnly": "pnpm build", // Auto-build before publish
  "dev": "next dev", // Run demo app
  "lint": "eslint", // Lint code
  "format": "prettier --write ." // Format code
}
```

## Package.json Fields Explained

```json
{
  "name": "@xanderwaugh/chess-board", // Scoped package name
  "version": "1.0.0", // Current version
  "main": "./dist/index.js", // CommonJS entry
  "module": "./dist/index.esm.js", // ES Module entry
  "types": "./dist/types/index.d.ts", // TypeScript types
  "files": [
    // Files to include in package
    "dist",
    "public/pieces",
    "public/audio"
  ],
  "exports": {
    // Modern exports map
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/index.esm.js",
      "require": "./dist/index.js"
    }
  },
  "peerDependencies": {
    // Required by consumers
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "chess.js": "^1.4.0"
  }
}
```

## What Gets Published?

Only files listed in the `files` array or not ignored by `.npmignore`:

**Included:**

- ✅ `dist/` - Built library
- ✅ `public/pieces/` - SVG pieces
- ✅ `public/audio/` - Sound effects
- ✅ `README.md` - Documentation
- ✅ `LICENSE` - License file

**Excluded:**

- ❌ `src/` - Source TypeScript files
- ❌ `src/app/` - Demo app
- ❌ `node_modules/` - Dependencies
- ❌ `.next/` - Next.js build
- ❌ Config files - tsconfig, etc.

## Common Issues & Solutions

### Issue: "You do not have permission to publish"

**Solution:** Make sure you're logged in and the package name is available:

```bash
npm whoami  # Check if logged in
npm login   # Login if needed
```

### Issue: "Package name already exists"

**Solution:** Choose a different scoped name:

```json
{
  "name": "@yourname/chess-board"
}
```

### Issue: "Cannot publish to scoped package without access"

**Solution:** Add `--access public` flag:

```bash
pnpm publish --access public
```

### Issue: Build errors

**Solution:** Ensure all dependencies are installed:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Issue: TypeScript declaration errors

**Solution:** Check `tsconfig.build.json` includes all necessary files:

```json
{
  "include": ["src/components/**/*", "src/hooks/**/*", "src/utils/**/*"]
}
```

## Automated Publishing (GitHub Actions)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: "20"
          registry-url: "https://registry.npmjs.org"

      - run: pnpm install
      - run: pnpm build
      - run: pnpm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Post-Publishing

After publishing:

1. **Verify on npm**: Visit `https://www.npmjs.com/package/@xanderwaugh/chess-board`
2. **Test installation**: Try installing in a fresh project
3. **Update documentation**: Add installation instructions
4. **Announce**: Share on Twitter, Reddit, etc.

## Unpublishing (Emergency Only)

If you need to unpublish (within 72 hours of publishing):

```bash
npm unpublish @xanderwaugh/chess-board@1.0.0
```

⚠️ **Warning:** Unpublishing is permanent and can break dependent projects.

Instead, publish a patch version with fixes:

```bash
pnpm version patch
pnpm publish
```

## Deprecating a Version

If a version has critical bugs:

```bash
npm deprecate @xanderwaugh/chess-board@1.0.0 "Critical bug, use 1.0.1+"
```

## Beta/Alpha Releases

For pre-releases:

```bash
# Version as beta
pnpm version 2.0.0-beta.1

# Publish with beta tag
pnpm publish --tag beta

# Users install with:
pnpm add @xanderwaugh/chess-board@beta
```

## Checking Package Info

```bash
# View package info
npm view @xanderwaugh/chess-board

# View all versions
npm view @xanderwaugh/chess-board versions

# View latest version
npm view @xanderwaugh/chess-board version
```

## Support & Maintenance

After publishing:

1. Monitor GitHub issues
2. Review pull requests
3. Keep dependencies updated
4. Fix security vulnerabilities promptly
5. Maintain CHANGELOG
6. Respond to community feedback

## Quick Publish Checklist

- [ ] Code committed and pushed
- [ ] Version bumped
- [ ] Tests passing
- [ ] Build successful
- [ ] Logged into npm
- [ ] `pnpm publish --access public`
- [ ] Git tag created
- [ ] GitHub release created
- [ ] Documentation updated
- [ ] Package verified on npm

---

**Ready to publish!** 🚀

Need help? Open an issue on GitHub or check [npm documentation](https://docs.npmjs.com/cli/v9/commands/npm-publish).
