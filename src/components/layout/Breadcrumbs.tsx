import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeLabels: Record<string, string> = {
  '/': 'Tableau de bord',
  '/finance': 'Finance',
  '/hr': 'Ressources Humaines',
  '/operations': 'Opérations',
  '/logistics': 'Logistique',
  '/technical': 'Technique',
  '/settings': 'Paramètres',
  '/profile': 'Profil'
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/' }
  ];

  let currentPath = '';
  pathnames.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment;
    breadcrumbs.push({ label, path: currentPath });
  });

  return (
    <nav aria-label="Fil d'Ariane" className="mb-4">
      <ol className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;

          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {!isFirst && (
                <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
              )}
              
              {isLast ? (
                <span
                  className="font-medium text-slate-900"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className={cn(
                    "text-slate-600 hover:text-brand-blue transition-colors",
                    isFirst && "flex items-center gap-1"
                  )}
                >
                  {isFirst && <Home className="w-4 h-4" aria-hidden="true" />}
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
