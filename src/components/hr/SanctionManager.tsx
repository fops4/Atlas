import { useState, useRef } from 'react';
import { Upload, AlertTriangle, PartyPopper, CheckCircle, History, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useHrStore } from '../../store/hrStore';
import { useFinanceStore } from '../../store/financeStore';

export function SanctionManager() {
  const { employees, selectedEmployeeId } = useHrStore();
  const { submitRequest, ledger, pendingPayments } = useFinanceStore();
  
  const [type, setType] = useState<'BONUS' | 'SANCTION'>('SANCTION');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  // Filter history for selected employee
  const employeeHistory = [
    ...pendingPayments.filter(p => p.employeeId === selectedEmployeeId).map(p => ({ ...p, status: 'PENDING' })),
    ...ledger.filter(l => l.employeeId === selectedEmployeeId).map(l => ({ ...l, status: 'VALIDATED', task: l.description }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedEmployee) return;

    const amount = Math.round(selectedEmployee.baseSalary * 0.05); // 5% example
    const description = `${type === 'BONUS' ? 'Bonus' : 'Sanction'}: ${selectedEmployee.firstName} ${selectedEmployee.lastName} - ${reason}`;

    submitRequest({
      task: description,
      amount: amount,
      requester: 'RH Manager',
      momo: selectedEmployee.phone,
      date: new Date().toISOString().split('T')[0],
      type: type === 'BONUS' ? 'DEBIT' : 'CREDIT',
      employeeId: selectedEmployee.id,
      evidence: {
        photo: file ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
        lat: 0,
        lng: 0,
        timestamp: new Date().toISOString()
      }
    });

    // Reset form
    setReason('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    alert(`Demande de ${type === 'BONUS' ? 'Bonus' : 'Sanction'} envoyée pour validation !`);
  };

  if (!selectedEmployee) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500 h-full flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-slate-300" />
        </div>
        <p>Sélectionnez un employé dans la liste pour gérer les sanctions et bonus.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full sticky top-4 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span>Gestion Sanctions & Bonus</span>
          <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {selectedEmployee.firstName} {selectedEmployee.lastName}
          </span>
        </h3>
        
        <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Motif</label>
            <textarea 
              rows={2}
              className="block w-full border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue p-2 border"
              placeholder={type === 'SANCTION' ? "Ex: Retard, Casse..." : "Ex: Performance..."}
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
            {type === 'SANCTION' ? 'Soumettre Sanction' : 'Soumettre Bonus'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
          <History className="w-3 h-3" /> Historique Récent
        </h4>
        <div className="space-y-2">
          {employeeHistory.length > 0 ? (
            employeeHistory.map((item: any) => (
              <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className={cn(
                    "font-medium",
                    item.description?.includes('Sanction') || item.task?.includes('Sanction') ? "text-red-600" : "text-green-600"
                  )}>
                    {item.task || item.description}
                  </span>
                  <span className="font-bold">{Math.abs(item.amount).toLocaleString()} F</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>{item.date}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded flex items-center gap-1",
                    item.status === 'VALIDATED' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {item.status === 'VALIDATED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {item.status === 'VALIDATED' ? 'Validé' : 'En attente'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 text-xs py-4">Aucun historique</p>
          )}
        </div>
      </div>
    </div>
  );
}
