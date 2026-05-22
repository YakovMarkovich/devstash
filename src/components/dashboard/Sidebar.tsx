'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link as LinkIcon,
  File,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Star,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react';
import { mockItemTypes, mockCollections, mockItemCounts, mockUser } from '@/lib/mock-data';
import { useSidebar } from './SidebarContext';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

function getTypeSlug(name: string) {
  return name.toLowerCase() + 's';
}

function getItemCount(slug: string): number {
  return mockItemCounts[slug as keyof typeof mockItemCounts] ?? 0;
}

const favoriteCollections = mockCollections.filter((c) => c.isFavorite);
const recentCollections = mockCollections
  .filter((c) => !c.isFavorite)
  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  .slice(0, 3);

function getUserInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function SidebarContent() {
  const [typesOpen, setTypesOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-sidebar text-sidebar-foreground overflow-y-auto">
      {/* Types Section */}
      <div className="px-3 pt-4">
        <button
          onClick={() => setTypesOpen((v) => !v)}
          className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider rounded-md hover:bg-sidebar-accent transition-colors"
        >
          <span>Types</span>
          {typesOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {typesOpen && (
          <ul className="mt-1 space-y-0.5">
            {mockItemTypes.map((type) => {
              const Icon = ICON_MAP[type.icon];
              const slug = getTypeSlug(type.name);
              const count = getItemCount(slug);
              return (
                <li key={type.id}>
                  <Link
                    href={`/items/${slug}`}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-sidebar-accent transition-colors"
                  >
                    {Icon && (
                      <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
                    )}
                    <span className="flex-1 truncate">{type.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Collections Section */}
      <div className="px-3 mt-4">
        <button
          onClick={() => setCollectionsOpen((v) => !v)}
          className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider rounded-md hover:bg-sidebar-accent transition-colors"
        >
          <span>Collections</span>
          {collectionsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {collectionsOpen && (
          <div className="mt-1">
            <p className="px-2 py-1 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
              Favorites
            </p>
            <ul className="space-y-0.5">
              {favoriteCollections.map((col) => (
                <li key={col.id}>
                  <Link
                    href={`/collections/${col.id}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-sidebar-accent transition-colors"
                  >
                    <span className="flex-1 truncate">{col.name}</span>
                    <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                  </Link>
                </li>
              ))}
            </ul>

            <p className="px-2 py-1 mt-2 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
              All Collections
            </p>
            <ul className="space-y-0.5">
              {recentCollections.map((col) => (
                <li key={col.id}>
                  <Link
                    href={`/collections/${col.id}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-sidebar-accent transition-colors"
                  >
                    <span className="flex-1 truncate">{col.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{col.itemCount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* User Area */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getUserInitials(mockUser.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{mockUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
          </div>
          <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isOpen, isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border shrink-0 overflow-hidden transition-all duration-300',
          isOpen ? 'w-56' : 'w-0 border-r-0'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-border md:hidden transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-end p-2 bg-sidebar border-b border-sidebar-border">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}
