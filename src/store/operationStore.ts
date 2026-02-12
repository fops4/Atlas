import { create } from 'zustand';
import { parcels } from '../data/mockData';

export interface Parcel {
    id: string;
    name: string;
    area: number; // in hectares
    crop: string;
    status: 'ACTIVE' | 'FALLOW' | 'HARVEST_READY';
    location: { lat: number; lng: number };
}

export interface FarmTask {
    id: string;
    parcelId: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dueDate: string;
    assignedTo?: string; // Employee Name or ID
    cost?: number;
}

interface OperationState {
    parcels: Parcel[];
    tasks: FarmTask[];

    // Parcel Actions
    addParcel: (parcel: Omit<Parcel, 'id'>) => void;
    updateParcel: (id: string, updates: Partial<Parcel>) => void;
    deleteParcel: (id: string) => void;

    // Task Actions
    addTask: (task: Omit<FarmTask, 'id' | 'status'>) => void;
    updateTask: (id: string, updates: Partial<FarmTask>) => void;
    deleteTask: (id: string) => void;
}

export const useOperationStore = create<OperationState>((set) => ({
    parcels: parcels.map(p => ({
        id: p.id.toString(),
        name: p.name,
        area: p.area,
        crop: 'Cacao', // Default crop since mockData doesn't have this field
        status: 'ACTIVE' as const,
        location: { lat: p.lat, lng: p.lng }
    })),
    tasks: [], // Init empty or add mock tasks later if needed

    addParcel: (parcel) => set((state) => ({
        parcels: [...state.parcels, { ...parcel, id: `PAR-${Date.now()}` }]
    })),

    updateParcel: (id, updates) => set((state) => ({
        parcels: state.parcels.map(p => p.id === id ? { ...p, ...updates } : p)
    })),

    deleteParcel: (id) => set((state) => ({
        parcels: state.parcels.filter(p => p.id !== id)
    })),

    addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: `TSK-${Date.now()}`, status: 'TODO' }]
    })),

    updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    })),

    deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
    })),
}));
