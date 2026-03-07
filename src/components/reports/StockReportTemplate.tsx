import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Package, BarChart3, AlertTriangle, TrendingUp, Building2, Store, Fish, Scale, Calendar } from 'lucide-react';
import { ReportHeader } from './ReportHeader';
import { MetricCard } from './MetricCard';
import { ChartSection } from './ChartSection';
import { DetailedSection } from './DetailedSection';
import { stockData } from './reportData';

export function StockReportTemplate() {
  const [dateRange, setDateRange] = useState('today');
  const [viewMode, setViewMode] = useState('current');
  const location = useLocation();

  const getCurrentModule = () => {
    if (location.pathname.includes('/hub/')) return 'hub';
    if (location.pathname.includes('/store/')) return 'store';
    return 'super_admin';
  };

  const currentModule = getCurrentModule();
  const data = stockData[currentModule];

  // Dummy current stock data
  const currentStock = [
    { id: 'PRD001', name: 'Fresh Salmon', category: 'Fish', currentStock: 45, minLevel: 20, maxLevel: 100, unit: 'kg', value: '₹22,500', lastUpdated: '2 hours ago', status: 'Good' },
    { id: 'PRD002', name: 'Tiger Prawns', category: 'Prawns', currentStock: 8, minLevel: 15, maxLevel: 50, unit: 'kg', value: '₹12,000', lastUpdated: '1 hour ago', status: 'Low' },
    { id: 'PRD003', name: 'Sea Bass', category: 'Fish', currentStock: 32, minLevel: 25, maxLevel: 80, unit: 'kg', value: '₹19,200', lastUpdated: '3 hours ago', status: 'Good' },
    { id: 'PRD004', name: 'Fresh Lobster', category: 'Lobster', currentStock: 5, minLevel: 10, maxLevel: 30, unit: 'kg', value: '₹17,500', lastUpdated: '30 min ago', status: 'Critical' },
    { id: 'PRD005', name: 'Mud Crab', category: 'Crab', currentStock: 18, minLevel: 12, maxLevel: 40, unit: 'kg', value: '₹14,400', lastUpdated: '1 hour ago', status: 'Good' },
    { id: 'PRD006', name: 'Pomfret', category: 'Fish', currentStock: 12, minLevel: 18, maxLevel: 60, unit: 'kg', value: '₹9,600', lastUpdated: '4 hours ago', status: 'Low' },
  ];

  // Dummy stock movements data
  const stockMovements = [
    { id: 'MOV001', product: 'Fresh Salmon', type: 'In', quantity: 25, reason: 'Purchase Order PO001', timestamp: '2024-01-13 10:30 AM', user: 'Ramesh Kumar' },
    { id: 'MOV002', product: 'Tiger Prawns', type: 'Out', quantity: 12, reason: 'Order ORD-456', timestamp: '2024-01-13 09:15 AM', user: 'System' },
    { id: 'MOV003', product: 'Sea Bass', type: 'In', quantity: 15, reason: 'Purchase Order PO002', timestamp: '2024-01-13 08:45 AM', user: 'Sita Sharma' },
    { id: 'MOV004', product: 'Fresh Lobster', type: 'Out', quantity: 8, reason: 'Order ORD-789', timestamp: '2024-01-13 08:00 AM', user: 'System' },
    { id: 'MOV005', product: 'Mud Crab', type: 'Adjustment', quantity: 3, reason: 'Stock Count Correction', timestamp: '2024-01-13 07:30 AM', user: 'Arjun Singh' },
  ];

  // Dummy low stock alerts
  const lowStockItems = [
    { id: 'LS001', product: 'Fresh Lobster', currentStock: 5, minLevel: 10, shortage: 5, category: 'Lobster', urgency: 'Critical', daysLeft: 1 },
    { id: 'LS002', product: 'Tiger Prawns', currentStock: 8, minLevel: 15, shortage: 7, category: 'Prawns', urgency: 'High', daysLeft: 2 },
    { id: 'LS003', product: 'Pomfret', currentStock: 12, minLevel: 18, shortage: 6, category: 'Fish', urgency: 'Medium', daysLeft: 3 },
  ];

  const handleScheduleReport = () => {
    alert(`Schedule ${currentModule} stock report functionality`);
  };

  const handleExportReport = () => {
    alert(`Exporting ${currentModule} stock report...`);
  };

  const icons = [Package, BarChart3, AlertTriangle, TrendingUp];
  const iconColors = ['bg-blue-50 text-blue-600', 'bg-green-50 text-green-600', 'bg-red-50 text-red-600', 'bg-purple-50 text-purple-600'];

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'bg-green-100 text-green-700';
      case 'Low': return 'bg-yellow-100 text-yellow-700';
      case 'Critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'In': return 'bg-green-100 text-green-700';
      case 'Out': return 'bg-red-100 text-red-700';
      case 'Adjustment': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Stock Report"
        description="Current stock, low stock alerts, and inventory movements"
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onSchedule={handleScheduleReport}
        onExport={handleExportReport}
      />

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={icons[index]}
            iconColor={iconColors[index]}
          />
        ))}
      </div>

      {/* Stock Movement Chart */}
      <ChartSection
        title="Stock Movement"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        viewOptions={[
          { value: 'current', label: 'Current Stock' },
          { value: 'daily', label: 'Daily Movement' },
          { value: 'weekly', label: 'Weekly Trends' },
        ]}
      />

      {/* Current Stock Levels */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Stock Levels</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Current Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Stock Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Updated</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentStock.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        <Fish className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{item.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{item.currentStock} {item.unit}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          getStockPercentage(item.currentStock, item.maxLevel) > 50 ? 'bg-green-500' :
                          getStockPercentage(item.currentStock, item.maxLevel) > 25 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${getStockPercentage(item.currentStock, item.maxLevel)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {getStockPercentage(item.currentStock, item.maxLevel)}% of max
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-green-600">{item.value}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{item.lastUpdated}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Stock Movements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Stock Movements</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
              </tr>
            </thead>
            <tbody>
              {stockMovements.map((movement) => (
                <tr key={movement.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{movement.product}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMovementTypeColor(movement.type)}`}>
                      {movement.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${movement.type === 'In' ? 'text-green-600' : movement.type === 'Out' ? 'text-red-600' : 'text-blue-600'}`}>
                      {movement.type === 'Out' ? '-' : '+'}{movement.quantity} kg
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{movement.reason}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{movement.timestamp}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{movement.user}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Current Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Min Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Shortage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Days Left</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((alert) => (
                <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-gray-900">{alert.product}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{alert.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-red-600">{alert.currentStock} kg</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{alert.minLevel} kg</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-red-600">-{alert.shortage} kg</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{alert.daysLeft} days</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(alert.urgency)}`}>
                      {alert.urgency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Hub & Store Reports */}
      {currentModule === 'super_admin' && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Detailed Reports by Location</h2>
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <DetailedSection
              title="Hub Inventory"
              icon={Building2}
              data={stockData.hub}
              type="hub"
            />
            <DetailedSection
              title="Store Inventory"
              icon={Store}
              data={stockData.store}
              type="store"
            />
          </div>
        </>
      )}
    </div>
  );
}
