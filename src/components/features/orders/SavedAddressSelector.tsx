import React, { useEffect, useMemo, useState } from 'react';
import { Button, Badge, Modal } from '../../ui';
import { MapPin, Plus, Check, Edit, Trash2, Home, Building, MapIcon, Loader2 } from 'lucide-react';
import { OthersAddressDisplay } from './OthersAddressDisplay';
import { customersApi } from '../../../utils/api';
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

const addressTypeIcons = {
  home: Home,
  work: Building,
  other: MapIcon,
};

const addressTypeColors = {
  home: 'green',
  work: 'blue',
  other: 'purple',
};

const addressFilters: Array<{
  value: 'all' | 'home' | 'work' | 'other';
  label: string;
  count: (addresses: SavedAddress[]) => number;
}> = [
  { value: 'all', label: 'All', count: (addresses) => addresses.length },
  { value: 'home', label: 'Home', count: (addresses) => addresses.filter((addr) => addr.type === 'home').length },
  { value: 'work', label: 'Work', count: (addresses) => addresses.filter((addr) => addr.type === 'work').length },
  { value: 'other', label: 'Others', count: (addresses) => addresses.filter((addr) => addr.type === 'other').length },
];

function normalizeAddressType(value: string): 'home' | 'work' | 'other' {
  if (value === 'home' || value === 'work') {
    return value;
  }

  return 'other';
}

function mapApiAddress(raw: any): SavedAddress {
  const type = normalizeAddressType(raw?.type || raw?.address_type || 'other');

  return {
    id: String(raw?.id || ''),
    label: String(
      raw?.label || raw?.address_label || (type === 'home' ? 'Home' : type === 'work' ? 'Work' : 'Other')
    ),
    type,
    addressLine1: String(raw?.line1 || raw?.street_line_1 || ''),
    addressLine2: raw?.line2 || raw?.street_line_2 || undefined,
    city: String(raw?.city || ''),
    state: String(raw?.state || ''),
    pincode: String(raw?.pincode || ''),
    isDefault: Boolean(raw?.isDefault ?? raw?.is_default),
    landmark: raw?.instructions || undefined,
  };
}

export function SavedAddressSelector({
  customer,
  selectedAddressId,
  onAddressSelect,
  onAddNewAddress,
  className = '',
}: SavedAddressSelectorProps) {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'home' | 'work' | 'other'>('all');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (!customer?.id) {
      setSavedAddresses([]);
      setSelectedAddress(null);
      setErrorMessage(null);
      return;
    }

    let cancelled = false;

    const loadAddresses = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await customersApi.getAddresses(customer.id);
        const payload = response?.data;
        const list: unknown[] = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
        const mapped: SavedAddress[] = list.map((raw) => mapApiAddress(raw)).filter((item: SavedAddress) => item.id);

        if (cancelled) {
          return;
        }

        setSavedAddresses(mapped);

        const preferredAddress =
          mapped.find((address: SavedAddress) => address.id === selectedAddressId) ||
          mapped.find((address: SavedAddress) => address.isDefault) ||
          mapped[0] ||
          null;

        setSelectedAddress(preferredAddress);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSavedAddresses([]);
        setSelectedAddress(null);
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load customer addresses from backend.'
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadAddresses();

    return () => {
      cancelled = true;
    };
  }, [customer?.id, selectedAddressId, refreshTick]);

  const filteredAddresses = useMemo(
    () => savedAddresses.filter((addr) => (filterType === 'all' ? true : addr.type === filterType)),
    [filterType, savedAddresses]
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
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-purple-600" />
          <p className="text-sm text-purple-800 font-medium">Select a customer first</p>
          <p className="text-xs text-purple-700">Saved addresses are loaded from backend for the selected customer.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Saved Addresses ({savedAddresses.length} total, {savedAddresses.filter((addr) => addr.type === 'other').length} others)
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

        {isLoading && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading customer addresses...
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between gap-3">
            <span>{errorMessage}</span>
            <Button type="button" size="sm" variant="secondary" onClick={() => setRefreshTick((value) => value + 1)}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !errorMessage && selectedAddress && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`h-8 w-8 rounded-lg bg-${addressTypeColors[selectedAddress.type]}-600 flex items-center justify-center`}>
                  {React.createElement(addressTypeIcons[selectedAddress.type], {
                    className: 'h-4 w-4 text-white',
                  })}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-blue-900">{selectedAddress.label}</h4>
                    <Badge variant={addressTypeColors[selectedAddress.type]}>{selectedAddress.type}</Badge>
                    {selectedAddress.isDefault && <Badge variant="success">Default</Badge>}
                  </div>
                  <p className="text-sm text-blue-800">
                    {selectedAddress.addressLine1}
                    {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                  </p>
                  <p className="text-sm text-blue-700">
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </p>
                  {selectedAddress.landmark && <p className="text-xs text-blue-600 mt-1">📍 {selectedAddress.landmark}</p>}
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

        {!isLoading && !errorMessage && !selectedAddress && savedAddresses.length > 0 && (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 text-center mb-3">
                Click "Select Address" to choose from {savedAddresses.length} saved addresses
                <br />
                <span className="text-purple-600 font-medium">
                  {savedAddresses.filter((addr) => addr.type === 'other').length} other addresses available
                </span>
              </p>
            </div>

            <OthersAddressDisplay
              addresses={savedAddresses}
              onAddressSelect={handleAddressSelect}
              selectedAddressId={selectedAddressId}
            />
          </div>
        )}

        {!isLoading && !errorMessage && savedAddresses.length === 0 && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 text-center">
            No saved addresses available for this customer yet.
          </div>
        )}
      </div>

      <Modal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} title="Select Delivery Address" size="lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Saved Addresses for {customer.name}</h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-600">Total: {savedAddresses.length} addresses</span>
                <span className="text-sm text-green-600">
                  Home: {savedAddresses.filter((addr) => addr.type === 'home').length}
                </span>
                <span className="text-sm text-blue-600">
                  Work: {savedAddresses.filter((addr) => addr.type === 'work').length}
                </span>
                <span className="text-sm text-purple-600">
                  Others: {savedAddresses.filter((addr) => addr.type === 'other').length}
                </span>
              </div>
            </div>
            <Button type="button" size="sm" onClick={handleAddNewAddress} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            {addressFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setFilterType(filter.value)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filterType === filter.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
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
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                            <Badge variant={addressTypeColors[address.type]}>{address.type}</Badge>
                            {address.isDefault && <Badge variant="success">Default</Badge>}
                          </div>
                          <p className="text-sm text-gray-700 mb-1">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          {address.landmark && <p className="text-xs text-gray-500">📍 {address.landmark}</p>}
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
                          onClick={(event) => {
                            event.stopPropagation();
                            // Address edit flow intentionally deferred until manual order write APIs are integrated.
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation();
                            // Address delete flow intentionally deferred until manual order write APIs are integrated.
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
                {filterType === 'all' ? 'No saved addresses found' : `No ${filterType} addresses found`}
              </p>
              <Button type="button" onClick={handleAddNewAddress} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {filterType === 'all' ? 'Add First Address' : `Add ${filterType} Address`}
              </Button>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setShowAddressModal(false)} className="flex-1">
              Cancel
            </Button>
            {selectedAddress && (
              <Button type="button" onClick={() => setShowAddressModal(false)} className="flex-1">
                Use Selected Address
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
