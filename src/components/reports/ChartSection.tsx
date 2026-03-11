import { Button, Card } from '../ui';

interface ChartSectionProps {
  title: string;
  viewMode: string;
  onViewModeChange: (mode: string) => void;
  viewOptions: Array<{ value: string; label: string }>;
  children?: React.ReactNode;
}

export function ChartSection({ title, viewMode, onViewModeChange, viewOptions, children }: ChartSectionProps) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {viewOptions.map(option => (
            <Button
              key={option.value}
              variant={viewMode === option.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onViewModeChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      {children || (
        <div className="h-64 rounded-lg bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">{title} visualization</p>
            <p className="text-sm text-gray-400">Current view: {viewMode}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
