import { useState } from 'react';
import { Card, Badge, Modal, Button } from '../../components/ui';
import { ProductApprovalsList } from '../../components/features/products';
import { Building2, Store, AlertCircle } from 'lucide-react';

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

const mockRequests: ProductRequest[] = [
  // Hub Requests
  {
    id: 'HR001',
    productName: 'Premium Tuna',
    productNameTa: 'பிரீமியம் சூரை',
    category: '1',
    hsnNumber: '0302',
    variant: 'Large',
    fishSize: '2-5 kg',
    maxSize: '5 kg',
    basePriceMin: 800,
    basePriceMax: 900,
    fishCountMin: 1,
    fishCountMax: 2,
    description: 'Fresh premium tuna fish, ideal for sashimi and grilling. Caught daily from deep sea waters.',
    price: 850,
    unit: 'kg',
    images: ['/api/placeholder/300/200', '/api/placeholder/300/200', '/api/placeholder/300/200'],
    primaryImageIndex: 0,
    requestedBy: 'Ravi Kumar',
    requestedByRole: 'Hub Manager',
    requestDate: '2024-01-08',
    sourceType: 'hub',
    status: 'pending',
    priority: 'high',
    isBestSeller: true,
    isRareProduct: false,
    isActive: true,
    productType: 'fresh',
    season: 'Year-round',
    metaTitle: 'Premium Tuna - Fresh Seafood | BayHawk',
    metaDescription: 'Buy fresh premium tuna online. Perfect for sashimi and grilling. Caught daily, delivered fresh.',
    variants: [
      {
        id: 'v1',
        type: 'Whole Fish',
        size: 'Large',
        grossWeight: '3-5 kg',
        netWeight: '2.5-4.5 kg',
        pieces: '1 piece',
        serves: '6-8',
        skuNumber: 'TUNA-L-001',
        actualPrice: 900,
        salesPrice: 850,
        stock: 25,
        igst: 0,
        cgst: 0,
        sgst: 0,
        cuttingTypeId: '1',
        cuttingTypeName: 'Whole Fish'
      },
      {
        id: 'v2',
        type: 'Steaks',
        size: 'Medium',
        grossWeight: '500g',
        netWeight: '450g',
        pieces: '4-5 pieces',
        serves: '2-3',
        skuNumber: 'TUNA-S-001',
        actualPrice: 950,
        salesPrice: 900,
        stock: 40,
        igst: 0,
        cgst: 0,
        sgst: 0,
        cuttingTypeId: '3',
        cuttingTypeName: 'Fish Steaks'
      }
    ],
    dayBasedPricing: {
      enabled: true,
      dayPrices: [
        { day: 'monday', price: 850, enabled: true },
        { day: 'tuesday', price: 850, enabled: true },
        { day: 'wednesday', price: 820, enabled: true },
        { day: 'thursday', price: 850, enabled: true },
        { day: 'friday', price: 900, enabled: true },
        { day: 'saturday', price: 900, enabled: true },
        { day: 'sunday', price: 880, enabled: true }
      ]
    },
    productTags: ['Fresh', 'Premium', 'Sashimi Grade', 'High Protein'],
    nutrition: {
      calories: 144,
      protein: 23,
      carbs: 0,
      fat: 5,
      fiber: 0,
      sugar: 0,
      sodium: 39,
      cholesterol: 38,
      vitamins: {
        vitaminA: 16,
        vitaminC: 0,
        vitaminD: 5,
        vitaminB12: 9
      },
      minerals: {
        calcium: 8,
        iron: 1,
        potassium: 252,
        magnesium: 50
      }
    }
  },
  {
    id: 'SR001',
    productName: 'Organic Chicken',
    productNameTa: 'இயற்கை கோழி',
    category: '5',
    hsnNumber: '0207',
    variant: 'Whole Bird',
    fishSize: '1-1.5 kg',
    maxSize: '1.5 kg',
    basePriceMin: 300,
    basePriceMax: 350,
    fishCountMin: 0,
    fishCountMax: 0,
    description: 'Free-range organic chicken, antibiotic-free. Raised naturally on organic farms.',
    price: 320,
    unit: 'kg',
    images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
    primaryImageIndex: 0,
    requestedBy: 'Priya Sharma',
    requestedByRole: 'Store Manager',
    requestDate: '2024-01-08',
    sourceType: 'store',
    status: 'pending',
    priority: 'high',
    isBestSeller: false,
    isRareProduct: false,
    isActive: true,
    productType: 'fresh',
    season: 'Year-round',
    metaTitle: 'Organic Chicken - Antibiotic Free | BayHawk',
    metaDescription: 'Buy organic free-range chicken online. Antibiotic-free, naturally raised. Fresh delivery.',
    variants: [
      {
        id: 'v1',
        type: 'Whole Bird',
        size: 'Medium',
        grossWeight: '1.2 kg',
        netWeight: '1 kg',
        pieces: '1 bird',
        serves: '4-5',
        skuNumber: 'CHKN-W-001',
        actualPrice: 350,
        salesPrice: 320,
        stock: 50,
        igst: 0,
        cgst: 0,
        sgst: 0
      },
      {
        id: 'v2',
        type: 'Curry Cut',
        size: 'Medium',
        grossWeight: '500g',
        netWeight: '480g',
        pieces: '8-10 pieces',
        serves: '2-3',
        skuNumber: 'CHKN-C-001',
        actualPrice: 340,
        salesPrice: 320,
        stock: 60,
        igst: 0,
        cgst: 0,
        sgst: 0
      }
    ],
    productTags: ['Organic', 'Antibiotic Free', 'Free Range'],
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 82,
      cholesterol: 85,
      vitamins: {
        vitaminA: 0,
        vitaminC: 0,
        vitaminD: 0,
        vitaminB12: 0.3
      },
      minerals: {
        calcium: 11,
        iron: 0.9,
        potassium: 220,
        magnesium: 25
      }
    }
  }
];

export function ProductApprovalPage() {
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>('hub');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approveNotes, setApproveNotes] = useState('');

  // Separate requests by source
  const hubRequests = mockRequests.filter(req => req.sourceType === 'hub');
  const storeRequests = mockRequests.filter(req => req.sourceType === 'store');

  const tabs = [
    { id: 'hub', label: 'Hub Requests', icon: Building2, count: hubRequests.length },
    { id: 'store', label: 'Store Requests', icon: Store, count: storeRequests.length },
  ];

  const getCurrentRequests = () => {
    return activeTab === 'hub' ? hubRequests : storeRequests;
  };

  // Bulk actions handler for product requests
  const handleBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      switch (actionId) {
        case 'approve_selected':
          console.log(`Approving ${selectedIds.length} requests:`, selectedIds);
          // Update selected requests to approved status
          alert(`${selectedIds.length} product requests have been approved successfully!`);
          break;
        case 'reject_selected':
          const reason = prompt('Please provide a reason for bulk rejection:');
          if (reason) {
            console.log(`Rejecting ${selectedIds.length} requests:`, selectedIds, 'Reason:', reason);
            // Update selected requests to rejected status with reason
            alert(`${selectedIds.length} product requests have been rejected. Reason: ${reason}`);
          }
          break;
        default:
          console.log(`Bulk action ${actionId} performed on ${selectedIds.length} requests`, data);
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    }
  };

  const handleViewDetails = (request: ProductRequest) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleApprove = (request: ProductRequest) => {
    setSelectedRequest(request);
    setApproveNotes('');
    setShowApproveModal(true);
  };

  const handleReject = (request: ProductRequest) => {
    setSelectedRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    if (selectedRequest) {
      console.log('Approving request:', selectedRequest.id, 'Notes:', approveNotes);
      // Update the request status to approved
      setShowApproveModal(false);
      setSelectedRequest(null);
      setApproveNotes('');
      alert(`Product "${selectedRequest.productName}" has been approved successfully!`);
    }
  };

  const confirmReject = () => {
    if (selectedRequest && rejectReason.trim()) {
      console.log('Rejecting request:', selectedRequest.id, 'Reason:', rejectReason);
      // Update the request status to rejected with reason
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason('');
      alert(`Product "${selectedRequest.productName}" has been rejected. Reason: ${rejectReason}`);
    } else {
      alert('Please provide a reason for rejection.');
    }
  };

  // Stats calculation
  const hubStats = {
    total: hubRequests.length,
    pending: hubRequests.filter(req => req.status === 'pending').length,
    approved: hubRequests.filter(req => req.status === 'approved').length,
    rejected: hubRequests.filter(req => req.status === 'rejected').length
  };

  const storeStats = {
    total: storeRequests.length,
    pending: storeRequests.filter(req => req.status === 'pending').length,
    approved: storeRequests.filter(req => req.status === 'approved').length,
    rejected: storeRequests.filter(req => req.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
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

          {/* Stats Cards */}
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

          {/* Tabs */}
          <Card className="p-4 sm:p-6">
            <div className="flex gap-1 sm:gap-2 border-b overflow-x-auto pb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

          {/* Product Approvals List with Bulk Actions */}
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

          {/* View Details Modal */}
          <Modal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            title="Complete Product Details"
            size="xl"
          >
            {selectedRequest && (
              <div className="space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Product Images */}
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
                          <Badge variant="bg-blue-600 text-white" className="absolute top-2 left-2 text-xs">Primary</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
                
                {/* Basic Product Information */}
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedRequest.productName}</h3>
                      <p className="text-lg text-gray-700 mt-1">{selectedRequest.productNameTa}</p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{selectedRequest.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant={selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        selectedRequest.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {selectedRequest.status.toUpperCase()}
                      </Badge>
                      <Badge variant={selectedRequest.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        selectedRequest.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {selectedRequest.priority.toUpperCase()} Priority
                      </Badge>
                      {selectedRequest.isBestSeller && <Badge variant="bg-orange-100 text-orange-800">Best Seller</Badge>}
                      {selectedRequest.isRareProduct && <Badge variant="bg-purple-100 text-purple-800">Rare Product</Badge>}
                      {selectedRequest.isActive && <Badge variant="bg-green-100 text-green-800">Active</Badge>}
                      <Badge variant={selectedRequest.sourceType === 'hub' ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'}>
                        {selectedRequest.sourceType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Product Details Grid */}
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
                        <span className="font-semibold">{selectedRequest.hsnNumber}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Variant:</span>
                        <span className="font-semibold">{selectedRequest.variant}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Product Type:</span>
                        <span className="font-semibold capitalize">{selectedRequest.productType}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Season:</span>
                        <span className="font-semibold">{selectedRequest.season}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Size & Weight</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Fish Size:</span>
                        <span className="font-semibold">{selectedRequest.fishSize}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Max Size:</span>
                        <span className="font-semibold">{selectedRequest.maxSize}</span>
                      </div>
                      {selectedRequest.fishCountMin > 0 && (
                        <>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Fish Count Min:</span>
                            <span className="font-semibold">{selectedRequest.fishCountMin}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Fish Count Max:</span>
                            <span className="font-semibold">{selectedRequest.fishCountMax}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Pricing Information */}
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

                {/* Product Variants */}
                <Card className="p-6 bg-purple-50 border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Product Variants ({selectedRequest.variants.length})</h4>
                  <div className="space-y-4">
                    {selectedRequest.variants.map((variant, idx) => (
                      <div key={variant.id} className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-gray-900">Variant {idx + 1}: {variant.type}</h5>
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
                          <div>
                            <p className="text-gray-600">IGST</p>
                            <p className="font-semibold">{variant.igst}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">CGST</p>
                            <p className="font-semibold">{variant.cgst}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">SGST</p>
                            <p className="font-semibold">{variant.sgst}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Day-Based Pricing */}
                {selectedRequest.dayBasedPricing?.enabled && (
                  <Card className="p-6 bg-orange-50 border-orange-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Day-Based Pricing</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedRequest.dayBasedPricing.dayPrices.filter(d => d.enabled).map(day => (
                        <div key={day.day} className="bg-white p-3 rounded-lg border text-center">
                          <p className="text-sm text-gray-600 capitalize mb-1">{day.day}</p>
                          <p className="text-lg font-bold text-orange-600">₹{day.price}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Product Tags */}
                {selectedRequest.productTags && selectedRequest.productTags.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Product Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.productTags.map((tag, idx) => (
                        <Badge key={idx} variant="bg-gray-100 text-gray-800">{tag}</Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Nutrition Information */}
                {selectedRequest.nutrition && (
                  <Card className="p-6 bg-teal-50 border-teal-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Nutrition Information (per 100g)</h4>
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Vitamins</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span>Vitamin A:</span><span>{selectedRequest.nutrition.vitamins.vitaminA}%</span></div>
                          <div className="flex justify-between"><span>Vitamin C:</span><span>{selectedRequest.nutrition.vitamins.vitaminC}%</span></div>
                          <div className="flex justify-between"><span>Vitamin D:</span><span>{selectedRequest.nutrition.vitamins.vitaminD}%</span></div>
                          <div className="flex justify-between"><span>Vitamin B12:</span><span>{selectedRequest.nutrition.vitamins.vitaminB12}%</span></div>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Minerals</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span>Calcium:</span><span>{selectedRequest.nutrition.minerals.calcium}%</span></div>
                          <div className="flex justify-between"><span>Iron:</span><span>{selectedRequest.nutrition.minerals.iron}%</span></div>
                          <div className="flex justify-between"><span>Potassium:</span><span>{selectedRequest.nutrition.minerals.potassium}mg</span></div>
                          <div className="flex justify-between"><span>Magnesium:</span><span>{selectedRequest.nutrition.minerals.magnesium}mg</span></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* SEO Information */}
                <Card className="p-6 bg-indigo-50 border-indigo-200">
                  <h4 className="font-semibold text-gray-900 mb-4">SEO Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Meta Title</p>
                      <p className="font-semibold text-gray-900">{selectedRequest.metaTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Meta Description</p>
                      <p className="text-gray-700">{selectedRequest.metaDescription}</p>
                    </div>
                  </div>
                </Card>

                {/* Request Information */}
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
                      <span className="font-semibold">{new Date(selectedRequest.requestDate).toLocaleDateString('en-IN', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </Card>
                
                {/* Rejection Reason */}
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
                
                {/* Action Buttons */}
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

      {/* Approve Modal */}
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
                onChange={(e) => setApproveNotes(e.target.value)}
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

      {/* Reject Modal */}
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
                onChange={(e) => setRejectReason(e.target.value)}
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
        </div>
      </div>
    </div>
  );
}
