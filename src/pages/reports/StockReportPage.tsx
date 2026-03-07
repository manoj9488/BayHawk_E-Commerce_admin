import { useState } from 'react';
import { StockReportTemplate } from '../../components/reports/StockReportTemplate';
import { ProductDemandForecast } from '../../components/reports/ProductDemandForecast';
import { TaxGSTReports } from '../../components/reports/TaxGSTReports';

export function StockReportPage() {
  const [activeTab, setActiveTab] = useState('stock');

  return (
    <div className="p-6 space-y-6">
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('stock')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stock'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Stock Reports
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

      {activeTab === 'stock' && <StockReportTemplate />}
      {activeTab === 'demand-forecast' && <ProductDemandForecast />}
      {activeTab === 'tax-gst' && <TaxGSTReports />}
    </div>
  );
}
