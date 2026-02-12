import { useState } from 'react';
import { useFinanceStore } from '../../store/financeStore';
import { cn } from '../../lib/utils';
import { Eye, CheckCircle, XCircle, MapPin, Calendar, Smartphone } from 'lucide-react';
import { Modal } from '../ui/Modal';

export function PaymentQueue() {
  const { pendingPayments, validatePayment, rejectPayment } = useFinanceStore();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const selectedRequest = selectedRequestId 
    ? pendingPayments.find(r => r.id === selectedRequestId) 
    : null;

  const handleValidate = () => {
    if (selectedRequest) {
      validatePayment(selectedRequest.id);
      setSelectedRequestId(null);
    }
  };

  const handleRejectClick = () => {
    setIsRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (selectedRequest) {
      rejectPayment(selectedRequest.id, rejectReason);
      setIsRejectModalOpen(false);
      setRejectReason('');
      setSelectedRequestId(null);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
        {/* List Section */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-900">Demandes en attente</h3>
            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
              {pendingPayments.length}
            </span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {pendingPayments.map((req) => (
              <div 
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                  selectedRequestId === req.id 
                    ? "border-brand-blue bg-blue-50 ring-1 ring-brand-blue" 
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{req.task}</span>
                    <span className={cn(
                        "text-[10px] uppercase font-bold px-1.5 py-0.5 w-fit rounded mt-1",
                        req.type === 'CREDIT' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    )}>
                        {req.type === 'CREDIT' ? 'Crédit (Recouvrement)' : 'Débit (Dépense)'}
                    </span>
                  </div>
                  <span className={cn(
                      "font-bold",
                      req.type === 'CREDIT' ? "text-green-600" : "text-slate-900"
                  )}>
                      {req.type === 'CREDIT' ? '+' : '-'}{req.amount.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-500 mt-2">
                  <span>{req.requester}</span>
                  <span>{req.date}</span>
                </div>
              </div>
            ))}
            {pendingPayments.length === 0 && (
              <div className="text-center p-8 text-slate-400">
                Aucune demande en attente
              </div>
            )}
          </div>
        </div>


        {/* Evidence Viewer Section */}
        <div className="w-full lg:w-[400px] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          {selectedRequest ? (
            <>
              <div className="relative h-48 bg-slate-200">
                <img 
                  src={selectedRequest.evidence?.photo || 'https://images.unsplash.com/photo-1633094217462-8e95055ebba7?w=500&q=80'} 
                  alt="Preuve" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedRequest.evidence?.lat ? `${selectedRequest.evidence.lat}, ${selectedRequest.evidence.lng}` : 'N/A'}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedRequest.task}</h3>
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {selectedRequest.evidence?.timestamp ? selectedRequest.evidence.timestamp.replace('T', ' ') : selectedRequest.date}
                  </p>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Bénéficiaire</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-900">{selectedRequest.requester}</span>
                      <span className="flex items-center gap-2 text-sm text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                        <Smartphone className="w-4 h-4" />
                        {selectedRequest.momo}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Montant à valider</p>
                    <p className="text-2xl font-bold text-brand-blue">{selectedRequest.amount.toLocaleString()} FCFA</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button 
                    onClick={handleRejectClick}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-red/20 text-brand-red bg-brand-red/5 hover:bg-brand-red/10 rounded-lg font-medium transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Rejeter
                  </button>
                  <button 
                    onClick={handleValidate}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-green text-white hover:bg-opacity-90 rounded-lg font-medium transition-colors shadow-sm shadow-brand-green/20"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Valider
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-8 h-8" />
              </div>
              <p>Sélectionnez une demande pour voir les preuves et valider le paiement.</p>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isRejectModalOpen} 
        onClose={() => setIsRejectModalOpen(false)}
        title="Rejeter la demande"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Veuillez indiquer le motif du rejet pour <strong>{selectedRequest?.task}</strong>.
          </p>
          <textarea
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-sm"
            rows={4}
            placeholder="Motif du rejet..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setIsRejectModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Annuler
            </button>
            <button 
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-red hover:bg-red-600 rounded-lg disabled:opacity-50"
            >
              Confirmer le rejet
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
