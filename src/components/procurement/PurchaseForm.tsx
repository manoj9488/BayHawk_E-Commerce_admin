import { useState } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Modal, Input, Button } from '../ui';
import type { Purchase, PurchaseProduct } from '../../types/purchase';

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (purchase: Partial<Purchase>) => void;
  purchase?: Purchase;
  moduleType: 'hub' | 'store';
  userName: string;
  products: Array<{ id: string; name: string; category: string }>;
}

export function PurchaseForm({ isOpen, onClose, onSubmit, purchase, moduleType, userName, products }: PurchaseFormProps) {
  const [formData, setFormData] = useState({
    purchaseDate: purchase?.purchaseDate || new Date().toISOString().split('T')[0],
    supplierName: purchase?.supplierName || '',
    remarks: purchase?.remarks || '',
  });

  const [productRows, setProductRows] = useState<Partial<PurchaseProduct>[]>(
    purchase?.products || [{
      productId: '',
      productName: '',
      variant: 'medium' as const,
      countMin: 0,
      countMax: 0,
      grossWeight: 0,
      basePriceMin: 0,
      basePriceMax: 0,
      purchasePrice: 0,
      status: 'processing' as const,
      remarks: '',
      isAlternate: false,
    }]
  );

  const addProductRow = () => {
    setProductRows([...productRows, {
      productId: '',
      productName: '',
      variant: 'medium',
      countMin: 0,
      countMax: 0,
      grossWeight: 0,
      basePriceMin: 0,
      basePriceMax: 0,
      purchasePrice: 0,
      status: 'processing',
      remarks: '',
      isAlternate: false,
    }]);
  };

  const removeProductRow = (index: number) => {
    setProductRows(productRows.filter((_, i) => i !== index));
  };

  const updateProductRow = (index: number, field: string, value: any) => {
    const updated = [...productRows];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        updated[index].productName = product.name;
      }
    }
    
    setProductRows(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    for (let i = 0; i < productRows.length; i++) {
      const row = productRows[i];
      
      if (row.countMin && row.countMax && row.countMin > row.countMax) {
        alert(`Product #${i + 1}: Count Min cannot be greater than Count Max`);
        return;
      }
      
      if (row.status === 'alternate' && !row.alternateProductId) {
        alert(`Product #${i + 1}: Please select an alternate product`);
        return;
      }
    }
    
    const purchaseData: Partial<Purchase> = {
      ...formData,
      moduleType,
      createdBy: userName,
      products: productRows as PurchaseProduct[],
      updatedAt: new Date().toISOString(),
      updatedBy: userName,
    };

    onSubmit(purchaseData);
  };

  const isPriceOutOfRange = (row: Partial<PurchaseProduct>) => {
    if (!row.purchasePrice || !row.basePriceMin || !row.basePriceMax) return false;
    return row.purchasePrice < row.basePriceMin || row.purchasePrice > row.basePriceMax;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={purchase ? 'Edit Purchase' : 'Create Purchase'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section A - Basic Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Purchase Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                placeholder="Enter supplier name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module Type</label>
              <Input value={moduleType.toUpperCase()} disabled />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Optional notes about this purchase"
            />
          </div>
        </div>

        {/* Section B - Product Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Product Purchase Grid</h3>
            <Button type="button" onClick={addProductRow} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Product
            </Button>
          </div>

          <div className="space-y-4">
            {productRows.map((row, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Product #{index + 1}</span>
                  {productRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProductRow(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={row.productId}
                      onChange={(e) => updateProductRow(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={row.variant}
                      onChange={(e) => updateProductRow(index, 'variant', e.target.value)}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Count Min</label>
                    <Input
                      type="number"
                      value={row.countMin}
                      onChange={(e) => updateProductRow(index, 'countMin', parseFloat(e.target.value))}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Count Max</label>
                    <Input
                      type="number"
                      value={row.countMax}
                      onChange={(e) => updateProductRow(index, 'countMax', parseFloat(e.target.value))}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gross Weight (kg)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={row.grossWeight}
                      onChange={(e) => updateProductRow(index, 'grossWeight', parseFloat(e.target.value))}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price Min</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={row.basePriceMin}
                      onChange={(e) => updateProductRow(index, 'basePriceMin', parseFloat(e.target.value))}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price Max</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={row.basePriceMax}
                      onChange={(e) => updateProductRow(index, 'basePriceMax', parseFloat(e.target.value))}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase Price <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={row.purchasePrice}
                      onChange={(e) => updateProductRow(index, 'purchasePrice', parseFloat(e.target.value))}
                      min="0"
                      required
                    />
                    {isPriceOutOfRange(row) && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-yellow-600">
                        <AlertTriangle className="h-3 w-3" />
                        Price outside base range
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={row.status}
                      onChange={(e) => updateProductRow(index, 'status', e.target.value)}
                    >
                      <option value="processing">Processing</option>
                      <option value="purchased">Purchased</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="alternate">Alternate</option>
                    </select>
                  </div>

                  {row.status === 'alternate' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternate Product <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={row.alternateProductId}
                        onChange={(e) => {
                          updateProductRow(index, 'alternateProductId', e.target.value);
                          updateProductRow(index, 'originalProductId', row.productId);
                          updateProductRow(index, 'isAlternate', true);
                        }}
                        required
                      >
                        <option value="">Select Alternate</option>
                        {products.filter(p => p.id !== row.productId).map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <Input
                      value={row.remarks}
                      onChange={(e) => updateProductRow(index, 'remarks', e.target.value)}
                      placeholder="Optional comments"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {purchase ? 'Update Purchase' : 'Create Purchase'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
