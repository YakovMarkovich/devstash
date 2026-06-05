---
name: audit-patterns
description: Recurring anti-patterns and clean areas found in the DevStash codebase across audits
metadata:
  type: project
---

## Recurring Anti-patterns

### ICON_MAP duplication
`ICON_MAP` (mapping Lucide icon name strings to LucideIcon components) is copy-pasted identically in three files: `Sidebar.tsx`, `CollectionCard.tsx`, `ItemCard.tsx`. This is the most widespread duplication in the codebase. Should be extracted to a shared util.

### Missing userId scoping in DB queries
`getRecentCollections`, `getCollectionStats`, `getItemStats`, `getPinnedItems`, `getRecentItems`, `getSidebarCollections`, `getItemTypes` — none of them accept a userId parameter. All queries hit the entire table rather than scoping to the authenticated user. This is safe right now (no auth, single demo user) but will become a critical data-isolation bug the moment multi-user auth is wired up.

### getSidebarCollections skips dominantTypeColor for favorite collections
Line 101 in `src/lib/db/collections.ts`: `if (!col.isFavorite)` — favorite collections always get `dominantTypeColor: null`. This is a deliberate display shortcut but may produce confusing UI for favorites that have items.

### Seed stores password hash in access_token
`prisma/seed.ts` line 44: the bcrypt hash is stored in the `access_token` column of the `Account` table. This is a workaround that will need to be replaced when real NextAuth credentials auth is implemented. The `access_token` column is intended for OAuth tokens, not password hashes.

### createItem in seed doesn't guard against duplicates
`createItem` in `prisma/seed.ts` always calls `prisma.item.create` without a prior existence check, unlike `createCollection` which does a `findFirst`. Re-running the seed creates duplicate items.

## Clean Areas

- Prisma singleton pattern (`src/lib/prisma.ts`) is correct
- SidebarContext pattern (createContext + null guard in useSidebar) is clean
- DB query files use `Promise.all` for parallel queries where appropriate
- TypeScript interfaces are exported from db layer and reused by components (good separation)
- `getItemTypes` correctly sorts by TYPE_ORDER constant rather than DB sort
