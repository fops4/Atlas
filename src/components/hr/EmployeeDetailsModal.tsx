import { useState, useRef } from 'react';
import { Upload, AlertTriangle, PartyPopper, CheckCircle, History, Download, Eye } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';
import { useFinanceStore } from '../../store/financeStore';
import { Employee } from '../../store/hrStore';
import { PayslipPreviewModal } from './PayslipPreviewModal';

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export function EmployeeDetailsModal({ isOpen, onClose, employee }: EmployeeDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'ACTIONS' | 'HISTORY'>('ACTIONS');
  const { submitRequest, ledger, pendingPayments } = useFinanceStore();
  
  // Sanction Form State
  const [type, setType] = useState<'BONUS' | 'SANCTION'>('SANCTION');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Payslip Preview State
  const [isPayslipPreviewOpen, setIsPayslipPreviewOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');

  if (!employee) return null;

  // History Data
  const employeeHistory = [
    ...pendingPayments.filter(p => p.employeeId === employee.id).map(p => ({ ...p, status: 'PENDING', category: 'RH' })),
    ...ledger.filter(l => l.employeeId === employee.id).map(l => ({ ...l, status: 'VALIDATED' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const amount = Math.round(employee.baseSalary * 0.05);
    const description = `${type === 'BONUS' ? 'Bonus' : 'Sanction'}: ${employee.firstName} ${employee.lastName} - ${reason}`;

    submitRequest({
      task: description,
      amount: amount,
      requester: 'RH Manager',
      momo: employee.phone,
      date: new Date().toISOString().split('T')[0],
      type: type === 'BONUS' ? 'DEBIT' : 'CREDIT',
      employeeId: employee.id,
      evidence: {
        photo: file ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
        lat: 0,
        lng: 0,
        timestamp: new Date().toISOString()
      }
    });

    setReason('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    alert(`Demande de ${type === 'BONUS' ? 'Bonus' : 'Sanction'} envoyée !`);
  };

  const downloadPayslip = (date: string) => {
    alert(`Téléchargement de la fiche de paie pour ${date}...`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${employee.firstName} ${employee.lastName}`}>
      <div className="flex gap-4 border-b border-slate-100 mb-4">
        <button
          onClick={() => setActiveTab('ACTIONS')}
          className={cn(
            "pb-2 text-sm font-medium transition-colors relative",
            activeTab === 'ACTIONS' ? "text-brand-blue" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Sanctions & Bonus
          {activeTab === 'ACTIONS' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={cn(
            "pb-2 text-sm font-medium transition-colors relative",
            activeTab === 'HISTORY' ? "text-brand-blue" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Historique & Paie
          {activeTab === 'HISTORY' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'ACTIONS' && (
        <div className="space-y-4">
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setType('SANCTION')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
                type === 'SANCTION' ? "bg-white text-red-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <AlertTriangle className="w-4 h-4" /> Sanction (-5%)
            </button>
            <button
              onClick={() => setType('BONUS')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
                type === 'BONUS' ? "bg-white text-green-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <PartyPopper className="w-4 h-4" /> Bonus (+5%)
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Motif</label>
            <textarea 
              rows={3}
              className="block w-full border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue p-2 border"
              placeholder="Ex: Retard, Performance..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 cursor-pointer transition-colors",
              file ? "border-brand-green bg-green-50" : "border-slate-300 hover:border-slate-400 bg-slate-50"
            )}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-brand-green" />
                <span className="text-sm font-medium text-brand-green truncate max-w-[200px]">{file.name}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-6 h-6 mb-1 text-slate-400" />
                <span className="text-xs">Preuve (Optionnel)</span>
              </div>
            )}
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!reason}
            className={cn(
              "w-full py-2.5 rounded-lg text-white font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
              type === 'SANCTION' ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            )}
          >
            Soumettre
          </button>
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="month" 
              className="flex-1 border border-slate-300 rounded-lg p-2 text-sm focus:ring-brand-blue focus:border-brand-blue"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <button 
              onClick={() => selectedMonth && setIsPayslipPreviewOpen(true)}
              disabled={!selectedMonth}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              <Eye className="w-4 h-4" />
              Prévisualiser
            </button>
          </div>
          <div className="h-[350px] overflow-y-auto pr-2">
          {employeeHistory.length > 0 ? (
            employeeHistory.map((item: any) => (
              <div key={item.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{item.task || item.description}</p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                  <span className={cn(
                    "font-bold text-sm",
                    (item.type === 'DEBIT' && item.category === 'RH') ? "text-green-600" : // Bonus (Debit for company?) Wait. 
                    // Let's stick to the store logic: 
                    // Bonus = DEBIT (Expense) = Good for employee? 
                    // Sanction = CREDIT (Recovery) = Bad for employee?
                    // Actually, from company perspective:
                    // Bonus = Cost (Debit)
                    // Sanction = Saving/Income (Credit)
                    item.type === 'DEBIT' ? "text-green-600" : "text-red-600" 
                    // If visualising for EMPLOYEE: Bonus is Green, Sanction is Red.
                  )}>
                    {item.type === 'DEBIT' ? '+' : '-'}{Math.abs(item.amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    item.status === 'VALIDATED' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {item.status === 'VALIDATED' ? 'Validé' : 'En attente'}
                  </span>
                  {item.status === 'VALIDATED' && (
                    <button 
                      onClick={() => downloadPayslip(item.date)}
                      className="text-xs text-brand-blue hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Fiche de paie
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <History className="w-8 h-8 mb-2" />
              <p className="text-sm">Aucun historique disponible</p>
            </div>
          )}
          </div>
        </div>
      )}
      
      {employee && (
        <PayslipPreviewModal 
          isOpen={isPayslipPreviewOpen}
          onClose={() => setIsPayslipPreviewOpen(false)}
          employee={employee}
          month={selectedMonth}
        />
      )}
    </Modal>
  );
}
