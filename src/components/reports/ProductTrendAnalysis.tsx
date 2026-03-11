import { useState } from 'react';
import { Card, Button } from '../ui';
import { TrendingUp, TrendingDown, BarChart3, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TrendData {
  period: string;
  sales: number;
  orders: number;
  revenue: number;
}

interface ProductTrend {
  product: string;
  category: string;
  currentSales: number;
  previousSales: number;
  growth: number;
  trend: 'up' | 'down' | 'stable';
  popularity: number;
}

const mockTrendData: TrendData[] = [
  { period: 'Jan', sales: 1200, orders: 450, revenue: 85000 },
  { period: 'Feb', sales: 1350, orders: 520, revenue: 92000 },
  { period: 'Mar', sales: 1180, orders: 480, revenue: 88000 },
  { period: 'Apr', sales: 1450, orders: 580, revenue: 98000 },
  { period: 'May', sales: 1620, orders: 640, revenue: 105000 },
  { period: 'Jun', sales: 1580, orders: 620, revenue: 102000 },
];

const mockProductTrends: ProductTrend[] = [
  { product: 'Fresh Chicken', category: 'Poultry', currentSales: 850, previousSales: 720, growth: 18.1, trend: 'up', popularity: 95 },
  { product: 'Mutton Premium', category: 'Meat', currentSales: 420, previousSales: 480, growth: -12.5, trend: 'down', popularity: 78 },
  { product: 'Fish Fillet', category: 'Seafood', currentSales: 320, previousSales: 280, growth: 14.3, trend: 'up', popularity: 82 },
  { product: 'Prawns Large', category: 'Seafood', currentSales: 180, previousSales: 160, growth: 12.5, trend: 'up', popularity: 88 },
  { product: 'Eggs Organic', category: 'Dairy', currentSales: 650, previousSales: 670, growth: -3.0, trend: 'stable', popularity: 91 },
];

const categoryData = [
  { name: 'Poultry', value: 45, color: '#3B82F6' },
  { name: 'Meat', value: 25, color: '#EF4444' },
  { name: 'Seafood', value: 20, color: '#10B981' },
  { name: 'Dairy', value: 10, color: '#F59E0B' },
];

export const ProductTrendAnalysis = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [viewType, setViewType] = useState('sales');

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-semibold">Product Trend Analysis</h2>
            <p className="text-sm text-gray-600">Track product performance and market trends</p>
          </div>
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
          <Button size="sm" variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Performer</p>
              <p className="text-lg font-bold text-green-600">Fresh Chicken</p>
              <p className="text-xs text-green-600">+18.1% growth</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Declining Product</p>
              <p className="text-lg font-bold text-red-600">Mutton Premium</p>
              <p className="text-xs text-red-600">-12.5% decline</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Growth</p>
              <p className="text-2xl font-bold text-blue-600">+5.9%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trending Products</p>
              <p className="text-2xl font-bold text-purple-600">3</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Sales Trend</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewType('sales')}
                className={`px-3 py-1 text-sm rounded ${viewType === 'sales' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                Sales
              </button>
              <button
                onClick={() => setViewType('revenue')}
                className={`px-3 py-1 text-sm rounded ${viewType === 'revenue' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                Revenue
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey={viewType} 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Category Share</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Product Performance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Product Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Current Sales</th>
                <th className="text-left py-3 px-4">Previous Sales</th>
                <th className="text-left py-3 px-4">Growth</th>
                <th className="text-left py-3 px-4">Trend</th>
                <th className="text-left py-3 px-4">Popularity</th>
              </tr>
            </thead>
            <tbody>
              {mockProductTrends.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{item.product}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">{item.currentSales}</td>
                  <td className="py-3 px-4">{item.previousSales}</td>
                  <td className={`py-3 px-4 font-medium ${getGrowthColor(item.growth)}`}>
                    {item.growth > 0 ? '+' : ''}{item.growth}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(item.trend)}
                      <span className="capitalize text-sm">{item.trend}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.popularity}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{item.popularity}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-medium text-green-800">Growing Categories</h4>
                <p className="text-sm text-green-700 mt-1">Poultry and Seafood showing strong upward trends with 15%+ growth</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-red-600 mt-1" />
              <div>
                <h4 className="font-medium text-red-800">Declining Products</h4>
                <p className="text-sm text-red-700 mt-1">Mutton Premium needs attention - consider promotional strategies</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
