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
    budgetId?: string; // Link to budget
    type?: 'DEBIT' | 'CREDIT';
    employeeId?: string;
    evidence?: {
        photo: string;
        lat: number;
        lng: number;
        timestamp: string;
    };
}

export interface Budget {
    id: string;
    month: string; // YYYY-MM
    categories: {
        labor: number;
        inputs: number;
        rations: number;
        maintenance: number;
        overhead: number;
    };
    totalAmount: number;
    status: 'DRAFT' | 'VALIDATED' | 'OVER_BUDGET';
    createdAt: string;
}

export interface IncomeEntry {
    id: string;
    date: string;
    amount: number;
    source: 'CAPITAL' | 'LOAN' | 'GRANT' | 'OTHER';
    description: string;
    evidenceUrl?: string;
}

export interface SaleEntry {
    id: string;
    date: string;
    product: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    client: string;
    paymentMode: 'CASH' | 'MOMO' | 'TRANSFER';
    transactionId?: string;
}

export interface OutboxItem {
    id: string;
    type: 'BUDGET' | 'INCOME' | 'SALE';
    data: any;
    timestamp: string;
}

interface FinanceState {
    ledger: LedgerEntry[];
    pendingPayments: PaymentRequest[];
    budgets: Budget[];
    incomeEntries: IncomeEntry[];
    saleEntries: SaleEntry[];
    outbox: OutboxItem[];
    isOnline: boolean;

    validatePayment: (paymentId: string) => void;
    rejectPayment: (paymentId: string, reason: string) => void;
    updatePaymentRequest: (paymentId: string, updates: Partial<PaymentRequest>) => void;
    addTransaction: (transaction: Omit<LedgerEntry, 'id'>) => void;
    submitRequest: (request: Omit<PaymentRequest, 'id' | 'status'> & { evidence?: PaymentRequest['evidence'] }) => void;

    // Budget Actions
    createBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'status'>) => void;

    // Income Actions
    recordIncome: (income: Omit<IncomeEntry, 'id'>) => void;

    // Sale Actions
    recordSale: (sale: Omit<SaleEntry, 'id' | 'totalAmount'>) => void;

    // Offline Actions
    setOnlineStatus: (status: boolean) => void;
    syncOutbox: () => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
    ledger: ledgerData as LedgerEntry[],
    pendingPayments: paymentRequests,
    budgets: [
        {
            id: 'BGT-MOCK-1',
            month: '2024-02',
            categories: {
                labor: 500000,
                inputs: 200000,
                rations: 150000,
                maintenance: 100000,
                overhead: 50000
            },
            totalAmount: 1000000,
            status: 'VALIDATED',
            createdAt: new Date().toISOString()
        }
    ],
    incomeEntries: [],
    saleEntries: [],
    outbox: [],
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,

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

    updatePaymentRequest: (paymentId, updates) => set((state) => ({
        pendingPayments: state.pendingPayments.map(p => p.id === paymentId ? { ...p, ...updates } : p)
    })),

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

    createBudget: (budgetData) => {
        const { isOnline } = get();
        const newBudget: Budget = {
            ...budgetData,
            id: `BGT-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'VALIDATED'
        };

        if (!isOnline) {
            set((state) => ({
                outbox: [...state.outbox, {
                    id: `OUT-${Date.now()}`,
                    type: 'BUDGET',
                    data: newBudget,
                    timestamp: new Date().toISOString()
                }]
            }));
            return;
        }

        set((state) => ({
            budgets: [newBudget, ...state.budgets]
        }));
    },

    recordIncome: (incomeData) => {
        const { isOnline, addTransaction } = get();
        const newIncome: IncomeEntry = {
            ...incomeData,
            id: `INC-${Date.now()}`
        };

        if (!isOnline) {
            set((state) => ({
                outbox: [...state.outbox, {
                    id: `OUT-${Date.now()}`,
                    type: 'INCOME',
                    data: newIncome,
                    timestamp: new Date().toISOString()
                }]
            }));
            return;
        }

        set((state) => ({
            incomeEntries: [newIncome, ...state.incomeEntries]
        }));

        // Add to Ledger
        addTransaction({
            date: newIncome.date,
            description: `Entrée de fonds: ${newIncome.description}`,
            amount: newIncome.amount,
            type: 'CREDIT',
            category: 'FINANCE',
            beneficiary: newIncome.source,
            isImmutable: true
        });
    },

    recordSale: (saleData) => {
        const { isOnline, addTransaction } = get();
        const totalAmount = saleData.quantity * saleData.unitPrice;
        const newSale: SaleEntry = {
            ...saleData,
            id: `SALE-${Date.now()}`,
            totalAmount
        };

        if (!isOnline) {
            set((state) => ({
                outbox: [...state.outbox, {
                    id: `OUT-${Date.now()}`,
                    type: 'SALE',
                    data: newSale,
                    timestamp: new Date().toISOString()
                }]
            }));
            return;
        }

        set((state) => ({
            saleEntries: [newSale, ...state.saleEntries]
        }));

        // Add to Ledger
        addTransaction({
            date: newSale.date,
            description: `Vente: ${newSale.product} (${newSale.quantity} unités)`,
            amount: totalAmount,
            type: 'CREDIT',
            category: 'VENTE',
            beneficiary: newSale.client,
            isImmutable: true
        });
    },

    setOnlineStatus: (status) => {
        const wasOffline = !get().isOnline;
        set({ isOnline: status });
        if (status && wasOffline) {
            get().syncOutbox();
        }
    },

    syncOutbox: () => {
        const { outbox, recordIncome, recordSale, createBudget } = get();
        if (outbox.length === 0) return;

        outbox.forEach(item => {
            if (item.type === 'BUDGET') createBudget(item.data);
            if (item.type === 'INCOME') recordIncome(item.data);
            if (item.type === 'SALE') recordSale(item.data);
        });

        set({ outbox: [] });
    }
}));
