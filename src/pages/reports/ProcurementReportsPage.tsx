import { useState } from "react";
import {
  BarChart3,
  Package,
  TrendingUp,
  Truck,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { canAccessProcurementReport } from "../../utils/rbac";
import { ProductDemandForecast } from "../../components/reports/ProductDemandForecast";
import { TaxGSTReports } from "../../components/reports/TaxGSTReports";

export function ProcurementReportsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('procurement');

  const procurementReports = [
    {
      id: "stock",
      title: "Stock Reports",
      description:
        "View inventory levels, stock movements, and low stock alerts",
      icon: Package,
      path: "/hub/reports/stock",
      color: "bg-blue-500",
    },
    {
      id: "procurement",
      title: "Procurement Reports",
      description:
        "Track procurement activities, supplier performance, and purchase orders",
      icon: TrendingUp,
      path: "/hub/reports/procurement",
      color: "bg-green-500",
    },
  ];

  // Dummy supplier performance data
  const supplierPerformance = [
    {
      id: "SUP001",
      name: "Fresh Fish Suppliers Ltd",
      category: "Seafood",
      orders: 45,
      onTime: 42,
      rating: 4.8,
      lastDelivery: "2 hours ago",
      status: "Active",
    },
    {
      id: "SUP002",
      name: "Ocean Harvest Co.",
      category: "Prawns",
      orders: 38,
      onTime: 35,
      rating: 4.6,
      lastDelivery: "1 day ago",
      status: "Active",
    },
    {
      id: "SUP003",
      name: "Coastal Seafood Inc.",
      category: "Fish",
      orders: 52,
      onTime: 48,
      rating: 4.9,
      lastDelivery: "3 hours ago",
      status: "Active",
    },
    {
      id: "SUP004",
      name: "Marine Products Ltd",
      category: "Lobster",
      orders: 28,
      onTime: 25,
      rating: 4.5,
      lastDelivery: "2 days ago",
      status: "Warning",
    },
    {
      id: "SUP005",
      name: "Bay Area Fisheries",
      category: "Crab",
      orders: 33,
      onTime: 30,
      rating: 4.7,
      lastDelivery: "5 hours ago",
      status: "Active",
    },
  ];

  // Dummy recent purchase orders data
  const recentPurchaseOrders = [
    {
      id: "PO001",
      supplier: "Fresh Fish Suppliers Ltd",
      items: "Fresh Salmon, Sea Bass",
      quantity: "50kg",
      value: "₹25,000",
      orderDate: "2024-01-13",
      expectedDate: "2024-01-14",
      status: "In Transit",
    },
    {
      id: "PO002",
      supplier: "Ocean Harvest Co.",
      items: "Tiger Prawns",
      quantity: "30kg",
      value: "₹18,000",
      orderDate: "2024-01-12",
      expectedDate: "2024-01-13",
      status: "Delivered",
    },
    {
      id: "PO003",
      supplier: "Coastal Seafood Inc.",
      items: "Pomfret, Kingfish",
      quantity: "40kg",
      value: "₹22,000",
      orderDate: "2024-01-13",
      expectedDate: "2024-01-15",
      status: "Pending",
    },
    {
      id: "PO004",
      supplier: "Marine Products Ltd",
      items: "Fresh Lobster",
      quantity: "15kg",
      value: "₹35,000",
      orderDate: "2024-01-11",
      expectedDate: "2024-01-13",
      status: "Delayed",
    },
    {
      id: "PO005",
      supplier: "Bay Area Fisheries",
      items: "Mud Crab",
      quantity: "25kg",
      value: "₹20,000",
      orderDate: "2024-01-13",
      expectedDate: "2024-01-14",
      status: "Confirmed",
    },
  ];

  // Dummy low stock alerts
  const lowStockAlerts = [
    {
      id: "LS001",
      product: "Fresh Salmon",
      currentStock: "5kg",
      minLevel: "20kg",
      supplier: "Fresh Fish Suppliers Ltd",
      urgency: "High",
    },
    {
      id: "LS002",
      product: "Tiger Prawns",
      currentStock: "8kg",
      minLevel: "15kg",
      supplier: "Ocean Harvest Co.",
      urgency: "Medium",
    },
    {
      id: "LS003",
      product: "Sea Bass",
      currentStock: "3kg",
      minLevel: "12kg",
      supplier: "Coastal Seafood Inc.",
      urgency: "High",
    },
    {
      id: "LS004",
      product: "Pomfret",
      currentStock: "12kg",
      minLevel: "18kg",
      supplier: "Coastal Seafood Inc.",
      urgency: "Low",
    },
    {
      id: "LS005",
      product: "Kingfish",
      currentStock: "7kg",
      minLevel: "15kg",
      supplier: "Fresh Fish Suppliers Ltd",
      urgency: "Medium",
    },
  ];

  const accessibleReports = procurementReports.filter((report) =>
    canAccessProcurementReport(user, report.id),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Warning":
        return "bg-yellow-100 text-yellow-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "In Transit":
        return "bg-blue-100 text-blue-700";
      case "Confirmed":
        return "bg-purple-100 text-purple-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      case "Delayed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Procurement Reports
        </h1>
        <p className="text-gray-600">
          Access reports related to procurement and inventory management
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('procurement')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'procurement'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Procurement Reports
          </button>
          <button
            onClick={() => setActiveTab('demand-forecast')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'demand-forecast'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Demand Forecast
          </button>
          <button
            onClick={() => setActiveTab('tax-gst')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tax-gst'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tax & GST
          </button>
        </nav>
      </div>

      {activeTab === 'demand-forecast' ? (
        <ProductDemandForecast />
      ) : activeTab === 'tax-gst' ? (
        <TaxGSTReports />
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-blue-600">5</p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-orange-600">3</p>
            </div>
            <Package className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-600">5</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Spend</p>
              <p className="text-2xl font-bold text-green-600">₹1.2L</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {accessibleReports.map((report) => {
          const IconComponent = report.icon;
          return (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => (window.location.href = report.path)}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`${report.color} p-3 rounded-lg text-white mr-4`}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {report.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">{report.description}</p>
            </div>
          );
        })}
      </div>

      {/* Supplier Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Supplier Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Supplier
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Orders
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  On-Time
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Rating
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Last Delivery
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {supplierPerformance.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {supplier.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {supplier.name}
                        </p>
                        <p className="text-sm text-gray-500">{supplier.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">
                      {supplier.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">
                      {supplier.orders}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-green-600">
                      {supplier.onTime}/{supplier.orders}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({Math.round((supplier.onTime / supplier.orders) * 100)}%)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-yellow-600">
                      ⭐ {supplier.rating}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">
                      {supplier.lastDelivery}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}
                    >
                      {supplier.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Purchase Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Purchase Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  PO ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Supplier
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Items
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Quantity
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Expected
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentPurchaseOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <span className="font-medium text-blue-600">
                      {order.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">
                      {order.supplier}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{order.items}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">
                      {order.quantity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-green-600">
                      {order.value}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {order.expectedDate}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Low Stock Alerts
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Product
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Current Stock
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Min Level
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Supplier
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Urgency
                </th>
              </tr>
            </thead>
            <tbody>
              {lowStockAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {alert.product}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-red-600">
                      {alert.currentStock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">
                      {alert.minLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">
                      {alert.supplier}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(alert.urgency)}`}
                    >
                      {alert.urgency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {accessibleReports.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Reports Available
          </h3>
          <p className="text-gray-600">
            You don't have access to any procurement reports at this time.
          </p>
        </div>
      )}
        </>
      )}
    </div>
  );
}
