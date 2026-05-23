import { Pin } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { CollectionCard } from '@/components/dashboard/CollectionCard';
import { ItemCard } from '@/components/dashboard/ItemCard';
import { mockItems, mockItemCounts } from '@/lib/mock-data';
import { getRecentCollections, getCollectionStats, getItemStats } from '@/lib/db/collections';

const pinnedItems = mockItems.filter((i) => i.isPinned);
const recentItems = [...mockItems]
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  .slice(0, 10);

export default async function DashboardPage() {
  const [recentCollections, collectionStats, itemStats] = await Promise.all([
    getRecentCollections(6),
    getCollectionStats(),
    getItemStats(),
  ]);

  const totalItems = itemStats.totalItems || Object.values(mockItemCounts).reduce((sum, n) => sum + n, 0);

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Your developer knowledge hub</p>
          </div>

          <StatsCards
            totalItems={totalItems}
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

          {pinnedItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Pin className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold">Pinned</h2>
              </div>
              <div className="space-y-2">
                {pinnedItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="font-semibold mb-4">Recent Items</h2>
            <div className="space-y-2">
              {recentItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
