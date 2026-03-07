import { useState } from "react";
import { Card, Button, Input, Select, Modal, Badge } from "../../components/ui";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Building2,
  MapPin,
  Phone,
  Clock,
  Users,
  Package,
  Save,
  X,
} from "lucide-react";
import { getStatusColor } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";
import type { Hub } from "../../types";

const mockHubs: Hub[] = [
  {
    id: "1",
    name: "Chennai Central Hub",
    code: "HUB-CHN-001",
    description: "Main distribution hub for Chennai region",
    address: {
      street: "123 Anna Salai",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600002",
      country: "India",
    },
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
    },
    contactInfo: {
      phone: "+91 9876543210",
      email: "chennai.hub@fishapp.com",
      manager: "Rajesh Kumar",
    },
    operatingHours: {
      open: "06:00",
      close: "22:00",
      workingDays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    capacity: {
      storage: 5000,
      dailyOrders: 1000,
      staff: 25,
    },
    isActive: true,
    connectedStores: ["store1", "store2", "store3"],
    createdBy: "Admin",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Bangalore North Hub",
    code: "HUB-BLR-001",
    description: "Primary hub serving North Bangalore",
    address: {
      street: "456 MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
    },
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
    },
    contactInfo: {
      phone: "+91 9876543211",
      email: "bangalore.hub@fishapp.com",
      manager: "Priya Sharma",
    },
    operatingHours: {
      open: "05:30",
      close: "23:00",
      workingDays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    capacity: {
      storage: 7500,
      dailyOrders: 1500,
      staff: 35,
    },
    isActive: true,
    connectedStores: ["store4", "store5"],
    createdBy: "Admin",
    createdAt: "2024-01-15",
  },
];

interface HubStatsProps {
  hubs: Hub[];
}

function HubStats({ hubs }: HubStatsProps) {
  const activeHubs = hubs.filter((hub) => hub.isActive).length;
  const totalCapacity = hubs.reduce(
    (sum, hub) => sum + hub.capacity.storage,
    0,
  );
  const totalStores = hubs.reduce(
    (sum, hub) => sum + hub.connectedStores.length,
    0,
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Total Hubs</p>
            <p className="text-lg sm:text-xl font-bold">{hubs.length}</p>
          </div>
        </div>
      </Card>
      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Active Hubs</p>
            <p className="text-lg sm:text-xl font-bold">{activeHubs}</p>
          </div>
        </div>
      </Card>
      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Connected Stores</p>
            <p className="text-lg sm:text-xl font-bold">{totalStores}</p>
          </div>
        </div>
      </Card>
      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Total Capacity</p>
            <p className="text-lg sm:text-xl font-bold">
              {totalCapacity.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface HubFormProps {
  hub?: Hub;
  onSave: (hubData: Partial<Hub>) => void;
  onCancel: () => void;
}

function HubForm({ hub, onSave, onCancel }: HubFormProps) {
  const [formData, setFormData] = useState({
    name: hub?.name || "",
    code: hub?.code || "",
    description: hub?.description || "",
    street: hub?.address.street || "",
    city: hub?.address.city || "",
    state: hub?.address.state || "",
    pincode: hub?.address.pincode || "",
    country: hub?.address.country || "India",
    phone: hub?.contactInfo.phone || "",
    email: hub?.contactInfo.email || "",
    manager: hub?.contactInfo.manager || "",
    open: hub?.operatingHours.open || "06:00",
    close: hub?.operatingHours.close || "22:00",
    workingDays: hub?.operatingHours.workingDays || [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    storage: hub?.capacity.storage || 0,
    dailyOrders: hub?.capacity.dailyOrders || 0,
    staff: hub?.capacity.staff || 0,
    deliveryRadius: hub?.deliveryRadius || undefined,
    deliveryType: hub?.selectedZones && hub.selectedZones.length > 0 ? 'zones' : 'radius',
    selectedZones: hub?.selectedZones || [],
    latitude: hub?.location.latitude || 0,
    longitude: hub?.location.longitude || 0,
    isActive: hub?.isActive ?? true,
    assignAllSlots: hub?.deliverySlots ? false : true,
    deliverySlots: hub?.deliverySlots || [],
  });

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleSubmit = () => {
    const hubData: Partial<Hub> = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
      },
      location: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      contactInfo: {
        phone: formData.phone,
        email: formData.email,
        manager: formData.manager,
      },
      operatingHours: {
        open: formData.open,
        close: formData.close,
        workingDays: formData.workingDays,
      },
      capacity: {
        storage: formData.storage,
        dailyOrders: formData.dailyOrders,
        staff: formData.staff,
      },
      deliveryRadius: formData.deliveryType === 'radius' ? formData.deliveryRadius : undefined,
      selectedZones: formData.deliveryType === 'zones' ? formData.selectedZones : undefined,
      isActive: formData.isActive,
      deliverySlots: formData.assignAllSlots ? undefined : formData.deliverySlots,
    };
    onSave(hubData);
  };

  const toggleWorkingDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Hub Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Chennai Central Hub"
            required
          />
          <Input
            label="Hub Code"
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, code: e.target.value }))
            }
            placeholder="HUB-CHN-001"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
            rows={2}
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Main distribution hub for Chennai region"
          />
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Active Hub</span>
          </label>
        </div>
      </div>

      {/* Address Information */}
      <div className="border rounded-lg p-4 bg-green-50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address & Location
        </h3>
        <div className="space-y-4">
          <Input
            label="Street Address"
            value={formData.street}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, street: e.target.value }))
            }
            placeholder="123 Anna Salai"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              value={formData.city}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, city: e.target.value }))
              }
              placeholder="Chennai"
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, state: e.target.value }))
              }
              placeholder="Tamil Nadu"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Pincode"
              value={formData.pincode}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, pincode: e.target.value }))
              }
              placeholder="600002"
            />
            <Input
              label="Country"
              value={formData.country}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, country: e.target.value }))
              }
              placeholder="India"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  latitude: parseFloat(e.target.value),
                }))
              }
              placeholder="13.0827"
            />
            <Input
              label="Longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  longitude: parseFloat(e.target.value),
                }))
              }
              placeholder="80.2707"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border rounded-lg p-4 bg-purple-50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="+91 9876543210"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="hub@fishapp.com"
          />
        </div>
        <div className="mt-4">
          <Input
            label="Manager Name"
            value={formData.manager}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, manager: e.target.value }))
            }
            placeholder="Rajesh Kumar"
          />
        </div>
      </div>

      {/* Operating Hours */}
      <div className="border rounded-lg p-4 bg-orange-50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Operating Hours
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Need to assign delivery slots while creating a new Hub. Partially select or All slots
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Opening Time"
            type="time"
            value={formData.open}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, open: e.target.value }))
            }
          />
          <Input
            label="Closing Time"
            type="time"
            value={formData.close}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, close: e.target.value }))
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Working Days
          </label>
          <div className="flex flex-wrap gap-2">
            {weekDays.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleWorkingDay(day)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  formData.workingDays.includes(day)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Slots Assignment
          </label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.assignAllSlots}
                onChange={() => setFormData(prev => ({ ...prev, assignAllSlots: true, deliverySlots: [] }))}
                className="rounded-full border-gray-300"
              />
              <span className="text-sm text-gray-700">Assign All Slots</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!formData.assignAllSlots}
                onChange={() => setFormData(prev => ({ ...prev, assignAllSlots: false }))}
                className="rounded-full border-gray-300"
              />
              <span className="text-sm text-gray-700">Partially Select Slots</span>
            </label>
          </div>
          
          {!formData.assignAllSlots && (
            <div className="bg-white border rounded-lg p-3 mt-3">
              <p className="text-xs text-gray-600 mb-3">Select specific delivery time slots:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { id: '6-9', label: '6 AM - 9 AM', value: '06:00-09:00' },
                  { id: '9-12', label: '9 AM - 12 PM', value: '09:00-12:00' },
                  { id: '12-15', label: '12 PM - 3 PM', value: '12:00-15:00' },
                  { id: '15-18', label: '3 PM - 6 PM', value: '15:00-18:00' },
                  { id: '18-21', label: '6 PM - 9 PM', value: '18:00-21:00' },
                  { id: '21-24', label: '9 PM - 12 AM', value: '21:00-24:00' }
                ].map(slot => (
                  <label key={slot.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.deliverySlots?.includes(slot.value) || false}
                      onChange={(e) => {
                        const slots = formData.deliverySlots || [];
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, deliverySlots: [...slots, slot.value] }));
                        } else {
                          setFormData(prev => ({ ...prev, deliverySlots: slots.filter(s => s !== slot.value) }));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{slot.label}</span>
                  </label>
                ))}
              </div>
              {formData.deliverySlots && formData.deliverySlots.length > 0 && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ {formData.deliverySlots.length} slot(s) selected
                </p>
              )}
            </div>
          )}
          
          {formData.assignAllSlots && (
            <p className="text-xs text-blue-600 mt-2">
              ✓ All delivery slots will be available (6 AM - 12 AM)
            </p>
          )}
        </div>
      </div>

      {/* Capacity Information */}
      <div className="border rounded-lg p-4 bg-yellow-50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Capacity & Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Storage Capacity"
            type="number"
            value={formData.storage}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                storage: parseInt(e.target.value),
              }))
            }
            placeholder="5000"
          />
          <Input
            label="Daily Orders Capacity"
            type="number"
            value={formData.dailyOrders}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                dailyOrders: parseInt(e.target.value),
              }))
            }
            placeholder="1000"
          />
          <Input
            label="Staff Count"
            type="number"
            value={formData.staff}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                staff: parseInt(e.target.value),
              }))
            }
            placeholder="25"
          />
        </div>
      </div>

      {/* Configuration */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-3">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Hub ID"
            value={hub?.id || 'Auto-generated'}
            disabled
            placeholder="Auto-generated"
          />
        </div>
        
        {/* Delivery Configuration */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Configuration
          </label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.deliveryType === 'radius'}
                onChange={() => setFormData(prev => ({ ...prev, deliveryType: 'radius', selectedZones: [] }))}
                className="rounded-full border-gray-300"
              />
              <span className="text-sm text-gray-700">Fixed Radius</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.deliveryType === 'zones'}
                onChange={() => setFormData(prev => ({ ...prev, deliveryType: 'zones', deliveryRadius: undefined }))}
                className="rounded-full border-gray-300"
              />
              <span className="text-sm text-gray-700">Selected Zones</span>
            </label>
          </div>

          {formData.deliveryType === 'radius' && (
            <div>
              <Input
                label="Delivery Radius (km)"
                type="number"
                value={formData.deliveryRadius || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deliveryRadius: parseInt(e.target.value) || undefined,
                  }))
                }
                placeholder="5"
              />
              <p className="text-xs text-gray-500 mt-1">
                Hub will deliver within this radius from its location
              </p>
            </div>
          )}

          {formData.deliveryType === 'zones' && (
            <div className="bg-white border rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-3">Select delivery zones:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { id: 'zone-1', name: 'Anna Nagar', code: 'AN' },
                  { id: 'zone-2', name: 'T. Nagar', code: 'TN' },
                  { id: 'zone-3', name: 'Velachery', code: 'VL' },
                  { id: 'zone-4', name: 'Adyar', code: 'AD' },
                  { id: 'zone-5', name: 'Mylapore', code: 'MY' },
                  { id: 'zone-6', name: 'Nungambakkam', code: 'NG' },
                  { id: 'zone-7', name: 'Porur', code: 'PR' },
                  { id: 'zone-8', name: 'Tambaram', code: 'TB' },
                  { id: 'zone-9', name: 'Chrompet', code: 'CH' }
                ].map(zone => (
                  <label key={zone.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.selectedZones?.includes(zone.id) || false}
                      onChange={(e) => {
                        const zones = formData.selectedZones || [];
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, selectedZones: [...zones, zone.id] }));
                        } else {
                          setFormData(prev => ({ ...prev, selectedZones: zones.filter(z => z !== zone.id) }));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <div>
                      <p className="text-sm font-medium">{zone.name}</p>
                      <p className="text-xs text-gray-500">{zone.code}</p>
                    </div>
                  </label>
                ))}
              </div>
              {formData.selectedZones && formData.selectedZones.length > 0 && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ {formData.selectedZones.length} zone(s) selected
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          {hub ? "Update Hub" : "Create Hub"}
        </Button>
      </div>
    </div>
  );
}

function HubRow({
  hub,
  onView,
  onEdit,
  onDelete,
}: {
  hub: Hub;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 items-center p-4 border-b hover:bg-gray-50">
      {/* Hub Name & Code */}
      <div className="col-span-3">
        <p className="font-semibold text-gray-800">{hub.name}</p>
        <p className="text-sm text-gray-500 font-mono">{hub.code}</p>
      </div>

      {/* Contact */}
      <div className="col-span-3">
        <p className="text-sm text-gray-700">{hub.contactInfo.manager}</p>
        <p className="text-sm text-gray-500">{hub.contactInfo.email}</p>
      </div>

      {/* Location */}
      <div className="col-span-2">
        <p className="text-sm text-gray-700">
          {hub.address.city}, {hub.address.state}
        </p>
      </div>

      {/* Status */}
      <div className="col-span-2 flex justify-center">
        <Badge variant={getStatusColor(hub.isActive ? "active" : "inactive")}>
          {hub.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex justify-end gap-2">
        <button
          onClick={onView}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Eye className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={onEdit}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Edit className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}

export function HubPage() {
  const { user } = useAuth();
  const [hubs, setHubs] = useState<Hub[]>(mockHubs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingHub, setEditingHub] = useState<Hub | undefined>();
  const [viewingHub, setViewingHub] = useState<Hub | undefined>();

  const filteredHubs = hubs.filter((hub) => {
    const matchesSearch =
      hub.name.toLowerCase().includes(search.toLowerCase()) ||
      hub.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" ? hub.isActive : !hub.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleSaveHub = (hubData: Partial<Hub>) => {
    if (editingHub) {
      // Update existing hub
      setHubs((prev) =>
        prev.map((hub) =>
          hub.id === editingHub.id
            ? { ...hub, ...hubData, id: editingHub.id }
            : hub,
        ),
      );
      setEditingHub(undefined);
    } else {
      // Create new hub
      const newHub: Hub = {
        ...(hubData as Hub),
        id: Date.now().toString(),
        connectedStores: [],
        createdBy: user?.name || "Admin",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setHubs((prev) => [...prev, newHub]);
      setShowCreateModal(false);
    }
  };

  const handleEditHub = (hub: Hub) => {
    setEditingHub(hub);
  };

  const handleViewHub = (hub: Hub) => {
    setViewingHub(hub);
    setShowViewModal(true);
  };

  const handleDeleteHub = (hubId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this hub? This action cannot be undone.",
      )
    ) {
      setHubs((prev) => prev.filter((hub) => hub.id !== hubId));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Hub Management</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage distribution hubs and their operations
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto text-sm">
          <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Add Hub
        </Button>
      </div>

      {/* Stats */}
      <HubStats hubs={hubs} />

      {/* Filters */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search hubs by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 sm:pl-10 text-sm"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            className="w-full sm:w-auto text-sm"
          />
        </div>
      </Card>

      {/* Hubs List */}
      <div className="space-y-4">
        {filteredHubs.length > 0 ? (
          <>
            {/* Desktop Table Header - Hidden on mobile */}
            <Card className="hidden lg:block">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 rounded-t-lg">
                <div className="col-span-3 font-semibold text-sm text-gray-600">
                  Hub
                </div>
                <div className="col-span-3 font-semibold text-sm text-gray-600">
                  Contact
                </div>
                <div className="col-span-2 font-semibold text-sm text-gray-600">
                  Location
                </div>
                <div className="col-span-2 font-semibold text-sm text-gray-600 text-center">
                  Status
                </div>
                <div className="col-span-2 font-semibold text-sm text-gray-600 text-right">
                  Actions
                </div>
              </div>
              <div>
                {filteredHubs.map((hub) => (
                  <HubRow
                    key={hub.id}
                    hub={hub}
                    onView={() => handleViewHub(hub)}
                    onEdit={() => handleEditHub(hub)}
                    onDelete={() => handleDeleteHub(hub.id)}
                  />
                ))}
              </div>
            </Card>

            {/* Mobile Card Layout */}
            <div className="lg:hidden space-y-4">
              {filteredHubs.map((hub) => (
                <Card key={hub.id} className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{hub.name}</h3>
                        <p className="text-sm text-gray-500 font-mono">{hub.code}</p>
                      </div>
                      <Badge variant={getStatusColor(hub.isActive ? "active" : "inactive")}>
                        {hub.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Manager:</span>
                        <span className="text-gray-800">{hub.contactInfo.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-800 truncate ml-2">{hub.contactInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-800">{hub.address.city}, {hub.address.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="text-gray-800">{hub.capacity.storage.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleViewHub(hub)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleEditHub(hub)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Hub"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteHub(hub.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Hub"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-8 sm:p-12 text-center">
            <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No hubs found
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              Your search or filter criteria did not match any hubs.
            </p>
          </Card>
        )}
      </div>

      {/* View Hub Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingHub(undefined);
        }}
        title="Hub Details"
        size="xl"
      >
        {viewingHub && (
          <div className="space-y-6">
            {/* Hub Header */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {viewingHub.name}
                </h3>
                <p className="text-gray-600 font-mono">{viewingHub.code}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={viewingHub.isActive ? "success" : "secondary"}
                  >
                    {viewingHub.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Hub Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Basic Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hub Code:</span>
                    <span className="font-mono">{viewingHub.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="text-right">{viewingHub.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manager:</span>
                    <span>{viewingHub.contactInfo.manager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>
                      {new Date(viewingHub.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Contact Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{viewingHub.contactInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{viewingHub.contactInfo.email}</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Address</h4>
                <div className="text-sm text-gray-600">
                  <p>{viewingHub.address.street}</p>
                  <p>
                    {viewingHub.address.city}, {viewingHub.address.state}
                  </p>
                  <p>
                    {viewingHub.address.pincode}, {viewingHub.address.country}
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Operating Hours
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hours:</span>
                    <span>
                      {viewingHub.operatingHours.open} -{" "}
                      {viewingHub.operatingHours.close}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Working Days:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {viewingHub.operatingHours.workingDays.map((day) => (
                        <Badge
                          key={day}
                          variant="secondary"
                          className="text-xs"
                        >
                          {day.slice(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Capacity & Statistics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Storage
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {viewingHub.capacity.storage.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-700">kg capacity</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">
                      Daily Orders
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {viewingHub.capacity.dailyOrders.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-700">orders/day</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">
                      Staff
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">
                    {viewingHub.capacity.staff}
                  </p>
                  <p className="text-xs text-orange-700">team members</p>
                </div>
              </div>
            </div>

            {/* Connected Stores */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Connected Stores
              </h4>
              <div className="flex flex-wrap gap-2">
                {viewingHub.connectedStores.map((storeId) => (
                  <Badge key={storeId} variant="info">
                    Store {storeId.replace("store", "")}
                  </Badge>
                ))}
                {viewingHub.connectedStores.length === 0 && (
                  <p className="text-sm text-gray-500">No stores connected</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setViewingHub(undefined);
                }}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditHub(viewingHub);
                }}
                className="flex-1"
              >
                Edit Hub
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Hub Modal */}
      <Modal
        isOpen={showCreateModal || !!editingHub}
        onClose={() => {
          setShowCreateModal(false);
          setEditingHub(undefined);
        }}
        title={editingHub ? "Edit Hub" : "Create New Hub"}
        size="xl"
      >
        <HubForm
          hub={editingHub}
          onSave={handleSaveHub}
          onCancel={() => {
            setShowCreateModal(false);
            setEditingHub(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
