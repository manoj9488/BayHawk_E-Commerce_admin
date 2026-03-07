import { useState } from 'react';
import { ProductTrendAnalysis } from '../../components/reports/ProductTrendAnalysis';
import { ProductDemandForecast } from '../../components/reports/ProductDemandForecast';
import { TaxGSTReports } from '../../components/reports/TaxGSTReports';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import { useDashboardFilters } from '../../hooks/useDashboardFilters';

export function ProductTrendAnalysisPage() {
  const { setFilters } = useDashboardFilters();
  const [activeTab, setActiveTab] = useState('trend-analysis');

  return (
    <div className="p-6 space-y-6">
      <DashboardFilters
        onFiltersChange={setFilters}
        statusOptions={[
          { value: 'trending_up', label: 'Trending Up' },
          { value: 'trending_down', label: 'Trending Down' },
          { value: 'stable', label: 'Stable' },
          { value: 'volatile', label: 'Volatile' }
        ]}
        categoryOptions={[
          { value: 'poultry', label: 'Poultry' },
          { value: 'meat', label: 'Meat' },
          { value: 'seafood', label: 'Seafood' },
          { value: 'dairy', label: 'Dairy' },
          { value: 'processed', label: 'Processed' }
        ]}
      />
      
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('trend-analysis')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trend-analysis'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Trend Analysis
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

      {activeTab === 'trend-analysis' && <ProductTrendAnalysis />}
      {activeTab === 'demand-forecast' && <ProductDemandForecast />}
      {activeTab === 'tax-gst' && <TaxGSTReports />}
    </div>
  );
}
