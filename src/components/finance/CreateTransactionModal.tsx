import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useFinanceStore } from '../../store/financeStore';

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, submitRequest, budgets } = useFinanceStore();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'DEBIT',
    category: 'AUTRE',
    budgetId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.type === 'DEBIT') {
      if (!formData.budgetId) {
        alert("Le budget est obligatoire pour une dépense.");
        return;
      }
      // Debits go to Pending Queue for validation
      submitRequest({
        task: formData.description,
        amount: Number(formData.amount),
        requester: 'Admin (Manuel)',
        momo: 'N/A',
        date: formData.date,
        budgetId: formData.budgetId,
      });
    } else {
      // Credits go directly to Ledger
      addTransaction({
        date: formData.date,
        description: formData.description,
        amount: Number(formData.amount), // Positive for Credit
        type: 'CREDIT',
        category: formData.category
      });
    }

    onClose();
    setFormData({
      description: '',
      amount: '',
      type: 'DEBIT',
      category: 'AUTRE',
      budgetId: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Montant (FCFA)</label>
            <input
              type="number"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="DEBIT">Dépense (Débit)</option>
              <option value="CREDIT">Revenu (Crédit)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="AUTRE">Autre</option>
              <option value="RH">Ressources Humaines</option>
              <option value="INTRANT">Intrants</option>
              <option value="VENTE">Vente</option>
              <option value="LOGISTIQUE">Logistique</option>
            </select>
          </div>
        </div>

        {formData.type === 'DEBIT' && (
          <div>
            <label className="block text-sm font-medium text-brand-red">Budget Mensuel (Obligatoire)</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-brand-red shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
              value={formData.budgetId}
              onChange={e => setFormData({ ...formData, budgetId: e.target.value })}
            >
              <option value="">Sélectionner un budget...</option>
              {budgets.map(b => (
                <option key={b.id} value={b.id}>
                  {b.month} - {b.totalAmount.toLocaleString()} FCFA
                </option>
              ))}
            </select>
            {budgets.length === 0 && (
              <p className="text-xs text-brand-red mt-1">Aucun budget validé trouvé. Créez-en un d'abord.</p>
            )}
          </div>
        )}

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-brand-blue px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 sm:col-start-2 sm:text-sm"
          >
            Confirmer
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
