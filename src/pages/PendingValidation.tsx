import { useAuthStore } from '../store/authStore';
import { ShieldAlert, LogOut, Clock } from 'lucide-react';

export default function PendingValidation() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Accès en attente de validation
        </h1>
        
        <p className="text-slate-500 mb-8">
          Bonjour <span className="font-semibold text-slate-700">{user?.id}</span>. 
          Votre compte a été créé avec succès, mais il doit être activé par un administrateur 
          pour accéder aux fonctionnalités du dashboard Atlas.
        </p>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-8 text-left">
          <div className="flex gap-3">
            <ShieldAlert className="w-5 h-5 text-brand-blue flex-shrink-0" />
            <p className="text-sm text-blue-800 leading-relaxed">
              Une notification a été envoyée au Responsable Administratif. 
              Vous recevrez un email dès que votre accès sera configuré.
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
