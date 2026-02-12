import { useState } from 'react';
import { PaymentQueue } from '../components/finance/PaymentQueue';
import { LedgerTable } from '../components/finance/LedgerTable';
import { CreateTransactionModal } from '../components/finance/CreateTransactionModal';
import { PlusCircle } from 'lucide-react';

export default function FinancialHub() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Hub Financier</h1>
          <p className="text-slate-500">Validation des paiements et suivi de trésorerie</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Nouvelle Transaction
        </button>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">File d'attente des paiements</h2>
        <PaymentQueue />
      </section>

      <section>
        <LedgerTable />
      </section>

      <CreateTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
