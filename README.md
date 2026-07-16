# AmarSoftware Interior Design Agency Platform

Reusable agency platform for building interior-design client websites.
See [the full plan](./MotionBite_Interior_Agency_Platform_Plan.md).

## Structure (monorepo — pnpm workspaces + Turborepo)

```
apps/
  web/          → Next.js + Payload 3 app (site + CMS in one deployment)
packages/
  cms-client/   → shared Zod data contracts + typed API client
  ui/           → design-system primitives (populated during extraction)
  components/   → numbered section variants   (populated during extraction)
```

Per the plan's Phase 0.5, we build the pilot client's site inside
`apps/web` first, then extract what proves reusable into `packages/*`.
We do **not** pre-build the component library.

## Getting started

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local   # then fill in values
pnpm dev
```

Local dev runs on SQLite with zero external accounts. For deployment,
switch the database to Neon Postgres and media to Cloudinary — see
`apps/web/.env.example`.
