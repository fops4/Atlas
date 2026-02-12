import { useState } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Employee } from '../../store/hrStore';
import { useFinanceStore } from '../../store/financeStore';

interface PayrollRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployees: Employee[];
  onSuccess: () => void;
}

export function PayrollRunModal({ isOpen, onClose, selectedEmployees, onSuccess }: PayrollRunModalProps) {
  const { submitRequest, pendingPayments, ledger } = useFinanceStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = selectedEmployees.reduce((sum, emp) => sum + emp.baseSalary, 0);

  const handleRunPayroll = async () => {
    // Check for existing payments for this month
    const alreadyPaidEmployees = selectedEmployees.filter(emp => {
      const alreadyPending = pendingPayments.some(p => 
        p.employeeId === emp.id && 
        p.task.includes(`Salaire ${selectedMonth}`)
      );
      const alreadyLedger = ledger.some(l => 
        l.employeeId === emp.id && 
        l.description.includes(`Salaire ${selectedMonth}`)
      );
      return alreadyPending || alreadyLedger;
    });

    if (alreadyPaidEmployees.length > 0) {
      alert(`Attention ! Les employés suivants ont déjà une paie en cours ou validée pour ${selectedMonth} :\n` + 
            alreadyPaidEmployees.map(e => `- ${e.firstName} ${e.lastName}`).join('\n') +
            `\n\nVeuillez les désélectionner avant de continuer.`);
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    selectedEmployees.forEach(emp => {
      submitRequest({
        task: `Salaire ${selectedMonth} - ${emp.firstName} ${emp.lastName} (${emp.position})`,
        amount: emp.baseSalary,
        requester: 'RH System (Payroll)',
        momo: emp.phone,
        date: new Date().toISOString().split('T')[0],
        type: 'DEBIT',
        employeeId: emp.id,
        evidence: {
            photo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
            lat: 0,
            lng: 0,
            timestamp: new Date().toISOString()
        }
      });
    });

    setIsProcessing(false);
    onSuccess();
    onClose();
    alert(`${selectedEmployees.length} fiches de paie générées et envoyées en validation.`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Traitement de la Paie">
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Confirmation du traitement</p>
            <p>Vous êtes sur le point de générer les demandes de paiement de salaire pour <strong>{selectedEmployees.length} employés</strong>.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Période de Paie</label>
          <input 
            type="month" 
            className="block w-full border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue p-2 border"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-[200px] overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2 flex justify-between">
            <span>Employé</span>
            <span>Salaire Base</span>
          </div>
          <div className="space-y-2">
            {selectedEmployees.map(emp => (
              <div key={emp.id} className="flex justify-between items-center text-sm">
                <span className="text-slate-700">{emp.firstName} {emp.lastName}</span>
                <span className="font-medium text-slate-900">{emp.baseSalary.toLocaleString()} F</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-sm font-medium text-slate-500">Total estimé</span>
          <span className="text-xl font-bold text-brand-blue">{totalAmount.toLocaleString()} FCFA</span>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleRunPayroll}
            disabled={isProcessing}
            className="flex-1 py-2.5 bg-brand-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm flex justify-center items-center gap-2"
          >
            {isProcessing ? (
               <span className="animate-pulse">Traitement...</span>
            ) : (
               <>
                 <CheckCircle className="w-4 h-4" /> Confirmer & Payer
               </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
