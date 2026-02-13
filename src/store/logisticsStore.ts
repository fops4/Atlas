import { create } from 'zustand';
import { useFinanceStore } from './financeStore';

export interface RationItem {
    name: string;
    quantity: number;
    unit: string;
    unitPrice?: number;
}

export interface RationRequest {
    id: string;
    requestedBy: string;
    employeeId: string;
    date: string;
    items: RationItem[];
    totalAmount: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELIVERED';
    notes?: string;
    approvedBy?: string;
    approvedDate?: string;
    deliveredDate?: string;
    rejectionReason?: string;
    paymentRequestId?: string;
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

export const useLogisticsStore = create<LogisticsState>((set, get) => ({
    rationRequests: [
        {
            id: 'RAT-001',
            requestedBy: 'Jean Mbarga',
            employeeId: 'EMP-001',
            date: '2024-02-10',
            items: [
                { name: 'Riz', quantity: 50, unit: 'kg', unitPrice: 500 },
                { name: 'Haricots', quantity: 25, unit: 'kg', unitPrice: 800 },
                { name: 'Huile', quantity: 10, unit: 'L', unitPrice: 1500 }
            ],
            totalAmount: 60000,
            status: 'PENDING',
            notes: 'Expression du besoin pour l\'équipe de terrain'
        },
        {
            id: 'RAT-002',
            requestedBy: 'Marie Nkotto',
            employeeId: 'EMP-002',
            date: '2024-02-08',
            items: [
                { name: 'Riz', quantity: 30, unit: 'kg', unitPrice: 500 },
                { name: 'Poisson séché', quantity: 15, unit: 'kg', unitPrice: 2000 }
            ],
            totalAmount: 45000,
            status: 'APPROVED',
            notes: 'Expression du besoin hebdomadaire',
            approvedBy: 'Admin',
            approvedDate: '2024-02-09',
            paymentRequestId: 'PAY-RAT-002'
        },
        {
            id: 'RAT-003',
            requestedBy: 'Paul Essomba',
            employeeId: 'EMP-003',
            date: '2024-02-05',
            items: [
                { name: 'Riz', quantity: 40, unit: 'kg', unitPrice: 500 },
                { name: 'Huile', quantity: 8, unit: 'L', unitPrice: 1500 },
                { name: 'Sel', quantity: 5, unit: 'kg', unitPrice: 300 }
            ],
            totalAmount: 33500,
            status: 'DELIVERED',
            approvedBy: 'Admin',
            approvedDate: '2024-02-06',
            deliveredDate: '2024-02-07',
            paymentRequestId: 'PAY-RAT-003'
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

    approveRequest: (id, approvedBy) => {
        const request = get().rationRequests.find(r => r.id === id);
        if (!request) return;

        // Create payment request ID
        const paymentRequestId = `PAY-${id}`;

        // Create payment request in finance store
        const financeStore = useFinanceStore.getState();
        financeStore.submitRequest({
            task: `Expression du besoin - ${request.requestedBy}`,
            amount: request.totalAmount,
            requester: request.requestedBy,
            momo: '237XXXXXXXX', // Placeholder
            date: new Date().toISOString().split('T')[0],
            type: 'DEBIT',
            employeeId: request.employeeId
        });

        // Update ration request status
        set((state) => ({
            rationRequests: state.rationRequests.map(r =>
                r.id === id ? {
                    ...r,
                    status: 'APPROVED',
                    approvedBy,
                    approvedDate: new Date().toISOString().split('T')[0],
                    paymentRequestId
                } : r
            )
        }));
    },

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
