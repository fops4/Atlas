import { DollarSign, TrendingUp, AlertOctagon } from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { BudgetChart } from '../components/dashboard/BudgetChart';
import { ParcelMap } from '../components/dashboard/ParcelMap';
import { kpiData } from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Vue d'ensemble</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Système opérationnel
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Coût de revient Global (YTD)"
          value={`${(kpiData.totalCost / 1000000).toFixed(1)} M FCFA`}
          trend="+12%"
          trendUp={false}
          icon={DollarSign}
          variant="default"
        />
        <StatsCard
          title="Marge Brute Estimée"
          value={`${kpiData.grossMargin}%`}
          trend="+2.5%"
          trendUp={true}
          icon={TrendingUp}
          variant="success"
        />
        <StatsCard
          title="Taux de Rejet Tâches"
          value={`${kpiData.rejectionRate}%`}
          trend="-0.8%"
          trendUp={true}
          icon={AlertOctagon}
          variant="alert"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetChart />
        <ParcelMap />
      </div>
    </div>
  );
}
