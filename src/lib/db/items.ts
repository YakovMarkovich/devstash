import { prisma } from '@/lib/prisma';

export interface ItemTypeWithCount {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

const TYPE_ORDER = ['snippet', 'prompt', 'command', 'note', 'file', 'image', 'link'];

export async function getItemTypes(): Promise<ItemTypeWithCount[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    include: {
      _count: { select: { items: true } },
    },
  });

  return types
    .map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      count: t._count.items,
    }))
    .sort((a, b) => {
      const ai = TYPE_ORDER.indexOf(a.name);
      const bi = TYPE_ORDER.indexOf(b.name);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
}

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
  createdAt: Date | string;
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

export interface ItemsByTypeResult {
  itemType: ItemTypeInfo;
  items: ItemWithType[];
}

export interface ItemDetail extends ItemWithType {
  content: string | null;
  contentType: string;
  url: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  language: string | null;
  collections: { id: string; name: string }[];
  updatedAt: Date | string;
}

export async function getItemDetail(id: string): Promise<ItemDetail | null> {
  const item = await prisma.item.findFirst({
    where: { id },
    include: {
      itemType: true,
      tags: true,
      collections: {
        include: { collection: { select: { id: true, name: true } } },
      },
    },
  });

  if (!item) return null;

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    content: item.content,
    contentType: item.contentType,
    url: item.url,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
    fileSize: item.fileSize,
    language: item.language,
    itemType: {
      id: item.itemType.id,
      name: item.itemType.name,
      icon: item.itemType.icon,
      color: item.itemType.color,
    },
    tags: item.tags.map((t) => t.name),
    collections: item.collections.map((ic) => ({
      id: ic.collection.id,
      name: ic.collection.name,
    })),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function getItemsByType(slug: string): Promise<ItemsByTypeResult | null> {
  const typeName = slug.slice(0, -1);

  const itemType = await prisma.itemType.findFirst({
    where: { name: { equals: typeName, mode: 'insensitive' } },
  });

  if (!itemType) return null;

  const items = await prisma.item.findMany({
    where: { itemTypeId: itemType.id },
    orderBy: { createdAt: 'desc' },
    include: {
      itemType: true,
      tags: true,
    },
  });

  return {
    itemType: {
      id: itemType.id,
      name: itemType.name,
      icon: itemType.icon,
      color: itemType.color,
    },
    items: items.map(mapItem),
  };
}

export interface CreateItemData {
  userId: string;
  itemTypeId: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
}

export async function createItem(data: CreateItemData): Promise<ItemWithType> {
  const item = await prisma.item.create({
    data: {
      userId: data.userId,
      itemTypeId: data.itemTypeId,
      title: data.title,
      description: data.description,
      content: data.content,
      url: data.url,
      language: data.language,
      tags: {
        connectOrCreate: data.tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: {
      itemType: true,
      tags: true,
    },
  });

  return mapItem(item);
}

export interface UpdateItemData {
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
}

export async function updateItem(id: string, data: UpdateItemData): Promise<ItemDetail | null> {
  const updated = await prisma.item.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      url: data.url,
      language: data.language,
      tags: {
        set: [],
        connectOrCreate: data.tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: {
      itemType: true,
      tags: true,
      collections: {
        include: { collection: { select: { id: true, name: true } } },
      },
    },
  });

  return {
    id: updated.id,
    title: updated.title,
    description: updated.description,
    isFavorite: updated.isFavorite,
    isPinned: updated.isPinned,
    content: updated.content,
    contentType: updated.contentType,
    url: updated.url,
    fileUrl: updated.fileUrl,
    fileName: updated.fileName,
    fileSize: updated.fileSize,
    language: updated.language,
    itemType: {
      id: updated.itemType.id,
      name: updated.itemType.name,
      icon: updated.itemType.icon,
      color: updated.itemType.color,
    },
    tags: updated.tags.map((t) => t.name),
    collections: updated.collections.map((ic) => ({
      id: ic.collection.id,
      name: ic.collection.name,
    })),
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}
