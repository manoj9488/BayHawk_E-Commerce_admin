import React, { useState } from 'react';
import { Button, Badge, Modal } from '../../ui';
import { MapPin, Plus, Check, Edit, Trash2, Home, Building, MapIcon } from 'lucide-react';
import { OthersAddressDisplay } from './OthersAddressDisplay';
import type { Customer } from '../../../types';

export interface SavedAddress {
  id: string;
  label: string;
  type: 'home' | 'work' | 'other';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  landmark?: string;
}

interface SavedAddressSelectorProps {
  customer: Customer | null;
  selectedAddressId?: string;
  onAddressSelect: (address: SavedAddress) => void;
  onAddNewAddress: () => void;
  className?: string;
}

// Mock saved addresses for demonstration
const mockSavedAddresses: SavedAddress[] = [
  {
    id: 'addr_001',
    label: 'Home',
    type: 'home',
    addressLine1: '123 Marina Beach Road, Apt 4B',
    addressLine2: 'Near Lighthouse',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    isDefault: true,
    landmark: 'Opposite to Marina Beach'
  },
  {
    id: 'addr_002',
    label: 'Office',
    type: 'work',
    addressLine1: '456 IT Park, Tower B, 5th Floor',
    addressLine2: 'OMR Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600096',
    isDefault: false,
    landmark: 'Near Sholinganallur Metro'
  },
  {
    id: 'addr_003',
    label: 'Parents House',
    type: 'other',
    addressLine1: '789 Anna Salai, Block C',
    addressLine2: 'T. Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    isDefault: false,
    landmark: 'Near Pondy Bazaar'
  },
  {
    id: 'addr_004',
    label: 'Weekend Villa',
    type: 'other',
    addressLine1: 'Plot 45, ECR Road',
    addressLine2: 'Mahabalipuram',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '603104',
    isDefault: false,
    landmark: 'Near Shore Temple'
  },
  {
    id: 'addr_005',
    label: 'Sister\'s Place',
    type: 'other',
    addressLine1: '321 Velachery Main Road, Flat 3A',
    addressLine2: 'Phoenix MarketCity Area',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600042',
    isDefault: false,
    landmark: 'Behind Phoenix Mall'
  },
  {
    id: 'addr_006',
    label: 'Friend\'s Apartment',
    type: 'other',
    addressLine1: '567 Adyar River View, Tower 2',
    addressLine2: 'Boat Club Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600020',
    isDefault: false,
    landmark: 'Near Adyar Club'
  },
  {
    id: 'addr_007',
    label: 'Grandparents Home',
    type: 'other',
    addressLine1: '890 Mylapore Tank Street',
    addressLine2: 'Near Kapaleeshwarar Temple',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600004',
    isDefault: false,
    landmark: 'Opposite to Temple Tank'
  },
  {
    id: 'addr_008',
    label: 'Vacation Rental',
    type: 'other',
    addressLine1: 'Beach House No. 12, Kovalam',
    addressLine2: 'Lighthouse Beach Road',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    pincode: '695527',
    isDefault: false,
    landmark: 'Near Lighthouse Beach'
  },
  {
    id: 'addr_009',
    label: 'Uncle\'s Farmhouse',
    type: 'other',
    addressLine1: 'Survey No. 234, Village Road',
    addressLine2: 'Kanchipuram District',
    city: 'Kanchipuram',
    state: 'Tamil Nadu',
    pincode: '631502',
    isDefault: false,
    landmark: 'Near Silk Weaving Center'
  },
  {
    id: 'addr_010',
    label: 'College Hostel',
    type: 'other',
    addressLine1: 'Room 405, Hostel Block B',
    addressLine2: 'Anna University Campus',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600025',
    isDefault: false,
    landmark: 'Near University Library'
  },
  {
    id: 'addr_011',
    label: 'Gym Trainer\'s Place',
    type: 'other',
    addressLine1: '123 Fitness Street, Apt 2B',
    addressLine2: 'Nungambakkam High Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600034',
    isDefault: false,
    landmark: 'Above Gold\'s Gym'
  },
  {
    id: 'addr_012',
    label: 'Cousin\'s New House',
    type: 'other',
    addressLine1: 'Plot 67, Rajiv Gandhi Salai',
    addressLine2: 'Navalur, OMR',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '603103',
    isDefault: false,
    landmark: 'Near DLF IT Park'
  },
  {
    id: 'addr_013',
    label: 'Yoga Studio',
    type: 'other',
    addressLine1: '456 Wellness Center, 3rd Floor',
    addressLine2: 'Besant Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600090',
    isDefault: false,
    landmark: 'Near Elliot\'s Beach'
  },
  {
    id: 'addr_014',
    label: 'Pet Boarding',
    type: 'other',
    addressLine1: '789 Pet Care Avenue',
    addressLine2: 'Chromepet',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600044',
    isDefault: false,
    landmark: 'Near Railway Station'
  },
  {
    id: 'addr_015',
    label: 'Event Venue',
    type: 'other',
    addressLine1: 'Grand Ballroom, Hotel Paradise',
    addressLine2: 'Mount Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600002',
    isDefault: false,
    landmark: 'Opposite Spencer Plaza'
  }
];

const addressTypeIcons = {
  home: Home,
  work: Building,
  other: MapIcon
};

const addressTypeColors = {
  home: 'green',
  work: 'blue',
  other: 'purple'
};

const addressFilters: Array<{
  value: 'all' | 'home' | 'work' | 'other';
  label: string;
  count: (addresses: SavedAddress[]) => number;
}> = [
  { value: 'all', label: 'All', count: (addresses) => addresses.length },
  { value: 'home', label: 'Home', count: (addresses) => addresses.filter(addr => addr.type === 'home').length },
  { value: 'work', label: 'Work', count: (addresses) => addresses.filter(addr => addr.type === 'work').length },
  { value: 'other', label: 'Others', count: (addresses) => addresses.filter(addr => addr.type === 'other').length }
];

export function SavedAddressSelector({
  customer,
  selectedAddressId,
  onAddressSelect,
  onAddNewAddress,
  className = ''
}: SavedAddressSelectorProps) {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'home' | 'work' | 'other'>('all');

  // In real implementation, this would fetch addresses based on customer ID
  const savedAddresses = customer ? mockSavedAddresses : [];
  
  // Filter addresses based on selected filter
  const filteredAddresses = savedAddresses.filter(addr => 
    filterType === 'all' ? true : addr.type === filterType
  );

  const handleAddressSelect = (address: SavedAddress) => {
    setSelectedAddress(address);
    onAddressSelect(address);
    setShowAddressModal(false);
  };

  const handleAddNewAddress = () => {
    setShowAddressModal(false);
    onAddNewAddress();
  };

  if (!customer) {
    // Show preview of "Others" addresses even without customer selection
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-center mb-4">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-purple-800 font-medium">Others Address Preview</p>
            <p className="text-xs text-purple-700">Search for a customer to access their saved addresses</p>
          </div>
        </div>
        
        {/* Display Others Addresses */}
        <OthersAddressDisplay 
          addresses={mockSavedAddresses}
          className="opacity-75"
        />
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Saved Addresses ({savedAddresses.length} total, {savedAddresses.filter(addr => addr.type === 'other').length} others)
          </label>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setShowAddressModal(true)}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Select Address
          </Button>
        </div>

        {selectedAddress && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`h-8 w-8 rounded-lg bg-${addressTypeColors[selectedAddress.type]}-600 flex items-center justify-center`}>
                  {React.createElement(addressTypeIcons[selectedAddress.type], {
                    className: "h-4 w-4 text-white"
                  })}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-blue-900">{selectedAddress.label}</h4>
                    <Badge variant={addressTypeColors[selectedAddress.type]}>
                      {selectedAddress.type}
                    </Badge>
                    {selectedAddress.isDefault && (
                      <Badge variant="success">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-blue-800">
                    {selectedAddress.addressLine1}
                    {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                  </p>
                  <p className="text-sm text-blue-700">
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </p>
                  {selectedAddress.landmark && (
                    <p className="text-xs text-blue-600 mt-1">
                      📍 {selectedAddress.landmark}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowAddressModal(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {!selectedAddress && savedAddresses.length > 0 && (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 text-center mb-3">
                Click "Select Address" to choose from {savedAddresses.length} saved addresses
                <br />
                <span className="text-purple-600 font-medium">
                  {savedAddresses.filter(addr => addr.type === 'other').length} other addresses available
                </span>
              </p>
            </div>
            
            {/* Display Others Addresses */}
            <OthersAddressDisplay 
              addresses={savedAddresses}
              onAddressSelect={handleAddressSelect}
              selectedAddressId={selectedAddressId}
            />
          </div>
        )}
      </div>

      {/* Address Selection Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Select Delivery Address"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                Saved Addresses for {customer.name}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-600">
                  Total: {savedAddresses.length} addresses
                </span>
                <span className="text-sm text-green-600">
                  Home: {savedAddresses.filter(addr => addr.type === 'home').length}
                </span>
                <span className="text-sm text-blue-600">
                  Work: {savedAddresses.filter(addr => addr.type === 'work').length}
                </span>
                <span className="text-sm text-purple-600">
                  Others: {savedAddresses.filter(addr => addr.type === 'other').length}
                </span>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddNewAddress}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          </div>

          {/* Address Type Filter */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            {addressFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setFilterType(filter.value)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filterType === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.label} ({filter.count(savedAddresses)})
              </button>
            ))}
          </div>

          {filteredAddresses.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAddresses.map((address) => {
                const Icon = addressTypeIcons[address.type];
                const isSelected = selectedAddressId === address.id;
                
                return (
                  <div
                    key={address.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleAddressSelect(address)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`h-10 w-10 rounded-lg bg-${addressTypeColors[address.type]}-600 flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{address.label}</h4>
                            <Badge variant={addressTypeColors[address.type]}>
                              {address.type}
                            </Badge>
                            {address.isDefault && (
                              <Badge variant="success">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-1">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          {address.landmark && (
                            <p className="text-xs text-gray-500">
                              📍 {address.landmark}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Address edit flow intentionally deferred until backend integration.
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Address delete flow intentionally deferred until backend integration.
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 mb-4">
                {filterType === 'all' 
                  ? 'No saved addresses found' 
                  : `No ${filterType} addresses found`
                }
              </p>
              <Button
                type="button"
                onClick={handleAddNewAddress}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {filterType === 'all' ? 'Add First Address' : `Add ${filterType} Address`}
              </Button>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddressModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            {selectedAddress && (
              <Button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="flex-1"
              >
                Use Selected Address
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
