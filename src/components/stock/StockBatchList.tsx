import { useState } from 'react';
import { 
  SearchFilter, 
  BulkActions,
  BulkActionModal,
  useBulkSelection
} from '../common';
import { Card, Badge } from '../ui';
import { 
  Eye, Edit, Trash2, Package, CheckSquare, Square, Minus,
  Calendar, MapPin, Thermometer, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import type { StockBatchData } from './StockBatchForm';

interface StockBatch extends StockBatchData {
  id: string;
  totalValue: number;
  daysUntilExpiry: number;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

interface StockBatchListProps {
  batches: StockBatch[];
  onView?: (batch: StockBatch) => void;
  onEdit?: (batch: StockBatch) => void;
  onDelete?: (batch: StockBatch) => void;
  onApprove?: (batch: StockBatch) => void;
  onReject?: (batch: StockBatch) => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
  title?: string;
  showApprovalActions?: boolean;
}

const stockBulkActions = [
  {
    id: 'approve',
    label: 'Approve Batches',
    icon: CheckCircle,
    variant: 'success' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to approve the selected batches?'
  },
  {
    id: 'reject',
    label: 'Reject Batches',
    icon: XCircle,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to reject the selected batches?'
  },
  {
    id: 'update_expiry',
    label: 'Update Expiry Dates',
    icon: Calendar,
    variant: 'warning' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Update expiry dates for selected batches?'
  },
  {
    id: 'delete',
    label: 'Delete Batches',
    icon: Trash2,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected batches? This action cannot be undone.'
  }
];

export function StockBatchList({ 
  batches, 
  onView, 
  onEdit, 
  onDelete,
  onApprove,
  onReject,
  onBulkAction,
  title = 'Stock Batches',
  showApprovalActions = false
}: StockBatchListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('');
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionId: string;
    actionType: string;
  }>({ isOpen: false, actionId: '', actionType: '' });

  // Filter batches
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = !searchValue || 
      batch.productName.toLowerCase().includes(searchValue.toLowerCase()) ||
      batch.batchNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      batch.traceabilityCode.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesCategory = !categoryFilter || batch.category === categoryFilter;
    
    const matchesStatus = !statusFilter || batch.status === statusFilter;
    
    const matchesExpiry = !expiryFilter || 
      (expiryFilter === 'expired' && batch.daysUntilExpiry < 0) ||
      (expiryFilter === 'expiring_soon' && batch.daysUntilExpiry >= 0 && batch.daysUntilExpiry <= 3) ||
      (expiryFilter === 'fresh' && batch.daysUntilExpiry > 3);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesExpiry;
  });

  const {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected
  } = useBulkSelection(filteredBatches);

  const isAllSelected = selectedItems.length === filteredBatches.length && filteredBatches.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < filteredBatches.length;

  const handleBulkActionClick = (actionId: string) => {
    const action = stockBulkActions.find(a => a.id === actionId);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpiryColor = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return 'text-red-600';
    if (daysUntilExpiry <= 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getExpiryStatus = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry === 0) return 'Expires Today';
    if (daysUntilExpiry <= 3) return `${daysUntilExpiry} days left`;
    return `${daysUntilExpiry} days left`;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search by product name, batch number, or traceability code..."
        filters={[
          {
            key: 'category',
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { value: '', label: 'All Categories' },
              { value: 'sea-fish', label: 'Sea Fish' },
              { value: 'freshwater-fish', label: 'Freshwater Fish' },
              { value: 'shell-fish', label: 'Shell Fish' },
              { value: 'dry-fish', label: 'Dry Fish' },
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
              { value: 'pending', label: 'Pending Approval' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' }
            ]
          },
          {
            key: 'expiry',
            label: 'Expiry Status',
            value: expiryFilter,
            onChange: setExpiryFilter,
            options: [
              { value: '', label: 'All Items' },
              { value: 'fresh', label: 'Fresh (>3 days)' },
              { value: 'expiring_soon', label: 'Expiring Soon (≤3 days)' },
              { value: 'expired', label: 'Expired' }
            ]
          }
        ]}
      />

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          totalItems={filteredBatches.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          actions={stockBulkActions}
          onAction={handleBulkActionClick}
          itemName="batches"
        />
      )}

      {/* Select All Header */}
      {filteredBatches.length > 0 && (
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
                ? `${selectedItems.length} of ${filteredBatches.length} ${title.toLowerCase()} selected`
                : `Select all ${filteredBatches.length} ${title.toLowerCase()}`
              }
            </span>
          </div>
        </Card>
      )}

      {/* Batches List */}
      <div className="space-y-3">
        {filteredBatches.map(batch => (
          <Card key={batch.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* Selection Checkbox */}
              <button
                onClick={() => toggleItem(batch.id)}
                className={`p-1 rounded transition-colors flex-shrink-0 mt-1 ${
                  isSelected(batch.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isSelected(batch.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              </button>

              {/* Batch Content */}
              <div className="flex-1 min-w-0">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-lg text-gray-900">{batch.productName}</h3>
                      <Badge variant={getStatusColor(batch.status)} className="text-xs">
                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                      </Badge>
                      <Badge variant="bg-purple-100 text-purple-800" className="text-xs capitalize">
                        {batch.qualityGrade.replace('-', ' ')}
                      </Badge>
                      {batch.chemicalFree === 'organic' && (
                        <Badge variant="bg-green-100 text-green-800" className="text-xs">Organic</Badge>
                      )}
                      {batch.chemicalFree === 'yes' && (
                        <Badge variant="bg-green-100 text-green-800" className="text-xs">Chemical Free</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">{batch.batchNumber}</span>
                      <span className="font-mono bg-blue-50 px-2 py-1 rounded text-blue-700">{batch.traceabilityCode}</span>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0 bg-green-50 p-3 rounded-lg border border-green-200 ml-4">
                    <p className="text-xs text-gray-600 mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(batch.totalValue)}</p>
                  </div>
                </div>

                {/* Batch Information Grid */}
                <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-2">Batch Information</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-600">Category</p>
                      <p className="font-semibold text-gray-900 capitalize">{batch.category.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Individual Weight</p>
                      <p className="font-semibold text-gray-900">{batch.individualWeight} {batch.quantityUnit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Quantity</p>
                      <p className="font-semibold text-gray-900">{batch.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Catch Type</p>
                      <p className="font-semibold text-gray-900 capitalize">{batch.catchType}</p>
                    </div>
                  </div>
                </div>

                {/* Dates & Expiry */}
                <div className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs font-semibold text-yellow-900 mb-2">Dates & Expiry</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Catch/Slaughter</p>
                        <p className="text-xs font-semibold text-gray-900">{new Date(batch.catchSlaughterDate).toLocaleDateString('en-IN', { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Received Date</p>
                        <p className="text-xs font-semibold text-gray-900">{new Date(batch.receivedDate).toLocaleDateString('en-IN', { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Expiry Date</p>
                        <p className={`text-xs font-semibold ${getExpiryColor(batch.daysUntilExpiry)}`}>
                          {new Date(batch.expiryDate).toLocaleDateString('en-IN', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Days Until Expiry</p>
                        <p className={`text-xs font-bold ${getExpiryColor(batch.daysUntilExpiry)}`}>
                          {getExpiryStatus(batch.daysUntilExpiry)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Origin & Source */}
                <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs font-semibold text-purple-900 mb-2">Origin & Source</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-purple-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Harvest Origin</p>
                        <p className="text-xs font-semibold text-gray-900">{batch.harvestOrigin}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-purple-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Country</p>
                        <p className="text-xs font-semibold text-gray-900">{batch.countryOfOrigin}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Created By</p>
                      <p className="text-xs font-semibold text-gray-900">{batch.createdBy}</p>
                      <p className="text-xs text-gray-500">{batch.createdByRole}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Chemical Status</p>
                      <p className="text-xs font-semibold text-gray-900 capitalize">{batch.chemicalFree}</p>
                    </div>
                  </div>
                </div>

                {/* Storage & Packaging */}
                <div className="mb-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-xs font-semibold text-indigo-900 mb-2">Storage & Packaging</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3 text-indigo-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Packaging Type</p>
                        <p className="text-xs font-semibold text-gray-900">{batch.packagingType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3 text-indigo-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Storage Temperature</p>
                        <p className="text-xs font-semibold text-gray-900">{batch.storageTemperature}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Quality Grade</p>
                      <p className="text-xs font-semibold text-gray-900 capitalize">{batch.qualityGrade.replace('-', ' ')}</p>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                {batch.certifications.length > 0 && (
                  <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs font-semibold text-green-900 mb-2">Certifications ({batch.certifications.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {batch.certifications.map(cert => (
                        <Badge key={cert} variant="bg-green-100 text-green-800" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approval/Rejection Info */}
                {batch.status === 'approved' && batch.approvedBy && (
                  <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs font-semibold text-green-900 mb-1">Approval Information</p>
                    <p className="text-xs text-green-700">
                      Approved by <strong>{batch.approvedBy}</strong> on{' '}
                      {batch.approvedDate && new Date(batch.approvedDate).toLocaleDateString('en-IN', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}

                {batch.status === 'rejected' && batch.rejectionReason && (
                  <div className="mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs font-semibold text-red-900 mb-1">Rejection Reason</p>
                    <p className="text-xs text-red-700">{batch.rejectionReason}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-3 border-t">
                  <button 
                    onClick={() => onView?.(batch)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    View Details
                  </button>
                  <button 
                    onClick={() => onEdit?.(batch)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </button>
                  {showApprovalActions && batch.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => onApprove?.(batch)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Approve
                      </button>
                      <button 
                        onClick={() => onReject?.(batch)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="h-3 w-3" />
                        Reject
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => onDelete?.(batch)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredBatches.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stock batches found</h3>
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
        itemName="batches"
      />
    </div>
  );
}

export type { StockBatch };