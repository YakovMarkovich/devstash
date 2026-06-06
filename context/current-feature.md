# Current Feature: Item Create

## Feature

Add new items via a modal dialog opened from a "New Item" button in the top bar.

## Status

In Progress

## Goals

- A "New Item" button in the top bar opens a ShadCN `Dialog`
- Type selector lets the user pick from: snippet, prompt, command, note, link
- Fields shown based on selected type:
  - All types: title (required), description, tags
  - snippet / command: content, language
  - prompt / note: content
  - link: URL (required)
- Server action `createItem` with Zod validation and ownership assignment
- Query function `createItem` in `src/lib/db/items.ts`
- On success: close the dialog, show a Sonner success toast, and refresh the item list (`router.refresh()`)
- On error: show a Sonner error toast and keep the dialog open

## Notes

- Use ShadCN `Dialog` (already installed)
- Use existing Sonner toast setup
- Server action lives in `src/actions/items.ts` alongside `updateItem` / `deleteItem`
- Assign `userId` from the session inside the server action
- Refresh pattern: `router.refresh()` (same as `updateItem`)

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
- **2026-05-30** — Auth Setup Phase 1: installed next-auth@beta and @auth/prisma-adapter; split config pattern with auth.config.ts (edge, GitHub provider) and auth.ts (Prisma adapter + JWT strategy + session.user.id callback); API route at src/app/api/auth/[...nextauth]/route.ts; src/proxy.ts protects /dashboard/* with callbackUrl redirect; src/types/next-auth.d.ts extends Session with user.id
- **2026-05-30** — Auth Credentials Phase 2: added password field to User model via migration; Credentials provider placeholder in auth.config.ts (edge-safe); auth.ts overrides Credentials with bcrypt validation using split config pattern; POST /api/auth/register with input validation, duplicate check, and bcrypt hashing
- **2026-05-30** — Auth UI Phase 3: custom /sign-in page (email/password + GitHub OAuth, Suspense-wrapped form, callbackUrl support), custom /register page (4-field form, client-side validation, success toast via sonner, redirects to sign-in), reusable UserAvatar (GitHub image or initials fallback), UserMenu in sidebar bottom (live session data, sign-out server action, profile link dropdown), auth.config.ts pages.signIn set to /sign-in, proxy.ts redirect updated, next.config.ts GitHub avatar hostname added
- **2026-06-05** — Profile Page: /profile route protected by middleware; user info card (avatar, name, email, join date); usage stats (total items, total collections, per-type icon breakdown scoped by userId); Change Password dialog (email/password users only, hidden for OAuth); Delete Account with AlertDialog confirmation + next-auth/react signOut; POST /api/profile/change-password and DELETE /api/profile/delete-account; src/lib/db/profile.ts with getProfileUser and getProfileStats; installed ShadCN dialog, alert-dialog, separator (Base UI variants)
- **2026-06-05** — Rate Limiting for Auth: installed @upstash/redis + @upstash/ratelimit; src/lib/rate-limit.ts with checkRateLimit (sliding window, fail-open), getIP, rateLimitResponse; /api/auth/register rate limited 3/hr/IP with 429+Retry-After; credentials login rate limited 5/15min/IP+email via authorize() throwing CredentialsSignin code="rate_limit", SignInForm shows toast on rate limit; stub endpoints for forgot-password (3/hr/IP), reset-password (5/15min/IP), resend-verification (3/15min/IP+email) ready for email flow
- **2026-06-05** — Items List View: dynamic route /items/[type] with sidebar, 2-column responsive grid of ItemCard, empty state, and 404 for unknown type slugs; added getItemsByType to src/lib/db/items.ts (case-insensitive type lookup by slug); src/app/items/layout.tsx mirrors dashboard layout; middleware extended to protect /items/* routes
- **2026-06-05** — Vitest Unit Testing Setup: installed vitest@2 + vite-tsconfig-paths; vitest.config.mts with node environment and @/* path alias resolution; npm test / npm run test:watch scripts; initial tests for src/lib/utils.ts (cn, formatDate — 7 tests) and pure helpers in src/lib/rate-limit.ts (getIP, rateLimitResponse — 9 tests); updated ai-interaction.md workflow to require tests for utilities/server actions before committing
- **2026-06-05** — Item List View 3-Column Grid: updated grid in src/app/items/[type]/page.tsx from grid-cols-1 md:grid-cols-2 to grid-cols-1 md:grid-cols-2 lg:grid-cols-3; 3 columns at lg breakpoint (1024px+), 2 columns at md (768px+), 1 column on mobile
- **2026-06-05** — Item Drawer: ShadCN Sheet opens from the right on ItemCard click; works on dashboard and items list pages; GET /api/items/[id] with auth check fetches full detail (content, collections, tags, language, dates); loading skeleton while fetching; action bar with Favorite, Pin, Copy, Edit, Delete; DashboardItems and ItemsClientWrapper client wrappers manage drawer state while server pages remain server components; formatDate widened to Date|string for JSON-serialized API dates
- **2026-06-05** — Item Drawer Edit Mode: Edit button toggles inline edit mode in the same drawer; Save calls updateItem server action (Zod validation, ownership check, { success, data, error } return); Cancel discards; editable fields: title/description/tags for all types, content for text types, language for snippet/command, url for link; non-editable: item type, collections, dates; updateItem query in src/lib/db/items.ts handles tag disconnect/connect-or-create; router.refresh() syncs card list; zod@4 installed; ShadCN textarea added; 10 unit tests
- **2026-06-06** — Item Delete: Delete button in item drawer opens ShadCN AlertDialog confirmation; confirming calls deleteItem server action (ownership check, Prisma delete); on success closes drawer, shows Sonner success toast, router.refresh(); on error shows Sonner error toast; 5 unit tests for deleteItem action
