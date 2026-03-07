import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import { Package2, Clock, CheckCircle, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { useDashboardFilters } from '../../hooks/useDashboardFilters';

const PackingDashboard: React.FC = () => {
  const { user } = useAuth();
  const { setFilters } = useDashboardFilters();
  const isHub = user?.loginType === 'hub';

  const stats = [
    {
      title: 'Orders to Pack',
      value: isHub ? '89' : '12',
      change: '+8',
      icon: Package2,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Packed Today',
      value: isHub ? '156' : '28',
      change: '+15%',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Avg Pack Time',
      value: isHub ? '8.5 min' : '6.2 min',
      change: '-1.2 min',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    {
      title: 'Team Efficiency',
      value: '92%',
      change: '+3%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  const packingQueue = [
    { id: 'ORD-1001', items: 5, priority: 'High', estimatedTime: '12 min' },
    { id: 'ORD-1002', items: 3, priority: 'Medium', estimatedTime: '8 min' },
    { id: 'ORD-1003', items: 7, priority: 'High', estimatedTime: '15 min' },
    { id: 'ORD-1004', items: 2, priority: 'Low', estimatedTime: '5 min' }
  ];

  const teamPerformance = [
    { name: 'Raj Kumar', packed: 45, efficiency: '95%' },
    { name: 'Priya Singh', packed: 38, efficiency: '92%' },
    { name: 'Amit Sharma', packed: 42, efficiency: '89%' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl font-bold">Packing Dashboard</h1>
        <p className="text-green-100 text-sm sm:text-base">{isHub ? 'Hub' : 'Store'} Packing Operations</p>
      </div>

      {/* Dashboard Filters */}
      <DashboardFilters
        onFiltersChange={setFilters}
        statusOptions={[
          { value: 'pending', label: 'Pending' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'packed', label: 'Packed' },
          { value: 'ready_for_delivery', label: 'Ready for Delivery' }
        ]}
        categoryOptions={[
          { value: 'orders', label: 'Orders' },
          { value: 'products', label: 'Products' },
          { value: 'staff', label: 'Staff' }
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
        {/* Packing Queue */}
        <div className="bg-white rounded-lg p-4 sm:p-6 border">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Packing Queue</h3>
          <div className="space-y-3">
            {packingQueue.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">{order.id}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{order.items} items</p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.priority === 'High' ? 'bg-red-100 text-red-800' :
                    order.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.priority}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{order.estimatedTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
          <div className="space-y-3">
            {teamPerformance.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.packed} orders packed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{member.efficiency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Package2 className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium">Start Packing</p>
                <p className="text-sm text-gray-600">Begin next order</p>
              </div>
            </div>
          </button>
          <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium">Mark Complete</p>
                <p className="text-sm text-gray-600">Finish current order</p>
              </div>
            </div>
          </button>
          <button className="p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-orange-600" />
              <div>
                <p className="font-medium">Report Issue</p>
                <p className="text-sm text-gray-600">Log packing problem</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackingDashboard;
