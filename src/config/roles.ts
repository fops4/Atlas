export const ROLES = {
    ADMIN: 'ADMIN',
    RAF: 'RAF',           // Responsable Administratif et Financier
    RH: 'RH',             // Ressources Humaines
    MANAGER: 'MANAGER',   // Manager de terrain
    STAFF: 'STAFF'        // Personnel permanent
} as const;

export type UserRole = keyof typeof ROLES;

export const PERMISSIONS = {
    // Hub Financier
    VIEW_LEDGER: ['ADMIN', 'RAF'],
    VALIDATE_PAYMENTS: ['ADMIN', 'RAF'],
    VIEW_BUDGETS: ['ADMIN', 'RAF'],
    CREATE_BUDGETS: ['ADMIN', 'RAF'],

    // RH
    MANAGE_STAFF: ['ADMIN', 'RH'],
    VIEW_PAYROLL: ['ADMIN', 'RH', 'RAF'],
    APPLY_SANCTIONS: ['ADMIN', 'RH'],

    // Opérations Terrain
    MANAGE_PARCELS: ['ADMIN', 'MANAGER'],
    CLOSE_TASKS: ['ADMIN', 'MANAGER'],
    VIEW_TASKS: ['ADMIN', 'MANAGER', 'STAFF'],

    // Logistique
    MANAGE_INVENTORY: ['ADMIN', 'MANAGER'],
    VIEW_INVENTORY: ['ADMIN', 'MANAGER', 'STAFF'],

    // Administration
    MANAGE_USERS: ['ADMIN'],
    VIEW_ANALYTICS: ['ADMIN', 'RAF']
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
