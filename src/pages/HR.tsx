import { EmployeeList } from '../components/hr/EmployeeList';
import { GlobalSanctionHistory } from '../components/hr/GlobalSanctionHistory';

export default function HR() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Ressources Humaines</h1>
        <p className="text-slate-500">Gestion du personnel, paie et performances</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <EmployeeList />
        </div>
        <div>
          <GlobalSanctionHistory />
        </div>
      </div>
    </div>
  );
}
