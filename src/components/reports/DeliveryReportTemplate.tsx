import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Truck, Clock, CheckCircle, AlertTriangle, Building2, Store, MapPin, Phone, User } from 'lucide-react';
import { ReportHeader } from './ReportHeader';
import { MetricCard } from './MetricCard';
import { ChartSection } from './ChartSection';
import { DetailedSection } from './DetailedSection';
import { deliveryData } from './reportData';

export function DeliveryReportTemplate() {
  const [dateRange, setDateRange] = useState('today');
  const [viewMode, setViewMode] = useState('daily');
  const location = useLocation();

  const getCurrentModule = () => {
    if (location.pathname.includes('/hub/')) return 'hub';
    if (location.pathname.includes('/store/')) return 'store';
    return 'super_admin';
  };

  const currentModule = getCurrentModule();
  const data = deliveryData[currentModule];

  // Dummy delivery agents data
  const deliveryAgents = [
    { id: 'DA001', name: 'Rajesh Kumar', phone: '+91 9876543210', deliveries: 12, onTime: 11, rating: 4.8, status: 'Active' },
    { id: 'DA002', name: 'Suresh Singh', phone: '+91 9876543211', deliveries: 15, onTime: 14, rating: 4.6, status: 'Active' },
    { id: 'DA003', name: 'Amit Sharma', phone: '+91 9876543212', deliveries: 8, onTime: 7, rating: 4.9, status: 'Break' },
    { id: 'DA004', name: 'Vijay Raj', phone: '+91 9876543213', deliveries: 18, onTime: 17, rating: 4.7, status: 'Active' },
    { id: 'DA005', name: 'Ravi Patel', phone: '+91 9876543214', deliveries: 10, onTime: 9, rating: 4.5, status: 'Active' },
  ];

  // Dummy recent deliveries data
  const recentDeliveries = [
    { id: 'ORD001', customer: 'Priya Sharma', address: 'Anna Nagar, Chennai', agent: 'Rajesh Kumar', time: '2:45 PM', status: 'Delivered', delay: '0m' },
    { id: 'ORD002', customer: 'Arjun Patel', address: 'T Nagar, Chennai', agent: 'Suresh Singh', time: '3:12 PM', status: 'In Transit', delay: '5m' },
    { id: 'ORD003', customer: 'Meera Reddy', address: 'Velachery, Chennai', agent: 'Vijay Raj', time: '3:30 PM', status: 'Delivered', delay: '0m' },
    { id: 'ORD004', customer: 'Kiran Kumar', address: 'Adyar, Chennai', agent: 'Ravi Patel', time: '4:05 PM', status: 'Delayed', delay: '15m' },
    { id: 'ORD005', customer: 'Sita Devi', address: 'Mylapore, Chennai', agent: 'Rajesh Kumar', time: '4:20 PM', status: 'Delivered', delay: '0m' },
  ];

  const handleScheduleReport = () => {
    alert(`Schedule ${currentModule} delivery report functionality`);
  };

  const handleExportReport = () => {
    alert(`Exporting ${currentModule} delivery report...`);
  };

  const icons = [Truck, CheckCircle, Clock, AlertTriangle];
  const iconColors = ['bg-blue-50 text-blue-600', 'bg-green-50 text-green-600', 'bg-purple-50 text-purple-600', 'bg-red-50 text-red-600'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'In Transit': return 'bg-blue-100 text-blue-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Break': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Delivery Report"
        description="On-time rate, delayed orders, and partner performance"
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

      {/* Delivery Performance Chart */}
      <ChartSection
        title="Delivery Performance"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        viewOptions={[
          { value: 'hourly', label: 'Hourly' },
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
        ]}
      />

      {/* Delivery Agents Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Agents Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Agent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Deliveries</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">On-Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {deliveryAgents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{agent.name}</p>
                        <p className="text-sm text-gray-500">{agent.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{agent.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{agent.deliveries}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-green-600">{agent.onTime}/{agent.deliveries}</span>
                    <span className="text-sm text-gray-500 ml-1">({Math.round((agent.onTime/agent.deliveries)*100)}%)</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-yellow-600">⭐ {agent.rating}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Deliveries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deliveries</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Address</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Agent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Delay</th>
              </tr>
            </thead>
            <tbody>
              {recentDeliveries.map((delivery) => (
                <tr key={delivery.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-blue-600">{delivery.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{delivery.customer}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{delivery.address}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{delivery.agent}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{delivery.time}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${delivery.delay === '0m' ? 'text-green-600' : 'text-red-600'}`}>
                      {delivery.delay === '0m' ? 'On Time' : `+${delivery.delay}`}
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
              title="Hub Deliveries"
              icon={Building2}
              data={deliveryData.hub}
              type="hub"
            />
            <DetailedSection
              title="Store Deliveries"
              icon={Store}
              data={deliveryData.store}
              type="store"
            />
          </div>
        </>
      )}
    </div>
  );
}
