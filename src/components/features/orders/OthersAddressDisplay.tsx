import { Badge } from '../../ui';
import { MapIcon, MapPin, Clock } from 'lucide-react';

interface SavedAddress {
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

interface OthersAddressDisplayProps {
  addresses: SavedAddress[];
  onAddressSelect?: (address: SavedAddress) => void;
  selectedAddressId?: string;
  className?: string;
}

export function OthersAddressDisplay({ 
  addresses, 
  onAddressSelect, 
  selectedAddressId,
  className = '' 
}: OthersAddressDisplayProps) {
  const otherAddresses = addresses.filter(addr => addr.type === 'other');

  if (otherAddresses.length === 0) {
    return (
      <div className={`p-6 bg-purple-50 border border-purple-200 rounded-lg text-center ${className}`}>
        <MapIcon className="h-12 w-12 mx-auto mb-3 text-purple-300" />
        <p className="text-purple-600 font-medium">No "Others" addresses found</p>
        <p className="text-sm text-purple-500 mt-1">Add addresses like family homes, friend's places, etc.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <MapIcon className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-purple-900">Others Addresses</h3>
            <p className="text-sm text-purple-700">{otherAddresses.length} saved locations</p>
          </div>
        </div>
        <Badge variant="purple" className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {otherAddresses.length} Others
        </Badge>
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {otherAddresses.map((address) => {
          const isSelected = selectedAddressId === address.id;
          
          return (
            <div
              key={address.id}
              onClick={() => onAddressSelect?.(address)}
              className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-sm'
              }`}
            >
              {/* Address Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-purple-600' : 'bg-purple-100'
                  }`}>
                    <MapIcon className={`h-3 w-3 ${
                      isSelected ? 'text-white' : 'text-purple-600'
                    }`} />
                  </div>
                  <h4 className={`font-medium truncate ${
                    isSelected ? 'text-purple-900' : 'text-gray-900'
                  }`}>
                    {address.label}
                  </h4>
                </div>
                {address.isDefault && (
                  <Badge variant="success">Default</Badge>
                )}
              </div>

              {/* Address Details */}
              <div className="space-y-2">
                <div>
                  <p className={`text-sm font-medium ${
                    isSelected ? 'text-purple-800' : 'text-gray-800'
                  }`}>
                    {address.addressLine1}
                  </p>
                  {address.addressLine2 && (
                    <p className={`text-sm ${
                      isSelected ? 'text-purple-700' : 'text-gray-600'
                    }`}>
                      {address.addressLine2}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className={`h-3 w-3 ${
                    isSelected ? 'text-purple-600' : 'text-gray-500'
                  }`} />
                  <p className={`text-sm ${
                    isSelected ? 'text-purple-700' : 'text-gray-600'
                  }`}>
                    {address.city}, {address.state}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${
                    isSelected ? 'bg-purple-600' : 'bg-gray-400'
                  }`} />
                  <p className={`text-sm font-mono ${
                    isSelected ? 'text-purple-700' : 'text-gray-600'
                  }`}>
                    {address.pincode}
                  </p>
                </div>

                {address.landmark && (
                  <div className={`p-2 rounded text-xs ${
                    isSelected ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <span className="font-medium">📍 Landmark:</span> {address.landmark}
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-purple-200">
                  <div className="flex items-center gap-2 text-purple-600">
                    <div className="h-4 w-4 rounded-full bg-purple-600 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <span className="text-sm font-medium">Selected Address</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-purple-700">
              <MapPin className="h-4 w-4" />
              <span>{otherAddresses.length} Others Addresses</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Clock className="h-4 w-4" />
              <span>Ready for delivery</span>
            </div>
          </div>
          {selectedAddressId && (
            <Badge variant="purple" className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-white" />
              Address Selected
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}