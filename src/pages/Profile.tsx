import { useState } from 'react';
import { User as UserIcon, Mail, Shield, Lock } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { PasswordResetModal } from '../components/ui/PasswordResetModal';
import { useNotification } from '../components/ui/Notification';

export default function Profile() {
  const { currentUser } = useUserStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const notify = useNotification();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Aucun utilisateur connecté</p>
      </div>
    );
  }

  const handlePasswordChange = () => {
    // In a real app, this would call an API
    notify.success('Mot de passe modifié avec succès');
    setIsPasswordModalOpen(false);
  };

  const pages = [
    { key: 'dashboard', label: 'Tableau de Bord' },
    { key: 'finance', label: 'Finance' },
    { key: 'hr', label: 'Ressources Humaines' },
    { key: 'operations', label: 'Exploitation Agricole' },
    { key: 'logistics', label: 'Logistique' },
    { key: 'technical', label: 'Technique' }
  ];

  const getAccessLabel = (level: string) => {
    switch (level) {
      case 'ADMIN': return 'Administrateur';
      case 'USER': return 'Utilisateur';
      case 'NONE': return 'Pas d\'accès';
      default: return level;
    }
  };

  const getAccessColor = (level: string) => {
    switch (level) {
      case 'ADMIN': return 'text-purple-700 bg-purple-100';
      case 'USER': return 'text-blue-700 bg-blue-100';
      case 'NONE': return 'text-slate-500 bg-slate-100';
      default: return 'text-slate-700 bg-slate-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mon Profil</h1>
        <p className="text-slate-500">Gérez vos informations personnelles et votre sécurité</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 h-24"></div>
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-12">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-brand-blue" />
            </div>
            <div className="flex-1 mt-14">
              <h2 className="text-2xl font-bold text-slate-900">{currentUser.username}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-slate-400" />
                <p className="text-slate-600">{currentUser.email}</p>
              </div>
            </div>
            <div className="mt-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                <Shield className="w-4 h-4" />
                {currentUser.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-blue" />
              Sécurité
            </h3>
            <p className="text-sm text-slate-500 mt-1">Gérez votre mot de passe</p>
          </div>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Modifier le mot de passe
          </button>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600">
            Dernière modification : <span className="font-medium">Jamais</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Pour votre sécurité, utilisez un mot de passe fort avec au moins 8 caractères, incluant majuscules, minuscules, chiffres et caractères spéciaux.
          </p>
        </div>
      </div>

      {/* Access Rights */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-blue" />
          Mes Droits d'Accès
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map(page => {
            const accessLevel = currentUser.access[page.key as keyof typeof currentUser.access];
            return (
              <div key={page.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-sm font-medium text-slate-700">{page.label}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getAccessColor(accessLevel)}`}>
                  {getAccessLabel(accessLevel)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Informations du Compte</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">Statut</span>
            <span className="text-sm font-medium text-green-700">
              {currentUser.status === 'ACTIVE' ? 'Actif' : 'Archivé'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">Date de création</span>
            <span className="text-sm font-medium text-slate-900">{currentUser.createdAt}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-slate-600">ID Utilisateur</span>
            <span className="text-sm font-mono text-slate-900">{currentUser.id}</span>
          </div>
        </div>
      </div>

      <PasswordResetModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        username={currentUser.username}
        onReset={handlePasswordChange}
      />
    </div>
  );
}
