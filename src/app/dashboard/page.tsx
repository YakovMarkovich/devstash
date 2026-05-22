export default function DashboardPage() {
  return (
    <>
      <aside className="w-64 border-r border-border p-6 shrink-0">
        <h2 className="text-lg font-semibold">Sidebar</h2>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-lg font-semibold">Main</h2>
      </main>
    </>
  );
}
