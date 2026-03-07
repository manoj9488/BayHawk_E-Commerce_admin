import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import { Truck, MapPin, Clock, CheckCircle, AlertTriangle, Route, Users } from 'lucide-react';
import { useDashboardFilters } from '../../hooks/useDashboardFilters';

const DeliveryDashboard: React.FC = () => {
  const { user } = useAuth();
  const { setFilters } = useDashboardFilters();
  const isHub = user?.loginType === 'hub';

  const stats = [
    {
      title: 'Active Deliveries',
      value: isHub ? '45' : '8',
      change: '+5',
      icon: Truck,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Completed Today',
      value: isHub ? '128' : '22',
      change: '+12%',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Avg Delivery Time',
      value: isHub ? '45 min' : '25 min',
      change: '-5 min',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    {
      title: 'Success Rate',
      value: '95%',
      change: '+2%',
      icon: Route,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  const activeDeliveries = [
    { id: 'DEL-001', destination: 'Sector 15, Noida', status: 'In Transit', eta: '15 min', agent: 'Rahul Kumar' },
    { id: 'DEL-002', destination: 'Connaught Place', status: 'Out for Delivery', eta: '25 min', agent: 'Priya Singh' },
    { id: 'DEL-003', destination: 'Gurgaon Phase 2', status: 'Picked Up', eta: '40 min', agent: 'Amit Sharma' },
    { id: 'DEL-004', destination: 'Dwarka Sector 10', status: 'In Transit', eta: '30 min', agent: 'Neha Gupta' }
  ];

  const deliveryAgents = [
    { name: 'Rahul Kumar', deliveries: 12, rating: 4.8, status: 'Active' },
    { name: 'Priya Singh', deliveries: 15, rating: 4.9, status: 'Active' },
    { name: 'Amit Sharma', deliveries: 8, rating: 4.7, status: 'Break' },
    { name: 'Neha Gupta', deliveries: 10, rating: 4.6, status: 'Active' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl font-bold">Delivery Dashboard</h1>
        <p className="text-purple-100 text-sm sm:text-base">{isHub ? 'Hub' : 'Store'} Delivery Operations</p>
      </div>

      {/* Dashboard Filters */}
      <DashboardFilters
        onFiltersChange={setFilters}
        statusOptions={[
          { value: 'in_transit', label: 'In Transit' },
          { value: 'out_for_delivery', label: 'Out for Delivery' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'picked_up', label: 'Picked Up' }
        ]}
        categoryOptions={[
          { value: 'deliveries', label: 'Deliveries' },
          { value: 'agents', label: 'Agents' },
          { value: 'routes', label: 'Routes' }
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Deliveries */}
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Active Deliveries</h3>
          <div className="space-y-3">
            {activeDeliveries.map((delivery) => (
              <div key={delivery.id} className="p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{delivery.id}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                    delivery.status === 'Out for Delivery' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {delivery.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span>{delivery.destination}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Agent: {delivery.agent}</span>
                  <span className="text-orange-600 font-medium">ETA: {delivery.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Agents */}
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Delivery Agents</h3>
          <div className="space-y-3">
            {deliveryAgents.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-gray-600">{agent.deliveries} deliveries today</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">⭐ {agent.rating}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      agent.status === 'Active' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
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
              <Truck className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium">Assign Delivery</p>
                <p className="text-sm text-gray-600">Create new delivery</p>
              </div>
            </div>
          </button>
          <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium">Track Orders</p>
                <p className="text-sm text-gray-600">Monitor deliveries</p>
              </div>
            </div>
          </button>
          <button className="p-4 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-medium">Report Issue</p>
                <p className="text-sm text-gray-600">Log delivery problem</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
