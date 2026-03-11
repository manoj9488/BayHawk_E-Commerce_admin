import { Card, Button, Select } from "./index";
import { Calendar, Download, RefreshCw } from "lucide-react";

interface AnalyticsFilters {
  dateRange: string;
  alertType: string;
  channel: string;
}

interface ExpiryAnalyticsControlsProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  onRefresh: () => void;
  onExport: () => void;
  isLoading?: boolean;
  className?: string;
}

export const ExpiryAnalyticsControls = ({ 
  filters, 
  onFiltersChange, 
  onRefresh, 
  onExport,
  isLoading = false,
  className 
}: ExpiryAnalyticsControlsProps) => {
  const dateRangeOptions = [
    { value: "today", label: "Today" },
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "90days", label: "Last 90 days" },
    { value: "custom", label: "Custom Range" },
  ];

  const alertTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "loyalty_points", label: "Loyalty Points" },
    { value: "wallet_cash", label: "Wallet Cash" },
  ];

  const channelOptions = [
    { value: "all", label: "All Channels" },
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push" },
    { value: "whatsapp", label: "WhatsApp" },
  ];

  const updateFilter = (key: keyof AnalyticsFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Analytics Filters</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="secondary" 
            onClick={onRefresh}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="secondary" 
            onClick={onExport}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Select
          label="Date Range"
          value={filters.dateRange}
          onChange={(e) => updateFilter('dateRange', e.target.value)}
          options={dateRangeOptions}
        />
        
        <Select
          label="Alert Type"
          value={filters.alertType}
          onChange={(e) => updateFilter('alertType', e.target.value)}
          options={alertTypeOptions}
        />
        
        <Select
          label="Channel"
          value={filters.channel}
          onChange={(e) => updateFilter('channel', e.target.value)}
          options={channelOptions}
        />
      </div>
    </Card>
  );
};

// Analytics tracking utilities
export const trackNotificationEvent = (
  eventType: 'sent' | 'delivered' | 'opened' | 'clicked',
  notificationId: string,
  alertType: 'loyalty_points' | 'wallet_cash',
  channel: 'email' | 'sms' | 'push' | 'whatsapp',
  customerId: string
) => {
  const eventData = {
    eventType,
    notificationId,
    alertType,
    channel,
    customerId,
    timestamp: new Date().toISOString(),
  };
  
  // In a real implementation, this would send to your analytics service
  console.log('Tracking notification event:', eventData);
  
  // Example: Send to analytics API
  // fetch('/api/analytics/notification-events', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(eventData)
  // });
};

export const generateTrackingUrl = (
  notificationId: string,
  customerId: string,
  actionType: 'open' | 'click'
) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/track/${actionType}/${notificationId}/${customerId}`;
};
