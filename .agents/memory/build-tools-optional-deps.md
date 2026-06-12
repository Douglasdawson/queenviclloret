---
name: Build tools deployment fix
description: How to get vite/tsx/tailwindcss to work during the deployment build despite NODE_ENV=production.
---

**The problem:** `.replit` sets `NODE_ENV=production` globally. This causes `npm install` to skip `devDependencies` even during the build phase, so `vite: command not found` at publish time.

**Failed approach — optionalDependencies:** Moving build tools to `optionalDependencies` in `package.json` does NOT work on its own. The `package-lock.json` records each package's original classification (`"dev": true`), and `npm install` honours the lockfile flags, not just `package.json`. Any `installLanguagePackages` call also reverts `package.json` back, undoing the change.

**The working fix:** Prefix the `build` script in `package.json` with `npm install --include=dev --include=optional`. The `--include` flag overrides `NODE_ENV` and `--omit` flags, so dev deps are always installed before the build runs:

```json
"build": "npm install --include=dev --include=optional && npm run build:client && npm run build:ssr"
```

**Why this works:** On Cloud Run (autoscale), the build step and run step share the same container image. Dev deps installed during build are present when `npm run start` executes (needed for `tsx`).

**How to apply:** Keep build tools in `devDependencies` as normal. Do not move them to `optionalDependencies`. The build script handles installation.
