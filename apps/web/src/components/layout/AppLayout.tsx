import { Sidebar } from "./Sidebar";
import { DataSourceBanner } from "./DataSourceBanner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <DataSourceBanner />
        {children}
      </main>
    </div>
  );
}
