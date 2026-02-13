import { create } from 'zustand';

export interface RationItem {
    name: string;
    quantity: number;
    unit: string;
}

export interface RationRequest {
    id: string;
    requestedBy: string;
    employeeId: string;
    date: string;
    items: RationItem[];
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELIVERED';
    notes?: string;
    approvedBy?: string;
    approvedDate?: string;
    deliveredDate?: string;
    rejectionReason?: string;
}

interface LogisticsState {
    rationRequests: RationRequest[];

    addRationRequest: (request: Omit<RationRequest, 'id' | 'status'>) => void;
    updateRationRequest: (id: string, updates: Partial<RationRequest>) => void;
    deleteRationRequest: (id: string) => void;
    approveRequest: (id: string, approvedBy: string) => void;
    rejectRequest: (id: string, reason: string) => void;
    markAsDelivered: (id: string) => void;
}

export const useLogisticsStore = create<LogisticsState>((set) => ({
    rationRequests: [
        {
            id: 'RAT-001',
            requestedBy: 'Jean Mbarga',
            employeeId: 'EMP-001',
            date: '2024-02-10',
            items: [
                { name: 'Riz', quantity: 50, unit: 'kg' },
                { name: 'Haricots', quantity: 25, unit: 'kg' },
                { name: 'Huile', quantity: 10, unit: 'L' }
            ],
            status: 'PENDING',
            notes: 'Rations pour l\'équipe de terrain'
        },
        {
            id: 'RAT-002',
            requestedBy: 'Marie Nkotto',
            employeeId: 'EMP-002',
            date: '2024-02-08',
            items: [
                { name: 'Riz', quantity: 30, unit: 'kg' },
                { name: 'Poisson séché', quantity: 15, unit: 'kg' }
            ],
            status: 'APPROVED',
            notes: 'Rations hebdomadaires',
            approvedBy: 'Admin',
            approvedDate: '2024-02-09'
        },
        {
            id: 'RAT-003',
            requestedBy: 'Paul Essomba',
            employeeId: 'EMP-003',
            date: '2024-02-05',
            items: [
                { name: 'Riz', quantity: 40, unit: 'kg' },
                { name: 'Huile', quantity: 8, unit: 'L' },
                { name: 'Sel', quantity: 5, unit: 'kg' }
            ],
            status: 'DELIVERED',
            approvedBy: 'Admin',
            approvedDate: '2024-02-06',
            deliveredDate: '2024-02-07'
        }
    ],

    addRationRequest: (request) => set((state) => ({
        rationRequests: [...state.rationRequests, {
            ...request,
            id: `RAT-${Date.now()}`,
            status: 'PENDING'
        }]
    })),

    updateRationRequest: (id, updates) => set((state) => ({
        rationRequests: state.rationRequests.map(r =>
            r.id === id ? { ...r, ...updates } : r
        )
    })),

    deleteRationRequest: (id) => set((state) => ({
        rationRequests: state.rationRequests.filter(r => r.id !== id)
    })),

    approveRequest: (id, approvedBy) => set((state) => ({
        rationRequests: state.rationRequests.map(r =>
            r.id === id ? {
                ...r,
                status: 'APPROVED',
                approvedBy,
                approvedDate: new Date().toISOString().split('T')[0]
            } : r
        )
    })),

    rejectRequest: (id, reason) => set((state) => ({
        rationRequests: state.rationRequests.map(r =>
            r.id === id ? {
                ...r,
                status: 'REJECTED',
                rejectionReason: reason
            } : r
        )
    })),

    markAsDelivered: (id) => set((state) => ({
        rationRequests: state.rationRequests.map(r =>
            r.id === id ? {
                ...r,
                status: 'DELIVERED',
                deliveredDate: new Date().toISOString().split('T')[0]
            } : r
        )
    }))
}));
