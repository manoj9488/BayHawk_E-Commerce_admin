import { Button, Select } from '../ui';
import { Download, Calendar } from 'lucide-react';

interface ReportHeaderProps {
  title: string;
  description: string;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  onSchedule: () => void;
  onExport: () => void;
}

export function ReportHeader({ 
  title, 
  description, 
  dateRange, 
  onDateRangeChange, 
  onSchedule, 
  onExport 
}: ReportHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Select
          value={dateRange}
          onChange={e => onDateRangeChange(e.target.value)}
          options={[
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'quarter', label: 'This Quarter' },
            { value: 'custom', label: 'Custom Range' },
          ]}
        />
        <Button variant="secondary" size="sm" onClick={onSchedule}>
          <Calendar className="mr-2 h-4 w-4" /> Schedule
        </Button>
        <Button size="sm" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>
    </div>
  );
}
