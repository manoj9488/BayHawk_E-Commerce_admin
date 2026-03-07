import { Edit2, Eye, ArrowRightLeft } from 'lucide-react';
import { Badge } from '../ui';
import type { Purchase } from '../../types/purchase';

interface PurchaseTableProps {
  purchases: Purchase[];
  onEdit: (purchase: Purchase) => void;
  onView: (purchase: Purchase) => void;
}

const statusColors = {
  processing: 'bg-yellow-100 text-yellow-800',
  purchased: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  alternate: 'bg-blue-100 text-blue-800',
};

export function PurchaseTable({ purchases, onEdit, onView }: PurchaseTableProps) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Weight</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {purchases.map((purchase) => {
              const totalWeight = purchase.products.reduce((sum, p) => sum + p.grossWeight, 0);
              const totalPrice = purchase.products.reduce((sum, p) => sum + (p.purchasePrice * p.countMax), 0);
              const hasAlternate = purchase.products.some(p => p.isAlternate);
              const mainStatus = purchase.products[0]?.status || 'processing';

              return (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{purchase.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{purchase.supplierName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {purchase.products.length} item(s)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{totalWeight.toFixed(2)} kg</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[mainStatus]}>
                        {mainStatus}
                      </Badge>
                      {hasAlternate && (
                        <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(purchase)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(purchase)}
                        className="p-1 text-gray-600 hover:text-green-600"
                        title="Edit"
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
      
      {purchases.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No purchases found
        </div>
      )}
    </div>
  );
}
