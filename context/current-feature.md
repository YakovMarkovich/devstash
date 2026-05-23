# Current Feature

## Feature

Stats & Sidebar

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Display stats from database data, keeping the current design/layout
- Display item types in sidebar with their icons, linking to `/items/[typename]`
- Add "View all collections" link under the collections list that goes to `/collections`
- Keep star icons for favorite collections; for recents, show a colored circle based on the most-used item type in that collection
- Create `src/lib/db/items.ts` and add the database functions (use `src/lib/db/collections.ts` for reference)

## Notes

<!-- Any extra notes -->

- Replace mock stats data with real data from Neon DB
- Full spec in `@context/features/stats-sidebar-spec.md`

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
- **2026-05-23** — Stats & Sidebar: added `getItemTypes` (with custom display order) and `getSidebarCollections` (with `dominantTypeColor` and `itemCount`) to db layer; updated Sidebar to accept live data as props (removed mock-data dependency), show real item types with counts and correct order, favorite collections with star icons, recent collections with colored circle + item count, and a "View all collections" link; updated seed to support `isFavorite` on collections and marked React Patterns and AI Workflows as favorites
