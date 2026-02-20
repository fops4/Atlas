import React from 'react';
import { cn } from '../../lib/utils';
import type { TaskStatus } from '../../types';

export type BudgetStatus = 'DRAFT' | 'VALIDATED' | 'OVER_BUDGET';

interface StatusBadgeProps {
  status: TaskStatus | 'ACTIVE' | 'PENDING' | 'INACTIVE' | BudgetStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'En attente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  IN_PROGRESS: {
    label: 'En cours',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  COMPLETED: {
    label: 'Terminé',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  PAYMENT_REQUESTED: {
    label: 'Paiement demandé',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  PAID: {
    label: 'Payé',
    className: 'bg-profit-100 text-profit-800 border-profit-200',
  },
  REJECTED: {
    label: 'Rejeté',
    className: 'bg-alert-100 text-alert-800 border-alert-200',
  },
  ACTIVE: {
    label: 'Actif',
    className: 'bg-profit-100 text-profit-800 border-profit-200',
  },
  INACTIVE: {
    label: 'Inactif',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  DRAFT: {
    label: 'Brouillon',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  VALIDATED: {
    label: 'Validé',
    className: 'bg-profit-100 text-profit-800 border-profit-200',
  },
  OVER_BUDGET: {
    label: 'Dépassement',
    className: 'bg-alert-100 text-alert-800 border-alert-200',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
