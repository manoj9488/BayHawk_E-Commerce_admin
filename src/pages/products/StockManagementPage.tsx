import { useState } from 'react';
import { Card, Button, Badge, Modal } from '../../components/ui';
import { StockBatchForm, type StockBatchData } from '../../components/stock/StockBatchForm';
import { StockBatchList, type StockBatch } from '../../components/stock/StockBatchList';
import { BulkUploadModal } from '../../components/stock/BulkUploadModal';
import { Plus, Package, Building2, Store, Clock, AlertTriangle, CheckCircle, History, FileText, MapPin, Award, Thermometer, Upload } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

// Mock stock batch data with comprehensive information
const mockStockBatches: StockBatch[] = [
  {
    id: '1',
    batchNumber: 'BATCH-001',
    traceabilityCode: 'LOT-20260115-CH001',
    productName: 'Tuna',
    category: 'sea-fish',
    individualWeight: 5,
    quantity: 20,
    quantityUnit: 'kg',
    catchSlaughterDate: '2026-01-16',
    receivedDate: '2026-01-17',
    expiryDate: '2026-01-20',
    certifications: ['Halal', 'MSC Certified'],
    catchType: 'wild',
    chemicalFree: 'yes',
    qualityGrade: 'grade-a',
    harvestOrigin: 'Bay of Bengal',
    countryOfOrigin: 'India',
    packagingType: 'Ice Packed',
    storageTemperature: '0-4°C (Fresh)',
    createdBy: 'Rajesh Kumar',
    createdByRole: 'Procurement Manager',
    status: 'approved',
    totalValue: 25000,
    daysUntilExpiry: 3,
    approvedBy: 'Suresh Admin',
    approvedDate: '2026-01-17'
  },
  {
    id: '2',
    batchNumber: 'BATCH-002',
    traceabilityCode: 'LOT-20260115-CH002',
    productName: 'Seer Fish',
    category: 'sea-fish',
    individualWeight: 2,
    quantity: 15,
    quantityUnit: 'kg',
    catchSlaughterDate: '2026-01-15',
    receivedDate: '2026-01-17',
    expiryDate: '2026-01-19',
    certifications: ['Halal'],
    catchType: 'wild',
    chemicalFree: 'no',
    qualityGrade: 'grade-b',
    harvestOrigin: 'Chilka Lake',
    countryOfOrigin: 'India',
    packagingType: 'Vacuum Packed',
    storageTemperature: '0-4°C (Fresh)',
    createdBy: 'Priya Sharma',
    createdByRole: 'Hub Manager',
    status: 'pending',
    totalValue: 18000,
    daysUntilExpiry: 1
  },
  {
    id: '3',
    batchNumber: 'BATCH-003',
    traceabilityCode: 'LOT-20260115-ST001',
    productName: 'Chicken Breast',
    category: 'chicken',
    individualWeight: 0.5,
    quantity: 50,
    quantityUnit: 'kg',
    catchSlaughterDate: '2026-01-16',
    receivedDate: '2026-01-17',
    expiryDate: '2026-01-22',
    certifications: ['Halal', 'HACCP'],
    catchType: 'farmed',
    chemicalFree: 'organic',
    qualityGrade: 'grade-a',
    harvestOrigin: 'Local Farm',
    countryOfOrigin: 'India',
    packagingType: 'Fresh Box',
    storageTemperature: '0-4°C (Fresh)',
    createdBy: 'Arun Patel',
    createdByRole: 'Store Manager',
    status: 'approved',
    totalValue: 14000,
    daysUntilExpiry: 5,
    approvedBy: 'Suresh Admin',
    approvedDate: '2026-01-17'
  },
  {
    id: '4',
    batchNumber: 'BATCH-004',
    traceabilityCode: 'LOT-20260114-CH003',
    productName: 'Tiger Prawns',
    category: 'shell-fish',
    individualWeight: 1,
    quantity: 10,
    quantityUnit: 'kg',
    catchSlaughterDate: '2026-01-14',
    receivedDate: '2026-01-16',
    expiryDate: '2026-01-18',
    certifications: ['MSC Certified'],
    catchType: 'wild',
    chemicalFree: 'yes',
    qualityGrade: 'grade-a',
    harvestOrigin: 'Sundarban Delta',
    countryOfOrigin: 'India',
    packagingType: 'Ice Packed',
    storageTemperature: '0-4°C (Fresh)',
    createdBy: 'Meera Nair',
    createdByRole: 'Procurement Officer',
    status: 'rejected',
    totalValue: 8500,
    daysUntilExpiry: -1,
    rejectionReason: 'Quality issues detected during inspection'
  }
];

export function StockManagementPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>('hub');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<StockBatch | null>(null);

  // Filter stock data based on user's module access - simplified for StockBatch
  const getFilteredStockData = () => {
    if (user?.loginType === 'super_admin') {
      return mockStockBatches;
    } else if (user?.loginType === 'hub') {
      return mockStockBatches.filter(batch => 
        ['sea-fish', 'freshwater-fish', 'shell-fish', 'dry-fish'].includes(batch.category)
      );
    } else if (user?.loginType === 'store') {
      return mockStockBatches.filter(batch => 
        ['chicken', 'mutton', 'egg'].includes(batch.category)
      );
    }
    return mockStockBatches;
  };

  const filteredStockData = getFilteredStockData();

  // Separate stock by source type
  const hubBatches = filteredStockData.filter(batch => 
    ['sea-fish', 'freshwater-fish', 'shell-fish', 'dry-fish'].includes(batch.category)
  );
  const storeBatches = filteredStockData.filter(batch => 
    ['chicken', 'mutton', 'egg'].includes(batch.category)
  );

  // Determine which tabs to show based on user type
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'hub', label: 'Hub Stock', icon: Building2, count: hubBatches.length },
      { id: 'store', label: 'Store Stock', icon: Store, count: storeBatches.length },
    ];

    if (user?.loginType === 'hub') {
      return allTabs.filter(tab => tab.id === 'hub');
    } else if (user?.loginType === 'store') {
      return allTabs.filter(tab => tab.id === 'store');
    } else {
      // Super admin sees all tabs
      return allTabs;
    }
  };

  const tabs = getAvailableTabs();

  // Set default active tab based on user type
  useState(() => {
    const defaultTab = user?.loginType === 'hub' ? 'hub' : user?.loginType === 'store' ? 'store' : 'hub';
    setActiveTab(defaultTab as 'hub' | 'store');
  });

  const getCurrentBatches = () => {
    return activeTab === 'hub' ? hubBatches : storeBatches;
  };

  // Handlers for stock batch actions
  const handleViewBatch = (batch: StockBatch) => {
    setSelectedBatch(batch);
    setShowViewModal(true);
  };

  const handleEditBatch = (batch: StockBatch) => {
    setSelectedBatch(batch);
    setShowEditModal(true);
  };

  const handleDeleteBatch = (batch: StockBatch) => {
    if (confirm('Are you sure you want to delete this stock batch?')) {
      console.log('Delete batch:', batch.id);
    }
  };

  const handleApproveBatch = (batch: StockBatch) => {
    if (confirm('Are you sure you want to approve this stock batch?')) {
      console.log('Approve batch:', batch.id);
      // Update batch status to approved
    }
  };

  const handleRejectBatch = (batch: StockBatch) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      console.log('Reject batch:', batch.id, 'Reason:', reason);
      // Update batch status to rejected with reason
    }
  };

  const handleAddNewBatch = () => {
    setSelectedBatch(null);
    setShowAddModal(true);
  };

  const handleSaveBatch = (batchData: StockBatchData) => {
    console.log('Save batch:', batchData);
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedBatch(null);
    // In real app, this would send approval request
    alert('Stock batch submitted for approval successfully!');
  };

  const handleBulkUpload = (data: StockBatchData[]) => {
    console.log('Bulk upload data:', data);
    // In a real app, this would make an API call to save all batches
    alert(`Successfully uploaded ${data.length} batches!`);
    setShowBulkUploadModal(false);
  };

  const handleViewHistory = (batch: StockBatch) => {
    setSelectedBatch(batch);
    setShowHistoryModal(true);
  };

  // Bulk actions handler for stock batches
  const handleBatchBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      switch (actionId) {
        case 'approve':
          console.log(`Approving ${selectedIds.length} batches:`, selectedIds);
          break;
        case 'reject':
          console.log(`Rejecting ${selectedIds.length} batches:`, selectedIds);
          break;
        case 'update_expiry':
          console.log(`Updating expiry for ${selectedIds.length} batches:`, selectedIds);
          break;
        case 'delete':
          console.log(`Deleting ${selectedIds.length} batches:`, selectedIds);
          break;
        default:
          console.log(`Bulk action ${actionId} performed on ${selectedIds.length} batches`, data);
      }
    } catch (error) {
      console.error('Batch bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    }
  };

  const getBatchStats = (batchList: StockBatch[]) => {
    return {
      total: batchList.length,
      approved: batchList.filter(batch => batch.status === 'approved').length,
      pending: batchList.filter(batch => batch.status === 'pending').length,
      rejected: batchList.filter(batch => batch.status === 'rejected').length,
      expiringSoon: batchList.filter(batch => batch.daysUntilExpiry >= 0 && batch.daysUntilExpiry <= 3).length,
      expired: batchList.filter(batch => batch.daysUntilExpiry < 0).length,
      totalValue: batchList.reduce((sum, batch) => sum + batch.totalValue, 0)
    };
  };

  const hubStats = getBatchStats(hubBatches);
  const storeStats = getBatchStats(storeBatches);
  const currentStats = activeTab === 'hub' ? hubStats : storeStats;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  {user?.loginType === 'hub' ? 'Hub Stock Management' : 
                   user?.loginType === 'store' ? 'Store Stock Management' : 
                   'Stock Management'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  Comprehensive batch tracking with traceability, certifications, and approval workflow
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowHistoryModal(true)}
                  className="w-full sm:w-auto flex-shrink-0 px-4 py-2"
                >
                  <History className="mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">History</span>
                  <span className="sm:hidden">History</span>
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowBulkUploadModal(true)} 
                  className="w-full sm:w-auto flex-shrink-0 px-4 py-2"
                >
                  <Upload className="mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">Bulk Upload</span>
                  <span className="sm:hidden">Upload</span>
                </Button>
                <Button 
                  onClick={handleAddNewBatch} 
                  className="w-full sm:w-auto flex-shrink-0 px-4 py-2 sm:px-6 sm:py-3"
                >
                  <Plus className="mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">Add New Stock</span>
                  <span className="sm:hidden">Add Stock</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Total Batches</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                    {currentStats.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {formatCurrency(currentStats.totalValue)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Approved</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mt-1">
                    {currentStats.approved}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Ready for sale</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Pending</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600 mt-1">
                    {currentStats.pending}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
                </div>
                <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Expiring Soon</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 mt-1">
                    {currentStats.expiringSoon}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">≤3 days left</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-100 rounded-lg flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs - Only show if there are multiple tabs */}
          {tabs.length > 1 && (
            <Card className="p-4 sm:p-6">
              <div className="flex gap-1 sm:gap-2 border-b overflow-x-auto pb-4">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 transition-all whitespace-nowrap text-xs sm:text-sm min-w-0 ${
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
          )}

          {/* Stock Batch List */}
          <Card className="overflow-hidden">
            <StockBatchList
              batches={getCurrentBatches()}
              onView={handleViewBatch}
              onEdit={handleEditBatch}
              onDelete={handleDeleteBatch}
              onApprove={handleApproveBatch}
              onReject={handleRejectBatch}
              onBulkAction={handleBatchBulkAction}
              title={activeTab === 'hub' ? 'Hub Stock Batches' : 'Store Stock Batches'}
              showApprovalActions={user?.loginType === 'super_admin'}
            />
          </Card>

      {/* Add New Stock Batch Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedBatch(null);
        }}
        title="Add New Stock Batch"
        size="xl"
      >
        <StockBatchForm
          onSave={handleSaveBatch}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedBatch(null);
          }}
        />
      </Modal>

      {/* Edit Stock Batch Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBatch(null);
        }}
        title="Edit Stock Batch"
        size="xl"
      >
        {selectedBatch && (
          <StockBatchForm
            initialData={selectedBatch}
            onSave={handleSaveBatch}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedBatch(null);
            }}
            isEdit={true}
          />
        )}
      </Modal>

      {/* View Stock Batch Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedBatch(null);
        }}
        title="Stock Batch Details"
        size="xl"
      >
        {selectedBatch && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Header with Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-xl font-semibold">{selectedBatch.productName}</h3>
                <p className="text-gray-600">Batch: {selectedBatch.batchNumber}</p>
                <p className="text-sm text-gray-500 font-mono">{selectedBatch.traceabilityCode}</p>
              </div>
              <div className="text-right">
                <Badge 
                  variant={selectedBatch.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          selectedBatch.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'} 
                  className="text-sm mb-2"
                >
                  {selectedBatch.status.charAt(0).toUpperCase() + selectedBatch.status.slice(1)}
                </Badge>
                <p className="text-lg font-bold">{formatCurrency(selectedBatch.totalValue)}</p>
              </div>
            </div>

            {/* Detailed Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Information */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Product Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="capitalize">{selectedBatch.category.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Individual Weight:</span>
                    <span>{selectedBatch.individualWeight} {selectedBatch.quantityUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span>{selectedBatch.quantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality Grade:</span>
                    <span className="capitalize">{selectedBatch.qualityGrade.replace('-', ' ')}</span>
                  </div>
                </div>
              </Card>

              {/* Dates */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Important Dates
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Catch/Slaughter:</span>
                    <span>{new Date(selectedBatch.catchSlaughterDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Received:</span>
                    <span>{new Date(selectedBatch.receivedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiry:</span>
                    <span className={selectedBatch.daysUntilExpiry < 0 ? 'text-red-600 font-medium' : 
                                   selectedBatch.daysUntilExpiry <= 3 ? 'text-yellow-600 font-medium' : 
                                   'text-green-600'}>
                      {new Date(selectedBatch.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Until Expiry:</span>
                    <span className={selectedBatch.daysUntilExpiry < 0 ? 'text-red-600 font-bold' : 
                                   selectedBatch.daysUntilExpiry <= 3 ? 'text-yellow-600 font-bold' : 
                                   'text-green-600 font-bold'}>
                      {selectedBatch.daysUntilExpiry < 0 ? 'Expired' : `${selectedBatch.daysUntilExpiry} days`}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Origin & Source */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Origin & Source
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harvest Origin:</span>
                    <span>{selectedBatch.harvestOrigin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span>{selectedBatch.countryOfOrigin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Catch Type:</span>
                    <span className="capitalize">{selectedBatch.catchType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chemical Free:</span>
                    <span className="capitalize">{selectedBatch.chemicalFree}</span>
                  </div>
                </div>
              </Card>

              {/* Storage & Packaging */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  Storage & Packaging
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Packaging:</span>
                    <span>{selectedBatch.packagingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage Temp:</span>
                    <span>{selectedBatch.storageTemperature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created By:</span>
                    <span>{selectedBatch.createdBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span>{selectedBatch.createdByRole}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Certifications */}
            {selectedBatch.certifications.length > 0 && (
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBatch.certifications.map(cert => (
                    <Badge key={cert} variant="bg-blue-100 text-blue-800" className="text-sm">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Approval Information */}
            {selectedBatch.status === 'approved' && selectedBatch.approvedBy && (
              <Card className="p-4 bg-green-50 border-green-200">
                <h4 className="font-semibold mb-2 text-green-800">Approval Information</h4>
                <p className="text-sm text-green-700">
                  Approved by <strong>{selectedBatch.approvedBy}</strong> on{' '}
                  {selectedBatch.approvedDate && new Date(selectedBatch.approvedDate).toLocaleDateString()}
                </p>
              </Card>
            )}

            {/* Rejection Information */}
            {selectedBatch.status === 'rejected' && selectedBatch.rejectionReason && (
              <Card className="p-4 bg-red-50 border-red-200">
                <h4 className="font-semibold mb-2 text-red-800">Rejection Information</h4>
                <p className="text-sm text-red-700">
                  <strong>Reason:</strong> {selectedBatch.rejectionReason}
                </p>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedBatch(null);
                }}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
                className="flex-1"
              >
                Edit Batch
              </Button>
              <Button 
                variant="secondary"
                onClick={() => handleViewHistory(selectedBatch)}
                className="flex-1"
              >
                <History className="mr-2 h-4 w-4" />
                View History
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedBatch(null);
        }}
        title="Batch Edit History"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900">Edit History</h4>
              <p className="text-sm text-blue-700">
                Track all changes made to this batch over time
              </p>
            </div>
          </div>
          
          {/* Mock history data */}
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Batch Approved</p>
                  <p className="text-sm text-gray-600">Status changed from Pending to Approved</p>
                  <p className="text-xs text-gray-500">by Suresh Admin</p>
                </div>
                <span className="text-xs text-gray-500">2026-01-17 10:30 AM</span>
              </div>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Batch Created</p>
                  <p className="text-sm text-gray-600">Initial batch entry with all details</p>
                  <p className="text-xs text-gray-500">by {selectedBatch?.createdBy}</p>
                </div>
                <span className="text-xs text-gray-500">2026-01-17 09:15 AM</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button 
              variant="secondary"
              onClick={() => {
                setShowHistoryModal(false);
                setSelectedBatch(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
        onUpload={handleBulkUpload}
      />
        </div>
      </div>
    </div>
  );
}
