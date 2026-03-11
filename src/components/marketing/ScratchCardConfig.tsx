import { useState } from 'react';
import { Card, Button, Input, Modal } from '../ui';
import { Plus, Eye, Edit, Trash2, AlertCircle } from 'lucide-react';

interface Reward {
  id: string;
  type: 'primary' | 'referral' | 'bonus' | 'seasonal' | 'daily';
  name: string;
  description: string;
  rewardValue: number;
  probability: number;
  orderValue?: number;
  nthOrder?: number;
  festival?: string;
  festivalImage?: string;
  dateFrom?: string;
  dateTo?: string;
  intervalHours?: number;
  isActive: boolean;
  createdAt: string;
}

const dummyRewards: Reward[] = [
  // Primary - Above ₹350
  { id: '1a', type: 'primary', name: 'Primary - Above ₹350', description: 'Offer 1', rewardValue: 5, probability: 30, orderValue: 350, isActive: true, createdAt: '2024-02-10' },
  { id: '1b', type: 'primary', name: 'Primary - Above ₹350', description: 'Offer 2', rewardValue: 7, probability: 15, orderValue: 350, isActive: true, createdAt: '2024-02-10' },
  { id: '1c', type: 'primary', name: 'Primary - Above ₹350', description: 'Offer 3', rewardValue: 8, probability: 15, orderValue: 350, isActive: true, createdAt: '2024-02-10' },
  { id: '1d', type: 'primary', name: 'Primary - Above ₹350', description: 'Offer 4', rewardValue: 10, probability: 20, orderValue: 350, isActive: true, createdAt: '2024-02-10' },
  { id: '1e', type: 'primary', name: 'Primary - Above ₹350', description: 'Offer 5', rewardValue: 12, probability: 20, orderValue: 350, isActive: true, createdAt: '2024-02-10' },
  
  // Primary - Above ₹650
  { id: '2a', type: 'primary', name: 'Primary - Above ₹650', description: 'Offer 1', rewardValue: 5, probability: 30, orderValue: 650, isActive: true, createdAt: '2024-02-10' },
  { id: '2b', type: 'primary', name: 'Primary - Above ₹650', description: 'Offer 2', rewardValue: 7, probability: 15, orderValue: 650, isActive: true, createdAt: '2024-02-10' },
  { id: '2c', type: 'primary', name: 'Primary - Above ₹650', description: 'Offer 3', rewardValue: 8, probability: 15, orderValue: 650, isActive: true, createdAt: '2024-02-10' },
  { id: '2d', type: 'primary', name: 'Primary - Above ₹650', description: 'Offer 4', rewardValue: 12, probability: 20, orderValue: 650, isActive: true, createdAt: '2024-02-10' },
  { id: '2e', type: 'primary', name: 'Primary - Above ₹650', description: 'Offer 5', rewardValue: 15, probability: 20, orderValue: 650, isActive: true, createdAt: '2024-02-10' },
  
  // Primary - Above ₹1500
  { id: '3a', type: 'primary', name: 'Primary - Above ₹1500', description: 'Offer 1', rewardValue: 8, probability: 30, orderValue: 1500, isActive: true, createdAt: '2024-02-10' },
  { id: '3b', type: 'primary', name: 'Primary - Above ₹1500', description: 'Offer 2', rewardValue: 10, probability: 15, orderValue: 1500, isActive: true, createdAt: '2024-02-10' },
  { id: '3c', type: 'primary', name: 'Primary - Above ₹1500', description: 'Offer 3', rewardValue: 12, probability: 15, orderValue: 1500, isActive: true, createdAt: '2024-02-10' },
  { id: '3d', type: 'primary', name: 'Primary - Above ₹1500', description: 'Offer 4', rewardValue: 15, probability: 20, orderValue: 1500, isActive: true, createdAt: '2024-02-10' },
  { id: '3e', type: 'primary', name: 'Primary - Above ₹1500', description: 'Offer 5', rewardValue: 20, probability: 20, orderValue: 1500, isActive: true, createdAt: '2024-02-10' },
  
  // Referral
  { id: '4', type: 'referral', name: 'Friend Referral Bonus', description: 'Reward when friend signs up', rewardValue: 50, probability: 100, isActive: true, createdAt: '2024-02-09' },
  
  // Bonus
  { id: '5a', type: 'bonus', name: '5th Order Bonus', description: 'Offer 1', rewardValue: 12, probability: 30, nthOrder: 5, isActive: true, createdAt: '2024-02-08' },
  { id: '5b', type: 'bonus', name: '5th Order Bonus', description: 'Offer 2', rewardValue: 15, probability: 15, nthOrder: 5, isActive: true, createdAt: '2024-02-08' },
  { id: '5c', type: 'bonus', name: '5th Order Bonus', description: 'Offer 3', rewardValue: 18, probability: 15, nthOrder: 5, isActive: true, createdAt: '2024-02-08' },
  { id: '5d', type: 'bonus', name: '5th Order Bonus', description: 'Offer 4', rewardValue: 20, probability: 20, nthOrder: 5, isActive: true, createdAt: '2024-02-08' },
  { id: '5e', type: 'bonus', name: '5th Order Bonus', description: 'Offer 5', rewardValue: 25, probability: 20, nthOrder: 5, isActive: true, createdAt: '2024-02-08' },
  
  // Seasonal
  { id: '6a', type: 'seasonal', name: 'Diwali Special', description: 'Offer 1', rewardValue: 8, probability: 30, festival: 'Diwali', dateFrom: '2024-10-20', dateTo: '2024-11-05', isActive: true, createdAt: '2024-02-07' },
  { id: '6b', type: 'seasonal', name: 'Diwali Special', description: 'Offer 2', rewardValue: 10, probability: 15, festival: 'Diwali', dateFrom: '2024-10-20', dateTo: '2024-11-05', isActive: true, createdAt: '2024-02-07' },
  { id: '6c', type: 'seasonal', name: 'Diwali Special', description: 'Offer 3', rewardValue: 15, probability: 15, festival: 'Diwali', dateFrom: '2024-10-20', dateTo: '2024-11-05', isActive: true, createdAt: '2024-02-07' },
  { id: '6d', type: 'seasonal', name: 'Diwali Special', description: 'Offer 4', rewardValue: 18, probability: 20, festival: 'Diwali', dateFrom: '2024-10-20', dateTo: '2024-11-05', isActive: true, createdAt: '2024-02-07' },
  { id: '6e', type: 'seasonal', name: 'Diwali Special', description: 'Offer 5', rewardValue: 20, probability: 20, festival: 'Diwali', dateFrom: '2024-10-20', dateTo: '2024-11-05', isActive: true, createdAt: '2024-02-07' },
  
  // Daily
  { id: '7a', type: 'daily', name: 'Daily Login Reward', description: 'Offer 1', rewardValue: 2, probability: 30, intervalHours: 24, isActive: true, createdAt: '2024-02-06' },
  { id: '7b', type: 'daily', name: 'Daily Login Reward', description: 'Offer 2', rewardValue: 4, probability: 15, intervalHours: 24, isActive: true, createdAt: '2024-02-06' },
  { id: '7c', type: 'daily', name: 'Daily Login Reward', description: 'Offer 3', rewardValue: 7, probability: 15, intervalHours: 24, isActive: true, createdAt: '2024-02-06' },
  { id: '7d', type: 'daily', name: 'Daily Login Reward', description: 'Offer 4', rewardValue: 10, probability: 20, intervalHours: 24, isActive: true, createdAt: '2024-02-06' },
  { id: '7e', type: 'daily', name: 'Daily Login Reward', description: 'Offer 5', rewardValue: 15, probability: 20, intervalHours: 24, isActive: true, createdAt: '2024-02-06' }
];

interface OfferInput {
  id: string;
  rewardValue: number;
  probability: number;
}

interface SlabInput {
  id: string;
  orderValue?: number;
  nthOrder?: number;
  festival?: string;
  festivalImage?: string;
  dateFrom?: string;
  dateTo?: string;
  intervalHours?: number;
  offers: OfferInput[];
}

export const ScratchCardConfig = () => {
  const [rewards, setRewards] = useState<Reward[]>(dummyRewards);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [rewardType, setRewardType] = useState<'primary' | 'referral' | 'bonus' | 'seasonal' | 'daily'>('primary');
  
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'primary' | 'referral' | 'bonus' | 'seasonal' | 'daily',
    status: 'all' as 'all' | 'active' | 'inactive',
    orderValue: 'all' as 'all' | '350' | '650' | '1500',
    searchTerm: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    orderValue: 350,
    nthOrder: 5,
    festival: '',
    festivalImage: '',
    dateFrom: '',
    dateTo: '',
    intervalHours: 24
  });
  const [formSlabs, setFormSlabs] = useState<SlabInput[]>([]);
  const [formOffers, setFormOffers] = useState<OfferInput[]>([
    { id: 'o1', rewardValue: 0, probability: 0 }
  ]);
  const [imagePreview, setImagePreview] = useState<string>('');

  const addSlab = () => {
    const newSlab: SlabInput = {
      id: `s${Date.now()}`,
      orderValue: 350,
      offers: [{ id: 'o1', rewardValue: 0, probability: 0 }]
    };
    setFormSlabs([...formSlabs, newSlab]);
  };

  const removeSlab = (slabId: string) => {
    setFormSlabs(formSlabs.filter(s => s.id !== slabId));
  };

  const updateSlabValue = (slabId: string, value: number) => {
    setFormSlabs(formSlabs.map(s => s.id === slabId ? { ...s, orderValue: value } : s));
  };

  const addSlabOffer = (slabId: string) => {
    setFormSlabs(formSlabs.map(s => 
      s.id === slabId ? { ...s, offers: [...s.offers, { id: `o${Date.now()}`, rewardValue: 0, probability: 0 }] } : s
    ));
  };

  const removeSlabOffer = (slabId: string, offerId: string) => {
    setFormSlabs(formSlabs.map(s => 
      s.id === slabId ? { ...s, offers: s.offers.filter(o => o.id !== offerId) } : s
    ));
  };

  const updateSlabOffer = (slabId: string, offerId: string, field: 'rewardValue' | 'probability', value: number) => {
    setFormSlabs(formSlabs.map(s => 
      s.id === slabId ? {
        ...s,
        offers: s.offers.map(o => o.id === offerId ? { ...o, [field]: value } : o)
      } : s
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, festivalImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredRewards = rewards.filter(reward => {
    if (filters.type !== 'all' && reward.type !== filters.type) return false;
    if (filters.status !== 'all') {
      if (filters.status === 'active' && !reward.isActive) return false;
      if (filters.status === 'inactive' && reward.isActive) return false;
    }
    if (filters.orderValue !== 'all' && reward.orderValue !== Number(filters.orderValue)) return false;
    if (filters.searchTerm && !reward.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    return true;
  });

  const resetFilters = () => {
    setFilters({ type: 'all', status: 'all', orderValue: 'all', searchTerm: '' });
  };

  const addOffer = () => {
    setFormOffers([...formOffers, { id: `o${Date.now()}`, rewardValue: 0, probability: 0 }]);
  };

  const removeOffer = (offerId: string) => {
    setFormOffers(formOffers.filter(o => o.id !== offerId));
  };

  const updateOffer = (offerId: string, field: 'rewardValue' | 'probability', value: number) => {
    setFormOffers(formOffers.map(o => o.id === offerId ? { ...o, [field]: value } : o));
  };

  const calculateTotalProbability = (offers: OfferInput[]) => {
    return offers.reduce((sum, o) => sum + o.probability, 0);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRewards: Reward[] = [];
    const timestamp = Date.now();
    const dateStr = new Date().toISOString().split('T')[0];

    if (rewardType === 'referral') {
      newRewards.push({
        id: `r${timestamp}`,
        type: rewardType,
        name: formData.name,
        description: 'Single offer',
        rewardValue: formOffers[0]?.rewardValue || 0,
        probability: formOffers[0]?.probability || 0,
        isActive: true,
        createdAt: dateStr
      });
    } else if (rewardType === 'primary') {
      formSlabs.forEach((slab, slabIdx) => {
        slab.offers.forEach((offer, offerIdx) => {
          newRewards.push({
            id: `r${timestamp}_${slabIdx}_${offerIdx}`,
            type: rewardType,
            name: formData.name,
            description: `Offer ${offerIdx + 1}`,
            rewardValue: offer.rewardValue,
            probability: offer.probability,
            orderValue: slab.orderValue,
            isActive: true,
            createdAt: dateStr
          });
        });
      });
    } else {
      formOffers.forEach((offer, idx) => {
        const reward: Reward = {
          id: `r${timestamp}_${idx}`,
          type: rewardType,
          name: formData.name,
          description: `Offer ${idx + 1}`,
          rewardValue: offer.rewardValue,
          probability: offer.probability,
          isActive: true,
          createdAt: dateStr
        };

        if (rewardType === 'bonus') reward.nthOrder = formData.nthOrder;
        if (rewardType === 'seasonal') {
          reward.festival = formData.festival;
          reward.festivalImage = formData.festivalImage;
          reward.dateFrom = formData.dateFrom;
          reward.dateTo = formData.dateTo;
        }
        if (rewardType === 'daily') reward.intervalHours = formData.intervalHours;

        newRewards.push(reward);
      });
    }

    setRewards([...rewards, ...newRewards]);
    setShowCreateModal(false);
    setFormData({ name: '', orderValue: 350, nthOrder: 5, festival: '', festivalImage: '', dateFrom: '', dateTo: '', intervalHours: 24 });
    setFormSlabs([]);
    setFormOffers([{ id: 'o1', rewardValue: 0, probability: 0 }]);
    setImagePreview('');
    alert(`${newRewards.length} offer(s) created successfully!`);
  };

  const handleView = (reward: Reward) => {
    setSelectedReward(reward);
    setShowViewModal(true);
  };

  const handleEdit = (reward: Reward) => {
    setSelectedReward(reward);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this reward?')) {
      setRewards(rewards.filter(r => r.id !== id));
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-blue-100 text-blue-700',
      referral: 'bg-emerald-100 text-emerald-700',
      bonus: 'bg-indigo-100 text-indigo-700',
      seasonal: 'bg-amber-100 text-amber-700',
      daily: 'bg-cyan-100 text-cyan-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scratch Card Rewards</h1>
          <p className="text-gray-600 mt-1">Manage all reward types</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {['primary', 'referral', 'bonus', 'seasonal', 'daily'].map((type) => {
          const count = rewards.filter(r => r.type === type).length;
          return (
            <Card key={type} className="p-4">
              <p className="text-sm text-gray-600 capitalize">{type} Rewards</p>
              <p className="text-2xl font-bold">{count}</p>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button 
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Reset All
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reward Type</label>
              <select 
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="primary">Primary</option>
                <option value="referral">Referral</option>
                <option value="bonus">Bonus</option>
                <option value="seasonal">Seasonal</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Value</label>
              <select 
                value={filters.orderValue}
                onChange={(e) => setFilters({ ...filters, orderValue: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="all">All Values</option>
                <option value="350">Above ₹350</option>
                <option value="650">Above ₹650</option>
                <option value="1500">Above ₹1500</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input 
                type="text"
                placeholder="Search by name..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <p className="text-sm text-gray-600">
              Showing {filteredRewards.length} of {rewards.length} rewards
            </p>
          </div>
        </div>
      </Card>

      {/* Rewards List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reward Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRewards.map((reward) => (
                <tr key={reward.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(reward.type)}`}>
                      {reward.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{reward.name}</div>
                    <div className="text-sm text-gray-500">{reward.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{reward.rewardValue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reward.probability}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${reward.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {reward.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(reward)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEdit(reward)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(reward.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Scratch Card Offer">
        <form onSubmit={handleCreate} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reward Type</label>
            <select 
              value={rewardType} 
              onChange={(e) => setRewardType(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="primary">Primary Reward (Order Value)</option>
              <option value="referral">Referral Reward</option>
              <option value="bonus">Bonus Reward (Nth Order)</option>
              <option value="seasonal">Seasonal Reward</option>
              <option value="daily">Daily Reward</option>
            </select>
          </div>

          <Input 
            label="Reward Name" 
            placeholder="Enter reward name" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required 
          />

          {rewardType === 'primary' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Order Value Slabs</h4>
                <Button type="button" size="sm" variant="secondary" onClick={addSlab}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slab
                </Button>
              </div>

              {formSlabs.map((slab, slabIdx) => (
                <div key={slab.id} className="border rounded-lg p-4 bg-gray-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Slab {slabIdx + 1}</span>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Value</label>
                    <select 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      value={slab.orderValue}
                      onChange={(e) => updateSlabValue(slab.id, Number(e.target.value))}
                    >
                      <option value="350">Above ₹350</option>
                      <option value="650">Above ₹650</option>
                      <option value="1500">Above ₹1500</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">Reward Configuration</h4>
                      <Button type="button" size="sm" variant="secondary" onClick={() => addSlabOffer(slab.id)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Reward
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {slab.offers.map((offer, idx) => (
                        <div key={offer.id} className="bg-white border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Reward {idx + 1}</span>
                            {slab.offers.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => removeSlabOffer(slab.id, offer.id)}
                                className="text-red-600 text-sm flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input 
                              label="Reward Value (₹)" 
                              type="number" 
                              placeholder="10"
                              value={offer.rewardValue}
                              onChange={(e) => updateSlabOffer(slab.id, offer.id, 'rewardValue', Number(e.target.value))}
                              required 
                            />
                            <Input 
                              label="Probability (%)" 
                              type="number" 
                              placeholder="30"
                              min="1"
                              max="100"
                              value={offer.probability}
                              onChange={(e) => updateSlabOffer(slab.id, offer.id, 'probability', Number(e.target.value))}
                              required 
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {slab.offers.length > 0 && (
                      <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
                        calculateTotalProbability(slab.offers) === 100 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-amber-50 border border-amber-200'
                      }`}>
                        <AlertCircle className={`h-4 w-4 ${
                          calculateTotalProbability(slab.offers) === 100 ? 'text-green-600' : 'text-amber-600'
                        }`} />
                        <span className={`text-sm ${
                          calculateTotalProbability(slab.offers) === 100 ? 'text-green-700' : 'text-amber-700'
                        }`}>
                          Total Probability: {calculateTotalProbability(slab.offers)}% 
                          {calculateTotalProbability(slab.offers) !== 100 && ' (Must equal 100%)'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : rewardType === 'referral' ? (
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Reward Value (₹)" 
                type="number" 
                placeholder="100" 
                value={formOffers[0]?.rewardValue || ''}
                onChange={(e) => updateOffer(formOffers[0]?.id || 'o1', 'rewardValue', Number(e.target.value))}
                required 
              />
              <Input 
                label="Probability (%)" 
                type="number" 
                placeholder="100" 
                min="1" 
                max="100" 
                value={formOffers[0]?.probability || ''}
                onChange={(e) => updateOffer(formOffers[0]?.id || 'o1', 'probability', Number(e.target.value))}
                required 
              />
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-gray-900">
                  {rewardType === 'bonus' && `Bonus: Every ${formData.nthOrder}th Order`}
                  {rewardType === 'seasonal' && `Festival: ${formData.festival || 'Not Set'}`}
                  {rewardType === 'daily' && `Daily: Every ${formData.intervalHours} Hours`}
                </h4>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">Reward Configuration</h4>
                  <Button type="button" size="sm" variant="secondary" onClick={addOffer}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Reward
                  </Button>
                </div>

                <div className="space-y-3">
                  {formOffers.map((offer, idx) => (
                    <div key={offer.id} className="bg-white border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Reward {idx + 1}</span>
                        {formOffers.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeOffer(offer.id)}
                            className="text-red-600 text-sm flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input 
                          label="Reward Value (₹)" 
                          type="number" 
                          placeholder="10"
                          value={offer.rewardValue}
                          onChange={(e) => updateOffer(offer.id, 'rewardValue', Number(e.target.value))}
                          required 
                        />
                        <Input 
                          label="Probability (%)" 
                          type="number" 
                          placeholder="30"
                          min="1"
                          max="100"
                          value={offer.probability}
                          onChange={(e) => updateOffer(offer.id, 'probability', Number(e.target.value))}
                          required 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {formOffers.length > 0 && (
                  <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
                    calculateTotalProbability(formOffers) === 100 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-amber-50 border border-amber-200'
                  }`}>
                    <AlertCircle className={`h-4 w-4 ${
                      calculateTotalProbability(formOffers) === 100 ? 'text-green-600' : 'text-amber-600'
                    }`} />
                    <span className={`text-sm ${
                      calculateTotalProbability(formOffers) === 100 ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      Total Probability: {calculateTotalProbability(formOffers)}% 
                      {calculateTotalProbability(formOffers) !== 100 && ' (Must equal 100%)'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {rewardType === 'bonus' && (
            <Input 
              label="Every Nth Order" 
              type="number" 
              placeholder="5" 
              value={formData.nthOrder}
              onChange={(e) => setFormData({ ...formData, nthOrder: Number(e.target.value) })}
              required 
            />
          )}

          {rewardType === 'seasonal' && (
            <>
              <Input 
                label="Festival Name" 
                placeholder="Diwali" 
                value={formData.festival}
                onChange={(e) => setFormData({ ...formData, festival: e.target.value })}
                required 
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Festival Scratch Card Image
                  <span className="text-xs text-gray-500 ml-2">(Recommended: 800x800px, Max 2MB, JPG/PNG)</span>
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                        <div className="flex flex-col items-center">
                          <Plus className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Click to upload image</span>
                          <span className="text-xs text-gray-400 mt-1">Square format (800x800px)</span>
                        </div>
                      </div>
                      <input 
                        type="file" 
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {imagePreview && (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setFormData({ ...formData, festivalImage: '' });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      <strong>Image Guidelines:</strong> Upload a square image (800x800px recommended) for best display. 
                      Supported formats: JPG, PNG. Maximum file size: 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Start Date" 
                  type="date" 
                  value={formData.dateFrom}
                  onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                  required 
                />
                <Input 
                  label="End Date" 
                  type="date" 
                  value={formData.dateTo}
                  onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                  required 
                />
              </div>
            </>
          )}

          {rewardType === 'daily' && (
            <Input 
              label="Interval (Hours)" 
              type="number" 
              placeholder="24" 
              value={formData.intervalHours}
              onChange={(e) => setFormData({ ...formData, intervalHours: Number(e.target.value) })}
              required 
            />
          )}

          <div className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            <label className="text-sm">Active</label>
          </div>

          <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-white">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">Create Offer</Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Reward Details">
        {selectedReward && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedReward.type)}`}>
                  {selectedReward.type}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${selectedReward.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedReward.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{selectedReward.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-medium">{selectedReward.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Reward Value</p>
                <p className="font-medium">₹{selectedReward.rewardValue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Probability</p>
                <p className="font-medium">{selectedReward.probability}%</p>
              </div>
            </div>

            {selectedReward.orderValue && (
              <div>
                <p className="text-sm text-gray-600">Order Value Trigger</p>
                <p className="font-medium">Above ₹{selectedReward.orderValue}</p>
              </div>
            )}
            {selectedReward.nthOrder && (
              <div>
                <p className="text-sm text-gray-600">Nth Order</p>
                <p className="font-medium">Every {selectedReward.nthOrder}th order</p>
              </div>
            )}
            {selectedReward.festival && (
              <div>
                <p className="text-sm text-gray-600">Festival</p>
                <p className="font-medium">{selectedReward.festival}</p>
              </div>
            )}
            {selectedReward.festivalImage && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Festival Scratch Card Image</p>
                <img 
                  src={selectedReward.festivalImage} 
                  alt={selectedReward.festival} 
                  className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
            )}
            {selectedReward.dateFrom && selectedReward.dateTo && (
              <div>
                <p className="text-sm text-gray-600">Validity Period</p>
                <p className="font-medium">{selectedReward.dateFrom} to {selectedReward.dateTo}</p>
              </div>
            )}
            {selectedReward.intervalHours && (
              <div>
                <p className="text-sm text-gray-600">Interval</p>
                <p className="font-medium">Every {selectedReward.intervalHours} hours</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Reward">
        {selectedReward && (
          <form onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); alert('Updated!'); }} className="space-y-4">
            <Input label="Reward Name" defaultValue={selectedReward.name} required />
            <Input label="Description" defaultValue={selectedReward.description} required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Reward Value (₹)" type="number" defaultValue={selectedReward.rewardValue} required />
              <Input label="Probability (%)" type="number" defaultValue={selectedReward.probability} min="1" max="100" required />
            </div>

            {selectedReward.type === 'primary' && selectedReward.orderValue && (
              <Input label="Order Value Trigger" type="number" defaultValue={selectedReward.orderValue} required />
            )}

            {selectedReward.type === 'bonus' && selectedReward.nthOrder && (
              <Input label="Every Nth Order" type="number" defaultValue={selectedReward.nthOrder} required />
            )}

            {selectedReward.type === 'seasonal' && (
              <>
                <Input label="Festival Name" defaultValue={selectedReward.festival} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Start Date" type="date" defaultValue={selectedReward.dateFrom} required />
                  <Input label="End Date" type="date" defaultValue={selectedReward.dateTo} required />
                </div>
              </>
            )}

            {selectedReward.type === 'daily' && selectedReward.intervalHours && (
              <Input label="Interval (Hours)" type="number" defaultValue={selectedReward.intervalHours} required />
            )}

            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={selectedReward.isActive} className="rounded" />
              <label className="text-sm">Active</label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">Update</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
