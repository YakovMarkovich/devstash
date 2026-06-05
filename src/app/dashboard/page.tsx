import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { CollectionCard } from '@/components/dashboard/CollectionCard';
import { DashboardItems } from '@/components/dashboard/DashboardItems';
import { getRecentCollections, getCollectionStats, getItemStats, getSidebarCollections } from '@/lib/db/collections';
import { getPinnedItems, getRecentItems, getItemTypes } from '@/lib/db/items';

export default async function DashboardPage() {
  const [session, recentCollections, collectionStats, itemStats, pinnedItems, recentItems, itemTypes, sidebarCollections] = await Promise.all([
    auth(),
    getRecentCollections(6),
    getCollectionStats(),
    getItemStats(),
    getPinnedItems(),
    getRecentItems(10),
    getItemTypes(),
    getSidebarCollections(),
  ]);

  return (
    <>
      <Sidebar itemTypes={itemTypes} sidebarCollections={sidebarCollections} user={session?.user ?? null} />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Your developer knowledge hub</p>
          </div>

          <StatsCards
            totalItems={itemStats.totalItems}
            totalCollections={collectionStats.totalCollections}
            favoriteItems={itemStats.favoriteItems}
            favoriteCollections={collectionStats.favoriteCollections}
          />

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Collections</h2>
              <a
                href="/collections"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {recentCollections.map((col) => (
                <CollectionCard key={col.id} collection={col} />
              ))}
            </div>
          </section>

          <DashboardItems pinnedItems={pinnedItems} recentItems={recentItems} />
        </div>
      </main>
    </>
  );
}
