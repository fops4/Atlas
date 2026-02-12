import { useState } from 'react';
import { Search, History, CheckCircle, Clock, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFinanceStore } from '../../store/financeStore';

export function GlobalSanctionHistory() {
  const { ledger, pendingPayments } = useFinanceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'BONUS' | 'SANCTION'>('ALL');

  const allHistory = [
    ...pendingPayments.filter(p => p.type && (p.type === 'DEBIT' || p.type === 'CREDIT')).map(p => ({ 
      id: p.id,
      task: p.task,
      amount: p.amount,
      date: p.date,
      type: p.type,
      status: 'PENDING',
      category: 'RH' // Assuming all routed here are RH for now
    })),
    ...ledger.filter(l => l.category === 'RH').map(l => ({ 
      id: l.id,
      task: l.description,
      amount: Math.abs(l.amount),
      date: l.date,
      type: l.type,
      status: 'VALIDATED',
      category: l.category
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredHistory = allHistory.filter(item => {
    const matchesSearch = item.task.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesType = true;
    if (filterType === 'BONUS') matchesType = item.type === 'DEBIT'; // Bonus = Debit
    if (filterType === 'SANCTION') matchesType = item.type === 'CREDIT'; // Sanction = Credit

    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col gap-3">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4" /> Historique Global Sanctions & Bonus
        </h3>
        <div className="flex gap-2">
           <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-white rounded-lg border border-slate-200 p-1 shrink-0">
            <button
              onClick={() => setFilterType('ALL')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                filterType === 'ALL' ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Tout
            </button>
            <button
              onClick={() => setFilterType('BONUS')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                filterType === 'BONUS' ? "bg-green-50 text-green-700" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Bonus
            </button>
            <button
              onClick={() => setFilterType('SANCTION')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                filterType === 'SANCTION' ? "bg-red-50 text-red-700" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Sanctions
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredHistory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {item.task}
                </td>
                <td className={cn(
                  "px-4 py-3 font-bold",
                  item.type === 'DEBIT' ? "text-green-600" : "text-red-600"
                )}>
                  {item.type === 'DEBIT' ? '+' : '-'}{item.amount.toLocaleString()} FCFA
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {item.date}
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                    item.status === 'VALIDATED' ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                  )}>
                    {item.status === 'VALIDATED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {item.status === 'VALIDATED' ? 'Validé' : 'En attente'}
                  </span>
                </td>
              </tr>
            ))}
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Aucun historique trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
