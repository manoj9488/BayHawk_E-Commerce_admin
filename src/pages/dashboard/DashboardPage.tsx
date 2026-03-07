import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, LoadingWrapper } from '../../components/ui';
import { RoleDashboard } from '../../components/dashboard/RoleDashboard';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../hooks/useLoading';
import { useDashboardFilters } from '../../hooks/useDashboardFilters';
import { ShoppingCart, Package, Users, TrendingUp, Clock, AlertTriangle, Truck, IndianRupee, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { dashboardApi } from '../../utils/api';
import { useNewOrders, useStockUpdates, type NewOrderEvent, type StockUpdateEvent } from '../../utils/socket';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface DashboardStats {
  totalOrdersToday: number;
  revenueToday: number;
  activeProducts: number;
  totalCustomers: number;
  ordersChange: string;
  revenueChange: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  time: string;
}

interface LowStockItem {
  name: string;
  stock: number;
  unit: string;
}

interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
}

const EMPLOYEE_ROLE_REDIRECTS: Record<string, string> = {
  hub_procurement: '/hub/procurement/purchases',
  store_procurement: '/store/procurement/purchases',
  hub_cutting_cleaning: '/hub/cutting/management',
  store_cutting_cleaning: '/store/cutting/management',
  hub_packing: '/hub/packing/management',
  store_packing: '/store/packing/management',
  hub_delivery: '/hub/orders',
  store_delivery: '/store/orders',
};

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [salesData, setSalesData] = useState<SalesChartData[]>([]);
  const { setFilters } = useDashboardFilters();
  const roleRedirectPath = user?.role ? EMPLOYEE_ROLE_REDIRECTS[user.role] : undefined;

  const { isLoading, withLoading } = useLoading(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes, stockRes, chartRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentOrders(),
          dashboardApi.getLowStock(),
          dashboardApi.getSalesChart(7),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data);
        setLowStockItems(stockRes.data);
        setSalesData(chartRes.data);
      } catch {
        // Mock data fallback
        setStats({
          totalOrdersToday: 156,
          revenueToday: 89450,
          activeProducts: 234,
          totalCustomers: 1847,
          ordersChange: '+12%',
          revenueChange: '+8%',
        });
        setRecentOrders([
          { id: 'ORD-001', customer: 'Rajesh Kumar', amount: 1250, status: 'processing', time: '10 mins ago' },
          { id: 'ORD-002', customer: 'Priya Sharma', amount: 890, status: 'packed', time: '25 mins ago' },
          { id: 'ORD-003', customer: 'Arun Patel', amount: 2100, status: 'delivered', time: '1 hour ago' },
          { id: 'ORD-004', customer: 'Lakshmi Devi', amount: 560, status: 'received', time: '2 hours ago' },
        ]);
        setLowStockItems([
          { name: 'Seer Fish (Vanjaram)', stock: 5, unit: 'kg' },
          { name: 'Tiger Prawns', stock: 3, unit: 'kg' },
          { name: 'Pomfret', stock: 8, unit: 'kg' },
        ]);
        setSalesData([
          { date: 'Mon', revenue: 12500, orders: 45 },
          { date: 'Tue', revenue: 15800, orders: 52 },
          { date: 'Wed', revenue: 11200, orders: 38 },
          { date: 'Thu', revenue: 18900, orders: 61 },
          { date: 'Fri', revenue: 22100, orders: 78 },
          { date: 'Sat', revenue: 28500, orders: 95 },
          { date: 'Sun', revenue: 19800, orders: 68 },
        ]);
      }
    };
    
    withLoading(fetchData);
  }, []);

  const handleNewOrder = useCallback((data: NewOrderEvent) => {
    setRecentOrders((prev) => [
      { id: data.order.id, customer: data.order.customerName, amount: data.order.totalAmount, status: 'received', time: 'Just now' },
      ...prev.slice(0, 3),
    ]);
    setStats((prev) => prev ? { ...prev, totalOrdersToday: prev.totalOrdersToday + 1, revenueToday: prev.revenueToday + data.order.totalAmount } : prev);
  }, []);
  useNewOrders(handleNewOrder);

  const handleStockUpdate = useCallback((data: StockUpdateEvent) => {
    if (data.newStock < 10) {
      setLowStockItems((prev) => {
        const exists = prev.find((item) => item.name.includes(data.productId));
        if (!exists) return [...prev, { name: `Product ${data.productId}`, stock: data.newStock, unit: 'kg' }];
        return prev.map((item) => item.name.includes(data.productId) ? { ...item, stock: data.newStock } : item);
      });
    }
  }, []);
  useStockUpdates(handleStockUpdate);

  useEffect(() => {
    if (roleRedirectPath) {
      navigate(roleRedirectPath, { replace: true });
    }
  }, [roleRedirectPath, navigate]);

  const orderStatusData = [
    { name: 'Received', value: 23, color: '#3b82f6' },
    { name: 'Processing', value: 45, color: '#f59e0b' },
    { name: 'Packed', value: 32, color: '#8b5cf6' },
    { name: 'Delivering', value: 28, color: '#f97316' },
    { name: 'Delivered', value: 156, color: '#10b981' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: 'bg-blue-100 text-blue-700',
      processing: 'bg-yellow-100 text-yellow-700',
      packed: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <LoadingWrapper
        isLoading={true}
        type="page"
        text="Loading dashboard..."
        variant="branded"
      >
        <div />
      </LoadingWrapper>
    );
  }

  if (roleRedirectPath || user?.role === 'hub_dispatch') {
    return null;
  }

  // Show role-based dashboard for main admins
  if (user?.role === 'hub_main_admin' || user?.role === 'store_main_admin') {
    return <RoleDashboard />;
  }

  // For super_admin, show full dashboard
  // For other employee roles, show a simple message or redirect
  if (user?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">Dashboard access is limited to main administrators.</p>
          <p className="text-sm text-gray-500">Please contact your administrator for access.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrdersToday || 0, change: stats?.ordersChange || '+0%', icon: ShoppingCart, color: 'blue', up: true },
    { label: 'Revenue', value: stats?.revenueToday || 0, change: stats?.revenueChange || '+0%', icon: IndianRupee, color: 'green', up: true, isCurrency: true },
    { label: 'Products', value: stats?.activeProducts || 0, change: '+3', icon: Package, color: 'purple', up: true },
    { label: 'Customers', value: stats?.totalCustomers || 0, change: '+24', icon: Users, color: 'orange', up: true },
  ];

  const colorMap: Record<string, { bg: string; icon: string; light: string }> = {
    blue: { bg: 'bg-blue-600', icon: 'text-blue-600', light: 'bg-blue-50' },
    green: { bg: 'bg-green-600', icon: 'text-green-600', light: 'bg-green-50' },
    purple: { bg: 'bg-purple-600', icon: 'text-purple-600', light: 'bg-purple-50' },
    orange: { bg: 'bg-orange-600', icon: 'text-orange-600', light: 'bg-orange-50' },
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Admin'}! 👋</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Here's what's happening with your business today.</p>
      </div>

      {/* Dashboard Filters */}
      <DashboardFilters
        onFiltersChange={setFilters}
        statusOptions={[
          { value: 'received', label: 'Received' },
          { value: 'processing', label: 'Processing' },
          { value: 'packed', label: 'Packed' },
          { value: 'delivered', label: 'Delivered' }
        ]}
        categoryOptions={[
          { value: 'orders', label: 'Orders' },
          { value: 'revenue', label: 'Revenue' },
          { value: 'products', label: 'Products' },
          { value: 'customers', label: 'Customers' }
        ]}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const colors = colorMap[stat.color];
          return (
            <Card key={stat.label} className="relative overflow-hidden p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{stat.label}</p>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
                    {stat.isCurrency ? formatCurrency(stat.value) : stat.value.toLocaleString()}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    {stat.up ? (
                      <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                    )}
                    <span className={`text-xs sm:text-sm font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">vs yesterday</span>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl ${colors.light} flex-shrink-0`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.icon}`} />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg}`} />
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Sales Overview</h2>
              <p className="text-xs sm:text-sm text-gray-500">Last 7 days performance</p>
            </div>
            <select className="text-xs sm:text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Status Pie */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Order Status</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">Distribution today</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-2">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Orders Bar Chart */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Orders Trend</h2>
            <p className="text-xs sm:text-sm text-gray-500">Daily order count</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
            <Bar dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Bottom Row */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-500">Latest transactions</p>
            </div>
            <a href="/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </a>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(order.amount)}</p>
                  <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: '/orders?status=pending', icon: Clock, label: 'Pending', value: 23, color: 'blue' },
                { href: '/products?stock=low', icon: AlertTriangle, label: 'Low Stock', value: lowStockItems.length, color: 'red' },
                { href: '/orders?status=out_for_delivery', icon: Truck, label: 'Delivering', value: 15, color: 'orange' },
                { href: '/reports', icon: TrendingUp, label: 'Reports', value: null, color: 'green' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all hover:scale-105 ${
                    action.color === 'blue' ? 'bg-blue-50 hover:bg-blue-100' :
                    action.color === 'red' ? 'bg-red-50 hover:bg-red-100' :
                    action.color === 'orange' ? 'bg-orange-50 hover:bg-orange-100' :
                    'bg-green-50 hover:bg-green-100'
                  }`}
                >
                  <action.icon className={`h-6 w-6 ${
                    action.color === 'blue' ? 'text-blue-600' :
                    action.color === 'red' ? 'text-red-600' :
                    action.color === 'orange' ? 'text-orange-600' :
                    'text-green-600'
                  }`} />
                  <span className="mt-2 text-sm font-medium text-gray-700">{action.label}</span>
                  {action.value !== null && (
                    <span className={`text-xl font-bold ${
                      action.color === 'blue' ? 'text-blue-600' :
                      action.color === 'red' ? 'text-red-600' :
                      action.color === 'orange' ? 'text-orange-600' :
                      'text-green-600'
                    }`}>{action.value}</span>
                  )}
                </a>
              ))}
            </div>
          </Card>

          {/* Low Stock Alert */}
          <Card className="border-l-4 border-l-red-500">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
            </div>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                    {item.stock} {item.unit}
                  </span>
                </div>
              ))}
            </div>
            <a href="/products?stock=low" className="mt-4 block text-center text-sm text-red-600 hover:text-red-700 font-medium">
              View all low stock items →
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
