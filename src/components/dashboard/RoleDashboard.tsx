import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../ui/UserProfile';
import { hasPermission, getRoleDefinition } from '../../utils/rbac';
import { PERMISSIONS } from '../../utils/rbac';
import { 
  Package, 
  Box, 
  Truck, 
  Users, 
  BarChart3, 
  ShoppingCart, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Activity,
  DollarSign,
  Target,


} from 'lucide-react';

export function RoleDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  // Get role definition for better role-specific content
  const roleDefinition = getRoleDefinition(user.role);
  const isEmployeeRole = ['hub_procurement', 'hub_packing', 'hub_delivery', 'store_procurement', 'store_packing', 'store_delivery'].includes(user.role);

  // Role-based quick actions - only show relevant actions for each role
  const getQuickActions = () => {
    const actions = [];

    // For delivery employees - only delivery-related actions
    if (user.role === 'hub_delivery' || user.role === 'store_delivery') {
      actions.push({
        title: 'My Deliveries',
        description: 'View orders assigned to you for delivery',
        icon: Truck,
        color: 'bg-purple-500',
        hoverColor: 'hover:bg-purple-600',
        href: '/team'
      });
      return actions; // Return early to avoid showing other actions
    }

    // For packing employees - only packing-related actions
    if (user.role === 'hub_packing' || user.role === 'store_packing') {
      actions.push({
        title: 'Packing Queue',
        description: 'Process orders ready for packing',
        icon: Box,
        color: 'bg-orange-500',
        hoverColor: 'hover:bg-orange-600',
        href: '/orders?status=processing'
      });
      return actions; // Return early to avoid showing other actions
    }

    // For procurement employees - only inventory-related actions
    if (user.role === 'hub_procurement' || user.role === 'store_procurement') {
      actions.push({
        title: 'Manage Inventory',
        description: 'Update stock and procurement',
        icon: Package,
        color: 'bg-green-500',
        hoverColor: 'hover:bg-green-600',
        href: '/products'
      });
      actions.push({
        title: 'Stock Reports',
        description: 'View inventory and stock reports',
        icon: BarChart3,
        color: 'bg-teal-500',
        hoverColor: 'hover:bg-teal-600',
        href: '/reports/stock'
      });
      return actions; // Return early to avoid showing other actions
    }

    // For main admins - show all relevant actions
    if (hasPermission(user, PERMISSIONS.HUB_ORDERS_VIEW) || hasPermission(user, PERMISSIONS.STORE_ORDERS_VIEW)) {
      actions.push({
        title: 'View Orders',
        description: 'Check pending and active orders',
        icon: ShoppingCart,
        color: 'bg-blue-500',
        hoverColor: 'hover:bg-blue-600',
        href: '/orders'
      });
    }

    if (hasPermission(user, PERMISSIONS.PROCUREMENT_MANAGE)) {
      actions.push({
        title: 'Manage Inventory',
        description: 'Update stock and procurement',
        icon: Package,
        color: 'bg-green-500',
        hoverColor: 'hover:bg-green-600',
        href: '/products'
      });
    }

    if (hasPermission(user, PERMISSIONS.PACKING_MANAGE)) {
      actions.push({
        title: 'Packing Queue',
        description: 'Process orders for packing',
        icon: Box,
        color: 'bg-orange-500',
        hoverColor: 'hover:bg-orange-600',
        href: '/orders?status=processing'
      });
    }

    if (hasPermission(user, PERMISSIONS.DELIVERY_MANAGE)) {
      actions.push({
        title: 'Delivery Management',
        description: 'Track and assign deliveries',
        icon: Truck,
        color: 'bg-purple-500',
        hoverColor: 'hover:bg-purple-600',
        href: '/orders?status=out_for_delivery'
      });
    }

    if (hasPermission(user, PERMISSIONS.HUB_TEAM_MANAGE) || hasPermission(user, PERMISSIONS.STORE_TEAM_MANAGE)) {
      actions.push({
        title: 'Team Management',
        description: 'Manage team members and roles',
        icon: Users,
        color: 'bg-indigo-500',
        hoverColor: 'hover:bg-indigo-600',
        href: '/team'
      });
    }

    if (hasPermission(user, PERMISSIONS.HUB_REPORTS_SALES) || 
        hasPermission(user, PERMISSIONS.HUB_REPORTS_PACKING) ||
        hasPermission(user, PERMISSIONS.HUB_REPORTS_DELIVERY) ||
        hasPermission(user, PERMISSIONS.HUB_REPORTS_STOCK)) {
      actions.push({
        title: 'View Reports',
        description: 'Analytics and performance metrics',
        icon: BarChart3,
        color: 'bg-teal-500',
        hoverColor: 'hover:bg-teal-600',
        href: '/reports'
      });
    }

    return actions;
  };

  // Role-specific statistics - only show relevant metrics for each role
  const getStatistics = () => {
    const stats = [];

    // For delivery employees - only delivery-related stats
    if (user.role === 'hub_delivery' || user.role === 'store_delivery') {
      stats.push(
        { 
          title: 'My Assigned Orders', 
          value: '3', 
          change: '+1',
          icon: Truck, 
          color: 'text-blue-600', 
          bg: 'bg-blue-100',
          trend: 'up'
        },
        { 
          title: 'Completed Today', 
          value: '8', 
          change: '+2',
          icon: CheckCircle, 
          color: 'text-green-600', 
          bg: 'bg-green-100',
          trend: 'up'
        }
      );
      return stats; // Return early to avoid showing other stats
    }

    // For packing employees - only packing-related stats
    if (user.role === 'hub_packing' || user.role === 'store_packing') {
      stats.push(
        { 
          title: 'Ready to Pack', 
          value: '15', 
          change: '+3',
          icon: Box, 
          color: 'text-orange-600', 
          bg: 'bg-orange-100',
          trend: 'up'
        },
        { 
          title: 'Packed Today', 
          value: '32', 
          change: '+8',
          icon: CheckCircle, 
          color: 'text-green-600', 
          bg: 'bg-green-100',
          trend: 'up'
        }
      );
      return stats; // Return early to avoid showing other stats
    }

    // For procurement employees - only inventory-related stats
    if (user.role === 'hub_procurement' || user.role === 'store_procurement') {
      stats.push(
        { 
          title: 'Low Stock Items', 
          value: '5', 
          change: '-2',
          icon: AlertCircle, 
          color: 'text-red-600', 
          bg: 'bg-red-100',
          trend: 'down'
        },
        { 
          title: 'Total Products', 
          value: user.loginType === 'hub' ? '89' : '245', 
          change: '+12',
          icon: Package, 
          color: 'text-blue-600', 
          bg: 'bg-blue-100',
          trend: 'up'
        }
      );
      return stats; // Return early to avoid showing other stats
    }

    // For main admins - show comprehensive stats
    if (hasPermission(user, PERMISSIONS.HUB_ORDERS_VIEW) || hasPermission(user, PERMISSIONS.STORE_ORDERS_VIEW)) {
      stats.push(
        { 
          title: 'Pending Orders', 
          value: '24', 
          change: '+12%',
          icon: Clock, 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-100',
          trend: 'up'
        },
        { 
          title: 'Completed Today', 
          value: '156', 
          change: '+8%',
          icon: CheckCircle, 
          color: 'text-green-600', 
          bg: 'bg-green-100',
          trend: 'up'
        }
      );
    }

    if (hasPermission(user, PERMISSIONS.PROCUREMENT_MANAGE)) {
      stats.push(
        { 
          title: 'Low Stock Items', 
          value: '8', 
          change: '-3',
          icon: AlertCircle, 
          color: 'text-red-600', 
          bg: 'bg-red-100',
          trend: 'down'
        },
        { 
          title: 'Total Products', 
          value: user.loginType === 'hub' ? '142' : '342', 
          change: '+15',
          icon: Package, 
          color: 'text-blue-600', 
          bg: 'bg-blue-100',
          trend: 'up'
        }
      );
    }

    return stats;
  };

  const quickActions = getQuickActions();
  const statistics = getStatistics();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                {roleDefinition?.displayName || user.role} • {user.loginType === 'hub' ? 'Hub Operations' : user.loginType === 'store' ? 'Store Operations' : 'System Administration'}
              </p>
              <p className="text-blue-200 text-sm mt-2">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              {isEmployeeRole && (
                <p className="text-blue-200 text-sm mt-1">
                  {roleDefinition?.description}
                </p>
              )}
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {user.role === 'hub_delivery' || user.role === 'store_delivery' ? '95%' : 
                   user.role === 'hub_packing' || user.role === 'store_packing' ? '92%' :
                   user.role === 'hub_procurement' || user.role === 'store_procurement' ? '88%' : '94%'}
                </p>
                <p className="text-blue-200 text-sm">
                  {user.role === 'hub_delivery' || user.role === 'store_delivery' ? 'Delivery Rate' : 
                   user.role === 'hub_packing' || user.role === 'store_packing' ? 'Packing Efficiency' :
                   user.role === 'hub_procurement' || user.role === 'store_procurement' ? 'Stock Accuracy' : 'Efficiency'}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Key Metrics</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View Details <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 rounded-xl ${action.color} ${action.hoverColor} flex items-center justify-center group-hover:scale-110 transition-all duration-200 shadow-lg`}>
                    <action.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* User Profile Sidebar */}
        <div className="lg:col-span-1">
          <UserProfile />
        </div>
      </div>

      {/* Performance Metrics - Only show for main admins */}
      {(user.role === 'hub_main_admin' || user.role === 'store_main_admin' || user.loginType === 'super_admin') && 
       (hasPermission(user, PERMISSIONS.HUB_REPORTS_SALES) || hasPermission(user, PERMISSIONS.HUB_REPORTS_PACKING)) && (
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Today's Performance</h2>
                <p className="text-sm text-gray-600">Real-time operational metrics</p>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View Report <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="flex items-center justify-center mb-3">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-green-600 mb-2">94%</p>
              <p className="text-sm font-medium text-gray-700 mb-1">Order Completion Rate</p>
              <p className="text-xs text-gray-500">+2% from yesterday</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-center mb-3">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-blue-600 mb-2">2.3h</p>
              <p className="text-sm font-medium text-gray-700 mb-1">Avg Processing Time</p>
              <p className="text-xs text-gray-500">-15min improvement</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="flex items-center justify-center mb-3">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-4xl font-bold text-purple-600 mb-2">₹45,230</p>
              <p className="text-sm font-medium text-gray-700 mb-1">Revenue Today</p>
              <p className="text-xs text-gray-500">+8% from target</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}