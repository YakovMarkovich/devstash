'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CodeEditor } from '@/components/dashboard/CodeEditor';
import { createItem } from '@/actions/items';

const TYPES = [
  { name: 'snippet', label: 'Snippet', color: '#3b82f6' },
  { name: 'prompt', label: 'Prompt', color: '#8b5cf6' },
  { name: 'command', label: 'Command', color: '#f97316' },
  { name: 'note', label: 'Note', color: '#fde047' },
  { name: 'link', label: 'Link', color: '#10b981' },
] as const;

type CreatableType = (typeof TYPES)[number]['name'];

const TEXT_TYPES = new Set<CreatableType>(['snippet', 'prompt', 'command', 'note']);
const LANGUAGE_TYPES = new Set<CreatableType>(['snippet', 'command']);
const CODE_TYPES = new Set<CreatableType>(['snippet', 'command']);

interface FormState {
  title: string;
  description: string;
  content: string;
  url: string;
  language: string;
  tags: string;
}

const emptyForm: FormState = {
  title: '',
  description: '',
  content: '',
  url: '',
  language: '',
  tags: '',
};

export function NewItemDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CreatableType>('snippet');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const showContent = TEXT_TYPES.has(selectedType);
  const showLanguage = LANGUAGE_TYPES.has(selectedType);
  const showCodeEditor = CODE_TYPES.has(selectedType);
  const showUrl = selectedType === 'link';

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setSelectedType('snippet');
    setForm(emptyForm);
  }

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) reset();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (showUrl && !form.url.trim()) {
      toast.error('URL is required for link items');
      return;
    }

    setSubmitting(true);

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await createItem({
      typeName: selectedType,
      title: form.title,
      description: form.description || null,
      content: form.content || null,
      url: form.url || null,
      language: form.language || null,
      tags,
    });

    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Item created');
    setOpen(false);
    reset();
    router.refresh();
  }

  const selectedTypeConfig = TYPES.find((t) => t.name === selectedType)!;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4 mr-2" />
        New Item
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Type selector */}
          <div className="flex gap-1.5 flex-wrap">
            {TYPES.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setSelectedType(t.name)}
                className="text-xs px-3 py-1 rounded-full border transition-colors"
                style={
                  selectedType === t.name
                    ? { backgroundColor: t.color + '25', borderColor: t.color, color: t.color }
                    : undefined
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="new-item-title">Title *</Label>
            <Input
              id="new-item-title"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Item title"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="new-item-description">Description</Label>
            <Input
              id="new-item-description"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Optional description"
            />
          </div>

          {/* Content — text types */}
          {showContent && (
            <div className="space-y-1.5">
              <Label>Content</Label>
              {showCodeEditor ? (
                <CodeEditor
                  value={form.content}
                  onChange={(v) => setField('content', v)}
                  language={form.language}
                />
              ) : (
                <Textarea
                  id="new-item-content"
                  value={form.content}
                  onChange={(e) => setField('content', e.target.value)}
                  placeholder="Content"
                  className="font-mono text-xs min-h-28"
                  rows={5}
                />
              )}
            </div>
          )}

          {/* Language — snippet/command */}
          {showLanguage && (
            <div className="space-y-1.5">
              <Label htmlFor="new-item-language">Language</Label>
              <Input
                id="new-item-language"
                value={form.language}
                onChange={(e) => setField('language', e.target.value)}
                placeholder="e.g. typescript, bash"
              />
            </div>
          )}

          {/* URL — link type */}
          {showUrl && (
            <div className="space-y-1.5">
              <Label htmlFor="new-item-url">URL *</Label>
              <Input
                id="new-item-url"
                value={form.url}
                onChange={(e) => setField('url', e.target.value)}
                placeholder="https://..."
                type="url"
                required
              />
            </div>
          )}

          {/* Tags */}
          <div className="space-y-1.5">
            <Label htmlFor="new-item-tags">Tags</Label>
            <Input
              id="new-item-tags"
              value={form.tags}
              onChange={(e) => setField('tags', e.target.value)}
              placeholder="react, hooks, typescript"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={submitting || !form.title.trim()}
              style={
                !submitting && form.title.trim()
                  ? {
                      backgroundColor: selectedTypeConfig.color,
                      borderColor: selectedTypeConfig.color,
                    }
                  : undefined
              }
            >
              {submitting ? 'Creating…' : `Create ${selectedTypeConfig.label}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
