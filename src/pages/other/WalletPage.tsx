import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Card, Button, Input, Select, Table, Th, Td, Badge, Modal } from '../../components/ui';
import { Plus, Search, Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDateTime, getStatusColor } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { customersApi, walletApi } from '../../utils/api';

type WalletTransactionApi = {
  id: string;
  type: 'credit' | 'debit' | 'bonus' | 'refund';
  amount: number;
  description?: string;
  balanceAfter?: number;
  status?: string;
  transactionAt?: string;
  customer?: {
    name?: string;
    fullName?: string;
    phone?: string;
  } | null;
};

const getPayloadList = <T,>(response: { data?: { data?: T[] } }): T[] =>
  Array.isArray(response.data?.data) ? response.data.data : [];

const getPayloadStats = (response: { data?: { meta?: { stats?: Record<string, number> } } }) =>
  response.data?.meta?.stats || {};

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export function WalletPage() {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState<WalletTransactionApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalBalance: 0,
    creditsToday: 0,
    debitsToday: 0,
    pendingRefunds: 0,
  });
  const [addForm, setAddForm] = useState({
    customerQuery: '',
    amount: '',
    reason: 'refund',
    notes: '',
  });

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await walletApi.listTransactions({
        ...(filterType ? { type: filterType } : {}),
        ...(searchQuery ? { search: searchQuery } : {}),
      });
      const data = getPayloadList<WalletTransactionApi>(response);
      const statsPayload = getPayloadStats(response);
      setTransactions(data);
      setStats({
        totalBalance: Number(statsPayload.totalBalance || 0),
        creditsToday: Number(statsPayload.creditsToday || 0),
        debitsToday: Number(statsPayload.debitsToday || 0),
        pendingRefunds: Number(statsPayload.pendingRefunds || 0),
      });
    } catch (error) {
      console.error('Failed to load wallet transactions', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTransactions();
  }, [filterType, searchQuery]);

  const handleAddCredit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const amountValue = Number(addForm.amount);
    if (!amountValue || amountValue <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    let customerId = addForm.customerQuery.trim();
    if (!customerId) {
      alert('Please provide a customer phone, email, or ID.');
      return;
    }

    if (!isUuid(customerId)) {
      try {
        const response = await customersApi.getAll({ search: customerId, limit: '1' });
        const customers = getPayloadList<{ id: string }>(response);
        customerId = customers[0]?.id || '';
      } catch (error) {
        console.error('Customer lookup failed', error);
      }
    }

    if (!customerId) {
      alert('Customer not found. Please check the identifier and try again.');
      return;
    }

    try {
      await walletApi.addCredit({
        customerId,
        amount: amountValue,
        reason: addForm.reason || undefined,
        description: addForm.notes || undefined,
        adminId: user?.id || undefined,
      });
      setShowAddModal(false);
      setAddForm({ customerQuery: '', amount: '', reason: 'refund', notes: '' });
      await fetchTransactions();
      alert('Wallet credit added successfully.');
    } catch (error) {
      console.error('Failed to add wallet credit', error);
      alert('Failed to add wallet credit. Please try again.');
    }
  };

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
            <p className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-green-100 p-3"><ArrowUpRight className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Credits (Today)</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.creditsToday)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-red-100 p-3"><ArrowDownLeft className="h-6 w-6 text-red-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Debits (Today)</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.debitsToday)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-orange-100 p-3"><RefreshCw className="h-6 w-6 text-orange-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Pending Refunds</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.pendingRefunds)}</p>
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
              <Select
                value={filterType}
                onChange={(event) => setFilterType(event.target.value)}
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'credit', label: 'Credits' },
                  { value: 'debit', label: 'Debits' },
                  { value: 'bonus', label: 'Bonus' },
                  { value: 'refund', label: 'Refunds' },
                ]}
              />
            </div>
          </div>
          <div className="space-y-3">
            {isLoading && (
              <div className="text-sm text-gray-500">Loading transactions...</div>
            )}
            {!isLoading && recentTransactions.length === 0 && (
              <div className="text-sm text-gray-500">No transactions found.</div>
            )}
            {!isLoading && recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${txn.type === 'debit' ? 'bg-red-100' : 'bg-green-100'}`}>
                    {txn.type === 'debit'
                      ? <ArrowDownLeft className="h-4 w-4 text-red-600" />
                      : <ArrowUpRight className="h-4 w-4 text-green-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{txn.customer?.name || txn.customer?.fullName || 'Customer'}</p>
                    <p className="text-sm text-gray-500">{txn.description || 'Wallet transaction'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${txn.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                    {txn.type === 'debit' ? '-' : '+'}{formatCurrency(txn.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {txn.transactionAt ? formatDateTime(txn.transactionAt) : '—'}
                  </p>
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
              <Input
                placeholder="Search customer..."
                className="pl-10"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <Button variant="secondary">Export</Button>
          </div>
        </div>
        <Table>
          <thead>
            <tr><Th>Transaction ID</Th><Th>Customer</Th><Th>Type</Th><Th>Description</Th><Th>Amount</Th><Th>Balance After</Th><Th>Status</Th><Th>Date</Th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50">
                <Td><span className="font-mono text-sm">{txn.id}</span></Td>
                <Td><span className="font-medium">{txn.customer?.name || txn.customer?.fullName || 'Customer'}</span></Td>
                <Td>
                  <Badge variant={txn.type === 'debit' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                    {txn.type}
                  </Badge>
                </Td>
                <Td>{txn.description || 'Wallet transaction'}</Td>
                <Td className={txn.type === 'debit' ? 'text-red-600' : 'text-green-600'}>
                  {txn.type === 'debit' ? '-' : '+'}{formatCurrency(txn.amount)}
                </Td>
                <Td>{formatCurrency(txn.balanceAfter || 0)}</Td>
                <Td><Badge variant={getStatusColor(txn.status || 'completed')}>{txn.status || 'completed'}</Badge></Td>
                <Td><span className="text-sm">{txn.transactionAt ? formatDateTime(txn.transactionAt) : '—'}</span></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Add Credit Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Wallet Credit">
        <form className="space-y-4" onSubmit={handleAddCredit}>
          <Input
            label="Customer Phone/Email"
            placeholder="Search customer..."
            value={addForm.customerQuery}
            onChange={(event) => setAddForm((prev) => ({ ...prev, customerQuery: event.target.value }))}
          />
          <Input
            label="Amount (₹)"
            type="number"
            placeholder="100"
            value={addForm.amount}
            onChange={(event) => setAddForm((prev) => ({ ...prev, amount: event.target.value }))}
          />
          <Select
            label="Reason"
            value={addForm.reason}
            onChange={(event) => setAddForm((prev) => ({ ...prev, reason: event.target.value }))}
            options={[
              { value: 'refund', label: 'Order Refund' },
              { value: 'compensation', label: 'Compensation' },
              { value: 'promotion', label: 'Promotional Credit' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
              rows={2}
              placeholder="Add notes..."
              value={addForm.notes}
              onChange={(event) => setAddForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
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
