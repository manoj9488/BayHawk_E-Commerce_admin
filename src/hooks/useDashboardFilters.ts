import { useCallback, useState } from 'react';
import type { FilterOptions } from '../components/dashboard/DashboardFilters';

interface UseDashboardFiltersResult {
  filters: FilterOptions;
  setFilters: (nextFilters: FilterOptions) => void;
}

export function useDashboardFilters(initialFilters: FilterOptions = {}): UseDashboardFiltersResult {
  const [filters, setFiltersState] = useState<FilterOptions>(initialFilters);

  const setFilters = useCallback((nextFilters: FilterOptions) => {
    setFiltersState(nextFilters);
  }, []);

  return { filters, setFilters };
}
