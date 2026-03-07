import { Card } from '../ui';
import type { LucideIcon } from 'lucide-react';

interface DetailedSectionProps {
  title: string;
  icon: LucideIcon;
  data: any;
  type: 'hub' | 'store';
}

export function DetailedSection({ title, icon: Icon, data, type }: DetailedSectionProps) {
  const bgColor = type === 'hub' ? 'bg-blue-50' : 'bg-green-50';
  const textColor = type === 'hub' ? 'text-blue-900' : 'text-green-900';
  const iconColor = type === 'hub' ? 'text-blue-600' : 'text-green-600';

  return (
    <Card className={`${bgColor} border-2 ${type === 'hub' ? 'border-blue-200' : 'border-green-200'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-white`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
      </div>
      
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric: any) => (
          <div key={metric.title} className="bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">{metric.title}</p>
            <p className="text-lg font-bold text-gray-900">{metric.value}</p>
            <p className={`text-xs ${
              metric.changeType === 'positive' ? 'text-green-600' : 
              metric.changeType === 'negative' ? 'text-red-600' : 'text-blue-600'
            }`}>
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {data.topProducts && (
        <div className="mt-4 bg-white p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Top Products</h4>
          <div className="space-y-2">
            {data.topProducts.slice(0, 3).map((product: any, index: number) => (
              <div key={product.name} className="flex justify-between items-center text-sm">
                <span className="font-medium">#{index + 1} {product.name}</span>
                <div className="flex gap-3 text-xs">
                  <span className="text-gray-600">{product.orders} orders</span>
                  <span className="font-semibold">{product.sales}</span>
                  <span className="text-green-600">{product.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
