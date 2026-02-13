import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'border-slate-200 border-t-brand-blue rounded-full animate-spin',
          sizeClasses[size]
        )}
        role="status"
        aria-label="Chargement en cours"
      >
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-600">Chargement de la page...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ text = 'Chargement...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <LoadingSpinner size="sm" />
      <span className="text-sm text-slate-600">{text}</span>
    </div>
  );
}
