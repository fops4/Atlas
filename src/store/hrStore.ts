import { create } from 'zustand';
import { employees } from '../data/mockData';

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    status: 'ACTIVE' | 'INACTIVE';
    phone: string;
    baseSalary: number;
}

interface HrState {
    employees: Employee[];
    selectedEmployeeId: string | null;

    selectEmployee: (id: string | null) => void;
    addEmployee: (employee: Omit<Employee, 'id' | 'status'>) => void;
    updateEmployee: (id: string, updates: Partial<Employee>) => void;
    archiveEmployee: (id: string) => void;
    unarchiveEmployee: (id: string) => void;
}

export const useHrStore = create<HrState>((set) => ({
    employees: employees as Employee[], // Initial state from mockData
    selectedEmployeeId: null,

    selectEmployee: (id) => set({ selectedEmployeeId: id }),

    addEmployee: (employee) => set((state) => ({
        employees: [
            {
                ...employee,
                id: `EMP-${Math.floor(Math.random() * 1000)}`,
                status: 'ACTIVE'
            },
            ...state.employees
        ]
    })),

    updateEmployee: (id, updates) => set((state) => ({
        employees: state.employees.map(emp =>
            emp.id === id ? { ...emp, ...updates } : emp
        )
    })),

    archiveEmployee: (id) => set((state) => ({
        employees: state.employees.map(emp =>
            emp.id === id ? { ...emp, status: 'INACTIVE' } : emp
        )
    })),

    unarchiveEmployee: (id) => set((state) => ({
        employees: state.employees.map(emp =>
            emp.id === id ? { ...emp, status: 'ACTIVE' } : emp
        )
    })),
}));
