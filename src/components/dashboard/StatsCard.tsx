import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'alert' | 'warning';
}

export function StatsCard({ title, value, trend, trendUp, icon: Icon, variant = 'default' }: StatsCardProps) {
  const variants = {
    default: "bg-white text-slate-900",
    success: "bg-brand-green/10 text-brand-green",
    alert: "bg-brand-red/10 text-brand-red",
    warning: "bg-orange-50 text-orange-600",
  };
  
  const iconVariants = {
    default: "bg-brand-blue/10 text-brand-blue",
    success: "bg-brand-green/10 text-brand-green",
    alert: "bg-brand-red/10 text-brand-red",
    warning: "bg-orange-100 text-orange-600",
  };

  return (
    <div className={cn("rounded-xl p-6 shadow-sm border", variants[variant], variant === 'default' ? "border-slate-100" : "border-opacity-50")}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={cn("p-3 rounded-lg", iconVariants[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={cn(
            "font-medium",
            trendUp ? "text-brand-green" : "text-brand-red"
          )}>
            {trend}
          </span>
          <span className="text-slate-400 ml-2">vs mois dernier</span>
        </div>
      )}
    </div>
  );
}
