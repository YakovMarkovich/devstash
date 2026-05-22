'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, PanelLeft, Search } from 'lucide-react';
import { useSidebar } from './SidebarContext';

export function TopBar() {
  const { toggle, isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <header className="flex items-center gap-4 border-b border-border px-4 py-3 bg-background shrink-0">
      <button
        onClick={toggle}
        className="hidden md:flex p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => setMobileOpen(!isMobileOpen)}
        className="flex md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500 text-white font-bold text-sm select-none">
          S
        </div>
        <span className="font-semibold text-foreground text-sm">DevStash</span>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9" />
      </div>

      <Button>
        <Plus className="h-4 w-4 mr-2" />
        New Item
      </Button>
    </header>
  );
}
