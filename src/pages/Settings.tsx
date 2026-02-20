import { useState, useMemo } from 'react';
import { Search, UserPlus, Shield, Archive, ArchiveRestore, Edit, Filter, Key } from 'lucide-react';
import { useUserStore, User, AccessLevel, PageAccess } from '../store/userStore';
import { Modal } from '../components/ui/Modal';
import { cn } from '../lib/utils';
import { useNotification } from '../components/ui/Notification';
import { confirm } from '../components/ui/ConfirmDialog';
import { PasswordResetModal } from '../components/ui/PasswordResetModal';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
}

function UserForm({ isOpen, onClose, userToEdit }: UserFormProps) {
  const { addUser, updateUser } = useUserStore();
  const notify = useNotification();

  const [formData, setFormData] = useState({
    username: userToEdit?.username || '',
    email: userToEdit?.email || '',
    role: userToEdit?.role || 'STAFF' as any,
    access: userToEdit?.access || {
      dashboard: 'USER' as AccessLevel,
      finance: 'NONE' as AccessLevel,
      budget: 'NONE' as AccessLevel,
      hr: 'NONE' as AccessLevel,
      operations: 'NONE' as AccessLevel,
      logistics: 'NONE' as AccessLevel,
      technical: 'NONE' as AccessLevel
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userToEdit) {
      updateUser(userToEdit.id, formData);
      notify.success('Utilisateur modifié avec succès');
    } else {
      addUser(formData);
      notify.success('Nouvel utilisateur créé');
    }
    onClose();
  };

  const pages = [
    { key: 'dashboard' as keyof PageAccess, label: 'Tableau de Bord' },
    { key: 'finance' as keyof PageAccess, label: 'Finance' },
    { key: 'budget' as keyof PageAccess, label: 'Gestion Budgétaire' },
    { key: 'hr' as keyof PageAccess, label: 'Ressources Humaines' },
    { key: 'operations' as keyof PageAccess, label: 'Exploitation Agricole' },
    { key: 'logistics' as keyof PageAccess, label: 'Logistique' },
    { key: 'technical' as keyof PageAccess, label: 'Technique' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={userToEdit ? "Modifier Utilisateur" : "Nouvel Utilisateur"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom d'utilisateur</label>
            <input 
              type="text" required
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" required
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rôle Global</label>
          <select 
            className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-brand-blue focus:border-brand-blue"
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value as any })}
          >
            <option value="ADMIN">Administrateur (ADMIN)</option>
            <option value="RAF">Resp. Financier (RAF)</option>
            <option value="RH">Ressources Humaines (RH)</option>
            <option value="MANAGER">Manager Terrain</option>
            <option value="STAFF">Personnel (STAFF)</option>
          </select>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-blue" />
            Contrôle d'Accès par Page
          </h4>
          <div className="space-y-3">
            {pages.map(page => (
              <div key={page.key} className="flex items-center justify-between">
                <label className="text-sm text-slate-700">{page.label}</label>
                <select 
                  className="p-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-brand-blue focus:border-brand-blue"
                  value={formData.access[page.key]}
                  onChange={e => setFormData({ 
                    ...formData, 
                    access: { ...formData.access, [page.key]: e.target.value as AccessLevel }
                  })}
                >
                  <option value="NONE">Pas d'accès</option>
                  <option value="USER">Utilisateur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            <p className="font-medium mb-1">Niveaux d'accès :</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li><strong>Pas d'accès</strong> : Page non visible</li>
              <li><strong>Utilisateur</strong> : Consultation et création de demandes</li>
              <li><strong>Administrateur</strong> : Accès complet (validation, modification, suppression)</li>
            </ul>
          </div>
        </div>

        <button type="submit" className="w-full bg-brand-blue text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          {userToEdit ? 'Mettre à jour' : 'Créer l\'utilisateur'}
        </button>
      </form>
    </Modal>
  );
}

export default function Settings() {
  const { users, archiveUser, unarchiveUser, resetPassword } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
  const notify = useNotification();

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  const handleArchive = (user: User) => {
    confirm(`Archiver l'utilisateur ${user.username} ?`, () => {
      archiveUser(user.id);
      notify.success('Utilisateur archivé');
    }, {
      title: 'Archiver l\'utilisateur',
      confirmText: 'Archiver',
      variant: 'warning'
    });
  };

  const handleUnarchive = (user: User) => {
    unarchiveUser(user.id);
    notify.success('Utilisateur désarchivé');
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setUserToResetPassword(user);
    setIsPasswordResetOpen(true);
  };

  const handlePasswordReset = (newPassword: string) => {
    if (userToResetPassword) {
      resetPassword(userToResetPassword.id, newPassword);
      notify.success(`Mot de passe réinitialisé pour ${userToResetPassword.username}`);
    }
  };

  const getAccessBadgeColor = (level: AccessLevel) => {
    switch (level) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700';
      case 'USER': return 'bg-blue-100 text-blue-700';
      case 'NONE': return 'bg-slate-100 text-slate-500';
    }
  };

  const getAccessLabel = (level: AccessLevel) => {
    switch (level) {
      case 'ADMIN': return 'Admin';
      case 'USER': return 'User';
      case 'NONE': return 'Aucun';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Paramètres</h1>
          <p className="text-slate-500">Gestion des utilisateurs et contrôle d'accès</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Recherche et Filtres</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="p-2 border border-slate-300 rounded-lg bg-white focus:ring-brand-blue focus:border-brand-blue"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="ACTIVE">Actifs</option>
            <option value="ARCHIVED">Archivés</option>
          </select>
          <select 
            className="p-2 border border-slate-300 rounded-lg bg-white focus:ring-brand-blue focus:border-brand-blue"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
          >
            <option value="ALL">Tous les rôles</option>
            <option value="ADMIN">Administrateurs</option>
            <option value="RAF">RAF</option>
            <option value="RH">RH</option>
            <option value="MANAGER">Managers</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>
        <div className="mt-3 text-sm text-slate-600">
          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Accès Pages</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Créé le</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{user.username}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                      user.role === 'RAF' ? 'bg-blue-100 text-blue-700' :
                      user.role === 'RH' ? 'bg-orange-100 text-orange-700' :
                      user.role === 'MANAGER' ? 'bg-brand-green/10 text-brand-green' :
                      'bg-slate-100 text-slate-700'
                    )}>
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(user.access).filter(([_, level]) => level !== 'NONE').map(([page, level]) => (
                        <span 
                          key={page}
                          className={cn("px-2 py-0.5 rounded text-[10px] font-medium uppercase", getAccessBadgeColor(level))}
                        >
                          {page.slice(0, 3)} {getAccessLabel(level)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    )}>
                      {user.status === 'ACTIVE' ? 'Actif' : 'Archivé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-1.5 text-slate-400 hover:text-brand-blue transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleResetPassword(user)}
                        className="p-1.5 text-slate-400 hover:text-yellow-600 transition-colors"
                        title="Réinitialiser le mot de passe"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      {user.status === 'ACTIVE' ? (
                        <button 
                          onClick={() => handleArchive(user)}
                          className="p-1.5 text-slate-400 hover:text-orange-600 transition-colors"
                          title="Archiver"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUnarchive(user)}
                          className="p-1.5 text-slate-400 hover:text-green-600 transition-colors"
                          title="Désarchiver"
                        >
                          <ArchiveRestore className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <UserForm 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          userToEdit={editingUser} 
        />
      )}

      {isPasswordResetOpen && userToResetPassword && (
        <PasswordResetModal
          isOpen={isPasswordResetOpen}
          onClose={() => setIsPasswordResetOpen(false)}
          username={userToResetPassword.username}
          onReset={handlePasswordReset}
        />
      )}
    </div>
  );
}
