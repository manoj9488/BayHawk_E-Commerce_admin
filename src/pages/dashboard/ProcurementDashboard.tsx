import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import { Package, TrendingUp, AlertTriangle, ShoppingCart, Users, Clock } from 'lucide-react';
import { useDashboardFilters } from '../../hooks/useDashboardFilters';

const ProcurementDashboard: React.FC = () => {
  const { user } = useAuth();
  const { setFilters } = useDashboardFilters();
  const isHub = user?.loginType === 'hub';

  const stats = [
    {
      title: 'Active Orders',
      value: isHub ? '156' : '23',
      change: '+12%',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Suppliers',
      value: isHub ? '45' : '12',
      change: '+3%',
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Low Stock Items',
      value: isHub ? '8' : '3',
      change: '-2',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      title: 'Pending Approvals',
      value: isHub ? '12' : '4',
      change: '+5',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  const recentOrders = [
    { id: 'PO-001', supplier: 'ABC Supplies', amount: '₹25,000', status: 'Pending' },
    { id: 'PO-002', supplier: 'XYZ Corp', amount: '₹18,500', status: 'Approved' },
    { id: 'PO-003', supplier: 'Global Traders', amount: '₹32,000', status: 'Processing' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl font-bold">Procurement Dashboard</h1>
        <p className="text-blue-100 text-sm sm:text-base">{isHub ? 'Hub' : 'Store'} Procurement Operations</p>
      </div>

      {/* Dashboard Filters */}
      <DashboardFilters
        onFiltersChange={setFilters}
        statusOptions={[
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'processing', label: 'Processing' },
          { value: 'delivered', label: 'Delivered' }
        ]}
        categoryOptions={[
          { value: 'orders', label: 'Orders' },
          { value: 'suppliers', label: 'Suppliers' },
          { value: 'inventory', label: 'Inventory' }
        ]}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 sm:p-6 border">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs sm:text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-lg ${stat.bg} flex-shrink-0`}>
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg p-4 sm:p-6 border">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Recent Purchase Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">{order.id}</p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{order.supplier}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="font-medium text-sm sm:text-base">{order.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-600" />
                <span>Create Purchase Order</span>
              </div>
            </button>
            <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>View Stock Levels</span>
              </div>
            </button>
            <button className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>Review Low Stock Alerts</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementDashboard;
