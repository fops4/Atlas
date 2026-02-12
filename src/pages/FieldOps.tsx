import { ParcelManager } from '../components/operations/ParcelManager';
import { TaskManager } from '../components/operations/TaskManager';

export default function FieldOps() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Exploitation Agricole</h1>
        <p className="text-slate-500">Gestion des parcelles et suivi des tâches</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        <ParcelManager />
        <TaskManager />
      </div>
    </div>
  );
}
