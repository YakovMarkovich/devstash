import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { UserAvatar } from '@/components/UserAvatar';
import { Separator } from '@/components/ui/separator';
import { getProfileUser, getProfileStats } from '@/lib/db/profile';
import { getItemTypes } from '@/lib/db/items';
import { getSidebarCollections } from '@/lib/db/collections';
import { getTypeIcon } from '@/lib/icons';
import { ChangePasswordForm } from './ChangePasswordForm';
import { DeleteAccountButton } from './DeleteAccountButton';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const userId = session.user.id;

  const [profileUser, stats, itemTypes, sidebarCollections] = await Promise.all([
    getProfileUser(userId),
    getProfileStats(userId),
    getItemTypes(),
    getSidebarCollections(),
  ]);

  if (!profileUser) redirect('/sign-in');

  const joinedDate = new Date(profileUser.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <Sidebar itemTypes={itemTypes} sidebarCollections={sidebarCollections} user={session.user} />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">Your account details and usage</p>
          </div>

          {/* User Info */}
          <section className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </h2>
            <div className="flex items-center gap-4">
              <UserAvatar
                name={profileUser.name ?? profileUser.email}
                image={profileUser.image}
                size="md"
                className="h-14 w-14 text-base"
              />
              <div className="space-y-0.5">
                <p className="font-semibold text-base">{profileUser.name ?? 'No name set'}</p>
                <p className="text-sm text-muted-foreground">{profileUser.email}</p>
                <p className="text-xs text-muted-foreground">Member since {joinedDate}</p>
              </div>
            </div>
          </section>

          {/* Usage Stats */}
          <section className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Usage
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md bg-muted/40 px-4 py-3">
                <p className="text-2xl font-bold">{stats.totalItems}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Total Items</p>
              </div>
              <div className="rounded-md bg-muted/40 px-4 py-3">
                <p className="text-2xl font-bold">{stats.totalCollections}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Collections</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                By Type
              </p>
              <div className="grid grid-cols-2 gap-2">
                {stats.typeBreakdown.map((type) => {
                  const Icon = getTypeIcon(type.icon);
                  return (
                    <div key={type.id} className="flex items-center gap-2.5">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded"
                        style={{ backgroundColor: type.color + '22', color: type.color }}
                      >
                        {Icon && <Icon className="h-3.5 w-3.5" />}
                      </span>
                      <span className="text-sm capitalize">{type.name}s</span>
                      <span className="ml-auto text-sm font-medium tabular-nums">{type.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Account Actions */}
          <section className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Account Actions
            </h2>
            <div className="space-y-3">
              {profileUser.hasPassword && <ChangePasswordForm />}
              <DeleteAccountButton />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
