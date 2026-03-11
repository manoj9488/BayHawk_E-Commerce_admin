import { useState } from 'react';
import { 
  SearchFilter, 
  BulkActions,
  BulkActionModal,
  useBulkSelection
} from '../common';
import { Card, Badge } from '../ui';
import { 
  Eye, Edit, Trash2, GripVertical, CheckSquare, Square, Minus,
  EyeOff, Package, ArrowUp, ArrowDown
} from 'lucide-react';
import type { CategoryFormData } from './CategoryForm';

interface Category extends CategoryFormData {
  id: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryListProps {
  categories: Category[];
  onView?: (category: Category) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onReorder?: (categories: Category[]) => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
  title?: string;
  allowReordering?: boolean;
}

const categoryBulkActions = [
  {
    id: 'show',
    label: 'Show Categories',
    icon: Eye,
    variant: 'success' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to show the selected categories?'
  },
  {
    id: 'hide',
    label: 'Hide Categories',
    icon: EyeOff,
    variant: 'warning' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to hide the selected categories?'
  },
  {
    id: 'delete',
    label: 'Delete Categories',
    icon: Trash2,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected categories? This action cannot be undone and will affect all products using these categories.'
  }
];

const getColorClass = (color: string) => {
  const colorMap: { [key: string]: string } = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    teal: 'bg-teal-100 text-teal-800 border-teal-200',
    cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  };
  return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getIconEmoji = (icon: string) => {
  const iconMap: { [key: string]: string } = {
    fish: '🐟',
    shrimp: '🦐',
    crab: '🦀',
    squid: '🦑',
    chicken: '🐔',
    meat: '🥩',
    egg: '🥚',
    spices: '🌶️',
    vegetable: '🥬',
    fruit: '🍎',
  };
  return iconMap[icon] || '📦';
};

export function CategoryList({ 
  categories, 
  onView, 
  onEdit, 
  onDelete,
  onReorder,
  onBulkAction,
  title = 'Categories',
  allowReordering = true
}: CategoryListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionId: string;
    actionType: string;
  }>({ isOpen: false, actionId: '', actionType: '' });

  // Filter categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchValue || 
      category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      category.nameTa.includes(searchValue) ||
      category.description.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && category.isActive) ||
      (statusFilter === 'inactive' && !category.isActive);
    
    
    return matchesSearch && matchesStatus;
  });

  const {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected
  } = useBulkSelection(filteredCategories);

  const isAllSelected = selectedItems.length === filteredCategories.length && filteredCategories.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < filteredCategories.length;

  const handleBulkActionClick = (actionId: string) => {
    const action = categoryBulkActions.find(a => a.id === actionId);
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

  const handleMoveUp = (index: number) => {
    if (index > 0 && onReorder) {
      const newCategories = [...filteredCategories];
      [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
      
      // Update order values
      const reorderedCategories = newCategories.map((item, idx) => ({
        ...item,
        order: idx
      }));
      
      onReorder(reorderedCategories);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < filteredCategories.length - 1 && onReorder) {
      const newCategories = [...filteredCategories];
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
      
      // Update order values
      const reorderedCategories = newCategories.map((item, idx) => ({
        ...item,
        order: idx
      }));
      
      onReorder(reorderedCategories);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search categories by name, Tamil name, or description..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Visible' },
              { value: 'inactive', label: 'Hidden' }
            ]
          }
        ]}
      />

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          totalItems={filteredCategories.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          actions={categoryBulkActions}
          onAction={handleBulkActionClick}
          itemName="categories"
        />
      )}

      {/* Select All Header */}
      {filteredCategories.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
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
                  ? `${selectedItems.length} of ${filteredCategories.length} ${title.toLowerCase()} selected`
                  : `Select all ${filteredCategories.length} ${title.toLowerCase()}`
                }
              </span>
            </div>
            {allowReordering && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <GripVertical className="h-4 w-4" />
                <span>Use arrows to reorder</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {filteredCategories.map((category, index) => (
          <Card key={category.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              {/* Reorder Controls */}
              {allowReordering && (
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className={`p-1 rounded transition-colors ${
                      index === 0 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === filteredCategories.length - 1}
                    className={`p-1 rounded transition-colors ${
                      index === filteredCategories.length - 1
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Selection Checkbox */}
              <button
                onClick={() => toggleItem(category.id)}
                className={`p-1 rounded transition-colors flex-shrink-0 ${
                  isSelected(category.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isSelected(category.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              </button>

              {/* Category Image/Icon */}
              <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${getColorClass(category.color)}`}>
                {category.image ? (
                  <img
                    src={typeof category.image === 'string' ? category.image : URL.createObjectURL(category.image)}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-2xl">{getIconEmoji(category.icon)}</span>
                )}
              </div>

              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                      <Badge 
                        variant={category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} 
                        className="flex-shrink-0"
                      >
                        {category.isActive ? 'Visible' : 'Hidden'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{category.nameTa}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-gray-900">
                      {category.productCount} products
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <button 
                      onClick={() => onView?.(category)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onEdit?.(category)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onDelete?.(category)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredCategories.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500">Try adjusting your search or filters, or create a new category</p>
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
        itemName="categories"
      />
    </div>
  );
}

export type { Category };