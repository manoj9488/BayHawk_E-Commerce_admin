import { Card, Select, Badge, Checkbox } from "./index";
import { AlertTriangle, Wallet, Gift, BarChart3 } from "lucide-react";

interface ExpiryAlertConfig {
  enabled: boolean;
  type: "loyalty_points" | "wallet_cash";
  alertMethods: ("email" | "sms" | "push" | "whatsapp")[];
  daysBefore: number;
  customMessage: string;
  autoReminder: boolean;
  reminderFrequency: number;
  trackingEnabled: boolean;
  includeClickTracking: boolean;
}

export type { ExpiryAlertConfig };

interface ExpiryAlertSettingsProps {
  config: ExpiryAlertConfig;
  onChange: (config: ExpiryAlertConfig) => void;
  className?: string;
}

export const ExpiryAlertSettings = ({ config, onChange, className }: ExpiryAlertSettingsProps) => {
  const alertMethodOptions = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push Notification" },
    { value: "whatsapp", label: "WhatsApp" },
  ];

  const daysBeforeOptions = [
    { value: "1", label: "1 day" },
    { value: "3", label: "3 days" },
    { value: "7", label: "7 days" },
    { value: "14", label: "14 days" },
    { value: "30", label: "30 days" },
  ];

  const reminderFrequencyOptions = [
    { value: "1", label: "Daily" },
    { value: "3", label: "Every 3 days" },
    { value: "7", label: "Weekly" },
  ];

  const updateConfig = (updates: Partial<ExpiryAlertConfig>) => {
    onChange({ ...config, ...updates });
  };

  const toggleAlertMethod = (method: "email" | "sms" | "push" | "whatsapp") => {
    const methods = config.alertMethods.includes(method)
      ? config.alertMethods.filter(m => m !== method)
      : [...config.alertMethods, method];
    updateConfig({ alertMethods: methods });
  };

  const getDefaultMessage = () => {
    const type = config.type === "loyalty_points" ? "loyalty points" : "wallet cash";
    return `Your ${type} worth {amount} will expire on {expiry_date}. Use them before they expire!`;
  };

  return (
    <Card className={`${className} transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {config.type === "loyalty_points" ? (
            <Gift className="h-5 w-5 text-orange-600" />
          ) : (
            <Wallet className="h-5 w-5 text-green-600" />
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {config.type === "loyalty_points" ? "Loyalty Points" : "Wallet Cash"} Expiry Alerts
            </h3>
            <p className="text-sm text-gray-500">
              Notify customers before their {config.type === "loyalty_points" ? "points" : "cash"} expires
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={config.enabled ? "success" : "default"}>
            {config.enabled ? "Active" : "Inactive"}
          </Badge>
          <Checkbox
            checked={config.enabled}
            onChange={(e) => updateConfig({ enabled: e.target.checked })}
          />
        </div>
      </div>

      {config.enabled && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Alert Timing"
              value={config.daysBefore.toString()}
              onChange={(e) => updateConfig({ daysBefore: parseInt(e.target.value) })}
              options={daysBeforeOptions}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Methods
              </label>
              <div className="flex flex-wrap gap-2">
                {alertMethodOptions.map((method) => (
                  <button
                    key={method.value}
                    onClick={() => toggleAlertMethod(method.value as any)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      config.alertMethods.includes(method.value as any)
                        ? "bg-blue-100 border-blue-300 text-blue-700"
                        : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={config.autoReminder}
                onChange={(e) => updateConfig({ autoReminder: e.target.checked })}
                label="Enable automatic reminders"
              />
            </div>

            {config.autoReminder && (
              <Select
                label="Reminder Frequency"
                value={config.reminderFrequency.toString()}
                onChange={(e) => updateConfig({ reminderFrequency: parseInt(e.target.value) })}
                options={reminderFrequencyOptions}
              />
            )}

            <div className="border-t pt-3 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Analytics Tracking</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={config.trackingEnabled}
                    onChange={(e) => updateConfig({ trackingEnabled: e.target.checked })}
                    label="Enable delivery and open tracking"
                  />
                </div>
                
                {config.trackingEnabled && (
                  <div className="flex items-center gap-2 ml-6">
                    <Checkbox
                      checked={config.includeClickTracking}
                      onChange={(e) => updateConfig({ includeClickTracking: e.target.checked })}
                      label="Include click-through tracking"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message
            </label>
            <textarea
              value={config.customMessage || getDefaultMessage()}
              onChange={(e) => updateConfig({ customMessage: e.target.value })}
              placeholder={getDefaultMessage()}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Available variables: {"{amount}"}, {"{expiry_date}"}, {"{customer_name}"}
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <p className="text-sm text-amber-700">
              Alerts will be sent {config.daysBefore} day(s) before expiry
              {config.autoReminder && ` and repeated every ${config.reminderFrequency} day(s)`}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
