import { useState } from 'react';
import { ArrowRight, AlertCircle, Edit } from 'lucide-react';
import { Modal, Badge } from '../ui';
import { StatusChangeModal } from './StatusChangeModal';
import type { Purchase } from '../../types/purchase';

interface PurchaseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase | null;
  onStatusChange?: (purchaseId: string, productId: string, newStatus: string, remarks: string) => void;
  canEditStatus?: boolean;
}

const statusColors = {
  processing: 'bg-yellow-100 text-yellow-800',
  purchased: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  alternate: 'bg-blue-100 text-blue-800',
};

export function PurchaseDetailsModal({ isOpen, onClose, purchase, onStatusChange, canEditStatus = true }: PurchaseDetailsModalProps) {
  const [statusChangeModal, setStatusChangeModal] = useState<{ productId: string; productName: string; currentStatus: string } | null>(null);

  if (!purchase) return null;

  const totalWeight = purchase.products.reduce((sum, p) => sum + p.grossWeight, 0);
  const totalAmount = purchase.products.reduce((sum, p) => sum + (p.purchasePrice * p.countMax), 0);

  const handleStatusChange = (newStatus: string, remarks: string) => {
    if (statusChangeModal && onStatusChange) {
      onStatusChange(purchase.id, statusChangeModal.productId, newStatus, remarks);
    }
    setStatusChangeModal(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Purchase Details">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Purchase ID</p>
            <p className="font-semibold text-lg">{purchase.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Purchase Date</p>
            <p className="font-semibold">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Supplier</p>
            <p className="font-semibold">{purchase.supplierName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Module Type</p>
            <p className="font-semibold uppercase">{purchase.moduleType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created By</p>
            <p className="font-semibold">{purchase.createdBy}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created At</p>
            <p className="font-semibold">{new Date(purchase.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Remarks */}
        {purchase.remarks && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Remarks</p>
            <p className="text-gray-900">{purchase.remarks}</p>
          </div>
        )}

        {/* Products */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Products ({purchase.products.length})</h3>
          <div className="space-y-4">
            {purchase.products.map((product, index) => (
              <div key={product.id || index} className="border rounded-lg p-4 space-y-3">
                {/* Product Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-lg">{product.productName}</h4>
                      <Badge className="text-xs">{product.variant}</Badge>
                      <Badge className={statusColors[product.status]}>{product.status}</Badge>
                      {canEditStatus && onStatusChange && (
                        <button
                          onClick={() => setStatusChangeModal({
                            productId: product.id,
                            productName: product.productName,
                            currentStatus: product.status
                          })}
                          className="p-1 text-blue-600 hover:text-blue-700"
                          title="Change Status"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
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
                </div>

                {/* Product Details Grid */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Count Range</p>
                    <p className="font-semibold">{product.countMin} - {product.countMax}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gross Weight</p>
                    <p className="font-semibold">{product.grossWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Base Price Range</p>
                    <p className="font-semibold">₹{product.basePriceMin} - ₹{product.basePriceMax}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Purchase Price</p>
                    <p className="font-semibold text-green-600">₹{product.purchasePrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-semibold text-green-600">₹{(product.purchasePrice * product.countMax).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Price Status</p>
                    {product.purchasePrice >= product.basePriceMin && product.purchasePrice <= product.basePriceMax ? (
                      <p className="text-green-600 font-semibold">✓ Within Range</p>
                    ) : (
                      <p className="text-orange-600 font-semibold">⚠ Out of Range</p>
                    )}
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

        {/* Summary */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Weight:</span>
              <span className="font-semibold">{totalWeight.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-green-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Status History */}
        {purchase.statusHistory && purchase.statusHistory.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Status History</h3>
            <div className="space-y-2">
              {purchase.statusHistory.map((history, index) => (
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

      {/* Status Change Modal */}
      {statusChangeModal && (
        <StatusChangeModal
          isOpen={!!statusChangeModal}
          onClose={() => setStatusChangeModal(null)}
          onConfirm={handleStatusChange}
          currentStatus={statusChangeModal.currentStatus}
          productName={statusChangeModal.productName}
        />
      )}
    </Modal>
  );
}
