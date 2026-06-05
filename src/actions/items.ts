'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateItem as updateItemInDb } from '@/lib/db/items';
import type { ItemDetail } from '@/lib/db/items';

const updateItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.union([z.url(), z.literal(''), z.null()]).optional().transform((v) => v || null),
  language: z.string().nullable().optional(),
  tags: z
    .array(z.string())
    .transform((arr) => arr.map((t) => t.trim()).filter(Boolean))
    .default([]),
});

type UpdateItemInput = z.input<typeof updateItemSchema>;

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function updateItem(
  itemId: string,
  raw: UpdateItemInput,
): Promise<ActionResult<ItemDetail>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = updateItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { userId: true },
  });

  if (!item || item.userId !== session.user.id) {
    return { success: false, error: 'Item not found' };
  }

  const { title, description, content, url, language, tags } = parsed.data;

  const updated = await updateItemInDb(itemId, {
    title,
    description: description ?? null,
    content: content ?? null,
    url: url ?? null,
    language: language ?? null,
    tags,
  });

  if (!updated) {
    return { success: false, error: 'Update failed' };
  }

  return { success: true, data: updated };
}
