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
  const groups = await prisma.collection.groupBy({
    by: ['isFavorite'],
    _count: { _all: true },
  });
  const totalCollections = groups.reduce((sum, g) => sum + g._count._all, 0);
  const favoriteCollections = groups.find((g) => g.isFavorite)?._count._all ?? 0;
  return { totalCollections, favoriteCollections };
}

export interface SidebarCollection {
  id: string;
  name: string;
  isFavorite: boolean;
  itemCount: number;
  dominantTypeColor: string | null;
}

export async function getSidebarCollections(): Promise<SidebarCollection[]> {
  const collections = await prisma.collection.findMany({
    orderBy: [{ isFavorite: 'desc' }, { updatedAt: 'desc' }],
    include: {
      items: {
        include: {
          item: {
            include: { itemType: { select: { color: true } } },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    const typeCounts = new Map<string, { color: string; count: number }>();
    for (const ic of col.items) {
      const { color } = ic.item.itemType;
      const entry = typeCounts.get(color);
      if (entry) entry.count++;
      else typeCounts.set(color, { color, count: 1 });
    }
    const sorted = [...typeCounts.values()].sort((a, b) => b.count - a.count);
    const dominantTypeColor = sorted[0]?.color ?? null;

    return {
      id: col.id,
      name: col.name,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      dominantTypeColor,
    };
  });
}

export async function getItemStats() {
  const groups = await prisma.item.groupBy({
    by: ['isFavorite'],
    _count: { _all: true },
  });
  const totalItems = groups.reduce((sum, g) => sum + g._count._all, 0);
  const favoriteItems = groups.find((g) => g.isFavorite)?._count._all ?? 0;
  return { totalItems, favoriteItems };
}
