import { useEffect, useMemo, useState } from "react";
import { Modal, Badge, Button, Card } from "../../components/ui";
import { CompleteProductForm } from "../../components/products/CompleteProductForm";
import { ProductsList } from "../../components/features/products";
import { useAuth } from "../../context/AuthContext";
import { filterDataByModule } from "../../utils/rbac";
import { Package, Plus, Calendar, Filter, RefreshCw } from "lucide-react";
import type { Product } from "../../types";
import {
  bulkUpdateProducts,
  createProduct,
  deleteProduct,
  listHubOptions,
  listProducts,
  listStoreOptions,
  mapBackendProductToAdminProduct,
  updateProduct,
  type LocationOption,
  type ProductRecord,
} from "../../utils/productBackend";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function serializeImages(images: Array<File | string>) {
  const serialized: string[] = [];

  for (const image of images) {
    if (typeof image === "string") {
      serialized.push(image);
      continue;
    }

    serialized.push(await fileToDataUrl(image));
  }

  return serialized;
}

export function ProductsPage() {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>('hub');
  const [selectedHubId, setSelectedHubId] = useState<string>('all');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');
  const [productRecords, setProductRecords] = useState<ProductRecord[]>([]);
  const [hubOptions, setHubOptions] = useState<LocationOption[]>([]);
  const [storeOptions, setStoreOptions] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  const refreshPageData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [products, hubs, stores] = await Promise.all([
        listProducts({ limit: '200' }),
        listHubOptions(),
        listStoreOptions(),
      ]);

      setProductRecords(products);
      setHubOptions(hubs);
      setStoreOptions(stores);
    } catch (loadError) {
      console.error('Failed to load products page data', loadError);
      setError(loadError instanceof Error ? loadError.message : 'Failed to load product data');
      setProductRecords([]);
      setHubOptions([]);
      setStoreOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshPageData();
  }, []);

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
  const filterProductsByDate = (products: ProductRecord[]) => {
    if (dateFilter === 'all') return products;
    
    const dateRange = getDateRange(dateFilter);
    if (!dateRange) return products;

    return products.filter((product) => {
      const productDate = product.createdAt ? new Date(product.createdAt) : null;
      if (!productDate || Number.isNaN(productDate.getTime())) {
        return false;
      }
      return productDate >= dateRange.start && productDate <= dateRange.end;
    });
  };

  // Filter products based on user's module access
  const filteredProducts = filterDataByModule<ProductRecord>(productRecords, user);

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

  const displayProductRecords = getDisplayProducts();
  const displayProducts = useMemo(
    () => displayProductRecords.map((product) => mapBackendProductToAdminProduct(product)),
    [displayProductRecords]
  );

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

  const currentModuleScope: 'hub' | 'store' =
    user?.loginType === 'super_admin' ? activeTab : user?.loginType === 'store' ? 'store' : 'hub';

  const resolveEditingProduct = (product: Product) =>
    productRecords.find((item) => item.id === product.id) || null;

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(resolveEditingProduct(product));
    setShowAddModal(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(resolveEditingProduct(product));
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(product.id);
        await refreshPageData();
      } catch (deleteError) {
        console.error('Delete product failed', deleteError);
        alert(deleteError instanceof Error ? deleteError.message : 'Delete product failed');
      }
    }
  };

  // Bulk actions handler for products
  const handleProductBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      if (
        actionId === 'activate' ||
        actionId === 'deactivate' ||
        actionId === 'archive' ||
        actionId === 'delete'
      ) {
        await bulkUpdateProducts({
          ids: selectedIds,
          action: actionId,
        });
        await refreshPageData();
        return;
      }

      console.log(`Bulk action ${actionId} performed on ${selectedIds.length} products`, data);
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

  const resolveTargetLocation = () => {
    if (currentModuleScope === 'hub') {
      if (selectedProduct?.hubId) {
        return { hubId: selectedProduct.hubId, storeId: null };
      }

      if (user?.loginType === 'hub' && user.hubId) {
        return { hubId: user.hubId, storeId: null };
      }

      if (selectedHubId !== 'all') {
        return { hubId: selectedHubId, storeId: null };
      }

      return { hubId: null, storeId: null };
    }

    if (selectedProduct?.storeId) {
      return { hubId: null, storeId: selectedProduct.storeId };
    }

    if (user?.loginType === 'store' && user.storeId) {
      return { hubId: null, storeId: user.storeId };
    }

    if (selectedStoreId !== 'all') {
      return { hubId: null, storeId: selectedStoreId };
    }

    return { hubId: null, storeId: null };
  };

  const buildInitialData = (product: ProductRecord | null) => {
    if (!product) {
      return undefined;
    }

    const comboItems = product.combo.items.map((item) => {
      const comboProduct = productRecords.find((record) => record.id === item.productId);
      return {
        id: item.id,
        categoryId: comboProduct?.categoryId || '',
        productId: item.productId,
        quantity: item.quantity,
      };
    });

    return {
      id: product.id,
      nameEn: product.nameEn,
      nameTa: product.nameTa,
      category: product.categoryId || '',
      hsnNumber: product.hsnNumber || '',
      variant: product.variants[0]?.type || '',
      fishSize: product.fishSize || product.weight || '',
      maxSize: product.maxSize || product.quantityLabel || '',
      basePriceMin: product.variants.length
        ? Math.min(...product.variants.map((variant) => variant.actualPrice))
        : 0,
      basePriceMax: product.variants.length
        ? Math.max(...product.variants.map((variant) => variant.actualPrice))
        : 0,
      fishCountMin: product.fishCountMin || 0,
      fishCountMax: product.fishCountMax || 0,
      isBestSeller: product.isBestSeller,
      isRareProduct: product.isRare,
      isActive: product.isActive,
      productType: product.productType,
      season: product.season,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      isCombo: product.combo.enabled,
      comboData: {
        comboName: product.combo.comboName || '',
        comboOfferPercent: product.combo.comboOfferPercent || 0,
        comboDescription: product.combo.comboDescription || '',
        comboItems,
        isBestSeller: product.isBestSeller,
        isRareProduct: product.isRare,
        isActive: product.isActive,
        productType: product.productType,
        season: product.season,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
      },
      images: product.images,
      primaryImageIndex: product.primaryImageIndex || 0,
      description: product.description,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        type: variant.type,
        size: variant.size,
        grossWeight: variant.grossWeight,
        netWeight: variant.netWeight,
        pieces: variant.pieces,
        serves: variant.serves,
        skuNumber: variant.skuNumber,
        actualPrice: variant.actualPrice,
        salesPrice: variant.salesPrice,
        stock: variant.stock,
        igst: variant.igst,
        cgst: variant.cgst,
        sgst: variant.sgst,
        cuttingTypeId: variant.cuttingTypeId || '',
      })),
      dayBasedPricing: product.dayBasedPricing,
      productTags: {
        tags: product.productTags,
      },
      nutrition: product.nutrition
        ? {
            calories: product.nutrition.calories,
            protein: product.nutrition.protein,
            carbs: product.nutrition.carbs,
            fat: product.nutrition.fat,
            fiber: product.nutrition.fiber,
            sugar: product.nutrition.sugar,
            sodium: product.nutrition.sodium,
            cholesterol: product.nutrition.cholesterol,
            vitamins: {
              vitaminA: Number(product.nutrition.vitamins.vitaminA || 0),
              vitaminC: Number(product.nutrition.vitamins.vitaminC || 0),
              vitaminD: Number(product.nutrition.vitamins.vitaminD || 0),
              vitaminB12: Number(product.nutrition.vitamins.vitaminB12 || 0),
            },
            minerals: {
              calcium: Number(product.nutrition.minerals.calcium || 0),
              iron: Number(product.nutrition.minerals.iron || 0),
              potassium: Number(product.nutrition.minerals.potassium || 0),
              magnesium: Number(product.nutrition.minerals.magnesium || 0),
            },
          }
        : undefined,
      selectedNutrition: product.nutrition?.selectedNutrition || {},
    };
  };

  const handleSaveProduct = async (productData: {
    nameEn: string;
    nameTa: string;
    category: string;
    hsnNumber: string;
    variant: string;
    fishSize: string;
    maxSize: string;
    basePriceMin: number;
    basePriceMax: number;
    fishCountMin: number;
    fishCountMax: number;
    isBestSeller: boolean;
    isRareProduct: boolean;
    isActive: boolean;
    productType: 'fresh' | 'frozen' | 'processed' | '';
    season: string;
    metaTitle: string;
    metaDescription: string;
    isCombo: boolean;
    comboData: {
      comboName: string;
      comboOfferPercent: number;
      comboDescription: string;
      comboItems: Array<{ id: string; categoryId: string; productId: string; quantity: number }>;
      isBestSeller: boolean;
      isRareProduct: boolean;
      isActive: boolean;
      productType: 'fresh' | 'frozen' | 'processed' | '';
      season: string;
      metaTitle: string;
      metaDescription: string;
    };
    images: Array<File | string>;
    primaryImageIndex: number;
    description: string;
    dayBasedPricing: {
      enabled: boolean;
      dayPrices: Array<{ day: string; price: number; enabled: boolean }>;
    };
    productTags: { tags: string[] };
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      sugar: number;
      sodium: number;
      cholesterol: number;
      vitamins: Record<string, number>;
      minerals: Record<string, number>;
    };
    selectedNutrition: Record<string, boolean>;
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
    }>;
  }) => {
    if (!user?.id || !user.name || !user.role) {
      alert('User context is missing. Please login again.');
      return;
    }

    const location = resolveTargetLocation();
    if (currentModuleScope === 'hub' && !location.hubId) {
      alert('Select a hub before creating or updating a hub product.');
      return;
    }

    if (currentModuleScope === 'store' && !location.storeId) {
      alert('Select a store before creating or updating a store product.');
      return;
    }

    try {
      const images = await serializeImages(productData.images);
      const payload = {
        moduleScope: currentModuleScope,
        hubId: location.hubId,
        storeId: location.storeId,
        nameEn: productData.nameEn,
        nameTa: productData.nameTa || productData.comboData.comboName,
        categoryId: productData.category,
        hsnNumber: productData.hsnNumber,
        variant: productData.variant,
        fishSize: productData.fishSize,
        maxSize: productData.maxSize,
        basePriceMin: productData.basePriceMin,
        basePriceMax: productData.basePriceMax,
        fishCountMin: productData.fishCountMin,
        fishCountMax: productData.fishCountMax,
        isBestSeller: productData.isBestSeller,
        isRareProduct: productData.isRareProduct,
        isActive: productData.isActive,
        productType: productData.productType,
        season: productData.season,
        metaTitle: productData.metaTitle,
        metaDescription: productData.metaDescription,
        isCombo: productData.isCombo,
        ...(productData.isCombo ? { comboData: productData.comboData } : {}),
        images,
        primaryImageIndex: productData.primaryImageIndex,
        description: productData.description,
        dayBasedPricing: productData.dayBasedPricing,
        productTags: productData.productTags.tags,
        nutrition: {
          ...productData.nutrition,
          selectedNutrition: productData.selectedNutrition,
        },
        variants: productData.variants,
        deliveryType:
          selectedProduct?.deliveryType || (currentModuleScope === 'store' ? 'same_day' : 'next_day'),
        requestedBy: {
          userId: user.id,
          name: user.name,
          role: user.role,
        },
      };

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      await refreshPageData();
      setShowAddModal(false);
      setSelectedProduct(null);
    } catch (saveError) {
      console.error('Failed to save product', saveError);
      alert(saveError instanceof Error ? saveError.message : 'Failed to save product');
    }
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

          {error && (
            <Card className="p-4 border-l-4 border-l-red-500">
              <p className="text-sm text-red-700">{error}</p>
            </Card>
          )}

          {isLoading && (
            <Card className="p-4 border-l-4 border-l-blue-500">
              <p className="text-sm text-blue-700">Loading product data...</p>
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
              onToggleVisibility={async (product) => {
                const rawProduct = resolveEditingProduct(product);
                if (!rawProduct || !user?.id || !user.name || !user.role) {
                  return;
                }

                try {
                  await updateProduct(rawProduct.id, {
                    moduleScope: rawProduct.moduleScope,
                    hubId: rawProduct.hubId,
                    storeId: rawProduct.storeId,
                    nameEn: rawProduct.nameEn,
                    nameTa: rawProduct.nameTa,
                    categoryId: rawProduct.categoryId,
                    hsnNumber: rawProduct.hsnNumber,
                    variant: rawProduct.variants[0]?.type || '',
                    fishSize: rawProduct.fishSize || rawProduct.weight,
                    maxSize: rawProduct.maxSize || rawProduct.quantityLabel,
                    basePriceMin: rawProduct.variants.length
                      ? Math.min(...rawProduct.variants.map((variant) => variant.actualPrice))
                      : 0,
                    basePriceMax: rawProduct.variants.length
                      ? Math.max(...rawProduct.variants.map((variant) => variant.actualPrice))
                      : 0,
                    fishCountMin: rawProduct.fishCountMin || 0,
                    fishCountMax: rawProduct.fishCountMax || 0,
                    isBestSeller: rawProduct.isBestSeller,
                    isRareProduct: rawProduct.isRare,
                    isActive: !rawProduct.isActive,
                    productType: rawProduct.productType,
                    season: rawProduct.season,
                    metaTitle: rawProduct.metaTitle,
                    metaDescription: rawProduct.metaDescription,
                    isCombo: rawProduct.combo.enabled,
                    ...(rawProduct.combo.enabled
                      ? {
                          comboData: {
                            comboName: rawProduct.combo.comboName,
                            comboOfferPercent: rawProduct.combo.comboOfferPercent,
                            comboDescription: rawProduct.combo.comboDescription,
                            comboItems: rawProduct.combo.items.map((item) => ({
                              id: item.id,
                              categoryId:
                                productRecords.find((record) => record.id === item.productId)?.categoryId || '',
                              productId: item.productId,
                              quantity: item.quantity,
                            })),
                            isBestSeller: rawProduct.isBestSeller,
                            isRareProduct: rawProduct.isRare,
                            isActive: !rawProduct.isActive,
                            productType: rawProduct.productType,
                            season: rawProduct.season,
                            metaTitle: rawProduct.metaTitle,
                            metaDescription: rawProduct.metaDescription,
                          },
                        }
                      : {}),
                    images: rawProduct.images,
                    primaryImageIndex: rawProduct.primaryImageIndex,
                    description: rawProduct.description,
                    dayBasedPricing: rawProduct.dayBasedPricing,
                    productTags: rawProduct.productTags,
                    nutrition: rawProduct.nutrition || undefined,
                    variants: rawProduct.variants,
                    deliveryType: rawProduct.deliveryType,
                    requestedBy: {
                      userId: user.id,
                      name: user.name,
                      role: user.role,
                    },
                  });
                  await refreshPageData();
                } catch (toggleError) {
                  console.error('Toggle visibility failed', toggleError);
                  alert(toggleError instanceof Error ? toggleError.message : 'Failed to toggle visibility');
                }
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
                    ...(activeTab === 'hub' ? hubOptions : storeOptions).map(item => ({
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
              onSave={handleSaveProduct}
              onCancel={() => {
                setShowAddModal(false);
                setSelectedProduct(null);
              }}
              initialData={buildInitialData(selectedProduct)}
              moduleScope={selectedProduct?.moduleScope || currentModuleScope}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
