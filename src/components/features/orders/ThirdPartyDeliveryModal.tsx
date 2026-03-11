import { useState } from 'react';
import { X, Truck, User, Phone, Building2 } from 'lucide-react';

interface ThirdPartyDeliveryDetails {
  service: 'porter' | 'rapido' | 'swiggy' | 'other';
  personName: string;
  personPhone: string;
  vehicleNumber?: string;
  trackingId?: string;
}

interface ThirdPartyDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ThirdPartyDeliveryDetails) => void;
  orderId: string;
}

export function ThirdPartyDeliveryModal({ isOpen, onClose, onSubmit, orderId }: ThirdPartyDeliveryModalProps) {
  const [details, setDetails] = useState<ThirdPartyDeliveryDetails>({
    service: 'porter',
    personName: '',
    personPhone: '',
    vehicleNumber: '',
    trackingId: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Third-Party Delivery</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Order: <span className="font-semibold">{orderId}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="h-4 w-4 inline mr-1" />
              Delivery Service
            </label>
            <select
              value={details.service}
              onChange={(e) => setDetails({ ...details, service: e.target.value as ThirdPartyDeliveryDetails['service'] })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="porter">Porter</option>
              <option value="rapido">Rapido</option>
              <option value="swiggy">Swiggy</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Delivery Person Name
            </label>
            <input
              type="text"
              value={details.personName}
              onChange={(e) => setDetails({ ...details, personName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter person name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              value={details.personPhone}
              onChange={(e) => setDetails({ ...details, personPhone: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+91 XXXXXXXXXX"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Number (Optional)
            </label>
            <input
              type="text"
              value={details.vehicleNumber}
              onChange={(e) => setDetails({ ...details, vehicleNumber: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="KA01AB1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tracking ID (Optional)
            </label>
            <input
              type="text"
              value={details.trackingId}
              onChange={(e) => setDetails({ ...details, trackingId: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tracking ID"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Assign Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
