import { useState } from 'react';
import { Card } from '../ui';
import { ExportButtons } from './ExportButtons';
import { Calculator, Receipt, FileText, IndianRupee } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockTaxData = [
  { month: 'Jan', sales: 125000, cgst: 11250, sgst: 11250, igst: 0, total: 147500 },
  { month: 'Feb', sales: 138000, cgst: 12420, sgst: 12420, igst: 0, total: 162840 },
  { month: 'Mar', sales: 142000, cgst: 12780, sgst: 12780, igst: 0, total: 167560 },
  { month: 'Apr', sales: 158000, cgst: 14220, sgst: 14220, igst: 0, total: 186440 },
  { month: 'May', sales: 165000, cgst: 14850, sgst: 14850, igst: 0, total: 194700 },
  { month: 'Jun', sales: 172000, cgst: 15480, sgst: 15480, igst: 0, total: 202960 },
];

const mockGSTBreakdown = [
  { category: 'Poultry', sales: 450000, gst: 40500, rate: 9 },
  { category: 'Meat', sales: 320000, gst: 28800, rate: 9 },
  { category: 'Seafood', sales: 180000, gst: 16200, rate: 9 },
  { category: 'Processed', sales: 150000, gst: 27000, rate: 18 },
];

const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const TaxGSTReports = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const totalSales = mockTaxData.reduce((sum, item) => sum + item.sales, 0);
  const totalGST = mockTaxData.reduce((sum, item) => sum + item.cgst + item.sgst + item.igst, 0);
  const totalRevenue = mockTaxData.reduce((sum, item) => sum + item.total, 0);

  const exportData = {
    headers: ['Month', 'Sales', 'CGST', 'SGST', 'IGST', 'Total with GST'],
    data: mockTaxData.map(item => ({
      Month: item.month,
      Sales: item.sales,
      CGST: item.cgst,
      SGST: item.sgst,
      IGST: item.igst,
      'Total with GST': item.total
    })),
    filename: 'gst-tax-report'
  };

  const gstBreakdownExport = {
    headers: ['Category', 'Sales', 'GST Amount', 'GST Rate %'],
    data: mockGSTBreakdown.map(item => ({
      Category: item.category,
      Sales: item.sales,
      'GST Amount': item.gst,
      'GST Rate %': item.rate
    })),
    filename: 'gst-breakdown-report'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tax Calculation & GST Reports</h2>
          <p className="text-sm text-gray-600">Comprehensive tax and GST reporting for accounting</p>
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
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold">₹{(totalSales / 100000).toFixed(1)}L</p>
            </div>
            <IndianRupee className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total GST</p>
              <p className="text-2xl font-bold text-green-600">₹{(totalGST / 100000).toFixed(1)}L</p>
            </div>
            <Calculator className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">₹{(totalRevenue / 100000).toFixed(1)}L</p>
            </div>
            <Receipt className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg GST Rate</p>
              <p className="text-2xl font-bold text-orange-600">{((totalGST / totalSales) * 100).toFixed(1)}%</p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Monthly GST Trends */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Monthly GST Collection</h3>
          <ExportButtons data={exportData} className="scale-75" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockTaxData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, '']} />
            <Bar dataKey="cgst" stackId="gst" fill="#3B82F6" name="CGST" />
            <Bar dataKey="sgst" stackId="gst" fill="#10B981" name="SGST" />
            <Bar dataKey="igst" stackId="gst" fill="#F59E0B" name="IGST" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GST Breakdown by Category */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">GST by Category</h3>
            <ExportButtons data={gstBreakdownExport} className="scale-75" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockGSTBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="gst"
                nameKey="category"
              >
                {mockGSTBreakdown.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'GST']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {mockGSTBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[index] }}></div>
                  <span>{item.category}</span>
                </div>
                <span className="font-medium">₹{item.gst.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tax Summary Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Tax Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Month</th>
                  <th className="text-left py-2">Sales</th>
                  <th className="text-left py-2">GST</th>
                  <th className="text-left py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {mockTaxData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{item.month}</td>
                    <td className="py-2">₹{item.sales.toLocaleString()}</td>
                    <td className="py-2 text-green-600">₹{(item.cgst + item.sgst + item.igst).toLocaleString()}</td>
                    <td className="py-2 font-medium">₹{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* GST Rate Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">GST Rate Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockGSTBreakdown.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{item.category}</h4>
                <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">{item.rate}%</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sales:</span>
                  <span>₹{item.sales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST:</span>
                  <span className="text-green-600">₹{item.gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>₹{(item.sales + item.gst).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Compliance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Calculator className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">GST Filing Status</h4>
                <p className="text-sm text-green-600">Up to date</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Receipt className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800">Return Filing</h4>
                <p className="text-sm text-blue-600">GSTR-1 & GSTR-3B</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-purple-800">Next Due Date</h4>
                <p className="text-sm text-purple-600">20th July 2024</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
