import { useState } from 'react';
import { Card, Button, Input, Modal } from '../ui';
import { Plus, Edit, Crown, Gift, TrendingUp, Users, Wallet, Truck, Zap, DollarSign, Star, Sparkles, Shield, Eye } from 'lucide-react';

interface MembershipBenefit {
  id: string;
  icon: string;
  title: string;
  description: string;
  isActive: boolean;
}

interface MembershipPlan {
  id: string;
  name: string;
  duration: number;
  price: number;
  monthlyEquivalent: number;
  welcomeWallet: number;
  walletExpiry: number;
  discountPercentage: number;
  freeDeliveryThreshold: number;
  benefits: MembershipBenefit[];
  isActive: boolean;
  createdAt: string;
}

interface MarketingPlacement {
  id: string;
  location: 'homepage_banner' | 'flash_banner' | 'product_page' | 'cart_page' | 'checkout_page';
  title: string;
  message: string;
  ctaText: string;
  isActive: boolean;
}

interface Analytics {
  totalMembers: number;
  activeMembers: number;
  revenue: number;
  conversionRate: number;
  avgSavings: number;
  avgOrderValue: number;
}

const dummyPlan: MembershipPlan = {
  id: '1',
  name: 'Bay Hawk Elite',
  duration: 365,
  price: 1299,
  monthlyEquivalent: 108,
  welcomeWallet: 300,
  walletExpiry: 60,
  discountPercentage: 10,
  freeDeliveryThreshold: 349,
  benefits: [
    {
      id: 'b1',
      icon: 'truck',
      title: 'Free Delivery from ₹349',
      description: 'Members | Delivery charges applicable (Non-members)',
      isActive: true
    },
    {
      id: 'b2',
      icon: 'zap',
      title: 'Priority Processing & Faster Delivery',
      description: 'Get priority during busy hours',
      isActive: true
    },
    {
      id: 'b3',
      icon: 'wallet',
      title: '₹300 Welcome Cash in Wallet',
      description: 'Ready to use on your next order (Expires in 60 days)',
      isActive: true
    },
    {
      id: 'b4',
      icon: 'dollar',
      title: 'Save 10% Extra on Premium Cuts',
      description: 'Pomfret, tiger prawns, lobster & more (Only on selected products)',
      isActive: true
    },
    {
      id: 'b5',
      icon: 'shield',
      title: 'Never Pay Surge Pricing',
      description: 'Same price in rain, weekends and peak hours',
      isActive: true
    },
    {
      id: 'b6',
      icon: 'sparkles',
      title: 'Little Surprises',
      description: 'On birthdays, anniversaries and festivals',
      isActive: true
    }
  ],
  isActive: true,
  createdAt: '2024-02-10'
};

const dummyPlacements: MarketingPlacement[] = [
  {
    id: 'p1',
    location: 'homepage_banner',
    title: 'Join Elite Membership',
    message: 'Save more on every order with exclusive benefits',
    ctaText: 'Join Now',
    isActive: true
  },
  {
    id: 'p2',
    location: 'checkout_page',
    title: 'Elite Members Save More',
    message: 'Save delivery charges + surge fee + extra 10% discount on selected products',
    ctaText: 'Join Membership & Save',
    isActive: true
  }
];

const dummyAnalytics: Analytics = {
  totalMembers: 1250,
  activeMembers: 1180,
  revenue: 1623750,
  conversionRate: 8.5,
  avgSavings: 450,
  avgOrderValue: 850
};

export const MembershipConfig = () => {
  const [plan, setPlan] = useState<MembershipPlan>(dummyPlan);
  const [placements, setPlacements] = useState<MarketingPlacement[]>(dummyPlacements);
  const [analytics] = useState<Analytics>(dummyAnalytics);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [showAddPlacementModal, setShowAddPlacementModal] = useState(false);
  const [showEditPlacementModal, setShowEditPlacementModal] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<MarketingPlacement | null>(null);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      truck: Truck,
      zap: Zap,
      wallet: Wallet,
      dollar: DollarSign,
      shield: Shield,
      sparkles: Sparkles,
      gift: Gift
    };
    return icons[iconName] || Gift;
  };

  const getBenefitColor = (iconName: string) => {
    const colors: Record<string, string> = {
      truck: 'bg-blue-50 border-blue-200',
      zap: 'bg-purple-50 border-purple-200',
      wallet: 'bg-green-50 border-green-200',
      dollar: 'bg-emerald-50 border-emerald-200',
      shield: 'bg-orange-50 border-orange-200',
      sparkles: 'bg-pink-50 border-pink-200'
    };
    return colors[iconName] || 'bg-gray-50 border-gray-200';
  };

  const handleUpdateBenefits = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedBenefits = plan.benefits.map(benefit => ({
      ...benefit,
      title: formData.get(`title_${benefit.id}`) as string,
      description: formData.get(`description_${benefit.id}`) as string,
      isActive: formData.get(`active_${benefit.id}`) === 'on'
    }));
    
    setPlan({ ...plan, benefits: updatedBenefits });
    setShowBenefitsModal(false);
    alert('Benefits updated successfully!');
  };

  const addNewBenefit = () => {
    const newBenefit: MembershipBenefit = {
      id: `b${Date.now()}`,
      icon: 'gift',
      title: 'New Benefit',
      description: 'Benefit description',
      isActive: true
    };
    setPlan({ ...plan, benefits: [...plan.benefits, newBenefit] });
  };

  const removeBenefit = (benefitId: string) => {
    setPlan({ ...plan, benefits: plan.benefits.filter(b => b.id !== benefitId) });
  };

  const handleCreatePlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPlan: MembershipPlan = {
      id: `plan${Date.now()}`,
      name: formData.get('name') as string,
      duration: Number(formData.get('duration')),
      price: Number(formData.get('price')),
      monthlyEquivalent: Number(formData.get('monthlyEquivalent')),
      welcomeWallet: Number(formData.get('welcomeWallet')),
      walletExpiry: Number(formData.get('walletExpiry')),
      discountPercentage: Number(formData.get('discountPercentage')),
      freeDeliveryThreshold: Number(formData.get('freeDeliveryThreshold')),
      isActive: formData.get('isActive') === 'on',
      benefits: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPlan(newPlan);
    setShowCreateModal(false);
    alert('Subscription plan created successfully!');
  };

  const handleEditPlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedPlan: MembershipPlan = {
      ...plan,
      name: formData.get('name') as string,
      duration: Number(formData.get('duration')),
      price: Number(formData.get('price')),
      monthlyEquivalent: Number(formData.get('monthlyEquivalent')),
      welcomeWallet: Number(formData.get('welcomeWallet')),
      walletExpiry: Number(formData.get('walletExpiry')),
      discountPercentage: Number(formData.get('discountPercentage')),
      freeDeliveryThreshold: Number(formData.get('freeDeliveryThreshold')),
      isActive: formData.get('isActive') === 'on',
      benefits: plan.benefits
    };
    setPlan(updatedPlan);
    setShowEditModal(false);
    alert('Subscription plan updated successfully!');
  };

  const handleAddPlacement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPlacement: MarketingPlacement = {
      id: `p${Date.now()}`,
      location: formData.get('location') as any,
      title: formData.get('title') as string,
      message: formData.get('message') as string,
      ctaText: formData.get('ctaText') as string,
      isActive: formData.get('isActive') === 'on'
    };
    setPlacements([...placements, newPlacement]);
    setShowAddPlacementModal(false);
    alert('Placement added successfully!');
  };

  const handleEditPlacement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlacement) return;
    const formData = new FormData(e.currentTarget);
    const updatedPlacements = placements.map(p => 
      p.id === selectedPlacement.id ? {
        ...p,
        location: formData.get('location') as any,
        title: formData.get('title') as string,
        message: formData.get('message') as string,
        ctaText: formData.get('ctaText') as string,
        isActive: formData.get('isActive') === 'on'
      } : p
    );
    setPlacements(updatedPlacements);
    setShowEditPlacementModal(false);
    alert('Placement updated successfully!');
  };

  const togglePlacementStatus = (id: string) => {
    setPlacements(placements.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Elite Subscription Management</h1>
            <p className="text-gray-600 mt-1">Configure membership plans, benefits, and marketing</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowViewModal(true)} variant="secondary">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button onClick={() => setShowEditModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Edit className="h-4 w-4 mr-2" />
              Edit Plan
            </Button>
          </div>
        </div>
        
        {/* Marketing Hook */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <Shield className="h-8 w-8 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                "The Only Seafood Membership That Guarantees Your Price"
              </h2>
              <p className="text-gray-700">
                Join Bay Hawk Elite and enjoy exclusive benefits designed for seafood lovers who value quality, savings, and convenience.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-gray-600">Total Members</p>
          </div>
          <p className="text-2xl font-bold">{analytics.totalMembers}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4 text-amber-600" />
            <p className="text-sm text-gray-600">Active</p>
          </div>
          <p className="text-2xl font-bold">{analytics.activeMembers}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-sm text-gray-600">Revenue</p>
          </div>
          <p className="text-2xl font-bold">₹{(analytics.revenue / 1000).toFixed(0)}K</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <p className="text-sm text-gray-600">Conversion</p>
          </div>
          <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-emerald-600" />
            <p className="text-sm text-gray-600">Avg Savings</p>
          </div>
          <p className="text-2xl font-bold">₹{analytics.avgSavings}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-purple-600" />
            <p className="text-sm text-gray-600">Avg Order</p>
          </div>
          <p className="text-2xl font-bold">₹{analytics.avgOrderValue}</p>
        </Card>
      </div>

      {/* Current Plan Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Crown className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              <p className="text-sm text-gray-600">1 Year Subscription Plan</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">₹{plan.price}</div>
            <div className="text-sm text-gray-600">₹{plan.monthlyEquivalent}/month</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Welcome Wallet</p>
            <p className="text-xl font-bold text-blue-700">₹{plan.welcomeWallet}</p>
            <p className="text-xs text-gray-500">{plan.walletExpiry} days expiry</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Extra Discount</p>
            <p className="text-xl font-bold text-emerald-700">{plan.discountPercentage}%</p>
            <p className="text-xs text-gray-500">On premium cuts</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Free Delivery</p>
            <p className="text-xl font-bold text-purple-700">₹{plan.freeDeliveryThreshold}+</p>
            <p className="text-xs text-gray-500">Order threshold</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {plan.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </Card>

      {/* Benefits Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Membership Benefits
          </h3>
          <Button size="sm" variant="secondary" onClick={() => setShowBenefitsModal(true)}>
            <Edit className="h-4 w-4 mr-1" />
            Customize Benefits
          </Button>
        </div>
        <div className="space-y-3">
          {plan.benefits.filter(b => b.isActive).map((benefit) => {
            const Icon = getIcon(benefit.icon);
            const bgColor = getBenefitColor(benefit.icon);
            
            return (
              <div key={benefit.id} className={`flex items-start gap-4 p-4 ${bgColor} border rounded-lg`}>
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Icon className="h-5 w-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">{benefit.title}</p>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Rules & Conditions */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Rules & Conditions</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• 1 Year subscription plan price at ₹{plan.price}, per month ₹{plan.monthlyEquivalent}</p>
          <p>• Wallet cash added has the expiry time of {plan.walletExpiry} days</p>
          <p>• My Profile page needs to show how much is saved & how time used through the membership</p>
          <p>• {plan.discountPercentage}% extra offer only on selected products</p>
          <p>• While checkout, non-members should be notified: Elite members will save delivery charge, {plan.discountPercentage}% offer (on selected products) and surge charge (if applicable)</p>
          <p>• Members can see how much they have saved while placing the order</p>
        </div>
      </Card>

      {/* Marketing Placements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Marketing Placements</h2>
          <Button size="sm" variant="secondary" onClick={() => setShowAddPlacementModal(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Placement
          </Button>
        </div>

        <div className="space-y-3">
          {placements.map((placement) => (
            <div key={placement.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                    {placement.location.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${placement.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {placement.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => togglePlacementStatus(placement.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {placement.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button 
                    onClick={() => { setSelectedPlacement(placement); setShowEditPlacementModal(true); }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">{placement.title}</p>
                <p className="text-sm text-gray-600 mb-2">{placement.message}</p>
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded">
                  {placement.ctaText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Customize Benefits Modal */}
      <Modal isOpen={showBenefitsModal} onClose={() => setShowBenefitsModal(false)} title="Customize Membership Benefits" size="lg">
        <form onSubmit={handleUpdateBenefits} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Configure membership benefits display and content</p>
            <Button type="button" size="sm" variant="secondary" onClick={addNewBenefit}>
              <Plus className="h-4 w-4 mr-1" />
              Add Benefit
            </Button>
          </div>

          <div className="space-y-4">
            {plan.benefits.map((benefit, index) => (
              <div key={benefit.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">Benefit {index + 1}</span>
                  {plan.benefits.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeBenefit(benefit.id)}
                      className="text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select 
                      name={`icon_${benefit.id}`}
                      defaultValue={benefit.icon}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      onChange={(e) => {
                        const updatedBenefits = plan.benefits.map(b => 
                          b.id === benefit.id ? { ...b, icon: e.target.value } : b
                        );
                        setPlan({ ...plan, benefits: updatedBenefits });
                      }}
                    >
                      <option value="truck">🚚 Truck (Delivery)</option>
                      <option value="zap">⚡ Zap (Priority)</option>
                      <option value="wallet">💰 Wallet (Money)</option>
                      <option value="dollar">💵 Dollar (Discount)</option>
                      <option value="shield">🛡️ Shield (Protection)</option>
                      <option value="sparkles">✨ Sparkles (Surprises)</option>
                      <option value="gift">🎁 Gift (Rewards)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name={`active_${benefit.id}`}
                      defaultChecked={benefit.isActive}
                      className="rounded"
                    />
                    <label className="text-sm">Active</label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input 
                    label="Benefit Title" 
                    name={`title_${benefit.id}`}
                    defaultValue={benefit.title}
                    placeholder="Free Delivery from ₹349"
                    required 
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      name={`description_${benefit.id}`}
                      defaultValue={benefit.description}
                      placeholder="Members | Delivery charges applicable (Non-members)"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      rows={2}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-white">
            <Button type="button" variant="secondary" onClick={() => setShowBenefitsModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Update Benefits
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Plan Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Subscription Plan" size="lg">
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <Input label="Plan Name" name="name" placeholder="Bay Hawk Elite" required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration (days)" name="duration" type="number" placeholder="365" required />
            <Input label="Price (₹)" name="price" type="number" placeholder="1299" required />
          </div>

          <Input label="Monthly Equivalent (₹)" name="monthlyEquivalent" type="number" placeholder="108" required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Welcome Wallet (₹)" name="welcomeWallet" type="number" placeholder="300" required />
            <Input label="Wallet Expiry (days)" name="walletExpiry" type="number" placeholder="60" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Extra Discount (%)" name="discountPercentage" type="number" placeholder="10" required />
            <Input label="Free Delivery Threshold (₹)" name="freeDeliveryThreshold" type="number" placeholder="349" required />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" defaultChecked className="rounded" />
            <label className="text-sm">Active Plan</label>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Create Plan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Plan Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Subscription Plan" size="lg">
        <form onSubmit={handleEditPlan} className="space-y-4">
          <Input label="Plan Name" name="name" defaultValue={plan.name} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration (days)" name="duration" type="number" defaultValue={plan.duration} required />
            <Input label="Price (₹)" name="price" type="number" defaultValue={plan.price} required />
          </div>

          <Input label="Monthly Equivalent (₹)" name="monthlyEquivalent" type="number" defaultValue={plan.monthlyEquivalent} required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Welcome Wallet (₹)" name="welcomeWallet" type="number" defaultValue={plan.welcomeWallet} required />
            <Input label="Wallet Expiry (days)" name="walletExpiry" type="number" defaultValue={plan.walletExpiry} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Extra Discount (%)" name="discountPercentage" type="number" defaultValue={plan.discountPercentage} required />
            <Input label="Free Delivery Threshold (₹)" name="freeDeliveryThreshold" type="number" defaultValue={plan.freeDeliveryThreshold} required />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" defaultChecked={plan.isActive} className="rounded" />
            <label className="text-sm">Active Plan</label>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Update Plan
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Subscription Plan Details" size="lg">
        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="p-4 bg-amber-100 rounded-lg">
              <Crown className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-600">1 Year Subscription Plan</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Plan Duration</p>
              <p className="font-semibold text-gray-900">{plan.duration} days (1 Year)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Plan Price</p>
              <p className="font-semibold text-gray-900">₹{plan.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Equivalent</p>
              <p className="font-semibold text-gray-900">₹{plan.monthlyEquivalent}/month</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Benefits Configuration</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Welcome Wallet</p>
                <p className="text-lg font-bold text-blue-700">₹{plan.welcomeWallet}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Wallet Expiry</p>
                <p className="text-lg font-bold text-blue-700">{plan.walletExpiry} days</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Extra Discount</p>
                <p className="text-lg font-bold text-emerald-700">{plan.discountPercentage}%</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Free Delivery From</p>
                <p className="text-lg font-bold text-purple-700">₹{plan.freeDeliveryThreshold}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Member Benefits</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <span>Free delivery from ₹{plan.freeDeliveryThreshold} (Non-members pay delivery charges)</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>Priority processing & faster delivery during busy hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-green-600" />
                <span>₹{plan.welcomeWallet} welcome cash (Expires in {plan.walletExpiry} days)</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span>{plan.discountPercentage}% extra on premium cuts (Selected products only)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-orange-600" />
                <span>Never pay surge pricing (Rain, weekends, peak hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-600" />
                <span>Little surprises on birthdays, anniversaries and festivals</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Rules & Conditions</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• 1 Year subscription plan price at ₹{plan.price}, per month ₹{plan.monthlyEquivalent}</p>
              <p>• Wallet cash added has the expiry time of {plan.walletExpiry} days</p>
              <p>• My Profile page shows savings & membership usage time</p>
              <p>• {plan.discountPercentage}% extra offer only on selected products</p>
              <p>• Non-members notified at checkout about member savings</p>
              <p>• Members can see savings while placing orders</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-500">Created on: {plan.createdAt}</p>
          </div>
        </div>
      </Modal>

      {/* Add Placement Modal */}
      <Modal isOpen={showAddPlacementModal} onClose={() => setShowAddPlacementModal(false)} title="Add Marketing Placement">
        <form onSubmit={handleAddPlacement} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select 
              name="location"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            >
              <option value="homepage_banner">Homepage Banner</option>
              <option value="flash_banner">Flash Banner</option>
              <option value="product_page">Product Page</option>
              <option value="cart_page">Cart Page</option>
              <option value="checkout_page">Checkout Page</option>
            </select>
          </div>

          <Input label="Title" name="title" placeholder="Join Elite Membership" required />
          <Input label="Message" name="message" placeholder="Save more on every order" required />
          <Input label="CTA Text" name="ctaText" placeholder="Join Now" required />

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" defaultChecked className="rounded" />
            <label className="text-sm">Active</label>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setShowAddPlacementModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Add Placement
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Placement Modal */}
      <Modal isOpen={showEditPlacementModal} onClose={() => setShowEditPlacementModal(false)} title="Edit Marketing Placement">
        {selectedPlacement && (
          <form onSubmit={handleEditPlacement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select 
                name="location"
                defaultValue={selectedPlacement.location}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              >
                <option value="homepage_banner">Homepage Banner</option>
                <option value="flash_banner">Flash Banner</option>
                <option value="product_page">Product Page</option>
                <option value="cart_page">Cart Page</option>
                <option value="checkout_page">Checkout Page</option>
              </select>
            </div>

            <Input label="Title" name="title" defaultValue={selectedPlacement.title} required />
            <Input label="Message" name="message" defaultValue={selectedPlacement.message} required />
            <Input label="CTA Text" name="ctaText" defaultValue={selectedPlacement.ctaText} required />

            <div className="flex items-center gap-2">
              <input type="checkbox" name="isActive" defaultChecked={selectedPlacement.isActive} className="rounded" />
              <label className="text-sm">Active</label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => setShowEditPlacementModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Update Placement
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
