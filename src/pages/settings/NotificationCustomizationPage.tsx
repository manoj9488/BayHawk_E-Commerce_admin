import { useEffect, useState } from "react";
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
import { useAuth } from "../../context/AuthContext";
import {
  settingsBackend,
  type NotificationSettingsPayload,
  type NotificationTemplateRecord,
} from "../../utils/settingsBackend";

const defaultNotificationSettings: NotificationSettingsPayload["notificationSettings"] = {
  newOrderAlerts: true,
  lowStockAlerts: true,
  paymentFailureAlerts: true,
  customerSupportAlerts: true,
  dailySummaryEmail: true,
  orderStatusUpdates: true,
  promotionalEmails: false,
  maintenanceAlerts: true,
};

const defaultExpiryDateAlert: NotificationSettingsPayload["expiryDateAlert"] = {
  enabled: false,
  expiryDate: "",
  alertType: "email",
  daysBefore: 7,
  message:
    "Important notification settings will expire on {expiry_date}. Please review and update your preferences.",
};

const defaultLoyaltyAlert: ExpiryAlertConfig = {
  enabled: true,
  type: "loyalty_points",
  alertMethods: ["email", "push"],
  daysBefore: 7,
  customMessage: "",
  autoReminder: true,
  reminderFrequency: 3,
  trackingEnabled: true,
  includeClickTracking: true,
};

const defaultWalletAlert: ExpiryAlertConfig = {
  enabled: true,
  type: "wallet_cash",
  alertMethods: ["email", "sms"],
  daysBefore: 14,
  customMessage: "",
  autoReminder: false,
  reminderFrequency: 7,
  trackingEnabled: true,
  includeClickTracking: false,
};

const defaultEmailConfig: NotificationSettingsPayload["emailConfig"] = {
  fromName: "BAYHAWK",
  fromEmail: "noreply@bayhawk.com",
  replyToEmail: "support@bayhawk.com",
  emailProvider: "sendgrid",
  emailSignature: "Best regards,\nBAYHAWK Team\nsupport@bayhawk.com\n+91 9876543210",
};

const defaultSmsConfig: NotificationSettingsPayload["smsConfig"] = {
  senderId: "BAYHWK",
  smsProvider: "twilio",
  characterLimit: 160,
};

export function NotificationCustomizationPage() {
  const { user } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState(defaultNotificationSettings);
  const [expiryDateAlert, setExpiryDateAlert] = useState(defaultExpiryDateAlert);
  const [loyaltyPointsAlert, setLoyaltyPointsAlert] = useState<ExpiryAlertConfig>(defaultLoyaltyAlert);
  const [walletCashAlert, setWalletCashAlert] = useState<ExpiryAlertConfig>(defaultWalletAlert);
  const [templates, setTemplates] = useState<NotificationTemplateRecord[]>([]);
  const [emailConfig, setEmailConfig] = useState(defaultEmailConfig);
  const [smsConfig, setSmsConfig] = useState(defaultSmsConfig);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplateRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadSettings();
  }, [user?.loginType, user?.hubId, user?.storeId]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const payload = await settingsBackend.loadNotifications(user);
      setNotificationSettings(payload.notificationSettings);
      setExpiryDateAlert(payload.expiryDateAlert);
      setLoyaltyPointsAlert(payload.loyaltyPointsAlert);
      setWalletCashAlert(payload.walletCashAlert);
      setTemplates(payload.templates);
      setEmailConfig(payload.emailConfig);
      setSmsConfig(payload.smsConfig);
    } catch (error) {
      console.error("Failed to load notification settings:", error);
      setNotificationSettings(defaultNotificationSettings);
      setExpiryDateAlert(defaultExpiryDateAlert);
      setLoyaltyPointsAlert(defaultLoyaltyAlert);
      setWalletCashAlert(defaultWalletAlert);
      setTemplates([]);
      setEmailConfig(defaultEmailConfig);
      setSmsConfig(defaultSmsConfig);
    } finally {
      setLoading(false);
    }
  };

  const saveAllSettings = async () => {
    try {
      setSaving(true);
      const payload = await settingsBackend.saveNotifications(
        {
          notificationSettings,
          expiryDateAlert,
          loyaltyPointsAlert: {
            ...loyaltyPointsAlert,
            type: "loyalty_points",
            customMessage: loyaltyPointsAlert.customMessage || "",
          },
          walletCashAlert: {
            ...walletCashAlert,
            type: "wallet_cash",
            customMessage: walletCashAlert.customMessage || "",
          },
          templates,
          emailConfig,
          smsConfig,
        },
        user
      );
      setNotificationSettings(payload.notificationSettings);
      setExpiryDateAlert(payload.expiryDateAlert);
      setLoyaltyPointsAlert(payload.loyaltyPointsAlert);
      setWalletCashAlert(payload.walletCashAlert);
      setTemplates(payload.templates);
      setEmailConfig(payload.emailConfig);
      setSmsConfig(payload.smsConfig);
      alert("Notification settings saved successfully!");
    } catch (error) {
      console.error("Failed to save notification settings:", error);
      alert("Failed to save notification settings.");
    } finally {
      setSaving(false);
    }
  };

  const addNewTemplate = () => {
    const newTemplate: NotificationTemplateRecord = {
      id: `draft-template-${Date.now()}`,
      name: "New Template",
      type: "email",
      trigger: "custom",
      subject: "",
      content: "",
      isActive: false,
      variables: [],
    };
    setTemplates((current) => [...current, newTemplate]);
    setSelectedTemplate(newTemplate);
    setIsEditing(true);
  };

  const updateTemplate = (templateId: string, updates: Partial<NotificationTemplateRecord>) => {
    setTemplates((current) =>
      current.map((template) => (template.id === templateId ? { ...template, ...updates } : template))
    );
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
          <Button className="w-full sm:w-auto" onClick={saveAllSettings} disabled={saving}>
            <Save className="mr-2 h-5 w-5" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-blue-50 p-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Notification Settings</h2>
            <p className="text-xs sm:text-sm text-gray-600">Enable or disable notification types</p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading notification settings...</p>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            {[
              { key: "newOrderAlerts", label: "New Order Alerts" },
              { key: "lowStockAlerts", label: "Low Stock Alerts" },
              { key: "paymentFailureAlerts", label: "Payment Failure Alerts" },
              { key: "customerSupportAlerts", label: "Customer Support Alerts" },
              { key: "dailySummaryEmail", label: "Daily Summary Email" },
              { key: "orderStatusUpdates", label: "Order Status Updates" },
              { key: "promotionalEmails", label: "Promotional Emails" },
              { key: "maintenanceAlerts", label: "Maintenance Alerts" },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
                <p className="font-medium text-xs sm:text-sm">{setting.label}</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                    onChange={(event) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        [setting.key]: event.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            ))}
          </div>
        )}
      </Card>

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
          <ExpiryAlertSettings config={loyaltyPointsAlert} onChange={setLoyaltyPointsAlert} />
          <ExpiryAlertSettings config={walletCashAlert} onChange={setWalletCashAlert} />
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-green-50 p-2">
            <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Notification Templates</h2>
            <p className="text-xs sm:text-sm text-gray-600">Customize notification messages and content</p>
          </div>
        </div>

        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="border rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={template.isActive}
                    onChange={(event) =>
                      updateTemplate(template.id, { isActive: event.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="font-medium text-sm sm:text-base">{template.name}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">
                    {template.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(template)}>
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
                <div className="mb-2 text-xs sm:text-sm">
                  <span className="text-gray-500">Subject: </span>
                  <span className="font-medium">{template.subject}</span>
                </div>
              )}

              <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">{template.content}</p>

              <div className="flex flex-wrap gap-1 mt-3">
                {template.variables.map((variable) => (
                  <span key={variable} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                    {`{${variable}}`}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-purple-50 p-2">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Email Configuration</h2>
            <p className="text-xs sm:text-sm text-gray-600">Configure email sender settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Input label="From Name" value={emailConfig.fromName} onChange={(event) => setEmailConfig({ ...emailConfig, fromName: event.target.value })} />
            <Input label="From Email" type="email" value={emailConfig.fromEmail} onChange={(event) => setEmailConfig({ ...emailConfig, fromEmail: event.target.value })} />
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Input label="Reply-To Email" type="email" value={emailConfig.replyToEmail} onChange={(event) => setEmailConfig({ ...emailConfig, replyToEmail: event.target.value })} />
            <Select
              label="Email Provider"
              value={emailConfig.emailProvider}
              onChange={(event) => setEmailConfig({ ...emailConfig, emailProvider: event.target.value })}
              options={[
                { value: "sendgrid", label: "SendGrid" },
                { value: "mailgun", label: "Mailgun" },
                { value: "ses", label: "Amazon SES" },
                { value: "smtp", label: "Custom SMTP" },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Signature</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              value={emailConfig.emailSignature}
              onChange={(event) => setEmailConfig({ ...emailConfig, emailSignature: event.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-orange-50 p-2">
            <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">SMS Configuration</h2>
            <p className="text-xs sm:text-sm text-gray-600">Configure SMS notification settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Input label="Sender ID" value={smsConfig.senderId} onChange={(event) => setSmsConfig({ ...smsConfig, senderId: event.target.value })} />
            <Select
              label="SMS Provider"
              value={smsConfig.smsProvider}
              onChange={(event) => setSmsConfig({ ...smsConfig, smsProvider: event.target.value })}
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
              value={smsConfig.characterLimit}
              onChange={(event) =>
                setSmsConfig({
                  ...smsConfig,
                  characterLimit: Number.parseInt(event.target.value, 10) || 160,
                })
              }
            />
          </div>

          <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-yellow-600 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base text-yellow-800">SMS Usage Guidelines</span>
            </div>
            <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
              <li>• Keep messages under 160 characters for single SMS</li>
              <li>• Use approved sender IDs registered with telecom operators</li>
              <li>• Include opt-out instructions for promotional messages</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-red-50 p-2">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Expiry Date Alert</h2>
            <p className="text-xs sm:text-sm text-gray-600">Set expiry date for notification settings and configure alerts</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs sm:text-sm">Enable Expiry Date Alert</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={Boolean(expiryDateAlert.enabled)}
                onChange={(event) => setExpiryDateAlert({ ...expiryDateAlert, enabled: event.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {expiryDateAlert.enabled && (
            <>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <Input
                  label="Expiry Date"
                  type="date"
                  value={expiryDateAlert.expiryDate || ""}
                  onChange={(event) => setExpiryDateAlert({ ...expiryDateAlert, expiryDate: event.target.value })}
                />
                <Input
                  label="Days Before Expiry"
                  type="number"
                  value={expiryDateAlert.daysBefore}
                  onChange={(event) =>
                    setExpiryDateAlert({
                      ...expiryDateAlert,
                      daysBefore: Number.parseInt(event.target.value, 10) || 7,
                    })
                  }
                />
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <Select
                  label="Alert Type"
                  value={expiryDateAlert.alertType || "email"}
                  onChange={(event) =>
                    setExpiryDateAlert({
                      ...expiryDateAlert,
                      alertType: event.target.value as "email" | "sms" | "push",
                    })
                  }
                  options={[
                    { value: "email", label: "Email" },
                    { value: "sms", label: "SMS" },
                    { value: "push", label: "Push Notification" },
                  ]}
                />
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <Badge variant="warning" className="text-xs">
                    {expiryDateAlert.expiryDate ? "Configured" : "No date set"}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Alert Message</label>
                <textarea
                  value={expiryDateAlert.message || ""}
                  onChange={(event) => setExpiryDateAlert({ ...expiryDateAlert, message: event.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>
      </Card>

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
                    {isEditing ? "Edit" : "View"} Template: {selectedTemplate.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {selectedTemplate.type.toUpperCase()} • {selectedTemplate.trigger.replace("_", " ")}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!isEditing && (
                    <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
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
                <Input
                  label="Template Name"
                  value={selectedTemplate.name}
                  disabled={!isEditing}
                  onChange={(event) => setSelectedTemplate({ ...selectedTemplate, name: event.target.value })}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Notification Type"
                    value={selectedTemplate.type}
                    disabled={!isEditing}
                    onChange={(event) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        type: event.target.value as NotificationTemplateRecord["type"],
                      })
                    }
                    options={[
                      { value: "email", label: "Email" },
                      { value: "sms", label: "SMS" },
                      { value: "push", label: "Push Notification" },
                      { value: "whatsapp", label: "WhatsApp" },
                    ]}
                  />
                  <Input
                    label="Trigger Key"
                    value={selectedTemplate.trigger}
                    disabled={!isEditing}
                    onChange={(event) => setSelectedTemplate({ ...selectedTemplate, trigger: event.target.value })}
                  />
                </div>
                {selectedTemplate.type === "email" && (
                  <Input
                    label="Subject"
                    value={selectedTemplate.subject || ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      setSelectedTemplate({ ...selectedTemplate, subject: event.target.value })
                    }
                  />
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    rows={8}
                    value={selectedTemplate.content}
                    disabled={!isEditing}
                    onChange={(event) => setSelectedTemplate({ ...selectedTemplate, content: event.target.value })}
                  />
                </div>
                <Input
                  label="Variables (comma separated)"
                  value={selectedTemplate.variables.join(", ")}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setSelectedTemplate({
                      ...selectedTemplate,
                      variables: event.target.value
                        .split(",")
                        .map((value) => value.trim())
                        .filter(Boolean),
                    })
                  }
                />
                {isEditing && (
                  <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
                    <Button variant="secondary" onClick={() => setIsEditing(false)} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        updateTemplate(selectedTemplate.id, selectedTemplate);
                        setIsEditing(false);
                      }}
                      className="w-full sm:w-auto"
                    >
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
