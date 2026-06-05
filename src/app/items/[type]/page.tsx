import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { ItemsClientWrapper } from '@/components/dashboard/ItemsClientWrapper';
import { getItemsByType, getItemTypes } from '@/lib/db/items';
import { getSidebarCollections } from '@/lib/db/collections';
import { getTypeIcon } from '@/lib/icons';

interface Props {
  params: Promise<{ type: string }>;
}

export default async function ItemsTypePage({ params }: Props) {
  const { type: slug } = await params;

  const [session, result, itemTypes, sidebarCollections] = await Promise.all([
    auth(),
    getItemsByType(slug),
    getItemTypes(),
    getSidebarCollections(),
  ]);

  if (!result) notFound();

  const { itemType, items } = result;
  const Icon = getTypeIcon(itemType.icon);

  return (
    <>
      <Sidebar itemTypes={itemTypes} sidebarCollections={sidebarCollections} user={session?.user ?? null} />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon className="h-6 w-6 shrink-0" style={{ color: itemType.color }} />
            )}
            <div>
              <h1 className="text-2xl font-bold capitalize">{itemType.name}s</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              {Icon && <Icon className="h-10 w-10 mb-4 text-muted-foreground/40" />}
              <p className="text-muted-foreground">No {itemType.name}s yet</p>
            </div>
          ) : (
            <ItemsClientWrapper
              items={items}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            />
          )}
        </div>
      </main>
    </>
  );
}
