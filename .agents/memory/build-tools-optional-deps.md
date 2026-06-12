---
name: Build tools in optionalDependencies
description: Why vite, tsx, tailwindcss etc. must be in optionalDependencies, not devDependencies, for this project.
---

The rule: `NODE_ENV=production` in `.replit [env]` causes `npm install` to skip `devDependencies` entirely — even during the build phase. This breaks `vite build` and `tsx` at runtime.

**Fix:** Move all build-time and SSR-runtime tools to `optionalDependencies`:
- `vite`
- `tsx` (used by both `dev` and `start` scripts)
- `tailwindcss`
- `@vitejs/plugin-react`
- `@tailwindcss/vite`
- `typescript`

`npm install` always installs `optionalDependencies` regardless of `NODE_ENV`.

**Why:** Cannot edit `.replit` to remove the `NODE_ENV = "production"` env var — it controls the deployment target. `optionalDependencies` is the sanctioned workaround.

**How to apply:** Any new build tool or SSR runtime dependency should go in `optionalDependencies`, not `devDependencies`.
