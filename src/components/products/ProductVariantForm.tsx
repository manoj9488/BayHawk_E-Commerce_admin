import { X } from 'lucide-react';
import { Button } from '../ui';

interface ProductVariant {
  id: string;
  type: string;
  size: string;
  grossWeight: string;
  netWeight: string;
  pieces: string;
  serves: string;
  skuNumber: string;
  actualPrice: number;
  salesPrice: number;
  stock: number;
  igst: number;
  cgst: number;
  sgst: number;
  cuttingTypeId?: string;
}

interface CuttingType {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface ProductVariantFormProps {
  variant: ProductVariant;
  index: number;
  availableCuttingTypes: CuttingType[];
  canRemove: boolean;
  onVariantChange: (index: number, field: keyof ProductVariant, value: any) => void;
  onRemoveVariant: (index: number) => void;
}

export function ProductVariantForm({
  variant,
  index,
  availableCuttingTypes,
  canRemove,
  onVariantChange,
  onRemoveVariant
}: ProductVariantFormProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Variant {index + 1}</h3>
        {canRemove && (
          <Button 
            onClick={() => onRemoveVariant(index)} 
            variant="secondary" 
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <X className="mr-1 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      {/* First Row: Cutting Type, Gross Weight, Net Weight */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cutting Type
          </label>
          <select
            value={variant.cuttingTypeId || ''}
            onChange={(e) => onVariantChange(index, 'cuttingTypeId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Cutting Type</option>
            {availableCuttingTypes.map(type => (
              <option key={type.id} value={type.id} title={type.description}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gross Weight
          </label>
          <input
            type="text"
            value={variant.grossWeight}
            onChange={(e) => onVariantChange(index, 'grossWeight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="500g"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Net Weight
          </label>
          <input
            type="text"
            value={variant.netWeight}
            onChange={(e) => onVariantChange(index, 'netWeight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="450g"
          />
        </div>
      </div>

      {/* Second Row: Pieces, Serves, SKU Number */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pieces
          </label>
          <input
            type="text"
            value={variant.pieces}
            onChange={(e) => onVariantChange(index, 'pieces', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Serves
          </label>
          <input
            type="text"
            value={variant.serves}
            onChange={(e) => onVariantChange(index, 'serves', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU Number
          </label>
          <input
            type="text"
            value={variant.skuNumber}
            onChange={(e) => onVariantChange(index, 'skuNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="SKU-001"
          />
        </div>
      </div>

      {/* Third Row: Actual Price, Sales Price, Stock */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actual Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₹</span>
            <input
              type="number"
              value={variant.actualPrice}
              onChange={(e) => onVariantChange(index, 'actualPrice', Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sales Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₹</span>
            <input
              type="number"
              value={variant.salesPrice}
              onChange={(e) => onVariantChange(index, 'salesPrice', Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock (kgs)
          </label>
          <input
            type="number"
            value={variant.stock}
            onChange={(e) => onVariantChange(index, 'stock', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
      </div>

      {/* Fourth Row: Tax Information */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IGST (%)
          </label>
          <input
            type="number"
            value={variant.igst}
            onChange={(e) => onVariantChange(index, 'igst', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CGST (%)
          </label>
          <input
            type="number"
            value={variant.cgst}
            onChange={(e) => onVariantChange(index, 'cgst', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SGST (%)
          </label>
          <input
            type="number"
            value={variant.sgst}
            onChange={(e) => onVariantChange(index, 'sgst', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
}