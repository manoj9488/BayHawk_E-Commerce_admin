import { useState } from "react";
import { Card, Button, Input, Select, Modal, Badge } from "../../components/ui";
import { Plus, Wallet, Coins, TrendingUp, ArrowUpDown } from "lucide-react";
import { getStatusColor } from "../../utils/helpers";
import type { InAppCurrency, WalletTransaction } from "../../types";

const mockCurrencies: InAppCurrency[] = [
  {
    id: "1",
    name: "Fish Coins",
    symbol: "FC",
    description: "Premium currency for fish purchases",
    exchangeRate: 1, // 1 INR = 1 FC
    minPurchase: 100,
    maxPurchase: 10000,
    bonusRules: [
      {
        id: "1",
        minAmount: 500,
        bonusPercentage: 5,
        bonusAmount: 25,
        description: "5% bonus on ₹500+",
      },
      {
        id: "2",
        minAmount: 1000,
        bonusPercentage: 10,
        bonusAmount: 100,
        description: "10% bonus on ₹1000+",
      },
    ],
    isActive: true,
    totalIssued: 150000,
    totalRedeemed: 89000,
    walletConfig: {
      theme: "premium",
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
      showBalance: true,
      showTransactionHistory: true,
      enableNotifications: true,
      autoTopup: {
        enabled: false,
        threshold: 100,
        amount: 500,
      },
    },
    createdBy: "Admin",
    createdAt: "2024-01-01",
  },
];

const mockTransactions: WalletTransaction[] = [
  {
    id: "1",
    userId: "user1",
    type: "credit",
    amount: 500,
    description: "Wallet top-up",
    balanceBefore: 200,
    balanceAfter: 700,
    timestamp: "2024-01-10T10:30:00",
  },
  {
    id: "2",
    userId: "user1",
    type: "bonus",
    amount: 50,
    description: "10% bonus on top-up",
    balanceBefore: 700,
    balanceAfter: 750,
    timestamp: "2024-01-10T10:30:00",
  },
  {
    id: "3",
    userId: "user1",
    type: "debit",
    amount: 250,
    description: "Order payment - #ORD001",
    orderId: "ORD001",
    balanceBefore: 750,
    balanceAfter: 500,
    timestamp: "2024-01-10T14:15:00",
  },
];

interface CurrencyStatsProps {
  currencies: InAppCurrency[];
}

function CurrencyStats({ currencies }: CurrencyStatsProps) {
  const totalIssued = currencies.reduce((sum, c) => sum + c.totalIssued, 0);
  const totalRedeemed = currencies.reduce((sum, c) => sum + c.totalRedeemed, 0);
  const circulationRate =
    totalIssued > 0 ? ((totalRedeemed / totalIssued) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Coins className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Currencies</p>
            <p className="text-xl font-bold">{currencies.length}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Wallet className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-xl font-bold">
              {currencies.filter((c) => c.isActive).length}
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Issued</p>
            <p className="text-xl font-bold">{totalIssued.toLocaleString()}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <ArrowUpDown className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Circulation</p>
            <p className="text-xl font-bold">{circulationRate}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function InAppCurrencyPage() {
  const [currencies] = useState<InAppCurrency[]>(mockCurrencies);
  const [transactions] = useState<WalletTransaction[]>(mockTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredCurrencies = currencies.filter(
    (currency) =>
      (currency.name.toLowerCase().includes(search.toLowerCase()) ||
        currency.symbol.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter ||
        (statusFilter === "active" ? currency.isActive : !currency.isActive)),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">In-App Currency Management</h1>
          <p className="text-gray-600">
            Manage digital wallet and currency system
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Currency
        </Button>
      </div>

      <CurrencyStats currencies={currencies} />

      <Card>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search currencies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 flex-1"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Currency Configuration</h2>
          {filteredCurrencies.map((currency) => (
            <Card key={currency.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {currency.symbol}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{currency.name}</h3>
                    <p className="text-sm text-gray-600">
                      {currency.description}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={getStatusColor(
                    currency.isActive ? "active" : "inactive",
                  )}
                >
                  {currency.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Exchange Rate</p>
                  <p className="font-semibold">
                    1 INR = {currency.exchangeRate} {currency.symbol}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Purchase Range</p>
                  <p className="font-semibold">
                    ₹{currency.minPurchase} - ₹{currency.maxPurchase}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Issued</p>
                  <p className="font-semibold">
                    {currency.totalIssued.toLocaleString()} {currency.symbol}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Redeemed</p>
                  <p className="font-semibold">
                    {currency.totalRedeemed.toLocaleString()} {currency.symbol}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Bonus Rules:</p>
                <div className="space-y-1">
                  {currency.bonusRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded"
                    >
                      {rule.description}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Wallet Preview & Transactions
          </h2>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Wallet Preview</h3>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold">Fish Wallet</div>
                  <Wallet className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-2">750 FC</div>
                <div className="text-sm opacity-90">Available Balance</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${transaction.type === "credit" || transaction.type === "bonus" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                    >
                      {transaction.type === "credit" ||
                      transaction.type === "bonus" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${transaction.type === "credit" || transaction.type === "bonus" ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.type === "credit" ||
                      transaction.type === "bonus"
                        ? "+"
                        : "-"}
                      {transaction.amount} FC
                    </p>
                    <p className="text-xs text-gray-500">
                      Balance: {transaction.balanceAfter} FC
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {filteredCurrencies.length === 0 && (
        <Card className="text-center py-12">
          <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No currencies found
          </h3>
          <p className="text-gray-500">Create your first in-app currency</p>
        </Card>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create In-App Currency"
      >
        <form className="space-y-4">
          <Input label="Currency Name" placeholder="Fish Coins" required />
          <Input label="Currency Symbol" placeholder="FC" required />
          <textarea
            className="w-full rounded-lg border p-2"
            rows={2}
            placeholder="Description..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Exchange Rate (1 INR = X)"
              type="number"
              placeholder="1"
            />
            <Input label="Min Purchase (INR)" type="number" placeholder="100" />
          </div>
          <Input label="Max Purchase (INR)" type="number" placeholder="10000" />
          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Currency
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
