import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex items-center gap-4 border-b border-border px-6 py-3 bg-background">
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500 text-white font-bold text-sm select-none">
          s
        </div>
        <span className="font-semibold text-foreground text-sm">DevStash</span>
      </div>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-9"
        />
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        New Item
      </Button>
    </header>
  );
}
