import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardPage() {
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-lg font-semibold">Main</h2>
      </main>
    </>
  );
}
