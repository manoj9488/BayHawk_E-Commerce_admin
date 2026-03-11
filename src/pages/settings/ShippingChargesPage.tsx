import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Input, Select } from '../../components/ui';
import { Save, Truck, MapPin, Plus, Trash2, Calculator, Zap, CloudRain } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  settingsBackend,
  type ShippingChargesPayload,
  type ShippingWeightChargeRecord,
  type ShippingZoneRecord,
} from '../../utils/settingsBackend';

const defaultGlobalSettings: ShippingChargesPayload['globalSettings'] = {
  freeDeliveryThreshold: 500,
  shipmentModel: 'hub_only',
  hubDeliveryCharge: 40,
  storeDeliveryCharge: 30,
  expressDeliveryEnabled: true,
  expressDeliveryCharge: 50,
  weightBasedChargesEnabled: true,
  surgeChargesEnabled: false,
  surgeCharge: 50,
  surgeChargeDescription: 'Mon-Sat, day delivery',
  weatherAlertAutoEnable: false,
  weatherAlertSurgeCharge: 50,
};

export function ShippingChargesPage() {
  const { user } = useAuth();
  const [globalSettings, setGlobalSettings] = useState(defaultGlobalSettings);
  const [zones, setZones] = useState<ShippingZoneRecord[]>([]);
  const [weightBasedCharges, setWeightBasedCharges] = useState<ShippingWeightChargeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadSettings();
  }, [user?.loginType, user?.hubId, user?.storeId]);

  const calculatorPreview = useMemo(() => {
    const selectedZone = zones.find((zone) => zone.isActive) || zones[0];
    const orderValue = 1000;
    const orderWeight = 3;
    const baseCharge = selectedZone?.baseCharge ?? globalSettings.hubDeliveryCharge;
    const weightCharge =
      weightBasedCharges.find(
        (slab) => orderWeight >= slab.minWeight && orderWeight < slab.maxWeight && slab.isActive !== false
      )?.charge ?? 0;
    const expressCharge =
      globalSettings.expressDeliveryEnabled && selectedZone?.expressDeliveryEnabled
        ? selectedZone.expressCharge
        : 0;
    const freeDeliveryDiscount =
      orderValue >= (selectedZone?.freeDeliveryThreshold ?? globalSettings.freeDeliveryThreshold) ? baseCharge : 0;

    return {
      baseCharge,
      weightCharge,
      expressCharge,
      freeDeliveryDiscount,
      total: baseCharge + weightCharge + expressCharge - freeDeliveryDiscount,
      zoneName: selectedZone?.name || 'Default Zone',
    };
  }, [globalSettings, weightBasedCharges, zones]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const payload = await settingsBackend.loadShippingCharges(user);
      setGlobalSettings(payload.globalSettings);
      setZones(payload.zones);
      setWeightBasedCharges(payload.weightBasedCharges);
    } catch (error) {
      console.error('Failed to load shipping charges:', error);
      setGlobalSettings(defaultGlobalSettings);
      setZones([]);
      setWeightBasedCharges([]);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const payload = await settingsBackend.saveShippingCharges(
        {
          globalSettings,
          zones,
          weightBasedCharges,
        },
        user
      );
      setGlobalSettings(payload.globalSettings);
      setZones(payload.zones);
      setWeightBasedCharges(payload.weightBasedCharges);
      alert('Shipping charge settings saved successfully.');
    } catch (error) {
      console.error('Failed to save shipping charges:', error);
      alert('Failed to save shipping charge settings.');
    } finally {
      setSaving(false);
    }
  };

  const addNewZone = () => {
    setZones((current) => [
      ...current,
      {
        id: `draft-zone-${Date.now()}`,
        name: `Zone ${current.length + 1}`,
        areas: [],
        baseCharge: 35,
        freeDeliveryThreshold: 500,
        expressCharge: 45,
        expressDeliveryEnabled: true,
        isActive: true,
      },
    ]);
  };

  const updateZone = (id: string, updates: Partial<ShippingZoneRecord>) => {
    setZones((current) => current.map((zone) => (zone.id === id ? { ...zone, ...updates } : zone)));
  };

  const deleteZone = (id: string) => {
    setZones((current) => current.filter((zone) => zone.id !== id));
  };

  const updateWeightCharge = (index: number, updates: Partial<ShippingWeightChargeRecord>) => {
    setWeightBasedCharges((current) =>
      current.map((slab, slabIndex) => (slabIndex === index ? { ...slab, ...updates } : slab))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipping Charges</h1>
          <p className="text-gray-600">Configure delivery charges and shipping zones</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="mr-2 h-5 w-5" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

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
          <div className="border-b pb-6">
            <h3 className="font-medium mb-4">Shipment Delivery Model</h3>
            <div className="space-y-3">
              {[
                {
                  value: 'hub_only' as const,
                  label: 'Shipment 1: Hub Delivery Only',
                  description: 'Direct delivery from hub to customer. Single delivery charge applies.',
                },
                {
                  value: 'hub_and_store' as const,
                  label: 'Shipment 2: Hub + Store Delivery',
                  description: 'Two-tier delivery: Hub to Store, then Store to Customer. Combined charges apply.',
                },
              ].map((option) => (
                <label key={option.value} className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="shipmentModel"
                    checked={globalSettings.shipmentModel === option.value}
                    onChange={() => setGlobalSettings({ ...globalSettings, shipmentModel: option.value })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Free Delivery Threshold (Rs)"
            type="number"
            value={globalSettings.freeDeliveryThreshold}
            onChange={(event) =>
              setGlobalSettings({
                ...globalSettings,
                freeDeliveryThreshold: Number.parseInt(event.target.value, 10) || 0,
              })
            }
          />

          <div>
            <h3 className="font-medium mb-3">Delivery Charges Configuration</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Hub Delivery Charge (Rs)"
                type="number"
                value={globalSettings.hubDeliveryCharge}
                onChange={(event) =>
                  setGlobalSettings({
                    ...globalSettings,
                    hubDeliveryCharge: Number.parseInt(event.target.value, 10) || 0,
                  })
                }
              />
              {globalSettings.shipmentModel === 'hub_and_store' && (
                <Input
                  label="Store Delivery Charge (Rs)"
                  type="number"
                  value={globalSettings.storeDeliveryCharge}
                  onChange={(event) =>
                    setGlobalSettings({
                      ...globalSettings,
                      storeDeliveryCharge: Number.parseInt(event.target.value, 10) || 0,
                    })
                  }
                />
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Express Delivery</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Extra Charge (Rs)"
                type="number"
                value={globalSettings.expressDeliveryCharge}
                onChange={(event) =>
                  setGlobalSettings({
                    ...globalSettings,
                    expressDeliveryCharge: Number.parseInt(event.target.value, 10) || 0,
                  })
                }
              />
              <label className="flex items-center gap-2 pt-7">
                <input
                  type="checkbox"
                  checked={globalSettings.expressDeliveryEnabled}
                  onChange={(event) =>
                    setGlobalSettings({
                      ...globalSettings,
                      expressDeliveryEnabled: event.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm">Enable Express Delivery</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Surge Charges</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={globalSettings.surgeChargesEnabled}
                  onChange={(event) =>
                    setGlobalSettings({
                      ...globalSettings,
                      surgeChargesEnabled: event.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium">Apply Surge Charges</span>
              </label>
              {globalSettings.surgeChargesEnabled && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Surge Charge (Rs)"
                    type="number"
                    value={globalSettings.surgeCharge}
                    onChange={(event) =>
                      setGlobalSettings({
                        ...globalSettings,
                        surgeCharge: Number.parseInt(event.target.value, 10) || 0,
                      })
                    }
                  />
                  <Input
                    label="Description"
                    value={globalSettings.surgeChargeDescription}
                    onChange={(event) =>
                      setGlobalSettings({
                        ...globalSettings,
                        surgeChargeDescription: event.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-blue-600" />
              Weather Alert Auto-Enable Surge
            </h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={globalSettings.weatherAlertAutoEnable}
                onChange={(event) =>
                  setGlobalSettings({
                    ...globalSettings,
                    weatherAlertAutoEnable: event.target.checked,
                  })
                }
                className="rounded"
              />
              <span className="text-sm font-medium">Auto-enable surge charge on weather alerts</span>
            </label>
            {globalSettings.weatherAlertAutoEnable && (
              <div className="mt-3">
                <Input
                  label="Weather Alert Surge Charge (Rs)"
                  type="number"
                  value={globalSettings.weatherAlertSurgeCharge}
                  onChange={(event) =>
                    setGlobalSettings({
                      ...globalSettings,
                      weatherAlertSurgeCharge: Number.parseInt(event.target.value, 10) || 0,
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>
      </Card>

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

        {loading ? (
          <p className="text-sm text-gray-500">Loading shipping zone settings...</p>
        ) : (
          <div className="space-y-4">
            {zones.map((zone) => (
              <div key={zone.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={zone.isActive}
                      onChange={(event) => updateZone(zone.id, { isActive: event.target.checked })}
                      className="rounded"
                    />
                    <span className="font-medium">{zone.name}</span>
                    <span className="text-sm text-gray-500">{zone.areas.length} areas</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteZone(zone.id)}>
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Input
                    label="Zone Name"
                    value={zone.name}
                    onChange={(event) => updateZone(zone.id, { name: event.target.value })}
                  />
                  <Input
                    label="Base Charge (Rs)"
                    type="number"
                    value={zone.baseCharge}
                    onChange={(event) =>
                      updateZone(zone.id, { baseCharge: Number.parseInt(event.target.value, 10) || 0 })
                    }
                  />
                  <Input
                    label="Free Delivery Above (Rs)"
                    type="number"
                    value={zone.freeDeliveryThreshold}
                    onChange={(event) =>
                      updateZone(zone.id, {
                        freeDeliveryThreshold: Number.parseInt(event.target.value, 10) || 0,
                      })
                    }
                  />
                  <Input
                    label="Express Charge (Rs)"
                    type="number"
                    value={zone.expressCharge}
                    onChange={(event) =>
                      updateZone(zone.id, { expressCharge: Number.parseInt(event.target.value, 10) || 0 })
                    }
                    disabled={!zone.expressDeliveryEnabled}
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={zone.expressDeliveryEnabled}
                    onChange={(event) =>
                      updateZone(zone.id, { expressDeliveryEnabled: event.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Enable express delivery for this zone</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Areas</label>
                  <div className="flex flex-wrap gap-2">
                    {zone.areas.map((area) => (
                      <span key={`${zone.id}-${area}`} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

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
              onChange={(event) =>
                setGlobalSettings({
                  ...globalSettings,
                  weightBasedChargesEnabled: event.target.checked,
                })
              }
              className="rounded"
            />
            <span className="text-sm font-medium">Enable Weight-Based Charges</span>
          </label>
        </div>

        <div className="space-y-4">
          {weightBasedCharges.map((weightCharge, index) => (
            <div key={weightCharge.id || index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={weightCharge.minWeight}
                  className="w-20"
                  onChange={(event) =>
                    updateWeightCharge(index, { minWeight: Number.parseFloat(event.target.value) || 0 })
                  }
                />
                <span className="text-sm text-gray-500">to</span>
                <Input
                  type="number"
                  value={weightCharge.maxWeight}
                  className="w-20"
                  onChange={(event) =>
                    updateWeightCharge(index, { maxWeight: Number.parseFloat(event.target.value) || 0 })
                  }
                />
                <span className="text-sm text-gray-500">kg</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Additional charge:</span>
                <Input
                  type="number"
                  value={weightCharge.charge}
                  className="w-20"
                  onChange={(event) =>
                    updateWeightCharge(index, { charge: Number.parseFloat(event.target.value) || 0 })
                  }
                  disabled={!globalSettings.weightBasedChargesEnabled}
                />
                <span className="text-sm">Rs</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-orange-50 p-2">
            <Zap className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Shipping Calculator Preview</h2>
            <p className="text-sm text-gray-600">Quick preview based on the active zone configuration</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Preview Zone" value={calculatorPreview.zoneName} options={[{ value: calculatorPreview.zoneName, label: calculatorPreview.zoneName }]} onChange={() => undefined} />
          <Input label="Order Value (Rs)" type="number" value={1000} readOnly />
          <Input label="Weight (kg)" type="number" value={3} readOnly />
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">Calculated Charges:</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Base Delivery Charge:</span>
              <span>Rs {calculatorPreview.baseCharge}</span>
            </div>
            <div className="flex justify-between">
              <span>Weight-based Charge:</span>
              <span>Rs {calculatorPreview.weightCharge}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Delivery:</span>
              <span>Rs {calculatorPreview.expressCharge}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Free Delivery Discount:</span>
              <span>-Rs {calculatorPreview.freeDeliveryDiscount}</span>
            </div>
            <div className="border-t pt-1 flex justify-between font-medium">
              <span>Total Shipping:</span>
              <span>Rs {calculatorPreview.total}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
