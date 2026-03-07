import { useState } from 'react';
import { Card } from '../ui';
import { ExportButtons } from './ExportButtons';
import { IndianRupee, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockRevenueData = [
  { month: 'Jan', revenue: 125000, previousYear: 110000, orders: 1250 },
  { month: 'Feb', revenue: 138000, previousYear: 125000, orders: 1380 },
  { month: 'Mar', revenue: 142000, previousYear: 130000, orders: 1420 },
  { month: 'Apr', revenue: 158000, previousYear: 145000, orders: 1580 },
  { month: 'May', revenue: 165000, previousYear: 150000, orders: 1650 },
  { month: 'Jun', revenue: 172000, previousYear: 160000, orders: 1720 },
];

export const RevenueReports = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const currentRevenue = mockRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const previousRevenue = mockRevenueData.reduce((sum, item) => sum + item.previousYear, 0);
  const yoyGrowth = ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1);
  
  const currentMonth = mockRevenueData[mockRevenueData.length - 1];
  const previousMonth = mockRevenueData[mockRevenueData.length - 2];
  const momGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);

  const exportData = {
    headers: ['Month', 'Revenue', 'Previous Year', 'YoY Growth', 'Orders'],
    data: mockRevenueData.map(item => ({
      Month: item.month,
      Revenue: item.revenue,
      'Previous Year': item.previousYear,
      'YoY Growth': ((item.revenue - item.previousYear) / item.previousYear * 100).toFixed(1) + '%',
      Orders: item.orders
    })),
    filename: 'revenue-report'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Revenue Reports & Growth Metrics</h2>
          <p className="text-sm text-gray-600">Track revenue performance with MoM and YoY growth</p>
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
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">₹{(currentRevenue / 100000).toFixed(1)}L</p>
            </div>
            <IndianRupee className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">YoY Growth</p>
              <p className={`text-2xl font-bold ${parseFloat(yoyGrowth) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(yoyGrowth) > 0 ? '+' : ''}{yoyGrowth}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">MoM Growth</p>
              <p className={`text-2xl font-bold ${parseFloat(momGrowth) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(momGrowth) > 0 ? '+' : ''}{momGrowth}%
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold">₹{Math.round(currentRevenue / mockRevenueData.reduce((sum, item) => sum + item.orders, 0))}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Revenue Trends Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Growth Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, '']} />
            <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Current Year" />
            <Line type="monotone" dataKey="previousYear" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" name="Previous Year" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Growth Rate</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockRevenueData.map((item, index) => ({
              ...item,
              growth: index > 0 ? ((item.revenue - mockRevenueData[index - 1].revenue) / mockRevenueData[index - 1].revenue * 100).toFixed(1) : 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Growth']} />
              <Bar dataKey="growth" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Q1 Revenue</span>
              <span className="text-green-600 font-bold">₹4.05L</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Q2 Revenue</span>
              <span className="text-blue-600 font-bold">₹4.95L</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">Best Month</span>
              <span className="text-purple-600 font-bold">June (₹1.72L)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">Growth Trend</span>
              <span className="text-orange-600 font-bold">Positive</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
