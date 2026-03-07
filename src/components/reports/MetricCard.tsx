import { Card } from '../ui';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor: string;
}

export function MetricCard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor }: MetricCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-xs flex items-center mt-1 ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-blue-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
