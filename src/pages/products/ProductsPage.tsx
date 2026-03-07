import { useState } from "react";
import { Modal, Badge, Button, Card } from "../../components/ui";
import { CompleteProductForm } from "../../components/products/CompleteProductForm";
import { ProductsList } from "../../components/features/products";
import { useAuth } from "../../context/AuthContext";
import { filterDataByModule } from "../../utils/rbac";
import { Package, Plus, Calendar, Filter, RefreshCw } from "lucide-react";
import type { Product } from "../../types";

const mockProducts: Product[] = [
  // Hub Products (Fish Only)
  {
    id: "1",
    nameEn: "Seer Fish (Vanjaram)",
    nameTa: "வஞ்சிரம்",
    sku: "FISH-001",
    category: "fish",
    description: "Premium quality seer fish",
    images: [],
    variants: [
      {
        id: "v1",
        type: "Whole Cleaned",
        size: "Medium",
        grossWeight: "1000-1250g",
        netWeight: "800-1000g",
        pieces: "1 piece",
        serves: "3-4",
        price: 1200,
        stock: 25,
        discount: 10,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    moduleType: "hub",
    hubId: "hub_1",
    approvalStatus: "approved",
  },
  {
    id: "2",
    nameEn: "Tiger Prawns",
    nameTa: "இறால்",
    sku: "PRWN-001",
    category: "prawns",
    description: "Fresh tiger prawns",
    images: [],
    variants: [
      {
        id: "v2",
        type: "Cleaned",
        size: "Large",
        grossWeight: "500g",
        netWeight: "400g",
        pieces: "15-20 pieces",
        serves: "2-3",
        price: 650,
        stock: 15,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    moduleType: "hub",
    hubId: "hub_2",
    approvalStatus: "approved",
  },
  // Store Products (Meat + Fish)
  {
    id: "3",
    nameEn: "Chicken Breast",
    nameTa: "சிக்கன் மார்பு",
    sku: "CHKN-001",
    category: "chicken",
    description: "Fresh chicken breast",
    images: [],
    variants: [
      {
        id: "v3",
        type: "Boneless",
        size: "Medium",
        grossWeight: "500g",
        netWeight: "450g",
        pieces: "2-3 pieces",
        serves: "2-3",
        price: 280,
        stock: 50,
      },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: "same_day",
    sourceType: "store",
    moduleType: "store",
    storeId: "store_1",
    approvalStatus: "approved",
  },
  {
    id: "4",
    nameEn: "Mutton Curry Cut",
    nameTa: "ஆட்டு இறைச்சி",
    sku: "MUTTON-001",
    category: "mutton",
    description: "Fresh mutton curry cut",
    images: [],
    variants: [
      {
        id: "v4",
        type: "Curry Cut",
        size: "Medium",
        grossWeight: "500g",
        netWeight: "450g",
        pieces: "8-10 pieces",
        serves: "2-3",
        price: 650,
        stock: 20,
      },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: "same_day",
    sourceType: "store",
    moduleType: "store",
    storeId: "store_2",
    approvalStatus: "approved",
  },
];

// Mock hubs and stores data
const mockHubs = [
  { id: "hub_1", name: "Chennai Hub", location: "Chennai" },
  { id: "hub_2", name: "Coimbatore Hub", location: "Coimbatore" },
  { id: "hub_3", name: "Madurai Hub", location: "Madurai" },
];

const mockStores = [
  { id: "store_1", name: "T.Nagar Store", location: "T.Nagar, Chennai" },
  { id: "store_2", name: "Anna Nagar Store", location: "Anna Nagar, Chennai" },
  { id: "store_3", name: "Velachery Store", location: "Velachery, Chennai" },
];

export function ProductsPage() {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>('hub');
  const [selectedHubId, setSelectedHubId] = useState<string>('all');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');
  
  // Date Filter States
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Date filter options
  const dateFilterOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' },
  ];

  // Helper function to get date range based on filter
  const getDateRange = (filter: string) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    switch (filter) {
      case 'today':
        return { start: startOfDay, end: endOfDay };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { 
          start: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          end: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59)
        };
      case 'last7days':
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        return { start: last7Days, end: endOfDay };
      case 'last30days':
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return { start: last30Days, end: endOfDay };
      case 'thisMonth':
        return { 
          start: new Date(today.getFullYear(), today.getMonth(), 1),
          end: endOfDay
        };
      case 'lastMonth':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
        return { start: lastMonth, end: lastMonthEnd };
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(customEndDate + 'T23:59:59')
          };
        }
        return null;
      default:
        return null;
    }
  };

  // Filter products by date
  const filterProductsByDate = (products: Product[]) => {
    if (dateFilter === 'all') return products;
    
    const dateRange = getDateRange(dateFilter);
    if (!dateRange) return products;

    // For demo purposes, we'll simulate date filtering by returning different subsets
    // In a real application, you would filter based on actual product dates
    return products.filter((_, index) => {
      // Simulate different products being created on different dates
      const simulatedDates = [
        new Date('2024-01-15'), // Product 1
        new Date('2024-01-10'), // Product 2  
        new Date('2024-01-05'), // Product 3
        new Date('2024-01-08'), // Product 4
      ];
      
      const productDate = simulatedDates[index] || new Date('2024-01-01');
      return productDate >= dateRange.start && productDate <= dateRange.end;
    });
  };

  // Filter products based on user's module access
  const filteredProducts = filterDataByModule(mockProducts, user);

  // Further filter by selected hub/store for SuperAdmin and date
  const getDisplayProducts = () => {
    let products = user?.loginType === 'super_admin' 
      ? filteredProducts.filter(p => p.sourceType === activeTab)
      : filteredProducts;

    if (user?.loginType === 'super_admin') {
      if (activeTab === 'hub' && selectedHubId !== 'all') {
        products = products.filter(p => p.hubId === selectedHubId);
      } else if (activeTab === 'store' && selectedStoreId !== 'all') {
        products = products.filter(p => p.storeId === selectedStoreId);
      }
    }

    // Apply date filter
    products = filterProductsByDate(products);

    return products;
  };

  const displayProducts = getDisplayProducts();

  // Reset date filter
  const resetDateFilter = () => {
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowAddModal(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowAddModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log("Delete product:", product.id);
    }
  };

  // Bulk actions handler for products
  const handleProductBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      switch (actionId) {
        case 'activate':
          console.log(`Activating ${selectedIds.length} products:`, selectedIds);
          break;
        case 'deactivate':
          console.log(`Deactivating ${selectedIds.length} products:`, selectedIds);
          break;
        case 'archive':
          console.log(`Archiving ${selectedIds.length} products:`, selectedIds);
          break;
        case 'delete':
          console.log(`Deleting ${selectedIds.length} products:`, selectedIds);
          break;
        default:
          console.log(`Bulk action ${actionId} performed on ${selectedIds.length} products`, data);
      }
    } catch (error) {
      console.error('Product bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    }
  };

  const getPageInfo = () => {
    if (user?.loginType === "hub") {
      return {
        title: "Hub Product Management",
        description: "Manage fish and seafood products for hub operations",
      };
    } else if (user?.loginType === "store") {
      return {
        title: "Store Product Management",
        description: "Manage meat, chicken, and other products for store operations",
      };
    } else {
      return {
        title: "All Products",
        description: "Manage all products across hubs and stores",
      };
    }
  };

  const getAddButtonText = () => {
    if (user?.loginType === 'super_admin') {
      return activeTab === 'hub' ? 'Add Hub Product' : 'Add Store Product';
    }
    return 'Add Product';
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fully Responsive Container */}
      <div className="w-full py-2 sm:py-4 md:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          
          {/* Responsive Header Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {pageInfo.title}
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3">
                  {pageInfo.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="bg-blue-100 text-blue-700" className="text-xs font-medium">
                    {displayProducts.length} Products
                  </Badge>
                  <Badge variant="bg-green-100 text-green-700" className="text-xs font-medium">
                    {displayProducts.filter(p => p.isActive).length} Active
                  </Badge>
                  {user?.loginType === 'super_admin' && (
                    <Badge variant="bg-purple-100 text-purple-700" className="text-xs font-medium">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View
                    </Badge>
                  )}
                  {dateFilter !== 'all' && (
                    <Badge variant="bg-orange-100 text-orange-700" className="text-xs font-medium">
                      {dateFilterOptions.find(opt => opt.value === dateFilter)?.label}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  onClick={() => setShowDateFilter(!showDateFilter)}
                  variant="secondary"
                  className="w-full sm:w-auto px-4 py-2 border-gray-300 hover:bg-gray-50"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="sm:hidden">Filter</span>
                  <span className="hidden sm:inline">Date Filter</span>
                </Button>
                <Button 
                  onClick={handleAddProduct} 
                  className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="sm:hidden">Add Product</span>
                  <span className="hidden sm:inline">{getAddButtonText()}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Date Filter Panel */}
          {showDateFilter && (
            <Card className="p-4 sm:p-6 border-l-4 border-l-orange-500">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Date Filter</h3>
                  </div>
                  <Button
                    onClick={resetDateFilter}
                    variant="secondary"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Reset
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {dateFilterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDateFilter(option.value)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        dateFilter === option.value
                          ? 'bg-orange-100 border-orange-300 text-orange-700 font-medium'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Custom Date Range */}
                {dateFilter === 'custom' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Date Range</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    {customStartDate && customEndDate && (
                      <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
                        <p className="text-xs text-orange-700">
                          <strong>Selected Range:</strong> {new Date(customStartDate).toLocaleDateString()} - {new Date(customEndDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Filter Summary */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Showing:</span>
                  <Badge variant="bg-blue-100 text-blue-700" className="text-xs">
                    {displayProducts.length} products
                  </Badge>
                  {dateFilter !== 'all' && (
                    <Badge variant="bg-orange-100 text-orange-700" className="text-xs">
                      {dateFilterOptions.find(opt => opt.value === dateFilter)?.label}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Responsive Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {displayProducts.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    All products
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Products</p>
                  <p className="text-2xl font-bold text-green-600">
                    {displayProducts.filter(p => p.isActive).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Currently active
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-yellow-500">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">Best Sellers</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {displayProducts.filter(p => p.isBestSeller).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Top performers
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-red-500">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">Low Stock</p>
                  <p className="text-2xl font-bold text-red-600">
                    {displayProducts.filter(p => (p.variants[0]?.stock || 0) < 10).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Need attention
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Responsive Tabs for Hub/Store Products */}
          {user?.loginType === 'super_admin' && (
            <Card className="p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Categories</h3>
                <p className="text-sm text-gray-600">Switch between hub and store product management</p>
              </div>
              <div className="flex gap-2 border-b overflow-x-auto pb-4">
                {[
                  { 
                    id: 'hub', 
                    label: 'Hub Products', 
                    count: filteredProducts.filter(p => p.sourceType === 'hub').length,
                    description: 'Fish & Seafood',
                    icon: '🐟'
                  },
                  { 
                    id: 'store', 
                    label: 'Store Products', 
                    count: filteredProducts.filter(p => p.sourceType === 'store').length,
                    description: 'Meat & Poultry',
                    icon: '🥩'
                  }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'hub' | 'store')}
                    className={`flex items-center gap-3 px-4 py-3 border-b-2 transition-all whitespace-nowrap text-sm min-w-0 rounded-t-lg ${
                      activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600 bg-blue-50' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tab.label}</span>
                        <Badge 
                          variant={activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"} 
                          className="text-xs font-medium"
                        >
                          {tab.count}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{tab.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Responsive Products List */}
          <Card className="overflow-hidden shadow-sm border border-gray-200">
            <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.loginType === 'super_admin' 
                      ? `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Products`
                      : "Products"
                    }
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage and organize your product catalog
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="bg-blue-100 text-blue-700" className="text-xs font-medium">
                    {displayProducts.length} Total
                  </Badge>
                  <Badge variant="bg-green-100 text-green-700" className="text-xs font-medium">
                    {displayProducts.filter(p => p.isActive).length} Active
                  </Badge>
                </div>
              </div>
            </div>
            <ProductsList
              products={displayProducts}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onToggleVisibility={(product) => {
                console.log('Toggle visibility for:', product.id, 'Current:', product.isActive);
                // In real app, call API to toggle product visibility
                alert(`Product "${product.nameEn}" ${product.isActive ? 'hidden' : 'shown'} successfully!`);
              }}
              onBulkAction={handleProductBulkAction}
              title=""
              additionalFilters={user?.loginType === 'super_admin' ? [
                {
                  key: activeTab === 'hub' ? 'hubId' : 'storeId',
                  label: activeTab === 'hub' ? 'Hub' : 'Store',
                  value: activeTab === 'hub' ? selectedHubId : selectedStoreId,
                  onChange: (value: string) => {
                    if (activeTab === 'hub') {
                      setSelectedHubId(value);
                    } else {
                      setSelectedStoreId(value);
                    }
                  },
                  options: [
                    { value: 'all', label: `All ${activeTab === 'hub' ? 'Hubs' : 'Stores'}` },
                    ...(activeTab === 'hub' ? mockHubs : mockStores).map(item => ({
                      value: item.id,
                      label: `${item.name} - ${item.location}`
                    }))
                  ]
                }
              ] : undefined}
            />
          </Card>

          {/* Responsive Add/Edit Product Modal */}
          <Modal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setSelectedProduct(null);
            }}
            title={selectedProduct ? "Edit Product" : "Add New Product"}
            size="xl"
          >
            <CompleteProductForm
              onSave={(productData: any) => {
                console.log("Product data:", productData);
                setShowAddModal(false);
                setSelectedProduct(null);
              }}
              onCancel={() => {
                setShowAddModal(false);
                setSelectedProduct(null);
              }}
              initialData={selectedProduct ? {
                // Basic Info
                nameEn: selectedProduct.nameEn,
                nameTa: selectedProduct.nameTa,
                category: selectedProduct.category,
                hsnNumber: selectedProduct.sku || '',
                variant: selectedProduct.variants[0]?.type || '',
                fishSize: selectedProduct.variants[0]?.size || '',
                maxSize: selectedProduct.variants[0]?.grossWeight || '',
                basePriceMin: selectedProduct.variants[0]?.price || 0,
                basePriceMax: selectedProduct.variants[0]?.price || 0,
                fishCountMin: 0,
                fishCountMax: 0,
                isBestSeller: selectedProduct.isBestSeller,
                isRareProduct: selectedProduct.isRare,
                isActive: selectedProduct.isActive,
                
                // New fields
                productType: '',
                season: '',
                metaTitle: '',
                metaDescription: '',
                
                // Combo data
                isCombo: false,
                comboData: {
                  comboName: '',
                  comboOfferPercent: 0,
                  comboDescription: '',
                  comboItems: [],
                  isBestSeller: false,
                  isRareProduct: false,
                  isActive: true,
                  productType: '',
                  season: '',
                  metaTitle: '',
                  metaDescription: ''
                },
                
                // Other sections
                images: [],
                primaryImageIndex: 0,
                description: selectedProduct.description || '',
                variants: selectedProduct.variants.map(v => ({
                  id: v.id,
                  type: v.type,
                  size: v.size,
                  grossWeight: v.grossWeight,
                  netWeight: v.netWeight,
                  pieces: v.pieces,
                  serves: v.serves,
                  skuNumber: '',
                  actualPrice: v.price,
                  salesPrice: v.price,
                  stock: v.stock,
                  igst: 0,
                  cgst: 0,
                  sgst: 0,
                  cuttingTypeId: ''
                })),
                
                // Day-based pricing
                dayBasedPricing: {
                  enabled: false,
                  dayPrices: [
                    { day: 'monday', price: 0, enabled: false },
                    { day: 'tuesday', price: 0, enabled: false },
                    { day: 'wednesday', price: 0, enabled: false },
                    { day: 'thursday', price: 0, enabled: false },
                    { day: 'friday', price: 0, enabled: false },
                    { day: 'saturday', price: 0, enabled: false },
                    { day: 'sunday', price: 0, enabled: false },
                  ]
                },
                
                // Product tags
                productTags: {
                  tags: []
                },
                
                // Nutrition
                nutrition: {
                  calories: selectedProduct.nutritionalInfo?.calories || 0,
                  protein: selectedProduct.nutritionalInfo?.protein || 0,
                  carbs: 0,
                  fat: selectedProduct.nutritionalInfo?.fat || 0,
                  fiber: 0,
                  sugar: 0,
                  sodium: 0,
                  cholesterol: 0,
                  vitamins: {
                    vitaminA: 0,
                    vitaminC: 0,
                    vitaminD: 0,
                    vitaminB12: 0,
                  },
                  minerals: {
                    calcium: 0,
                    iron: selectedProduct.nutritionalInfo?.iron || 0,
                    potassium: 0,
                    magnesium: 0,
                  },
                },
                selectedNutrition: {},
              } : undefined}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
