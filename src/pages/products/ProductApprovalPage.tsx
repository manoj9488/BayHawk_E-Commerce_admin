import { useEffect, useMemo, useState } from 'react';
import { Card, Badge, Modal, Button } from '../../components/ui';
import { ProductApprovalsList } from '../../components/features/products';
import { Building2, Store, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  bulkDecideProductApprovals,
  decideProductApproval,
  listProductApprovals,
  type ProductApprovalRecord,
} from '../../utils/productBackend';

export function ProductApprovalPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>('hub');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<ProductApprovalRecord[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ProductApprovalRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approveNotes, setApproveNotes] = useState('');

  const loadApprovals = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await listProductApprovals({ limit: '200' });
      setRequests(data);
    } catch (loadError) {
      console.error('Failed to load product approvals', loadError);
      setError(loadError instanceof Error ? loadError.message : 'Failed to load approval queue');
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadApprovals();
  }, []);

  const decisionBy = user?.id && user.name && user.role
    ? {
        userId: user.id,
        name: user.name,
        role: user.role,
      }
    : null;

  const hubRequests = useMemo(
    () => requests.filter((request) => request.sourceType === 'hub'),
    [requests]
  );
  const storeRequests = useMemo(
    () => requests.filter((request) => request.sourceType === 'store'),
    [requests]
  );

  const tabs = [
    { id: 'hub', label: 'Hub Requests', icon: Building2, count: hubRequests.length },
    { id: 'store', label: 'Store Requests', icon: Store, count: storeRequests.length },
  ];

  const getCurrentRequests = () => (activeTab === 'hub' ? hubRequests : storeRequests);

  const handleBulkAction = async (actionId: string, selectedIds: string[]) => {
    if (!decisionBy) {
      alert('User context is missing. Please login again.');
      return;
    }

    try {
      if (actionId === 'approve_selected') {
        await bulkDecideProductApprovals({
          ids: selectedIds,
          action: 'approve',
          decisionBy,
          notes: 'Approved from bulk action',
        });
      } else if (actionId === 'reject_selected') {
        const reason = prompt('Please provide a reason for bulk rejection:');
        if (!reason?.trim()) {
          return;
        }

        await bulkDecideProductApprovals({
          ids: selectedIds,
          action: 'reject',
          decisionBy,
          rejectionReason: reason.trim(),
        });
      }

      await loadApprovals();
    } catch (bulkError) {
      console.error('Bulk approval action failed', bulkError);
      alert(bulkError instanceof Error ? bulkError.message : 'Bulk action failed');
    }
  };

  const handleViewDetails = (request: ProductApprovalRecord) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleApprove = (request: ProductApprovalRecord) => {
    setSelectedRequest(request);
    setApproveNotes('');
    setShowApproveModal(true);
  };

  const handleReject = (request: ProductApprovalRecord) => {
    setSelectedRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedRequest || !decisionBy) {
      return;
    }

    try {
      await decideProductApproval(selectedRequest.id, {
        action: 'approve',
        decisionBy,
        notes: approveNotes || undefined,
      });
      await loadApprovals();
      setShowApproveModal(false);
      setSelectedRequest(null);
      setApproveNotes('');
    } catch (approveError) {
      console.error('Approve request failed', approveError);
      alert(approveError instanceof Error ? approveError.message : 'Approve action failed');
    }
  };

  const confirmReject = async () => {
    if (!selectedRequest || !decisionBy) {
      return;
    }

    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    try {
      await decideProductApproval(selectedRequest.id, {
        action: 'reject',
        decisionBy,
        rejectionReason: rejectReason.trim(),
      });
      await loadApprovals();
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason('');
    } catch (rejectError) {
      console.error('Reject request failed', rejectError);
      alert(rejectError instanceof Error ? rejectError.message : 'Reject action failed');
    }
  };

  const hubStats = {
    total: hubRequests.length,
    pending: hubRequests.filter((request) => request.status === 'pending').length,
    approved: hubRequests.filter((request) => request.status === 'approved').length,
    rejected: hubRequests.filter((request) => request.status === 'rejected').length,
  };

  const storeStats = {
    total: storeRequests.length,
    pending: storeRequests.filter((request) => request.status === 'pending').length,
    approved: storeRequests.filter((request) => request.status === 'approved').length,
    rejected: storeRequests.filter((request) => request.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  Product Approval
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  Review and approve product requests from Hub and Store admins
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    {hubStats.pending + storeStats.pending} Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <Card className="p-4 border-l-4 border-l-red-500">
              <p className="text-sm text-red-700">{error}</p>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-gray-600 font-medium truncate">Hub Requests</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{hubStats.total}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Fish & Seafood Products</p>
                </div>
                <div className="p-3 sm:p-4 bg-blue-100 rounded-lg flex-shrink-0">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-yellow-600">{hubStats.pending}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Pending</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-green-600">{hubStats.approved}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Approved</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-red-600">{hubStats.rejected}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Rejected</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-gray-600 font-medium truncate">Store Requests</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{storeStats.total}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Meat & Poultry Products</p>
                </div>
                <div className="p-3 sm:p-4 bg-green-100 rounded-lg flex-shrink-0">
                  <Store className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-yellow-600">{storeStats.pending}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Pending</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-green-600">{storeStats.approved}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Approved</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-red-600">{storeStats.rejected}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Rejected</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4 sm:p-6">
            <div className="flex gap-1 sm:gap-2 border-b overflow-x-auto pb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'hub' | 'store')}
                  className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 transition-all whitespace-nowrap text-sm min-w-0 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  } rounded-t-lg`}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <tab.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="font-medium truncate">{tab.label}</span>
                    <Badge variant="bg-gray-100 text-gray-600" className="text-xs flex-shrink-0">
                      {tab.count}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <ProductApprovalsList
              requests={getCurrentRequests()}
              onView={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
              onBulkAction={handleBulkAction}
              title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Product Requests`}
            />
          </Card>

          <Modal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            title="Complete Product Details"
            size="xl"
          >
            {selectedRequest && (
              <div className="space-y-6 max-h-[75vh] overflow-y-auto">
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Product Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedRequest.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img}
                          alt={`${selectedRequest.productName} ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg bg-gray-100 border"
                        />
                        {idx === selectedRequest.primaryImageIndex && (
                          <Badge
                            variant="bg-blue-600 text-white"
                            className="absolute top-2 left-2 text-xs"
                          >
                            Primary
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedRequest.productName}</h3>
                      <p className="text-lg text-gray-700 mt-1">{selectedRequest.productNameTa}</p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{selectedRequest.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge
                        variant={
                          selectedRequest.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : selectedRequest.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                        }
                      >
                        {selectedRequest.status.toUpperCase()}
                      </Badge>
                      <Badge
                        variant={
                          selectedRequest.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : selectedRequest.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }
                      >
                        {selectedRequest.priority.toUpperCase()} Priority
                      </Badge>
                      {selectedRequest.isBestSeller && (
                        <Badge variant="bg-orange-100 text-orange-800">Best Seller</Badge>
                      )}
                      {selectedRequest.isRareProduct && (
                        <Badge variant="bg-purple-100 text-purple-800">Rare Product</Badge>
                      )}
                      {selectedRequest.isActive && (
                        <Badge variant="bg-green-100 text-green-800">Active</Badge>
                      )}
                      <Badge
                        variant={
                          selectedRequest.sourceType === 'hub'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-teal-100 text-teal-800'
                        }
                      >
                        {selectedRequest.sourceType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Product Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-semibold">{selectedRequest.category}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">HSN Number:</span>
                        <span className="font-semibold">{selectedRequest.hsnNumber || '-'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Variant:</span>
                        <span className="font-semibold">{selectedRequest.variant || '-'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Product Type:</span>
                        <span className="font-semibold capitalize">{selectedRequest.productType}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Season:</span>
                        <span className="font-semibold">{selectedRequest.season || '-'}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Size & Weight</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Fish Size:</span>
                        <span className="font-semibold">{selectedRequest.fishSize || '-'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Max Size:</span>
                        <span className="font-semibold">{selectedRequest.maxSize || '-'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Fish Count Min:</span>
                        <span className="font-semibold">{selectedRequest.fishCountMin}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Fish Count Max:</span>
                        <span className="font-semibold">{selectedRequest.fishCountMax}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-6 bg-green-50 border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Pricing Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-1">Base Price Min</p>
                      <p className="text-2xl font-bold text-green-600">₹{selectedRequest.basePriceMin}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-1">Base Price Max</p>
                      <p className="text-2xl font-bold text-green-600">₹{selectedRequest.basePriceMax}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-1">Unit</p>
                      <p className="text-xl font-semibold text-gray-900">{selectedRequest.unit}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-purple-50 border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Product Variants ({selectedRequest.variants.length})
                  </h4>
                  <div className="space-y-4">
                    {selectedRequest.variants.map((variant, idx) => (
                      <div key={variant.id} className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-gray-900">
                            Variant {idx + 1}: {variant.type}
                          </h5>
                          <Badge variant="bg-blue-100 text-blue-800">{variant.size}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Gross Weight</p>
                            <p className="font-semibold">{variant.grossWeight}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Net Weight</p>
                            <p className="font-semibold">{variant.netWeight}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Pieces</p>
                            <p className="font-semibold">{variant.pieces}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Serves</p>
                            <p className="font-semibold">{variant.serves}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">SKU Number</p>
                            <p className="font-semibold">{variant.skuNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Actual Price</p>
                            <p className="font-semibold text-green-600">₹{variant.actualPrice}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Sales Price</p>
                            <p className="font-semibold text-blue-600">₹{variant.salesPrice}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Stock</p>
                            <p className="font-semibold">{variant.stock} units</p>
                          </div>
                          {variant.cuttingTypeName && (
                            <div className="col-span-2">
                              <p className="text-gray-600">Cutting Type</p>
                              <p className="font-semibold">{variant.cuttingTypeName}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {selectedRequest.dayBasedPricing.enabled && (
                  <Card className="p-6 bg-orange-50 border-orange-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Day-Based Pricing</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedRequest.dayBasedPricing.dayPrices
                        .filter((entry) => entry.enabled)
                        .map((entry) => (
                          <div key={entry.day} className="bg-white p-3 rounded-lg border text-center">
                            <p className="text-sm text-gray-600 capitalize mb-1">{entry.day}</p>
                            <p className="text-lg font-bold text-orange-600">₹{entry.price}</p>
                          </div>
                        ))}
                    </div>
                  </Card>
                )}

                {selectedRequest.productTags.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Product Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.productTags.map((tag, idx) => (
                        <Badge key={idx} variant="bg-gray-100 text-gray-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {selectedRequest.nutrition && (
                  <Card className="p-6 bg-teal-50 border-teal-200">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Nutrition Information (per {selectedRequest.nutrition.servingBaseQty}
                      {selectedRequest.nutrition.servingBaseUnit})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-sm text-gray-600">Calories</p>
                        <p className="text-lg font-bold">{selectedRequest.nutrition.calories} kcal</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-sm text-gray-600">Protein</p>
                        <p className="text-lg font-bold">{selectedRequest.nutrition.protein}g</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-sm text-gray-600">Carbs</p>
                        <p className="text-lg font-bold">{selectedRequest.nutrition.carbs}g</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-sm text-gray-600">Fat</p>
                        <p className="text-lg font-bold">{selectedRequest.nutrition.fat}g</p>
                      </div>
                    </div>
                  </Card>
                )}

                <Card className="p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-4">Request Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Request ID:</span>
                      <span className="font-semibold text-blue-600">{selectedRequest.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Requested By:</span>
                      <span className="font-semibold">{selectedRequest.requestedBy}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-semibold">{selectedRequest.requestedByRole}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Request Date:</span>
                      <span className="font-semibold">
                        {new Date(selectedRequest.requestDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </Card>

                {selectedRequest.status === 'rejected' && selectedRequest.reason && (
                  <Card className="p-6 bg-red-50 border-red-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-800 mb-2">Rejection Reason</h4>
                        <p className="text-red-700 leading-relaxed">{selectedRequest.reason}</p>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
                  <Button
                    variant="secondary"
                    onClick={() => setShowViewModal(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  {selectedRequest.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => {
                          setShowViewModal(false);
                          handleReject(selectedRequest);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => {
                          setShowViewModal(false);
                          handleApprove(selectedRequest);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </Modal>

          <Modal
            isOpen={showApproveModal}
            onClose={() => setShowApproveModal(false)}
            title="Approve Product Request"
            size="md"
          >
            {selectedRequest && (
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">Are you sure you want to approve this product?</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">{selectedRequest.productName}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.productNameTa}</p>
                    <p className="text-sm text-gray-500">₹{selectedRequest.price} per {selectedRequest.unit}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Notes (Optional)
                  </label>
                  <textarea
                    value={approveNotes}
                    onChange={(event) => setApproveNotes(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Add any notes or conditions for approval..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowApproveModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmApprove}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          <Modal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            title="Reject Product Request"
            size="md"
          >
            {selectedRequest && (
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">Are you sure you want to reject this product?</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">{selectedRequest.productName}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.productNameTa}</p>
                    <p className="text-sm text-gray-500">₹{selectedRequest.price} per {selectedRequest.unit}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(event) => setRejectReason(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={3}
                    placeholder="Please provide a reason for rejection..."
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmReject}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          {isLoading && (
            <Card className="p-4">
              <p className="text-sm text-gray-600">Loading product approval queue...</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
