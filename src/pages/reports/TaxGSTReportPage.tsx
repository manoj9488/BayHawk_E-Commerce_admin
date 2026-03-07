import { useState } from 'react';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import type { FilterOptions } from '../../components/dashboard/DashboardFilters';
import { TaxGSTReports } from '../../components/reports/TaxGSTReports';
import { ProductDemandForecast } from '../../components/reports/ProductDemandForecast';

export function TaxGSTReportPage() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [activeTab, setActiveTab] = useState('tax-gst');

  console.log('Tax GST report filters:', filters);

  return (
    <div className="p-6 space-y-6">
      <DashboardFilters
        onFiltersChange={setFilters}
        statusOptions={[
          { value: 'filed', label: 'Filed' },
          { value: 'pending', label: 'Pending' },
          { value: 'overdue', label: 'Overdue' }
        ]}
        categoryOptions={[
          { value: 'cgst', label: 'CGST' },
          { value: 'sgst', label: 'SGST' },
          { value: 'igst', label: 'IGST' },
          { value: 'cess', label: 'CESS' }
        ]}
      />
      
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('tax-gst')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tax-gst'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tax & GST Reports
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
        </nav>
      </div>

      {activeTab === 'tax-gst' && <TaxGSTReports />}
      {activeTab === 'demand-forecast' && <ProductDemandForecast />}
    </div>
  );
}
