import { useState } from 'react';
import { Card, Button, Input, Modal } from '../ui';
import { Plus, Eye, Edit, Trash2, ChevronDown, ChevronUp, AlertCircle, Copy } from 'lucide-react';

interface RewardAmount {
  min: number;
  max: number;
  probability: number;
}

interface SpinReward {
  id: string;
  type: 'wallet_credit' | 'instant_discount' | 'free_shipping' | 'fixed_wallet' | 'product_reward' | 'try_again';
  frequency: number;
  couponCode?: string;
  description: string;
  minCartValue?: number;
  rewardValue?: number;
  amountRanges?: RewardAmount[];
}

interface OrderSlab {
  id: string;
  minAmount: number;
  maxAmount: number | null;
  rewards: SpinReward[];
}

interface SpinCampaign {
  id: string;
  name: string;
  description: string;
  slabs: OrderSlab[];
  spinLimit: number;
  expiryDate: string;
  userEligibility: string[];
  isActive: boolean;
  createdAt: string;
}

const dummyCampaigns: SpinCampaign[] = [
  {
    id: '1',
    name: 'New Year Spin Campaign',
    description: 'Special rewards for new year orders',
    slabs: [
      {
        id: 's1',
        minAmount: 0,
        maxAmount: 600,
        rewards: [
          { id: 'r1', type: 'wallet_credit', frequency: 30, description: '₹10-50 Wallet Credit', amountRanges: [{ min: 10, max: 50, probability: 100 }] },
          { id: 'r2', type: 'free_shipping', frequency: 20, description: 'Free Shipping', couponCode: 'FREESHIP' },
          { id: 'r3', type: 'try_again', frequency: 50, description: 'Better Luck Next Time' }
        ]
      },
      {
        id: 's2',
        minAmount: 601,
        maxAmount: 1499,
        rewards: [
          { id: 'r4', type: 'instant_discount', frequency: 25, description: '10% Off', couponCode: 'SAVE10', rewardValue: 10 },
          { id: 'r5', type: 'wallet_credit', frequency: 35, description: '₹50-100 Wallet Credit', amountRanges: [{ min: 50, max: 100, probability: 100 }] },
          { id: 'r6', type: 'try_again', frequency: 40, description: 'Try Again' }
        ]
      }
    ],
    spinLimit: 3,
    expiryDate: '2024-12-31',
    userEligibility: ['all'],
    isActive: true,
    createdAt: '2024-02-10'
  }
];

export const SpinWheelConfig = () => {
  const [campaigns, setCampaigns] = useState<SpinCampaign[]>(dummyCampaigns);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<SpinCampaign | null>(null);
  const [expandedSlabs, setExpandedSlabs] = useState<Record<string, boolean>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    spinLimit: 3,
    expiryDate: '',
    eligibility: [] as string[]
  });
  const [formSlabs, setFormSlabs] = useState<OrderSlab[]>([
    {
      id: 's1',
      minAmount: 0,
      maxAmount: 600,
      rewards: []
    }
  ]);

  const toggleSlab = (slabId: string) => {
    setExpandedSlabs(prev => ({ ...prev, [slabId]: !prev[slabId] }));
  };

  const addSlab = () => {
    const newSlab: OrderSlab = {
      id: `s${Date.now()}`,
      minAmount: 0,
      maxAmount: null,
      rewards: []
    };
    setFormSlabs([...formSlabs, newSlab]);
  };

  const removeSlab = (slabId: string) => {
    setFormSlabs(formSlabs.filter(s => s.id !== slabId));
  };

  const updateSlab = (slabId: string, field: 'minAmount' | 'maxAmount', value: number | null) => {
    setFormSlabs(formSlabs.map(s => s.id === slabId ? { ...s, [field]: value } : s));
  };

  const addReward = (slabId: string) => {
    const newReward: SpinReward = {
      id: `r${Date.now()}`,
      type: 'wallet_credit',
      frequency: 0,
      description: ''
    };
    setFormSlabs(formSlabs.map(s => 
      s.id === slabId ? { ...s, rewards: [...s.rewards, newReward] } : s
    ));
  };

  const removeReward = (slabId: string, rewardId: string) => {
    setFormSlabs(formSlabs.map(s => 
      s.id === slabId ? { ...s, rewards: s.rewards.filter(r => r.id !== rewardId) } : s
    ));
  };

  const updateReward = (slabId: string, rewardId: string, field: string, value: any) => {
    setFormSlabs(formSlabs.map(s => 
      s.id === slabId ? {
        ...s,
        rewards: s.rewards.map(r => r.id === rewardId ? { ...r, [field]: value } : r)
      } : s
    ));
  };

  const duplicateSlab = (slabId: string) => {
    const slab = formSlabs.find(s => s.id === slabId);
    if (slab) {
      const newSlab = {
        ...slab,
        id: `s${Date.now()}`,
        rewards: slab.rewards.map(r => ({ ...r, id: `r${Date.now()}_${Math.random()}` }))
      };
      setFormSlabs([...formSlabs, newSlab]);
    }
  };

  const calculateTotalProbability = (rewards: SpinReward[]) => {
    return rewards.reduce((sum, r) => sum + r.frequency, 0);
  };

  const getRewardTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      wallet_credit: 'Wallet Credit',
      instant_discount: 'Instant Discount',
      free_shipping: 'Free Shipping',
      fixed_wallet: 'Fixed Wallet',
      product_reward: 'Product Reward',
      try_again: 'Try Again'
    };
    return labels[type] || type;
  };

  const handleView = (campaign: SpinCampaign) => {
    setSelectedCampaign(campaign);
    setShowViewModal(true);
  };

  const handleEdit = (campaign: SpinCampaign) => {
    setSelectedCampaign(campaign);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: SpinCampaign = {
      id: `c${Date.now()}`,
      name: formData.name,
      description: formData.description,
      slabs: formSlabs,
      spinLimit: formData.spinLimit,
      expiryDate: formData.expiryDate,
      userEligibility: formData.eligibility,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCampaigns([...campaigns, newCampaign]);
    setShowCreateModal(false);
    setFormData({ name: '', description: '', spinLimit: 3, expiryDate: '', eligibility: [] });
    setFormSlabs([{ id: 's1', minAmount: 0, maxAmount: 600, rewards: [] }]);
    alert('Campaign created successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Spin Wheel Campaigns</h1>
          <p className="text-gray-600 mt-1">Configure spin wheel rewards and probabilities</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Campaigns</p>
          <p className="text-2xl font-bold">{campaigns.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active Campaigns</p>
          <p className="text-2xl font-bold">{campaigns.filter(c => c.isActive).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Slabs</p>
          <p className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.slabs.length, 0)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Rewards</p>
          <p className="text-2xl font-bold">
            {campaigns.reduce((sum, c) => sum + c.slabs.reduce((s, slab) => s + slab.rewards.length, 0), 0)}
          </p>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slabs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spin Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-sm text-gray-500">{campaign.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{campaign.slabs.length} slabs</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{campaign.spinLimit} spins/user</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.expiryDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${campaign.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {campaign.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(campaign)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEdit(campaign)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(campaign.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Spin Wheel Campaign" size="lg">
        <form onSubmit={handleCreate} className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Campaign Details</h3>
            <Input 
              label="Campaign Name" 
              placeholder="New Year Spin Campaign" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
            <Input 
              label="Description" 
              placeholder="Campaign description" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Spin Limit per User" 
                type="number" 
                placeholder="3" 
                value={formData.spinLimit}
                onChange={(e) => setFormData({ ...formData, spinLimit: Number(e.target.value) })}
                required 
              />
              <Input 
                label="Expiry Date" 
                type="date" 
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User Eligibility</label>
              <div className="space-y-2">
                {['all', 'new_users', 'first_order', 'returning', 'referral'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={formData.eligibility.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, eligibility: [...formData.eligibility, option] });
                        } else {
                          setFormData({ ...formData, eligibility: formData.eligibility.filter(o => o !== option) });
                        }
                      }}
                    />
                    <span className="text-sm capitalize">{option.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Slabs */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Order Amount Slabs</h3>
              <Button type="button" size="sm" variant="secondary" onClick={addSlab}>
                <Plus className="h-4 w-4 mr-1" />
                Add Slab
              </Button>
            </div>

            <div className="space-y-4">
              {formSlabs.map((slab, slabIdx) => (
                <div key={slab.id} className="border rounded-lg p-4 bg-gray-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        Slab {slabIdx + 1}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => duplicateSlab(slab.id)}
                        className="text-blue-600 text-sm flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Duplicate
                      </button>
                    </div>
                    {formSlabs.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeSlab(slab.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Min Amount (₹)" 
                      type="number" 
                      placeholder="0"
                      value={slab.minAmount}
                      onChange={(e) => updateSlab(slab.id, 'minAmount', Number(e.target.value))}
                    />
                    <Input 
                      label="Max Amount (₹)" 
                      type="number" 
                      placeholder="600"
                      value={slab.maxAmount || ''}
                      onChange={(e) => updateSlab(slab.id, 'maxAmount', e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>

                  {/* Rewards */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">Rewards Configuration</h4>
                      <Button type="button" size="sm" variant="secondary" onClick={() => addReward(slab.id)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Reward
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {slab.rewards.map((reward) => (
                        <div key={reward.id} className="bg-white border rounded-lg p-3 space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Reward Type</label>
                              <select 
                                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                                value={reward.type}
                                onChange={(e) => updateReward(slab.id, reward.id, 'type', e.target.value)}
                              >
                                <option value="wallet_credit">Wallet Credit</option>
                                <option value="instant_discount">Instant Discount</option>
                                <option value="free_shipping">Free Shipping</option>
                                <option value="fixed_wallet">Fixed Wallet</option>
                                <option value="product_reward">Product Reward</option>
                                <option value="try_again">Try Again</option>
                              </select>
                            </div>
                            <Input 
                              label="Frequency (%)" 
                              type="number" 
                              placeholder="30"
                              value={reward.frequency}
                              onChange={(e) => updateReward(slab.id, reward.id, 'frequency', Number(e.target.value))}
                            />
                            <Input 
                              label="Coupon Code" 
                              placeholder="SAVE10"
                              value={reward.couponCode || ''}
                              onChange={(e) => updateReward(slab.id, reward.id, 'couponCode', e.target.value)}
                            />
                          </div>
                          
                          <Input 
                            label="Description" 
                            placeholder="₹10-50 Wallet Credit"
                            value={reward.description}
                            onChange={(e) => updateReward(slab.id, reward.id, 'description', e.target.value)}
                          />

                          <button 
                            type="button" 
                            onClick={() => removeReward(slab.id, reward.id)}
                            className="text-red-600 text-sm flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove Reward
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Probability Indicator */}
                    {slab.rewards.length > 0 && (
                      <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
                        calculateTotalProbability(slab.rewards) === 100 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-amber-50 border border-amber-200'
                      }`}>
                        <AlertCircle className={`h-4 w-4 ${
                          calculateTotalProbability(slab.rewards) === 100 ? 'text-green-600' : 'text-amber-600'
                        }`} />
                        <span className={`text-sm ${
                          calculateTotalProbability(slab.rewards) === 100 ? 'text-green-700' : 'text-amber-700'
                        }`}>
                          Total Probability: {calculateTotalProbability(slab.rewards)}% 
                          {calculateTotalProbability(slab.rewards) !== 100 && ' (Must equal 100%)'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-white">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Publish Campaign
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Campaign Details" size="lg">
        {selectedCampaign && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Campaign Name</p>
                <p className="font-medium">{selectedCampaign.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${selectedCampaign.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedCampaign.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-medium">{selectedCampaign.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Spin Limit</p>
                <p className="font-medium">{selectedCampaign.spinLimit} spins per user</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiry Date</p>
                <p className="font-medium">{selectedCampaign.expiryDate}</p>
              </div>
            </div>

            {/* Slabs */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Order Slabs & Rewards</h3>
              <div className="space-y-3">
                {selectedCampaign.slabs.map((slab) => (
                  <div key={slab.id} className="border rounded-lg">
                    <button
                      onClick={() => toggleSlab(slab.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <span className="font-medium">
                        ₹{slab.minAmount} - {slab.maxAmount ? `₹${slab.maxAmount}` : 'Above'}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{slab.rewards.length} rewards</span>
                        {expandedSlabs[slab.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>
                    
                    {expandedSlabs[slab.id] && (
                      <div className="border-t p-4 space-y-2">
                        {slab.rewards.map((reward) => (
                          <div key={reward.id} className="bg-gray-50 p-3 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{getRewardTypeLabel(reward.type)}</span>
                              <span className="text-sm text-gray-600">{reward.frequency}%</span>
                            </div>
                            <p className="text-sm text-gray-600">{reward.description}</p>
                            {reward.couponCode && (
                              <p className="text-xs text-blue-600 mt-1">Code: {reward.couponCode}</p>
                            )}
                          </div>
                        ))}
                        <div className={`p-2 rounded text-sm ${
                          calculateTotalProbability(slab.rewards) === 100 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          Total Probability: {calculateTotalProbability(slab.rewards)}%
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal - Similar to Create */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Campaign" size="lg">
        {selectedCampaign && (
          <form onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); alert('Updated!'); }} className="space-y-4">
            <Input label="Campaign Name" defaultValue={selectedCampaign.name} required />
            <Input label="Description" defaultValue={selectedCampaign.description} required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Spin Limit" type="number" defaultValue={selectedCampaign.spinLimit} required />
              <Input label="Expiry Date" type="date" defaultValue={selectedCampaign.expiryDate} required />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={selectedCampaign.isActive} className="rounded" />
              <label className="text-sm">Active</label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">Update Campaign</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
