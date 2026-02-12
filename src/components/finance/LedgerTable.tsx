import { useMemo, useState } from 'react';
import { useFinanceStore } from '../../store/financeStore';
import { cn } from '../../lib/utils';
import { ArrowDownLeft, ArrowUpRight, Filter } from 'lucide-react';

export function LedgerTable() {
  const { ledger } = useFinanceStore();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredData = useMemo(() => {
    return ledger.filter(entry => {
      const entryDate = new Date(entry.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchesDate = (!start || entryDate >= start) && (!end || entryDate <= end);
      const matchesType = typeFilter ? entry.type === typeFilter : true;
      const matchesCategory = categoryFilter ? entry.category === categoryFilter : true;
      
      return matchesDate && matchesType && matchesCategory;
    });
  }, [ledger, startDate, endDate, typeFilter, categoryFilter]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-semibold text-slate-900">Grand Livre (Ledger)</h3>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
            <div className="relative">
              <span className="absolute left-2 top-2 text-[10px] text-slate-400 font-bold uppercase">Du</span>
              <input 
                type="date"
                className="pl-8 pr-2 py-1 text-sm border-none focus:ring-0 text-slate-600 bg-transparent w-32"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="relative">
              <span className="absolute left-2 top-2 text-[10px] text-slate-400 font-bold uppercase">Au</span>
              <input 
                type="date"
                className="pl-8 pr-2 py-1 text-sm border-none focus:ring-0 text-slate-600 bg-transparent w-32"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <select
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Tout Type</option>
              <option value="CREDIT">Crédit (Entrée)</option>
              <option value="DEBIT">Débit (Sortie)</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <select
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue bg-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Toute Cat.</option>
              <option value="RH">RH (Paie/Bonus)</option>
              <option value="OPERATION">Opérations</option>
              <option value="LOGISTIQUE">Logistique</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">ID Transaction</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3 text-right">Montant</th>
              <th className="px-4 py-3 text-center">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-2 sm:px-4 py-3 font-mono text-slate-600">{row.id}</td>
                  <td className="px-2 sm:px-4 py-3 text-slate-600">{row.date}</td>
                  <td className="px-2 sm:px-4 py-3 font-medium text-slate-900">{row.description}</td>
                  <td className="px-2 sm:px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                      {row.category}
                    </span>
                  </td>
                  <td className={cn("px-2 sm:px-4 py-3 text-right font-bold", row.amount > 0 ? "text-brand-green" : "text-slate-900")}>
                    {row.amount > 0 ? '+' : ''}{row.amount.toLocaleString()} FCFA
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-center">
                    {row.type === 'CREDIT' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green bg-brand-green/10 px-2 py-1 rounded">
                        <ArrowUpRight className="w-3 h-3" /> CR
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded">
                        <ArrowDownLeft className="w-3 h-3" /> DB
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Aucune transaction trouvée pour ces filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
