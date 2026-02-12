import React from 'react';
import { cn } from '../../utils/format';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
}) => {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variants[variant],
        className
      )}
    />
  );
};

export const KPISkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <Skeleton className="h-4 w-32 mb-3" />
    <Skeleton className="h-8 w-24 mb-2" />
    <Skeleton className="h-3 w-16" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-12 flex-1" />
      </div>
    ))}
  </div>
);
