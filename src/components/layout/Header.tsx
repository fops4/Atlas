import { useState, useEffect } from 'react';
import { Cloud, CloudOff, Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(3);
  const user = useAuthStore((state) => state.user);
  const { toggleSidebar } = useUIStore();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate pending items accumulation when offline
    const interval = setInterval(() => {
      if (!navigator.onLine) {
        setPendingSync(prev => prev + 1);
      }
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {isOnline ? (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-medium">
            <Cloud className="w-4 h-4" />
            <span className="hidden sm:inline">Connecté</span>
            {pendingSync > 0 && <span className="text-slate-500 ml-1 text-xs">({pendingSync})</span>}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full font-medium">
            <CloudOff className="w-4 h-4" />
            <span className="hidden sm:inline">Hors-ligne</span>
            <span className="bg-amber-100 px-1.5 rounded text-xs ml-1">{pendingSync}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <Link to="/profile" className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-200 hover:opacity-80 transition-opacity">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-900">
              {user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
            </p>
            <p className="text-xs text-slate-500">{user?.role || 'Rôle'}</p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <img 
              src={`https://ui-avatars.com/api/?name=${user ? `${user.firstName}+${user.lastName}` : 'User'}&background=0D8ABC&color=fff`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
