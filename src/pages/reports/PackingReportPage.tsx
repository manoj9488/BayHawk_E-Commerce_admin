import { useState } from 'react';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import type { FilterOptions } from '../../components/dashboard/DashboardFilters';
import { OperationalReports } from '../../components/reports/OperationalReports';
import { ProductDemandForecast } from '../../components/reports/ProductDemandForecast';
import { TaxGSTReports } from '../../components/reports/TaxGSTReports';

export function PackingReportPage() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [activeTab, setActiveTab] = useState('operational');

  console.log('Packing report filters:', filters);

  return (
    <div className="p-6 space-y-6">
      <DashboardFilters
        onFiltersChange={setFilters}
        statusOptions={[
          { value: 'completed', label: 'Completed' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'pending', label: 'Pending' },
          { value: 'delayed', label: 'Delayed' }
        ]}
        categoryOptions={[
          { value: 'team_a', label: 'Team A' },
          { value: 'team_b', label: 'Team B' },
          { value: 'team_c', label: 'Team C' }
        ]}
      />
      
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('operational')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'operational'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Operational Reports
          </button>
          <button
            onClick={() => setActiveTab('demand-forecast')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'demand-forecast'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Demand Forecast
          </button>
          <button
            onClick={() => setActiveTab('tax-gst')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tax-gst'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tax & GST
          </button>
        </nav>
      </div>

      {activeTab === 'operational' && <OperationalReports />}
      {activeTab === 'demand-forecast' && <ProductDemandForecast />}
      {activeTab === 'tax-gst' && <TaxGSTReports />}
    </div>
  );
}
