import { useState } from 'react';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import type { FilterOptions } from '../../components/dashboard/DashboardFilters';
import { OrderReports } from '../../components/reports/OrderReports';
import { RevenueReports } from '../../components/reports/RevenueReports';
import { ProductDemandForecast } from '../../components/reports/ProductDemandForecast';
import { TaxGSTReports } from '../../components/reports/TaxGSTReports';

export function SalesReportPage() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [activeTab, setActiveTab] = useState('orders');

  console.log('Sales report filters:', filters);

  return (
    <div className="p-6 space-y-6">
      <DashboardFilters
        onFiltersChange={setFilters}
        statusOptions={[
          { value: 'completed', label: 'Completed' },
          { value: 'pending', label: 'Pending' },
          { value: 'cancelled', label: 'Cancelled' },
          { value: 'processing', label: 'Processing' }
        ]}
        categoryOptions={[
          { value: 'poultry', label: 'Poultry' },
          { value: 'meat', label: 'Meat' },
          { value: 'seafood', label: 'Seafood' },
          { value: 'dairy', label: 'Dairy' }
        ]}
      />
      
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Order Reports
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'revenue'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Revenue Reports
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

      {activeTab === 'orders' && <OrderReports />}
      {activeTab === 'revenue' && <RevenueReports />}
      {activeTab === 'demand-forecast' && <ProductDemandForecast />}
      {activeTab === 'tax-gst' && <TaxGSTReports />}
    </div>
  );
}
