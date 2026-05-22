import { Package, FolderOpen, Star, Heart } from 'lucide-react';

interface StatsCardsProps {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export function StatsCards({ totalItems, totalCollections, favoriteItems, favoriteCollections }: StatsCardsProps) {
  const stats = [
    { label: 'Total Items', value: totalItems, icon: Package, color: 'text-blue-500' },
    { label: 'Collections', value: totalCollections, icon: FolderOpen, color: 'text-purple-500' },
    { label: 'Favorite Items', value: favoriteItems, icon: Star, color: 'text-yellow-500' },
    { label: 'Favorite Collections', value: favoriteCollections, icon: Heart, color: 'text-pink-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
