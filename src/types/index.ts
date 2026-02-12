// User & Authentication Types
export type UserRole = 'ADMIN' | 'RAF' | 'RH' | 'MANAGER' | 'STAFF';

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  momoNumber?: string;
  omNumber?: string;
  createdAt: string;
}

// Task & Payment Types
export type TaskStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'PAYMENT_REQUESTED' 
  | 'PAID' 
  | 'REJECTED';

export interface Task {
  id: string;
  parcelId: string;
  parcelName: string;
  type: string;
  description: string;
  status: TaskStatus;
  assignedTo: string;
  assignedToName: string;
  createdAt: string;
  completedAt?: string;
  evidence?: Evidence;
  paymentInfo?: PaymentInfo;
  amount?: number;
}

export interface Evidence {
  photoUrl: string;
  videoUrl?: string;
  gpsLocation: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  isWithinPerimeter: boolean;
}

export interface PaymentInfo {
  beneficiaryName: string;
  beneficiaryPhone: string;
  amount: number;
  requestedAt: string;
  validatedAt?: string;
  validatedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

// Ledger Types
export interface LedgerEntry {
  id: string;
  transactionId: string;
  date: string;
  type: 'PAYMENT' | 'SALARY' | 'PURCHASE' | 'SALE';
  description: string;
  parcelId?: string;
  parcelName?: string;
  taskId?: string;
  amount: number;
  beneficiary: string;
  validatedBy: string;
  isImmutable: boolean;
}

// KPI Types
export interface KPI {
  label: string;
  value: number | string;
  unit: string;
  trend?: number; // Percentage change
  loading?: boolean;
}

// Parcel Types
export interface Parcel {
  id: string;
  name: string;
  area: number; // hectares
  status: 'HEALTHY' | 'ALERT' | 'HARVEST';
  gpsCoordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  crop?: string;
  manager: string;
}

// Stock Types
export interface StockItem {
  id: string;
  name: string;
  category: 'FERTILIZER' | 'SEED' | 'EQUIPMENT' | 'OTHER';
  quantity: number;
  unit: string;
  reorderLevel: number;
  lastRestocked: string;
}

// HR Types
export interface Employee extends User {
  position: string;
  hireDate: string;
  salary: number;
  bonuses: Array<{
    id: string;
    date: string;
    amount: number;
    reason: string;
    evidenceUrl?: string;
  }>;
  sanctions: Array<{
    id: string;
    date: string;
    amount: number;
    reason: string;
    evidenceUrl: string;
  }>;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  actual: number;
  budget: number;
}
