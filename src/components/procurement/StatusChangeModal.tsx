import { useState } from 'react';
import { Modal, Button } from '../ui';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: string, remarks: string) => void;
  currentStatus: string;
  productName: string;
}

export function StatusChangeModal({ isOpen, onClose, onConfirm, currentStatus, productName }: StatusChangeModalProps) {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [remarks, setRemarks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(newStatus, remarks);
    setRemarks('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Purchase Status">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <input
            type="text"
            value={productName}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
          <input
            type="text"
            value={currentStatus}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 capitalize"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Status <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            required
          >
            <option value="processing">Processing</option>
            <option value="purchased">Purchased</option>
            <option value="cancelled">Cancelled</option>
            <option value="alternate">Alternate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional reason for status change"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Update Status
          </Button>
        </div>
      </form>
    </Modal>
  );
}
