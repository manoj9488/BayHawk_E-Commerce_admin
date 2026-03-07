import { useState } from 'react';
import { Input, Select, Button } from '../ui';
import { Search, Filter } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
  placeholder?: string;
  className?: string;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  filters = [],
  placeholder = 'Search...',
  className = ''
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  
  const hasActiveFilters = filters.some(filter => filter.value !== '');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        
        <div className="flex gap-2">
          {filters.length > 0 && (
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 sm:flex-none text-sm ${hasActiveFilters ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
            >
              <Filter className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Filters</span>
              <span className="sm:hidden">Filter</span>
              {hasActiveFilters && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {filters.filter(f => f.value !== '').length}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && filters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              label={filter.label}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              options={[
                { value: '', label: `All ${filter.label}` },
                ...filter.options
              ]}
              className="text-sm"
            />
          ))}
        </div>
      )}
    </div>
  );
}
