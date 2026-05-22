import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link as LinkIcon,
  File,
  Image as ImageIcon,
  Star,
  Pin,
  type LucideIcon,
} from 'lucide-react';
import { mockItemTypes } from '@/lib/mock-data';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

interface Item {
  id: string;
  title: string;
  description: string;
  isFavorite: boolean;
  isPinned: boolean;
  itemTypeId: string;
  tags: string[];
  createdAt: Date;
}

interface ItemCardProps {
  item: Item;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ItemCard({ item }: ItemCardProps) {
  const itemType = mockItemTypes.find((t) => t.id === item.itemTypeId);
  const Icon = itemType ? ICON_MAP[itemType.icon] : null;

  return (
    <div
      className="flex gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors cursor-pointer border-l-[3px]"
      style={itemType ? { borderLeftColor: itemType.color } : {}}
    >
      <div className="shrink-0 mt-0.5">
        {Icon && itemType && (
          <Icon className="h-4 w-4" style={{ color: itemType.color }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h4 className="text-sm font-medium truncate">{item.title}</h4>
          {item.isFavorite && (
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
          )}
          {item.isPinned && <Pin className="h-3 w-3 text-muted-foreground shrink-0" />}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate mb-1.5">{item.description}</p>
        )}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="shrink-0 text-xs text-muted-foreground pt-0.5">
        {formatDate(item.createdAt)}
      </div>
    </div>
  );
}
