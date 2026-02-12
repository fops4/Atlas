import { useState, useMemo } from 'react';
import { Plus, Calendar, CheckCircle, Clock, Trash2, Edit, ClipboardList, Filter } from 'lucide-react';
import { useOperationStore, FarmTask } from '../../store/operationStore';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';
import { useHrStore } from '../../store/hrStore';
import { useNotification } from '../ui/Notification';
import { confirm } from '../ui/ConfirmDialog';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: FarmTask | null;
}

function TaskForm({ isOpen, onClose, taskToEdit }: TaskFormProps) {
  const { addTask, updateTask, parcels } = useOperationStore();
  const { employees } = useHrStore();
  const notify = useNotification();
  
  const [formData, setFormData] = useState({
    description: taskToEdit?.description || '',
    parcelId: taskToEdit?.parcelId || (parcels[0]?.id || ''),
    dueDate: taskToEdit?.dueDate || new Date().toISOString().split('T')[0],
    assignedTo: taskToEdit?.assignedTo || '',
    cost: taskToEdit?.cost || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskToEdit) {
      updateTask(taskToEdit.id, formData);
      notify.success('Tâche modifiée avec succès');
    } else {
      addTask(formData);
      notify.success('Nouvelle tâche créée');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={taskToEdit ? "Modifier Tâche" : "Nouvelle Tâche"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <input 
            type="text" required
            className="w-full p-2 border rounded-lg"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700">Parcelle Concernée</label>
            <select 
              className="w-full p-2 border rounded-lg bg-white"
              value={formData.parcelId}
              onChange={e => setFormData({ ...formData, parcelId: e.target.value })}
            >
              {parcels.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Date d'échéance</label>
          <input 
            type="date" required
            className="w-full p-2 border rounded-lg"
            value={formData.dueDate}
            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700">Assigné à (Optionnel)</label>
            <select 
              className="w-full p-2 border rounded-lg bg-white"
              value={formData.assignedTo}
              onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
            >
              <option value="">-- Personne --</option>
              {employees.filter(e => e.status === 'ACTIVE').map(emp => (
                <option key={emp.id} value={emp.firstName + ' ' + emp.lastName}>
                    {emp.firstName} {emp.lastName} ({emp.position})
                </option>
              ))}
            </select>
        </div>
        <button className="w-full bg-brand-blue text-white py-2 rounded-lg hover:bg-blue-700">
          Enregistrer
        </button>
      </form>
    </Modal>
  );
}

export function TaskManager() {
  const { tasks, parcels, deleteTask } = useOperationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<FarmTask | null>(null);
  const [selectedParcelFilter, setSelectedParcelFilter] = useState<string>('ALL');
  const notify = useNotification();

  const getParcelName = (id: string) => parcels.find(p => p.id === id)?.name || 'Inconnue';

  // Filter tasks by parcel
  const filteredTasks = useMemo(() => {
    if (selectedParcelFilter === 'ALL') return tasks;
    return tasks.filter(t => t.parcelId === selectedParcelFilter);
  }, [tasks, selectedParcelFilter]);

  const handleDelete = (id: string) => {
    confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?', () => {
      deleteTask(id);
      notify.success('Tâche supprimée');
    }, {
      title: 'Supprimer la tâche',
      confirmText: 'Supprimer',
      variant: 'danger'
    });
  };

  const handleEdit = (task: FarmTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-brand-blue" /> Suivi des Tâches
        </h3>
        <button onClick={handleAdd} className="p-2 bg-blue-50 text-brand-blue rounded-full hover:bg-blue-100">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Parcel Filter */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          Filtrer par parcelle
        </label>
        <select 
          className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-brand-blue focus:border-brand-blue"
          value={selectedParcelFilter}
          onChange={e => setSelectedParcelFilter(e.target.value)}
        >
          <option value="ALL">Toutes les parcelles ({tasks.length})</option>
          {parcels.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({tasks.filter(t => t.parcelId === p.id).length})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {filteredTasks.length > 0 ? filteredTasks.map(task => (
          <div key={task.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow group bg-slate-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-slate-900 line-clamp-1">{task.description}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <span className="font-medium bg-white px-1.5 py-0.5 border rounded">
                    {getParcelName(task.parcelId)}
                  </span>
                  {task.assignedTo && <span>• {task.assignedTo}</span>}
                </p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(task)} className="p-1.5 text-slate-400 hover:text-brand-blue">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(task.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/50">
               <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {task.dueDate}
               </div>
               <span className={cn(
                 "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1",
                 task.status === 'DONE' ? "bg-green-100 text-green-700" :
                 task.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"
               )}>
                 {task.status === 'DONE' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                 {task.status === 'DONE' ? 'Terminé' : task.status === 'IN_PROGRESS' ? 'En Cours' : 'À Faire'}
               </span>
            </div>
          </div>
        )) : (
            <div className="text-center py-8 text-slate-400 text-sm">
                {selectedParcelFilter === 'ALL' ? 'Aucune tâche planifiée.' : 'Aucune tâche pour cette parcelle.'}
            </div>
        )}
      </div>

      {isModalOpen && (
        <TaskForm 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          taskToEdit={editingTask} 
        />
      )}
    </div>
  );
}
