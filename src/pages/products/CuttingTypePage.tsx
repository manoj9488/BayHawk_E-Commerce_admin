import { useEffect, useState } from 'react';
import { Modal, Input, Button, Card, Badge } from '../../components/ui';
import { CuttingTypesList } from '../../components/features/products';
import { useAuth } from '../../context/AuthContext';
import { Scissors, Plus, Fish, ChefHat, Building2, Store } from 'lucide-react';
import type { CuttingType } from '../../types';
import { cuttingTypesApi } from '../../utils/api';

const DEFAULT_CUTTING_IMAGE = 'https://placehold.co/600x400?text=Cutting+Type';

const getPayloadList = <T,>(response: { data?: { data?: T[] } }): T[] =>
  Array.isArray(response.data?.data) ? response.data.data : [];

const getPayloadItem = <T,>(response: { data?: { data?: T } }): T | null =>
  response.data?.data ?? null;

export function CuttingTypePage() {
  const { user } = useAuth();
  const [cuttingTypes, setCuttingTypes] = useState<CuttingType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<CuttingType | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'fish' as 'fish' | 'chicken' | 'mutton' | 'other',
    method: '',
    imageFile: null as File | null,
    imageUrl: '',
  });

  const getDefaultTab = () => {
    if (user?.loginType === 'hub') return 'hub';
    if (user?.loginType === 'store') return 'store';
    return 'hub';
  };

  const [activeTab, setActiveTab] = useState<'hub' | 'store'>(getDefaultTab());

  useEffect(() => {
    setActiveTab(getDefaultTab());
    void fetchCuttingTypes();
  }, [user?.loginType]);

  const fetchCuttingTypes = async () => {
    try {
      setLoading(true);
      const params =
        user?.loginType === 'super_admin' ? undefined : { moduleType: user?.loginType || 'hub' };
      const response = await cuttingTypesApi.getAll(params);
      setCuttingTypes(getPayloadList<CuttingType>(response));
    } catch (error) {
      console.error('Failed to fetch cutting types:', error);
      setCuttingTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTypes = () => {
    if (user?.loginType === 'hub') {
      return cuttingTypes.filter((type) => type.moduleType === 'hub');
    }

    if (user?.loginType === 'store') {
      return cuttingTypes.filter((type) => type.moduleType === 'store');
    }

    return cuttingTypes;
  };

  const filteredCuttingTypes = getFilteredTypes();
  const hubTypes = filteredCuttingTypes.filter((type) => type.moduleType === 'hub');
  const storeTypes = filteredCuttingTypes.filter((type) => type.moduleType === 'store');

  const tabs = [
    { id: 'hub', label: 'Hub Types', icon: Building2, count: hubTypes.length, description: 'Fish Cutting Types' },
    { id: 'store', label: 'Store Types', icon: Store, count: storeTypes.length, description: 'Meat & Poultry Types' },
  ].filter((tab) => {
    if (user?.loginType === 'hub') return tab.id === 'hub';
    if (user?.loginType === 'store') return tab.id === 'store';
    return true;
  });

  const getCurrentTypes = () => {
    if (user?.loginType === 'super_admin') {
      return activeTab === 'hub' ? hubTypes : storeTypes;
    }

    return filteredCuttingTypes;
  };

  const resetForm = () => {
    setEditingType(null);
    setFormData({
      name: '',
      description: '',
      category: user?.loginType === 'hub' ? 'fish' : 'chicken',
      method: '',
      imageFile: null,
      imageUrl: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      method: formData.method,
      imageUrl: formData.imageUrl || editingType?.imageUrl || DEFAULT_CUTTING_IMAGE,
      moduleType:
        user?.loginType === 'hub'
          ? 'hub'
          : user?.loginType === 'store'
            ? 'store'
            : formData.category === 'fish'
              ? 'hub'
              : 'store',
      isActive: editingType?.isActive ?? true,
      createdBy: user?.name || 'admin',
    };

    try {
      setLoading(true);

      if (editingType) {
        const response = await cuttingTypesApi.update(editingType.id, payload);
        const updatedType = getPayloadItem<CuttingType>(response);
        if (updatedType) {
          setCuttingTypes((prev) =>
            prev.map((type) => (type.id === editingType.id ? updatedType : type))
          );
        }
      } else {
        const response = await cuttingTypesApi.create(payload);
        const createdType = getPayloadItem<CuttingType>(response);
        if (createdType) {
          setCuttingTypes((prev) => [...prev, createdType]);
        }
      }

      resetForm();
      setIsModalOpen(false);
      await fetchCuttingTypes();
    } catch (error) {
      console.error('Failed to save cutting type:', error);
      alert('Failed to save cutting type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type: CuttingType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description,
      category: type.category,
      method: type.method,
      imageFile: null,
      imageUrl: type.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (type: CuttingType) => {
    if (!confirm('Are you sure you want to delete this cutting type?')) {
      return;
    }

    try {
      setLoading(true);
      await cuttingTypesApi.delete(type.id);
      setCuttingTypes((prev) => prev.filter((item) => item.id !== type.id));
    } catch (error) {
      console.error('Failed to delete cutting type:', error);
      alert('Failed to delete cutting type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: result || prev.imageUrl || DEFAULT_CUTTING_IMAGE,
      }));
    };
    reader.onerror = () => {
      alert('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleCuttingTypeBulkAction = async (actionId: string, selectedIds: string[]) => {
    try {
      setLoading(true);

      switch (actionId) {
        case 'activate':
          await cuttingTypesApi.bulkUpdate({ ids: selectedIds, updates: { isActive: true } });
          break;
        case 'deactivate':
          await cuttingTypesApi.bulkUpdate({ ids: selectedIds, updates: { isActive: false } });
          break;
        case 'delete':
          await Promise.all(selectedIds.map((id) => cuttingTypesApi.delete(id)));
          break;
        default:
          break;
      }

      await fetchCuttingTypes();
    } catch (error) {
      console.error('Cutting type bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentTypes = getCurrentTypes();
  const stats = {
    total: currentTypes.length,
    active: currentTypes.filter((type) => type.isActive).length,
    fish: currentTypes.filter((type) => type.category === 'fish').length,
    chicken: currentTypes.filter((type) => type.category === 'chicken').length,
    mutton: currentTypes.filter((type) => type.category === 'mutton').length,
    other: currentTypes.filter((type) => type.category === 'other').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  Cutting Types Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  {user?.loginType === 'hub'
                    ? 'Manage fish cutting and preparation methods'
                    : user?.loginType === 'store'
                      ? 'Manage meat and poultry cutting methods'
                      : 'Manage all cutting and preparation methods'}
                </p>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={loading}
                className="w-full sm:w-auto flex-shrink-0 px-4 py-2 sm:px-6 sm:py-3"
              >
                <Plus className="mr-2 h-5 w-5" />
                <span className="hidden sm:inline">Add Cutting Type</span>
                <span className="sm:hidden">Add Type</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Total Types</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">All cutting types</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Scissors className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Active</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
                  <p className="text-xs text-gray-500 mt-1">Currently active</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                  <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Fish Types</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mt-1">{stats.fish}</p>
                  <p className="text-xs text-gray-500 mt-1">Fish cutting methods</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Fish className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Meat Types</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 mt-1">
                    {stats.chicken + stats.mutton + stats.other}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Meat cutting methods</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-100 rounded-lg flex-shrink-0">
                  <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          {tabs.length > 1 && (
            <Card className="p-4 sm:p-6">
              <div className="flex gap-1 sm:gap-2 border-b overflow-x-auto pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'hub' | 'store')}
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
                    <span className="text-xs text-gray-500 hidden sm:block">{tab.description}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card className="overflow-hidden">
            <CuttingTypesList
              cuttingTypes={currentTypes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBulkAction={handleCuttingTypeBulkAction}
              title={
                user?.loginType === 'super_admin'
                  ? `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Cutting Types`
                  : 'Cutting Types'
              }
            />
          </Card>

          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              resetForm();
            }}
            title={editingType ? 'Edit Cutting Type' : 'Add New Cutting Type'}
            size="lg"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Fish Fillet"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as 'fish' | 'chicken' | 'mutton' | 'other',
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="fish">Fish</option>
                    <option value="chicken">Chicken</option>
                    <option value="mutton">Mutton</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the cutting type"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cutting Method</label>
                <textarea
                  value={formData.method}
                  onChange={(e) => setFormData((prev) => ({ ...prev, method: e.target.value }))}
                  placeholder="Step-by-step cutting instructions..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Media uploads are finalized in the later Cloudinary step. This step stores the cutting type master
                  record and uses the saved image URL or a placeholder.
                </p>
                {(formData.imageUrl || editingType?.imageUrl) && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl || editingType?.imageUrl || DEFAULT_CUTTING_IMAGE}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Saving...' : editingType ? 'Update' : 'Add'} Cutting Type
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
