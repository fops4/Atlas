import { useState } from 'react';
import { Plus, MapPin, Edit, Trash2, Sprout } from 'lucide-react';
import { useOperationStore, Parcel } from '../../store/operationStore';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';
import { useNotification } from '../ui/Notification';
import { confirm } from '../ui/ConfirmDialog';

interface ParcelFormProps {
  isOpen: boolean;
  onClose: () => void;
  parcelToEdit?: Parcel | null;
}

function ParcelForm({ isOpen, onClose, parcelToEdit }: ParcelFormProps) {
  const { addParcel, updateParcel } = useOperationStore();
  const notify = useNotification();
  const [formData, setFormData] = useState({
    name: parcelToEdit?.name || '',
    area: parcelToEdit?.area || 0,
    crop: parcelToEdit?.crop || '',
    status: parcelToEdit?.status || 'ACTIVE'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parcelToEdit) {
      updateParcel(parcelToEdit.id, { ...formData, status: formData.status as any });
      notify.success('Parcelle modifiée avec succès');
    } else {
      addParcel({
        ...formData,
        status: formData.status as any,
        location: { lat: 4.05, lng: 9.70 }
      });
      notify.success('Nouvelle parcelle créée');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={parcelToEdit ? "Modifier Parcelle" : "Nouvelle Parcelle"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nom</label>
          <input 
            type="text" required
            className="w-full p-2 border rounded-lg"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Surface (Ha)</label>
            <input 
              type="number" step="0.1" required
              className="w-full p-2 border rounded-lg"
              value={formData.area}
              onChange={e => setFormData({ ...formData, area: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Culture</label>
            <input 
              type="text" required
              className="w-full p-2 border rounded-lg"
              value={formData.crop}
              onChange={e => setFormData({ ...formData, crop: e.target.value })}
            />
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700">Statut</label>
            <select 
              className="w-full p-2 border rounded-lg bg-white"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="ACTIVE">Active</option>
              <option value="FALLOW">En Jachère</option>
              <option value="HARVEST_READY">Prête à récolter</option>
            </select>
        </div>
        <button className="w-full bg-brand-blue text-white py-2 rounded-lg hover:bg-blue-700">
          Enregistrer
        </button>
      </form>
    </Modal>
  );
}

export function ParcelManager() {
  const { parcels, deleteParcel } = useOperationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  const notify = useNotification();

  const handleDelete = (id: string) => {
    confirm('Êtes-vous sûr de vouloir supprimer cette parcelle ?', () => {
      deleteParcel(id);
      notify.success('Parcelle supprimée');
    }, {
      title: 'Supprimer la parcelle',
      confirmText: 'Supprimer',
      variant: 'danger'
    });
  };

  const handleEdit = (parcel: Parcel) => {
    setEditingParcel(parcel);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingParcel(null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-brand-green" /> Gestion des Parcelles
        </h3>
        <button onClick={handleAdd} className="p-2 bg-blue-50 text-brand-blue rounded-full hover:bg-blue-100">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {parcels.map(parcel => (
          <div key={parcel.id} className="p-4 border border-slate-200 rounded-lg hover:border-brand-blue transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-slate-900">{parcel.name}</h4>
                <p className="text-xs text-slate-500">{parcel.area} Hectares • {parcel.crop}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(parcel)} className="p-1.5 text-slate-400 hover:text-brand-blue">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(parcel.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
               <span className={cn(
                 "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                 parcel.status === 'ACTIVE' ? "bg-green-100 text-green-700" :
                 parcel.status === 'FALLOW' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
               )}>
                 {parcel.status === 'HARVEST_READY' ? 'Prête' : parcel.status}
               </span>
               <div className="flex items-center gap-1 text-xs text-slate-400">
                 <MapPin className="w-3 h-3" />
                 Localisé
               </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ParcelForm 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          parcelToEdit={editingParcel} 
        />
      )}
    </div>
  );
}
