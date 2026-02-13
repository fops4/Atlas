import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../lib/utils';
import { NotificationContainer } from '../ui/Notification';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function Layout() {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className="bg-slate-50 min-h-screen">
      <Sidebar />
      <main 
        className={cn(
          "min-h-screen flex flex-col transition-all duration-300",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <Header />
        <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </div>
        <Footer />
      </main>
      <NotificationContainer />
      <ConfirmDialog />
    </div>
  );
}
