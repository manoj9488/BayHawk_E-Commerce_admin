import { useState } from 'react';
import { Card } from '../ui';
import { ExportButtons } from './ExportButtons';
import { ShoppingCart, TrendingUp, Calendar, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockOrderData = [
  { month: 'Jan', orders: 1250, completed: 1180, cancelled: 70, revenue: 125000 },
  { month: 'Feb', orders: 1380, completed: 1320, cancelled: 60, revenue: 138000 },
  { month: 'Mar', orders: 1420, completed: 1350, cancelled: 70, revenue: 142000 },
  { month: 'Apr', orders: 1580, completed: 1520, cancelled: 60, revenue: 158000 },
  { month: 'May', orders: 1650, completed: 1590, cancelled: 60, revenue: 165000 },
  { month: 'Jun', orders: 1720, completed: 1680, cancelled: 40, revenue: 172000 },
];

const mockOrderTrends = [
  { product: 'Fresh Chicken', orders: 450, trend: 15.2, category: 'Poultry' },
  { product: 'Mutton Premium', orders: 280, trend: -8.5, category: 'Meat' },
  { product: 'Fish Fillet', orders: 320, trend: 12.8, category: 'Seafood' },
  { product: 'Prawns Large', orders: 180, trend: 22.4, category: 'Seafood' },
  { product: 'Eggs Organic', orders: 520, trend: 5.6, category: 'Dairy' },
];

export const OrderReports = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const exportData = {
    headers: ['Month', 'Total Orders', 'Completed', 'Cancelled', 'Revenue'],
    data: mockOrderData.map(item => ({
      Month: item.month,
      'Total Orders': item.orders,
      Completed: item.completed,
      Cancelled: item.cancelled,
      Revenue: item.revenue
    })),
    filename: 'order-report'
  };

  const totalOrders = mockOrderData.reduce((sum, item) => sum + item.orders, 0);
  const completionRate = ((mockOrderData.reduce((sum, item) => sum + item.completed, 0) / totalOrders) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Order Reports & Trends</h2>
          <p className="text-sm text-gray-600">Track order performance and trends</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="12months">12 Months</option>
          </select>
          <ExportButtons data={exportData} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Daily Orders</p>
              <p className="text-2xl font-bold">{Math.round(totalOrders / 180)}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Category</p>
              <p className="text-lg font-bold text-orange-600">Poultry</p>
            </div>
            <Package className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Order Trends Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Volume Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockOrderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} name="Total Orders" />
            <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} name="Completed" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Product Order Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Product Order Trends</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Orders</th>
                <th className="text-left py-3 px-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {mockOrderTrends.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{item.product}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{item.category}</span>
                  </td>
                  <td className="py-3 px-4">{item.orders}</td>
                  <td className={`py-3 px-4 font-medium ${item.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.trend > 0 ? '+' : ''}{item.trend}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
