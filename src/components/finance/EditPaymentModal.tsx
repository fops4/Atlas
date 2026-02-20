import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useFinanceStore, PaymentRequest } from '../../store/financeStore';

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentRequest: PaymentRequest | null;
}

export const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ isOpen, onClose, paymentRequest }) => {
  const { updatePaymentRequest, budgets } = useFinanceStore();
  const [formData, setFormData] = useState({
    task: '',
    amount: 0,
    budgetId: ''
  });

  useEffect(() => {
    if (paymentRequest) {
      setFormData({
        task: paymentRequest.task,
        amount: paymentRequest.amount,
        budgetId: paymentRequest.budgetId || ''
      });
    }
  }, [paymentRequest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentRequest) {
      if (!formData.budgetId) {
        alert("Le budget est obligatoire.");
        return;
      }
      updatePaymentRequest(paymentRequest.id, {
        task: formData.task,
        amount: Number(formData.amount),
        budgetId: formData.budgetId
      });
      onClose();
    }
  };

  if (!paymentRequest) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier la Demande">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Description / Tâche</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
            value={formData.task}
            onChange={e => setFormData({ ...formData, task: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Montant (FCFA)</label>
          <input
            type="number"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm border p-2"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
          />
        </div>

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
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-brand-blue px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 sm:col-start-2 sm:text-sm"
          >
            Sauvegarder
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
