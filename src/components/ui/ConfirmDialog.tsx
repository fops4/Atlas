import { create } from 'zustand';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  confirmText: string;
  cancelText: string;
  variant: 'danger' | 'warning' | 'info';
}

interface ConfirmDialogStore extends ConfirmDialogState {
  openDialog: (config: Partial<Omit<ConfirmDialogState, 'isOpen'>>) => void;
  closeDialog: () => void;
}

export const useConfirmDialog = create<ConfirmDialogStore>((set) => ({
  isOpen: false,
  title: 'Confirmation',
  message: 'Êtes-vous sûr ?',
  onConfirm: null,
  onCancel: null,
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
  variant: 'info',
  
  openDialog: (config) => set((state) => ({
    ...state,
    ...config,
    isOpen: true
  })),
  
  closeDialog: () => set({
    isOpen: false,
    onConfirm: null,
    onCancel: null
  })
}));

export function ConfirmDialog() {
  const { isOpen, title, message, onConfirm, onCancel, confirmText, cancelText, variant, closeDialog } = useConfirmDialog();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    closeDialog();
  };

  const handleCancel = () => {
    onCancel?.();
    closeDialog();
  };

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-orange-600 hover:bg-orange-700',
    info: 'bg-brand-blue hover:bg-blue-700'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              variant === 'danger' ? 'bg-red-100' : variant === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${
                variant === 'danger' ? 'text-red-600' : variant === 'warning' ? 'text-orange-600' : 'text-blue-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-600">{message}</p>
            </div>
            <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 px-6 py-4 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function for easy usage
export function confirm(message: string, onConfirm: () => void, options?: {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}) {
  useConfirmDialog.getState().openDialog({
    message,
    onConfirm,
    title: options?.title,
    confirmText: options?.confirmText,
    cancelText: options?.cancelText,
    variant: options?.variant
  });
}
