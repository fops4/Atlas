import { inventory } from '../../data/mockData';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

export function InventoryList() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-900">État des Stocks</h3>
        <button className="text-sm text-brand-blue font-medium hover:underline">Voir tout</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Article</th>
              <th className="px-6 py-3">Quantité</th>
              <th className="px-6 py-3">Seuil Min.</th>
              <th className="px-6 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 font-bold text-slate-900">
                  {item.quantity} <span className="text-xs font-normal text-slate-500 ml-1">{item.unit}</span>
                </td>
                <td className="px-3 sm:px-6 py-4 text-slate-600">
                  {item.minThreshold}
                </td>
                <td className="px-3 sm:px-6 py-4">
                  {item.status === 'LOW' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      <AlertTriangle className="w-3 h-3" /> Stock Bas
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3" /> OK
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
