import { prisma } from '@/lib/prisma';

export interface CollectionTypeInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CollectionWithTypes {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  dominantType: CollectionTypeInfo | null;
  types: CollectionTypeInfo[];
  updatedAt: Date;
}

export async function getRecentCollections(limit = 6): Promise<CollectionWithTypes[]> {
  const collections = await prisma.collection.findMany({
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: {
      defaultType: true,
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    const typeCounts = new Map<string, { type: CollectionTypeInfo; count: number }>();

    for (const ic of col.items) {
      const t = ic.item.itemType;
      const entry = typeCounts.get(t.id);
      if (entry) {
        entry.count++;
      } else {
        typeCounts.set(t.id, { type: { id: t.id, name: t.name, icon: t.icon, color: t.color }, count: 1 });
      }
    }

    const sorted = [...typeCounts.values()].sort((a, b) => b.count - a.count);
    const dominantType = sorted[0]?.type ?? null;
    const types = sorted.map((e) => e.type);

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      dominantType,
      types,
      updatedAt: col.updatedAt,
    };
  });
}

export async function getCollectionStats() {
  const [totalCollections, favoriteCollections] = await Promise.all([
    prisma.collection.count(),
    prisma.collection.count({ where: { isFavorite: true } }),
  ]);

  return { totalCollections, favoriteCollections };
}

export async function getItemStats() {
  const [totalItems, favoriteItems] = await Promise.all([
    prisma.item.count(),
    prisma.item.count({ where: { isFavorite: true } }),
  ]);

  return { totalItems, favoriteItems };
}
