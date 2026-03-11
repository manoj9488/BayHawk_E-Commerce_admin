import { useState } from 'react';
import { Filter } from 'lucide-react';

interface PackingItem {
  id: string;
  orderId: string;
  customerName: string;
  productName: string;
  variant: string;
  quantity: number;
  cuttingType: string;
  status: string;
  remarks: string;
}

export default function PackingPage() {
  const [packingItems, setPackingItems] = useState<PackingItem[]>([
    {
      id: '1',
      orderId: 'ORD-001',
      customerName: 'John Doe',
      productName: 'Anchovy | ನೆತ್ತಿಲಿ',
      variant: 'Medium',
      quantity: 2,
      cuttingType: 'Headed and Gutted',
      status: 'Processing',
      remarks: ''
    },
    {
      id: '2',
      orderId: 'ORD-002',
      customerName: 'Jane Smith',
      productName: 'Black Pomfret | ಕರುಪ್ಪು ವಾವಲ್',
      variant: 'Large',
      quantity: 1,
      cuttingType: 'Steaks',
      status: 'Completed',
      remarks: ''
    }
  ]);

  const [filters, setFilters] = useState({
    dateRange: '',
    status: '',
    customer: '',
    product: ''
  });

  const updateStatus = (id: string, newStatus: string) => {
    setPackingItems(packingItems.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Packing</h1>
        <p className="text-gray-600">
          Below snip is the reference of information required for Packing. After the Packing done
          status could be manually changed by the respective person.
        </p>
        <ul className="list-disc ml-6 mt-2 text-sm text-gray-600">
          <li>Default status - "Processing"</li>
          <li>Filters - Date range, Status, Customer & Product</li>
        </ul>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <Filter className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Date range"
          className="border rounded px-3 py-2"
          value={filters.dateRange}
          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
        />
        <select
          className="border rounded px-3 py-2"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
        <input
          type="text"
          placeholder="Customer"
          className="border rounded px-3 py-2"
          value={filters.customer}
          onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product"
          className="border rounded px-3 py-2"
          value={filters.product}
          onChange={(e) => setFilters({ ...filters, product: e.target.value })}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-blue-500 text-white font-semibold">
          <div className="grid grid-cols-8 gap-4 p-4">
            <div>Order ID</div>
            <div>Customer Name</div>
            <div>Product Name</div>
            <div>Variant</div>
            <div>Quantity</div>
            <div>Cutting Type</div>
            <div>Status</div>
            <div>Remarks</div>
          </div>
        </div>

        {packingItems.map((item) => (
          <div key={item.id} className="grid grid-cols-8 gap-4 p-4 border-b">
            <div>{item.orderId}</div>
            <div>{item.customerName}</div>
            <div>{item.productName}</div>
            <div>{item.variant}</div>
            <div>{item.quantity}</div>
            <div>{item.cuttingType}</div>
            <div>
              <select
                className={`border rounded px-2 py-1 w-full ${
                  item.status === 'Completed' ? 'bg-green-500 text-white' :
                  item.status === 'Pending' ? 'bg-red-500 text-white' :
                  'bg-yellow-500 text-white'
                }`}
                value={item.status}
                onChange={(e) => updateStatus(item.id, e.target.value)}
              >
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={item.remarks}
                onChange={(e) =>
                  setPackingItems(
                    packingItems.map((p) =>
                      p.id === item.id ? { ...p, remarks: e.target.value } : p
                    )
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
