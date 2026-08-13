import { Sidebar } from './sidebar';
import { Header } from './header';
import RouteLoader from './route-loader';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <RouteLoader />
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
