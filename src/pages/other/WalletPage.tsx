import { useState } from 'react';
import { Card, Button, Input, Select, Table, Th, Td, Badge, Modal } from '../../components/ui';
import { Plus, Search, Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDateTime, getStatusColor } from '../../utils/helpers';

const mockTransactions = [
  { id: 'TXN001', customer: 'Rajesh Kumar', type: 'credit', description: 'Referral Reward', amount: 100, balance: 350, status: 'completed', date: '2024-01-07T10:30:00' },
  { id: 'TXN002', customer: 'Priya Sharma', type: 'debit', description: 'Order #ORD-2024-001', amount: 150, balance: 50, status: 'completed', date: '2024-01-07T09:15:00' },
  { id: 'TXN003', customer: 'Arun Patel', type: 'credit', description: 'Order Refund', amount: 250, balance: 250, status: 'completed', date: '2024-01-06T14:20:00' },
  { id: 'TXN004', customer: 'Lakshmi Devi', type: 'credit', description: 'Scratch Card Reward', amount: 25, balance: 525, status: 'completed', date: '2024-01-06T11:45:00' },
  { id: 'TXN005', customer: 'Suresh Menon', type: 'debit', description: 'Order #ORD-2024-005', amount: 200, balance: 0, status: 'completed', date: '2024-01-05T16:00:00' },
];

export function WalletPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wallet Management</h1>
          <p className="text-gray-600">Manage customer wallets and transactions</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-5 w-5" /> Add Credit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-100 p-3"><Wallet className="h-6 w-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Total Balance</p>
            <p className="text-2xl font-bold">₹1,24,500</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-green-100 p-3"><ArrowUpRight className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Credits (Today)</p>
            <p className="text-2xl font-bold">₹8,450</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-red-100 p-3"><ArrowDownLeft className="h-6 w-6 text-red-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Debits (Today)</p>
            <p className="text-2xl font-bold">₹12,300</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-orange-100 p-3"><RefreshCw className="h-6 w-6 text-orange-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Pending Refunds</p>
            <p className="text-2xl font-bold">₹2,150</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Wallet Settings */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Wallet Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Balance Expiry</label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="365" className="w-24" />
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Balance Limit</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <Input type="number" defaultValue="5000" className="w-24" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Usage Amount</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <Input type="number" defaultValue="1" className="w-24" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Usage per Order</label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="50" className="w-24" />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm">Enable Wallet Payments</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
            <Button className="w-full">Save Settings</Button>
          </div>
        </Card>

        {/* Transactions */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <div className="flex gap-2">
              <Select options={[{ value: '', label: 'All Types' }, { value: 'credit', label: 'Credits' }, { value: 'debit', label: 'Debits' }]} />
            </div>
          </div>
          <div className="space-y-3">
            {mockTransactions.map(txn => (
              <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {txn.type === 'credit' ? <ArrowUpRight className="h-4 w-4 text-green-600" /> : <ArrowDownLeft className="h-4 w-4 text-red-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{txn.customer}</p>
                    <p className="text-sm text-gray-500">{txn.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{formatDateTime(txn.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Full Transactions Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Transactions</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search customer..." className="pl-10" />
            </div>
            <Button variant="secondary">Export</Button>
          </div>
        </div>
        <Table>
          <thead>
            <tr><Th>Transaction ID</Th><Th>Customer</Th><Th>Type</Th><Th>Description</Th><Th>Amount</Th><Th>Balance After</Th><Th>Status</Th><Th>Date</Th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockTransactions.map(txn => (
              <tr key={txn.id} className="hover:bg-gray-50">
                <Td><span className="font-mono text-sm">{txn.id}</span></Td>
                <Td><span className="font-medium">{txn.customer}</span></Td>
                <Td>
                  <Badge variant={txn.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {txn.type}
                  </Badge>
                </Td>
                <Td>{txn.description}</Td>
                <Td className={txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                  {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                </Td>
                <Td>{formatCurrency(txn.balance)}</Td>
                <Td><Badge variant={getStatusColor(txn.status)}>{txn.status}</Badge></Td>
                <Td><span className="text-sm">{formatDateTime(txn.date)}</span></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Add Credit Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Wallet Credit">
        <form className="space-y-4">
          <Input label="Customer Phone/Email" placeholder="Search customer..." />
          <Input label="Amount (₹)" type="number" placeholder="100" />
          <Select label="Reason" options={[
            { value: 'refund', label: 'Order Refund' },
            { value: 'compensation', label: 'Compensation' },
            { value: 'promotion', label: 'Promotional Credit' },
            { value: 'other', label: 'Other' },
          ]} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none" rows={2} placeholder="Add notes..." />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Add Credit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
