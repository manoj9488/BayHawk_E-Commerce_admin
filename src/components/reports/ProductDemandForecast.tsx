import { useState } from 'react';
import { Card, Button } from '../ui';
import { TrendingUp, Calendar, Package, AlertTriangle, Download, BarChart3, Activity, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface ForecastData {
  month: string;
  predicted: number;
  actual?: number;
  confidence: number;
}

interface ProductDemand {
  product: string;
  currentStock: number;
  predictedDemand: number;
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
}

const mockForecastData: ForecastData[] = [
  { month: 'Jan', predicted: 1200, actual: 1150, confidence: 85 },
  { month: 'Feb', predicted: 1350, actual: 1320, confidence: 88 },
  { month: 'Mar', predicted: 1500, actual: 1480, confidence: 90 },
  { month: 'Apr', predicted: 1650, confidence: 87 },
  { month: 'May', predicted: 1800, confidence: 85 },
  { month: 'Jun', predicted: 1950, confidence: 82 },
];

const mockProductDemands: ProductDemand[] = [
  { product: 'Fresh Chicken', currentStock: 500, predictedDemand: 750, riskLevel: 'high', trend: 'up' },
  { product: 'Mutton Premium', currentStock: 200, predictedDemand: 180, riskLevel: 'low', trend: 'stable' },
  { product: 'Fish Fillet', currentStock: 150, predictedDemand: 220, riskLevel: 'medium', trend: 'up' },
  { product: 'Prawns Large', currentStock: 80, predictedDemand: 120, riskLevel: 'high', trend: 'up' },
  { product: 'Eggs Organic', currentStock: 300, predictedDemand: 280, riskLevel: 'low', trend: 'down' },
];

const categoryPerformance = [
  { category: 'Chicken', demand: 750, stock: 500, gap: 250 },
  { category: 'Mutton', demand: 180, stock: 200, gap: -20 },
  { category: 'Fish', demand: 220, stock: 150, gap: 70 },
  { category: 'Prawns', demand: 120, stock: 80, gap: 40 },
  { category: 'Eggs', demand: 280, stock: 300, gap: -20 },
];

const riskColors = {
  low: '#10B981',
  medium: '#F59E0B', 
  high: '#EF4444'
};

export const ProductDemandForecast = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed'>('overview');

  const getRiskColor = (level: string) => riskColors[level as keyof typeof riskColors];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '➡️';
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with View Toggle */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Product Demand Forecast Analysis</h2>
              <p className="text-blue-100 mt-1">AI-powered demand prediction and inventory planning</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setSelectedView('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === 'overview' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedView('detailed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === 'detailed' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'
                }`}
              >
                Detailed
              </button>
            </div>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white backdrop-blur-sm"
            >
              <option value="3months" className="text-gray-900">3 Months</option>
              <option value="6months" className="text-gray-900">6 Months</option>
              <option value="12months" className="text-gray-900">12 Months</option>
            </select>
            <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Forecast Accuracy</p>
              <p className="text-3xl font-bold text-green-600 mt-2">87.5%</p>
              <p className="text-xs text-green-600 mt-1">↑ 2.3% from last month</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">High Risk Items</p>
              <p className="text-3xl font-bold text-red-600 mt-2">2</p>
              <p className="text-xs text-red-600 mt-1">Requires immediate action</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Predicted Growth</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">+15.2%</p>
              <p className="text-xs text-blue-600 mt-1">Next 6 months trend</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Stock Coverage</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">18 Days</p>
              <p className="text-xs text-purple-600 mt-1">Average across products</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast Trend Chart */}
        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Demand Forecast Trend</h3>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              6 Months Projection
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mockForecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Actual Demand"
                dot={{ fill: '#10B981', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#3B82F6" 
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Predicted Demand"
                dot={{ fill: '#3B82F6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Performance Chart */}
        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Category Demand vs Stock</h3>
            </div>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
              Current Status
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="demand" fill="#8B5CF6" name="Predicted Demand" radius={[8, 8, 0, 0]} />
              <Bar dataKey="stock" fill="#10B981" name="Current Stock" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Product Risk Analysis Table */}
      <Card className="p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold">Product Risk Analysis</h3>
          </div>
          <div className="flex gap-2">
            <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
              2 High Risk
            </span>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
              1 Medium Risk
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              2 Low Risk
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">Product Name</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">Current Stock</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">Predicted Demand</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">Gap</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">Risk Level</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">Trend</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockProductDemands.map((item, index) => {
                const gap = item.predictedDemand - item.currentStock;
                return (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{item.product}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-700">{item.currentStock} kg</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-700">{item.predictedDemand} kg</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {gap > 0 ? '+' : ''}{gap} kg
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-white inline-block"
                        style={{ backgroundColor: getRiskColor(item.riskLevel) }}
                      >
                        {item.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="text-lg">{getTrendIcon(item.trend)}</span>
                        <span className="capitalize text-gray-700">{item.trend}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {item.riskLevel === 'high' && (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          Reorder Now
                        </Button>
                      )}
                      {item.riskLevel === 'medium' && (
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                          Monitor
                        </Button>
                      )}
                      {item.riskLevel === 'low' && (
                        <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                          <span className="text-lg">✓</span> Optimal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Recommendations Section */}
      <Card className="p-6 shadow-md bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI-Powered Recommendations</h3>
            <p className="text-sm text-gray-600">Smart insights to optimize your inventory</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">URGENT</span>
                  <span className="text-xs text-gray-500">Stock Alert</span>
                </div>
                <p className="font-semibold text-red-800 mb-1">Fresh Chicken Critical</p>
                <p className="text-sm text-gray-700 mb-3">Stock depletes in 3 days. Order 400kg immediately to avoid stockout.</p>
                <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Create Order
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-yellow-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">OPPORTUNITY</span>
                  <span className="text-xs text-gray-500">Demand Surge</span>
                </div>
                <p className="font-semibold text-yellow-800 mb-1">Prawns Demand Rising</p>
                <p className="text-sm text-gray-700 mb-3">50% increase predicted. Boost stock by 30% to capture demand.</p>
                <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                  Adjust Stock
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">OPTIMIZE</span>
                  <span className="text-xs text-gray-500">Overstock</span>
                </div>
                <p className="font-semibold text-blue-800 mb-1">Eggs Organic Surplus</p>
                <p className="text-sm text-gray-700 mb-3">Stock exceeds demand. Run promotion to clear inventory faster.</p>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Create Offer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
