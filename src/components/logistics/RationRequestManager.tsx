import { useState, useMemo } from 'react';
import { Plus, Search, Filter, CheckCircle, XCircle, Package, Truck, Edit, Trash2, Eye } from 'lucide-react';
import { useLogisticsStore, RationRequest, RationItem } from '../../store/logisticsStore';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';
import { useNotification } from '../ui/Notification';
import { confirm } from '../ui/ConfirmDialog';
import { useHrStore } from '../../store/hrStore';

interface RationFormProps {
  isOpen: boolean;
  onClose: () => void;
  requestToEdit?: RationRequest | null;
}

function RationForm({ isOpen, onClose, requestToEdit }: RationFormProps) {
  const { addRationRequest, updateRationRequest } = useLogisticsStore();
  const { employees } = useHrStore();
  const notify = useNotification();

  const [formData, setFormData] = useState({
    employeeId: requestToEdit?.employeeId || '',
    requestedBy: requestToEdit?.requestedBy || '',
    date: requestToEdit?.date || new Date().toISOString().split('T')[0],
    notes: requestToEdit?.notes || '',
    items: requestToEdit?.items || [{ name: '', quantity: 0, unit: 'kg' }] as RationItem[]
  });

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 0, unit: 'kg' }]
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleItemChange = (index: number, field: keyof RationItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.items.length === 0 || formData.items.some(item => !item.name || item.quantity <= 0)) {
      notify.error('Veuillez remplir tous les articles correctement');
      return;
    }

    if (requestToEdit) {
      updateRationRequest(requestToEdit.id, formData);
      notify.success('Demande modifiée avec succès');
    } else {
      addRationRequest(formData);
      notify.success('Nouvelle demande créée');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={requestToEdit ? "Modifier la demande" : "Nouvelle demande de rations"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employé</label>
            <select
              required
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
              value={formData.employeeId}
              onChange={e => {
                const emp = employees.find(emp => emp.id === e.target.value);
                setFormData({
                  ...formData,
                  employeeId: e.target.value,
                  requestedBy: emp ? `${emp.firstName} ${emp.lastName}` : ''
                });
              }}
            >
              <option value="">Sélectionner...</option>
              {employees.filter(e => e.status === 'ACTIVE').map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} - {emp.position}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optionnel)</label>
          <textarea
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
            rows={2}
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Informations supplémentaires..."
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-slate-900">Articles demandés</h4>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-sm text-brand-blue hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  required
                  placeholder="Article"
                  className="col-span-5 p-2 text-sm border border-slate-300 rounded-lg"
                  value={item.name}
                  onChange={e => handleItemChange(index, 'name', e.target.value)}
                />
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  placeholder="Qté"
                  className="col-span-3 p-2 text-sm border border-slate-300 rounded-lg"
                  value={item.quantity || ''}
                  onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                />
                <select
                  className="col-span-3 p-2 text-sm border border-slate-300 rounded-lg"
                  value={item.unit}
                  onChange={e => handleItemChange(index, 'unit', e.target.value)}
                >
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="unité">unité</option>
                  <option value="sac">sac</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="col-span-1 p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-brand-blue text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {requestToEdit ? 'Mettre à jour' : 'Créer la demande'}
        </button>
      </form>
    </Modal>
  );
}

interface RequestDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  request: RationRequest;
}

function RequestDetailsModal({ isOpen, onClose, request }: RequestDetailsProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails de la demande">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Demandeur</p>
            <p className="font-medium text-slate-900">{request.requestedBy}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Date</p>
            <p className="font-medium text-slate-900">{request.date}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-2">Articles</p>
          <div className="space-y-2">
            {request.items.map((item, idx) => (
              <div key={idx} className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-slate-700">{item.name}</span>
                <span className="text-sm font-medium text-slate-900">
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {request.notes && (
          <div>
            <p className="text-xs text-slate-500">Notes</p>
            <p className="text-sm text-slate-700">{request.notes}</p>
          </div>
        )}

        {request.status === 'APPROVED' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Approuvé par <strong>{request.approvedBy}</strong> le {request.approvedDate}
            </p>
          </div>
        )}

        {request.status === 'REJECTED' && request.rejectionReason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Raison du rejet :</strong> {request.rejectionReason}
            </p>
          </div>
        )}

        {request.status === 'DELIVERED' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Livré le {request.deliveredDate}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function RationRequestManager() {
  const { rationRequests, deleteRationRequest, approveRequest, rejectRequest, markAsDelivered } = useLogisticsStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<RationRequest | null>(null);
  const [viewingRequest, setViewingRequest] = useState<RationRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RationRequest['status']>('ALL');
  const notify = useNotification();

  const filteredRequests = useMemo(() => {
    return rationRequests.filter(req => {
      const matchesSearch = req.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           req.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rationRequests, searchQuery, statusFilter]);

  const handleDelete = (request: RationRequest) => {
    confirm(`Supprimer la demande ${request.id} ?`, () => {
      deleteRationRequest(request.id);
      notify.success('Demande supprimée');
    }, {
      title: 'Supprimer la demande',
      confirmText: 'Supprimer',
      variant: 'danger'
    });
  };

  const handleApprove = (request: RationRequest) => {
    approveRequest(request.id, 'Admin');
    notify.success('Demande approuvée');
  };

  const handleReject = (request: RationRequest) => {
    const reason = prompt('Raison du rejet :');
    if (reason) {
      rejectRequest(request.id, reason);
      notify.success('Demande rejetée');
    }
  };

  const handleDeliver = (request: RationRequest) => {
    markAsDelivered(request.id);
    notify.success('Demande marquée comme livrée');
  };

  const handleEdit = (request: RationRequest) => {
    if (request.status !== 'PENDING') {
      notify.warning('Seules les demandes en attente peuvent être modifiées');
      return;
    }
    setEditingRequest(request);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingRequest(null);
    setIsFormOpen(true);
  };

  const handleView = (request: RationRequest) => {
    setViewingRequest(request);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: RationRequest['status']) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      DELIVERED: 'bg-blue-100 text-blue-700'
    };
    const labels = {
      PENDING: 'En attente',
      APPROVED: 'Approuvé',
      REJECTED: 'Rejeté',
      DELIVERED: 'Livré'
    };
    return (
      <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', styles[status])}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Demandes de Rations</h2>
          <p className="text-slate-500 mt-1">Gérez les demandes de rations pour les employés</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle demande
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-slate-600" />
          <h3 className="font-semibold text-slate-900 text-sm">Filtres</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par demandeur ou ID..."
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
            <option value="PENDING">En attente</option>
            <option value="APPROVED">Approuvé</option>
            <option value="REJECTED">Rejeté</option>
            <option value="DELIVERED">Livré</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Demandeur</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Articles</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map(request => (
                <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{request.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{request.requestedBy}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{request.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{request.items.length} article(s)</td>
                  <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(request)}
                        className="p-1.5 text-slate-400 hover:text-brand-blue transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {request.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleEdit(request)}
                            className="p-1.5 text-slate-400 hover:text-brand-blue transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(request)}
                            className="p-1.5 text-slate-400 hover:text-green-600 transition-colors"
                            title="Approuver"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(request)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                            title="Rejeter"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {request.status === 'APPROVED' && (
                        <button
                          onClick={() => handleDeliver(request)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Marquer comme livré"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      )}
                      {request.status === 'PENDING' && (
                        <button
                          onClick={() => handleDelete(request)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Aucune demande trouvée</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <RationForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          requestToEdit={editingRequest}
        />
      )}

      {isDetailsOpen && viewingRequest && (
        <RequestDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          request={viewingRequest}
        />
      )}
    </div>
  );
}
