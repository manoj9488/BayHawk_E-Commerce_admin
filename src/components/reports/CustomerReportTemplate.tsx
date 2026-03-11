import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, IndianRupee, Heart, Building2, Store } from 'lucide-react';
import { ReportHeader } from './ReportHeader';
import { MetricCard } from './MetricCard';
import { ChartSection } from './ChartSection';
import { DetailedSection } from './DetailedSection';
import { customerData } from './reportData';

export function CustomerReportTemplate() {
  const [dateRange, setDateRange] = useState('today');
  const [viewMode, setViewMode] = useState('overview');
  const location = useLocation();

  const getCurrentModule = () => {
    if (location.pathname.includes('/hub/')) return 'hub';
    if (location.pathname.includes('/store/')) return 'store';
    return 'super_admin';
  };

  const currentModule = getCurrentModule();
  const data = customerData[currentModule];

  const handleScheduleReport = () => {
    alert(`Schedule ${currentModule} customer report functionality`);
  };

  const handleExportReport = () => {
    alert(`Exporting ${currentModule} customer report...`);
  };

  const icons = [Users, Users, IndianRupee, Heart];
  const iconColors = ['bg-blue-50 text-blue-600', 'bg-green-50 text-green-600', 'bg-purple-50 text-purple-600', 'bg-orange-50 text-orange-600'];

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Customer Report"
        description="New customers, active customers, and lifetime value analytics"
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onSchedule={handleScheduleReport}
        onExport={handleExportReport}
      />

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={icons[index]}
            iconColor={iconColors[index]}
          />
        ))}
      </div>

      {/* Customer Growth Chart */}
      <ChartSection
        title="Customer Growth"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        viewOptions={[
          { value: 'overview', label: 'Overview' },
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
        ]}
      />

      {/* Detailed Hub & Store Reports */}
      {currentModule === 'super_admin' && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Detailed Reports by Location</h2>
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <DetailedSection
              title="Hub Customers"
              icon={Building2}
              data={customerData.hub}
              type="hub"
            />
            <DetailedSection
              title="Store Customers"
              icon={Store}
              data={customerData.store}
              type="store"
            />
          </div>
        </>
      )}
    </div>
  );
}
