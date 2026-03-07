import { useState } from 'react';
import { Modal, Input, Button, Card, Badge } from '../../components/ui';
import { CuttingTypesList } from '../../components/features/products';
import { useAuth } from '../../context/AuthContext';
import { Scissors, Plus, Fish, ChefHat, Building2, Store } from 'lucide-react';
import type { CuttingType } from '../../types';

const mockCuttingTypes: CuttingType[] = [
  // Hub Types (Fish Only)
  { 
    id: '1', 
    name: 'Whole Fish', 
    description: 'Complete fish without cutting - perfect for grilling', 
    category: 'fish', 
    moduleType: 'hub', 
    method: '1. Rinse fish under cold running water\n2. Remove scales using fish scaler\n3. Make incision from vent to gills\n4. Remove all internal organs\n5. Rinse cavity thoroughly\n6. Pat dry with paper towels',
    imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '2', 
    name: 'Fish Fillet', 
    description: 'Boneless fish pieces - ideal for pan-frying', 
    category: 'fish', 
    moduleType: 'hub', 
    method: '1. Place cleaned fish on cutting board\n2. Insert knife behind gills\n3. Cut along backbone toward tail\n4. Remove fillet in one piece\n5. Remove pin bones with tweezers',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '3', 
    name: 'Fish Steaks', 
    description: 'Cross-cut fish pieces with bone - great for curries', 
    category: 'fish', 
    moduleType: 'hub', 
    method: '1. Clean and scale the fish\n2. Cut perpendicular to backbone\n3. Make 1-2 inch thick steaks\n4. Remove any loose scales\n5. Wash and pat dry',
    imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '4', 
    name: 'Fish Curry Cut', 
    description: 'Small pieces with bone - traditional curry style', 
    category: 'fish', 
    moduleType: 'hub', 
    method: '1. Clean fish thoroughly\n2. Cut into 2-3 inch pieces\n3. Include backbone pieces\n4. Ensure uniform size\n5. Wash pieces well',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '5', 
    name: 'Fish Fingers', 
    description: 'Boneless strips - perfect for frying', 
    category: 'fish', 
    moduleType: 'hub', 
    method: '1. Start with fish fillets\n2. Cut into finger-sized strips\n3. Remove any remaining bones\n4. Ensure uniform thickness\n5. Pat dry before cooking',
    imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },

  // Store Types (Fish + Chicken + Mutton + Other)
  { 
    id: '6', 
    name: 'Whole Chicken', 
    description: 'Complete chicken ready for roasting', 
    category: 'chicken', 
    moduleType: 'store', 
    method: '1. Remove from packaging\n2. Remove giblets from cavity\n3. Rinse with cold water\n4. Pat dry thoroughly\n5. Trim excess fat\n6. Ready for seasoning',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '7', 
    name: 'Chicken Curry Cut', 
    description: 'Traditional bone-in pieces for curries', 
    category: 'chicken', 
    moduleType: 'store', 
    method: '1. Cut through skin between leg and body\n2. Remove legs and thighs\n3. Cut wings at joints\n4. Cut breast into pieces\n5. Wash all pieces thoroughly',
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '8', 
    name: 'Chicken Boneless', 
    description: 'Boneless chicken pieces - versatile cooking', 
    category: 'chicken', 
    moduleType: 'store', 
    method: '1. Remove skin if desired\n2. Debone breast and thigh meat\n3. Cut into uniform pieces\n4. Remove any cartilage\n5. Trim excess fat',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '9', 
    name: 'Mutton Curry Cut', 
    description: 'Bone-in mutton pieces for traditional curries', 
    category: 'mutton', 
    moduleType: 'store', 
    method: '1. Cut along natural muscle lines\n2. Include bone for flavor\n3. Make 2-3 inch pieces\n4. Trim excess fat\n5. Wash thoroughly',
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '10', 
    name: 'Mutton Boneless', 
    description: 'Boneless mutton pieces - quick cooking', 
    category: 'mutton', 
    moduleType: 'store', 
    method: '1. Remove all bones carefully\n2. Cut into uniform cubes\n3. Trim silver skin\n4. Remove excess fat\n5. Cut against grain',
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '11', 
    name: 'Prawns Cleaned', 
    description: 'Deveined prawns ready to cook', 
    category: 'other', 
    moduleType: 'store', 
    method: '1. Remove head and shell\n2. Make shallow cut along back\n3. Remove dark vein\n4. Rinse under cold water\n5. Pat dry gently',
    imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '12', 
    name: 'Crab Cleaned', 
    description: 'Fresh crab cleaned and ready', 
    category: 'other', 
    moduleType: 'store', 
    method: '1. Remove top shell\n2. Clean out gills\n3. Remove intestinal tract\n4. Crack claws slightly\n5. Rinse thoroughly',
    imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
];

export function CuttingTypePage() {
  const { user } = useAuth();
  const [cuttingTypes, setCuttingTypes] = useState<CuttingType[]>(mockCuttingTypes);
  
  // Set default active tab based on user type
  const getDefaultTab = () => {
    if (user?.loginType === 'hub') return 'hub';
    if (user?.loginType === 'store') return 'store';
    return 'hub'; // Default for super admin
  };
  
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>(getDefaultTab());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<CuttingType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'fish' as 'fish' | 'chicken' | 'mutton' | 'other',
    method: '',
    imageFile: null as File | null,
    imageUrl: '',
  });

  // Filter cutting types based on user role and active tab
  const getFilteredTypes = () => {
    if (user?.loginType === 'super_admin') {
      return cuttingTypes;
    } else if (user?.loginType === 'hub') {
      return cuttingTypes.filter(type => type.moduleType === 'hub');
    } else if (user?.loginType === 'store') {
      return cuttingTypes.filter(type => type.moduleType === 'store');
    }
    return [];
  };

  const filteredCuttingTypes = getFilteredTypes();
  const hubTypes = filteredCuttingTypes.filter(type => type.moduleType === 'hub');
  const storeTypes = filteredCuttingTypes.filter(type => type.moduleType === 'store');

  // Determine which tabs to show based on user type
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'hub', label: 'Hub Types', icon: Building2, count: hubTypes.length, description: 'Fish Cutting Types' },
      { id: 'store', label: 'Store Types', icon: Store, count: storeTypes.length, description: 'Meat & Poultry Types' },
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

  const getCurrentTypes = () => {
    if (user?.loginType === 'super_admin') {
      return activeTab === 'hub' ? hubTypes : storeTypes;
    }
    return filteredCuttingTypes;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newType: CuttingType = {
      id: editingType?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      method: formData.method,
      imageUrl: formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.imageUrl,
      moduleType: user?.loginType === 'hub' ? 'hub' : user?.loginType === 'store' ? 'store' : (formData.category === 'fish' ? 'hub' : 'store'),
      isActive: true,
      createdBy: user?.name || 'admin',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (editingType) {
      setCuttingTypes(prev => prev.map(type => type.id === editingType.id ? newType : type));
    } else {
      setCuttingTypes(prev => [...prev, newType]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setEditingType(null);
    setFormData({ 
      name: '', 
      description: '', 
      category: user?.loginType === 'hub' ? 'fish' : 'chicken', 
      method: '', 
      imageFile: null, 
      imageUrl: '' 
    });
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

  const handleDelete = (type: CuttingType) => {
    if (confirm('Are you sure you want to delete this cutting type?')) {
      setCuttingTypes(prev => prev.filter(t => t.id !== type.id));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload
      console.log('Image selected:', file.name);
    }
  };

  // Bulk actions handler for cutting types
  const handleCuttingTypeBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      switch (actionId) {
        case 'activate':
          console.log(`Activating ${selectedIds.length} cutting types:`, selectedIds);
          setCuttingTypes(prev => prev.map(type => 
            selectedIds.includes(type.id) ? { ...type, isActive: true } : type
          ));
          break;
        case 'deactivate':
          console.log(`Deactivating ${selectedIds.length} cutting types:`, selectedIds);
          setCuttingTypes(prev => prev.map(type => 
            selectedIds.includes(type.id) ? { ...type, isActive: false } : type
          ));
          break;
        case 'delete':
          console.log(`Deleting ${selectedIds.length} cutting types:`, selectedIds);
          setCuttingTypes(prev => prev.filter(type => !selectedIds.includes(type.id)));
          break;
        default:
          console.log(`Bulk action ${actionId} performed on ${selectedIds.length} cutting types`, data);
      }
    } catch (error) {
      console.error('Cutting type bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    }
  };

  const getStats = () => {
    const currentTypes = getCurrentTypes();
    return {
      total: currentTypes.length,
      active: currentTypes.filter(type => type.isActive).length,
      inactive: currentTypes.filter(type => !type.isActive).length,
      fish: currentTypes.filter(type => type.category === 'fish').length,
      chicken: currentTypes.filter(type => type.category === 'chicken').length,
      mutton: currentTypes.filter(type => type.category === 'mutton').length,
      other: currentTypes.filter(type => type.category === 'other').length,
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
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
                    : 'Manage all cutting and preparation methods'
                  }
                </p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)} 
                className="w-full sm:w-auto flex-shrink-0 px-4 py-2 sm:px-6 sm:py-3"
              >
                <Plus className="mr-2 h-5 w-5" />
                <span className="hidden sm:inline">Add Cutting Type</span>
                <span className="sm:hidden">Add Type</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Total Types</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </p>
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
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mt-1">
                    {stats.active}
                  </p>
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
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mt-1">
                    {stats.fish}
                  </p>
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
                    <span className="text-xs text-gray-500 hidden sm:block">{tab.description}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Cutting Types List */}
          <Card className="overflow-hidden">
            <CuttingTypesList
              cuttingTypes={getCurrentTypes()}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBulkAction={handleCuttingTypeBulkAction}
              title={user?.loginType === 'super_admin' 
                ? `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Cutting Types`
                : "Cutting Types"
              }
            />
          </Card>

          {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingType ? "Edit Cutting Type" : "Add New Cutting Type"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Fish Fillet"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the cutting type"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cutting Method</label>
            <textarea
              value={formData.method}
              onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
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
            {formData.imageUrl && (
              <div className="mt-2">
                <img src={formData.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded" />
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
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingType ? 'Update' : 'Add'} Cutting Type
            </Button>
          </div>
        </form>
      </Modal>
        </div>
      </div>
    </div>
  );
}
