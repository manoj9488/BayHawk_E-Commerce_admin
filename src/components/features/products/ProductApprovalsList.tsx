import { useState } from 'react';
import { Card, Badge, Input } from '../../ui';
import { Search, Eye, Check, X, User, Calendar, Package, FileText, AlertCircle, MoreVertical } from 'lucide-react';

interface ProductRequest {
  id: string;
  productName: string;
  productNameTa: string;
  category: string;
  hsnNumber: string;
  variant: string;
  fishSize: string;
  maxSize: string;
  basePriceMin: number;
  basePriceMax: number;
  fishCountMin: number;
  fishCountMax: number;
  description: string;
  price: number;
  unit: string;
  images: string[];
  primaryImageIndex: number;
  requestedBy: string;
  requestedByRole: string;
  requestDate: string;
  sourceType: 'hub' | 'store';
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  reason?: string;
  isBestSeller: boolean;
  isRareProduct: boolean;
  isActive: boolean;
  productType: 'fresh' | 'frozen' | 'processed' | '';
  season: string;
  metaTitle: string;
  metaDescription: string;
  variants: Array<{
    id: string;
    type: string;
    size: string;
    grossWeight: string;
    netWeight: string;
    pieces: string;
    serves: string;
    skuNumber: string;
    actualPrice: number;
    salesPrice: number;
    stock: number;
    igst: number;
    cgst: number;
    sgst: number;
    cuttingTypeId?: string;
    cuttingTypeName?: string;
  }>;
  dayBasedPricing?: {
    enabled: boolean;
    dayPrices: Array<{
      day: string;
      price: number;
      enabled: boolean;
    }>;
  };
  productTags?: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    cholesterol: number;
    vitamins: {
      vitaminA: number;
      vitaminC: number;
      vitaminD: number;
      vitaminB12: number;
    };
    minerals: {
      calcium: number;
      iron: number;
      potassium: number;
      magnesium: number;
    };
  };
}

interface ProductApprovalsListProps {
  requests: ProductRequest[];
  onView: (request: ProductRequest) => void;
  onApprove: (request: ProductRequest) => void;
  onReject: (request: ProductRequest) => void;
  onBulkAction: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
  title: string;
}

export function ProductApprovalsList({ 
  requests, 
  onView, 
  onApprove, 
  onReject, 
  onBulkAction, 
  title 
}: ProductApprovalsListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showBulkActions, setShowBulkActions] = useState(false);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.productName.toLowerCase().includes(search.toLowerCase()) ||
      request.productNameTa.includes(search) || 
      request.category.toLowerCase().includes(search.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredRequests.map(req => req.id));
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
      setShowBulkActions(false);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const bulkActions = [
    { id: 'approve_selected', label: 'Approve Selected', icon: Check, color: 'text-green-600' },
    { id: 'reject_selected', label: 'Reject Selected', icon: X, color: 'text-red-600' },
  ];

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
              {selectedIds.length > 0 && ` • ${selectedIds.length} selected`}
            </p>
          </div>
          
          {selectedIds.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
                Bulk Actions ({selectedIds.length})
              </button>
              
              {showBulkActions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {bulkActions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleBulkAction(action.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${action.color}`}
                    >
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 sm:p-6 border-b bg-white">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search requests..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bulk Select Header */}
      {filteredRequests.length > 0 && (
        <div className="p-4 border-b bg-gray-50">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.length === filteredRequests.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Select All ({filteredRequests.length})
            </span>
          </label>
        </div>
      )}

      {/* Requests List */}
      <div className="divide-y">
        {filteredRequests.length > 0 ? (
          filteredRequests.map(request => (
            <div key={request.id} className="p-4 sm:p-6">
              <div className="flex gap-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(request.id)}
                    onChange={(e) => handleSelectItem(request.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img 
                    src={request.images[0]} 
                    alt={request.productName}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{request.productName}</h3>
                        <Badge variant={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                        <Badge variant={getPriorityColor(request.priority)}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                        </Badge>
                        <Badge variant={request.sourceType === 'hub' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}>
                          {request.sourceType.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{request.productNameTa}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{request.description}</p>
                    </div>
                    
                    <div className="text-right flex-shrink-0 bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Price per Unit</p>
                      <p className="text-2xl font-bold text-green-600">₹{request.price}</p>
                      <p className="text-sm text-gray-600 font-medium">per {request.unit}</p>
                    </div>
                  </div>

                  {/* All Product Images */}
                  {request.images.length > 1 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Product Images ({request.images.length})</p>
                      <div className="grid grid-cols-4 gap-2">
                        {request.images.map((img, idx) => (
                          <img 
                            key={idx}
                            src={img} 
                            alt={`${request.productName} ${idx + 1}`}
                            className="w-full h-20 object-cover rounded-lg bg-gray-100 border"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Information */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 mb-2">Request Information</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-600">Request ID</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">{request.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-600">Requested By</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">{request.requestedBy}</p>
                          <p className="text-xs text-gray-500 truncate">{request.requestedByRole}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Request Date</p>
                          <p className="text-sm font-semibold text-gray-900">{new Date(request.requestDate).toLocaleDateString('en-IN', { 
                            year: 'numeric', month: 'short', day: 'numeric' 
                          })}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Category</p>
                          <p className="text-sm font-semibold text-gray-900">{request.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs font-semibold text-purple-900 mb-2">Product Details</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-white p-2 rounded border border-purple-100">
                        <p className="text-xs text-gray-600 mb-1">HSN Number</p>
                        <p className="text-sm font-semibold text-gray-900">{request.hsnNumber}</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-purple-100">
                        <p className="text-xs text-gray-600 mb-1">Variant</p>
                        <p className="text-sm font-semibold text-gray-900">{request.variant}</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-purple-100">
                        <p className="text-xs text-gray-600 mb-1">Product Type</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{request.productType}</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-purple-100">
                        <p className="text-xs text-gray-600 mb-1">Season</p>
                        <p className="text-sm font-semibold text-gray-900">{request.season}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {request.status === 'rejected' && request.reason && (
                    <div className="mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="font-semibold text-red-800 text-sm">Rejection Reason</span>
                      </div>
                      <p className="text-sm text-red-700">{request.reason}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => onView(request)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    
                    {request.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => onApprove(request)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </button>
                        <button 
                          onClick={() => onReject(request)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500">
              {search || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No product requests available'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
