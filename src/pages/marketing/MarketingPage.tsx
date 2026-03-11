import { useState } from 'react';
import { Card, Button, Input, Select, Table, Th, Td, Modal, Badge } from '../../components/ui';
import { Plus, Search, Edit, Trash2, Bell, Gift, Percent } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';
import type { Coupon } from '../../types';

const mockCoupons: Coupon[] = [
  { id: '1', code: 'WELCOME50', discountType: 'percentage', discountValue: 50, minOrderValue: 500, maxDiscount: 200, validFrom: '2024-01-01', validTo: '2024-01-31', usageLimit: 1000, isActive: true },
  { id: '2', code: 'FLAT100', discountType: 'flat', discountValue: 100, minOrderValue: 800, validFrom: '2024-01-01', validTo: '2024-02-28', usageLimit: 500, isActive: true },
  { id: '3', code: 'FISH20', discountType: 'percentage', discountValue: 20, minOrderValue: 1000, maxDiscount: 300, validFrom: '2024-01-15', validTo: '2024-01-20', usageLimit: 200, isActive: false },
];

export function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'coupons' | 'notifications' | 'gamification'>('coupons');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing & Notifications</h1>
          <p className="text-gray-600">Manage coupons, notifications, and gamification</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add {activeTab === 'coupons' ? 'Coupon' : activeTab === 'notifications' ? 'Notification' : 'Reward'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'coupons', label: 'Coupons & Offers', icon: Percent },
          { id: 'notifications', label: 'Push Notifications', icon: Bell },
          { id: 'gamification', label: 'Gamification', icon: Gift },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <>
          <Card>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search coupons..." className="pl-10" />
              </div>
              <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={[{ value: '', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'expired', label: 'Expired' }]} />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <Table>
              <thead>
                <tr><Th>Code</Th><Th>Discount</Th><Th>Min Order</Th><Th>Max Discount</Th><Th>Valid Period</Th><Th>Usage</Th><Th>Status</Th><Th>Actions</Th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockCoupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <Td><span className="font-mono font-medium text-primary-600">{coupon.code}</span></Td>
                    <Td>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}</Td>
                    <Td>{formatCurrency(coupon.minOrderValue)}</Td>
                    <Td>{coupon.maxDiscount ? formatCurrency(coupon.maxDiscount) : '-'}</Td>
                    <Td><span className="text-xs">{formatDate(coupon.validFrom)} - {formatDate(coupon.validTo)}</span></Td>
                    <Td>0 / {coupon.usageLimit}</Td>
                    <Td><Badge variant={getStatusColor(coupon.isActive ? 'active' : 'inactive')}>{coupon.isActive ? 'Active' : 'Expired'}</Badge></Td>
                    <Td>
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded"><Edit className="h-4 w-4" /></button>
                        <button className="p-1 hover:bg-gray-100 rounded text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="font-semibold mb-4">Automated Notifications</h3>
            <div className="space-y-3">
              {['Order Confirmation', 'Order Status Updates', 'Delivery Updates', 'Payment Confirmation'].map(notif => (
                <div key={notif} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span>{notif}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold mb-4">Send Custom Notification</h3>
            <form className="space-y-4">
              <Input label="Title" placeholder="Notification title" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none" rows={3} placeholder="Notification message..." />
              </div>
              <Select label="Target Audience" options={[{ value: 'all', label: 'All Users' }, { value: 'premium', label: 'Premium Members' }, { value: 'inactive', label: 'Inactive Users' }]} />
              <Button className="w-full">Send Notification</Button>
            </form>
          </Card>
        </div>
      )}

      {/* Gamification Tab */}
      {activeTab === 'gamification' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="font-semibold mb-4">🎰 Scratch Card Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Enable Daily Scratch Cards</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
              <Input label="Validity Period (hours)" type="number" defaultValue="24" />
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Reward Probabilities</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><span className="w-24 text-sm">₹10 Cashback</span><Input type="number" defaultValue="40" className="w-20" /><span className="text-sm">%</span></div>
                  <div className="flex items-center gap-2"><span className="w-24 text-sm">₹25 Cashback</span><Input type="number" defaultValue="30" className="w-20" /><span className="text-sm">%</span></div>
                  <div className="flex items-center gap-2"><span className="w-24 text-sm">Free Delivery</span><Input type="number" defaultValue="20" className="w-20" /><span className="text-sm">%</span></div>
                  <div className="flex items-center gap-2"><span className="w-24 text-sm">₹50 Cashback</span><Input type="number" defaultValue="10" className="w-20" /><span className="text-sm">%</span></div>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold mb-4">🎡 Spin Wheel Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Enable Spin Wheel (After Order)</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
              <p className="text-sm text-gray-500">One spin per order placement</p>
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Wheel Segments (6-8)</p>
                <div className="space-y-2">
                  {['5% Off', '10% Off', 'Free Delivery', '₹20 Cashback', 'Better Luck', '15% Off'].map((seg, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input defaultValue={seg} className="flex-1" />
                      <Input type="number" defaultValue={Math.floor(100/6)} className="w-16" />
                      <span className="text-sm">%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Coupon Modal */}
      <Modal isOpen={showAddModal && activeTab === 'coupons'} onClose={() => setShowAddModal(false)} title="Create Coupon">
        <form className="space-y-4">
          <Input label="Coupon Code" placeholder="WELCOME50" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Discount Type" options={[{ value: 'percentage', label: 'Percentage' }, { value: 'flat', label: 'Flat Amount' }]} />
            <Input label="Discount Value" type="number" placeholder="50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Order Value (₹)" type="number" placeholder="500" />
            <Input label="Max Discount (₹)" type="number" placeholder="200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Valid From" type="date" />
            <Input label="Valid To" type="date" />
          </div>
          <Input label="Usage Limit" type="number" placeholder="1000" />
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Create Coupon</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}