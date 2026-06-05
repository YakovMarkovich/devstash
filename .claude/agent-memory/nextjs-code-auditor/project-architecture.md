---
name: project-architecture
description: DevStash codebase architecture — key structural facts discovered during the first full audit (May 2026)
metadata:
  type: project
---

DevStash is an early-stage Next.js 16 / React 19 app (App Router). As of the first audit the codebase is small: one real route (`/dashboard`), no API routes, no auth implementation yet, no middleware.

**Why:** Still in active UI build-out phase; auth, file upload, AI, and Stripe are all planned but not yet started.

**How to apply:** Do not flag missing auth checks, missing API routes, or missing AI endpoints as issues — they are genuinely not implemented yet. Focus audits on what actually exists.

Key structural facts:
- Framework: Next.js 16, React 19, TypeScript strict mode
- DB: Neon Postgres via Prisma 7 with `@prisma/adapter-pg` driver adapter. Prisma client is generated into `src/generated/prisma/` (gitignored).
- Prisma singleton at `src/lib/prisma.ts` — correctly uses `globalThis` pattern.
- DB query layer: `src/lib/db/collections.ts`, `src/lib/db/items.ts`
- Components under `src/components/dashboard/` — Sidebar, TopBar, CollectionCard, ItemCard, StatsCards, SidebarContext
- UI primitives in `src/components/ui/` — use `@base-ui/react` (NOT Radix UI), wrapped with `class-variance-authority`
- No API routes exist yet
- No NextAuth config (`auth.ts`) exists yet
- No middleware exists yet
- Styling: Tailwind CSS v4 + ShadCN UI (configured via `@import "shadcn/tailwind.css"` in globals.css)
- Seed file at `prisma/seed.ts` — stores password hash in `access_token` column of Account table (non-standard)
