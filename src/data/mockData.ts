export const kpiData = {
    totalCost: 125000000, // FCFA
    grossMargin: 32.5, // %
    rejectionRate: 4.8, // %
};

// Budget data for multiple years (2025, 2026, 2027)
export const budgetData = {
    2025: [
        { month: 'Jan', budget: 12000000, actual: 11500000 },
        { month: 'Fév', budget: 12000000, actual: 12800000 },
        { month: 'Mar', budget: 15000000, actual: 14200000 },
        { month: 'Avr', budget: 15000000, actual: 16000000 },
        { month: 'Mai', budget: 18000000, actual: 17500000 },
        { month: 'Juin', budget: 18000000, actual: 18200000 },
        { month: 'Juil', budget: 18000000, actual: 18500000 },
        { month: 'Août', budget: 15000000, actual: 14800000 },
        { month: 'Sep', budget: 12000000, actual: 11200000 },
        { month: 'Oct', budget: 12000000, actual: 12500000 },
        { month: 'Nov', budget: 15000000, actual: 16000000 },
        { month: 'Déc', budget: 20000000, actual: 19500000 },
    ],
    2026: [
        { month: 'Jan', budget: 13000000, actual: 12500000 },
        { month: 'Fév', budget: 13000000, actual: 13200000 },
        { month: 'Mar', budget: 16000000, actual: 15800000 },
        { month: 'Avr', budget: 16000000, actual: 16200000 },
        { month: 'Mai', budget: 19000000, actual: 18500000 },
        { month: 'Juin', budget: 19000000, actual: 19100000 },
        { month: 'Juil', budget: 19000000, actual: 18800000 },
        { month: 'Août', budget: 16000000, actual: 15500000 },
        { month: 'Sep', budget: 13000000, actual: 12800000 },
        { month: 'Oct', budget: 13000000, actual: 13500000 },
        { month: 'Nov', budget: 16000000, actual: 15800000 },
        { month: 'Déc', budget: 21000000, actual: 20500000 },
    ],
    2027: [
        { month: 'Jan', budget: 14000000, actual: 0 },
        { month: 'Fév', budget: 14000000, actual: 0 },
        { month: 'Mar', budget: 17000000, actual: 0 },
        { month: 'Avr', budget: 17000000, actual: 0 },
        { month: 'Mai', budget: 20000000, actual: 0 },
        { month: 'Juin', budget: 20000000, actual: 0 },
        { month: 'Juil', budget: 20000000, actual: 0 },
        { month: 'Août', budget: 17000000, actual: 0 },
        { month: 'Sep', budget: 14000000, actual: 0 },
        { month: 'Oct', budget: 14000000, actual: 0 },
        { month: 'Nov', budget: 17000000, actual: 0 },
        { month: 'Déc', budget: 22000000, actual: 0 },
    ]
};

export const parcels = [
    { id: 1, name: 'Parcelle A1', status: 'HEALTHY', lat: 4.0511, lng: 9.7085, area: 15 }, // Douala region approx
    { id: 2, name: 'Parcelle A2', status: 'ALERT', lat: 4.0531, lng: 9.7105, area: 12 },
    { id: 3, name: 'Parcelle B1', status: 'HARVEST', lat: 4.0491, lng: 9.7065, area: 20 },
];

export const paymentRequests = [
    {
        id: 'T-101',
        task: 'Désherbage Parcelle A1',
        amount: 15000,
        requester: 'Jean Michel',
        momo: '699 00 00 01',
        status: 'PAYMENT_REQUESTED',
        date: '2023-11-15',
        evidence: {
            photo: 'https://images.unsplash.com/photo-1589923188900-a3da252777b7?w=500&q=80', // Farming task placeholder
            lat: 4.0511,
            lng: 9.7085,
            timestamp: '2023-11-15T10:30:00'
        }
    },
    {
        id: 'T-102',
        task: 'Récolte Cacao Zone B',
        amount: 45000,
        requester: 'Paul Biya (Homonyme)',
        momo: '655 12 34 56',
        status: 'PAYMENT_REQUESTED',
        date: '2023-11-16',
        evidence: {
            photo: 'https://images.unsplash.com/photo-1620052086303-3e74a62e0717?w=500&q=80', // Cocoa pod placeholder
            lat: 4.0491,
            lng: 9.7065,
            timestamp: '2023-11-16T14:15:00'
        }
    },
];

export const ledgerData = [
    { id: 'TX-999', date: '2023-11-10', description: 'Paiement Salaires Octobre', amount: -2500000, type: 'DEBIT', category: 'RH' },
    { id: 'TX-998', date: '2023-11-12', description: 'Vente Cacao Lot #45', amount: 12000000, type: 'CREDIT', category: 'VENTE' },
    { id: 'TX-997', date: '2023-11-14', description: 'Achat Engrais NPK', amount: -450000, type: 'DEBIT', category: 'INTRANT' },
];

export const employees = [
    { id: 'EMP-001', firstName: 'Jean', lastName: 'Michel', position: 'Chef d\'équipe', status: 'ACTIVE', phone: '699 00 00 01', baseSalary: 150000 },
    { id: 'EMP-002', firstName: 'Pierre', lastName: 'Ndam', position: 'Ouvrier', status: 'ACTIVE', phone: '677 11 22 33', baseSalary: 80000 },
    { id: 'EMP-003', firstName: 'Marie', lastName: 'Kenfack', position: 'Ouvrier', status: 'INACTIVE', phone: '655 44 55 66', baseSalary: 80000 },
];

export const payrollHistory = [
    { id: 'PAY-11-001', employeeId: 'EMP-001', month: 'Novembre 2023', base: 150000, bonus: 5000, sanction: 0, total: 155000, status: 'PAID' },
    { id: 'PAY-10-001', employeeId: 'EMP-001', month: 'Octobre 2023', base: 150000, bonus: 0, sanction: -2000, total: 148000, status: 'PAID' },
    { id: 'PAY-11-001', employeeId: 'EMP-001', month: 'Novembre 2023', base: 150000, bonus: 5000, sanction: 0, total: 155000, status: 'PAID' },
    { id: 'PAY-10-001', employeeId: 'EMP-001', month: 'Octobre 2023', base: 150000, bonus: 0, sanction: -2000, total: 148000, status: 'PAID' },
    { id: 'PAY-11-002', employeeId: 'EMP-002', month: 'Novembre 2023', base: 80000, bonus: 0, sanction: 0, total: 80000, status: 'PENDING' },
];

export const activeTasks = [
    { id: 'TSK-201', title: 'Nettoyage Sous-bois', parcel: 'Parcelle A1', status: 'IN_PROGRESS', assignee: 'Équipe A', dueDate: '2023-11-20' },
    { id: 'TSK-202', title: 'Fermentation Cacao', parcel: 'Zone Traitement', status: 'PENDING', assignee: 'Équipe B', dueDate: '2023-11-21' },
    { id: 'TSK-203', title: 'Séchage', parcel: 'Séchoir Solaire', status: 'IN_PROGRESS', assignee: 'Équipe C', dueDate: '2023-11-22' },
];

export const inventory = [
    { id: 'INV-001', name: 'Engrais NPK 20-10-10', quantity: 45, unit: 'Sacs (50kg)', minThreshold: 10, status: 'OK' },
    { id: 'INV-002', name: 'Fongicide Cuivre', quantity: 5, unit: 'Bidons (5L)', minThreshold: 8, status: 'LOW' },
    { id: 'INV-003', name: 'Machettes', quantity: 50, unit: 'Unités', minThreshold: 20, status: 'OK' },
    { id: 'INV-004', name: 'Bottes de sécurité', quantity: 12, unit: 'Paires', minThreshold: 15, status: 'LOW' },
];
