import { useState } from "react";
import { Card, Badge } from "./index";
import { BarChart3, Eye, MousePointer, Send, TrendingUp } from "lucide-react";

interface NotificationAnalytics {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

interface AnalyticsData {
  loyaltyPoints: NotificationAnalytics;
  walletCash: NotificationAnalytics;
  overall: NotificationAnalytics;
}

interface ExpiryAnalyticsDashboardProps {
  data: AnalyticsData;
  dateRange: string;
  className?: string;
}

export const ExpiryAnalyticsDashboard = ({ data, dateRange, className }: ExpiryAnalyticsDashboardProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'delivery' | 'open' | 'click'>('delivery');

  const MetricCard = ({ 
    title, 
    value, 
    percentage, 
    icon: Icon, 
    color,
    isSelected,
    onClick 
  }: {
    title: string;
    value: number;
    percentage: number;
    icon: any;
    color: string;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <div 
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected ? `bg-${color}-50 border-${color}-200` : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-5 w-5 ${isSelected ? `text-${color}-600` : 'text-gray-500'}`} />
        <Badge variant={isSelected ? color : 'default'}>
          {percentage.toFixed(1)}%
        </Badge>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Expiry Alert Analytics</h3>
            <p className="text-sm text-gray-500">{dateRange}</p>
          </div>
        </div>
        <Badge variant="info">{data.overall.totalSent} Total Alerts</Badge>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Delivery Rate"
          value={data.overall.delivered}
          percentage={data.overall.deliveryRate}
          icon={Send}
          color="green"
          isSelected={selectedMetric === 'delivery'}
          onClick={() => setSelectedMetric('delivery')}
        />
        <MetricCard
          title="Open Rate"
          value={data.overall.opened}
          percentage={data.overall.openRate}
          icon={Eye}
          color="blue"
          isSelected={selectedMetric === 'open'}
          onClick={() => setSelectedMetric('open')}
        />
        <MetricCard
          title="Click Rate"
          value={data.overall.clicked}
          percentage={data.overall.clickRate}
          icon={MousePointer}
          color="purple"
          isSelected={selectedMetric === 'click'}
          onClick={() => setSelectedMetric('click')}
        />
      </div>

      {/* Breakdown by Type */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Performance by Alert Type</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Loyalty Points */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="font-medium text-orange-800">Loyalty Points</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-orange-600 font-medium">
                  {selectedMetric === 'delivery' && `${data.loyaltyPoints.deliveryRate.toFixed(1)}%`}
                  {selectedMetric === 'open' && `${data.loyaltyPoints.openRate.toFixed(1)}%`}
                  {selectedMetric === 'click' && `${data.loyaltyPoints.clickRate.toFixed(1)}%`}
                </p>
                <p className="text-orange-700">
                  {selectedMetric === 'delivery' && 'Delivered'}
                  {selectedMetric === 'open' && 'Opened'}
                  {selectedMetric === 'click' && 'Clicked'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">{data.loyaltyPoints.totalSent}</p>
                <p className="text-gray-500">Sent</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">
                  {selectedMetric === 'delivery' && data.loyaltyPoints.delivered}
                  {selectedMetric === 'open' && data.loyaltyPoints.opened}
                  {selectedMetric === 'click' && data.loyaltyPoints.clicked}
                </p>
                <p className="text-gray-500">Count</p>
              </div>
            </div>
          </div>

          {/* Wallet Cash */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-800">Wallet Cash</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-green-600 font-medium">
                  {selectedMetric === 'delivery' && `${data.walletCash.deliveryRate.toFixed(1)}%`}
                  {selectedMetric === 'open' && `${data.walletCash.openRate.toFixed(1)}%`}
                  {selectedMetric === 'click' && `${data.walletCash.clickRate.toFixed(1)}%`}
                </p>
                <p className="text-green-700">
                  {selectedMetric === 'delivery' && 'Delivered'}
                  {selectedMetric === 'open' && 'Opened'}
                  {selectedMetric === 'click' && 'Clicked'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">{data.walletCash.totalSent}</p>
                <p className="text-gray-500">Sent</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">
                  {selectedMetric === 'delivery' && data.walletCash.delivered}
                  {selectedMetric === 'open' && data.walletCash.opened}
                  {selectedMetric === 'click' && data.walletCash.clicked}
                </p>
                <p className="text-gray-500">Count</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-700">
            <span className="font-medium">Performance Insight:</span> 
            {data.overall.openRate > 25 ? 
              " Excellent engagement! Your expiry alerts are performing well." :
              data.overall.openRate > 15 ?
              " Good engagement. Consider optimizing message timing." :
              " Low engagement. Review message content and delivery timing."
            }
          </p>
        </div>
      </div>
    </Card>
  );
};
