import { useEffect, useState } from 'react';
import { Button, Modal, Badge, Card } from '../../components/ui';
import { CategoryForm, type CategoryFormData } from '../../components/categories/CategoryForm';
import { CategoryList, type Category } from '../../components/categories/CategoryList';
import { Plus, Package, History, Fish, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { categoriesApi } from '../../utils/api';

const DEFAULT_CATEGORY_IMAGE = 'https://placehold.co/600x400?text=Category';

const getPayloadList = <T,>(response: { data?: { data?: T[] } }): T[] =>
  Array.isArray(response.data?.data) ? response.data.data : [];

const getPayloadItem = <T,>(response: { data?: { data?: T } }): T | null =>
  response.data?.data ?? null;

function buildCategoryPayload(categoryData: CategoryFormData, selectedCategory: Category | null) {
  return {
    name: categoryData.name,
    nameTa: categoryData.nameTa,
    description: categoryData.description,
    icon: categoryData.icon,
    color: categoryData.color,
    isActive: categoryData.isActive,
    order: categoryData.order,
    type: categoryData.type,
    imageUrl:
      typeof categoryData.image === 'string'
        ? categoryData.image
        : (selectedCategory?.image as string | undefined) || DEFAULT_CATEGORY_IMAGE,
  };
}

export function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>('hub');

  useEffect(() => {
    void fetchCategories();
  }, [user?.loginType]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params =
        user?.loginType === 'super_admin' ? undefined : { moduleScope: user?.loginType || 'hub' };
      const response = await categoriesApi.getAll(params);
      setCategories(getPayloadList<Category>(response));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const hubCategories = categories
    .filter((category) => category.type === 'hub')
    .sort((left, right) => left.order - right.order);
  const storeCategories = categories
    .filter((category) => category.type === 'store')
    .sort((left, right) => left.order - right.order);
  const displayCategories = activeTab === 'hub' ? hubCategories : storeCategories;

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowAddModal(true);
  };

  const getInitialFormData = () => {
    if (selectedCategory) {
      return selectedCategory;
    }

    return { type: activeTab, order: displayCategories.length } as Partial<CategoryFormData>;
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
      alert(
        `Cannot delete category "${category.name}" because it has ${category.productCount} products. Please move or delete the products first.`
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await categoriesApi.delete(category.id);
      setCategories((prev) => prev.filter((item) => item.id !== category.id));
      alert('Category deleted successfully');
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (categoryData: CategoryFormData) => {
    try {
      setLoading(true);
      const payload = buildCategoryPayload(categoryData, selectedCategory);

      if (selectedCategory) {
        const response = await categoriesApi.update(selectedCategory.id, payload);
        const updatedCategory = getPayloadItem<Category>(response);
        if (updatedCategory) {
          setCategories((prev) =>
            prev.map((category) => (category.id === selectedCategory.id ? updatedCategory : category))
          );
        }
        alert('Category updated successfully! Changes will reflect across all Hub and Store interfaces.');
      } else {
        const response = await categoriesApi.create(payload);
        const createdCategory = getPayloadItem<Category>(response);
        if (createdCategory) {
          setCategories((prev) => [...prev, createdCategory]);
        }
        alert('Category created successfully! Changes will reflect across all Hub and Store interfaces.');
      }

      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedCategory(null);
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
      const categoryIds = reorderedCategories.map((category) => category.id);
      const response = await categoriesApi.reorder({ categoryIds });
      const syncedCategories = getPayloadList<Category>(response);

      if (syncedCategories.length > 0) {
        setCategories((prev) => {
          const untouched = prev.filter((category) => !categoryIds.includes(category.id));
          return [...untouched, ...syncedCategories].sort((left, right) => {
            if (left.type !== right.type) {
              return left.type.localeCompare(right.type);
            }

            return left.order - right.order;
          });
        });
      }
    } catch (error) {
      console.error('Failed to reorder categories:', error);
      alert('Failed to save category order. Please try again.');
      await fetchCategories();
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryBulkAction = async (actionId: string, selectedIds: string[]) => {
    try {
      setLoading(true);

      switch (actionId) {
        case 'show':
          await categoriesApi.bulkUpdate({ ids: selectedIds, updates: { isActive: true } });
          break;
        case 'hide':
          await categoriesApi.bulkUpdate({ ids: selectedIds, updates: { isActive: false } });
          break;
        case 'delete': {
          const categoriesToDelete = categories.filter((category) => selectedIds.includes(category.id));
          const categoriesWithProducts = categoriesToDelete.filter((category) => category.productCount > 0);

          if (categoriesWithProducts.length > 0) {
            alert(
              `Cannot delete ${categoriesWithProducts.length} categories because they have products. Please move or delete the products first.`
            );
            return;
          }

          await Promise.all(selectedIds.map((id) => categoriesApi.delete(id)));
          break;
        }
        default:
          break;
      }

      await fetchCategories();
    } catch (error) {
      console.error('Category bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalHub: hubCategories.length,
    totalStore: storeCategories.length,
    visibleHub: hubCategories.filter((category) => category.isActive).length,
    visibleStore: storeCategories.filter((category) => category.isActive).length,
    totalProducts: categories.reduce((sum, category) => sum + category.productCount, 0),
    activeDisplay: displayCategories.filter((category) => category.isActive).length,
  };

  const pageInfo =
    user?.loginType === 'hub'
      ? {
          title: 'Hub Category Management',
          description: 'Manage fish and seafood categories for hub operations',
        }
      : user?.loginType === 'store'
        ? {
            title: 'Store Category Management',
            description: 'Manage meat, eggs, and other categories for store operations',
          }
        : {
            title: 'Category Management',
            description: 'Manage categories for Hub (Fish) and Store (Meat, Eggs, etc.)',
          };

  const selectedHistoryCategory =
    selectedCategory || displayCategories[0] || hubCategories[0] || storeCategories[0] || null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-2 sm:py-4 md:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
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
                <p className="text-sm sm:text-base text-gray-600 mb-3">{pageInfo.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="bg-blue-100 text-blue-700" className="text-xs font-medium">
                    {displayCategories.length} Categories
                  </Badge>
                  <Badge variant="bg-green-100 text-green-700" className="text-xs font-medium">
                    {stats.activeDisplay} Active
                  </Badge>
                  {user?.loginType === 'super_admin' && (
                    <Badge variant="bg-purple-100 text-purple-700" className="text-xs font-medium">
                      {activeTab === 'hub' ? 'Hub View' : 'Store View'}
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
                  History
                </Button>
                <Button onClick={handleAddCategory} disabled={loading} className="w-full sm:w-auto px-4 py-2">
                  <Plus className="mr-2 h-4 w-4" />
                  {user?.loginType === 'super_admin'
                    ? activeTab === 'hub'
                      ? 'Add Hub Category'
                      : 'Add Store Category'
                    : 'Add Category'}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hub Categories</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalHub}</p>
                </div>
                <Fish className="h-6 w-6 text-blue-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Store Categories</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.totalStore}</p>
                </div>
                <ShoppingBag className="h-6 w-6 text-emerald-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Visible in Current View</p>
                  <p className="text-2xl font-bold text-violet-600">{stats.activeDisplay}</p>
                </div>
                <History className="h-6 w-6 text-violet-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mapped Products</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalProducts}</p>
                </div>
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </Card>
          </div>

          {user?.loginType === 'super_admin' && (
            <Card className="p-4 sm:p-6">
              <div className="flex gap-2 border-b overflow-x-auto pb-4">
                {(['hub', 'store'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    } rounded-t-lg`}
                  >
                    {tab === 'hub' ? 'Hub Categories' : 'Store Categories'}
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card className="overflow-hidden">
            <CategoryList
              categories={displayCategories}
              onView={handleViewCategory}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              onReorder={handleReorderCategories}
              onBulkAction={handleCategoryBulkAction}
              title={activeTab === 'hub' ? 'Hub Categories' : 'Store Categories'}
            />
          </Card>
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Category" size="xl">
        <CategoryForm initialData={getInitialFormData()} onSave={handleSaveCategory} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Category" size="xl">
        <CategoryForm
          initialData={getInitialFormData()}
          onSave={handleSaveCategory}
          onCancel={() => setShowEditModal(false)}
          isEdit
        />
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Category Details" size="lg">
        {selectedCategory && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={(selectedCategory.image as string | undefined) || DEFAULT_CATEGORY_IMAGE}
                alt={selectedCategory.name}
                className="w-24 h-24 rounded-lg object-cover border"
              />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">{selectedCategory.name}</h3>
                <p className="text-gray-600">{selectedCategory.nameTa}</p>
                <div className="flex gap-2">
                  <Badge variant="bg-blue-100 text-blue-700">{selectedCategory.type}</Badge>
                  <Badge
                    variant={
                      selectedCategory.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }
                  >
                    {selectedCategory.isActive ? 'Active' : 'Hidden'}
                  </Badge>
                </div>
              </div>
            </div>
            <Card className="p-4 space-y-2">
              <p className="text-sm text-gray-600">{selectedCategory.description}</p>
              <p className="text-sm text-gray-600">Products mapped: {selectedCategory.productCount}</p>
              <p className="text-sm text-gray-600">Display order: {selectedCategory.order}</p>
              <p className="text-sm text-gray-600">Created: {selectedCategory.createdAt}</p>
              <p className="text-sm text-gray-600">Updated: {selectedCategory.updatedAt}</p>
            </Card>
          </div>
        )}
      </Modal>

      <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title="Category History" size="lg">
        <div className="space-y-4">
          <Card className="p-4">
            <p className="text-sm text-gray-700">
              S07 now reads category state from the backend. Detailed audit history is scheduled under S20, so this
              screen currently exposes live timestamps from the category master record.
            </p>
          </Card>
          {selectedHistoryCategory ? (
            <Card className="p-4 space-y-2">
              <p className="text-sm text-gray-600">Category: {selectedHistoryCategory.name}</p>
              <p className="text-sm text-gray-600">Created: {selectedHistoryCategory.createdAt}</p>
              <p className="text-sm text-gray-600">Updated: {selectedHistoryCategory.updatedAt}</p>
              <p className="text-sm text-gray-600">Products mapped: {selectedHistoryCategory.productCount}</p>
            </Card>
          ) : (
            <Card className="p-4">
              <p className="text-sm text-gray-600">No category records available yet.</p>
            </Card>
          )}
        </div>
      </Modal>
    </div>
  );
}
