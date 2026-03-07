import { useState } from 'react';
import { 
  SearchFilter, 
  BulkActions,
  BulkActionModal,
  useBulkSelection
} from '../../common';
import { Card, Badge } from '../../ui';
import { 
  Eye, Edit, Trash2, Package, Image, CheckSquare, Square, Minus,
  Archive, ToggleLeft, ToggleRight, EyeOff
} from 'lucide-react';
import { formatCurrency, getStatusColor } from '../../../utils/helpers';
import type { Product } from '../../../types';

interface ProductsListProps {
  products: Product[];
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onToggleVisibility?: (product: Product) => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
  title?: string;
  additionalFilters?: Array<{
    key: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
  }>;
}

const productBulkActions = [
  {
    id: 'activate',
    label: 'Activate Products',
    icon: ToggleRight,
    variant: 'success' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to activate the selected products?'
  },
  {
    id: 'deactivate',
    label: 'Deactivate Products',
    icon: ToggleLeft,
    variant: 'warning' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to deactivate the selected products?'
  },
  {
    id: 'archive',
    label: 'Archive Products',
    icon: Archive,
    variant: 'warning' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to archive the selected products?'
  },
  {
    id: 'delete',
    label: 'Delete Products',
    icon: Trash2,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected products? This action cannot be undone.'
  }
];

export function ProductsList({ 
  products, 
  onView, 
  onEdit, 
  onDelete,
  onToggleVisibility,
  onBulkAction,
  title = 'Products',
  additionalFilters = []
}: ProductsListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionId: string;
    actionType: string;
  }>({ isOpen: false, actionId: '', actionType: '' });

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchValue || 
      product.nameEn.toLowerCase().includes(searchValue.toLowerCase()) ||
      product.nameTa.includes(searchValue) ||
      product.sku.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && product.isActive) ||
      (statusFilter === 'inactive' && !product.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected
  } = useBulkSelection(filteredProducts);

  const isAllSelected = selectedItems.length === filteredProducts.length && filteredProducts.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < filteredProducts.length;

  const handleBulkActionClick = (actionId: string) => {
    const action = productBulkActions.find(a => a.id === actionId);
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
        placeholder="Search products..."
        filters={[
          {
            key: 'category',
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { value: '', label: 'All Categories' },
              { value: 'fish', label: 'Fish' },
              { value: 'prawns', label: 'Prawns' },
              { value: 'crab', label: 'Crab' },
              { value: 'chicken', label: 'Chicken' },
              { value: 'mutton', label: 'Mutton' },
              { value: 'egg', label: 'Egg' }
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
          },
          ...additionalFilters
        ]}
      />

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          totalItems={filteredProducts.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          actions={productBulkActions}
          onAction={handleBulkActionClick}
          itemName="products"
        />
      )}

      {/* Select All Header */}
      {filteredProducts.length > 0 && (
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
                ? `${selectedItems.length} of ${filteredProducts.length} ${title.toLowerCase()} selected`
                : `Select all ${filteredProducts.length} ${title.toLowerCase()}`
              }
            </span>
          </div>
        </Card>
      )}

      {/* Products List */}
      <div className="space-y-3">
        {filteredProducts.map(product => (
          <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              {/* Selection Checkbox */}
              <button
                onClick={() => toggleItem(product.id)}
                className={`p-1 rounded transition-colors flex-shrink-0 ${
                  isSelected(product.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isSelected(product.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              </button>

              {/* Product Image */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Image className="h-8 w-8 text-gray-400" />
              </div>

              {/* Product Info - Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{product.nameEn}</h3>
                      <div className="flex flex-wrap items-center gap-1">
                        <Badge variant={getStatusColor(product.isActive ? 'active' : 'inactive')} className="text-xs">
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {product.isBestSeller && <Badge variant="bg-yellow-100 text-yellow-800" className="text-xs">Best Seller</Badge>}
                        {product.isRare && <Badge variant="bg-purple-100 text-purple-800" className="text-xs">Rare</Badge>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">{product.nameTa}</span>
                      </div>
                      <div>
                        <span className="font-mono text-xs">{product.sku}</span>
                      </div>
                      <div>
                        <Badge variant="bg-gray-100 text-gray-800" className="text-xs">{product.category}</Badge>
                      </div>
                      <div>
                        <Badge variant={product.deliveryType === 'same_day' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} className="text-xs">
                          {product.deliveryType.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Price & Stock */}
                  <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatCurrency(product.variants[0]?.price || 0)}</p>
                      {product.variants[0]?.discount && (
                        <p className="text-xs text-green-600">{product.variants[0].discount}% off</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${(product.variants[0]?.stock || 0) < 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.variants[0]?.stock || 0} {product.category === 'egg' ? 'pcs' : 'kg'}
                      </p>
                      <p className="text-xs text-gray-500">Stock</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <button 
                  onClick={() => onToggleVisibility?.(product)}
                  className={`p-2 rounded-lg transition-colors ${
                    product.isActive 
                      ? 'hover:bg-yellow-50 text-yellow-600' 
                      : 'hover:bg-green-50 text-green-600'
                  }`}
                  title={product.isActive ? 'Hide Product' : 'Show Product'}
                >
                  {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button 
                  onClick={() => onView?.(product)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => onEdit?.(product)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => onDelete?.(product)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
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
        itemName="products"
      />
    </div>
  );
}
