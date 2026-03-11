import { useState } from "react";
import { Button, Select } from "../../ui";
import { MapPin, Home, Briefcase, MapPinned } from "lucide-react";

interface Address {
  type: "home" | "work" | "other";
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface AddressSelectorProps {
  customerId: string;
  currentAddress?: Address;
  onSelect: (address: Address) => Promise<void>;
  className?: string;
}

export function AddressSelector({
  currentAddress,
  onSelect,
  className = "",
}: AddressSelectorProps) {
  const [addresses] = useState<Address[]>([
    {
      type: "home",
      line1: "123 Main Street",
      line2: "Apt 4B",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
      isDefault: true,
    },
    {
      type: "work",
      line1: "456 Business Park",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600002",
    },
    {
      type: "other",
      line1: "789 Market Road",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600003",
    },
  ]);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    currentAddress
      ? addresses.findIndex((a) => a.type === currentAddress.type)
      : 0,
  );
  const [loading, setLoading] = useState(false);

  const handleSelect = async () => {
    if (selectedIndex < 0) return;
    setLoading(true);
    try {
      await onSelect(addresses[selectedIndex]);
    } finally {
      setLoading(false);
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-4 w-4" />;
      case "work":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <MapPinned className="h-4 w-4" />;
    }
  };

  const selectedAddress = addresses[selectedIndex];

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}
    >
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-green-600" />
        Select Delivery Address
      </h3>

      <div className="space-y-4">
        <Select
          label="Address Type"
          value={selectedIndex.toString()}
          onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
          options={addresses.map((addr, idx) => ({
            value: idx.toString(),
            label: `${addr.type.charAt(0).toUpperCase() + addr.type.slice(1)}${addr.isDefault ? " (Default)" : ""}`,
          }))}
        />

        {selectedAddress && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              {getAddressIcon(selectedAddress.type)}
              <span className="capitalize">{selectedAddress.type} Address</span>
              {selectedAddress.isDefault && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Default
                </span>
              )}
            </div>
            <div className="text-sm text-gray-700">
              <p>{selectedAddress.line1}</p>
              {selectedAddress.line2 && <p>{selectedAddress.line2}</p>}
              <p>
                {selectedAddress.city}, {selectedAddress.state} -{" "}
                {selectedAddress.pincode}
              </p>
            </div>
          </div>
        )}

        <Button onClick={handleSelect} disabled={loading} className="w-full">
          {loading ? "Updating..." : "Update Address"}
        </Button>
      </div>
    </div>
  );
}
