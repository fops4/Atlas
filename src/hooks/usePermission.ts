import { useAuthStore } from '../store/authStore';
import { PERMISSIONS, UserRole, PermissionKey } from '../config/roles';

export const usePermission = () => {
    const { user } = useAuthStore();
    const userRole = user?.role as UserRole || 'STAFF';

    /**
     * Check if user has a specific permission
     */
    const hasPermission = (permission: PermissionKey): boolean => {
        const allowedRoles = PERMISSIONS[permission] as readonly string[];
        return allowedRoles.includes(userRole);
    };

    /**
     * Check if user has any of the provided permissions
     */
    const hasAnyPermission = (permissions: PermissionKey[]): boolean => {
        return permissions.some(p => hasPermission(p));
    };

    /**
     * Check if user has all of the provided permissions
     */
    const hasAllPermissions = (permissions: PermissionKey[]): boolean => {
        return permissions.every(p => hasPermission(p));
    };

    /**
     * Check if user has a specific role
     */
    const hasRole = (role: UserRole | UserRole[]): boolean => {
        if (Array.isArray(role)) {
            return role.includes(userRole);
        }
        return userRole === role;
    };

    return {
        userRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        isAdmin: userRole === 'ADMIN'
    };
};
