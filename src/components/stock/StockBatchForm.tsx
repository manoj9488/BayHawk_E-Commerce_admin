import { useState } from 'react';
import { Card, Button, Input } from '../ui';
import { Package, Calendar, MapPin, Award, Thermometer, User, Save, X } from 'lucide-react';

interface StockBatchData {
  // Basic Information
  batchNumber: string;
  traceabilityCode: string;
  productName: string;
  category: string;
  individualWeight: number;
  quantity: number;
  quantityUnit: string;
  
  // Dates
  catchSlaughterDate: string;
  receivedDate: string;
  expiryDate: string;
  
  // Certifications & Quality
  certifications: string[];
  catchType: 'farmed' | 'wild';
  chemicalFree: 'yes' | 'no' | 'organic';
  qualityGrade: string;
  
  // Origin Information
  harvestOrigin: string;
  countryOfOrigin: string;
  
  // Packaging & Storage
  packagingType: string;
  storageTemperature: string;
  
  // System Information
  createdBy: string;
  createdByRole: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface StockBatchFormProps {
  initialData?: Partial<StockBatchData>;
  onSave: (data: StockBatchData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const CATEGORIES = [
  { value: 'sea-fish', label: 'Sea Fish' },
  { value: 'freshwater-fish', label: 'Freshwater Fish' },
  { value: 'shell-fish', label: 'Shell Fish' },
  { value: 'dry-fish', label: 'Dry Fish' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'mutton', label: 'Mutton' },
  { value: 'egg', label: 'Egg' },
];

const CERTIFICATIONS = [
  'Halal', 'Organic', 'MSC Certified', 'ASC Certified', 'HACCP', 'ISO 22000', 'BRC', 'SQF'
];

const QUALITY_GRADES = [
  { value: 'grade-a', label: 'Grade A (Premium)' },
  { value: 'grade-b', label: 'Grade B' },
  { value: 'grade-c', label: 'Grade C' },
];

const PACKAGING_TYPES = [
  'Vacuum Packed', 'Ice Packed', 'Frozen Box', 'Fresh Box', 'Bulk Container'
];

const HARVEST_ORIGINS = [
  'Chilka Lake', 'Sundarban Delta', 'Kerala Backwaters', 'Bay of Bengal', 'Arabian Sea', 'Local Farm'
];

const COUNTRIES = [
  'India', 'Norway', 'Chile', 'Thailand', 'Vietnam', 'Bangladesh'
];

export function StockBatchForm({ initialData, onSave, onCancel, isEdit = false }: StockBatchFormProps) {
  const [formData, setFormData] = useState<StockBatchData>({
    batchNumber: initialData?.batchNumber || '',
    traceabilityCode: initialData?.traceabilityCode || `LOT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    productName: initialData?.productName || '',
    category: initialData?.category || '',
    individualWeight: initialData?.individualWeight || 0,
    quantity: initialData?.quantity || 0,
    quantityUnit: initialData?.quantityUnit || 'kg',
    catchSlaughterDate: initialData?.catchSlaughterDate || '',
    receivedDate: initialData?.receivedDate || new Date().toISOString().slice(0, 10),
    expiryDate: initialData?.expiryDate || '',
    certifications: initialData?.certifications || [],
    catchType: initialData?.catchType || 'wild',
    chemicalFree: initialData?.chemicalFree || 'no',
    qualityGrade: initialData?.qualityGrade || 'grade-a',
    harvestOrigin: initialData?.harvestOrigin || '',
    countryOfOrigin: initialData?.countryOfOrigin || 'India',
    packagingType: initialData?.packagingType || '',
    storageTemperature: initialData?.storageTemperature || '0-4°C (Fresh)',
    createdBy: initialData?.createdBy || 'Current User',
    createdByRole: initialData?.createdByRole || 'Procurement Manager',
    status: initialData?.status || 'pending',
  });

  const handleInputChange = (field: keyof StockBatchData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCertificationToggle = (certification: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(c => c !== certification)
        : [...prev.certifications, certification]
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.productName || !formData.category || !formData.quantity) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Batch Information */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Batch Information</h3>
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch/Lot Number *
            </label>
            <Input
              value={formData.batchNumber}
              onChange={(e) => handleInputChange('batchNumber', e.target.value)}
              placeholder="Enter batch number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Traceability Code
            </label>
            <Input
              value={formData.traceabilityCode}
              onChange={(e) => handleInputChange('traceabilityCode', e.target.value)}
              placeholder="LOT-20260115-CH001"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <Input
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              placeholder="Tuna, Seer, Chicken breast"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Individual Product Weight *
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={formData.individualWeight}
                onChange={(e) => handleInputChange('individualWeight', Number(e.target.value))}
                placeholder="5"
                step="0.1"
              />
              <select
                value={formData.quantityUnit}
                onChange={(e) => handleInputChange('quantityUnit', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="kg">Kg</option>
                <option value="g">g</option>
                <option value="pcs">Pcs</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity/Count per kg *
            </label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
              placeholder="1 Count & 2-3 per kgs"
            />
          </div>
        </div>
      </Card>

      {/* Date Information */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Date Information</h3>
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catch/Slaughter Date *
            </label>
            <Input
              type="date"
              value={formData.catchSlaughterDate}
              onChange={(e) => handleInputChange('catchSlaughterDate', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Received Date *
            </label>
            <Input
              type="date"
              value={formData.receivedDate}
              onChange={(e) => handleInputChange('receivedDate', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry/Use By Date *
            </label>
            <Input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Quality & Certifications */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold">Quality & Certifications</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certifications
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CERTIFICATIONS.map(cert => (
                <label key={cert} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.certifications.includes(cert)}
                    onChange={() => handleCertificationToggle(cert)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{cert}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catch Type
              </label>
              <select
                value={formData.catchType}
                onChange={(e) => handleInputChange('catchType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="wild">Wild</option>
                <option value="farmed">Farmed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chemical Free
              </label>
              <select
                value={formData.chemicalFree}
                onChange={(e) => handleInputChange('chemicalFree', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="organic">Organic</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality Grade
              </label>
              <select
                value={formData.qualityGrade}
                onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {QUALITY_GRADES.map(grade => (
                  <option key={grade.value} value={grade.value}>{grade.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Origin Information */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold">Origin Information</h3>
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catch/Harvest Origin
            </label>
            <select
              value={formData.harvestOrigin}
              onChange={(e) => handleInputChange('harvestOrigin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Origin</option>
              {HARVEST_ORIGINS.map(origin => (
                <option key={origin} value={origin}>{origin}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country of Origin
            </label>
            <select
              value={formData.countryOfOrigin}
              onChange={(e) => handleInputChange('countryOfOrigin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Packaging & Storage */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Thermometer className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Packaging & Storage</h3>
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Packaging Type
            </label>
            <select
              value={formData.packagingType}
              onChange={(e) => handleInputChange('packagingType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Packaging</option>
              {PACKAGING_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage Temperature
            </label>
            <select
              value={formData.storageTemperature}
              onChange={(e) => handleInputChange('storageTemperature', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0-4°C (Fresh)">0-4°C (Fresh)</option>
              <option value="-18°C (Frozen)">-18°C (Frozen)</option>
              <option value="Room Temperature">Room Temperature</option>
            </select>
          </div>
        </div>
      </Card>

      {/* System Information */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">System Information</h3>
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created By
            </label>
            <Input
              value={formData.createdBy}
              onChange={(e) => handleInputChange('createdBy', e.target.value)}
              placeholder="Person name"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <Input
              value={formData.createdByRole}
              onChange={(e) => handleInputChange('createdByRole', e.target.value)}
              placeholder="Role"
              readOnly
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="secondary" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          {isEdit ? 'Update' : 'Submit for Approval'}
        </Button>
      </div>
    </div>
  );
}

export type { StockBatchData };