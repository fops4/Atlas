import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, X } from 'lucide-react';
import { Modal } from './Modal';
import { useNotification } from './Notification';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onReset: (newPassword: string) => void;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'Au moins 8 caractères', test: (p) => p.length >= 8 },
  { label: 'Une lettre majuscule', test: (p) => /[A-Z]/.test(p) },
  { label: 'Une lettre minuscule', test: (p) => /[a-z]/.test(p) },
  { label: 'Un chiffre', test: (p) => /\d/.test(p) },
  { label: 'Un caractère spécial (@$!%*?&)', test: (p) => /[@$!%*?&]/.test(p) }
];

export function PasswordResetModal({ isOpen, onClose, username, onReset }: PasswordResetModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const notify = useNotification();

  const isPasswordValid = passwordRequirements.every(req => req.test(newPassword));
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      notify.error('Le mot de passe ne respecte pas les critères de sécurité');
      return;
    }

    if (!passwordsMatch) {
      notify.error('Les mots de passe ne correspondent pas');
      return;
    }

    onReset(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Réinitialiser le mot de passe">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Réinitialisation du mot de passe pour : <strong>{username}</strong>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full p-2 pr-10 border border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirmer le mot de passe</label>
          <div className="relative">
            <input 
              type={showConfirm ? 'text' : 'password'}
              required
              className="w-full p-2 pr-10 border border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-xs font-semibold text-slate-700 mb-2">Critères de sécurité :</p>
          <ul className="space-y-1">
            {passwordRequirements.map((req, idx) => {
              const isValid = req.test(newPassword);
              return (
                <li key={idx} className="flex items-center gap-2 text-xs">
                  {isValid ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <X className="w-3 h-3 text-slate-400" />
                  )}
                  <span className={isValid ? 'text-green-700' : 'text-slate-600'}>
                    {req.label}
                  </span>
                </li>
              );
            })}
            {confirmPassword.length > 0 && (
              <li className="flex items-center gap-2 text-xs">
                {passwordsMatch ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <X className="w-3 h-3 text-red-600" />
                )}
                <span className={passwordsMatch ? 'text-green-700' : 'text-red-700'}>
                  Les mots de passe correspondent
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!isPasswordValid || !passwordsMatch}
            className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>
      </form>
    </Modal>
  );
}
