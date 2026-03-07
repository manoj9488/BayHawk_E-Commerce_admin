import { useState } from 'react';
import { Filter } from 'lucide-react';

interface PurchaseItem {
  id: string;
  productName: string;
  variant: string;
  count: { min: number; max: number };
  grossWeight: number;
  basePrice: { min: number; max: number };
  purchasePriceEntry: string;
  status: string;
  remarks: string;
}

interface CuttingCleaningItem {
  id: string;
  productName: string;
  variant: string;
  varientImage: string;
  cuttingType: string;
  grossWeight: number;
  status: string;
  remarks: string;
}

export default function ProcurementPage() {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([
    {
      id: '1',
      productName: 'Anchovy | ನೆತ್ತಿಲಿ',
      variant: 'Medium',
      count: { min: 20, max: 30 },
      grossWeight: 0.5,
      basePrice: { min: 150, max: 250 },
      purchasePriceEntry: '',
      status: 'Purchased',
      remarks: ''
    },
    {
      id: '2',
      productName: 'Black Pomfret | ಕರುಪ್ಪು ವಾವಲ್',
      variant: 'Medium',
      count: { min: 2, max: 3 },
      grossWeight: 2,
      basePrice: { min: 500, max: 650 },
      purchasePriceEntry: '',
      status: 'Cancelled',
      remarks: ''
    }
  ]);

  const [cuttingItems, setCuttingItems] = useState<CuttingCleaningItem[]>([
    {
      id: '1',
      productName: 'Anchovy | ನೆತ್ತಿಲಿ',
      variant: 'Medium',
      varientImage: '',
      cuttingType: 'Headed and Gutted',
      grossWeight: 0.5,
      status: 'Completed',
      remarks: ''
    },
    {
      id: '2',
      productName: 'Anchovy | ನೆತ್ತಿಲಿ',
      variant: 'Medium',
      varientImage: '',
      cuttingType: 'Uncleaned',
      grossWeight: 0.5,
      status: 'Unprocessed',
      remarks: ''
    },
    {
      id: '3',
      productName: 'Black Pomfret | ಕರುಪ್ಪು ವಾವಲ್',
      variant: 'Medium',
      varientImage: '',
      cuttingType: 'Steaks',
      grossWeight: 0.5,
      status: 'Processing',
      remarks: ''
    },
    {
      id: '4',
      productName: 'Red Snapper | ಸಿಂಗಾರಿ',
      variant: 'Medium',
      varientImage: '',
      cuttingType: 'Gilled and Gutted',
      grossWeight: 1,
      status: '',
      remarks: ''
    }
  ]);

  const [filters, setFilters] = useState({
    dateRange: '',
    status: '',
    product: ''
  });

  const [cuttingFilters, setCuttingFilters] = useState({
    dateRange: '',
    status: '',
    cuttingType: '',
    product: ''
  });

  const updateStatus = (id: string, newStatus: string) => {
    setPurchases(purchases.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const updateCuttingStatus = (id: string, newStatus: string) => {
    setCuttingItems(cuttingItems.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Procurement</h1>
        <p className="text-gray-600">
          Below snip is the reference of information required to purchase. After the purchase done
          status could be manually changed by the respective person.
        </p>
        <ul className="list-disc ml-6 mt-2 text-sm text-gray-600">
          <li>Default status - "Processing"</li>
          <li>Filters - Date range, Status & Product</li>
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
          <option value="Purchased">Purchased</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Alternate">Alternate</option>
        </select>
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
          <div className="grid grid-cols-9 gap-4 p-4">
            <div>Product Name</div>
            <div>Varient</div>
            <div>Count<br/><span className="text-xs">Min. Max.</span></div>
            <div>Gross weight</div>
            <div>Base Price<br/><span className="text-xs">Min. Max.</span></div>
            <div>Purchase Price Entry</div>
            <div>Status</div>
            <div>Remarks</div>
          </div>
        </div>

        {purchases.map((item) => (
          <div
            key={item.id}
            className={`grid grid-cols-9 gap-4 p-4 border-b ${
              item.status === 'Cancelled' ? 'bg-yellow-100' : ''
            }`}
          >
            <div>{item.productName}</div>
            <div>{item.variant}</div>
            <div>{item.count.min} {item.count.max}</div>
            <div>{item.grossWeight}</div>
            <div>{item.basePrice.min} {item.basePrice.max}</div>
            <div>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={item.purchasePriceEntry}
                onChange={(e) =>
                  setPurchases(
                    purchases.map((p) =>
                      p.id === item.id ? { ...p, purchasePriceEntry: e.target.value } : p
                    )
                  )
                }
              />
            </div>
            <div>
              <select
                className={`border rounded px-2 py-1 w-full ${
                  item.status === 'Purchased' ? 'bg-green-500 text-white' :
                  item.status === 'Cancelled' ? 'bg-red-500 text-white' :
                  item.status === 'Alternate' ? 'bg-orange-500 text-white' :
                  'bg-yellow-500 text-white'
                }`}
                value={item.status}
                onChange={(e) => updateStatus(item.id, e.target.value)}
              >
                <option value="Processing">Processing</option>
                <option value="Purchased">Purchased</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Alternate">Alternate</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={item.remarks}
                onChange={(e) =>
                  setPurchases(
                    purchases.map((p) =>
                      p.id === item.id ? { ...p, remarks: e.target.value } : p
                    )
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Cutting & Cleaning Section */}
      <div className="mt-12 mb-6">
        <h1 className="text-2xl font-bold mb-2">Cutting & Cleaning</h1>
        <p className="text-gray-600">
          Below snip is the reference of information required for Cutting & Cleaning. After the
          Cutting & Cleaning done status could be manually changed by the respective person.
        </p>
        <ul className="list-disc ml-6 mt-2 text-sm text-gray-600">
          <li>Default status - "Processing"</li>
          <li>Filters - Date range, Status, Cutting type & Product</li>
        </ul>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <Filter className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Date range"
          className="border rounded px-3 py-2"
          value={cuttingFilters.dateRange}
          onChange={(e) => setCuttingFilters({ ...cuttingFilters, dateRange: e.target.value })}
        />
        <select
          className="border rounded px-3 py-2"
          value={cuttingFilters.status}
          onChange={(e) => setCuttingFilters({ ...cuttingFilters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Unprocessed">Unprocessed</option>
        </select>
        <input
          type="text"
          placeholder="Cutting type"
          className="border rounded px-3 py-2"
          value={cuttingFilters.cuttingType}
          onChange={(e) => setCuttingFilters({ ...cuttingFilters, cuttingType: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product"
          className="border rounded px-3 py-2"
          value={cuttingFilters.product}
          onChange={(e) => setCuttingFilters({ ...cuttingFilters, product: e.target.value })}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-blue-500 text-white font-semibold">
          <div className="grid grid-cols-7 gap-4 p-4">
            <div>Product Name</div>
            <div>Varient</div>
            <div>Varient Images</div>
            <div>Cutting Type</div>
            <div>Gross Weight</div>
            <div>Status</div>
            <div>Remarks</div>
          </div>
        </div>

        {cuttingItems.map((item) => (
          <div
            key={item.id}
            className={`grid grid-cols-7 gap-4 p-4 border-b ${
              item.status === 'Unprocessed' ? 'bg-yellow-100' : ''
            }`}
          >
            <div>{item.productName}</div>
            <div>{item.variant}</div>
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">Image</span>
              </div>
            </div>
            <div>{item.cuttingType}</div>
            <div>{item.grossWeight}</div>
            <div>
              <select
                className={`border rounded px-2 py-1 w-full ${
                  item.status === 'Completed' ? 'bg-green-500 text-white' :
                  item.status === 'Unprocessed' ? 'bg-red-500 text-white' :
                  item.status === 'Processing' ? 'bg-yellow-500 text-white' :
                  'bg-gray-200'
                }`}
                value={item.status}
                onChange={(e) => updateCuttingStatus(item.id, e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Unprocessed">Unprocessed</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={item.remarks}
                onChange={(e) =>
                  setCuttingItems(
                    cuttingItems.map((c) =>
                      c.id === item.id ? { ...c, remarks: e.target.value } : c
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
