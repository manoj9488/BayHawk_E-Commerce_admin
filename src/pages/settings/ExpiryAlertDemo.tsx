import { useState } from "react";
import { Card, Button, Badge } from "../../components/ui";
import { ExpiryAlertSettings } from "../../components/ui/ExpiryAlertSettings";
import type { ExpiryAlertConfig } from "../../components/ui/ExpiryAlertSettings";
import { ExpiryAnalyticsDashboard } from "../../components/ui/ExpiryAnalyticsDashboard";
import { ExpiryAnalyticsControls } from "../../components/ui/ExpiryAnalyticsControls";
import { Wallet, Gift, Bell, CheckCircle, BarChart3 } from "lucide-react";

export function ExpiryAlertDemo() {
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
    enabled: false,
    type: "wallet_cash" as const,
    alertMethods: ["email"] as ("email" | "sms" | "push" | "whatsapp")[],
    daysBefore: 14,
    customMessage: "",
    autoReminder: false,
    reminderFrequency: 7,
    trackingEnabled: true,
    includeClickTracking: false,
  });

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'analytics'>('settings');

  // Mock analytics data
  const [analyticsData] = useState({
    loyaltyPoints: {
      totalSent: 1250,
      delivered: 1198,
      opened: 456,
      clicked: 89,
      deliveryRate: 95.8,
      openRate: 38.1,
      clickRate: 19.5,
    },
    walletCash: {
      totalSent: 890,
      delivered: 867,
      opened: 298,
      clicked: 67,
      deliveryRate: 97.4,
      openRate: 34.4,
      clickRate: 22.5,
    },
    overall: {
      totalSent: 2140,
      delivered: 2065,
      opened: 754,
      clicked: 156,
      deliveryRate: 96.5,
      openRate: 36.5,
      clickRate: 20.7,
    },
  });

  const [analyticsFilters, setAnalyticsFilters] = useState({
    dateRange: "30days",
    alertType: "all",
    channel: "all",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRefreshAnalytics = () => {
    console.log("Refreshing analytics data...");
  };

  const handleExportAnalytics = () => {
    console.log("Exporting analytics data...");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Loyalty Points & Wallet Cash Expiry Alerts
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Keep your customers engaged with smart expiry notifications and track performance with detailed analytics.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell className="inline-block w-4 h-4 mr-2" />
            Alert Settings
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="inline-block w-4 h-4 mr-2" />
            Analytics
          </button>
        </div>
      </div>

      {activeTab === 'settings' && (
        <>
          {/* Feature Overview */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Smart Expiry Notifications</h2>
                <p className="text-gray-600">Reduce customer churn with timely expiry reminders</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-white rounded-lg border">
                <Gift className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-medium">Loyalty Points</h3>
                <p className="text-sm text-gray-500">Alert before points expire</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Wallet className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-medium">Wallet Cash</h3>
                <p className="text-sm text-gray-500">Remind about cash expiry</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Bell className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-medium">Multi-Channel</h3>
                <p className="text-sm text-gray-500">Email, SMS, Push, WhatsApp</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-medium">Analytics</h3>
                <p className="text-sm text-gray-500">Track performance metrics</p>
              </div>
            </div>
          </Card>

          {/* Configuration Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Configure Expiry Alerts</h2>
              <div className="flex items-center gap-3">
                {saved && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Settings Saved!</span>
                  </div>
                )}
                <Button onClick={handleSave} disabled={saved}>
                  Save Configuration
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
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

          {/* Preview Section */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Alert Preview</h3>
            <div className="space-y-4">
              {loyaltyPointsAlert.enabled && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-800">Loyalty Points Alert</span>
                    <Badge variant="warning">
                      {loyaltyPointsAlert.daysBefore} days before
                    </Badge>
                    {loyaltyPointsAlert.trackingEnabled && (
                      <Badge variant="info" className="text-xs">
                        Tracked
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-orange-700">
                    {loyaltyPointsAlert.customMessage || 
                     "Your loyalty points worth {amount} will expire on {expiry_date}. Use them before they expire!"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {loyaltyPointsAlert.alertMethods.map(method => (
                      <Badge key={method} variant="default" className="text-xs">
                        {method.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {walletCashAlert.enabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Wallet Cash Alert</span>
                    <Badge variant="success">
                      {walletCashAlert.daysBefore} days before
                    </Badge>
                    {walletCashAlert.trackingEnabled && (
                      <Badge variant="info" className="text-xs">
                        Tracked
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-green-700">
                    {walletCashAlert.customMessage || 
                     "Your wallet cash worth {amount} will expire on {expiry_date}. Use them before they expire!"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {walletCashAlert.alertMethods.map(method => (
                      <Badge key={method} variant="default" className="text-xs">
                        {method.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <ExpiryAnalyticsControls
            filters={analyticsFilters}
            onFiltersChange={setAnalyticsFilters}
            onRefresh={handleRefreshAnalytics}
            onExport={handleExportAnalytics}
          />
          
          <ExpiryAnalyticsDashboard
            data={analyticsData}
            dateRange="Last 30 days"
          />
        </div>
      )}
    </div>
  );
}
