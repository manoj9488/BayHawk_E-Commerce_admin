import { useState } from "react";
import { Card, Button, Input, Select, Modal, Badge } from "../../components/ui";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Bell,
  Send,
  Users,
  TrendingUp,
} from "lucide-react";
import { getStatusColor } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";
import type { OfferNotification } from "../../types";

const mockNotifications: OfferNotification[] = [
  {
    id: "1",
    title: "Weekend Flash Sale",
    message: "Get 25% off on all fish items this weekend! Limited time offer.",
    notificationType: "push",
    targetAudience: "all",
    offerDetails: {
      offerType: "discount",
      value: 25,
      unit: "%",
      validFrom: "2024-01-13T00:00:00",
      validTo: "2024-01-14T23:59:59",
      minOrderValue: 500,
    },
    scheduledTime: "2024-01-13T08:00:00",
    status: "sent",
    totalRecipients: 5000,
    sentCount: 4950,
    openRate: 78.5,
    clickRate: 12.3,
    conversionRate: 8.7,
    priority: "high",
    createdBy: "Admin",
    createdAt: "2024-01-12",
  },
  {
    id: "2",
    title: "Premium Member Exclusive",
    message:
      "Exclusive cashback offer for our premium members. Get ₹100 cashback on orders above ₹1000.",
    notificationType: "email",
    targetAudience: "premium",
    offerDetails: {
      offerType: "cashback",
      value: 100,
      unit: "₹",
      validFrom: "2024-01-15T00:00:00",
      validTo: "2024-01-20T23:59:59",
      minOrderValue: 1000,
    },
    scheduledTime: "2024-01-15T10:00:00",
    status: "scheduled",
    totalRecipients: 850,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    priority: "medium",
    createdBy: "Admin",
    createdAt: "2024-01-14",
  },
];

interface NotificationStatsProps {
  notifications: OfferNotification[];
}

function NotificationStats({ notifications }: NotificationStatsProps) {
  const totalNotifications = notifications.length;
  const sentNotifications = notifications.filter(
    (n) => n.status === "sent",
  ).length;
  const totalRecipients = notifications.reduce(
    (sum, n) => sum + n.sentCount,
    0,
  );
  const avgOpenRate =
    notifications.length > 0
      ? (
          notifications.reduce((sum, n) => sum + n.openRate, 0) /
          notifications.length
        ).toFixed(1)
      : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-xl font-bold">{totalNotifications}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Send className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Sent</p>
            <p className="text-xl font-bold">{sentNotifications}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Recipients</p>
            <p className="text-xl font-bold">
              {totalRecipients.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Avg. Open Rate</p>
            <p className="text-xl font-bold">{avgOpenRate}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface NotificationFormProps {
  initialData?: OfferNotification;
  isReadOnly: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

function NotificationForm({
  initialData,
  isReadOnly,
  onSubmit,
  onCancel,
}: NotificationFormProps) {
  const [data] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Notification Title"
        defaultValue={data?.title}
        disabled={isReadOnly}
        required
      />
      <textarea
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
        rows={3}
        defaultValue={data?.message}
        disabled={isReadOnly}
        placeholder="Your offer message..."
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Notification Type"
          defaultValue={data?.notificationType}
          disabled={isReadOnly}
          options={[
            { value: "push", label: "Push" },
            { value: "sms", label: "SMS" },
            { value: "email", label: "Email" },
          ]}
        />
        <Select
          label="Target Audience"
          defaultValue={data?.targetAudience}
          disabled={isReadOnly}
          options={[
            { value: "all", label: "All Users" },
            { value: "premium", label: "Premium" },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Scheduled Time"
          type="datetime-local"
          defaultValue={data?.scheduledTime.slice(0, 16)}
          disabled={isReadOnly}
        />
        <Select
          label="Priority"
          defaultValue={data?.priority}
          disabled={isReadOnly}
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />
      </div>
      <div className="border-t pt-4 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Close
        </Button>
        {!isReadOnly && <Button type="submit">Save Changes</Button>}
      </div>
    </form>
  );
}

export function OfferNotificationPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] =
    useState<OfferNotification[]>(mockNotifications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<
    OfferNotification | undefined
  >();

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) &&
      (!statusFilter || n.status === statusFilter) &&
      (!typeFilter || n.notificationType === typeFilter),
  );

  const handleOpenForm = (
    notification?: OfferNotification,
    readOnly = false,
  ) => {
    setSelectedNotification(notification);
    setIsReadOnly(readOnly);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedNotification(undefined);
  };

  const handleSave = (data: OfferNotification) => {
    if (selectedNotification) {
      setNotifications(notifications.map((n) => (n.id === data.id ? data : n)));
    } else {
      setNotifications([
        ...notifications,
        {
          ...data,
          id: Date.now().toString(),
          createdBy: user?.name || "Admin",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure?")) {
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Offer Notifications</h1>
          <p className="text-gray-600">
            Send targeted offer notifications to customers
          </p>
        </div>
        <Button onClick={() => handleOpenForm(undefined, false)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Notification
        </Button>
      </div>

      <NotificationStats notifications={notifications} />

      <Card>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 flex-1"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "All Status" },
              { value: "sent", label: "Sent" },
              { value: "scheduled", label: "Scheduled" },
            ]}
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: "", label: "All Types" },
              { value: "push", label: "Push" },
              { value: "sms", label: "SMS" },
              { value: "email", label: "Email" },
            ]}
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Notification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Audience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <tr key={notification.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{notification.title}</div>
                    <div
                      className="text-sm text-gray-500 truncate"
                      style={{ maxWidth: "250px" }}
                    >
                      {notification.message}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{notification.targetAudience}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      Open: {notification.openRate}%
                    </div>
                    <div className="text-sm text-gray-500">
                      Convert: {notification.conversionRate}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenForm(notification, true)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenForm(notification, false)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={
          isReadOnly
            ? "View Notification"
            : selectedNotification
              ? "Edit Notification"
              : "Create Notification"
        }
      >
        <NotificationForm
          initialData={selectedNotification}
          isReadOnly={isReadOnly}
          onSubmit={handleSave}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  );
}
