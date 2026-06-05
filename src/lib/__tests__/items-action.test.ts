import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    item: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/db/items', () => ({
  updateItem: vi.fn(),
}));

import { updateItem } from '@/actions/items';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateItem as updateItemInDb } from '@/lib/db/items';

const mockAuth = vi.mocked(auth);
const mockFindUnique = vi.mocked(prisma.item.findUnique);
const mockUpdateItemInDb = vi.mocked(updateItemInDb);

const SESSION = { user: { id: 'user-1' } };
const ITEM_OWNER = { userId: 'user-1' };

const VALID_INPUT = {
  title: 'Test title',
  description: null,
  content: 'some content',
  url: null,
  language: 'typescript',
  tags: ['react', 'hooks'],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('updateItem action', () => {
  it('returns unauthorized when no session', async () => {
    mockAuth.mockResolvedValue(null as never);

    const result = await updateItem('item-1', VALID_INPUT);
    expect(result).toEqual({ success: false, error: 'Unauthorized' });
  });

  it('returns error when title is empty', async () => {
    mockAuth.mockResolvedValue(SESSION as never);

    const result = await updateItem('item-1', { ...VALID_INPUT, title: '   ' });
    expect(result.success).toBe(false);
    expect((result as { success: false; error: string }).error).toMatch(/title/i);
  });

  it('returns error when item does not belong to user', async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue({ userId: 'other-user' } as never);

    const result = await updateItem('item-1', VALID_INPUT);
    expect(result).toEqual({ success: false, error: 'Item not found' });
  });

  it('returns error when item is not found', async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(null as never);

    const result = await updateItem('item-1', VALID_INPUT);
    expect(result).toEqual({ success: false, error: 'Item not found' });
  });

  it('calls db update and returns success', async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(ITEM_OWNER as never);
    const updated = { id: 'item-1', title: 'Test title' };
    mockUpdateItemInDb.mockResolvedValue(updated as never);

    const result = await updateItem('item-1', VALID_INPUT);
    expect(result).toEqual({ success: true, data: updated });
    expect(mockUpdateItemInDb).toHaveBeenCalledWith('item-1', {
      title: 'Test title',
      description: null,
      content: 'some content',
      url: null,
      language: 'typescript',
      tags: ['react', 'hooks'],
    });
  });

  it('trims whitespace from tags and filters empty strings', async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(ITEM_OWNER as never);
    mockUpdateItemInDb.mockResolvedValue({ id: 'item-1' } as never);

    await updateItem('item-1', { ...VALID_INPUT, tags: [' react ', '', '  hooks  '] });
    expect(mockUpdateItemInDb).toHaveBeenCalledWith(
      'item-1',
      expect.objectContaining({ tags: ['react', 'hooks'] }),
    );
  });

  it('returns error when url is invalid', async () => {
    mockAuth.mockResolvedValue(SESSION as never);

    const result = await updateItem('item-1', { ...VALID_INPUT, url: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('coerces empty url string to null', async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(ITEM_OWNER as never);
    mockUpdateItemInDb.mockResolvedValue({ id: 'item-1' } as never);

    await updateItem('item-1', { ...VALID_INPUT, url: '' });
    expect(mockUpdateItemInDb).toHaveBeenCalledWith(
      'item-1',
      expect.objectContaining({ url: null }),
    );
  });

  it('accepts a valid url', async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(ITEM_OWNER as never);
    mockUpdateItemInDb.mockResolvedValue({ id: 'item-1' } as never);

    const result = await updateItem('item-1', { ...VALID_INPUT, url: 'https://example.com' });
    expect(result.success).toBe(true);
    expect(mockUpdateItemInDb).toHaveBeenCalledWith(
      'item-1',
      expect.objectContaining({ url: 'https://example.com' }),
    );
  });

  it('coerces undefined optional fields to null for db call', async () => {
    mockAuth.mockResolvedValue(SESSION as never);
    mockFindUnique.mockResolvedValue(ITEM_OWNER as never);
    mockUpdateItemInDb.mockResolvedValue({ id: 'item-1' } as never);

    await updateItem('item-1', { title: 'Title only', url: null, tags: [] });
    expect(mockUpdateItemInDb).toHaveBeenCalledWith('item-1', {
      title: 'Title only',
      description: null,
      content: null,
      url: null,
      language: null,
      tags: [],
    });
  });
});
