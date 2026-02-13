import { RationRequestManager } from '../components/logistics/RationRequestManager';
import { useLogisticsStore } from '../store/logisticsStore';
import { Package, CheckCircle, Truck } from 'lucide-react';

export default function Logistics() {
  const { rationRequests } = useLogisticsStore();

  const stats = {
    pending: rationRequests.filter(r => r.status === 'PENDING').length,
    approved: rationRequests.filter(r => r.status === 'APPROVED').length,
    delivered: rationRequests.filter(r => r.status === 'DELIVERED').length,
    total: rationRequests.length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
              <Package className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">En attente</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Approuvé</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Livré</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.delivered}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Ration Request Manager */}
      <RationRequestManager />
    </div>
  );
}
