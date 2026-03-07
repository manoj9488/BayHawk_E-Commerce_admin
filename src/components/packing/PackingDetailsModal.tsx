import { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { Modal, Badge } from '../ui';
import { PackingStatusModal } from './PackingStatusModal';
import type { PackingEntry } from '../../types/packing';

interface PackingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: PackingEntry | null;
  onStatusUpdate?: (newStatus: string, netWeight: number | undefined, remarks: string) => void;
}

const statusColors = {
  processing: 'bg-yellow-100 text-yellow-800',
  packed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  alternate: 'bg-blue-100 text-blue-800',
};

export function PackingDetailsModal({ isOpen, onClose, entry, onStatusUpdate }: PackingDetailsModalProps) {
  const [statusModal, setStatusModal] = useState<{ productId: string; productName: string; currentStatus: string; grossWeight: number } | null>(null);

  if (!entry) return null;

  const handleStatusUpdate = (newStatus: string, netWeight: number | undefined, remarks: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(newStatus, netWeight, remarks);
    }
    setStatusModal(null);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Packing Entry Details">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Packing ID</p>
              <p className="font-semibold text-lg">{entry.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bill #</p>
              <p className="font-semibold text-lg">{entry.billNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">{new Date(entry.orderDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Customer Name</p>
              <p className="font-semibold">{entry.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Module</p>
              <p className="font-semibold uppercase">{entry.moduleType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Assigned To</p>
              <p className="font-semibold">{entry.assignedTo}</p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Products ({entry.products.length})</h3>
            <div className="space-y-4">
              {entry.products.map((product, index) => (
                <div key={product.id || index} className="border rounded-lg p-4 space-y-3">
                  {/* Product Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{product.productName}</h4>
                        <Badge className="text-xs capitalize">{product.variant}</Badge>
                        <Badge className={statusColors[product.status]}>{product.status}</Badge>
                      </div>
                      
                      {/* Alternate Product Indicator */}
                      {product.isAlternate && product.originalProductId && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                          <AlertCircle className="h-4 w-4" />
                          <span>
                            Alternate for: <span className="line-through">{product.originalProductId}</span>
                            <ArrowRight className="inline h-4 w-4 mx-1" />
                            {product.productName}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {onStatusUpdate && (
                      <button
                        onClick={() => setStatusModal({
                          productId: product.id,
                          productName: product.productName,
                          currentStatus: product.status,
                          grossWeight: product.grossWeight
                        })}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Update Status
                      </button>
                    )}
                  </div>

                  {/* Product Details Grid */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Cutting Type</p>
                      <p className="font-semibold">{product.cuttingType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Gross Weight</p>
                      <p className="font-semibold">{product.grossWeight.toFixed(2)} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Net Weight</p>
                      <p className="font-semibold">
                        {product.netWeight ? `${product.netWeight.toFixed(2)} kg` : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Product Remarks */}
                  {product.remarks && (
                    <div className="text-sm bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Remarks: </span>
                      <span className="text-gray-900">{product.remarks}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          {entry.statusHistory && entry.statusHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Status History</h3>
              <div className="space-y-2">
                {entry.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[history.status as keyof typeof statusColors]}>
                        {history.status}
                      </Badge>
                      <span className="text-gray-600">by {history.changedBy}</span>
                    </div>
                    <span className="text-gray-500">{new Date(history.changedAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Status Update Modal */}
      {statusModal && (
        <PackingStatusModal
          isOpen={!!statusModal}
          onClose={() => setStatusModal(null)}
          onConfirm={handleStatusUpdate}
          currentStatus={statusModal.currentStatus}
          productName={statusModal.productName}
          grossWeight={statusModal.grossWeight}
        />
      )}
    </>
  );
}
