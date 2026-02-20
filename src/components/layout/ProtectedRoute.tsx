import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePermission } from '../../hooks/usePermission';
import { UserRole } from '../../config/roles';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, token, user } = useAuthStore();
  const { hasRole } = usePermission();
  const location = useLocation();

  // Basic authentication check
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Pending activation check
  if (user?.status === 'PENDING' && location.pathname !== '/pending') {
    return <Navigate to="/pending" replace />;
  }

  // Role-based authorization check
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
