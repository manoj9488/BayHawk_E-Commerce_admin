import { useState } from 'react';
import { Button } from '../../ui';
import { Upload, X } from 'lucide-react';

interface DeliveryAgentFormProps {
  onSubmit: (data: DeliveryAgentFormSubmitData) => void;
  onCancel: () => void;
  initialData?: Partial<DeliveryAgentFormData>;
}

interface DeliveryAgentFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicleNo: string;
  vehicleType: string;
  agentType: string;
  monthlySalary: string;
  drivingLicenseNo: string;
  licenseExpiryDate: string;
  emergencyContact: string;
  emergencyContactName: string;
}

type DeliveryAgentFormSubmitData = DeliveryAgentFormData & {
  licenseDoc: File | null;
  proofDoc: File | null;
};

export function DeliveryAgentForm({ onSubmit, onCancel, initialData }: DeliveryAgentFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    vehicleNo: initialData?.vehicleNo || '',
    vehicleType: initialData?.vehicleType || 'bike',
    agentType: initialData?.agentType || 'employee',
    monthlySalary: initialData?.monthlySalary || '',
    drivingLicenseNo: initialData?.drivingLicenseNo || '',
    licenseExpiryDate: initialData?.licenseExpiryDate || '',
    emergencyContact: initialData?.emergencyContact || '',
    emergencyContactName: initialData?.emergencyContactName || ''
  });
  
  const [licenseDoc, setLicenseDoc] = useState<File | null>(null);
  const [proofDoc, setProofDoc] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData && (!licenseDoc || !proofDoc)) {
      alert('Please upload both Driving License and ID Proof documents');
      return;
    }
    onSubmit({ ...formData, licenseDoc, proofDoc });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'license' | 'proof') => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      if (type === 'license') {
        setLicenseDoc(file);
      } else {
        setProofDoc(file);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="agent@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter address"
            />
          </div>
        </div>
      </div>

      {/* Agent Type */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Agent Type & Compensation</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Agent Type *</label>
            <select
              required
              value={formData.agentType}
              onChange={(e) => setFormData({ ...formData, agentType: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="employee">Employee (Fixed Salary)</option>
              <option value="partner">Partner (Per Order)</option>
            </select>
          </div>
          {formData.agentType === 'employee' && (
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Salary (₹) *</label>
              <input
                type="number"
                required
                value={formData.monthlySalary}
                onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter salary"
              />
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contact Name *</label>
            <input
              type="text"
              required
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Emergency contact"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Number *</label>
            <input
              type="tel"
              required
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="+91 9876543210"
            />
          </div>
        </div>
      </div>

      {/* Vehicle */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Number *</label>
            <input
              type="text"
              required
              value={formData.vehicleNo}
              onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="TN 01 AB 1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Type *</label>
            <select
              required
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
              <option value="van">Van</option>
            </select>
          </div>
        </div>
      </div>

      {/* License */}
      <div>
        <h3 className="text-lg font-semibold mb-4">License Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">License Number *</label>
            <input
              type="text"
              required
              value={formData.drivingLicenseNo}
              onChange={(e) => setFormData({ ...formData, drivingLicenseNo: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="DL-1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date *</label>
            <input
              type="date"
              required
              value={formData.licenseExpiryDate}
              onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Document Uploads</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">License Document *</label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${licenseDoc ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
              {licenseDoc ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium truncate">{licenseDoc.name}</p>
                      <p className="text-xs text-gray-500">{(licenseDoc.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setLicenseDoc(null)} className="text-red-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm">Upload License</span>
                  <span className="text-xs text-gray-500">Max 5MB</span>
                  <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'license')} className="hidden" />
                </label>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ID Proof *</label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${proofDoc ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
              {proofDoc ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium truncate">{proofDoc.name}</p>
                      <p className="text-xs text-gray-500">{(proofDoc.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setProofDoc(null)} className="text-red-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm">Upload ID Proof</span>
                  <span className="text-xs text-gray-500">Max 5MB</span>
                  <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'proof')} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" className="flex-1">
          {initialData ? 'Update' : 'Create'} Agent
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
