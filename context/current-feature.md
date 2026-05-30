# Current Feature: Auth Setup - NextAuth + GitHub Provider

## Feature

Auth Setup - NextAuth v5 with Prisma adapter and GitHub OAuth provider.

## Status

In Progress

## Goals

- Install `next-auth@beta` and `@auth/prisma-adapter`
- Create `src/auth.config.ts` — edge-compatible config (providers only, no adapter)
- Create `src/auth.ts` — full config with Prisma adapter and JWT strategy
- Create `src/app/api/auth/[...nextauth]/route.ts` — export handlers from `auth.ts`
- Create `src/proxy.ts` — protect `/dashboard/*` routes, redirect unauthenticated users to sign-in
- Create `src/types/next-auth.d.ts` — extend Session type with `user.id`
- Add required env vars: `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`

## Notes

- Use `next-auth@beta` (not `@latest` which installs v4)
- Proxy file must be at `src/proxy.ts` (same level as `app/`)
- Use named export: `export const proxy = auth(...)` — not default export
- Use `session: { strategy: 'jwt' }` with split config pattern
- Do NOT set custom `pages.signIn` — use NextAuth's default page
- Use Context7 to verify the newest config and conventions before implementing
- Testing: navigate to `/dashboard` → should redirect to sign-in → click "Sign in with GitHub" → verify redirect back to `/dashboard`

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
- **2026-05-23** — Add Pro Badge to Sidebar: added ShadCN Badge component; File and Image item types in the sidebar now display a subtle secondary-variant "PRO" badge instead of an item count
- **2026-05-26** — Code Audit Quick Wins: replaced 4 COUNT queries with 2 Prisma groupBy calls in getCollectionStats/getItemStats; extracted shared ICON_MAP to src/lib/icons.ts with getTypeIcon helper (removed duplication from Sidebar, CollectionCard, ItemCard); moved formatDate to src/lib/utils.ts; root route now redirects to /dashboard; fixed getSidebarCollections to compute dominantTypeColor for favorite collections (removed isFavorite guard)
