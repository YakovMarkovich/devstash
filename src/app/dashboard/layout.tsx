import { SidebarProvider } from '@/components/dashboard/SidebarContext';
import { TopBar } from '@/components/dashboard/TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-full min-h-screen bg-background text-foreground">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">{children}</div>
      </div>
    </SidebarProvider>
  );
}
