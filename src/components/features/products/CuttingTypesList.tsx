import { useState } from 'react';
import { 
  SearchFilter, 
  BulkActions,
  BulkActionModal,
  useBulkSelection
} from '../../common';
import { Card, Badge } from '../../ui';
import { 
  Eye, Edit, Trash2, Scissors, CheckSquare, Square, Minus,
  ToggleLeft, ToggleRight, Fish, ChefHat
} from 'lucide-react';

interface CuttingType {
  id: string;
  name: string;
  description: string;
  category: 'fish' | 'chicken' | 'mutton' | 'other';
  moduleType: 'hub' | 'store';
  method: string;
  imageUrl?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

interface CuttingTypesListProps {
  cuttingTypes: CuttingType[];
  onView?: (type: CuttingType) => void;
  onEdit?: (type: CuttingType) => void;
  onDelete?: (type: CuttingType) => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
  title?: string;
}

const cuttingTypeBulkActions = [
  {
    id: 'activate',
    label: 'Activate Types',
    icon: ToggleRight,
    variant: 'success' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to activate the selected cutting types?'
  },
  {
    id: 'deactivate',
    label: 'Deactivate Types',
    icon: ToggleLeft,
    variant: 'warning' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to deactivate the selected cutting types?'
  },
  {
    id: 'delete',
    label: 'Delete Types',
    icon: Trash2,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected cutting types? This action cannot be undone.'
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'fish': return Fish;
    case 'chicken': return ChefHat;
    case 'mutton': return ChefHat;
    default: return Scissors;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'fish': return 'bg-blue-100 text-blue-800';
    case 'chicken': return 'bg-yellow-100 text-yellow-800';
    case 'mutton': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function CuttingTypesList({ 
  cuttingTypes, 
  onView, 
  onEdit, 
  onDelete,
  onBulkAction,
  title = 'Cutting Types'
}: CuttingTypesListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionId: string;
    actionType: string;
  }>({ isOpen: false, actionId: '', actionType: '' });

  // Filter cutting types
  const filteredTypes = cuttingTypes.filter(type => {
    const matchesSearch = !searchValue || 
      type.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      type.description.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesCategory = !categoryFilter || type.category === categoryFilter;
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && type.isActive) ||
      (statusFilter === 'inactive' && !type.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected
  } = useBulkSelection(filteredTypes);

  const isAllSelected = selectedItems.length === filteredTypes.length && filteredTypes.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < filteredTypes.length;

  const handleBulkActionClick = (actionId: string) => {
    const action = cuttingTypeBulkActions.find(a => a.id === actionId);
    if (action?.requiresConfirmation) {
      setBulkActionModal({
        isOpen: true,
        actionId,
        actionType: action.variant || 'default'
      });
    } else {
      onBulkAction?.(actionId, selectedItems);
    }
  };

  const handleConfirmBulkAction = async (data?: any) => {
    if (onBulkAction) {
      await onBulkAction(bulkActionModal.actionId, selectedItems, data);
      deselectAll();
    }
    setBulkActionModal({ isOpen: false, actionId: '', actionType: '' });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search cutting types..."
        filters={[
          {
            key: 'category',
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { value: '', label: 'All Categories' },
              { value: 'fish', label: 'Fish' },
              { value: 'chicken', label: 'Chicken' },
              { value: 'mutton', label: 'Mutton' }
            ]
          },
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]
          }
        ]}
      />

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          totalItems={filteredTypes.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          actions={cuttingTypeBulkActions}
          onAction={handleBulkActionClick}
          itemName="cutting types"
        />
      )}

      {/* Select All Header */}
      {filteredTypes.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={isAllSelected ? deselectAll : selectAll}
              className={`p-1 rounded transition-colors ${
                isAllSelected ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isAllSelected ? <CheckSquare className="h-4 w-4" /> : 
               isIndeterminate ? <Minus className="h-4 w-4" /> : 
               <Square className="h-4 w-4" />}
            </button>
            <span className="text-sm font-medium text-gray-700">
              {selectedItems.length > 0 
                ? `${selectedItems.length} of ${filteredTypes.length} ${title.toLowerCase()} selected`
                : `Select all ${filteredTypes.length} ${title.toLowerCase()}`
              }
            </span>
          </div>
        </Card>
      )}

      {/* Cutting Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTypes.map(type => {
          const CategoryIcon = getCategoryIcon(type.category);
          
          return (
            <Card key={type.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                {/* Selection Checkbox */}
                <button
                  onClick={() => toggleItem(type.id)}
                  className={`p-1 rounded transition-colors flex-shrink-0 ${
                    isSelected(type.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {isSelected(type.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>

                {/* Type Image */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {type.imageUrl ? (
                    <img src={type.imageUrl} alt={type.name} className="w-full h-full object-cover" />
                  ) : (
                    <Scissors className="h-8 w-8 text-gray-400" />
                  )}
                </div>

                {/* Type Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{type.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{type.description}</p>
                    </div>
                    <Badge variant={type.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} className="ml-2 flex-shrink-0">
                      {type.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-4 w-4 text-gray-500" />
                      <Badge variant={getCategoryColor(type.category)} className="text-xs">
                        {type.category.charAt(0).toUpperCase() + type.category.slice(1)}
                      </Badge>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <button 
                        onClick={() => onView?.(type)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onEdit?.(type)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDelete?.(type)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {filteredTypes.length === 0 && (
        <Card className="p-12 text-center">
          <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cutting types found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </Card>
      )}

      {/* Bulk Action Modal */}
      <BulkActionModal
        isOpen={bulkActionModal.isOpen}
        onClose={() => setBulkActionModal({ isOpen: false, actionId: '', actionType: '' })}
        onConfirm={handleConfirmBulkAction}
        title={`Bulk Action: ${bulkActionModal.actionId}`}
        actionType={bulkActionModal.actionType}
        selectedCount={selectedItems.length}
        itemName="cutting types"
      />
    </div>
  );
}
