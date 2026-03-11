import { useState } from 'react';
import { 
  SearchFilter, 
  BulkActions,
  BulkActionModal,
  useBulkSelection
} from '../../common';
import { Card, Badge } from '../../ui';
import { 
  Eye, Edit, Trash2, Users, Truck, Phone, MapPin, 
  CheckSquare, Square, Minus, Star, Clock, CheckCircle 
} from 'lucide-react';

interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  vehicleNo: string;
  vehicleType: string;
  agentType: 'employee' | 'partner';
  monthlySalary?: number;
  rating: number;
  deliveries: number;
  status: 'available' | 'delivering' | 'offline';
  currentOrders: number;
  isActive: boolean;
}

interface DeliveryAgentsListProps {
  agents: DeliveryAgent[];
  onView?: (agent: DeliveryAgent) => void;
  onEdit?: (agent: DeliveryAgent) => void;
  onDelete?: (agent: DeliveryAgent) => void;
  onCall?: (agent: DeliveryAgent) => void;
  onTrack?: (agent: DeliveryAgent) => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: Record<string, unknown>) => Promise<void>;
}

const agentBulkActions = [
  {
    id: 'activate',
    label: 'Activate Agents',
    icon: Users,
    variant: 'success' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to activate the selected delivery agents?'
  },
  {
    id: 'deactivate',
    label: 'Deactivate Agents',
    icon: Users,
    variant: 'warning' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to deactivate the selected delivery agents?'
  },
  {
    id: 'delete',
    label: 'Delete Agents',
    icon: Trash2,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected delivery agents? This action cannot be undone.'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800';
    case 'delivering': return 'bg-orange-100 text-orange-800';
    case 'offline': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'available': return CheckCircle;
    case 'delivering': return Truck;
    case 'offline': return Clock;
    default: return Clock;
  }
};

export function DeliveryAgentsList({ 
  agents, 
  onView, 
  onEdit, 
  onDelete,
  onCall,
  onTrack,
  onBulkAction
}: DeliveryAgentsListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [agentTypeFilter, setAgentTypeFilter] = useState('');
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionId: string;
    actionType: string;
  }>({ isOpen: false, actionId: '', actionType: '' });

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = !searchValue || 
      agent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      agent.phone.includes(searchValue) ||
      agent.vehicleNo.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesStatus = !statusFilter || agent.status === statusFilter;
    const matchesVehicle = !vehicleFilter || agent.vehicleType === vehicleFilter;
    const matchesAgentType = !agentTypeFilter || agent.agentType === agentTypeFilter;
    
    return matchesSearch && matchesStatus && matchesVehicle && matchesAgentType;
  });

  const {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected
  } = useBulkSelection(filteredAgents);

  const isAllSelected = selectedItems.length === filteredAgents.length && filteredAgents.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < filteredAgents.length;

  const handleBulkActionClick = (actionId: string) => {
    const action = agentBulkActions.find(a => a.id === actionId);
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
        placeholder="Search agents..."
        filters={[
          {
            key: 'agentType',
            label: 'Agent Type',
            value: agentTypeFilter,
            onChange: setAgentTypeFilter,
            options: [
              { value: '', label: 'All Types' },
              { value: 'employee', label: 'Employees' },
              { value: 'partner', label: 'Partners' }
            ]
          },
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'available', label: 'Available' },
              { value: 'delivering', label: 'Delivering' },
              { value: 'offline', label: 'Offline' }
            ]
          },
          {
            key: 'vehicle',
            label: 'Vehicle Type',
            value: vehicleFilter,
            onChange: setVehicleFilter,
            options: [
              { value: '', label: 'All Vehicles' },
              { value: 'bike', label: 'Bike' },
              { value: 'auto', label: 'Auto' },
              { value: 'van', label: 'Van' }
            ]
          }
        ]}
      />

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          totalItems={filteredAgents.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          actions={agentBulkActions}
          onAction={handleBulkActionClick}
          itemName="delivery agents"
        />
      )}

      {/* Select All Header */}
      {filteredAgents.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
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
            <span className="text-sm font-medium text-gray-700">
              {selectedItems.length > 0 
                ? `${selectedItems.length} of ${filteredAgents.length} agents selected`
                : `Select all ${filteredAgents.length} agents`
              }
            </span>
          </div>
        </Card>
      )}

      {/* Delivery Agents Horizontal Cards */}
      <div className="space-y-3">
        {filteredAgents.map(agent => {
          const StatusIcon = getStatusIcon(agent.status);
          
          return (
            <Card key={agent.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                {/* Selection Checkbox */}
                <button
                  onClick={() => toggleItem(agent.id)}
                  className={`p-1 rounded transition-colors flex-shrink-0 ${
                    isSelected(agent.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {isSelected(agent.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>

                {/* Agent Avatar */}
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {agent.name.charAt(0)}
                </div>

                {/* Agent Info - Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{agent.name}</h3>
                        <Badge variant={getStatusColor(agent.status)} className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </Badge>
                        <Badge variant={agent.agentType === 'employee' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}>
                          {agent.agentType === 'employee' ? '👤 Employee' : '🤝 Partner'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span className="truncate">{agent.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          <span className="truncate">{agent.vehicleNo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{agent.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{agent.deliveries} deliveries</span>
                        </div>
                        {agent.agentType === 'employee' && agent.monthlySalary && (
                          <div className="flex items-center gap-1 text-purple-600 font-medium">
                            <span>₹{agent.monthlySalary.toLocaleString()}/mo</span>
                          </div>
                        )}
                        {agent.agentType === 'partner' && (
                          <div className="flex items-center gap-1 text-orange-600 font-medium">
                            <span>Per Order</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Current Orders Badge */}
                    {agent.currentOrders > 0 && (
                      <Badge variant="bg-blue-100 text-blue-800" className="ml-2 flex-shrink-0">
                        {agent.currentOrders} orders
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <button 
                    onClick={() => onView?.(agent)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onCall?.(agent)}
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600" 
                    title="Call Agent"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onTrack?.(agent)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600" 
                    title="Track Agent"
                  >
                    <MapPin className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onEdit?.(agent)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete?.(agent)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {filteredAgents.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery agents found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </Card>
      )}

      {/* Bulk Action Modal */}
      <BulkActionModal
        isOpen={bulkActionModal.isOpen}
        onClose={() => setBulkActionModal({ isOpen: false, actionId: '', actionType: '' })}
        onConfirm={handleConfirmBulkAction}
        title={`Bulk Action: ${bulkActionModal.actionId}`}
        actionType={bulkActionModal.actionType}
        selectedCount={selectedItems.length}
        itemName="delivery agents"
      />
    </div>
  );
}
