import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Banknote, Coins, Users, Sprout, Truck, Wrench, LogOut, ChevronLeft, ChevronRight, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

const navigation = [
  { name: 'Vue d\'ensemble', href: '/', icon: LayoutDashboard },
  { name: 'Hub Financier', href: '/finance', icon: Banknote, roles: ['ADMIN', 'RAF'] },
  { name: 'Gestion Budgétaire', href: '/finance/budget', icon: Coins, roles: ['ADMIN', 'RAF'] },
  { name: 'Ressources Humaines', href: '/hr', icon: Users, roles: ['ADMIN', 'RH', 'RAF'] },
  { name: 'Exploitation Agricole', href: '/operations', icon: Sprout, roles: ['ADMIN', 'MANAGER'] },
  { name: 'Logistique & Stocks', href: '/logistics', icon: Truck, roles: ['ADMIN', 'MANAGER', 'STAFF'] },
  { name: 'Parc Technique', href: '/technical', icon: Wrench, roles: ['ADMIN'] },
  { name: 'Paramètres', href: '/settings', icon: SettingsIcon, roles: ['ADMIN'] },
];

export function Sidebar() {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const user = useAuthStore((state) => state.user);

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
          <div className={cn(
            "flex items-center gap-3 transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
          )}>
            <img 
              src="/artifacts/atlas_logo.png" 
              alt="ATLAS" 
              className="w-10 h-10 object-contain"
            />
            <h3 className="text-base font-bold text-red-500">
              ATLAS WHOLE SALE
            </h3>
          </div>
          {!isSidebarOpen && (
            <img 
              src="/artifacts/atlas_logo.png" 
              alt="ATLAS" 
              className="w-10 h-10 object-contain mx-auto"
            />
          )}
          <button 
            onClick={toggleSidebar}
            className={cn(
              "p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors",
              !isSidebarOpen && "hidden lg:block"
            )}
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Navigation principale">
          <ul className="space-y-1 px-3" role="list">
            {navigation.map((item) => {
              const allowedRoles = item.roles as string[] | undefined;
              const hasRole = !allowedRoles || (user && allowedRoles.includes(user.role));
              
              if (!hasRole) return null;

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
                    aria-label={item.name}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
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
            onClick={() => useAuthStore.getState().logout()}
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
