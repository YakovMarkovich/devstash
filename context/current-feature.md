# Current Feature

## Feature

Prisma + Neon PostgreSQL Setup

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Install and configure Prisma 7 ORM
- Connect to Neon PostgreSQL (serverless) via `DATABASE_URL`
- Write initial Prisma schema based on the data models in `@context/project-overview.md`
- Include NextAuth models: `Account`, `Session`, `VerificationToken`
- Add appropriate indexes and cascade deletes as specified in the draft schema
- Always use `prisma migrate dev` (never `db push`) — development branch in `DATABASE_URL`, production branch separate

## Notes

<!-- Any extra notes -->

- Prisma 7 has breaking changes — review the upgrade guide before implementing
- Schema draft is in `@context/project-overview.md` (Section 4)
- See `@context/features/database-spec.md` for full requirements

## History

<!-- Keep this updated. Earliest to latest -->

- **2026-05-22** — Initial Next.js + Tailwind CSS setup
- **2026-05-22** — Dashboard UI Phase 1: ShadCN setup, /dashboard route, dark mode, TopBar with DevStash logo, sidebar/main placeholders
- **2026-05-22** — Dashboard UI Phase 2: Collapsible sidebar with Types navigation (links to /items/TYPE), favorite collections, most recent collections, user avatar area, drawer toggle in TopBar, mobile overlay drawer
- **2026-05-22** — Dashboard UI Phase 3: Main content area with 4 stats cards, collections grid, pinned items section, and 10 recent items section using mock data
- **2026-05-23** — Prisma 7 + Neon PostgreSQL setup: installed prisma@7 with PrismaPg driver adapter, full schema (User, Item, ItemType, Collection, ItemCollection, Tag, NextAuth models), prisma.config.ts loading .env.local, PrismaClient singleton at src/lib/prisma.ts, initial migration applied to Neon dev branch
