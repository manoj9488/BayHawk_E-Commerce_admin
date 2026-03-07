import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { hasPermission, PERMISSIONS, filterDataByModule } from "../../utils/rbac";
import { Card, Button, Input, Select, Badge } from "../../components/ui";
import {
  Search,
  Download,
  Shield,
  Activity,
  Clock,
  User,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import type { AuditLog } from "../../types";

const mockLogs: AuditLog[] = [
  {
    id: "LOG001",
    userId: "U001",
    userName: "Rajesh Kumar (Hub Admin)",
    action: "Created Order",
    module: "Orders",
    details:
      "Manual order HUB001 created for customer John Doe with total amount ₹2,450",
    ipAddress: "192.168.1.1",
    timestamp: "2026-01-13T14:30:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
  {
    id: "LOG002",
    userId: "U002",
    userName: "Priya Singh (Hub Manager)",
    action: "Updated Product",
    module: "Products",
    details: "Updated stock for Fresh Pomfret - 500g variant from 25kg to 50kg",
    ipAddress: "192.168.1.2",
    timestamp: "2026-01-13T13:15:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
  {
    id: "LOG003",
    userId: "U003",
    userName: "Arun Patel (Store Admin)",
    action: "Login",
    module: "Authentication",
    details: "User successfully logged into the system from Chrome browser",
    ipAddress: "192.168.1.3",
    timestamp: "2026-01-13T12:45:00Z",
    moduleType: "store",
    storeId: "store_1",
  },
  {
    id: "LOG004",
    userId: "U001",
    userName: "Rajesh Kumar (Hub Admin)",
    action: "Deleted Product",
    module: "Products",
    details:
      'Permanently deleted product "Expired Tuna - 1kg" from inventory due to quality issues',
    ipAddress: "192.168.1.1",
    timestamp: "2026-01-13T11:20:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
  {
    id: "LOG005",
    userId: "U004",
    userName: "Murugan K (Delivery Agent)",
    action: "Updated Order Status",
    module: "Orders",
    details:
      'Changed order ORD-2024-001 status from "Out for Delivery" to "Delivered"',
    ipAddress: "192.168.1.4",
    timestamp: "2026-01-13T10:30:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
  {
    id: "LOG006",
    userId: "U002",
    userName: "Priya Singh (Hub Manager)",
    action: "Generated Report",
    module: "Reports",
    details:
      "Generated and downloaded Sales Report for date range 2026-01-01 to 2026-01-10",
    ipAddress: "192.168.1.2",
    timestamp: "2026-01-13T09:15:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
  {
    id: "LOG007",
    userId: "U005",
    userName: "Lakshmi Devi (Team Lead)",
    action: "Created User",
    module: "Team Management",
    details:
      'Added new team member "Senthil Kumar" with role "Packing Employee"',
    ipAddress: "192.168.1.5",
    timestamp: "2026-01-13T08:45:00Z",
    moduleType: "store",
    storeId: "store_1",
  },
  {
    id: "LOG008",
    userId: "U006",
    userName: "Karthik Raja (Procurement)",
    action: "Updated Stock",
    module: "Inventory",
    details:
      "Received new stock: King Fish - 2kg, quantity: 100 pieces from supplier ABC Fisheries",
    ipAddress: "192.168.1.6",
    timestamp: "2026-01-13T08:00:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
  {
    id: "LOG009",
    userId: "U007",
    userName: "Divya R (Packing)",
    action: "Order Packed",
    module: "Orders",
    details:
      "Successfully packed order ORD-2024-002 with 3 items for customer Priya Sharma",
    ipAddress: "192.168.1.7",
    timestamp: "2026-01-12T18:30:00Z",
    moduleType: "store",
    storeId: "store_2",
  },
  {
    id: "LOG010",
    userId: "U003",
    userName: "Arun Patel (Store Admin)",
    action: "Updated Settings",
    module: "Settings",
    details:
      "Modified delivery time slots: Added new slot 7:00 PM - 9:00 PM for weekend deliveries",
    ipAddress: "192.168.1.3",
    timestamp: "2026-01-12T17:15:00Z",
    moduleType: "store",
    storeId: "store_1",
  },
  {
    id: "LOG011",
    userId: "U008",
    userName: "Vijay M (Delivery Agent)",
    action: "Failed Login",
    module: "Authentication",
    details: "Failed login attempt - incorrect password (3rd attempt)",
    ipAddress: "192.168.1.8",
    timestamp: "2026-01-12T16:45:00Z",
    moduleType: "store",
    storeId: "store_1",
  },
  {
    id: "LOG012",
    userId: "U001",
    userName: "Rajesh Kumar (Hub Admin)",
    action: "Bulk Update",
    module: "Products",
    details:
      "Bulk price update applied to 25 fish products - increased prices by 5% due to market changes",
    ipAddress: "192.168.1.1",
    timestamp: "2026-01-12T15:20:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
  {
    id: "LOG013",
    userId: "U009",
    userName: "Anitha S (Store Manager)",
    action: "Order Cancelled",
    module: "Orders",
    details:
      "Cancelled order ORD-2024-003 due to customer request - refund initiated",
    ipAddress: "192.168.1.9",
    timestamp: "2026-01-12T14:10:00Z",
    moduleType: "store",
    storeId: "store_1",
  },
  {
    id: "LOG014",
    userId: "U010",
    userName: "Muthu Kumar (Procurement)",
    action: "Supplier Added",
    module: "Suppliers",
    details:
      'Added new supplier "Fresh Ocean Traders" with contact details and product categories',
    ipAddress: "192.168.1.10",
    timestamp: "2026-01-12T13:30:00Z",
    moduleType: "store",
    storeId: "store_1",
  },
  {
    id: "LOG015",
    userId: "U002",
    userName: "Priya Singh (Hub Manager)",
    action: "System Backup",
    module: "System",
    details:
      "Initiated daily system backup - all data successfully backed up to cloud storage",
    ipAddress: "192.168.1.2",
    timestamp: "2026-01-12T12:00:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
  {
    id: "LOG016",
    userId: "U011",
    userName: "Ravi Kumar (Packing)",
    action: "Quality Check",
    module: "Quality Control",
    details:
      "Performed quality check on incoming stock - rejected 5kg of Mackerel due to freshness issues",
    ipAddress: "192.168.1.11",
    timestamp: "2026-01-12T11:15:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
  {
    id: "LOG017",
    userId: "U012",
    userName: "Neha Gupta (Delivery Agent)",
    action: "Route Optimized",
    module: "Delivery",
    details:
      "Optimized delivery route for 8 orders in Sector 15 area - estimated time saved: 45 minutes",
    ipAddress: "192.168.1.12",
    timestamp: "2026-01-12T10:30:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
  {
    id: "LOG018",
    userId: "U003",
    userName: "Arun Patel (Store Admin)",
    action: "Promotion Created",
    module: "Marketing",
    details:
      "Created weekend special promotion: 20% off on all Pomfret varieties",
    ipAddress: "192.168.1.3",
    timestamp: "2026-01-12T09:45:00Z",
    moduleType: "store",
    storeId: "store_1",
  },
  {
    id: "LOG019",
    userId: "U013",
    userName: "Suresh M (Delivery)",
    action: "Customer Feedback",
    module: "Customer Service",
    details:
      "Recorded customer feedback for order ORD-2024-004 - 5-star rating with positive comments",
    ipAddress: "192.168.1.13",
    timestamp: "2026-01-12T08:20:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
  {
    id: "LOG020",
    userId: "U001",
    userName: "Rajesh Kumar (Hub Admin)",
    action: "Security Update",
    module: "Security",
    details:
      "Applied security patch v2.1.3 - enhanced password encryption and session management",
    ipAddress: "192.168.1.1",
    timestamp: "2026-01-11T23:30:00Z",
    moduleType: "hub",
    hubId: "hub_1",
  },
];

const actionIcons = {
  "Created Order": CheckCircle,
  "Updated Product": RefreshCw,
  Login: CheckCircle,
  "Deleted Product": XCircle,
  "Updated Order Status": RefreshCw,
  "Generated Report": Download,
  "Created User": User,
  "Failed Login": AlertTriangle,
  "Updated Settings": RefreshCw,
  "Bulk Update": RefreshCw,
  "Order Packed": CheckCircle,
  "Order Cancelled": XCircle,
  "Supplier Added": User,
  "System Backup": Shield,
  "Quality Check": CheckCircle,
  "Route Optimized": Activity,
  "Promotion Created": CheckCircle,
  "Customer Feedback": CheckCircle,
  "Security Update": Shield,
  "Updated Stock": RefreshCw,
};

const moduleColors = {
  Orders: "bg-blue-100 text-blue-800",
  Products: "bg-green-100 text-green-800",
  Authentication: "bg-yellow-100 text-yellow-800",
  Reports: "bg-purple-100 text-purple-800",
  "Team Management": "bg-indigo-100 text-indigo-800",
  Settings: "bg-gray-100 text-gray-800",
  Inventory: "bg-orange-100 text-orange-800",
  Suppliers: "bg-pink-100 text-pink-800",
  System: "bg-red-100 text-red-800",
  "Quality Control": "bg-teal-100 text-teal-800",
  Delivery: "bg-cyan-100 text-cyan-800",
  Marketing: "bg-lime-100 text-lime-800",
  "Customer Service": "bg-emerald-100 text-emerald-800",
  Security: "bg-rose-100 text-rose-800",
};

export default function AuditLogsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Filter logs based on user's module access
  const filteredLogs = useMemo(() => {
    let logs = filterDataByModule(mockLogs, user);

    if (searchTerm) {
      logs = logs.filter(
        (log) =>
          log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (moduleFilter) {
      logs = logs.filter((log) => log.module === moduleFilter);
    }

    if (actionFilter) {
      logs = logs.filter((log) => log.action === actionFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      logs = logs.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === filterDate.toDateString();
      });
    }

    return logs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [searchTerm, moduleFilter, actionFilter, dateFilter, user]);

  const uniqueModules = [...new Set(mockLogs.map((log) => log.module))];
  const uniqueActions = [...new Set(mockLogs.map((log) => log.action))];

  const handleExport = () => {
    const csvContent = [
      ["ID", "User", "Action", "Module", "Details", "IP Address", "Timestamp"],
      ...filteredLogs.map((log) => [
        log.id,
        log.userName,
        log.action,
        log.module,
        log.details,
        log.ipAddress,
        new Date(log.timestamp).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (
    !hasPermission(user, PERMISSIONS.HUB_AUDIT_LOGS) &&
    !hasPermission(user, PERMISSIONS.STORE_TEAM_MANAGE)
  ) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to view audit logs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">
            Track system activities and user actions
          </p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Module
            </label>
            <Select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              options={[
                { value: "", label: "All Modules" },
                ...uniqueModules.map((module) => ({
                  value: module,
                  label: module,
                })),
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <Select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              options={[
                { value: "", label: "All Actions" },
                ...uniqueActions.map((action) => ({
                  value: action,
                  label: action,
                })),
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User & Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const ActionIcon =
                  actionIcons[log.action as keyof typeof actionIcons] ||
                  Activity;
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <ActionIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {log.userName}
                          </p>
                          <p className="text-sm text-gray-600">{log.action}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          moduleColors[
                            log.module as keyof typeof moduleColors
                          ] || "bg-gray-100 text-gray-800"
                        }
                      >
                        {log.module}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="text-sm text-gray-900 max-w-md truncate"
                        title={log.details}
                      >
                        {log.details}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-mono">
                          {log.ipAddress}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No audit logs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
