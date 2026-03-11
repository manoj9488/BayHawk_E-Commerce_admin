import { Eye, Edit2, AlertCircle } from 'lucide-react';
import { Badge } from '../ui';
import type { CuttingEntry } from '../../types/cutting';

interface CuttingTableProps {
  entries: CuttingEntry[];
  onView: (entry: CuttingEntry) => void;
  onEdit: (entry: CuttingEntry) => void;
}

const statusColors = {
  processing: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  misprocessed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export function CuttingTable({ entries, onView, onEdit }: CuttingTableProps) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cutting ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cutting Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Weight</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((entry) => {
              const product = entry.products[0];

              return (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase">{entry.referenceType}</span>
                      <span className="font-medium">{entry.referenceId}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      {product.productName}
                      {product.isAlternate && (
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {product.variantImage && (
                        <img src={product.variantImage} alt={product.variant} className="h-8 w-8 rounded object-cover" />
                      )}
                      <span className="text-sm capitalize">{product.variant}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.cuttingType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.grossWeight.toFixed(2)} kg</td>
                  <td className="px-4 py-3">
                    <Badge className={statusColors[product.status]}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(entry)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(entry)}
                        className="p-1 text-gray-600 hover:text-green-600"
                        title="Update"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {entries.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No cutting entries found
        </div>
      )}
    </div>
  );
}
