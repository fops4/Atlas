import React from 'react';
import { usePermission } from '../../hooks/usePermission';
import { UserRole, PermissionKey } from '../../config/roles';

interface RestrictedProps {
  children: React.ReactNode;
  to?: UserRole | UserRole[];
  permission?: PermissionKey | PermissionKey[];
  fallback?: React.ReactNode;
}

/**
 * Guard component to restrict content visibility based on roles or permissions
 */
export const Restricted: React.FC<RestrictedProps> = ({ 
  children, 
  to, 
  permission, 
  fallback = null 
}) => {
  const { hasRole, hasPermission, hasAnyPermission } = usePermission();

  let isAllowed = true;

  if (to) {
    isAllowed = hasRole(to);
  }

  if (isAllowed && permission) {
    if (Array.isArray(permission)) {
      isAllowed = hasAnyPermission(permission);
    } else {
      isAllowed = hasPermission(permission);
    }
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
