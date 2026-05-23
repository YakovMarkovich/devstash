import { prisma } from '@/lib/prisma';

export interface ItemTypeInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ItemWithType {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  itemType: ItemTypeInfo;
  tags: string[];
  createdAt: Date;
}

function mapItem(item: {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  itemType: { id: string; name: string; icon: string; color: string };
  tags: { name: string }[];
}): ItemWithType {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    itemType: {
      id: item.itemType.id,
      name: item.itemType.name,
      icon: item.itemType.icon,
      color: item.itemType.color,
    },
    tags: item.tags.map((t) => t.name),
    createdAt: item.createdAt,
  };
}

export async function getPinnedItems(): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { isPinned: true },
    orderBy: { updatedAt: 'desc' },
    include: {
      itemType: true,
      tags: true,
    },
  });

  return items.map(mapItem);
}

export async function getRecentItems(limit = 10): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      itemType: true,
      tags: true,
    },
  });

  return items.map(mapItem);
}
