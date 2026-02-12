import { create } from 'zustand';
import { ledgerData, paymentRequests } from '../data/mockData';

// Define explicit types
export interface LedgerEntry {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: string;
    category: string;
    parcelId?: string;
    parcelName?: string;
    beneficiary?: string;
    validatedBy?: string;
    isImmutable?: boolean;
    transactionId?: string;
    employeeId?: string;
}

export interface PaymentRequest {
    id: string;
    task: string;
    amount: number;
    requester: string;
    momo: string;
    status: string;
    date: string;
    type?: 'DEBIT' | 'CREDIT';
    employeeId?: string;
    evidence?: {
        photo: string;
        lat: number;
        lng: number;
        timestamp: string;
    };
}

interface FinanceState {
    ledger: LedgerEntry[];
    pendingPayments: PaymentRequest[];

    validatePayment: (paymentId: string) => void;
    rejectPayment: (paymentId: string, reason: string) => void;
    addTransaction: (transaction: Omit<LedgerEntry, 'id'>) => void;
    submitRequest: (request: Omit<PaymentRequest, 'id' | 'status'> & { evidence?: PaymentRequest['evidence'] }) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
    ledger: ledgerData as LedgerEntry[],
    pendingPayments: paymentRequests,

    validatePayment: (paymentId) => set((state) => {
        const payment = state.pendingPayments.find(p => p.id === paymentId);
        if (!payment) return state;

        const newEntry: LedgerEntry = {
            id: `TX-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description: payment.task,
            amount: payment.type === 'CREDIT' ? payment.amount : -payment.amount,
            type: payment.type || 'DEBIT',
            category: 'RH',
            beneficiary: payment.requester,
            employeeId: payment.employeeId,
        };

        return {
            pendingPayments: state.pendingPayments.filter(p => p.id !== paymentId),
            ledger: [newEntry, ...state.ledger]
        };
    }),

    rejectPayment: (paymentId, reason) => set((state) => {
        console.log(`Payment ${paymentId} rejected: ${reason}`);
        return {
            pendingPayments: state.pendingPayments.filter(p => p.id !== paymentId)
        };
    }),

    addTransaction: (transaction) => set((state) => ({
        ledger: [{ ...transaction, id: `TX-${Date.now()}` }, ...state.ledger]
    })),

    submitRequest: (request) => set((state) => ({
        pendingPayments: [...state.pendingPayments, {
            ...request,
            id: `REQ-${Date.now()}`,
            status: 'PAYMENT_REQUESTED',
            evidence: request.evidence || {
                photo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
                lat: 0,
                lng: 0,
                timestamp: new Date().toISOString()
            }
        }]
    })),
}));
