# Current Feature

## Feature

Seed Data

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Create `prisma/seed.ts` to populate the database with sample data
- Seed a demo user: `demo@devstash.io`, password `12345678` (bcryptjs, 12 rounds), `isPro: false`
- Seed all 7 system item types (snippet, prompt, command, note, file, image, link) with `isSystem: true`
- Seed 5 collections with items as specified in `@context/features/seed-spec.md`:
  - **React Patterns** — 3 snippets (TypeScript)
  - **AI Workflows** — 3 prompts
  - **DevOps** — 1 snippet, 1 command, 2 links (real URLs)
  - **Terminal Commands** — 4 commands
  - **Design Resources** — 4 links (real URLs)
- Wire up seed script in `package.json` via `prisma.seed` config
- Run seed against the Neon dev branch

## Notes

<!-- Any extra notes -->

- Full data spec in `@context/features/seed-spec.md`
- Use `bcryptjs` (not `bcrypt`) — no native bindings needed
- Use `upsert` or `deleteMany` + `createMany` so the script is idempotent (safe to re-run)
- Links must use real, publicly accessible URLs

## History

<!-- Keep this updated. Earliest to latest -->

- **2026-05-22** — Initial Next.js + Tailwind CSS setup
- **2026-05-22** — Dashboard UI Phase 1: ShadCN setup, /dashboard route, dark mode, TopBar with DevStash logo, sidebar/main placeholders
- **2026-05-22** — Dashboard UI Phase 2: Collapsible sidebar with Types navigation (links to /items/TYPE), favorite collections, most recent collections, user avatar area, drawer toggle in TopBar, mobile overlay drawer
- **2026-05-22** — Dashboard UI Phase 3: Main content area with 4 stats cards, collections grid, pinned items section, and 10 recent items section using mock data
- **2026-05-23** — Prisma 7 + Neon PostgreSQL setup: installed prisma@7 with PrismaPg driver adapter, full schema (User, Item, ItemType, Collection, ItemCollection, Tag, NextAuth models), prisma.config.ts loading .env.local, PrismaClient singleton at src/lib/prisma.ts, initial migration applied to Neon dev branch
- **2026-05-23** — Seed data: prisma/seed.ts with demo user (demo@devstash.io), 7 system item types, 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 17 items total; bcryptjs password hash; idempotent via findFirst+create; wired to package.json prisma.seed and db:seed script
