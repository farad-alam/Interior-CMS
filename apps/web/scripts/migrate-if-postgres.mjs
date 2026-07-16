// Runs Payload migrations before the production build, but ONLY when a
// Postgres connection is configured.
//
// Why this guard exists: Payload auto-syncs the schema in dev ("push" mode)
// but deliberately never does so in production — production expects
// migrations. Local dev falls back to SQLite (no DATABASE_URL), and the
// committed migrations are Postgres-specific, so running them against SQLite
// would fail. Skipping when DATABASE_URL is absent keeps `pnpm build` working
// locally while guaranteeing Vercel applies the schema on every deploy.
import { spawnSync } from 'node:child_process'

if (!process.env.DATABASE_URL) {
  console.log('[build] No DATABASE_URL — skipping migrations (local SQLite uses auto-push).')
  process.exit(0)
}

console.log('[build] DATABASE_URL found — running Payload migrations...')
const result = spawnSync('payload', ['migrate'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_OPTIONS: '--no-deprecation' },
})

process.exit(result.status ?? 1)
