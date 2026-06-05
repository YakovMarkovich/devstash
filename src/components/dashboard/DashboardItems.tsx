'use client';

import { useState } from 'react';
import { Pin } from 'lucide-react';
import { ItemCard } from '@/components/dashboard/ItemCard';
import { ItemDrawer } from '@/components/dashboard/ItemDrawer';
import type { ItemWithType } from '@/lib/db/items';

interface DashboardItemsProps {
  pinnedItems: ItemWithType[];
  recentItems: ItemWithType[];
}

export function DashboardItems({ pinnedItems, recentItems }: DashboardItemsProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <>
      {pinnedItems.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Pin className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold">Pinned</h2>
          </div>
          <div className="space-y-2">
            {pinnedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItemId(item.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-semibold mb-4">Recent Items</h2>
        <div className="space-y-2">
          {recentItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItemId(item.id)}
            />
          ))}
        </div>
      </section>

      <ItemDrawer
        itemId={selectedItemId}
        onClose={() => setSelectedItemId(null)}
      />
    </>
  );
}
