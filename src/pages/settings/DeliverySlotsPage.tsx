import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { Save, Plus, Clock, Trash2, Users, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  settingsBackend,
  type DeliveryHolidayRecord,
  type DeliverySlotRecord,
  type DeliverySlotsPayload,
} from '../../utils/settingsBackend';

const defaultSettings: DeliverySlotsPayload['settings'] = {
  cutoffTime: '00:30',
  advanceBookingDays: 7,
  allowSameDayDelivery: true,
  blockDeliveryOnHolidays: true,
  enableExpressDelivery: true,
  weekendDelivery: true,
};

const daysOfWeek = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

export function DeliverySlotsPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<DeliverySlotRecord[]>([]);
  const [deliverySettings, setDeliverySettings] = useState(defaultSettings);
  const [holidays, setHolidays] = useState<DeliveryHolidayRecord[]>([]);
  const [newHoliday, setNewHoliday] = useState({ date: '', name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadSettings();
  }, [user?.loginType, user?.hubId, user?.storeId]);

  const slotPerformance = useMemo(
    () =>
      slots
        .filter((slot) => slot.isActive)
        .map((slot) => ({
          ...slot,
          utilizationPercentage: slot.utilizationPercentage ?? 0,
          bookedOrders: slot.bookedOrders ?? Math.floor(((slot.utilizationPercentage ?? 0) * slot.capacity) / 100),
        })),
    [slots]
  );

  const loadSettings = async () => {
    try {
      setLoading(true);
      const payload = await settingsBackend.loadDeliverySlots(user);
      setSlots(payload.slots);
      setDeliverySettings(payload.settings);
      setHolidays(payload.holidays);
    } catch (error) {
      console.error('Failed to load delivery slot settings:', error);
      setSlots([]);
      setDeliverySettings(defaultSettings);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const payload = await settingsBackend.saveDeliverySlots(
        {
          settings: deliverySettings,
          slots,
          holidays,
        },
        user
      );
      setSlots(payload.slots);
      setDeliverySettings(payload.settings);
      setHolidays(payload.holidays);
      alert('Delivery slot settings saved successfully.');
    } catch (error) {
      console.error('Failed to save delivery slot settings:', error);
      alert('Failed to save delivery slot settings.');
    } finally {
      setSaving(false);
    }
  };

  const addNewSlot = () => {
    setSlots((current) => [
      ...current,
      {
        id: `draft-slot-${Date.now()}`,
        name: `Slot ${current.length + 1}`,
        startTime: '10:00',
        endTime: '12:00',
        capacity: 30,
        cutoffTime: '09:00',
        isActive: true,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        utilizationPercentage: 0,
        bookedOrders: 0,
      },
    ]);
  };

  const updateSlot = (id: string, updates: Partial<DeliverySlotRecord>) => {
    setSlots((current) => current.map((slot) => (slot.id === id ? { ...slot, ...updates } : slot)));
  };

  const deleteSlot = (id: string) => {
    setSlots((current) => current.filter((slot) => slot.id !== id));
  };

  const toggleSlotDay = (slotId: string, day: string) => {
    const slot = slots.find((item) => item.id === slotId);
    if (!slot) {
      return;
    }

    const updatedDays = slot.days.includes(day)
      ? slot.days.filter((item) => item !== day)
      : [...slot.days, day];

    updateSlot(slotId, { days: updatedDays });
  };

  const addHoliday = () => {
    if (!newHoliday.date || !newHoliday.name) {
      return;
    }

    setHolidays((current) => [
      ...current,
      {
        id: `draft-holiday-${Date.now()}`,
        date: newHoliday.date,
        name: newHoliday.name,
        description: newHoliday.description,
        isActive: true,
      },
    ]);
    setNewHoliday({ date: '', name: '', description: '' });
  };

  const deleteHoliday = (id: string) => {
    setHolidays((current) => current.filter((holiday) => holiday.id !== id));
  };

  const updateSetting = <K extends keyof DeliverySlotsPayload['settings']>(
    key: K,
    value: DeliverySlotsPayload['settings'][K]
  ) => {
    setDeliverySettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Delivery Slots</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Configure delivery time slots and capacity
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={addNewSlot} className="w-full sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Add Slot
          </Button>
          <Button className="w-full sm:w-auto" onClick={saveSettings} disabled={saving}>
            <Save className="mr-2 h-5 w-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <Clock className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">Time Slots Configuration</h2>
            <p className="text-sm text-gray-600">Set up available delivery time slots with cut-off times</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-yellow-100 rounded">
              <Clock className="h-4 w-4 text-yellow-700" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 text-sm">Cut-off Time Limit</h3>
              <p className="text-sm text-yellow-800 mt-1">
                Set a cut-off time for each delivery slot. Orders placed after the cut-off time will not be accepted
                for that slot.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading delivery slot settings...</p>
        ) : (
          <div className="space-y-6">
            {slots.map((slot) => (
              <div key={slot.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={slot.isActive}
                      onChange={(event) => updateSlot(slot.id, { isActive: event.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">{slot.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteSlot(slot.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
                  <Input
                    label="Slot Name"
                    value={slot.name}
                    onChange={(event) => updateSlot(slot.id, { name: event.target.value })}
                  />
                  <Input
                    label="Start Time"
                    type="time"
                    value={slot.startTime}
                    onChange={(event) => updateSlot(slot.id, { startTime: event.target.value })}
                  />
                  <Input
                    label="End Time"
                    type="time"
                    value={slot.endTime}
                    onChange={(event) => updateSlot(slot.id, { endTime: event.target.value })}
                  />
                  <Input
                    label="Cut-off Time"
                    type="time"
                    value={slot.cutoffTime}
                    onChange={(event) => updateSlot(slot.id, { cutoffTime: event.target.value })}
                  />
                  <Input
                    label="Capacity"
                    type="number"
                    value={slot.capacity}
                    onChange={(event) =>
                      updateSlot(slot.id, {
                        capacity: Number.parseInt(event.target.value, 10) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                  <div className="flex gap-2 flex-wrap">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleSlotDay(slot.id, day.key)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          slot.days.includes(day.key)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Capacity: {slot.capacity} orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{slot.days.length} days active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-green-50 p-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Delivery Settings</h2>
            <p className="text-xs sm:text-sm text-gray-600">Configure delivery rules and restrictions</p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Day Delivery Cut-off Time
              </label>
              <Input
                type="time"
                value={deliverySettings.cutoffTime}
                onChange={(event) => updateSetting('cutoffTime', event.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Advance Booking Days</label>
              <Input
                type="number"
                value={deliverySettings.advanceBookingDays}
                onChange={(event) =>
                  updateSetting('advanceBookingDays', Number.parseInt(event.target.value, 10) || 1)
                }
                min="1"
                max="30"
              />
            </div>
          </div>

          <div className="border-t pt-4 sm:pt-6">
            <h3 className="font-medium mb-4 text-sm sm:text-base">Delivery Restrictions</h3>
            <div className="space-y-3">
              {[
                { key: 'allowSameDayDelivery', label: 'Allow same-day delivery' },
                { key: 'blockDeliveryOnHolidays', label: 'Block delivery on holidays' },
                { key: 'enableExpressDelivery', label: 'Enable express delivery' },
                { key: 'weekendDelivery', label: 'Weekend delivery' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-start sm:items-center justify-between py-2 gap-3">
                  <p className="font-medium text-xs sm:text-sm">{setting.label}</p>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={deliverySettings[setting.key as keyof typeof deliverySettings] as boolean}
                      onChange={(event) =>
                        updateSetting(
                          setting.key as keyof typeof deliverySettings,
                          event.target.checked as never
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-purple-50 p-2">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Slot Performance</h2>
            <p className="text-xs sm:text-sm text-gray-600">Current week's slot utilization</p>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {slotPerformance.map((slot) => (
            <div key={slot.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{slot.name}</h4>
                <span className="text-xs text-gray-500">
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Utilization</span>
                  <span className="font-medium">{slot.utilizationPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${slot.utilizationPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {slot.bookedOrders} / {slot.capacity}
                  </span>
                  <span>orders</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-red-50 p-2">
            <Calendar className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Holiday Management</h2>
            <p className="text-sm text-gray-600">Block delivery on specific dates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <Input
              label="Date"
              type="date"
              value={newHoliday.date}
              onChange={(event) => setNewHoliday({ ...newHoliday, date: event.target.value })}
            />
            <Input
              label="Holiday Name"
              value={newHoliday.name}
              onChange={(event) => setNewHoliday({ ...newHoliday, name: event.target.value })}
              placeholder="e.g., Diwali"
            />
            <div className="flex items-end">
              <Button onClick={addHoliday} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Holiday
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {holidays.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No holidays configured</p>
            ) : (
              holidays.map((holiday) => (
                <div key={holiday.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{holiday.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(holiday.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteHoliday(holiday.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
