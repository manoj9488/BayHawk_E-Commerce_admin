import { Card } from '../ui';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  href?: string;
  onClick?: () => void;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', accent: 'bg-blue-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', accent: 'bg-green-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', accent: 'bg-purple-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', accent: 'bg-orange-600' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', accent: 'bg-red-600' },
  gray: { bg: 'bg-gray-50', icon: 'text-gray-600', accent: 'bg-gray-600' },
};

export function StatsGrid({ stats, columns = 4, className = '' }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  };

  const renderStatCard = (stat: StatItem, index: number) => {
    const colors = colorMap[stat.color || 'blue'];
    const isClickable = stat.href || stat.onClick;

    const content = (
      <Card 
        className={`relative overflow-hidden transition-all duration-200 ${
          isClickable ? 'hover:shadow-md hover:border-gray-300 cursor-pointer' : ''
        }`}
        onClick={stat.onClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </p>
            
            {stat.change && (
              <div className="flex items-center gap-1">
                {stat.change.type === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : stat.change.type === 'decrease' ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : null}
                <span className={`text-sm font-medium ${
                  stat.change.type === 'increase' ? 'text-green-600' :
                  stat.change.type === 'decrease' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {stat.change.value}
                </span>
              </div>
            )}
          </div>
          
          {stat.icon && (
            <div className={`p-3 rounded-xl ${colors.bg}`}>
              <stat.icon className={`h-6 w-6 ${colors.icon}`} />
            </div>
          )}
        </div>
        
        {/* Accent bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.accent}`} />
      </Card>
    );

    if (stat.href) {
      return (
        <a key={index} href={stat.href}>
          {content}
        </a>
      );
    }

    return <div key={index}>{content}</div>;
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]} ${className}`}>
      {stats.map(renderStatCard)}
    </div>
  );
}