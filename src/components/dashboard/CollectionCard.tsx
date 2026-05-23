import Link from 'next/link';
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link as LinkIcon,
  File,
  Image as ImageIcon,
  Star,
  type LucideIcon,
} from 'lucide-react';
import type { CollectionWithTypes } from '@/lib/db/collections';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

interface CollectionCardProps {
  collection: CollectionWithTypes;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const borderColor = collection.dominantType?.color ?? 'transparent';

  return (
    <Link href={`/collections/${collection.id}`} className="block group">
      <div
        className="rounded-lg border border-border bg-card p-4 h-full hover:bg-accent/30 transition-colors"
        style={{ borderLeftColor: borderColor, borderLeftWidth: 3 }}
      >
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-sm truncate flex-1 pr-2">{collection.name}</h3>
          {collection.isFavorite && (
            <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-2">{collection.itemCount} items</p>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{collection.description}</p>
        <div className="flex items-center gap-1.5">
          {collection.types.map((type) => {
            const Icon = ICON_MAP[type.icon];
            return Icon ? (
              <Icon key={type.id} className="h-3.5 w-3.5" style={{ color: type.color }} />
            ) : null;
          })}
        </div>
      </div>
    </Link>
  );
}
