import { useState } from "react";
import { Card, Button, Input, Select, Badge } from "../../components/ui";
import { ExpiryAlertSettings } from "../../components/ui/ExpiryAlertSettings";
import type { ExpiryAlertConfig } from "../../components/ui/ExpiryAlertSettings";
import {
  Save,
  Bell,
  Mail,
  Smartphone,
  Eye,
  Edit,
  Plus,
  Volume2,
  X,
  Calendar,
  AlertTriangle,
} from "lucide-react";

interface NotificationTemplate {
  id: string;
  name: string;
  type: "email" | "sms" | "push" | "whatsapp";
  trigger: string;
  subject?: string;
  content: string;
  isActive: boolean;
  variables: string[];
}

export function NotificationCustomizationPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    newOrderAlerts: true,
    lowStockAlerts: true,
    paymentFailureAlerts: true,
    customerSupportAlerts: true,
    dailySummaryEmail: true,
    orderStatusUpdates: true,
    promotionalEmails: false,
    maintenanceAlerts: true,
  });

  const [expiryDateAlert, setExpiryDateAlert] = useState({
    enabled: false,
    expiryDate: "",
    alertType: "email" as "email" | "sms" | "push",
    daysBefore: 7,
    message: "Important notification settings will expire on {expiry_date}. Please review and update your preferences.",
  });

  // Loyalty Points and Wallet Cash Expiry Alerts
  const [loyaltyPointsAlert, setLoyaltyPointsAlert] = useState<ExpiryAlertConfig>({
    enabled: true,
    type: "loyalty_points" as const,
    alertMethods: ["email", "push"] as ("email" | "sms" | "push" | "whatsapp")[],
    daysBefore: 7,
    customMessage: "",
    autoReminder: true,
    reminderFrequency: 3,
    trackingEnabled: true,
    includeClickTracking: true,
  });

  const [walletCashAlert, setWalletCashAlert] = useState<ExpiryAlertConfig>({
    enabled: true,
    type: "wallet_cash" as const,
    alertMethods: ["email", "sms"] as ("email" | "sms" | "push" | "whatsapp")[],
    daysBefore: 14,
    customMessage: "",
    autoReminder: false,
    reminderFrequency: 7,
    trackingEnabled: true,
    includeClickTracking: false,
  });

  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: "1",
      name: "Order Confirmation",
      type: "email",
      trigger: "order_placed",
      subject: "Order Confirmed - #{order_id}",
      content:
        "Dear {customer_name}, your order #{order_id} has been confirmed. Total amount: {order_total}. Expected delivery: {delivery_date}.",
      isActive: true,
      variables: ["customer_name", "order_id", "order_total", "delivery_date"],
    },
    {
      id: "2",
      name: "Order Status Update",
      type: "sms",
      trigger: "order_status_changed",
      content:
        "Hi {customer_name}, your order #{order_id} is now {order_status}. Track: {tracking_url}",
      isActive: true,
      variables: ["customer_name", "order_id", "order_status", "tracking_url"],
    },
    {
      id: "3",
      name: "Low Stock Alert",
      type: "email",
      trigger: "low_stock",
      subject: "Low Stock Alert - {product_name}",
      content:
        "Product {product_name} is running low. Current stock: {current_stock}. Minimum threshold: {min_threshold}.",
      isActive: true,
      variables: ["product_name", "current_stock", "min_threshold"],
    },
    {
      id: "4",
      name: "Payment Failed",
      type: "push",
      trigger: "payment_failed",
      content:
        "Payment failed for order #{order_id}. Please try again or contact support.",
      isActive: true,
      variables: ["order_id", "customer_name"],
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] =
    useState<NotificationTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const notificationTypes = [
    { value: "email", label: "Email", icon: Mail, color: "text-blue-600" },
    { value: "sms", label: "SMS", icon: Smartphone, color: "text-green-600" },
    {
      value: "push",
      label: "Push Notification",
      icon: Bell,
      color: "text-purple-600",
    },
    {
      value: "whatsapp",
      label: "WhatsApp",
      icon: Smartphone,
      color: "text-green-600",
    },
  ];

  const toggleNotificationSetting = (key: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const addNewTemplate = () => {
    const newTemplate: NotificationTemplate = {
      id: Date.now().toString(),
      name: "New Template",
      type: "email",
      trigger: "custom",
      subject: "",
      content: "",
      isActive: false,
      variables: [],
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    setIsEditing(true);
  };

  const saveAllSettings = () => {
    // Here you would typically save to your backend
    const settingsData = {
      notificationSettings,
      expiryDateAlert,
      loyaltyPointsAlert,
      walletCashAlert,
      templates,
    };
    
    console.log("Saving notification settings:", settingsData);
    
    // Show success message (you can implement toast notifications)
    alert("Notification settings saved successfully!");
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Notification Customization</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Configure notification settings and templates
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={addNewTemplate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Add Template
          </Button>
          <Button className="w-full sm:w-auto" onClick={saveAllSettings}>
            <Save className="mr-2 h-5 w-5" />
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Notification Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-blue-50 p-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Notification Settings</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Enable or disable notification types
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
          {[
            {
              key: "newOrderAlerts",
              label: "New Order Alerts",
              desc: "Get notified when a new order is placed",
            },
            {
              key: "lowStockAlerts",
              label: "Low Stock Alerts",
              desc: "Alert when product stock falls below threshold",
            },
            {
              key: "paymentFailureAlerts",
              label: "Payment Failure Alerts",
              desc: "Notify on payment failures",
            },
            {
              key: "customerSupportAlerts",
              label: "Customer Support Alerts",
              desc: "New support tickets and messages",
            },
            {
              key: "dailySummaryEmail",
              label: "Daily Summary Email",
              desc: "Receive daily sales and order summary",
            },
            {
              key: "orderStatusUpdates",
              label: "Order Status Updates",
              desc: "Notify customers about order status changes",
            },
            {
              key: "promotionalEmails",
              label: "Promotional Emails",
              desc: "Send marketing and promotional content",
            },
            {
              key: "maintenanceAlerts",
              label: "Maintenance Alerts",
              desc: "System maintenance and downtime notifications",
            },
          ].map((setting) => (
            <div
              key={setting.key}
              className="flex items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs sm:text-sm truncate">{setting.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={
                    notificationSettings[
                      setting.key as keyof typeof notificationSettings
                    ]
                  }
                  onChange={() => toggleNotificationSetting(setting.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Customer Expiry Alerts Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-50 p-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Customer Expiry Alerts</h2>
            <p className="text-sm text-gray-600">
              Notify customers before their loyalty points and wallet cash expire
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ExpiryAlertSettings
            config={loyaltyPointsAlert}
            onChange={setLoyaltyPointsAlert}
          />
          <ExpiryAlertSettings
            config={walletCashAlert}
            onChange={setWalletCashAlert}
          />
        </div>
      </div>

      {/* Notification Templates */}
      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-green-50 p-2">
            <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Notification Templates</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Customize notification messages and content
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {templates.map((template) => {
            const TypeIcon =
              notificationTypes.find((t) => t.value === template.type)?.icon ||
              Bell;
            const typeColor =
              notificationTypes.find((t) => t.value === template.type)?.color ||
              "text-gray-600";

            return (
              <div key={template.id} className="border rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={template.isActive}
                        onChange={(e) => {
                          setTemplates(
                            templates.map((t) =>
                              t.id === template.id
                                ? { ...t, isActive: e.target.checked }
                                : t,
                            ),
                          );
                        }}
                        className="rounded"
                      />
                      <TypeIcon className={`h-4 w-4 ${typeColor}`} />
                      <span className="font-medium text-sm sm:text-base">{template.name}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">
                      {template.type}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                      {template.trigger.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {template.subject && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">Subject:</span>
                    <p className="text-xs sm:text-sm font-medium truncate">{template.subject}</p>
                  </div>
                )}

                <div className="mb-3">
                  <span className="text-xs text-gray-500">Content:</span>
                  <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                    {template.content}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <span
                      key={variable}
                      className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
                    >
                      {`{${variable}}`}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Email Configuration */}
      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-purple-50 p-2">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Email Configuration</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Configure email sender settings
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Input
              label="From Name"
              defaultValue="BAYHAWK"
              placeholder="Your Business Name"
            />
            <Input
              label="From Email"
              type="email"
              defaultValue="noreply@bayhawk.com"
              placeholder="noreply@yourdomain.com"
            />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Input
              label="Reply-To Email"
              type="email"
              defaultValue="support@bayhawk.com"
              placeholder="support@yourdomain.com"
            />
            <Select
              label="Email Provider"
              options={[
                { value: "sendgrid", label: "SendGrid" },
                { value: "mailgun", label: "Mailgun" },
                { value: "ses", label: "Amazon SES" },
                { value: "smtp", label: "Custom SMTP" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Signature
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              defaultValue="Best regards,&#10;BAYHAWK Team&#10;support@bayhawk.com&#10;+91 9876543210"
            />
          </div>
        </div>
      </Card>

      {/* SMS Configuration */}
      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-orange-50 p-2">
            <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">SMS Configuration</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Configure SMS notification settings
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Input
              label="Sender ID"
              defaultValue="BAYHWK"
              placeholder="SENDER"
              maxLength={6}
            />
            <Select
              label="SMS Provider"
              options={[
                { value: "twilio", label: "Twilio" },
                { value: "textlocal", label: "TextLocal" },
                { value: "msg91", label: "MSG91" },
                { value: "custom", label: "Custom Gateway" },
              ]}
            />
            <Input
              label="Character Limit"
              type="number"
              defaultValue="160"
              min="70"
              max="1600"
            />
          </div>

          <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-yellow-600 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base text-yellow-800">
                SMS Usage Guidelines
              </span>
            </div>
            <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
              <li>• Keep messages under 160 characters for single SMS</li>
              <li>
                • Use approved sender ID registered with telecom operators
              </li>
              <li>• Include opt-out instructions for promotional messages</li>
              <li>
                • Avoid sending messages during restricted hours (9 PM - 9 AM)
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Expiry Date Alert */}
      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-red-50 p-2">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Expiry Date Alert</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Set expiry date for notification settings and configure alerts
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Enable/Disable Expiry Alert */}
          <div className="flex items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs sm:text-sm">Enable Expiry Date Alert</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Send notifications before settings expire
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={expiryDateAlert.enabled}
                onChange={(e) => setExpiryDateAlert(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {expiryDateAlert.enabled && (
            <>
              {/* Expiry Date and Alert Configuration */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDateAlert.expiryDate}
                    onChange={(e) => setExpiryDateAlert(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Days Before Expiry
                  </label>
                  <input
                    type="number"
                    value={expiryDateAlert.daysBefore}
                    onChange={(e) => setExpiryDateAlert(prev => ({ ...prev, daysBefore: parseInt(e.target.value) || 7 }))}
                    min="1"
                    max="30"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Alert Type */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Alert Type
                  </label>
                  <select
                    value={expiryDateAlert.alertType}
                    onChange={(e) => setExpiryDateAlert(prev => ({ ...prev, alertType: e.target.value as "email" | "sms" | "push" }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push Notification</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-amber-800">Status</p>
                    <p className="text-xs text-amber-700">
                      {expiryDateAlert.expiryDate ? (
                        (() => {
                          const expiryDate = new Date(expiryDateAlert.expiryDate);
                          const today = new Date();
                          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          
                          if (daysUntilExpiry < 0) {
                            return "Expired";
                          } else if (daysUntilExpiry === 0) {
                            return "Expires today";
                          } else if (daysUntilExpiry <= expiryDateAlert.daysBefore) {
                            return `Expires in ${daysUntilExpiry} days`;
                          } else {
                            return `Active (${daysUntilExpiry} days remaining)`;
                          }
                        })()
                      ) : (
                        "No expiry date set"
                      )}
                    </p>
                  </div>
                  {expiryDateAlert.expiryDate && (
                    (() => {
                      const expiryDate = new Date(expiryDateAlert.expiryDate);
                      const today = new Date();
                      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      
                      if (daysUntilExpiry < 0) {
                        return <Badge variant="danger" className="text-xs">Expired</Badge>;
                      } else if (daysUntilExpiry === 0) {
                        return <Badge variant="warning" className="text-xs">Today</Badge>;
                      } else if (daysUntilExpiry <= expiryDateAlert.daysBefore) {
                        return <Badge variant="warning" className="text-xs">{daysUntilExpiry} days</Badge>;
                      } else {
                        return <Badge variant="success" className="text-xs">Active</Badge>;
                      }
                    })()
                  )}
                </div>
              </div>

              {/* Alert Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Alert Message
                </label>
                <textarea
                  value={expiryDateAlert.message}
                  onChange={(e) => setExpiryDateAlert(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter alert message..."
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {'{expiry_date}'}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {'{days_remaining}'}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {'{settings_name}'}
                  </span>
                </div>
              </div>

              {/* Alert Preview */}
              {expiryDateAlert.expiryDate && (
                <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base text-blue-800">
                      Alert Preview
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-700">
                    {expiryDateAlert.message
                      .replace('{expiry_date}', new Date(expiryDateAlert.expiryDate).toLocaleDateString())
                      .replace('{days_remaining}', Math.max(0, Math.ceil((new Date(expiryDateAlert.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))).toString())
                      .replace('{settings_name}', 'Notification Settings')
                    }
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Will be sent via <span className="font-medium uppercase">{expiryDateAlert.alertType}</span> {expiryDateAlert.daysBefore} days before expiry
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Template Editor Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-3 sm:p-4">
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => {
                setSelectedTemplate(null);
                setIsEditing(false);
              }}
            />
            <Card className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold truncate">
                    {isEditing ? "Edit" : "View"} Template:{" "}
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {selectedTemplate.type.toUpperCase()} •{" "}
                    {selectedTemplate.trigger.replace("_", " ")}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!isEditing && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(null);
                      setIsEditing(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <Input
                    label="Template Name"
                    value={selectedTemplate.name}
                    disabled={!isEditing}
                  />
                  <Select
                    label="Notification Type"
                    value={selectedTemplate.type}
                    disabled={!isEditing}
                    options={notificationTypes.map((type) => ({
                      value: type.value,
                      label: type.label,
                    }))}
                  />
                </div>

                {selectedTemplate.type === "email" && (
                  <Input
                    label="Subject Line"
                    value={selectedTemplate.subject || ""}
                    disabled={!isEditing}
                    placeholder="Enter email subject"
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    rows={6}
                    value={selectedTemplate.content}
                    disabled={!isEditing}
                    placeholder="Enter notification content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Variables
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <button
                        key={variable}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                        onClick={() => {
                          navigator.clipboard.writeText(`{${variable}}`);
                        }}
                      >
                        {`{${variable}}`}
                      </button>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button className="w-full sm:w-auto">
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
