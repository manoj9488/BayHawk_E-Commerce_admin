import { useState } from 'react';
import { Card, Button, Input, Select, Modal, Badge } from '../../components/ui';
import { Plus, Search, Edit, Trash2, Save, X, Users, Package, Truck, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CustomRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  moduleType: 'hub' | 'store' | 'both';
  permissions: string[];
  color: string;
  icon: string;
  isActive: boolean;
  usersCount: number;
}

const mockRoles: CustomRole[] = [
  {
    id: '1',
    name: 'procurement',
    displayName: 'Procurement Manager',
    description: 'Manages product sourcing and supplier relationships',
    moduleType: 'both',
    permissions: ['view_products', 'manage_suppliers', 'create_purchase_orders', 'view_inventory'],
    color: 'blue',
    icon: 'package',
    isActive: true,
    usersCount: 5
  },
  {
    id: '2',
    name: 'packing',
    displayName: 'Packing Supervisor',
    description: 'Oversees order packing and quality control',
    moduleType: 'both',
    permissions: ['view_orders', 'manage_packing', 'quality_control', 'update_order_status'],
    color: 'green',
    icon: 'package',
    isActive: true,
    usersCount: 8
  },
  {
    id: '3',
    name: 'delivery',
    displayName: 'Delivery Coordinator',
    description: 'Manages delivery operations and agent assignments',
    moduleType: 'both',
    permissions: ['view_orders', 'assign_delivery', 'track_deliveries', 'manage_agents'],
    color: 'purple',
    icon: 'truck',
    isActive: true,
    usersCount: 12
  },
  {
    id: '4',
    name: 'quality_control',
    displayName: 'Quality Controller',
    description: 'Ensures product quality and compliance standards',
    moduleType: 'hub',
    permissions: ['view_products', 'quality_inspection', 'reject_products', 'generate_reports'],
    color: 'orange',
    icon: 'shield',
    isActive: true,
    usersCount: 3
  }
];

const availablePermissions = [
  { id: 'view_products', label: 'View Products', category: 'Products' },
  { id: 'manage_products', label: 'Manage Products', category: 'Products' },
  { id: 'view_orders', label: 'View Orders', category: 'Orders' },
  { id: 'manage_orders', label: 'Manage Orders', category: 'Orders' },
  { id: 'view_inventory', label: 'View Inventory', category: 'Inventory' },
  { id: 'manage_inventory', label: 'Manage Inventory', category: 'Inventory' },
  { id: 'manage_suppliers', label: 'Manage Suppliers', category: 'Procurement' },
  { id: 'create_purchase_orders', label: 'Create Purchase Orders', category: 'Procurement' },
  { id: 'manage_packing', label: 'Manage Packing', category: 'Operations' },
  { id: 'quality_control', label: 'Quality Control', category: 'Operations' },
  { id: 'assign_delivery', label: 'Assign Delivery', category: 'Delivery' },
  { id: 'track_deliveries', label: 'Track Deliveries', category: 'Delivery' },
  { id: 'manage_agents', label: 'Manage Agents', category: 'Delivery' },
  { id: 'generate_reports', label: 'Generate Reports', category: 'Reports' },
  { id: 'view_analytics', label: 'View Analytics', category: 'Reports' }
];

export function CustomRolesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<CustomRole | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    displayName: '',
    description: '',
    moduleType: (user?.loginType === 'hub' ? 'hub' : user?.loginType === 'store' ? 'store' : 'both') as 'hub' | 'store' | 'both',
    permissions: [] as string[],
    color: 'blue',
    icon: 'users'
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'package': return Package;
      case 'truck': return Truck;
      case 'shield': return Shield;
      default: return Users;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRoles = mockRoles.filter(role => {
    const matchesSearch = role.displayName.toLowerCase().includes(search.toLowerCase()) ||
                         role.description.toLowerCase().includes(search.toLowerCase());
    const matchesModule = !moduleFilter || role.moduleType === moduleFilter || role.moduleType === 'both';
    
    // Filter based on user's login type
    let matchesUserAccess = true;
    if (user?.loginType === 'hub') {
      matchesUserAccess = role.moduleType === 'hub' || role.moduleType === 'both';
    } else if (user?.loginType === 'store') {
      matchesUserAccess = role.moduleType === 'store' || role.moduleType === 'both';
    }
    
    return matchesSearch && matchesModule && matchesUserAccess;
  });

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding role:', newRole);
    setShowAddModal(false);
    setNewRole({
      name: '',
      displayName: '',
      description: '',
      moduleType: 'both',
      permissions: [],
      color: 'blue',
      icon: 'users'
    });
  };

  const handleEditRole = (role: CustomRole) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      moduleType: role.moduleType,
      permissions: role.permissions,
      color: role.color,
      icon: role.icon
    });
    setShowAddModal(true);
  };

  const togglePermission = (permissionId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleDeleteRole = (role: CustomRole) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      if (roleToDelete.usersCount > 0) {
        alert(`Cannot delete role "${roleToDelete.displayName}" because it has ${roleToDelete.usersCount} assigned users. Please reassign or remove users first.`);
        setShowDeleteModal(false);
        setRoleToDelete(null);
        return;
      }
      
      console.log('Delete role:', roleToDelete.id);
      // Here you would typically make an API call to delete the role
      setShowDeleteModal(false);
      setRoleToDelete(null);
      alert(`Role "${roleToDelete.displayName}" has been deleted.`);
    }
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof availablePermissions>);

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">
            {user?.loginType === 'hub' ? 'Hub Custom Roles Management' : 
             user?.loginType === 'store' ? 'Store Custom Roles Management' : 
             'Custom Roles Management'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {user?.loginType === 'hub' ? 'Create and customize hub roles with specific permissions' : 
             user?.loginType === 'store' ? 'Create and customize store roles with specific permissions' : 
             'Create and customize roles with specific permissions'}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto flex-shrink-0">
          <Plus className="mr-2 h-5 w-5" /> 
          <span className="hidden sm:inline">Create Role</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Total Roles</p>
              <p className="text-lg sm:text-xl font-bold">{mockRoles.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Active Roles</p>
              <p className="text-xl font-bold">{mockRoles.filter(r => r.isActive).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hub Roles</p>
              <p className="text-xl font-bold">{mockRoles.filter(r => r.moduleType === 'hub' || r.moduleType === 'both').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Truck className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-xl font-bold">{mockRoles.reduce((sum, role) => sum + role.usersCount, 0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search roles..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10 text-sm" 
            />
          </div>
          <Select 
            value={moduleFilter} 
            onChange={e => setModuleFilter(e.target.value)} 
            options={[
              { value: '', label: 'All Modules' }, 
              ...(user?.loginType === 'super_admin' ? [
                { value: 'hub', label: 'Hub Only' }, 
                { value: 'store', label: 'Store Only' },
                { value: 'both', label: 'Both Modules' }
              ] : user?.loginType === 'hub' ? [
                { value: 'hub', label: 'Hub Only' },
                { value: 'both', label: 'Hub & Store' }
              ] : user?.loginType === 'store' ? [
                { value: 'store', label: 'Store Only' },
                { value: 'both', label: 'Hub & Store' }
              ] : [])
            ]} 
          />
        </div>
      </Card>

      {/* Roles List */}
      <div className="space-y-4">
        {filteredRoles.map(role => {
          const IconComponent = getIcon(role.icon);
          return (
            <Card key={role.id} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${getColorClass(role.color)}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{role.displayName}</h3>
                      <Badge variant={role.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="bg-blue-100 text-blue-800">
                        {role.moduleType === 'both' ? 'Hub & Store' : role.moduleType.charAt(0).toUpperCase() + role.moduleType.slice(1)}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{role.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Users:</span>
                        <span className="text-sm text-gray-600">{role.usersCount} assigned</span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-2">Permissions:</span>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 4).map(permission => {
                            const perm = availablePermissions.find(p => p.id === permission);
                            return (
                              <Badge key={permission} variant="bg-gray-100 text-gray-700 text-xs">
                                {perm?.label}
                              </Badge>
                            );
                          })}
                          {role.permissions.length > 4 && (
                            <Badge variant="bg-gray-100 text-gray-700 text-xs">
                              +{role.permissions.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditRole(role)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="Edit Role"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteRole(role)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                    title="Delete Role"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Role Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => {
          setShowAddModal(false);
          setEditingRole(null);
        }} 
        title={editingRole ? 'Edit Role' : 'Create New Role'}
        size="lg"
      >
        <form onSubmit={handleAddRole} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Role Name (Internal)" 
              placeholder="e.g., procurement_manager" 
              value={newRole.name}
              onChange={e => setNewRole({...newRole, name: e.target.value})}
              required 
            />
            <Input 
              label="Display Name" 
              placeholder="e.g., Procurement Manager" 
              value={newRole.displayName}
              onChange={e => setNewRole({...newRole, displayName: e.target.value})}
              required 
            />
          </div>
          
          <Input 
            label="Description" 
            placeholder="Brief description of the role responsibilities" 
            value={newRole.description}
            onChange={e => setNewRole({...newRole, description: e.target.value})}
            required 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select 
              label="Module Type" 
              value={newRole.moduleType}
              onChange={e => setNewRole({...newRole, moduleType: e.target.value as 'hub' | 'store' | 'both'})}
              options={[
                ...(user?.loginType === 'super_admin' ? [
                  { value: 'both', label: 'Hub & Store' },
                  { value: 'hub', label: 'Hub Only' }, 
                  { value: 'store', label: 'Store Only' }
                ] : user?.loginType === 'hub' ? [
                  { value: 'hub', label: 'Hub Only' },
                  { value: 'both', label: 'Hub & Store' }
                ] : user?.loginType === 'store' ? [
                  { value: 'store', label: 'Store Only' },
                  { value: 'both', label: 'Hub & Store' }
                ] : [])
              ]} 
              required
            />
            <Select 
              label="Color Theme" 
              value={newRole.color}
              onChange={e => setNewRole({...newRole, color: e.target.value})}
              options={[
                { value: 'blue', label: 'Blue' },
                { value: 'green', label: 'Green' },
                { value: 'purple', label: 'Purple' },
                { value: 'orange', label: 'Orange' },
                { value: 'red', label: 'Red' }
              ]} 
            />
            <Select 
              label="Icon" 
              value={newRole.icon}
              onChange={e => setNewRole({...newRole, icon: e.target.value})}
              options={[
                { value: 'users', label: 'Users' },
                { value: 'package', label: 'Package' },
                { value: 'truck', label: 'Truck' },
                { value: 'shield', label: 'Shield' }
              ]} 
            />
          </div>

          {/* Permissions */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Permissions</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category}>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {permissions.map(permission => (
                      <label key={permission.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newRole.permissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => {
                setShowAddModal(false);
                setEditingRole(null);
              }} 
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="mr-2 h-5 w-5" /> {editingRole ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => {
          setShowDeleteModal(false);
          setRoleToDelete(null);
        }} 
        title="Delete Role Confirmation"
        size="sm"
      >
        {roleToDelete && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              
              {roleToDelete.usersCount > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cannot Delete Role</h3>
                  <p className="text-gray-600 mb-4">
                    The role <strong>"{roleToDelete.displayName}"</strong> cannot be deleted because it has <strong>{roleToDelete.usersCount} assigned users</strong>.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Resolution:</strong> Please reassign or remove all users from this role before deleting it.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Role?</h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete the role <strong>"{roleToDelete.displayName}"</strong>? 
                    This action cannot be undone.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      <strong>Warning:</strong> Deleting this role will remove all associated permissions and configuration.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setRoleToDelete(null);
                }} 
                className="flex-1"
              >
                Cancel
              </Button>
              {roleToDelete.usersCount === 0 && (
                <Button 
                  onClick={confirmDeleteRole}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="mr-2 h-5 w-5" /> Delete Role
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
