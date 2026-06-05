'use client';

import { useState } from 'react';
import { ItemCard } from '@/components/dashboard/ItemCard';
import { ItemDrawer } from '@/components/dashboard/ItemDrawer';
import type { ItemWithType } from '@/lib/db/items';

interface ItemsClientWrapperProps {
  items: ItemWithType[];
  className?: string;
}

export function ItemsClientWrapper({ items, className }: ItemsClientWrapperProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <>
      <div className={className}>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItemId(item.id)}
          />
        ))}
      </div>

      <ItemDrawer
        itemId={selectedItemId}
        onClose={() => setSelectedItemId(null)}
      />
    </>
  );
}
