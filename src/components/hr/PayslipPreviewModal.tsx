import { X, Download, User, Briefcase, DollarSign } from 'lucide-react';
import { Employee } from '../../store/hrStore';
import { useFinanceStore } from '../../store/financeStore';

interface PayslipPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  month: string; // Format: YYYY-MM
}

export function PayslipPreviewModal({ isOpen, onClose, employee, month }: PayslipPreviewModalProps) {
  const { ledger, pendingPayments } = useFinanceStore();

  if (!isOpen) return null;

  // Calculate payslip data
  const monthName = new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  
  // Get all transactions for this employee in this month
  const monthTransactions = [
    ...ledger.filter(l => 
      l.employeeId === employee.id && 
      l.date.startsWith(month)
    ),
    ...pendingPayments.filter(p => 
      p.employeeId === employee.id && 
      p.date.startsWith(month)
    ).map(p => ({
      id: p.id,
      description: p.task,
      amount: p.type === 'DEBIT' ? -p.amount : p.amount,
      date: p.date,
      type: p.type || 'DEBIT',
      category: 'RH'
    }))
  ];

  const baseSalary = employee.baseSalary;
  const bonuses = monthTransactions.filter(t => t.amount < 0 && t.description.toLowerCase().includes('bonus')).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const sanctions = monthTransactions.filter(t => t.amount > 0 && t.description.toLowerCase().includes('sanction')).reduce((sum, t) => sum + t.amount, 0);
  const netSalary = baseSalary + bonuses - sanctions;

  const handleDownload = () => {
    alert(`Téléchargement de la fiche de paie pour ${employee.firstName} ${employee.lastName} - ${monthName}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-brand-blue to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">Fiche de Paie</h2>
              <p className="text-blue-100 text-sm">{monthName}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Employee Info */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Employé</p>
                  <p className="font-semibold text-slate-900">{employee.firstName} {employee.lastName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Poste</p>
                  <p className="font-semibold text-slate-900">{employee.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Salaire de Base</p>
                  <p className="font-semibold text-slate-900">{baseSalary.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Détails de la Rémunération</h3>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between text-xs font-semibold text-slate-600 uppercase">
                <span>Description</span>
                <span>Montant</span>
              </div>
              
              <div className="divide-y divide-slate-100">
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-slate-700">Salaire de Base</span>
                  <span className="font-semibold text-slate-900">{baseSalary.toLocaleString()} F</span>
                </div>
                
                {bonuses > 0 && (
                  <div className="px-4 py-3 flex justify-between items-center bg-green-50/50">
                    <span className="text-green-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Bonus
                    </span>
                    <span className="font-semibold text-green-700">+ {bonuses.toLocaleString()} F</span>
                  </div>
                )}
                
                {sanctions > 0 && (
                  <div className="px-4 py-3 flex justify-between items-center bg-red-50/50">
                    <span className="text-red-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Sanctions
                    </span>
                    <span className="font-semibold text-red-700">- {sanctions.toLocaleString()} F</span>
                  </div>
                )}
              </div>
              
              <div className="bg-brand-blue text-white px-4 py-4 flex justify-between items-center">
                <span className="font-bold text-lg">Salaire Net</span>
                <span className="font-bold text-2xl">{netSalary.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          {monthTransactions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Détails des Transactions</h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr className="text-xs text-slate-600 uppercase">
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Description</th>
                      <th className="px-3 py-2 text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {monthTransactions.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-600">{t.date}</td>
                        <td className="px-3 py-2 text-slate-700">{t.description}</td>
                        <td className={`px-3 py-2 text-right font-medium ${t.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {t.amount < 0 ? '+' : '-'} {Math.abs(t.amount).toLocaleString()} F
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button 
              onClick={handleDownload}
              className="flex-1 bg-brand-blue text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger PDF
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
