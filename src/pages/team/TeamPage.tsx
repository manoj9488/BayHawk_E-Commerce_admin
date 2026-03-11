import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Input, Select, Table, Th, Td, Modal, Badge } from '../../components/ui';
import { Plus, Search, Eye, Edit, UserPlus, Users, Shield, Package, Truck, Navigation, Clock, Phone, MessageCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { filterDataByModule } from '../../utils/rbac';
import { TeamMembersList } from '../../components/features/team/TeamMembersList';
import { BatchOrderAssignment } from '../../components/features/team/BatchOrderAssignment';
import { BatchOrdersView } from '../../components/features/team/BatchOrdersView';
import { DeliveryAgentForm } from '../../components/features/team/DeliveryAgentForm';
import { AgentChat } from '../../components/features/team/AgentChat';
import type { TeamMember, Customer } from '../../types';
import { customersApi } from '../../utils/api';

const mockTeam: TeamMember[] = [
  { id: '1', name: 'Karthik Raja', email: 'karthik@admin.com', phone: '+91 9876543210', department: 'Operations', role: 'hub_main_admin', hubId: 'hub_1', moduleType: 'hub', isActive: true },
  { id: '2', name: 'Priya Lakshmi', email: 'priya@admin.com', phone: '+91 9876543211', department: 'Procurement', role: 'hub_procurement', hubId: 'hub_1', moduleType: 'hub', isActive: true },
  { id: '3', name: 'Ravi Kumar', email: 'ravi@admin.com', phone: '+91 9876543212', department: 'Packing', role: 'hub_packing', hubId: 'hub_1', moduleType: 'hub', isActive: true },
  { id: '4', name: 'Suresh M', email: 'suresh@admin.com', phone: '+91 9876543213', department: 'Delivery', role: 'hub_delivery', hubId: 'hub_1', moduleType: 'hub', isActive: true },
  { id: '5', name: 'Anitha S', email: 'anitha@admin.com', phone: '+91 9876543214', department: 'Operations', role: 'store_main_admin', storeId: 'store_1', moduleType: 'store', isActive: false },
  { id: '6', name: 'Muthu Kumar', email: 'muthu@admin.com', phone: '+91 9876543215', department: 'Procurement', role: 'store_procurement', storeId: 'store_1', moduleType: 'store', isActive: true },
  { id: '7', name: 'Divya R', email: 'divya@admin.com', phone: '+91 9876543216', department: 'Packing', role: 'store_packing', storeId: 'store_2', moduleType: 'store', isActive: true },
];

const mockDeliveryAgents = [
  { 
    id: '1', 
    name: 'Murugan K', 
    phone: '+91 9876543230', 
    vehicleNo: 'TN 01 AB 1234', 
    vehicleType: 'bike',
    agentType: 'employee' as const,
    monthlySalary: 18000,
    rating: 4.8, 
    deliveries: 234, 
    isActive: true,
    status: 'delivering',
    currentOrders: 3,
    moduleType: 'hub',
    hubId: 'hub_1',
    currentOrder: null
  },
  { 
    id: '2', 
    name: 'Senthil R', 
    phone: '+91 9876543231', 
    vehicleNo: 'TN 01 CD 5678', 
    vehicleType: 'auto',
    agentType: 'partner' as const,
    pricePerOrder: 50,
    rating: 4.6, 
    deliveries: 189, 
    isActive: true,
    status: 'available',
    currentOrders: 0,
    moduleType: 'hub',
    hubId: 'hub_1',
    currentOrder: null
  },
  { 
    id: '3', 
    name: 'Vijay M', 
    phone: '+91 9876543232', 
    vehicleNo: 'TN 01 EF 9012', 
    vehicleType: 'van',
    agentType: 'partner' as const,
    pricePerOrder: 75,
    rating: 4.9, 
    deliveries: 312, 
    isActive: true,
    status: 'delivering',
    currentOrders: 2,
    moduleType: 'store',
    storeId: 'store_1',
    currentOrder: null
  },
  { 
    id: '4', 
    name: 'Kumar S', 
    phone: '+91 9876543233', 
    vehicleNo: 'TN 01 GH 3456', 
    vehicleType: 'bike',
    agentType: 'employee' as const,
    monthlySalary: 16000,
    rating: 4.7, 
    deliveries: 156, 
    isActive: true,
    status: 'available',
    currentOrders: 0,
    moduleType: 'store',
    storeId: 'store_1',
    currentOrder: null
  },
  { 
    id: '5', 
    name: 'Arjun P', 
    phone: '+91 9876543234', 
    vehicleNo: 'TN 01 IJ 7890', 
    vehicleType: 'auto',
    agentType: 'partner' as const,
    pricePerOrder: 60,
    rating: 4.5, 
    deliveries: 98, 
    isActive: true,
    status: 'delivering',
    currentOrders: 1,
    moduleType: 'store',
    storeId: 'store_2',
    currentOrder: null
  },
  { 
    id: '6', 
    name: 'Ravi T', 
    phone: '+91 9876543235', 
    vehicleNo: 'TN 01 KL 2345', 
    vehicleType: 'bike',
    agentType: 'employee' as const,
    monthlySalary: 15000,
    rating: 4.3, 
    deliveries: 67, 
    isActive: true,
    status: 'available',
    currentOrders: 0,
    moduleType: 'hub',
    hubId: 'hub_1',
    currentOrder: null
  },
  { 
    id: '7', 
    name: 'Mani M', 
    phone: '+91 9876543236', 
    vehicleNo: 'TN 01 MN 6789', 
    vehicleType: 'van',
    agentType: 'employee' as const,
    monthlySalary: 20000,
    rating: 4.4, 
    deliveries: 145, 
    isActive: false,
    status: 'offline',
    currentOrders: 0,
    moduleType: 'store',
    storeId: 'store_1',
    currentOrder: null
  },
];

const mockBatchAssignments = [
  {
    id: "BATCH-001",
    agentName: "Murugan K",
    agentPhone: "+91 9876543230",
    agentType: "employee" as const,
    assignedAt: "Today, 10:30 AM",
    totalValue: 2700,
    orders: [
      {
        id: "ORD-091",
        customerName: "Amit Singh",
        deliveryAddress: "12 MG Road, Chennai",
        orderValue: 900,
        estimatedTime: "11:00 AM",
        status: "delivered",
      },
      {
        id: "ORD-092",
        customerName: "Neha Gupta",
        deliveryAddress: "45 Park Street, Chennai",
        orderValue: 1200,
        estimatedTime: "11:30 AM",
        status: "in_transit",
      },
      {
        id: "ORD-093",
        customerName: "Ravi Kumar",
        deliveryAddress: "78 Lake View, Chennai",
        orderValue: 600,
        estimatedTime: "12:00 PM",
        status: "assigned",
      },
    ],
  },
  {
    id: "BATCH-002",
    agentName: "Vijay M",
    agentPhone: "+91 9876543232",
    agentType: "partner" as const,
    assignedAt: "Today, 11:00 AM",
    totalValue: 3200,
    partnerPricing: {
      pricePerOrder: 75,
      totalAmount: 150,
      paymentStatus: "pending" as const,
    },
    orders: [
      {
        id: "ORD-094",
        customerName: "Priya Sharma",
        deliveryAddress: "23 Anna Nagar, Chennai",
        orderValue: 1500,
        estimatedTime: "11:30 AM",
        status: "in_transit",
      },
      {
        id: "ORD-095",
        customerName: "Karthik Raja",
        deliveryAddress: "67 T Nagar, Chennai",
        orderValue: 1700,
        estimatedTime: "12:00 PM",
        status: "assigned",
      },
    ],
  },
  {
    id: "BATCH-003",
    agentName: "Senthil R",
    agentPhone: "+91 9876543231",
    agentType: "partner" as const,
    assignedAt: "Today, 9:15 AM",
    totalValue: 4100,
    partnerPricing: {
      pricePerOrder: 50,
      totalAmount: 200,
      paymentStatus: "paid" as const,
    },
    orders: [
      {
        id: "ORD-088",
        customerName: "Lakshmi Devi",
        deliveryAddress: "89 Velachery, Chennai",
        orderValue: 1450,
        estimatedTime: "10:00 AM",
        status: "delivered",
      },
      {
        id: "ORD-089",
        customerName: "Rajesh Kumar",
        deliveryAddress: "34 Adyar, Chennai",
        orderValue: 1350,
        estimatedTime: "10:30 AM",
        status: "delivered",
      },
      {
        id: "ORD-090",
        customerName: "Anitha S",
        deliveryAddress: "56 Mylapore, Chennai",
        orderValue: 800,
        estimatedTime: "11:00 AM",
        status: "delivered",
      },
      {
        id: "ORD-096",
        customerName: "Suresh M",
        deliveryAddress: "12 Nungambakkam, Chennai",
        orderValue: 500,
        estimatedTime: "11:30 AM",
        status: "delivered",
      },
    ],
  },
];


export function TeamPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'team' | 'customers' | 'delivery'>('team');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deliveryView, setDeliveryView] = useState<'all' | 'available' | 'delivering' | 'offline' | 'batches'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showAssignOrderModal, setShowAssignOrderModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(false);
  const [customerEditForm, setCustomerEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    secondaryPhone: '',
    walletBalance: 0,
    membershipPlan: '',
    isActive: true,
  });
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    moduleType: '',
    location: ''
  });

  // Filter data based on user's login type
  const filteredTeamData = filterDataByModule(mockTeam, user);
  const filteredDeliveryAgents = filterDataByModule(mockDeliveryAgents, user);
  const filteredCustomers = useMemo(() => {
    let data = customers;

    if (statusFilter) {
      data = data.filter((customer) => {
        const activeStatus = customer.isActive ? 'active' : 'inactive';
        return activeStatus === statusFilter;
      });
    }

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      data = data.filter((customer) =>
        customer.name.toLowerCase().includes(keyword) ||
        customer.email.toLowerCase().includes(keyword) ||
        customer.phone.toLowerCase().includes(keyword)
      );
    }

    return data;
  }, [customers, search, statusFilter]);

  const loadCustomers = async () => {
    setIsCustomersLoading(true);

    try {
      const response = await customersApi.getAll({
        page: '1',
        limit: '100',
      });

      const payload = response.data;

      const list = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      setCustomers(list as Customer[]);
    } catch (error) {
      console.error('Failed to load customers', error);
      alert('Failed to load customers from backend.');
      setCustomers([]);
    } finally {
      setIsCustomersLoading(false);
    }
  };

  useEffect(() => {
    void loadCustomers();
  }, []);

  const tabs = [
    { id: 'team', label: 'Team Members', icon: Users, count: filteredTeamData.length },
    { id: 'customers', label: 'Customers', icon: UserPlus, count: customers.length },
    { id: 'delivery', label: 'Delivery Agents', icon: Truck, count: filteredDeliveryAgents.length },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.includes('admin')) return Shield;
    if (role.includes('procurement')) return Package;
    if (role.includes('packing')) return Package;
    if (role.includes('delivery')) return Truck;
    return Users;
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'delivering': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-green-100 text-green-800';
      case 'returning': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'delivering': return Truck;
      case 'available': return Users;
      case 'returning': return Navigation;
      case 'offline': return Clock;
      default: return Clock;
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding member:', newMember);
    setShowAddModal(false);
    setNewMember({ name: '', email: '', phone: '', department: '', role: '', moduleType: '', location: '' });
  };

  const handleViewMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowViewModal(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerEditForm({
      fullName: customer.name,
      email: customer.email,
      phone: customer.phone,
      secondaryPhone: customer.secondaryPhone || '',
      walletBalance: customer.walletBalance || 0,
      membershipPlan: customer.membershipPlan || '',
      isActive: customer.isActive,
    });
    setShowEditModal(true);
  };

  const handleViewAgent = (agent: any) => {
    setSelectedAgent(agent);
    setShowViewModal(true);
  };

  const handleEditAgent = (agent: any) => {
    setSelectedAgent(agent);
    setShowEditModal(true);
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      console.log('Delete member:', memberId);
    }
  };

  // Bulk actions handler for team members
  const handleTeamBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      switch (actionId) {
        case 'activate':
          console.log(`Activating ${selectedIds.length} team members:`, selectedIds);
          // API call to activate members
          break;
        case 'deactivate':
          console.log(`Deactivating ${selectedIds.length} team members:`, selectedIds);
          // API call to deactivate members
          break;
        case 'delete':
          console.log(`Deleting ${selectedIds.length} team members:`, selectedIds);
          // API call to delete members
          break;
        default:
          console.log(`Bulk action ${actionId} performed on ${selectedIds.length} team members`, data);
      }
    } catch (error) {
      console.error('Team bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    }
  };

  const handleAssignOrder = (agent: any) => {
    setSelectedAgent(agent);
    setShowAssignOrderModal(true);
  };

  const handleTrackAgent = (agent: any) => {
    setSelectedAgent(agent);
    setShowTrackModal(true);
  };

  const handleCallCustomer = (agent: any) => {
    if (agent.currentOrder && agent.currentOrder.customerPhone) {
      window.open(`tel:${agent.currentOrder.customerPhone}`, '_self');
    }
  };

  const handleChatAgent = (agent: any) => {
    setSelectedAgent(agent);
    setShowChatModal(true);
  };

  const handleViewOrderHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowOrderHistoryModal(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">
            {user?.loginType === 'hub' ? 'Hub Team & User Management' : 
             user?.loginType === 'store' ? 'Store Team & User Management' : 
             'Team & User Management'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {user?.loginType === 'hub' ? 'Manage hub team members, customers, and delivery agents' : 
             user?.loginType === 'store' ? 'Manage store team members, customers, and delivery agents' : 
             'Manage team members, customers, and delivery agents'}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto flex-shrink-0">
          <Plus className="mr-2 h-5 w-5" /> 
          <span className="hidden sm:inline">Add {activeTab === 'team' ? 'Team Member' : activeTab === 'customers' ? 'Customer' : 'Delivery Agent'}</span>
          <span className="sm:hidden">Add {activeTab === 'team' ? 'Member' : activeTab === 'customers' ? 'Customer' : 'Agent'}</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <Card key={tab.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{tab.label}</p>
                  <p className="text-xl sm:text-2xl font-bold">{tab.count}</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 transition-colors whitespace-nowrap text-xs sm:text-sm ${
              activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            <Badge variant="bg-gray-100 text-gray-600" className="text-xs">{tab.count}</Badge>
          </button>
        ))}
      </div>

      {/* Filters - Only show for customers and delivery tabs */}
      {activeTab !== 'team' && (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="pl-10 text-sm" 
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)} 
                options={[
                  { value: '', label: 'All Status' }, 
                  { value: 'active', label: 'Active' }, 
                  { value: 'inactive', label: 'Inactive' }
                ]} 
                className="text-sm"
              />
              {activeTab === 'delivery' && (
                <Select 
                  value={deliveryView} 
                  onChange={e => setDeliveryView(e.target.value as typeof deliveryView)} 
                  options={[
                    { value: 'all', label: 'All Agents' }, 
                    { value: 'available', label: 'Available' }, 
                    { value: 'delivering', label: 'Delivering' }, 
                    { value: 'offline', label: 'Offline' }
                  ]} 
                  className="text-sm"
                />
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Team Members List */}
      {activeTab === 'team' && (
        <TeamMembersList
          members={filteredTeamData}
          onView={handleViewMember}
          onEdit={handleEditMember}
          onDelete={(member) => handleDeleteMember(member.id)}
          onBulkAction={handleTeamBulkAction}
        />
      )}

      {/* Customers Table */}
      {activeTab === 'customers' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Orders</Th><Th>Total Spent</Th><Th>Wallet</Th><Th>Membership</Th><Th>Status</Th><Th>Actions</Th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isCustomersLoading && (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600" colSpan={9}>Loading customers...</td>
                  </tr>
                )}
                {!isCustomersLoading && filteredCustomers.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600" colSpan={9}>No customers found</td>
                  </tr>
                )}
                {!isCustomersLoading && filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <Td><span className="font-medium">{customer.name}</span></Td>
                    <Td>{customer.email}</Td>
                    <Td>{customer.phone}</Td>
                    <Td>{customer.totalOrders}</Td>
                    <Td>₹{customer.totalSpent.toLocaleString()}</Td>
                    <Td>₹{customer.walletBalance}</Td>
                    <Td>{customer.membershipPlan ? <Badge variant="bg-yellow-100 text-yellow-800">{customer.membershipPlan}</Badge> : '-'}</Td>
                    <Td><Badge variant={getStatusColor(customer.isActive ? 'active' : 'inactive')}>{customer.isActive ? 'Active' : 'Inactive'}</Badge></Td>
                    <Td>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewOrderHistory(customer)}
                          className="p-1 hover:bg-blue-50 rounded text-blue-600"
                          title="Order History"
                        >
                          <ShoppingBag className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleViewCustomer(customer)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleEditCustomer(customer)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* Delivery Agents Section */}
      {activeTab === 'delivery' && (
        <div className="space-y-6">
          {/* Delivery Status Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Agents</p>
                  <p className="text-xl font-bold">{mockDeliveryAgents.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-xl font-bold">{filteredDeliveryAgents.filter(a => a.status === 'available').length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Navigation className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">On Delivery</p>
                  <p className="text-xl font-bold">{filteredDeliveryAgents.filter(a => a.status === 'delivering').length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-xl font-bold">{filteredDeliveryAgents.filter(a => a.status === 'delivering').length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Delivery View Tabs */}
          <div className="flex gap-2 border-b overflow-x-auto">
            {[
              { id: 'all', label: 'All Agents', count: filteredDeliveryAgents.length },
              { id: 'available', label: 'Available', count: filteredDeliveryAgents.filter(a => a.status === 'available').length },
              { id: 'delivering', label: 'On Delivery', count: filteredDeliveryAgents.filter(a => a.status === 'delivering').length },
              { id: 'offline', label: 'Offline', count: filteredDeliveryAgents.filter(a => a.status === 'offline').length },
              { id: 'batches', label: 'Batch Orders', count: mockBatchAssignments.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDeliveryView(tab.id as typeof deliveryView)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  deliveryView === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <Badge variant="bg-gray-100 text-gray-600">{tab.count}</Badge>
              </button>
            ))}
            {deliveryView !== 'batches' && (
              <Button
                onClick={() => setShowBatchModal(true)}
                size="sm"
                className="ml-auto"
              >
                <Package className="h-4 w-4 mr-2" />
                Assign Batch
              </Button>
            )}
          </div>

          {/* Batch Orders View */}
          {deliveryView === 'batches' && (
            <BatchOrdersView batches={mockBatchAssignments} />
          )}

          {/* Delivery Agents List */}
          {deliveryView !== 'batches' && (
          <div className="space-y-4">
            {(() => {
              let filteredAgents = filteredDeliveryAgents;
              
              if (deliveryView === 'available') {
                filteredAgents = filteredDeliveryAgents.filter(a => a.status === 'available');
              } else if (deliveryView === 'delivering') {
                filteredAgents = filteredDeliveryAgents.filter(a => a.status === 'delivering');
              } else if (deliveryView === 'offline') {
                filteredAgents = filteredDeliveryAgents.filter(a => a.status === 'offline');
              }

              if (search) {
                filteredAgents = filteredAgents.filter(agent => 
                  agent.name.toLowerCase().includes(search.toLowerCase()) ||
                  agent.phone.includes(search) ||
                  agent.vehicleNo.toLowerCase().includes(search.toLowerCase())
                );
              }

              return filteredAgents.map(agent => {
                const StatusIcon = getDeliveryStatusIcon(agent.status);
                const hasCurrentOrder = agent.currentOrder !== null;
                
                return (
                  <Card key={agent.id} className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Agent Avatar */}
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {agent.name.charAt(0)}
                      </div>
                      
                      {/* Agent Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-base">{agent.name}</h3>
                          <Badge variant={getDeliveryStatusColor(agent.status)} className="flex items-center gap-1 text-xs">
                            <StatusIcon className="h-3 w-3" />
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </Badge>
                          <Badge variant={agent.agentType === 'employee' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}>
                            {agent.agentType === 'employee' ? '👤 Employee' : '🤝 Partner'}
                          </Badge>
                          {hasCurrentOrder && (
                            <Badge variant="bg-blue-100 text-blue-800">
                              {agent.currentOrders || 1} active
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {agent.phone}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Truck className="h-3 w-3" />
                            {agent.vehicleNo}
                          </span>
                          <span className="flex items-center gap-1">
                            ⭐ {agent.rating} ({agent.deliveries} deliveries)
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={() => handleChatAgent(agent)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Chat"
                        >
                          <MessageCircle className="h-5 w-5 text-blue-600" />
                        </button>
                        <button 
                          onClick={() => handleViewAgent(agent)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="View Details"
                        >
                          <Eye className="h-5 w-5 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleEditAgent(agent)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              });
            })()}
          </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        title={`Add ${activeTab === 'team' ? 'Team Member' : activeTab === 'customers' ? 'Customer' : 'Delivery Agent'}`}
        size={activeTab === 'delivery' ? 'xl' : 'md'}
      >
        {activeTab === 'delivery' ? (
          <DeliveryAgentForm
            onSubmit={(data) => {
              console.log('Adding delivery agent:', data);
              setShowAddModal(false);
            }}
            onCancel={() => setShowAddModal(false)}
          />
        ) : (
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Full Name" 
              placeholder="Enter full name" 
              value={newMember.name}
              onChange={e => setNewMember({...newMember, name: e.target.value})}
              required 
            />
            <Input 
              label="Email" 
              type="email" 
              placeholder="email@example.com" 
              value={newMember.email}
              onChange={e => setNewMember({...newMember, email: e.target.value})}
              required 
            />
          </div>
          
          <Input 
            label="Phone" 
            placeholder="+91 9876543210" 
            value={newMember.phone}
            onChange={e => setNewMember({...newMember, phone: e.target.value})}
            required 
          />
          
          {activeTab === 'team' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                label="Module Type" 
                value={newMember.moduleType}
                onChange={e => setNewMember({...newMember, moduleType: e.target.value})}
                options={[
                  { value: '', label: 'Select Module' },
                  ...(user?.loginType === 'super_admin' ? [
                    { value: 'hub', label: 'Hub (Central Warehouse)' }, 
                    { value: 'store', label: 'Store (Retail Location)' }
                  ] : user?.loginType === 'hub' ? [
                    { value: 'hub', label: 'Hub (Central Warehouse)' }
                  ] : user?.loginType === 'store' ? [
                    { value: 'store', label: 'Store (Retail Location)' }
                  ] : [])
                ]} 
                required
              />
                <Select 
                  label="Department" 
                  value={newMember.department}
                  onChange={e => setNewMember({...newMember, department: e.target.value})}
                  options={[
                    { value: '', label: 'Select Department' },
                    { value: 'Operations', label: 'Operations' }, 
                    { value: 'Procurement', label: 'Procurement' }, 
                    { value: 'Packing', label: 'Packing' }, 
                    { value: 'Delivery', label: 'Delivery' }
                  ]} 
                  required
                />
              </div>
              
              <Select 
                label="Role" 
                value={newMember.role}
                onChange={e => setNewMember({...newMember, role: e.target.value})}
                options={[
                  { value: '', label: 'Select Role' },
                  ...(newMember.moduleType === 'hub' ? [
                    { value: 'hub_main_admin', label: 'Hub Main Admin' },
                    { value: 'hub_procurement', label: 'Hub Procurement' },
                    { value: 'hub_packing', label: 'Hub Packing Staff' },
                    { value: 'hub_delivery', label: 'Hub Delivery Agent' }
                  ] : newMember.moduleType === 'store' ? [
                    { value: 'store_main_admin', label: 'Store Main Admin' },
                    { value: 'store_procurement', label: 'Store Procurement' },
                    { value: 'store_packing', label: 'Store Packing Staff' },
                    { value: 'store_delivery', label: 'Store Delivery Agent' }
                  ] : [])
                ]} 
                required
              />
              
              <Select 
                label="Assign Location" 
                value={newMember.location}
                onChange={e => setNewMember({...newMember, location: e.target.value})}
                options={[
                  { value: '', label: 'Select Location' },
                  ...(newMember.moduleType === 'hub' || (user?.loginType === 'hub' && !newMember.moduleType) ? [
                    { value: 'hub_1', label: 'Central Hub - Chennai' },
                    { value: 'hub_2', label: 'Secondary Hub - Coimbatore' }
                  ] : []),
                  ...(newMember.moduleType === 'store' || (user?.loginType === 'store' && !newMember.moduleType) ? [
                    { value: 'store_1', label: 'Store - Anna Nagar' },
                    { value: 'store_2', label: 'Store - T. Nagar' },
                    { value: 'store_3', label: 'Store - Velachery' }
                  ] : [])
                ]} 
                required
              />

              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Password Setup</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Password" 
                    type="password"
                    placeholder="Enter password" 
                    required
                  />
                  <Input 
                    label="Confirm Password" 
                    type="password"
                    placeholder="Confirm password" 
                    required
                  />
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'customers' && (
            <>
              <Input 
                label="Secondary Phone (Optional)" 
                placeholder="+91 9876543210" 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Wallet Balance" 
                  type="number"
                  placeholder="0" 
                  defaultValue="0"
                />
                <Select 
                  label="Membership Plan" 
                  options={[
                    { value: '', label: 'No Membership' },
                    { value: 'Premium', label: 'Premium' },
                    { value: 'Gold', label: 'Gold' },
                    { value: 'Silver', label: 'Silver' }
                  ]} 
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Default Address</h4>
                <Input 
                  label="Address Line 1" 
                  placeholder="Street address, building name" 
                  required
                />
                <Input 
                  label="Address Line 2 (Optional)" 
                  placeholder="Apartment, suite, floor" 
                  className="mt-3"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <Input 
                    label="City" 
                    placeholder="City" 
                    required
                  />
                  <Input 
                    label="State" 
                    placeholder="State" 
                    required
                  />
                  <Input 
                    label="Pincode" 
                    placeholder="600001" 
                    required
                  />
                </div>
                <Select 
                  label="Address Type" 
                  options={[
                    { value: 'home', label: 'Home' },
                    { value: 'work', label: 'Work' },
                    { value: 'other', label: 'Other' }
                  ]} 
                  defaultValue="home"
                  className="mt-3"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  defaultChecked={true}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Active Customer</span>
              </div>
            </>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowAddModal(false)} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add {activeTab === 'team' ? 'Team Member' : activeTab === 'customers' ? 'Customer' : 'Delivery Agent'}
            </Button>
          </div>
        </form>
        )}
      </Modal>

      {/* View Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false);
          setSelectedMember(null);
          setSelectedCustomer(null);
          setSelectedAgent(null);
        }} 
        title={`${activeTab === 'team' ? 'Team Member' : activeTab === 'customers' ? 'Customer' : 'Delivery Agent'} Details`}
        size="lg"
      >
        {/* Team Member View */}
        {selectedMember && activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-full">
                {(() => {
                  const RoleIcon = getRoleIcon(selectedMember.role);
                  return <RoleIcon className="h-8 w-8 text-blue-600" />;
                })()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedMember.name}</h3>
                <p className="text-gray-600">{selectedMember.department}</p>
                <Badge variant={selectedMember.isActive ? 'success' : 'secondary'}>
                  {selectedMember.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{selectedMember.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedMember.phone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Role & Assignment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <Badge variant="info">
                      {selectedMember.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Module:</span>
                    <span className="capitalize">{selectedMember.moduleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span>
                      {selectedMember.hubId ? `Hub ${selectedMember.hubId.split('_')[1]}` : `Store ${selectedMember.storeId?.split('_')[1]}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedMember(null);
                }}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowViewModal(false);
                  handleEditMember(selectedMember);
                }}
                className="flex-1"
              >
                Edit Member
              </Button>
            </div>
          </div>
        )}

        {/* Customer View */}
        {selectedCustomer && activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-full">
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-gray-600">{selectedCustomer.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedCustomer.isActive ? 'success' : 'secondary'}>
                    {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {selectedCustomer.membershipPlan && (
                    <Badge variant="warning">{selectedCustomer.membershipPlan}</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span>{new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Order Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders:</span>
                    <span className="font-semibold">{selectedCustomer.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spent:</span>
                    <span className="font-semibold text-green-600">₹{selectedCustomer.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wallet Balance:</span>
                    <span className="font-semibold text-blue-600">₹{selectedCustomer.walletBalance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5 text-gray-700" />
                <h4 className="font-medium text-gray-900">Order History</h4>
                <Badge variant="bg-gray-100 text-gray-600">
                  {selectedCustomer.totalOrders || 0} orders
                </Badge>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <Card className="p-4">
                  <p className="text-sm text-gray-600">
                    Detailed order history integration is planned in step `S11`. Current totals are already backend-driven.
                  </p>
                </Card>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCustomer(null);
                }}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowViewModal(false);
                  handleEditCustomer(selectedCustomer);
                }}
                className="flex-1"
              >
                Edit Customer
              </Button>
            </div>
          </div>
        )}

        {/* Delivery Agent View */}
        {selectedAgent && activeTab === 'delivery' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-100 rounded-full">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedAgent.name}</h3>
                <p className="text-gray-600 font-mono">{selectedAgent.vehicleNo}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getDeliveryStatusColor(selectedAgent.status)}>
                    {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-600">⭐ {selectedAgent.rating} Rating</span>
                  <span className="text-sm text-gray-600 capitalize">{selectedAgent.vehicleType}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedAgent.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Number:</span>
                    <span className="font-mono">{selectedAgent.vehicleNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Type:</span>
                    <span className="capitalize">{selectedAgent.vehicleType}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Deliveries:</span>
                    <span className="font-semibold">{selectedAgent.deliveries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold text-yellow-600">⭐ {selectedAgent.rating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={getDeliveryStatusColor(selectedAgent.status)} className="text-xs">
                      {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Order Information */}
            {selectedAgent.currentOrder && (
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Current Order Details</h4>
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Order ID:</span>
                      <p className="font-medium text-blue-600">{selectedAgent.currentOrder.orderId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Customer Name:</span>
                      <p className="font-medium">{selectedAgent.currentOrder.customerName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Customer Phone:</span>
                      <p className="font-medium">{selectedAgent.currentOrder.customerPhone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Order Value:</span>
                      <p className="font-medium text-green-600">₹{selectedAgent.currentOrder.orderValue}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Delivery Address:</span>
                    <p className="font-medium text-sm mt-1">{selectedAgent.currentOrder.deliveryAddress}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Estimated Time:</span>
                      <p className="font-medium text-blue-600">{selectedAgent.currentOrder.estimatedTime}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Current Location:</span>
                      <p className="font-medium text-sm">{selectedAgent.currentOrder.currentLocation}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedAgent(null);
                }}
                className="flex-1"
              >
                Close
              </Button>
              {selectedAgent.currentOrder && (
                <Button 
                  onClick={() => {
                    setShowViewModal(false);
                    handleTrackAgent(selectedAgent);
                  }}
                  className="flex-1"
                >
                  Track Live
                </Button>
              )}
              <Button 
                onClick={() => {
                  setShowViewModal(false);
                  handleEditAgent(selectedAgent);
                }}
                className="flex-1"
              >
                Edit Agent
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedMember(null);
          setSelectedCustomer(null);
          setSelectedAgent(null);
        }} 
        title={`Edit ${activeTab === 'team' ? 'Team Member' : activeTab === 'customers' ? 'Customer' : 'Delivery Agent'}`}
        size="lg"
      >
        {/* Team Member Edit */}
        {selectedMember && activeTab === 'team' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Full Name" 
                defaultValue={selectedMember.name}
                placeholder="Enter full name" 
              />
              <Input 
                label="Email" 
                type="email" 
                defaultValue={selectedMember.email}
                placeholder="email@example.com" 
              />
            </div>
            
            <Input 
              label="Phone" 
              defaultValue={selectedMember.phone}
              placeholder="+91 9876543210" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedMember.department}
              >
                <option value="Operations">Operations</option>
                <option value="Procurement">Procurement</option>
                <option value="Packing">Packing</option>
                <option value="Delivery">Delivery</option>
              </select>
              
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedMember.role}
              >
                <option value={selectedMember.role}>
                  {selectedMember.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              </select>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Password Management</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="New Password" 
                  type="password"
                  placeholder="Enter new password (leave blank to keep current)" 
                />
                <Input 
                  label="Confirm Password" 
                  type="password"
                  placeholder="Confirm new password" 
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Leave password fields blank if you don't want to change the password</p>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                defaultChecked={selectedMember.isActive}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Active Member</span>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedMember(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  console.log('Update member:', selectedMember.id);
                  setShowEditModal(false);
                  setSelectedMember(null);
                }}
                className="flex-1"
              >
                Update Member
              </Button>
            </div>
          </div>
        )}

        {/* Customer Edit */}
        {selectedCustomer && activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Full Name" 
                value={customerEditForm.fullName}
                onChange={(e) => setCustomerEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter full name" 
              />
              <Input 
                label="Email" 
                type="email" 
                value={customerEditForm.email}
                onChange={(e) => setCustomerEditForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Phone" 
                value={customerEditForm.phone}
                onChange={(e) => setCustomerEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 9876543210" 
              />
              <Input 
                label="Secondary Phone (Optional)" 
                value={customerEditForm.secondaryPhone}
                onChange={(e) => setCustomerEditForm((prev) => ({ ...prev, secondaryPhone: e.target.value }))}
                placeholder="+91 9876543210" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Wallet Balance" 
                type="number"
                value={customerEditForm.walletBalance}
                onChange={(e) => setCustomerEditForm((prev) => ({ ...prev, walletBalance: Number(e.target.value || 0) }))}
                placeholder="0" 
              />
              
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customerEditForm.membershipPlan}
                onChange={(e) => setCustomerEditForm((prev) => ({ ...prev, membershipPlan: e.target.value }))}
              >
                <option value="">No Membership</option>
                <option value="Premium">Premium</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
            </div>

            <div className="border-t pt-4 mt-4 text-sm text-gray-600">
              Address editing remains under the address module (`S03`). Customer core profile changes are active now.
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={customerEditForm.isActive}
                onChange={(e) => setCustomerEditForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Active Customer</span>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCustomer(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={async () => {
                  try {
                    const response = await customersApi.update(selectedCustomer.id, {
                      fullName: customerEditForm.fullName,
                      email: customerEditForm.email,
                      phone: customerEditForm.phone,
                      alternatePhone: customerEditForm.secondaryPhone || null,
                      isActive: customerEditForm.isActive,
                    });

                    const updated = response.data?.data || response.data;

                    setCustomers((prev) =>
                      prev.map((customer) =>
                        customer.id === selectedCustomer.id
                          ? {
                              ...customer,
                              ...updated,
                              name: updated.fullName || updated.name || customer.name,
                              secondaryPhone: updated.secondaryPhone || customerEditForm.secondaryPhone,
                              isActive: updated.isActive ?? customerEditForm.isActive,
                            }
                          : customer
                      )
                    );

                    setSelectedCustomer(null);
                    setShowEditModal(false);
                  } catch (error) {
                    console.error('Failed to update customer', error);
                    alert('Failed to update customer.');
                  }
                }}
                className="flex-1"
              >
                Update Customer
              </Button>
            </div>
          </div>
        )}

        {/* Delivery Agent Edit */}
        {selectedAgent && activeTab === 'delivery' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Full Name" 
                defaultValue={selectedAgent.name}
                placeholder="Enter full name" 
              />
              <Input 
                label="Phone" 
                defaultValue={selectedAgent.phone}
                placeholder="+91 9876543210" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Vehicle Number" 
                defaultValue={selectedAgent.vehicleNo}
                placeholder="TN 01 AB 1234" 
              />
              <Select 
                label="Vehicle Type" 
                defaultValue={selectedAgent.vehicleType || ''}
                options={[
                  { value: '', label: 'Select Vehicle Type' },
                  { value: 'bike', label: 'Motorcycle' },
                  { value: 'auto', label: 'Auto Rickshaw' },
                  { value: 'van', label: 'Delivery Van' }
                ]} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={selectedAgent.status}
                >
                  <option value="available">Available</option>
                  <option value="delivering">Delivering</option>
                  <option value="returning">Returning</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input 
                  type="checkbox" 
                  defaultChecked={selectedAgent.isActive}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Active Agent</span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAgent(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  console.log('Update agent:', selectedAgent.id);
                  setShowEditModal(false);
                  setSelectedAgent(null);
                }}
                className="flex-1"
              >
                Update Agent
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Order Modal */}
      <Modal 
        isOpen={showAssignOrderModal} 
        onClose={() => {
          setShowAssignOrderModal(false);
          setSelectedAgent(null);
        }} 
        title={`Assign Order to ${selectedAgent?.name}`}
      >
        {selectedAgent && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Agent Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{selectedAgent.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Vehicle:</span>
                  <p className="font-medium">{selectedAgent.vehicleNo}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{selectedAgent.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={getDeliveryStatusColor(selectedAgent.status)} className="text-xs">
                    {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
              <Input 
                placeholder="Search by Order ID, Customer Name, or Phone..." 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Order</label>
              <Select 
                options={[
                  { value: '', label: 'Select an order to assign' },
                  { value: 'ORD-2024-004', label: 'ORD-2024-004 - Anand Kumar - ₹950' },
                  { value: 'ORD-2024-005', label: 'ORD-2024-005 - Meena R - ₹1200' },
                  { value: 'ORD-2024-006', label: 'ORD-2024-006 - Raju S - ₹750' }
                ]} 
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowAssignOrderModal(false);
                  setSelectedAgent(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  console.log('Assign order to agent:', selectedAgent.id);
                  setShowAssignOrderModal(false);
                  setSelectedAgent(null);
                }}
                className="flex-1"
              >
                Assign Order
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Track Agent Modal */}
      <Modal 
        isOpen={showTrackModal} 
        onClose={() => {
          setShowTrackModal(false);
          setSelectedAgent(null);
        }} 
        title={`Track ${selectedAgent?.name}`}
        size="lg"
      >
        {selectedAgent && (
          <div className="space-y-6">
            {selectedAgent.currentOrder ? (
              <>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Current Delivery</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Order ID:</span>
                        <p className="font-medium text-blue-600">{selectedAgent.currentOrder.orderId}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Customer:</span>
                        <p className="font-medium">{selectedAgent.currentOrder.customerName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Customer Phone:</span>
                        <p className="font-medium">{selectedAgent.currentOrder.customerPhone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Order Value:</span>
                        <p className="font-medium text-green-600">₹{selectedAgent.currentOrder.orderValue}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery Address:</span>
                      <p className="font-medium text-sm mt-1">{selectedAgent.currentOrder.deliveryAddress}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Estimated Time:</span>
                        <p className="font-medium text-blue-600">{selectedAgent.currentOrder.estimatedTime}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Current Location:</span>
                        <p className="font-medium text-sm">{selectedAgent.currentOrder.currentLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                    <Navigation className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Live Tracking</h4>
                  <p className="text-gray-600 mb-4">Real-time location tracking would be displayed here</p>
                  <div className="text-sm text-gray-500">
                    <p>📍 {selectedAgent.currentOrder.currentLocation}</p>
                    <p>⏱️ ETA: {selectedAgent.currentOrder.estimatedTime}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleCallCustomer(selectedAgent)}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    Call Customer
                  </button>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      setShowTrackModal(false);
                      setSelectedAgent(null);
                    }}
                    className="flex-1"
                  >
                    Close Tracking
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">No Active Delivery</h4>
                <p className="text-gray-600 mb-4">This agent is currently available for assignments</p>
                <Button 
                  onClick={() => {
                    setShowTrackModal(false);
                    handleAssignOrder(selectedAgent);
                  }}
                >
                  Assign New Order
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Batch Order Assignment Modal */}
      <Modal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        title="Assign Batch Orders"
        size="xl"
      >
        <BatchOrderAssignment
          agents={filteredDeliveryAgents}
          orders={[
            { id: 'ORD-101', customerName: 'Rajesh Kumar', deliveryAddress: '123 Anna Nagar, Chennai', orderValue: 850, estimatedTime: '2:30 PM' },
            { id: 'ORD-102', customerName: 'Priya Sharma', deliveryAddress: '456 T Nagar, Chennai', orderValue: 1200, estimatedTime: '3:00 PM' },
            { id: 'ORD-103', customerName: 'Arun Patel', deliveryAddress: '789 Velachery, Chennai', orderValue: 650, estimatedTime: '3:30 PM' },
          ]}
          onAssign={(agentId, orderIds) => {
            console.log('Batch assigned:', { agentId, orderIds });
            setShowBatchModal(false);
          }}
          onCancel={() => setShowBatchModal(false)}
        />
      </Modal>

      {/* Agent Chat Modal */}
      <Modal
        isOpen={showChatModal}
        onClose={() => {
          setShowChatModal(false);
          setSelectedAgent(null);
        }}
        title="Chat with Delivery Agent"
        size="lg"
      >
        {selectedAgent && (
          <AgentChat
            agentId={selectedAgent.id}
            agentName={selectedAgent.name}
            onClose={() => {
              setShowChatModal(false);
              setSelectedAgent(null);
            }}
          />
        )}
      </Modal>

      {/* Customer Order History Modal */}
      <Modal
        isOpen={showOrderHistoryModal}
        onClose={() => {
          setShowOrderHistoryModal(false);
          setSelectedCustomer(null);
        }}
        title={selectedCustomer ? `Order History - ${selectedCustomer.name}` : 'Order History'}
        size="xl"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            {/* Customer Summary */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedCustomer.name}</h3>
                    <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                </div>
              </div>
            </Card>

            {/* Order Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-xl font-bold text-green-600">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-sm text-gray-600">Wallet Balance</p>
                <p className="text-xl font-bold text-blue-600">₹{selectedCustomer.walletBalance}</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                </p>
              </Card>
            </div>

            {/* Orders List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              <Card className="p-4">
                <p className="text-sm text-gray-600">
                  Detailed customer order timeline will be connected in `S11` when order APIs are completed.
                </p>
              </Card>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowOrderHistoryModal(false);
                  setSelectedCustomer(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
