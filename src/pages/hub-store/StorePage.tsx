import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
} from '../../components/ui';
import { Plus, Search, Eye, Edit, Trash2, Store, Package, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StoreForm } from '../../components/features/stores/StoreForm';
import { StoreDetails } from '../../components/features/stores/StoreDetails';
import { ConfirmDialog, PageHeader, FormModal } from '../../components/common';
import { getStatusColor } from '../../utils/helpers';
import type { StoreInput } from '../../utils/validations';
import type { Store as StoreType } from '../../types';
import { storesApi } from '../../utils/api';

// ... (rest of the components like StoreStats, StoreRow remain the same)

interface StoreStatsProps {
  stores: StoreType[];
}

function StoreStats({ stores }: StoreStatsProps) {
  const activeStores = stores.filter(store => store.isActive).length;
  const totalCapacity = stores.reduce((sum, store) => sum + store.capacity.storage, 0);
  const totalStaff = stores.reduce((sum, store) => sum + store.capacity.staff, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
            <Store className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Total Stores</p>
            <p className="text-lg sm:text-xl font-bold">{stores.length}</p>
          </div>
        </div>
      </Card>
      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Active Stores</p>
            <p className="text-lg sm:text-xl font-bold">{activeStores}</p>
          </div>
        </div>
      </Card>
      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Total Staff</p>
            <p className="text-lg sm:text-xl font-bold">{totalStaff}</p>
          </div>
        </div>
      </Card>
      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Total Capacity</p>
            <p className="text-lg sm:text-xl font-bold">{totalCapacity.toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StoreRow({ store, onView, onEdit, onDelete }: { store: StoreType; onView: () => void; onEdit: () => void; onDelete: () => void; }) {
  const getStoreTypeColor = (type: string) => {
    switch (type) {
      case 'retail': return 'bg-green-100 text-green-800';
      case 'warehouse': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getStoreTypeIcon = (type: string) => {
    switch (type) {
      case 'retail': return '🏪';
      case 'warehouse': return '🏭';
      default: return '🏢';
    }
  };
  return (
    <div className="flex items-center p-4 border-b hover:bg-gray-50">
      <div className="flex-1 min-w-0"><p className="font-semibold truncate">{store.name}</p><p className="text-sm text-gray-500 font-mono">{store.code}</p></div>
      <div className="w-40 text-center"><Badge className={`${getStoreTypeColor(store.storeType)} capitalize`}>{getStoreTypeIcon(store.storeType)} {store.storeType.replace('_', ' ')}</Badge></div>
      <div className="flex-1 min-w-0"><p className="text-sm truncate">{store.address.city}, {store.address.state}</p></div>
      <div className="w-28 text-center"><Badge variant={getStatusColor(store.isActive ? 'active' : 'inactive')}>{store.isActive ? 'Active' : 'Inactive'}</Badge></div>
      <div className="flex items-center justify-end gap-2 w-32">
        <Button variant="ghost" size="sm" onClick={onView}><Eye className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

export function StorePage() {
  const { user } = useAuth();
  const [stores, setStores] = useState<StoreType[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreType | undefined>();

  useEffect(() => {
    let cancelled = false;

    const loadStores = async () => {
      try {
        const response = await storesApi.getAll();
        const storesData = response?.data?.data;

        if (!cancelled && Array.isArray(storesData)) {
          setStores(storesData);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load stores.', error);
          setStores([]);
        }
      }
    };

    void loadStores();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredStores = stores.filter(store => 
    (store.name.toLowerCase().includes(search.toLowerCase()) || store.code.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || (statusFilter === 'active' ? store.isActive : !store.isActive)) &&
    (!typeFilter || store.storeType === typeFilter)
  );

  const handleSaveStore = async (data: StoreInput) => {
    if (selectedStore) {
      try {
        const response = await storesApi.update(selectedStore.id, data);
        const updatedStore = response?.data?.data;

        setStores(prev => prev.map(s => (
          s.id === selectedStore.id
            ? (updatedStore as StoreType) || { ...s, ...data, id: s.id }
            : s
        )));
      } catch (error) {
        console.error('Failed to update store', error);
      }
    } else {
      try {
        const response = await storesApi.create(data);
        const createdStore = response?.data?.data;

        if (createdStore) {
          setStores(prev => [...prev, createdStore as StoreType]);
        }
      } catch (error) {
        console.error('Failed to create store', error);
      }
    }

    setIsFormOpen(false);
    setSelectedStore(undefined);
  };

  const handleEdit = (store: StoreType) => {
    setSelectedStore(store);
    setIsFormOpen(true);
  };

  const handleView = (store: StoreType) => {
    setSelectedStore(store);
    setIsViewOpen(true);
  };

  const handleDelete = (store: StoreType) => {
    setSelectedStore(store);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedStore) {
      try {
        await storesApi.delete(selectedStore.id);
        setStores(prev => prev.filter(store => store.id !== selectedStore.id));
      } catch (error) {
        console.error('Failed to delete store', error);
      }
    }

    setIsConfirmOpen(false);
    setSelectedStore(undefined);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <PageHeader 
        title="Store Management"
        description="Manage retail stores, warehouses, and pickup points"
        actions={
          <Button onClick={() => { setSelectedStore(undefined); setIsFormOpen(true); }} className="w-full sm:w-auto text-sm">
            <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Add Store
          </Button>
        }
      />

      <StoreStats stores={stores} />

      <Card className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search stores by name or code..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 sm:pl-10 text-sm" />
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={[{ value: '', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} className="flex-1 sm:flex-none text-sm" />
            <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} options={[{ value: '', label: 'All Types' }, { value: 'retail', label: 'Retail Store' }, { value: 'warehouse', label: 'Warehouse' }]} className="flex-1 sm:flex-none text-sm" />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredStores.length > 0 ? (
          <>
            {/* Desktop Table Header - Hidden on mobile */}
            <Card className="hidden lg:block">
              <div className="flex items-center p-4 border-b bg-gray-50 rounded-t-lg font-semibold text-sm text-gray-600">
                <div className="flex-1 min-w-0">Store</div>
                <div className="w-40 text-center">Type</div>
                <div className="flex-1 min-w-0">Location</div>
                <div className="w-28 text-center">Status</div>
                <div className="w-32 text-right">Actions</div>
              </div>
              <div>
                {filteredStores.map(store => (
                  <StoreRow key={store.id} store={store} onView={() => handleView(store)} onEdit={() => handleEdit(store)} onDelete={() => handleDelete(store)} />
                ))}
              </div>
            </Card>

            {/* Mobile Card Layout */}
            <div className="lg:hidden space-y-4">
              {filteredStores.map(store => (
                <Card key={store.id} className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{store.name}</h3>
                        <p className="text-sm text-gray-500 font-mono">{store.code}</p>
                      </div>
                      <Badge variant={getStatusColor(store.isActive ? 'active' : 'inactive')}>
                        {store.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <Badge className={`${store.storeType === 'retail' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} capitalize`}>
                          {store.storeType === 'retail' ? '🏪' : '🏭'} {store.storeType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Manager:</span>
                        <span className="text-gray-800">{store.contactInfo.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-800">{store.address.city}, {store.address.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="text-gray-800">{store.capacity.storage.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleView(store)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleEdit(store)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Store"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(store)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Store"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-8 sm:p-12 text-center">
            <Store className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No stores found</h3>
            <p className="text-sm sm:text-base text-gray-500">Your search criteria did not match any stores.</p>
          </Card>
        )}
      </div>

      <FormModal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setSelectedStore(undefined); }} title={selectedStore ? 'Edit Store' : 'Add New Store'} size="2xl">
        <StoreForm onSubmit={handleSaveStore} onCancel={() => { setIsFormOpen(false); setSelectedStore(undefined); }} initialData={selectedStore} />
      </FormModal>

      {selectedStore && (
        <FormModal isOpen={isViewOpen} onClose={() => { setIsViewOpen(false); setSelectedStore(undefined); }} title="Store Details" size="2xl">
          <div className="p-2"><StoreDetails store={selectedStore} /></div>
        </FormModal>
      )}

      {selectedStore && (
        <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Store" message={`Are you sure you want to delete "${selectedStore.name}"?`} />
      )}
    </div>
  );
}
