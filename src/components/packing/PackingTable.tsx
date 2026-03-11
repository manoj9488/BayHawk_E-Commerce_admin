import { Eye, Edit2, AlertCircle } from 'lucide-react';
import { Badge } from '../ui';
import type { PackingEntry } from '../../types/packing';

interface PackingTableProps {
  entries: PackingEntry[];
  onView: (entry: PackingEntry) => void;
  onEdit: (entry: PackingEntry) => void;
}

const statusColors = {
  processing: 'bg-yellow-100 text-yellow-800',
  packed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  alternate: 'bg-blue-100 text-blue-800',
};

export function PackingTable({ entries, onView, onEdit }: PackingTableProps) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cutting Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Weight</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Weight</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((entry) => {
              const product = entry.products[0];

              return (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.billNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(entry.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{entry.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      {product.productName}
                      {product.isAlternate && (
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">{product.variant}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.cuttingType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.grossWeight.toFixed(2)} kg</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {product.netWeight ? `${product.netWeight.toFixed(2)} kg` : '-'}
                  </td>
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
          No packing entries found
        </div>
      )}
    </div>
  );
}
