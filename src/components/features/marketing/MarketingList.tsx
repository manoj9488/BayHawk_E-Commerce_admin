import { useState } from 'react';
import { Card, Badge, Input } from '../../ui';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';

interface MarketingItem {
  id: string;
  name?: string;
  code?: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  status?: string;
  validFrom?: string;
  validTo?: string;
  createdAt?: string;
  [key: string]: any;
}

interface MarketingListProps {
  items: MarketingItem[];
  onView: (item: MarketingItem) => void;
  onEdit: (item: MarketingItem) => void;
  onDelete: (item: MarketingItem) => void;
  onBulkAction: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
  title: string;
  itemType: string;
  renderItemContent?: (item: MarketingItem) => React.ReactNode;
  statusFilter?: string[];
}

export function MarketingList({ 
  items, 
  onView, 
  onEdit, 
  onDelete, 
  onBulkAction, 
  title,
  itemType,
  renderItemContent,
  statusFilter = ['all', 'active', 'inactive']
}: MarketingListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.name || item.code || item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && (item.isActive || item.status === 'active')) ||
      (filter === 'inactive' && (!item.isActive || item.status === 'inactive')) ||
      item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredItems.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleBulkAction = async (actionId: string, data?: any) => {
    if (selectedIds.length === 0) return;
    
    try {
      await onBulkAction(actionId, selectedIds, data);
      setSelectedIds([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const getStatusColor = (item: MarketingItem) => {
    if (item.isActive || item.status === 'active') return 'bg-green-100 text-green-800';
    if (item.status === 'scheduled') return 'bg-blue-100 text-blue-800';
    if (item.status === 'expired') return 'bg-gray-100 text-gray-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (item: MarketingItem) => {
    if (item.status) return item.status.charAt(0).toUpperCase() + item.status.slice(1);
    return item.isActive ? 'Active' : 'Inactive';
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredItems.length} {itemType}{filteredItems.length !== 1 ? 's' : ''}
              {selectedIds.length > 0 && ` • ${selectedIds.length} selected`}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Activate ({selectedIds.length})
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  Deactivate ({selectedIds.length})
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete ({selectedIds.length})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 sm:p-6 border-b bg-white">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder={`Search ${itemType}s...`}
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
          
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusFilter.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Select Header */}
      {filteredItems.length > 0 && (
        <div className="p-4 border-b bg-gray-50">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.length === filteredItems.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Select All ({filteredItems.length})
            </span>
          </label>
        </div>
      )}

      {/* Items List */}
      <div className="divide-y">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="p-4 sm:p-6">
              <div className="flex gap-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">
                          {item.name || item.code || item.title}
                        </h3>
                        <Badge variant={getStatusColor(item)}>
                          {getStatusText(item)}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Custom Content */}
                  {renderItemContent && renderItemContent(item)}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button 
                      onClick={() => onView(item)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button 
                      onClick={() => onEdit(item)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(item)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="h-12 w-12 text-gray-400 mx-auto mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {itemType}s found</h3>
            <p className="text-gray-500">
              {search || filter !== 'all'
                ? 'Try adjusting your search or filters' 
                : `No ${itemType}s available`}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
