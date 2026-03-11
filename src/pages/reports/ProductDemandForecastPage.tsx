import { ProductDemandForecast } from '../../components/reports/ProductDemandForecast';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import { useDashboardFilters } from '../../hooks/useDashboardFilters';

export function ProductDemandForecastPage() {
  const { setFilters } = useDashboardFilters();

  return (
    <div className="p-6 space-y-6">
      <DashboardFilters
        onFiltersChange={setFilters}
        statusOptions={[
          { value: 'high_risk', label: 'High Risk' },
          { value: 'medium_risk', label: 'Medium Risk' },
          { value: 'low_risk', label: 'Low Risk' },
          { value: 'optimal', label: 'Optimal' }
        ]}
        categoryOptions={[
          { value: 'chicken', label: 'Chicken' },
          { value: 'mutton', label: 'Mutton' },
          { value: 'fish', label: 'Fish & Seafood' },
          { value: 'eggs', label: 'Eggs' },
          { value: 'processed', label: 'Processed Items' }
        ]}
      />
      <ProductDemandForecast />
    </div>
  );
}
