import { useState, useEffect } from 'react';
import { Button, Modal, Badge, Card } from '../../components/ui';
import { CategoryForm, type CategoryFormData } from '../../components/categories/CategoryForm';
import { CategoryList, type Category } from '../../components/categories/CategoryList';
import { Plus, Package, History, FileText, Fish, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { categoriesApi } from '../../utils/api';

// Mock categories data with enhanced structure
const mockCategories: Category[] = [
  // Hub Categories
  {
    id: '1',
    name: 'Sea Fish',
    nameTa: 'கடல் மீன்',
    description: 'Fresh sea fish varieties including tuna, seer, pomfret, and more',
    icon: 'fish',
    color: 'blue',
    image: undefined,
    isActive: true,
    order: 0,
    type: 'hub' as 'hub',
    productCount: 25,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Freshwater Fish',
    nameTa: 'நன்னீர் மீன்',
    description: 'Fresh river and lake fish varieties',
    icon: 'fish',
    color: 'teal',
    image: undefined,
    isActive: true,
    order: 1,
    type: 'hub' as 'hub',
    productCount: 18,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Shell Fish',
    nameTa: 'ஓடு மீன்',
    description: 'Prawns, crabs, lobsters, and other shellfish',
    icon: 'shrimp',
    color: 'orange',
    image: undefined,
    isActive: true,
    order: 2,
    type: 'hub' as 'hub',
    productCount: 15,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12'
  },
  {
    id: '4',
    name: 'Dry Fish',
    nameTa: 'காய்ந்த மீன்',
    description: 'Dried and preserved fish varieties',
    icon: 'fish',
    color: 'yellow',
    image: undefined,
    isActive: true,
    order: 3,
    type: 'hub' as 'hub',
    productCount: 8,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-08'
  },
  // Store Categories
  {
    id: '5',
    name: 'Meat',
    nameTa: 'இறைச்சி',
    description: 'Fresh meat products including chicken, mutton, and other varieties',
    icon: 'meat',
    color: 'red',
    image: undefined,
    isActive: true,
    order: 4,
    type: 'store' as 'store',
    productCount: 38,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-14'
  },
  {
    id: '6',
    name: 'Eggs',
    nameTa: 'முட்டை',
    description: 'Fresh eggs from various sources',
    icon: 'egg',
    color: 'yellow',
    image: undefined,
    isActive: true,
    order: 5,
    productCount: 12,
    type: 'store' as 'store',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-13'
  },
  {
    id: '7',
    name: 'Spices',
    nameTa: 'மசாலா',
    description: 'Cooking spices, herbs, and seasonings',
    icon: 'spices',
    color: 'green',
    image: undefined,
    isActive: true,
    order: 6,
    productCount: 24,
    createdAt: '2024-01-01',
    type: 'store' as 'store',
    updatedAt: '2024-01-09'
  },
  {
    id: '8',
    name: 'Ready to Eat',
    nameTa: 'உடனடி உணவு',
    description: 'Pre-cooked meals and ready-to-eat food items',
    icon: 'utensils',
    color: 'purple',
    image: undefined,
    isActive: true,
    order: 7,
    productCount: 15,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-16',
    type: 'store' as 'store'
  },
  {
    id: '9',
    name: 'Ready to Cook',
    nameTa: 'சமைக்க தயார்',
    description: 'Pre-marinated and ready-to-cook products',
    icon: 'chef-hat',
    color: 'indigo',
    image: undefined,
    isActive: true,
    order: 8,
    productCount: 20,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-17',
    type: 'store' as 'store'
  },
  // Additional Hub Categories
  {
    id: '10',
    name: 'Exotic Fish',
    nameTa: 'அரிய மீன்',
    description: 'Rare and exotic fish varieties',
    icon: 'fish',
    color: 'cyan',
    image: undefined,
    isActive: true,
    order: 4,
    productCount: 8,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-18',
    type: 'hub' as 'hub'
  },
  {
    id: '11',
    name: 'Frozen Fish',
    nameTa: 'உறைந்த மீன்',
    description: 'Frozen fish products for longer shelf life',
    icon: 'fish',
    color: 'blue',
    image: undefined,
    isActive: true,
    order: 5,
    productCount: 12,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-19',
    type: 'hub' as 'hub'
  },
  // Additional Store Categories
  {
    id: '12',
    name: 'Dairy Products',
    nameTa: 'பால் பொருட்கள்',
    description: 'Milk, cheese, butter, and other dairy items',
    icon: 'egg',
    color: 'yellow',
    image: undefined,
    isActive: true,
    order: 9,
    productCount: 15,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20',
    type: 'store' as 'store'
  },
  {
    id: '13',
    name: 'Vegetables',
    nameTa: 'காய்கறிகள்',
    description: 'Fresh vegetables and greens',
    icon: 'vegetable',
    color: 'green',
    image: undefined,
    isActive: true,
    order: 10,
    productCount: 30,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-21',
    type: 'store' as 'store'
  },
  {
    id: '14',
    name: 'Fruits',
    nameTa: 'பழங்கள்',
    description: 'Fresh seasonal fruits',
    icon: 'fruit',
    color: 'pink',
    image: undefined,
    isActive: true,
    order: 11,
    productCount: 25,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-22',
    type: 'store' as 'store'
  }
];

export function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>('hub');

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to mock data if API fails
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories by type
  const hubCategories = categories.filter(cat => cat.type === 'hub').sort((a, b) => a.order - b.order);
  const storeCategories = categories.filter(cat => cat.type === 'store').sort((a, b) => a.order - b.order);
  
  // Get display categories based on active tab
  const displayCategories = activeTab === 'hub' ? hubCategories : storeCategories;

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowAddModal(true);
  };

  const getInitialFormData = () => {
    if (selectedCategory) return selectedCategory;
    // Set type based on activeTab for new categories
    return { type: activeTab } as Partial<CategoryFormData>;
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (category.productCount > 0) {
      alert(`Cannot delete category "${category.name}" because it has ${category.productCount} products. Please move or delete the products first.`);
      return;
    }
    
    if (confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
      try {
        setLoading(true);
        await categoriesApi.delete(category.id);
        setCategories(prev => prev.filter(cat => cat.id !== category.id));
        alert('Category deleted successfully');
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Failed to delete category. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveCategory = async (categoryData: CategoryFormData) => {
    try {
      setLoading(true);
      
      // Prepare form data for image upload
      const formData = new FormData();
      Object.entries(categoryData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });

      if (selectedCategory) {
        // Update existing category
        await categoriesApi.update(selectedCategory.id, formData);
        setCategories(prev => prev.map(cat => 
          cat.id === selectedCategory.id 
            ? { 
                ...cat, 
                ...categoryData, 
                updatedAt: new Date().toISOString().slice(0, 10)
              }
            : cat
        ));
        alert('Category updated successfully! Changes will reflect across all Hub and Store interfaces.');
      } else {
        // Create new category
        const response = await categoriesApi.create(formData);
        const newCategory: Category = {
          ...response.data,
          productCount: 0,
        };
        setCategories(prev => [...prev, newCategory]);
        alert('Category created successfully! Changes will reflect across all Hub and Store interfaces.');
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedCategory(null);
      
      // Refresh categories to get latest data
      await fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReorderCategories = async (reorderedCategories: Category[]) => {
    try {
      setLoading(true);
      
      // Update local state immediately for better UX
      setCategories(reorderedCategories);
      
      // Send reorder request to backend
      const categoryIds = reorderedCategories.map(cat => cat.id);
      await categoriesApi.reorder({ categoryIds });
      
      console.log('Categories reordered successfully');
    } catch (error) {
      console.error('Failed to reorder categories:', error);
      alert('Failed to save category order. Please try again.');
      // Revert to original order on error
      await fetchCategories();
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = (category: Category) => {
    setSelectedCategory(category);
    setShowHistoryModal(true);
  };

  // Bulk actions handler for categories
  const handleCategoryBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      setLoading(true);
      
      switch (actionId) {
        case 'show':
          await categoriesApi.bulkUpdate({ ids: selectedIds, updates: { isActive: true } });
          setCategories(prev => prev.map(cat => 
            selectedIds.includes(cat.id) ? { ...cat, isActive: true, updatedAt: new Date().toISOString().slice(0, 10) } : cat
          ));
          alert(`${selectedIds.length} categories are now visible`);
          break;
          
        case 'hide':
          await categoriesApi.bulkUpdate({ ids: selectedIds, updates: { isActive: false } });
          setCategories(prev => prev.map(cat => 
            selectedIds.includes(cat.id) ? { ...cat, isActive: false, updatedAt: new Date().toISOString().slice(0, 10) } : cat
          ));
          alert(`${selectedIds.length} categories are now hidden`);
          break;
          
        case 'delete':
          const categoriesToDelete = categories.filter(cat => selectedIds.includes(cat.id));
          const categoriesWithProducts = categoriesToDelete.filter(cat => cat.productCount > 0);
          
          if (categoriesWithProducts.length > 0) {
            alert(`Cannot delete ${categoriesWithProducts.length} categories because they have products. Please move or delete the products first.`);
            return;
          }
          
          // Delete categories one by one
          await Promise.all(selectedIds.map(id => categoriesApi.delete(id)));
          setCategories(prev => prev.filter(cat => !selectedIds.includes(cat.id)));
          alert(`${selectedIds.length} categories deleted successfully`);
          break;
          
        default:
          console.log(`Bulk action ${actionId} performed on ${selectedIds.length} categories`, data);
      }
      
      // Refresh categories to ensure sync
      await fetchCategories();
    } catch (error) {
      console.error('Category bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryStats = () => {
    return {
      totalHub: hubCategories.length,
      totalStore: storeCategories.length,
      visibleHub: hubCategories.filter(cat => cat.isActive).length,
      visibleStore: storeCategories.filter(cat => cat.isActive).length,
      totalProducts: categories.reduce((sum, cat) => sum + cat.productCount, 0),
      activeDisplay: displayCategories.filter(cat => cat.isActive).length
    };
  };

  const stats = getCategoryStats();
  
  const getPageInfo = () => {
    if (user?.loginType === "hub") {
      return {
        title: "Hub Category Management",
        description: "Manage fish and seafood categories for hub operations",
      };
    } else if (user?.loginType === "store") {
      return {
        title: "Store Category Management",
        description: "Manage meat, eggs, and other categories for store operations",
      };
    } else {
      return {
        title: "Category Management",
        description: "Manage categories for Hub (Fish) and Store (Meat, Eggs, etc.)",
      };
    }
  };

  const getAddButtonText = () => {
    if (user?.loginType === 'super_admin') {
      return activeTab === 'hub' ? 'Add Hub Category' : 'Add Store Category';
    }
    return 'Add Category';
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-2 sm:py-4 md:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          
          {/* Header Section */}
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
                    {displayCategories.length} Categories
                  </Badge>
                  <Badge variant="bg-green-100 text-green-700" className="text-xs font-medium">
                    {stats.activeDisplay} Active
                  </Badge>
                  {user?.loginType === 'super_admin' && (
                    <Badge variant="bg-purple-100 text-purple-700" className="text-xs font-medium">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowHistoryModal(true)}
                  className="w-full sm:w-auto px-4 py-2 border-gray-300 hover:bg-gray-50"
                >
                  <History className="mr-2 h-4 w-4" />
                  <span className="sm:hidden">History</span>
                  <span className="hidden sm:inline">History</span>
                </Button>
                <Button 
                  onClick={handleAddCategory} 
                  className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="sm:hidden">Add Category</span>
                  <span className="hidden sm:inline">{getAddButtonText()}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">Hub Categories</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.totalHub}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {stats.visibleHub} visible
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Fish className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">Store Categories</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.totalStore}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    {stats.visibleStore} visible
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-gray-500">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalHub + stats.totalStore}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    All categories
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Package className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.totalProducts}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Using categories
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Tab Section - Only for Super Admin */}
          {user?.loginType === 'super_admin' && (
            <Card className="overflow-hidden">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Types</h3>
                <p className="text-sm text-gray-600">Switch between hub and store category management</p>
              </div>
              <div className="flex gap-2 border-b overflow-x-auto pb-4">
                {[
                  { 
                    id: 'hub', 
                    label: 'Hub Categories', 
                    count: hubCategories.length,
                    description: 'Fish & Seafood',
                    icon: '🐟'
                  },
                  { 
                    id: 'store', 
                    label: 'Store Categories', 
                    count: storeCategories.length,
                    description: 'Meat, Eggs & More',
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

          {/* Categories List */}
          <Card className="overflow-hidden shadow-sm border border-gray-200">
            <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.loginType === 'super_admin' 
                      ? `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Categories`
                      : "Categories"
                    }
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage and organize your category catalog
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="bg-blue-100 text-blue-700" className="text-xs font-medium">
                    {displayCategories.length} Total
                  </Badge>
                  <Badge variant="bg-green-100 text-green-700" className="text-xs font-medium">
                    {stats.activeDisplay} Active
                  </Badge>
                </div>
              </div>
            </div>
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-600">Loading...</p>
                </div>
              </div>
            )}
            <CategoryList
              categories={displayCategories}
              onView={handleViewCategory}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              onReorder={handleReorderCategories}
              onBulkAction={handleCategoryBulkAction}
              title={user?.loginType === 'super_admin' 
                ? `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Categories`
                : "Categories"
              }
              allowReordering={user?.loginType === 'super_admin'}
            />
          </Card>

          {/* Add Category Modal */}
          <Modal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setSelectedCategory(null);
            }}
            title={`Add New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Category`}
            size="xl"
          >
            <CategoryForm
              initialData={getInitialFormData()}
              onSave={handleSaveCategory}
              onCancel={() => {
                setShowAddModal(false);
                setSelectedCategory(null);
              }}
            />
          </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        title="Edit Category"
        size="xl"
      >
        {selectedCategory && (
          <CategoryForm
            initialData={selectedCategory}
            onSave={handleSaveCategory}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedCategory(null);
            }}
            isEdit={true}
          />
        )}
      </Modal>

      {/* View Category Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCategory(null);
        }}
        title="Category Details"
        size="lg"
      >
        {selectedCategory && (
          <div className="space-y-6">
            {/* Header with Image/Icon */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center ${
                selectedCategory.color === 'blue' ? 'bg-blue-100 border-blue-200' :
                selectedCategory.color === 'green' ? 'bg-green-100 border-green-200' :
                selectedCategory.color === 'red' ? 'bg-red-100 border-red-200' :
                selectedCategory.color === 'yellow' ? 'bg-yellow-100 border-yellow-200' :
                selectedCategory.color === 'purple' ? 'bg-purple-100 border-purple-200' :
                selectedCategory.color === 'orange' ? 'bg-orange-100 border-orange-200' :
                'bg-gray-100 border-gray-200'
              }`}>
                {selectedCategory.image ? (
                  <img
                    src={typeof selectedCategory.image === 'string' ? selectedCategory.image : URL.createObjectURL(selectedCategory.image)}
                    alt={selectedCategory.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-2xl">
                    {selectedCategory.icon === 'fish' ? '🐟' :
                     selectedCategory.icon === 'shrimp' ? '🦐' :
                     selectedCategory.icon === 'crab' ? '🦀' :
                     selectedCategory.icon === 'squid' ? '🦑' :
                     selectedCategory.icon === 'chicken' ? '🐔' :
                     selectedCategory.icon === 'meat' ? '🥩' :
                     selectedCategory.icon === 'egg' ? '🥚' :
                     selectedCategory.icon === 'spices' ? '🌶️' :
                     '📦'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{selectedCategory.name}</h3>
                <p className="text-gray-600">{selectedCategory.nameTa}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedCategory.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {selectedCategory.isActive ? 'Visible' : 'Hidden'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900">{selectedCategory.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
                  <p className="text-gray-900">{selectedCategory.productCount} products using this category</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-gray-900">{new Date(selectedCategory.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-900">{new Date(selectedCategory.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCategory(null);
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
                Edit Category
              </Button>
              <Button 
                variant="secondary"
                onClick={() => handleViewHistory(selectedCategory)}
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
          setSelectedCategory(null);
        }}
        title="Category Change History"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900">Change History</h4>
              <p className="text-sm text-blue-700">
                Track all changes made to categories and their impact on products
              </p>
            </div>
          </div>
          
          {/* Mock history data */}
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Category Reordered</p>
                  <p className="text-sm text-gray-600">Category order changed from position 3 to 1</p>
                  <p className="text-xs text-gray-500">by Admin User</p>
                </div>
                <span className="text-xs text-gray-500">2026-01-17 02:30 PM</span>
              </div>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Category Updated</p>
                  <p className="text-sm text-gray-600">Description and image updated</p>
                  <p className="text-xs text-gray-500">by {selectedCategory?.name} Manager</p>
                </div>
                <span className="text-xs text-gray-500">2026-01-15 10:15 AM</span>
              </div>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Category Created</p>
                  <p className="text-sm text-gray-600">Initial category setup with all details</p>
                  <p className="text-xs text-gray-500">by System Admin</p>
                </div>
                <span className="text-xs text-gray-500">2026-01-01 09:00 AM</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button 
              variant="secondary"
              onClick={() => {
                setShowHistoryModal(false);
                setSelectedCategory(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
        </div>
      </div>
    </div>
  );
}
