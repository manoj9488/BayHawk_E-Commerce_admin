import { useState } from 'react';
import { Card, Button, Input, Select } from '../../components/ui';
import { Save, Truck, MapPin, Plus, Edit, Trash2, Calculator, Zap, CloudRain } from 'lucide-react';

interface ShippingZone {
  id: string;
  name: string;
  areas: string[];
  baseCharge: number;
  freeDeliveryThreshold: number;
  expressCharge: number;
  expressDeliveryEnabled: boolean;
  isActive: boolean;
}

export function ShippingChargesPage() {
  const [globalSettings, setGlobalSettings] = useState({
    freeDeliveryThreshold: 500,
    shipmentModel: 'hub_only' as 'hub_only' | 'hub_and_store',
    hubDeliveryCharge: 40,
    storeDeliveryCharge: 30,
    expressDeliveryEnabled: true,
    expressDeliveryCharge: 50,
    weightBasedChargesEnabled: true,
    surgeChargesEnabled: false,
    surgeCharge: 50,
    surgeChargeDescription: 'Mon-Sat, day delivery',
    weatherAlertAutoEnable: false,
    weatherAlertSurgeCharge: 50
  });

  const [zones, setZones] = useState<ShippingZone[]>([
    {
      id: '1',
      name: 'Zone A - Central',
      areas: ['T Nagar', 'Anna Nagar', 'Adyar', 'Mylapore'],
      baseCharge: 30,
      freeDeliveryThreshold: 500,
      expressCharge: 40,
      expressDeliveryEnabled: true,
      isActive: true
    },
    {
      id: '2',
      name: 'Zone B - North',
      areas: ['Ambattur', 'Avadi', 'Red Hills', 'Poonamallee'],
      baseCharge: 40,
      freeDeliveryThreshold: 600,
      expressCharge: 50,
      expressDeliveryEnabled: true,
      isActive: true
    },
    {
      id: '3',
      name: 'Zone C - South',
      areas: ['Tambaram', 'Chrompet', 'Pallavaram', 'Medavakkam'],
      baseCharge: 45,
      freeDeliveryThreshold: 700,
      expressCharge: 60,
      expressDeliveryEnabled: false,
      isActive: true
    }
  ]);

  const [weightBasedCharges] = useState([
    { minWeight: 0, maxWeight: 2, charge: 0 },
    { minWeight: 2, maxWeight: 5, charge: 10 },
    { minWeight: 5, maxWeight: 10, charge: 20 },
    { minWeight: 10, maxWeight: 20, charge: 40 }
  ]);

  const addNewZone = () => {
    const newZone: ShippingZone = {
      id: Date.now().toString(),
      name: `Zone ${zones.length + 1}`,
      areas: [],
      baseCharge: 35,
      freeDeliveryThreshold: 500,
      expressCharge: 45,
      expressDeliveryEnabled: true,
      isActive: true
    };
    setZones([...zones, newZone]);
  };

  const updateZone = (id: string, updates: Partial<ShippingZone>) => {
    setZones(zones.map(zone => zone.id === id ? { ...zone, ...updates } : zone));
  };

  const deleteZone = (id: string) => {
    setZones(zones.filter(zone => zone.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipping Charges</h1>
          <p className="text-gray-600">Configure delivery charges and shipping zones</p>
        </div>
        <Button>
          <Save className="mr-2 h-5 w-5" />
          Save All Changes
        </Button>
      </div>

      {/* Global Shipping Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-blue-50 p-2">
            <Truck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Global Shipping Settings</h2>
            <p className="text-sm text-gray-600">Default shipping configuration</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Shipment Model Selection */}
          <div className="border-b pb-6">
            <h3 className="font-medium mb-4">Shipment Delivery Model</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="shipmentModel"
                  checked={globalSettings.shipmentModel === 'hub_only'}
                  onChange={() => setGlobalSettings({ ...globalSettings, shipmentModel: 'hub_only' })}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Shipment 1: Hub Delivery Only</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Direct delivery from hub to customer. Single delivery charge applies.
                  </p>
                  <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-2 rounded">
                    Example: Hub → Customer (₹{globalSettings.hubDeliveryCharge})
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="shipmentModel"
                  checked={globalSettings.shipmentModel === 'hub_and_store'}
                  onChange={() => setGlobalSettings({ ...globalSettings, shipmentModel: 'hub_and_store' })}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Shipment 2: Hub + Store Delivery</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Two-tier delivery: Hub to Store, then Store to Customer. Combined charges apply.
                  </p>
                  <div className="mt-2 text-xs text-gray-500 bg-purple-50 p-2 rounded">
                    Example: Hub → Store (₹{globalSettings.hubDeliveryCharge}) + Store → Customer (₹{globalSettings.storeDeliveryCharge}) = Total: ₹{globalSettings.hubDeliveryCharge + globalSettings.storeDeliveryCharge}
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Free Delivery Threshold</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm">Free delivery for orders above</span>
              <Input
                type="number"
                value={globalSettings.freeDeliveryThreshold}
                onChange={(e) => setGlobalSettings({
                  ...globalSettings,
                  freeDeliveryThreshold: parseInt(e.target.value)
                })}
                className="w-24"
              />
              <span className="text-sm">₹</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">
              Delivery Charges Configuration
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({globalSettings.shipmentModel === 'hub_only' ? 'Hub Only Model' : 'Hub + Store Model'})
              </span>
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hub Delivery Charge (₹)
                </label>
                <Input
                  type="number"
                  value={globalSettings.hubDeliveryCharge}
                  onChange={(e) => setGlobalSettings({
                    ...globalSettings,
                    hubDeliveryCharge: parseInt(e.target.value)
                  })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {globalSettings.shipmentModel === 'hub_only' 
                    ? 'Direct hub-to-customer delivery charge' 
                    : 'Hub-to-store delivery charge'}
                </p>
              </div>
              {globalSettings.shipmentModel === 'hub_and_store' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Delivery Charge (₹)
                  </label>
                  <Input
                    type="number"
                    value={globalSettings.storeDeliveryCharge}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      storeDeliveryCharge: parseInt(e.target.value)
                    })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Store-to-customer delivery charge</p>
                </div>
              )}
            </div>
            {globalSettings.shipmentModel === 'hub_and_store' && (
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Total Delivery Charge:</strong> ₹{globalSettings.hubDeliveryCharge + globalSettings.storeDeliveryCharge}
                  <span className="text-xs ml-2">(Hub: ₹{globalSettings.hubDeliveryCharge} + Store: ₹{globalSettings.storeDeliveryCharge})</span>
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-3">Express Delivery</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  label="Extra Charge (₹)"
                  type="number"
                  value={globalSettings.expressDeliveryCharge}
                  onChange={(e) => setGlobalSettings({
                    ...globalSettings,
                    expressDeliveryCharge: parseInt(e.target.value)
                  })}
                />
              </div>
              <div className="pt-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={globalSettings.expressDeliveryEnabled}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      expressDeliveryEnabled: e.target.checked
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Enable Express Delivery</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Surge Charges</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={globalSettings.surgeChargesEnabled}
                  onChange={(e) => setGlobalSettings({
                    ...globalSettings,
                    surgeChargesEnabled: e.target.checked
                  })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Apply Surge Charges</span>
              </label>
              {globalSettings.surgeChargesEnabled && (
                <div className="pl-6 space-y-3">
                  <p className="text-xs text-gray-500">Apply surge charges for premium day delivery</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Surge Charge (₹)"
                      type="number"
                      value={globalSettings.surgeCharge}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings,
                        surgeCharge: parseInt(e.target.value)
                      })}
                    />
                    <Input
                      label="Description"
                      value={globalSettings.surgeChargeDescription}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings,
                        surgeChargeDescription: e.target.value
                      })}
                      placeholder="e.g., Mon-Sat, day delivery"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-blue-600" />
              Weather Alert Auto-Enable Surge
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={globalSettings.weatherAlertAutoEnable}
                  onChange={(e) => setGlobalSettings({
                    ...globalSettings,
                    weatherAlertAutoEnable: e.target.checked
                  })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Auto-enable surge charge on weather alerts</span>
              </label>
              {globalSettings.weatherAlertAutoEnable && (
                <div className="pl-6 space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700 mb-3">
                      When weather alerts are triggered (heavy rain, storms, floods), surge charges will automatically activate with the predefined value below.
                    </p>
                    <Input
                      label="Weather Alert Surge Charge (₹)"
                      type="number"
                      value={globalSettings.weatherAlertSurgeCharge}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings,
                        weatherAlertSurgeCharge: parseInt(e.target.value)
                      })}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This charge will be applied automatically when weather conditions affect delivery operations
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Shipping Zones */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Shipping Zones</h2>
              <p className="text-sm text-gray-600">Configure zone-specific delivery charges</p>
            </div>
          </div>
          <Button variant="secondary" onClick={addNewZone}>
            <Plus className="mr-2 h-5 w-5" />
            Add Zone
          </Button>
        </div>

        <div className="space-y-4">
          {zones.map((zone) => (
            <div key={zone.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={zone.isActive}
                    onChange={(e) => updateZone(zone.id, { isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="font-medium">{zone.name}</span>
                  <span className="text-sm text-gray-500">
                    {zone.areas.length} areas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteZone(zone.id)}>
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Input
                  label="Zone Name"
                  value={zone.name}
                  onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                />
                <Input
                  label="Base Charge (₹)"
                  type="number"
                  value={zone.baseCharge}
                  onChange={(e) => updateZone(zone.id, { baseCharge: parseInt(e.target.value) })}
                />
                <Input
                  label="Free Delivery Above (₹)"
                  type="number"
                  value={zone.freeDeliveryThreshold}
                  onChange={(e) => updateZone(zone.id, { freeDeliveryThreshold: parseInt(e.target.value) })}
                />
              </div>

              {/* Express Delivery Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-gray-900">Express Delivery</h4>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={zone.expressDeliveryEnabled}
                      onChange={(e) => updateZone(zone.id, { expressDeliveryEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
                {zone.expressDeliveryEnabled ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <Input
                      label="Express Delivery Charge (₹)"
                      type="number"
                      value={zone.expressCharge}
                      onChange={(e) => updateZone(zone.id, { expressCharge: parseInt(e.target.value) })}
                      className="bg-white"
                    />
                    <p className="text-xs text-yellow-700 mt-2">
                      Additional charge for express/priority delivery in this zone
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Express delivery is disabled for this zone
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Areas</label>
                <div className="flex flex-wrap gap-2">
                  {zone.areas.map((area, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                    >
                      {area}
                    </span>
                  ))}
                  <button className="px-2 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-500 hover:border-gray-400">
                    + Add Area
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weight-Based Charges */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2">
              <Calculator className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Weight-Based Additional Charges</h2>
              <p className="text-sm text-gray-600">Extra charges based on order weight</p>
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={globalSettings.weightBasedChargesEnabled}
              onChange={(e) => setGlobalSettings({
                ...globalSettings,
                weightBasedChargesEnabled: e.target.checked
              })}
              className="rounded"
            />
            <span className="text-sm font-medium">Enable Weight-Based Charges</span>
          </label>
        </div>

        <div className="space-y-4">
          {weightBasedCharges.map((weightCharge, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={weightCharge.minWeight}
                  className="w-20"
                  disabled
                />
                <span className="text-sm text-gray-500">to</span>
                <Input
                  type="number"
                  value={weightCharge.maxWeight}
                  className="w-20"
                  disabled
                />
                <span className="text-sm text-gray-500">kg</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Additional charge:</span>
                <Input
                  type="number"
                  value={weightCharge.charge}
                  className="w-20"
                  disabled={!globalSettings.weightBasedChargesEnabled}
                />
                <span className="text-sm">₹</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Shipping Calculator Preview */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-orange-50 p-2">
            <Zap className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Shipping Calculator Preview</h2>
            <p className="text-sm text-gray-600">Test your shipping charges configuration</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Select Zone"
            options={zones.map(zone => ({ value: zone.id, label: zone.name }))}
          />
          <Input
            label="Order Value (₹)"
            type="number"
            placeholder="1000"
          />
          <Input
            label="Weight (kg)"
            type="number"
            placeholder="3"
          />
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">Calculated Charges:</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Base Delivery Charge:</span>
              <span>₹30</span>
            </div>
            <div className="flex justify-between">
              <span>Weight-based Charge:</span>
              <span>₹10</span>
            </div>
            <div className="flex justify-between">
              <span>Express Delivery:</span>
              <span>₹40</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Free Delivery Discount:</span>
              <span>-₹30</span>
            </div>
            <div className="border-t pt-1 flex justify-between font-medium">
              <span>Total Shipping:</span>
              <span>₹50</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}