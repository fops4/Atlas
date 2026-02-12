import { useState } from 'react';
import { Calculator, Utensils } from 'lucide-react';

export function RationForm() {
  const [count, setCount] = useState(0);
  const [unitPrice, setUnitPrice] = useState(1500);

  const total = count * unitPrice;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <Utensils className="w-5 h-5 text-slate-400" />
        Saisie Rapide Rations
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de personnes</label>
          <input 
            type="number" 
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="block w-full text-2xl font-bold text-center border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Prix Unitaire (FCFA)</label>
          <input 
            type="number" 
            value={unitPrice}
            onChange={(e) => setUnitPrice(Number(e.target.value))}
            className="block w-full border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate-500">Total Calculé</span>
            <Calculator className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 text-center">
            {total.toLocaleString()} <span className="text-sm font-normal text-slate-500">FCFA</span>
          </div>
        </div>

        <button className="w-full py-2.5 bg-brand-blue text-white font-medium hover:bg-brand-blue/90 rounded-lg transition-colors shadow-sm">
          Enregistrer Rations
        </button>
      </div>
    </div>
  );
}
