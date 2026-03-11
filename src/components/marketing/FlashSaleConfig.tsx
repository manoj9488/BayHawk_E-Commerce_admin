import { useState } from 'react';
import { Card, Button, Input, Modal } from '../ui';
import { Plus, Eye, Edit, Trash2, Copy, Clock, Bell, Users, Tag, Package, Search, Crown } from 'lucide-react';
import type { Product } from '../../types';

type FlashSaleType = 'discount_coupon' | 'product_sale' | 'members_only' | 'membership_subscription';

interface FlashSaleProductConfig {
  productId: string;
  variantId: string;
  discountPrice: number;
  flashOfferDetails: string;
}

interface MembershipBenefit {
  id: string;
  type: string;
  label: string;
  value: string;
  isEditable: boolean;
}

interface MembershipPlan {
  id: string;
  name: string;
  duration: number;
  price: number;
  monthlyEquivalent: number;
  benefits: MembershipBenefit[];
  welcomeWallet: number;
  walletExpiry: number;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
}

interface FlashSaleMembershipConfig {
  membershipPlanId: string;
  discountPrice: number;
  flashOfferDetails: string;
}

interface Notification {
  type: 'before_start' | 'before_end' | 'popup_reminder';
  minutes: number;
  message: string;
  enabled: boolean;
}

interface FlashSale {
  id: string;
  name: string;
  type: FlashSaleType;
  description: string;
  startTime: string;
  endTime: string;
  timerType: 'fixed' | 'datetime' | 'recurring';
  fixedDuration?: number;
  couponCode?: string;
  discountValue?: number;
  discountType?: 'percentage' | 'fixed';
  selectedProducts?: FlashSaleProductConfig[];
  selectedMembership?: FlashSaleMembershipConfig;
  notifications: Notification[];
  status: 'draft' | 'scheduled' | 'active' | 'ended';
  isActive: boolean;
  createdAt: string;
}

// Mock products data - in real app, fetch from API
const mockProducts: Product[] = [
  {
    id: "1",
    nameEn: "Seer Fish (Vanjaram)",
    nameTa: "வஞ்சிரம்",
    sku: "FISH-001",
    category: "fish",
    description: "Premium quality seer fish",
    images: [],
    variants: [
      {
        id: "v1",
        type: "Whole Cleaned",
        size: "Medium",
        grossWeight: "1000-1250g",
        netWeight: "800-1000g",
        pieces: "1 piece",
        serves: "3-4",
        price: 1200,
        stock: 25,
        discount: 10,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    moduleType: "hub",
    approvalStatus: "approved",
  },
  {
    id: "2",
    nameEn: "Tiger Prawns",
    nameTa: "இறால்",
    sku: "PRWN-001",
    category: "prawns",
    description: "Fresh tiger prawns",
    images: [],
    variants: [
      {
        id: "v2",
        type: "Cleaned",
        size: "Large",
        grossWeight: "500g",
        netWeight: "400g",
        pieces: "15-20 pieces",
        serves: "2-3",
        price: 650,
        stock: 15,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    moduleType: "hub",
    approvalStatus: "approved",
  },
  {
    id: "3",
    nameEn: "Chicken Breast",
    nameTa: "சிக்கன் மார்பு",
    sku: "CHKN-001",
    category: "chicken",
    description: "Fresh chicken breast",
    images: [],
    variants: [
      {
        id: "v3",
        type: "Boneless",
        size: "Medium",
        grossWeight: "500g",
        netWeight: "450g",
        pieces: "2-3 pieces",
        serves: "2-3",
        price: 280,
        stock: 50,
      },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: "same_day",
    sourceType: "store",
    moduleType: "store",
    approvalStatus: "approved",
  },
];

// Mock membership plans - in real app, fetch from API
const mockMembershipPlans: MembershipPlan[] = [
  {
    id: '1',
    name: 'Elite Membership',
    duration: 365,
    price: 1299,
    monthlyEquivalent: 108,
    benefits: [
      { id: 'b1', type: 'free_delivery', label: 'Free Delivery', value: 'Above ₹349', isEditable: true },
      { id: 'b2', type: 'no_surge', label: 'No Surge Pricing', value: 'During peak/rain time', isEditable: false },
      { id: 'b3', type: 'welcome_wallet', label: 'Welcome Wallet Cash', value: '₹300 (60 days expiry)', isEditable: true },
      { id: 'b4', type: 'extra_discount', label: 'Extra Discount', value: '10% on selected products', isEditable: true },
      { id: 'b5', type: 'priority_order', label: 'Priority Processing', value: 'Faster order handling', isEditable: false },
      { id: 'b6', type: 'faster_delivery', label: 'Faster Delivery', value: 'Express shipping', isEditable: false },
      { id: 'b7', type: 'special_rewards', label: 'Special Rewards', value: 'Birthday & festival offers', isEditable: true }
    ],
    welcomeWallet: 300,
    walletExpiry: 60,
    discountPercentage: 10,
    isActive: true,
    createdAt: '2024-02-10'
  },
  {
    id: '2',
    name: 'Premium Membership',
    duration: 180,
    price: 699,
    monthlyEquivalent: 116,
    benefits: [
      { id: 'b1', type: 'free_delivery', label: 'Free Delivery', value: 'Above ₹499', isEditable: true },
      { id: 'b2', type: 'welcome_wallet', label: 'Welcome Wallet Cash', value: '₹150 (30 days expiry)', isEditable: true },
      { id: 'b3', type: 'extra_discount', label: 'Extra Discount', value: '5% on selected products', isEditable: true },
      { id: 'b4', type: 'special_rewards', label: 'Special Rewards', value: 'Festival offers', isEditable: true }
    ],
    welcomeWallet: 150,
    walletExpiry: 30,
    discountPercentage: 5,
    isActive: true,
    createdAt: '2024-02-10'
  }
];

const dummySales: FlashSale[] = [
  {
    id: '1',
    name: 'Weekend Mega Sale',
    type: 'discount_coupon',
    description: 'Get 30% off on all orders',
    startTime: '2024-02-15T00:00',
    endTime: '2024-02-15T23:59',
    timerType: 'datetime',
    couponCode: 'WEEKEND30',
    discountValue: 30,
    discountType: 'percentage',
    notifications: [
      { type: 'before_start', minutes: 15, message: 'Flash sale starting in 15 minutes!', enabled: true },
      { type: 'before_end', minutes: 15, message: 'Last 15 minutes! Hurry up!', enabled: true }
    ],
    status: 'scheduled',
    isActive: true,
    createdAt: '2024-02-10'
  },
  {
    id: '2',
    name: 'Fresh Chicken Flash Sale',
    type: 'product_sale',
    description: 'Limited stock chicken at special prices',
    startTime: '2024-02-14T10:00',
    endTime: '2024-02-14T22:00',
    timerType: 'fixed',
    fixedDuration: 12,
    selectedProducts: [
      { productId: '3', variantId: 'v3', discountPrice: 220, flashOfferDetails: 'Limited time offer - Save ₹60!' }
    ],
    notifications: [
      { type: 'before_start', minutes: 15, message: 'Chicken flash sale starts soon!', enabled: true },
      { type: 'popup_reminder', minutes: 5, message: 'Only 5 minutes left!', enabled: true }
    ],
    status: 'active',
    isActive: true,
    createdAt: '2024-02-09'
  }
];

export const FlashSaleConfig = () => {
  const [sales, setSales] = useState<FlashSale[]>(dummySales);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<FlashSale | null>(null);
  
  const [saleType, setSaleType] = useState<FlashSaleType>('discount_coupon');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    timerType: 'datetime' as 'fixed' | 'datetime' | 'recurring',
    fixedDuration: 12
  });
  
  const [selectedProducts, setSelectedProducts] = useState<FlashSaleProductConfig[]>([]);
  const [selectedMembership, setSelectedMembership] = useState<FlashSaleMembershipConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showMembershipSelector, setShowMembershipSelector] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { type: 'before_start', minutes: 15, message: 'Flash sale starting in 15 minutes!', enabled: true },
    { type: 'before_end', minutes: 15, message: 'Last 15 minutes! Hurry up!', enabled: true },
    { type: 'popup_reminder', minutes: 5, message: 'Only 5 minutes left!', enabled: false }
  ]);

  const getTypeIcon = (type: FlashSaleType) => {
    const icons = {
      discount_coupon: Tag,
      product_sale: Package,
      members_only: Users,
      membership_subscription: Users
    };
    return icons[type];
  };

  const getTypeColor = (type: FlashSaleType) => {
    const colors = {
      discount_coupon: 'bg-blue-100 text-blue-700',
      product_sale: 'bg-emerald-100 text-emerald-700',
      members_only: 'bg-indigo-100 text-indigo-700',
      membership_subscription: 'bg-amber-100 text-amber-700'
    };
    return colors[type];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      scheduled: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      ended: 'bg-red-100 text-red-700'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const filteredProducts = mockProducts.filter(p => 
    p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nameTa.includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProductToFlashSale = (productId: string, variantId: string) => {
    const exists = selectedProducts.find(p => p.productId === productId && p.variantId === variantId);
    if (exists) {
      alert('This product variant is already added!');
      return;
    }
    
    const product = mockProducts.find(p => p.id === productId);
    const variant = product?.variants.find(v => v.id === variantId);
    
    if (product && variant) {
      setSelectedProducts([...selectedProducts, {
        productId,
        variantId,
        discountPrice: variant.price * 0.8, // Default 20% discount
        flashOfferDetails: ''
      }]);
    }
  };

  const removeProductFromFlashSale = (productId: string, variantId: string) => {
    setSelectedProducts(selectedProducts.filter(p => !(p.productId === productId && p.variantId === variantId)));
  };

  const updateFlashSaleProduct = (productId: string, variantId: string, field: keyof FlashSaleProductConfig, value: any) => {
    setSelectedProducts(selectedProducts.map(p => 
      p.productId === productId && p.variantId === variantId 
        ? { ...p, [field]: value } 
        : p
    ));
  };

  const getProductDetails = (productId: string, variantId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    const variant = product?.variants.find(v => v.id === variantId);
    return { product, variant };
  };

  const getMembershipDetails = (membershipId: string) => {
    return mockMembershipPlans.find(m => m.id === membershipId);
  };

  const selectMembership = (membershipId: string) => {
    const membership = mockMembershipPlans.find(m => m.id === membershipId);
    if (membership) {
      setSelectedMembership({
        membershipPlanId: membershipId,
        discountPrice: membership.price * 0.85, // Default 15% discount
        flashOfferDetails: ''
      });
      setShowMembershipSelector(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newSale: FlashSale = {
      id: `fs${Date.now()}`,
      name: formData.name,
      type: saleType,
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime,
      timerType: formData.timerType,
      fixedDuration: formData.fixedDuration,
      selectedProducts: selectedProducts.length > 0 ? selectedProducts : undefined,
      selectedMembership: selectedMembership || undefined,
      notifications,
      status: 'draft',
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSales([...sales, newSale]);
    setShowCreateModal(false);
    resetForm();
    alert('Flash sale created successfully!');
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', startTime: '', endTime: '', timerType: 'datetime', fixedDuration: 12 });
    setSelectedProducts([]);
    setSelectedMembership(null);
    setSaleType('discount_coupon');
    setSearchTerm('');
  };

  const handleView = (sale: FlashSale) => {
    setSelectedSale(sale);
    setShowViewModal(true);
  };

  const handleEdit = (sale: FlashSale) => {
    setSelectedSale(sale);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this flash sale?')) {
      setSales(sales.filter(s => s.id !== id));
    }
  };

  const handleClone = (sale: FlashSale) => {
    const cloned = { ...sale, id: `fs${Date.now()}`, name: `${sale.name} (Copy)`, status: 'draft' as const };
    setSales([...sales, cloned]);
    alert('Flash sale cloned successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flash Sale Management</h1>
          <p className="text-gray-600 mt-1">Create and manage flash sale campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Flash Sale
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold">{sales.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold">{sales.filter(s => s.status === 'active').length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-2xl font-bold">{sales.filter(s => s.status === 'scheduled').length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Draft</p>
          <p className="text-2xl font-bold">{sales.filter(s => s.status === 'draft').length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Ended</p>
          <p className="text-2xl font-bold">{sales.filter(s => s.status === 'ended').length}</p>
        </Card>
      </div>

      {/* Sales List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => {
                const Icon = getTypeIcon(sale.type);
                return (
                  <tr key={sale.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{sale.name}</div>
                      <div className="text-sm text-gray-500">{sale.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(sale.type)}`}>
                        <Icon className="h-3 w-3" />
                        {sale.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Clock className="h-4 w-4" />
                        {sale.timerType === 'fixed' ? `${sale.fixedDuration}h` : 'Custom'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(sale.status)}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${sale.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {sale.isActive ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleView(sale)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleEdit(sale)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleClone(sale)} className="p-2 hover:bg-gray-100 rounded-lg text-indigo-600">
                          <Copy className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(sale.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Flash Sale" size="lg">
        <form onSubmit={handleCreate} className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Sale Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flash Sale Type</label>
            <select 
              value={saleType} 
              onChange={(e) => setSaleType(e.target.value as FlashSaleType)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="discount_coupon">Discount Coupon Flash Sale</option>
              <option value="product_sale">Product Flash Sale</option>
              <option value="members_only">Members-Only Flash Sale</option>
              <option value="membership_subscription">Membership Subscription Sale</option>
            </select>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <Input 
              label="Sale Name" 
              placeholder="Weekend Mega Sale" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
            <Input 
              label="Description" 
              placeholder="Get amazing discounts" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required 
            />
          </div>

          {/* Timer Configuration */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-4">Timer Configuration</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timer Type</label>
              <select 
                value={formData.timerType} 
                onChange={(e) => setFormData({ ...formData, timerType: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 mb-4"
              >
                <option value="datetime">Specific Date & Time</option>
                <option value="fixed">Fixed Duration</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>

            {formData.timerType === 'fixed' ? (
              <Input 
                label="Duration (hours)" 
                type="number" 
                placeholder="12"
                value={formData.fixedDuration}
                onChange={(e) => setFormData({ ...formData, fixedDuration: Number(e.target.value) })}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Start Time" 
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required 
                />
                <Input 
                  label="End Time" 
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required 
                />
              </div>
            )}
          </div>

          {/* Discount Coupon Fields */}
          {saleType === 'discount_coupon' && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Coupon Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Coupon Code" placeholder="WEEKEND30" required />
                <Input label="Discount Value" type="number" placeholder="30" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
            </div>
          )}

          {/* Product Configuration */}
          {(saleType === 'product_sale' || saleType === 'members_only') && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Select Products from Inventory</h3>
                <Button type="button" size="sm" variant="secondary" onClick={() => setShowProductSelector(!showProductSelector)}>
                  <Plus className="h-4 w-4 mr-1" />
                  {showProductSelector ? 'Hide Products' : 'Browse Products'}
                </Button>
              </div>

              {/* Product Selector */}
              {showProductSelector && (
                <div className="mb-4 border rounded-lg p-4 bg-gray-50">
                  <div className="mb-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-white border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-medium text-gray-900">{product.nameEn}</span>
                            <span className="text-sm text-gray-600 ml-2">({product.nameTa})</span>
                            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {product.variants.map((variant) => {
                            const isAdded = selectedProducts.some(p => p.productId === product.id && p.variantId === variant.id);
                            return (
                              <div key={variant.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                                <div className="flex-1">
                                  <span className="font-medium">{variant.type}</span>
                                  <span className="text-gray-600 ml-2">{variant.netWeight}</span>
                                  <span className="text-gray-600 ml-2">₹{variant.price}</span>
                                  <span className="text-gray-500 ml-2">Stock: {variant.stock}</span>
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={isAdded ? "secondary" : "primary"}
                                  onClick={() => isAdded ? removeProductFromFlashSale(product.id, variant.id) : addProductToFlashSale(product.id, variant.id)}
                                  disabled={isAdded}
                                >
                                  {isAdded ? 'Added' : 'Add'}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Products */}
              {selectedProducts.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">Selected Products ({selectedProducts.length})</h4>
                  {selectedProducts.map((config) => {
                    const { product, variant } = getProductDetails(config.productId, config.variantId);
                    if (!product || !variant) return null;

                    return (
                      <div key={`${config.productId}-${config.variantId}`} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-medium text-gray-900">{product.nameEn} - {variant.type}</div>
                            <div className="text-sm text-gray-600">{variant.netWeight} • Original: ₹{variant.price}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProductFromFlashSale(config.productId, config.variantId)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Flash Sale Price (₹)</label>
                            <input
                              type="number"
                              value={config.discountPrice}
                              onChange={(e) => updateFlashSaleProduct(config.productId, config.variantId, 'discountPrice', Number(e.target.value))}
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                              required
                            />
                            <div className="text-xs text-green-600 mt-1">
                              Save ₹{variant.price - config.discountPrice} ({Math.round((1 - config.discountPrice / variant.price) * 100)}% off)
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Flash Offer Details</label>
                            <textarea
                              value={config.flashOfferDetails}
                              onChange={(e) => updateFlashSaleProduct(config.productId, config.variantId, 'flashOfferDetails', e.target.value)}
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                              rows={2}
                              placeholder="e.g., Limited stock! Grab now!"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedProducts.length === 0 && !showProductSelector && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No products selected. Click "Browse Products" to add products.</p>
                </div>
              )}
            </div>
          )}

          {/* Membership Plan */}
          {saleType === 'membership_subscription' && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Select Membership Plan</h3>
                {!selectedMembership && (
                  <Button type="button" size="sm" variant="secondary" onClick={() => setShowMembershipSelector(!showMembershipSelector)}>
                    <Plus className="h-4 w-4 mr-1" />
                    {showMembershipSelector ? 'Hide Plans' : 'Browse Plans'}
                  </Button>
                )}
              </div>

              {/* Membership Selector */}
              {showMembershipSelector && !selectedMembership && (
                <div className="mb-4 border rounded-lg p-4 bg-gray-50">
                  <div className="space-y-3">
                    {mockMembershipPlans.map((plan) => (
                      <div key={plan.id} className="bg-white border rounded-lg p-4 hover:border-blue-500 cursor-pointer" onClick={() => selectMembership(plan.id)}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Crown className="h-5 w-5 text-amber-600" />
                              <span className="font-semibold text-gray-900">{plan.name}</span>
                              <span className={`text-xs px-2 py-1 rounded ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {plan.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">{plan.duration} days • ₹{plan.monthlyEquivalent}/month equivalent</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">₹{plan.price}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="text-sm">
                            <span className="text-gray-600">Welcome Wallet:</span>
                            <span className="font-medium ml-1">₹{plan.welcomeWallet}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Extra Discount:</span>
                            <span className="font-medium ml-1">{plan.discountPercentage}%</span>
                          </div>
                        </div>

                        <div className="border-t pt-2">
                          <div className="text-xs font-medium text-gray-700 mb-2">Benefits:</div>
                          <div className="flex flex-wrap gap-1">
                            {plan.benefits.slice(0, 4).map((benefit) => (
                              <span key={benefit.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {benefit.label}
                              </span>
                            ))}
                            {plan.benefits.length > 4 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{plan.benefits.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Membership */}
              {selectedMembership && (
                <div className="space-y-3">
                  {(() => {
                    const membership = getMembershipDetails(selectedMembership.membershipPlanId);
                    if (!membership) return null;

                    return (
                      <div className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Crown className="h-5 w-5 text-amber-600" />
                              <span className="font-semibold text-gray-900">{membership.name}</span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {membership.duration} days • Original Price: ₹{membership.price}
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {membership.benefits.slice(0, 3).map((benefit) => (
                                <span key={benefit.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                  {benefit.label}: {benefit.value}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedMembership(null)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Flash Sale Price (₹)</label>
                            <input
                              type="number"
                              value={selectedMembership.discountPrice}
                              onChange={(e) => setSelectedMembership({ ...selectedMembership, discountPrice: Number(e.target.value) })}
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                              required
                            />
                            <div className="text-xs text-green-600 mt-1">
                              Save ₹{membership.price - selectedMembership.discountPrice} ({Math.round((1 - selectedMembership.discountPrice / membership.price) * 100)}% off)
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Flash Offer Details</label>
                            <textarea
                              value={selectedMembership.flashOfferDetails}
                              onChange={(e) => setSelectedMembership({ ...selectedMembership, flashOfferDetails: e.target.value })}
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                              rows={2}
                              placeholder="e.g., Limited time! Join now and save big!"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {!selectedMembership && !showMembershipSelector && (
                <div className="text-center py-8 text-gray-500">
                  <Crown className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No membership plan selected. Click "Browse Plans" to select.</p>
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">Notification Settings</h3>
            </div>
            
            <div className="space-y-3">
              {notifications.map((notif, idx) => (
                <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={notif.enabled}
                        onChange={(e) => {
                          const updated = [...notifications];
                          updated[idx].enabled = e.target.checked;
                          setNotifications(updated);
                        }}
                        className="rounded" 
                      />
                      <span className="text-sm font-medium capitalize">
                        {notif.type.replace('_', ' ')} ({notif.minutes} min)
                      </span>
                    </label>
                  </div>
                  <Input 
                    placeholder="Notification message"
                    value={notif.message}
                    onChange={(e) => {
                      const updated = [...notifications];
                      updated[idx].message = e.target.value;
                      setNotifications(updated);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-white">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="button" variant="secondary" className="flex-1">
              Save as Draft
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Publish Sale
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Flash Sale Details" size="lg">
        {selectedSale && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Sale Name</p>
                <p className="font-medium">{selectedSale.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedSale.type)}`}>
                  {selectedSale.type.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-medium">{selectedSale.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Time</p>
                <p className="font-medium">{selectedSale.startTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Time</p>
                <p className="font-medium">{selectedSale.endTime}</p>
              </div>
            </div>

            {selectedSale.selectedProducts && selectedSale.selectedProducts.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Products</h3>
                <div className="space-y-3">
                  {selectedSale.selectedProducts.map((config) => {
                    const { product, variant } = getProductDetails(config.productId, config.variantId);
                    if (!product || !variant) return null;

                    return (
                      <div key={`${config.productId}-${config.variantId}`} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-medium text-gray-900">{product.nameEn}</span>
                            <span className="text-sm text-gray-600 ml-2">({product.nameTa})</span>
                          </div>
                          <span className="text-sm text-gray-600">Stock: {variant.stock}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex items-center justify-between bg-white p-2 rounded text-sm">
                          <span className="font-medium">{variant.type} - {variant.netWeight}</span>
                          <div className="flex items-center gap-3">
                            <span className="line-through text-gray-500">₹{variant.price}</span>
                            <span className="font-medium text-green-600">₹{config.discountPrice}</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {Math.round((1 - config.discountPrice / variant.price) * 100)}% OFF
                            </span>
                          </div>
                        </div>
                        {config.flashOfferDetails && (
                          <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                            {config.flashOfferDetails}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedSale.selectedMembership && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Membership Plan</h3>
                {(() => {
                  const membership = getMembershipDetails(selectedSale.selectedMembership.membershipPlanId);
                  if (!membership) return null;

                  return (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-amber-600" />
                          <span className="font-medium text-gray-900">{membership.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{membership.duration} days</span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white p-3 rounded mb-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-xs text-gray-600">Original Price</span>
                            <div className="line-through text-gray-500 font-medium">₹{membership.price}</div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">Flash Sale Price</span>
                            <div className="font-bold text-green-600 text-lg">₹{selectedSale.selectedMembership.discountPrice}</div>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                            {Math.round((1 - selectedSale.selectedMembership.discountPrice / membership.price) * 100)}% OFF
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-xs font-medium text-gray-700 mb-2">Benefits:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {membership.benefits.map((benefit) => (
                            <div key={benefit.id} className="bg-white p-2 rounded text-xs">
                              <div className="font-medium text-gray-900">{benefit.label}</div>
                              <div className="text-gray-600">{benefit.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedSale.selectedMembership.flashOfferDetails && (
                        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                          {selectedSale.selectedMembership.flashOfferDetails}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {selectedSale.notifications.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Notifications</h3>
                <div className="space-y-2">
                  {selectedSale.notifications.filter(n => n.enabled).map((notif, idx) => (
                    <div key={idx} className="bg-blue-50 p-3 rounded text-sm">
                      <div className="font-medium capitalize">{notif.type.replace('_', ' ')}</div>
                      <div className="text-gray-600">{notif.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Modal - Similar to Create */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Flash Sale" size="lg">
        {selectedSale && (
          <form onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); alert('Updated!'); }} className="space-y-4">
            <Input label="Sale Name" defaultValue={selectedSale.name} required />
            <Input label="Description" defaultValue={selectedSale.description} required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Time" type="datetime-local" defaultValue={selectedSale.startTime} required />
              <Input label="End Time" type="datetime-local" defaultValue={selectedSale.endTime} required />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={selectedSale.isActive} className="rounded" />
              <label className="text-sm">Active</label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Update Sale
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
