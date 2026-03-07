import { useState, useEffect } from "react";
import { Button, Select } from "../../ui";
import { Building2, Store } from "lucide-react";

interface HubStoreLocation {
  id: string;
  name: string;
  type: "hub" | "store";
  address: string;
  isActive: boolean;
}

interface OrderLocationSwitchProps {
  orderId: string;
  currentType: "hub" | "store";
  currentLocationId?: string;
  onSwitch: (type: "hub" | "store", locationId: string) => Promise<void>;
  className?: string;
}

export function OrderLocationSwitch({
  currentType,
  currentLocationId,
  onSwitch,
  className = "",
}: OrderLocationSwitchProps) {
  const [locationType, setLocationType] = useState<"hub" | "store">(
    currentType,
  );
  const [locations, setLocations] = useState<HubStoreLocation[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState(
    currentLocationId || "",
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockLocations: HubStoreLocation[] =
      locationType === "hub"
        ? [
            {
              id: "hub1",
              name: "Main Hub - Chennai",
              type: "hub",
              address: "T Nagar, Chennai",
              isActive: true,
            },
            {
              id: "hub2",
              name: "North Hub - Chennai",
              type: "hub",
              address: "Ambattur, Chennai",
              isActive: true,
            },
          ]
        : [
            {
              id: "store1",
              name: "Store - Adyar",
              type: "store",
              address: "Adyar, Chennai",
              isActive: true,
            },
            {
              id: "store2",
              name: "Store - Velachery",
              type: "store",
              address: "Velachery, Chennai",
              isActive: true,
            },
          ];
    setLocations(mockLocations);
  }, [locationType]);

  const handleSwitch = async () => {
    if (!selectedLocationId) return;
    setLoading(true);
    try {
      await onSwitch(locationType, selectedLocationId);
    } finally {
      setLoading(false);
    }
  };

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}
    >
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        {locationType === "hub" ? (
          <Building2 className="h-5 w-5 text-purple-600" />
        ) : (
          <Store className="h-5 w-5 text-green-600" />
        )}
        Switch Order Location
      </h3>

      <div className="space-y-4">
        <Select
          label="Location Type"
          value={locationType}
          onChange={(e) => {
            setLocationType(e.target.value as "hub" | "store");
            setSelectedLocationId("");
          }}
          options={[
            { value: "hub", label: "Hub" },
            { value: "store", label: "Store" },
          ]}
        />

        <Select
          label={`Select ${locationType === "hub" ? "Hub" : "Store"}`}
          value={selectedLocationId}
          onChange={(e) => setSelectedLocationId(e.target.value)}
          options={[
            { value: "", label: `Select a ${locationType}` },
            ...locations.map((loc) => ({
              value: loc.id,
              label: loc.name,
            })),
          ]}
        />

        {selectedLocation && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">
              {selectedLocation.name}
            </p>
            <p className="text-sm text-gray-600">{selectedLocation.address}</p>
          </div>
        )}

        <Button
          onClick={handleSwitch}
          disabled={
            !selectedLocationId ||
            loading ||
            (locationType === currentType &&
              selectedLocationId === currentLocationId)
          }
          className="w-full"
        >
          {loading ? "Switching..." : "Switch Location"}
        </Button>
      </div>
    </div>
  );
}
