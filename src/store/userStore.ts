import { create } from 'zustand';

export type AccessLevel = 'NONE' | 'USER' | 'ADMIN';

export interface PageAccess {
    dashboard: AccessLevel;
    finance: AccessLevel;
    hr: AccessLevel;
    operations: AccessLevel;
    logistics: AccessLevel;
    technical: AccessLevel;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
    status: 'ACTIVE' | 'ARCHIVED';
    access: PageAccess;
    createdAt: string;
}

interface UserState {
    users: User[];
    currentUser: User | null;

    addUser: (user: Omit<User, 'id' | 'createdAt' | 'status'>) => void;
    updateUser: (id: string, updates: Partial<User>) => void;
    archiveUser: (id: string) => void;
    unarchiveUser: (id: string) => void;
    resetPassword: (id: string, newPassword: string) => void;
    setCurrentUser: (user: User) => void;
}



export const useUserStore = create<UserState>((set) => ({
    users: [
        {
            id: '1',
            username: 'admin',
            email: 'admin@atlas.cm',
            role: 'ADMIN',
            status: 'ACTIVE',
            access: {
                dashboard: 'ADMIN',
                finance: 'ADMIN',
                hr: 'ADMIN',
                operations: 'ADMIN',
                logistics: 'ADMIN',
                technical: 'ADMIN'
            },
            createdAt: '2024-01-01'
        }
    ],
    currentUser: {
        id: '1',
        username: 'admin',
        email: 'admin@atlas.cm',
        role: 'ADMIN',
        status: 'ACTIVE',
        access: {
            dashboard: 'ADMIN',
            finance: 'ADMIN',
            hr: 'ADMIN',
            operations: 'ADMIN',
            logistics: 'ADMIN',
            technical: 'ADMIN'
        },
        createdAt: '2024-01-01'
    },

    addUser: (user) => set((state) => ({
        users: [...state.users, {
            ...user,
            id: `USR-${Date.now()}`,
            status: 'ACTIVE',
            createdAt: new Date().toISOString().split('T')[0]
        }]
    })),

    updateUser: (id, updates) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
    })),

    archiveUser: (id) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, status: 'ARCHIVED' } : u)
    })),

    unarchiveUser: (id) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, status: 'ACTIVE' } : u)
    })),

    resetPassword: (id, newPassword) => set((state) => {
        // In a real app, this would hash the password and send to API
        console.log(`Password reset for user ${id}: ${newPassword}`);
        return state; // Password is not stored in frontend
    }),

    setCurrentUser: (user) => set({ currentUser: user })
}));
