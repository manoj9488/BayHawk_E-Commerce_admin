import { useState, useEffect } from "react";
import { Button, Select } from "../../ui";
import { Building2, Store } from "lucide-react";
import { hubsApi, storesApi } from "../../../utils/api";

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
    let cancelled = false;

    const loadLocations = async () => {
      try {
        if (locationType === "hub") {
          const response = await hubsApi.getAll({ limit: "200" });
          const items = Array.isArray(response?.data?.data) ? response.data.data : [];
          if (!cancelled) {
            setLocations(
              items.map((hub: any) => ({
                id: hub.id,
                name: hub.name,
                type: "hub",
                address: [hub.address?.city, hub.address?.state].filter(Boolean).join(", "),
                isActive: Boolean(hub.isActive),
              }))
            );
          }
        } else {
          const response = await storesApi.getAll({ limit: "200" });
          const items = Array.isArray(response?.data?.data) ? response.data.data : [];
          if (!cancelled) {
            setLocations(
              items.map((store: any) => ({
                id: store.id,
                name: store.name,
                type: "store",
                address: [store.address?.city, store.address?.state].filter(Boolean).join(", "),
                isActive: Boolean(store.isActive),
              }))
            );
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load locations", error);
          setLocations([]);
        }
      }
    };

    void loadLocations();

    return () => {
      cancelled = true;
    };
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
