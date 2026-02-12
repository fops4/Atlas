import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { budgetData } from '../../data/mockData';

export function BudgetChart() {
  const [selectedYear, setSelectedYear] = useState<keyof typeof budgetData>(2025);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Budget vs Réel</h3>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value) as keyof typeof budgetData)}
          className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-brand-blue focus:border-brand-blue"
        >
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={budgetData[selectedYear]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip 
            cursor={{ stroke: '#F1F5F9', strokeWidth: 2 }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`${value.toLocaleString()} FCFA`, '']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="budget" 
            name="Budget Prévisionnel" 
            stroke="#94A3B8" 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            name="Coût Réel" 
            stroke="#1E3A8A" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
