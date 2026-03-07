import { useState } from 'react';
import { Modal, Button } from '../ui';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: string, netWeight: number | undefined, remarks: string) => void;
  currentStatus: string;
  productName: string;
  grossWeight: number;
}

export function StatusUpdateModal({ isOpen, onClose, onConfirm, currentStatus, productName, grossWeight }: StatusUpdateModalProps) {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [netWeight, setNetWeight] = useState<number | undefined>();
  const [remarks, setRemarks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(newStatus, netWeight, remarks);
    setRemarks('');
    setNetWeight(undefined);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Cutting Status">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Gross Weight</label>
          <input
            type="text"
            value={`${grossWeight} kg`}
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
            <option value="completed">Completed</option>
            <option value="misprocessed">Misprocessed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Net Weight (kg) {newStatus === 'completed' && <span className="text-red-500">*</span>}
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={netWeight || ''}
            onChange={(e) => setNetWeight(parseFloat(e.target.value))}
            required={newStatus === 'completed'}
            placeholder="Weight after cutting"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional notes"
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
