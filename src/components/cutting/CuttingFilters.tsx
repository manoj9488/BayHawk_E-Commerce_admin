import { Filter, Calendar, Package, Scissors, RotateCcw } from 'lucide-react';
import { Input, Button } from '../ui';
import type { CuttingFilters } from '../../types/cutting';

interface CuttingFiltersProps {
  filters: CuttingFilters;
  onFilterChange: (filters: CuttingFilters) => void;
  onReset: () => void;
  products: Array<{ id: string; name: string }>;
  cuttingTypes: Array<{ id: string; name: string }>;
}

export function CuttingFiltersComponent({ filters, onFilterChange, onReset, products, cuttingTypes }: CuttingFiltersProps) {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'misprocessed', label: 'Misprocessed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="h-4 w-4 inline mr-1" />
            From Date
          </label>
          <Input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="h-4 w-4 inline mr-1" />
            To Date
          </label>
          <Input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Scissors className="h-4 w-4 inline mr-1" />
            Cutting Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.cuttingType || ''}
            onChange={(e) => onFilterChange({ ...filters, cuttingType: e.target.value })}
          >
            <option value="">All Types</option>
            {cuttingTypes.map(ct => (
              <option key={ct.id} value={ct.id}>{ct.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Package className="h-4 w-4 inline mr-1" />
            Product
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.productId || ''}
            onChange={(e) => onFilterChange({ ...filters, productId: e.target.value })}
          >
            <option value="">All Products</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
