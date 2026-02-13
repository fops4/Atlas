import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-brand-blue mb-4">404</h1>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Page introuvable
          </h2>
          <p className="text-slate-600">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Pages suggérées :</h3>
          <div className="space-y-2 text-left">
            <Link
              to="/"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"
            >
              <Home className="w-4 h-4 text-brand-blue" />
              <span>Tableau de bord</span>
            </Link>
            <Link
              to="/finance"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"
            >
              <span className="text-brand-blue">💰</span>
              <span>Finance</span>
            </Link>
            <Link
              to="/hr"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"
            >
              <span className="text-brand-blue">👥</span>
              <span>Ressources Humaines</span>
            </Link>
            <Link
              to="/logistics"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"
            >
              <span className="text-brand-blue">📦</span>
              <span>Logistique</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
