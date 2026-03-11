import { useState } from 'react';
import { 
  SearchFilter, 
  BulkActions,
  BulkActionModal,
  useBulkSelection
} from '../../common';
import { Card, Table, Th, Td, Badge } from '../../ui';
import { Eye, Edit, Trash2, Users, Building2, Package, Shield, CheckSquare, Square, Minus } from 'lucide-react';
import type { TeamMember } from '../../../types';

interface TeamMembersListProps {
  members: TeamMember[];
  loading?: boolean;
  onView?: (member: TeamMember) => void;
  onEdit?: (member: TeamMember) => void;
  onDelete?: (member: TeamMember) => void;
  onRefresh?: () => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: Record<string, unknown>) => Promise<void>;
}

const teamBulkActions = [
  {
    id: 'activate',
    label: 'Activate Members',
    icon: Users,
    variant: 'success' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to activate the selected team members?'
  },
  {
    id: 'deactivate',
    label: 'Deactivate Members',
    icon: Users,
    variant: 'warning' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to deactivate the selected team members?'
  },
  {
    id: 'delete',
    label: 'Delete Members',
    icon: Trash2,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected team members? This action cannot be undone.'
  }
];

const getRoleIcon = (role: string) => {
  if (role.includes('admin')) return Shield;
  if (role.includes('procurement')) return Package;
  if (role.includes('packing')) return Package;
  if (role.includes('delivery')) return Users;
  return Users;
};

const getModuleIcon = (moduleType: string) => {
  return moduleType === 'hub' ? Building2 : Package;
};

export function TeamMembersList({ 
  members, 
  onView, 
  onEdit, 
  onDelete,
  onBulkAction
}: TeamMembersListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionId: string;
    actionType: string;
  }>({ isOpen: false, actionId: '', actionType: '' });

  // Filter members first
  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchValue || 
      member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      member.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      member.phone.includes(searchValue);
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && member.isActive) ||
      (statusFilter === 'inactive' && !member.isActive);
    
    const matchesRole = !roleFilter || member.role.includes(roleFilter);
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected
  } = useBulkSelection(filteredMembers);

  const isAllSelected = selectedItems.length === filteredMembers.length && filteredMembers.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < filteredMembers.length;

  const handleBulkActionClick = (actionId: string) => {
    const action = teamBulkActions.find(a => a.id === actionId);
    if (action?.requiresConfirmation) {
      setBulkActionModal({
        isOpen: true,
        actionId,
        actionType: action.variant || 'default'
      });
    } else {
      onBulkAction?.(actionId, selectedItems);
    }
  };

  const handleConfirmBulkAction = async (data?: Record<string, unknown>) => {
    if (onBulkAction) {
      await onBulkAction(bulkActionModal.actionId, selectedItems, data);
      deselectAll();
    }
    setBulkActionModal({ isOpen: false, actionId: '', actionType: '' });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search team members..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]
          },
          {
            key: 'role',
            label: 'Role',
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
              { value: '', label: 'All Roles' },
              { value: 'admin', label: 'Admin' },
              { value: 'procurement', label: 'Procurement' },
              { value: 'packing', label: 'Packing' },
              { value: 'delivery', label: 'Delivery' }
            ]
          }
        ]}
      />

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          totalItems={filteredMembers.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          actions={teamBulkActions}
          onAction={handleBulkActionClick}
          itemName="team members"
        />
      )}

      {/* Team Members Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <Th className="w-12">
                  <button
                    onClick={isAllSelected ? deselectAll : selectAll}
                    className={`p-1 rounded transition-colors ${
                      isAllSelected ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {isAllSelected ? <CheckSquare className="h-4 w-4" /> : 
                     isIndeterminate ? <Minus className="h-4 w-4" /> : 
                     <Square className="h-4 w-4" />}
                  </button>
                </Th>
                <Th>Member</Th>
                <Th>Contact</Th>
                <Th>Role & Department</Th>
                <Th>Module</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map(member => {
                const RoleIcon = getRoleIcon(member.role);
                const ModuleIcon = getModuleIcon(member.moduleType);
                
                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <Td>
                      <button
                        onClick={() => toggleItem(member.id)}
                        className={`p-1 rounded transition-colors ${
                          isSelected(member.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {isSelected(member.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                      </button>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <RoleIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <span className="font-medium block">{member.name}</span>
                          <span className="text-sm text-gray-500">{member.department}</span>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div>
                        <div className="text-sm">{member.email}</div>
                        <div className="text-sm text-gray-500">{member.phone}</div>
                      </div>
                    </Td>
                    <Td>
                      <div className="space-y-1">
                        <Badge variant="bg-blue-100 text-blue-800">
                          {member.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                        <div className="text-xs text-gray-500">{member.department}</div>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <ModuleIcon className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium capitalize">{member.moduleType}</div>
                          <div className="text-xs text-gray-500">
                            {member.hubId ? `Hub ${member.hubId.split('_')[1]}` : `Store ${member.storeId?.split('_')[1]}`}
                          </div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Badge variant={member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => onView?.(member)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onEdit?.(member)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDelete?.(member)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          </div>
        )}
      </Card>

      {/* Bulk Action Modal */}
      <BulkActionModal
        isOpen={bulkActionModal.isOpen}
        onClose={() => setBulkActionModal({ isOpen: false, actionId: '', actionType: '' })}
        onConfirm={handleConfirmBulkAction}
        title={`Bulk Action: ${bulkActionModal.actionId}`}
        actionType={bulkActionModal.actionType}
        selectedCount={selectedItems.length}
        itemName="team members"
      />
    </div>
  );
}
