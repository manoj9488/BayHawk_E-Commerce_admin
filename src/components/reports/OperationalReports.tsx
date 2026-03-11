import { useState } from 'react';
import { Card } from '../ui';
import { ExportButtons } from './ExportButtons';
import { Package, Scissors, FileText, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockPackingData = [
  { date: '2024-01-01', packed: 145, time: 8.5, efficiency: 92, staff: 'Team A' },
  { date: '2024-01-02', packed: 162, time: 7.8, efficiency: 95, staff: 'Team B' },
  { date: '2024-01-03', packed: 138, time: 9.2, efficiency: 88, staff: 'Team A' },
  { date: '2024-01-04', packed: 175, time: 7.2, efficiency: 98, staff: 'Team C' },
  { date: '2024-01-05', packed: 156, time: 8.1, efficiency: 94, staff: 'Team B' },
];

const mockProcurementData = [
  { supplier: 'ABC Farms', orders: 25, amount: 125000, onTime: 92, category: 'Poultry' },
  { supplier: 'XYZ Meat Co', orders: 18, amount: 95000, onTime: 88, category: 'Meat' },
  { supplier: 'Fresh Catch', orders: 15, amount: 75000, onTime: 95, category: 'Seafood' },
  { supplier: 'Dairy Plus', orders: 12, amount: 45000, onTime: 98, category: 'Dairy' },
];

const mockLabelingData = [
  { product: 'Fresh Chicken', labels: 450, accuracy: 98.5, type: 'Standard' },
  { product: 'Mutton Premium', labels: 280, accuracy: 97.2, type: 'Premium' },
  { product: 'Fish Fillet', labels: 320, accuracy: 99.1, type: 'Fresh' },
  { product: 'Prawns Large', labels: 180, accuracy: 96.8, type: 'Frozen' },
];

const mockCuttingData = [
  { type: 'Curry Cut', orders: 320, time: 5.2, popularity: 85 },
  { type: 'Boneless', orders: 280, time: 8.5, popularity: 92 },
  { type: 'Whole', orders: 150, time: 2.1, popularity: 65 },
  { type: 'Fry Cut', orders: 200, time: 6.8, popularity: 78 },
];

const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const OperationalReports = () => {
  const [activeTab, setActiveTab] = useState('packing');

  const getExportData = () => {
    switch (activeTab) {
      case 'packing':
        return {
          headers: ['Date', 'Items Packed', 'Avg Time (min)', 'Efficiency %', 'Staff'],
          data: mockPackingData.map(item => ({
            Date: item.date,
            'Items Packed': item.packed,
            'Avg Time (min)': item.time,
            'Efficiency %': item.efficiency,
            Staff: item.staff
          })),
          filename: 'packing-report'
        };
      case 'procurement':
        return {
          headers: ['Supplier', 'Orders', 'Amount', 'On-Time %', 'Category'],
          data: mockProcurementData.map(item => ({
            Supplier: item.supplier,
            Orders: item.orders,
            Amount: item.amount,
            'On-Time %': item.onTime,
            Category: item.category
          })),
          filename: 'procurement-report'
        };
      case 'labeling':
        return {
          headers: ['Product', 'Labels', 'Accuracy %', 'Type'],
          data: mockLabelingData.map(item => ({
            Product: item.product,
            Labels: item.labels,
            'Accuracy %': item.accuracy,
            Type: item.type
          })),
          filename: 'labeling-report'
        };
      case 'cutting':
        return {
          headers: ['Cutting Type', 'Orders', 'Avg Time (min)', 'Popularity %'],
          data: mockCuttingData.map(item => ({
            'Cutting Type': item.type,
            Orders: item.orders,
            'Avg Time (min)': item.time,
            'Popularity %': item.popularity
          })),
          filename: 'cutting-type-report'
        };
      default:
        return { headers: [], data: [], filename: 'report' };
    }
  };

  const tabs = [
    { id: 'packing', label: 'Packing Report', icon: Package },
    { id: 'procurement', label: 'Procurement Report', icon: ShoppingCart },
    { id: 'labeling', label: 'Labeling Report', icon: FileText },
    { id: 'cutting', label: 'Cutting Type Report', icon: Scissors },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Operational Reports</h2>
          <p className="text-sm text-gray-600">Comprehensive operational performance metrics</p>
        </div>
        <ExportButtons data={getExportData()} />
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Packing Report */}
      {activeTab === 'packing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Packed</p>
                  <p className="text-2xl font-bold">{mockPackingData.reduce((sum, item) => sum + item.packed, 0)}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Efficiency</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(mockPackingData.reduce((sum, item) => sum + item.efficiency, 0) / mockPackingData.length).toFixed(1)}%
                  </p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Time</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(mockPackingData.reduce((sum, item) => sum + item.time, 0) / mockPackingData.length).toFixed(1)} min
                  </p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Packing Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockPackingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="packed" fill="#3B82F6" name="Items Packed" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Procurement Report */}
      {activeTab === 'procurement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{mockProcurementData.reduce((sum, item) => sum + item.orders, 0)}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{(mockProcurementData.reduce((sum, item) => sum + item.amount, 0) / 100000).toFixed(1)}L
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg On-Time</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(mockProcurementData.reduce((sum, item) => sum + item.onTime, 0) / mockProcurementData.length).toFixed(1)}%
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-purple-600" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Supplier Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Supplier</th>
                      <th className="text-left py-2">Orders</th>
                      <th className="text-left py-2">On-Time %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProcurementData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.supplier}</td>
                        <td className="py-2">{item.orders}</td>
                        <td className={`py-2 font-medium ${item.onTime > 90 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.onTime}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={mockProcurementData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {mockProcurementData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {/* Labeling Report */}
      {activeTab === 'labeling' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Labels</p>
                  <p className="text-2xl font-bold">{mockLabelingData.reduce((sum, item) => sum + item.labels, 0)}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(mockLabelingData.reduce((sum, item) => sum + item.accuracy, 0) / mockLabelingData.length).toFixed(1)}%
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Label Types</p>
                  <p className="text-2xl font-bold text-purple-600">4</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Labeling Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">Labels</th>
                    <th className="text-left py-3 px-4">Accuracy</th>
                    <th className="text-left py-3 px-4">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLabelingData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.product}</td>
                      <td className="py-3 px-4">{item.labels}</td>
                      <td className={`py-3 px-4 font-medium ${item.accuracy > 98 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {item.accuracy}%
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{item.type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Cutting Type Report */}
      {activeTab === 'cutting' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{mockCuttingData.reduce((sum, item) => sum + item.orders, 0)}</p>
                </div>
                <Scissors className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Most Popular</p>
                  <p className="text-lg font-bold text-green-600">Boneless</p>
                </div>
                <Scissors className="h-8 w-8 text-green-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Time</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(mockCuttingData.reduce((sum, item) => sum + item.time, 0) / mockCuttingData.length).toFixed(1)} min
                  </p>
                </div>
                <Scissors className="h-8 w-8 text-purple-600" />
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cutting Type Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockCuttingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3B82F6" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};
