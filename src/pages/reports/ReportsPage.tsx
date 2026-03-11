import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../../components/ui';
import { Download, BarChart3, Package, Truck, Users, IndianRupee, ArrowRight, TrendingUp, BarChart, Calculator } from 'lucide-react';
import { ProcurementReportsPage } from './ProcurementReportsPage';

const reportTypes = [
  { 
    id: 'sales', 
    label: 'Sales Report', 
    icon: IndianRupee, 
    description: 'Revenue, orders, average order value',
    path: '/reports/sales',
    hubPath: '/hub/reports/sales',
    storePath: '/store/reports/sales'
  },
  { 
    id: 'packing', 
    label: 'Packing Report', 
    icon: Package, 
    description: 'Items packed, time taken, team performance',
    path: '/reports/packing',
    hubPath: '/hub/reports/packing',
    storePath: '/store/reports/packing'
  },
  { 
    id: 'delivery', 
    label: 'Delivery Report', 
    icon: Truck, 
    description: 'On-time rate, delayed orders, partner performance',
    path: '/reports/delivery',
    hubPath: '/hub/reports/delivery',
    storePath: '/store/reports/delivery'
  },
  { 
    id: 'stock', 
    label: 'Stock Report', 
    icon: BarChart3, 
    description: 'Current stock, low stock alerts, movements',
    path: '/reports/stock',
    hubPath: '/hub/reports/stock',
    storePath: '/store/reports/stock'
  },
  { 
    id: 'customer', 
    label: 'Customer Report', 
    icon: Users, 
    description: 'New customers, active customers, lifetime value',
    path: '/reports/customer',
    hubPath: '/hub/reports/customer',
    storePath: '/store/reports/customer'
  },
  { 
    id: 'demand-forecast', 
    label: 'Products Demand Forecast', 
    icon: TrendingUp, 
    description: 'AI-powered demand prediction and inventory planning',
    path: '/reports/demand-forecast',
    hubPath: '/hub/reports/demand-forecast',
    storePath: '/store/reports/demand-forecast'
  },
  { 
    id: 'trend-analysis', 
    label: 'Product Trend Analysis', 
    icon: BarChart, 
    description: 'Track product performance and market trends',
    path: '/reports/trend-analysis',
    hubPath: '/hub/reports/trend-analysis',
    storePath: '/store/reports/trend-analysis'
  },
  { 
    id: 'tax-gst', 
    label: 'Tax & GST Reports', 
    icon: Calculator, 
    description: 'Tax calculation and GST reports for accounting',
    path: '/reports/tax-gst',
    hubPath: '/hub/reports/tax-gst',
    storePath: '/store/reports/tax-gst'
  },
];

export function ReportsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // If user is procurement role, show procurement-specific reports page
  if (user?.role === 'hub_procurement' || user?.role === 'store_procurement') {
    return <ProcurementReportsPage />;
  }

  // If user is packing role, show packing-specific reports
  if (user?.role === 'hub_packing' || user?.role === 'store_packing') {
    const packingReports = [
      {
        id: 'packing',
        title: 'Packing Reports',
        description: 'View packing performance, processing times, and team efficiency',
        icon: Package,
        path: location.pathname.startsWith('/hub/') ? '/hub/reports/packing' : '/store/reports/packing',
        color: 'bg-orange-500',
      },
    ];

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Packing Reports</h1>
          <p className="text-gray-600">
            Access reports related to packing operations and performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packingReports.map((report) => {
            const IconComponent = report.icon;
            return (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(report.path)}
              >
                <div className="flex items-center mb-4">
                  <div className={`${report.color} p-3 rounded-lg text-white mr-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{report.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // If user is delivery role, show delivery-specific reports
  if (user?.role === 'hub_delivery' || user?.role === 'store_delivery') {
    const deliveryReports = [
      {
        id: 'delivery',
        title: 'Delivery Reports',
        description: 'View delivery performance, on-time rates, and route efficiency',
        icon: Truck,
        path: location.pathname.startsWith('/hub/') ? '/hub/reports/delivery' : '/store/reports/delivery',
        color: 'bg-purple-500',
      },
    ];

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Reports</h1>
          <p className="text-gray-600">
            Access reports related to delivery operations and performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveryReports.map((report) => {
            const IconComponent = report.icon;
            return (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(report.path)}
              >
                <div className="flex items-center mb-4">
                  <div className={`${report.color} p-3 rounded-lg text-white mr-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{report.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Determine the current module based on the path
  const getCurrentModule = () => {
    if (location.pathname.startsWith('/hub/')) return 'hub';
    if (location.pathname.startsWith('/store/')) return 'store';
    return 'super_admin';
  };

  const currentModule = getCurrentModule();

  const handleReportClick = (report: typeof reportTypes[0]) => {
    let targetPath = report.path;
    
    if (currentModule === 'hub') {
      targetPath = report.hubPath;
    } else if (currentModule === 'store') {
      targetPath = report.storePath;
    }
    
    navigate(targetPath);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Report Center</h1>
          <p className="text-gray-600">Access detailed reports and analytics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => alert('Exporting all reports...')}>
            <Download className="mr-2 h-5 w-5" /> Export All
          </Button>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map(report => (
          <Card
            key={report.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-blue-300 group"
            onClick={() => handleReportClick(report)}
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-50 p-3 group-hover:bg-blue-100 transition-colors">
                <report.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{report.label}</h3>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-sm text-gray-500 mt-1">{report.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold">₹1,24,500</p>
              <p className="text-xs text-green-600">+12% from yesterday</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <IndianRupee className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Items Packed</p>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-xs text-green-600">+18% from yesterday</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Deliveries</p>
              <p className="text-2xl font-bold">142</p>
              <p className="text-xs text-green-600">94.2% on-time</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Customers</p>
              <p className="text-2xl font-bold">23</p>
              <p className="text-xs text-green-600">+18% from yesterday</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-semibold">Recent Report Activity</h2>
          <Button variant="secondary" size="sm" onClick={() => alert('View all report activity')}>View All</Button>
        </div>
        <div className="space-y-3">
          {[
            { type: 'Sales Report', action: 'Generated', time: '2 hours ago', user: 'Admin' },
            { type: 'Stock Report', action: 'Scheduled', time: '4 hours ago', user: 'Manager' },
            { type: 'Delivery Report', action: 'Downloaded', time: '6 hours ago', user: 'Supervisor' },
            { type: 'Customer Report', action: 'Generated', time: '8 hours ago', user: 'Admin' },
          ].map((activity, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
              <div>
                <div className="font-medium text-sm">{activity.type}</div>
                <div className="text-xs text-gray-500">{activity.action} by {activity.user}</div>
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
