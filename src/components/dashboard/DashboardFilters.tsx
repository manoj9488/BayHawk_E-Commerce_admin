import { useState } from "react";
import { Card, Button, Select, Input } from "../ui";
import { Filter, Download, RefreshCw, X } from "lucide-react";

interface FilterOptions {
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string;
  category?: string;
  search?: string;
  customFilters?: Record<string, any>;
}

interface DashboardFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  statusOptions?: Array<{ value: string; label: string }>;
  categoryOptions?: Array<{ value: string; label: string }>;
  customFilterComponents?: React.ReactNode;
  showSearch?: boolean;
  showDateRange?: boolean;
  showStatus?: boolean;
  showCategory?: boolean;
  className?: string;
}

export const DashboardFilters = ({
  onFiltersChange,
  statusOptions = [],
  categoryOptions = [],
  customFilterComponents,
  showSearch = true,
  showDateRange = true,
  showStatus = true,
  showCategory = true,
  className = ""
}: DashboardFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {};
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value && (typeof value === 'string' ? value.length > 0 : Object.keys(value).length > 0)
  );

  return (
    <Card className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium">Filters</h3>
            <p className="text-sm text-gray-600">
              {hasActiveFilters ? 'Active filters applied' : 'No filters applied'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {isExpanded ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {showSearch && (
              <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <Input
                  placeholder="Search..."
                  value={filters.search || ''}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                />
              </div>
            )}

            {showDateRange && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => updateFilters({ 
                      dateRange: { ...filters.dateRange, start: e.target.value, end: filters.dateRange?.end || '' }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <Input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => updateFilters({ 
                      dateRange: { ...filters.dateRange, end: e.target.value, start: filters.dateRange?.start || '' }
                    })}
                  />
                </div>
              </>
            )}

            {showStatus && statusOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => updateFilters({ status: e.target.value })}
                  options={[
                    { value: '', label: 'All Status' },
                    ...statusOptions
                  ]}
                />
              </div>
            )}

            {showCategory && categoryOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select
                  value={filters.category || ''}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                  options={[
                    { value: '', label: 'All Categories' },
                    ...categoryOptions
                  ]}
                />
              </div>
            )}
          </div>

          {customFilterComponents && (
            <div className="mt-4 pt-4 border-t">
              {customFilterComponents}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onFiltersChange(filters)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export type { FilterOptions };
