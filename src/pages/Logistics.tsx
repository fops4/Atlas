import { InventoryList } from '../components/logistics/InventoryList';
import { RationForm } from '../components/logistics/RationForm';

export default function Logistics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Logistique & Stocks</h1>
        <p className="text-slate-500">Gestion des intrants et restauration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <InventoryList />
        </div>
        <div>
          <RationForm />
        </div>
      </div>
    </div>
  );
}
