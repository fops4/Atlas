import { activeTasks } from '../../data/mockData';
import { cn } from '../../lib/utils';
import { Calendar, MapPin, Users, CheckCircle2 } from 'lucide-react';

interface TaskListProps {
  onSelectTask: (task: typeof activeTasks[0]) => void;
}

export function TaskList({ onSelectTask }: TaskListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-900">Tâches en Cours</h3>
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
          {activeTasks.length}
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {activeTasks.map((task) => (
          <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  task.status === 'IN_PROGRESS' ? "bg-brand-blue animate-pulse" : "bg-slate-300"
                )} />
                <h4 className="font-medium text-slate-900">{task.title}</h4>
              </div>
              <div className="flex gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {task.parcel}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {task.assignee}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {task.dueDate}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => onSelectTask(task)}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-3 py-1.5 bg-brand-green text-white text-sm font-medium rounded-lg transition-all hover:bg-green-600 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Clôturer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
