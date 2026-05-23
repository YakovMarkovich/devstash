# Current Feature

## Feature

Dashboard Items

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Create `src/lib/db/items.ts` with data fetching functions
- Fetch items directly in server component
- Item card icon/border derived from the item type
- Display item type tags and anything else currently shown
- If there are no pinned items, nothing should display there
- Update collection stats display

## Notes

<!-- Any extra notes -->

- Replace dummy item data (pinned and recent) in the main dashboard area with real data from Neon DB via Prisma
- Do not use `src/lib/mock-data.ts` for items
- Full spec in `@context/features/dashboard-items-spec.md`

## History

<!-- Keep this updated. Earliest to latest -->

- **2026-05-22** — Initial Next.js + Tailwind CSS setup
- **2026-05-22** — Dashboard UI Phase 1: ShadCN setup, /dashboard route, dark mode, TopBar with DevStash logo, sidebar/main placeholders
- **2026-05-22** — Dashboard UI Phase 2: Collapsible sidebar with Types navigation (links to /items/TYPE), favorite collections, most recent collections, user avatar area, drawer toggle in TopBar, mobile overlay drawer
- **2026-05-22** — Dashboard UI Phase 3: Main content area with 4 stats cards, collections grid, pinned items section, and 10 recent items section using mock data
- **2026-05-23** — Prisma 7 + Neon PostgreSQL setup: installed prisma@7 with PrismaPg driver adapter, full schema (User, Item, ItemType, Collection, ItemCollection, Tag, NextAuth models), prisma.config.ts loading .env.local, PrismaClient singleton at src/lib/prisma.ts, initial migration applied to Neon dev branch
- **2026-05-23** — Seed data: prisma/seed.ts with demo user (demo@devstash.io), 7 system item types, 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 17 items total; bcryptjs password hash; idempotent via findFirst+create; wired to package.json prisma.seed and db:seed script
- **2026-05-23** — Dashboard Collections: created src/lib/db/collections.ts with getRecentCollections, getCollectionStats, getItemStats; updated CollectionCard to show dominant-type left border color and icons for all types present; dashboard page now fetches live data from Neon replacing mock collections
- **2026-05-23** — Dashboard Items: created src/lib/db/items.ts with getPinnedItems and getRecentItems; updated ItemCard to accept itemType directly (removed mock-data dependency) and added item type color badge alongside tags; updated dashboard page to fetch pinned and recent items from Neon; pinned section hidden when no pinned items; updated seed to support isPinned/isFavorite flags and pinned two items (Custom Hooks, Code Review Prompt)
