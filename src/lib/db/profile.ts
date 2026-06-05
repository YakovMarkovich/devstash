import { prisma } from '@/lib/prisma';

export interface ProfileStats {
  totalItems: number;
  totalCollections: number;
  typeBreakdown: {
    id: string;
    name: string;
    icon: string;
    color: string;
    count: number;
  }[];
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const [totalItems, totalCollections, itemGroups, itemTypes] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.item.groupBy({
      by: ['itemTypeId'],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.itemType.findMany({
      where: { isSystem: true },
      select: { id: true, name: true, icon: true, color: true },
    }),
  ]);

  const countMap = new Map(itemGroups.map((g) => [g.itemTypeId, g._count._all]));

  const TYPE_ORDER = ['snippet', 'prompt', 'command', 'note', 'link', 'file', 'image'];
  const typeBreakdown = itemTypes
    .map((t) => ({ ...t, count: countMap.get(t.id) ?? 0 }))
    .sort((a, b) => {
      const ai = TYPE_ORDER.indexOf(a.name);
      const bi = TYPE_ORDER.indexOf(b.name);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

  return { totalItems, totalCollections, typeBreakdown };
}

export interface ProfileUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  createdAt: Date;
  hasPassword: boolean;
}

export async function getProfileUser(userId: string): Promise<ProfileUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, image: true, createdAt: true, password: true },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    createdAt: user.createdAt,
    hasPassword: user.password !== null,
  };
}
