'use client';

import { useEffect, useState } from 'react';
import { Star, Pin, Copy, Pencil, Trash2, FolderOpen, Calendar } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getTypeIcon } from '@/lib/icons';
import { formatDate } from '@/lib/utils';
import type { ItemDetail } from '@/lib/db/items';

interface ItemDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

function DrawerSkeleton() {
  return (
    <div className="space-y-4 animate-pulse p-1">
      <div className="h-5 w-2/3 rounded bg-muted" />
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded bg-muted" />
        <div className="h-5 w-20 rounded bg-muted" />
      </div>
      <div className="h-8 w-full rounded bg-muted" />
      <Separator />
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-24 w-full rounded bg-muted" />
      </div>
    </div>
  );
}

export function ItemDrawer({ itemId, onClose }: ItemDrawerProps) {
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!itemId) {
      setItem(null);
      setError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setItem(null);
    setError(false);

    fetch(`/api/items/${itemId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load item');
        return r.json();
      })
      .then((data: ItemDetail) => {
        if (!cancelled) setItem(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [itemId]);

  const Icon = item ? getTypeIcon(item.itemType.icon) : null;

  function handleCopy() {
    if (!item?.content) return;
    navigator.clipboard.writeText(item.content);
  }

  return (
    <Sheet open={!!itemId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col gap-0 p-0">
        {loading && (
          <div className="p-6">
            <DrawerSkeleton />
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-center flex-1 p-6">
            <p className="text-sm text-muted-foreground">Failed to load item.</p>
          </div>
        )}

        {!loading && item && (
          <>
            <SheetHeader className="px-6 pt-6 pb-4 space-y-3">
              <div className="flex items-start gap-2 pr-6">
                {Icon && (
                  <Icon
                    className="h-4 w-4 mt-1 shrink-0"
                    style={{ color: item.itemType.color }}
                  />
                )}
                <SheetTitle className="text-left leading-snug">{item.title}</SheetTitle>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[11px] px-2 py-0.5 rounded font-medium"
                  style={{
                    backgroundColor: item.itemType.color + '20',
                    color: item.itemType.color,
                  }}
                >
                  {item.itemType.name}s
                </span>
                {item.language && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    {item.language}
                  </span>
                )}
              </div>
            </SheetHeader>

            {/* Action bar */}
            <div className="flex items-center gap-1 px-6 pb-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs"
                aria-label="Favorite"
              >
                <Star
                  className="h-4 w-4"
                  style={item.isFavorite ? { fill: '#facc15', color: '#facc15' } : undefined}
                />
                Favorite
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs" aria-label="Pin">
                <Pin className="h-4 w-4" />
                Pin
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs"
                aria-label="Copy"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs" aria-label="Edit">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            <div className="px-6 py-5 space-y-6 flex-1">
              {item.description && (
                <section>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Description
                  </p>
                  <p className="text-sm text-foreground/90">{item.description}</p>
                </section>
              )}

              {item.content && (
                <section>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Content
                  </p>
                  <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto whitespace-pre-wrap wrap-break-word">
                    {item.content}
                  </pre>
                </section>
              )}

              {item.url && (
                <section>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    URL
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline break-all"
                  >
                    {item.url}
                  </a>
                </section>
              )}

              {item.tags.length > 0 && (
                <section>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {item.collections.length > 0 && (
                <section>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Collections
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.collections.map((col) => (
                      <span
                        key={col.id}
                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        <FolderOpen className="h-3 w-3" />
                        {col.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Details
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created</span>
                    <span className="ml-auto">{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Updated</span>
                    <span className="ml-auto">{formatDate(item.updatedAt)}</span>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
