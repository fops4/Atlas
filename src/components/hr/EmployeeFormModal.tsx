import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useHrStore, Employee } from '../../store/hrStore';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ isOpen, onClose, employeeToEdit }) => {
  const { addEmployee, updateEmployee } = useHrStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    phone: '',
    baseSalary: ''
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        firstName: employeeToEdit.firstName,
        lastName: employeeToEdit.lastName,
        position: employeeToEdit.position,
        phone: employeeToEdit.phone,
        baseSalary: employeeToEdit.baseSalary.toString()
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        position: '',
        phone: '',
        baseSalary: ''
      });
    }
  }, [employeeToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (employeeToEdit) {
      updateEmployee(employeeToEdit.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        phone: formData.phone,
        baseSalary: Number(formData.baseSalary)
      });
    } else {
      addEmployee({
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        phone: formData.phone,
        baseSalary: Number(formData.baseSalary)
      });
    }
    
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={employeeToEdit ? "Modifier l'employé" : "Ajouter un employé"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Poste</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
            value={formData.position}
            onChange={e => setFormData({ ...formData, position: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salaire de base (FCFA)</label>
            <input
              type="number"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
              value={formData.baseSalary}
              onChange={e => setFormData({ ...formData, baseSalary: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-brand-blue px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 sm:col-start-2 sm:text-sm"
          >
            {employeeToEdit ? 'Mettre à jour' : 'Ajouter'}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            onClick={onClose}
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
};
