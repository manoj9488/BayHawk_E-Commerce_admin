import { useState } from 'react';
import { Search, User, Crown, X } from 'lucide-react';
import { Input, Button, Badge, Card } from '../../ui';
import type { Customer } from '../../../types';

interface CustomerSearchCardProps {
  onCustomerSelect: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
  onCustomerDataChange: (data: { name: string; phone: string; email: string; isElite: boolean }) => void;
}

export function CustomerSearchCard({ 
  onCustomerSelect, 
  selectedCustomer, 
  onCustomerDataChange 
}: CustomerSearchCardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Mock customer database
  const mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      phone: '+919876543210',
      totalOrders: 45,
      totalSpent: 28500,
      walletBalance: 250,
      membershipPlan: 'Premium',
      isActive: true,
      createdAt: '2023-06-15'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.s@email.com',
      phone: '+919876543211',
      totalOrders: 23,
      totalSpent: 15200,
      walletBalance: 100,
      isActive: true,
      createdAt: '2023-08-20'
    },
    {
      id: '3',
      name: 'Arun Patel',
      email: 'arun.p@email.com',
      phone: '+919876543212',
      totalOrders: 12,
      totalSpent: 8900,
      walletBalance: 0,
      isActive: true,
      createdAt: '2023-10-05'
    }
  ];

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 3) {
      onCustomerSelect(null);
      return;
    }

    setIsSearching(true);
    
    // Simulate API search delay
    setTimeout(() => {
      const foundCustomer = mockCustomers.find(
        customer => 
          customer.phone.includes(query) || 
          customer.name.toLowerCase().includes(query.toLowerCase()) ||
          customer.email.toLowerCase().includes(query.toLowerCase())
      );
      
      if (foundCustomer) {
        onCustomerSelect(foundCustomer);
        onCustomerDataChange({
          name: foundCustomer.name,
          phone: foundCustomer.phone,
          email: foundCustomer.email || '',
          isElite: !!foundCustomer.membershipPlan
        });
      } else {
        onCustomerSelect(null);
      }
      
      setIsSearching(false);
    }, 500);
  };

  const clearSelection = () => {
    setSearchQuery('');
    onCustomerSelect(null);
    onCustomerDataChange({
      name: '',
      phone: '',
      email: '',
      isElite: false
    });
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Customer Search</h3>
          <p className="text-sm text-gray-600">Search existing customer or enter new customer details</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by phone, name, or email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Customer Display */}
      {selectedCustomer && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-lg">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-green-900">{selectedCustomer.name}</p>
                  {selectedCustomer.membershipPlan && (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Crown className="h-4 w-4" />
                      Elite Member
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-green-700">{selectedCustomer.phone}</p>
                <p className="text-sm text-green-600">{selectedCustomer.email}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-green-600">
                  <span>{selectedCustomer.totalOrders} orders</span>
                  <span>₹{selectedCustomer.totalSpent.toLocaleString()} spent</span>
                  <span>₹{selectedCustomer.walletBalance} wallet</span>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-green-600 hover:text-green-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {selectedCustomer.membershipPlan && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <Crown className="h-5 w-5" />
                <span className="font-semibold">Elite Member Benefits</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-yellow-700">
                <div>• Free delivery on orders ₹349+</div>
                <div>• 5% extra discount on select items</div>
                <div>• No surge charges</div>
                <div>• Priority order processing</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchQuery.length >= 3 && !selectedCustomer && !isSearching && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            No existing customer found. You can proceed to enter new customer details below.
          </p>
        </div>
      )}
    </Card>
  );
}