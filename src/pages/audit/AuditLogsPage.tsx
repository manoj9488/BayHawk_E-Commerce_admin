import { useEffect, useMemo, useState } from "react";
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
import { auditBackend, type AuditLogRecord } from "../../utils/auditBackend";

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
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [filters, setFilters] = useState<{ modules: string[]; actions: string[] }>({
    modules: [],
    actions: [],
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const buildQueryParams = (includeFilters = false) => {
    const params: Record<string, string> = {};

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    if (moduleFilter) {
      params.module = moduleFilter;
    }

    if (actionFilter) {
      params.action = actionFilter;
    }

    if (dateFilter) {
      const from = new Date(dateFilter);
      const to = new Date(dateFilter);
      to.setHours(23, 59, 59, 999);
      params.dateFrom = from.toISOString();
      params.dateTo = to.toISOString();
    }

    if (user?.loginType === "hub") {
      params.moduleScope = "hub";
      if (user.hubId) params.hubId = user.hubId;
    }

    if (user?.loginType === "store") {
      params.moduleScope = "store";
      if (user.storeId) params.storeId = user.storeId;
    }

    if (includeFilters) {
      params.includeFilters = "true";
    }

    return params;
  };

  useEffect(() => {
    let active = true;

    const loadLogs = async () => {
      try {
        setLoading(true);
        const result = await auditBackend.listAuditLogs(buildQueryParams(true));
        if (!active) return;
        setLogs(result.items);
        if (result.filters) {
          setFilters({
            modules: result.filters.modules || [],
            actions: result.filters.actions || [],
          });
        }
      } catch (error) {
        console.error("Failed to load audit logs", error);
        if (active) {
          setLogs([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadLogs();

    return () => {
      active = false;
    };
  }, [searchTerm, moduleFilter, actionFilter, dateFilter, user?.loginType, user?.hubId, user?.storeId]);

  const filteredLogs = useMemo(() => {
    const scoped = filterDataByModule(logs, user);
    return scoped.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [logs, user]);

  const uniqueModules = filters.modules.length
    ? filters.modules
    : [...new Set(logs.map((log) => log.module))];
  const uniqueActions = filters.actions.length
    ? filters.actions
    : [...new Set(logs.map((log) => log.action))];

  const handleExport = async () => {
    try {
      const blob = await auditBackend.exportAuditLogs({
        ...buildQueryParams(false),
        format: "csv",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export audit logs", error);
      alert("Failed to export audit logs. Please try again.");
    }
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
        <Button onClick={handleExport} className="flex items-center gap-2" disabled={loading}>
          <Download className="h-4 w-4" />
          {loading ? "Loading..." : "Export Logs"}
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

        {loading && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading audit logs
            </h3>
            <p className="text-gray-600">Fetching latest activity...</p>
          </div>
        )}

        {!loading && filteredLogs.length === 0 && (
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
