'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Star,
  Settings,
  X,
} from 'lucide-react';
import type { ItemTypeWithCount } from '@/lib/db/items';
import type { SidebarCollection } from '@/lib/db/collections';
import { useSidebar } from './SidebarContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getTypeIcon } from '@/lib/icons';

const PRO_TYPES = new Set(['file', 'image']);

function getTypeSlug(name: string) {
  return name.toLowerCase() + 's';
}

interface SidebarContentProps {
  itemTypes: ItemTypeWithCount[];
  sidebarCollections: SidebarCollection[];
}

function SidebarContent({ itemTypes, sidebarCollections }: SidebarContentProps) {
  const [typesOpen, setTypesOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  const favoriteCollections = sidebarCollections.filter((c) => c.isFavorite);
  const recentCollections = sidebarCollections.filter((c) => !c.isFavorite).slice(0, 5);

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
            {itemTypes.map((type) => {
              const Icon = getTypeIcon(type.icon);
              const slug = getTypeSlug(type.name);
              return (
                <li key={type.id}>
                  <Link
                    href={`/items/${slug}`}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm hover:bg-sidebar-accent transition-colors"
                  >
                    {Icon && (
                      <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
                    )}
                    <span className="flex-1 truncate capitalize">{type.name}</span>
                    {PRO_TYPES.has(type.name) ? (
                      <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 shrink-0">PRO</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground tabular-nums">{type.count}</span>
                    )}
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
            {favoriteCollections.length > 0 && (
              <>
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
              </>
            )}

            {recentCollections.length > 0 && (
              <>
                <p className="px-2 py-1 mt-2 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                  Recent
                </p>
                <ul className="space-y-0.5">
                  {recentCollections.map((col) => (
                    <li key={col.id}>
                      <Link
                        href={`/collections/${col.id}`}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-sidebar-accent transition-colors"
                      >
                        <span className="flex-1 truncate">{col.name}</span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          <span className="text-xs text-muted-foreground tabular-nums">{col.itemCount}</span>
                          {col.dominantTypeColor && (
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: col.dominantTypeColor }}
                            />
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <Link
              href="/collections"
              className="flex items-center px-2 py-1.5 mt-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            >
              View all collections
            </Link>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* User Area */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            DS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Demo User</p>
            <p className="text-xs text-muted-foreground truncate">demo@devstash.io</p>
          </div>
          <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  itemTypes: ItemTypeWithCount[];
  sidebarCollections: SidebarCollection[];
}

export function Sidebar({ itemTypes, sidebarCollections }: SidebarProps) {
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
        <SidebarContent itemTypes={itemTypes} sidebarCollections={sidebarCollections} />
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
        <SidebarContent itemTypes={itemTypes} sidebarCollections={sidebarCollections} />
      </aside>
    </>
  );
}
