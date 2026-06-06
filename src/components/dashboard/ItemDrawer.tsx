'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Pin, Copy, Pencil, Trash2, FolderOpen, Calendar, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CodeEditor } from '@/components/dashboard/CodeEditor';
import { MarkdownEditor } from '@/components/dashboard/MarkdownEditor';
import { getTypeIcon } from '@/lib/icons';
import { formatDate } from '@/lib/utils';
import { updateItem, deleteItem } from '@/actions/items';
import type { ItemDetail } from '@/lib/db/items';

interface ItemDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

interface EditState {
  title: string;
  description: string;
  content: string;
  url: string;
  language: string;
  tags: string;
}

function toEditState(item: ItemDetail): EditState {
  return {
    title: item.title,
    description: item.description ?? '',
    content: item.content ?? '',
    url: item.url ?? '',
    language: item.language ?? '',
    tags: item.tags.join(', '),
  };
}

const TEXT_TYPES = new Set(['snippet', 'prompt', 'command', 'note']);
const LANGUAGE_TYPES = new Set(['snippet', 'command']);
const CODE_TYPES = new Set(['snippet', 'command']);
const MARKDOWN_TYPES = new Set(['prompt', 'note']);

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
  const router = useRouter();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<EditState>({
    title: '',
    description: '',
    content: '',
    url: '',
    language: '',
    tags: '',
  });

  useEffect(() => {
    if (!itemId) {
      setItem(null);
      setError(false);
      setIsEditing(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setItem(null);
    setError(false);
    setIsEditing(false);

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
  const typeName = item?.itemType.name ?? '';
  const showContent = TEXT_TYPES.has(typeName);
  const showLanguage = LANGUAGE_TYPES.has(typeName);
  const showCodeEditor = CODE_TYPES.has(typeName);
  const showMarkdownEditor = MARKDOWN_TYPES.has(typeName);
  const showUrl = typeName === 'link';

  function handleCopy() {
    if (!item?.content) return;
    navigator.clipboard.writeText(item.content);
    toast.success('Copied to clipboard');
  }

  function startEditing() {
    if (!item) return;
    setForm(toEditState(item));
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  async function handleSave() {
    if (!item || !itemId) return;
    setSaving(true);

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await updateItem(itemId, {
      title: form.title,
      description: form.description || null,
      content: form.content || null,
      url: form.url || null,
      language: form.language || null,
      tags,
    });

    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setItem(result.data);
    setIsEditing(false);
    toast.success('Item updated');
    router.refresh();
  }

  async function handleDelete() {
    if (!itemId) return;
    setDeleting(true);
    const result = await deleteItem(itemId);
    setDeleting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Item deleted');
    onClose();
    router.refresh();
  }

  function setField<K extends keyof EditState>(key: K, value: EditState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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
                {isEditing ? (
                  <Input
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    placeholder="Title"
                    className="text-base font-semibold"
                  />
                ) : (
                  <SheetTitle className="text-left leading-snug">{item.title}</SheetTitle>
                )}
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
                {!isEditing && item.language && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    {item.language}
                  </span>
                )}
              </div>
            </SheetHeader>

            {/* Action bar */}
            <div className="flex items-center gap-1 px-6 pb-4">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={handleSave}
                    disabled={saving || !form.title.trim()}
                  >
                    <Check className="h-4 w-4" />
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={cancelEditing}
                    disabled={saving}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs"
                    aria-label="Edit"
                    onClick={startEditing}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <div className="flex-1" />
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          aria-label="Delete"
                          disabled={deleting}
                        />
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete item?</AlertDialogTitle>
                        <AlertDialogDescription>
                          &ldquo;{item.title}&rdquo; will be permanently deleted. This cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={handleDelete}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>

            <Separator />

            <div className="px-6 py-5 space-y-6 flex-1">
              {/* Description */}
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Description
                </p>
                {isEditing ? (
                  <Textarea
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                    placeholder="Optional description"
                    rows={2}
                  />
                ) : (
                  item.description && (
                    <p className="text-sm text-foreground/90">{item.description}</p>
                  )
                )}
              </section>

              {/* Content — text types only */}
              {showContent && (
                <section>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Content
                  </p>
                  {showCodeEditor ? (
                    <CodeEditor
                      value={isEditing ? form.content : (item.content ?? '')}
                      onChange={(v) => setField('content', v)}
                      language={isEditing ? form.language : (item.language ?? undefined)}
                      readOnly={!isEditing}
                    />
                  ) : showMarkdownEditor ? (
                    <MarkdownEditor
                      value={isEditing ? form.content : (item.content ?? '')}
                      onChange={(v) => setField('content', v)}
                      readOnly={!isEditing}
                    />
                  ) : (
                    item.content && (
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap">{item.content}</p>
                    )
                  )}
                </section>
              )}

              {/* Language — snippet/command only */}
              {isEditing && showLanguage && (
                <section>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Language
                  </p>
                  <Input
                    value={form.language}
                    onChange={(e) => setField('language', e.target.value)}
                    placeholder="e.g. typescript, bash"
                  />
                </section>
              )}

              {/* URL — link type only */}
              {(showUrl || (isEditing && showUrl)) && (
                <section>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    URL
                  </p>
                  {isEditing ? (
                    <Input
                      value={form.url}
                      onChange={(e) => setField('url', e.target.value)}
                      placeholder="https://..."
                      type="url"
                    />
                  ) : (
                    item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline break-all"
                      >
                        {item.url}
                      </a>
                    )
                  )}
                </section>
              )}

              {/* Tags */}
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Tags
                </p>
                {isEditing ? (
                  <Input
                    value={form.tags}
                    onChange={(e) => setField('tags', e.target.value)}
                    placeholder="react, hooks, typescript"
                  />
                ) : (
                  item.tags.length > 0 && (
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
                  )
                )}
              </section>

              {/* Collections — view only */}
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

              {/* Dates — view only */}
              {!isEditing && (
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
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
