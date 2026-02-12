import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Users, Sprout, Truck, Wrench, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/uiStore';

const navigation = [
  { name: 'Vue d\'ensemble', href: '/', icon: LayoutDashboard },
  { name: 'Hub Financier', href: '/finance', icon: Wallet },
  { name: 'Ressources Humaines', href: '/hr', icon: Users },
  { name: 'Exploitation Agricole', href: '/operations', icon: Sprout },
  { name: 'Logistique & Stocks', href: '/logistics', icon: Truck },
  { name: 'Parc Technique', href: '/technical', icon: Wrench },
];

export function Sidebar() {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      <div 
        className={cn(
          "flex flex-col bg-slate-900 border-r border-slate-800 text-white h-screen fixed left-0 top-0 z-30 transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20 -translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800 h-20">
          <h1 className={cn(
            "text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
          )}>
            ATLAS
          </h1>
          <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group overflow-hidden",
                      isActive 
                        ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                    title={!isSidebarOpen ? item.name : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className={cn(
                      "whitespace-nowrap transition-opacity duration-300",
                      isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                    )}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all overflow-hidden",
              !isSidebarOpen && "justify-center"
            )}
            title={!isSidebarOpen ? "Déconnexion" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={cn(
              "whitespace-nowrap transition-opacity duration-300",
              isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
            )}>
              Déconnexion
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
