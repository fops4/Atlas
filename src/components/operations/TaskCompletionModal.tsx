import { X, Camera, Mic, DollarSign, User, Smartphone } from 'lucide-react';
import { activeTasks } from '../../data/mockData';

interface TaskCompletionModalProps {
  task: typeof activeTasks[0] | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskCompletionModal({ task, isOpen, onClose }: TaskCompletionModalProps) {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-900">Clôture de Tâche : {task.title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Preuves */}
          <section>
            <h4 className="text-sm font-bold text-slate-900 uppercase mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4" /> 1. Preuvers Terrain
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 transition-colors">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Prendre Photo</span>
              </button>
              <button className="h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 transition-colors">
                <Mic className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Note Vocale</span>
              </button>
            </div>
          </section>

          {/* Step 2: Rapport */}
          <section>
            <h4 className="text-sm font-bold text-slate-900 uppercase mb-3 text-slate-900">2. Rapport d'exécution</h4>
            <textarea 
              className="w-full border-slate-300 rounded-lg text-sm focus:ring-brand-blue focus:border-brand-blue" 
              rows={3} 
              placeholder="Observations, difficultés rencontrées..."
            />
          </section>

          {/* Step 3: Paiement */}
          <section className="bg-green-50 p-4 rounded-xl border border-green-100">
            <h4 className="text-sm font-bold text-green-800 uppercase mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> 3. Paiement Journalier
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-green-700 mb-1">Montant à payer</label>
                <input 
                  type="number" 
                  className="w-full border-green-200 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white" 
                  placeholder="EX: 15000"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-green-700 mb-1">Nom Bénéficiaire</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-green-600/50" />
                    <input 
                      type="text" 
                      className="w-full pl-9 border-green-200 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white" 
                      placeholder="Nom complet"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-green-700 mb-1">Numéro MoMo</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-green-600/50" />
                    <input 
                      type="tel" 
                      className="w-full pl-9 border-green-200 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white" 
                      placeholder="6XX..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 text-slate-700 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button className="flex-1 py-2.5 bg-brand-blue text-white font-medium hover:bg-brand-blue/90 rounded-lg transition-colors shadow-sm">
            Soumettre & Payer
          </button>
        </div>
      </div>
    </div>
  );
}
