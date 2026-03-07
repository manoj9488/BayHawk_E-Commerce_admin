import { useState } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { Save, Plus, Clock, Trash2, Edit, Users, Calendar } from 'lucide-react';

interface DeliverySlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  capacity: number;
  cutoffTime: string;
  isActive: boolean;
  days: string[];
}

interface Holiday {
  id: string;
  date: string;
  name: string;
  description?: string;
}

export function DeliverySlotsPage() {
  const [slots, setSlots] = useState<DeliverySlot[]>([
    {
      id: '1',
      name: 'Morning Slot',
      startTime: '07:00',
      endTime: '09:00',
      capacity: 50,
      cutoffTime: '06:00',
      isActive: true,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    {
      id: '2',
      name: 'Afternoon Slot',
      startTime: '13:00',
      endTime: '15:00',
      capacity: 50,
      cutoffTime: '12:00',
      isActive: true,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    {
      id: '3',
      name: 'Evening Slot',
      startTime: '19:00',
      endTime: '21:00',
      capacity: 50,
      cutoffTime: '18:00',
      isActive: true,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }
  ]);

  const [cutoffTime, setCutoffTime] = useState('00:30');
  const [advanceBookingDays, setAdvanceBookingDays] = useState(7);
  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: '1', date: '2026-01-26', name: 'Republic Day' },
    { id: '2', date: '2026-08-15', name: 'Independence Day' },
    { id: '3', date: '2026-10-02', name: 'Gandhi Jayanti' },
  ]);
  const [newHoliday, setNewHoliday] = useState({ date: '', name: '', description: '' });

  const daysOfWeek = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  const addNewSlot = () => {
    const newSlot: DeliverySlot = {
      id: Date.now().toString(),
      name: `Slot ${slots.length + 1}`,
      startTime: '10:00',
      endTime: '12:00',
      capacity: 30,
      cutoffTime: '09:00',
      isActive: true,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    };
    setSlots([...slots, newSlot]);
  };

  const updateSlot = (id: string, updates: Partial<DeliverySlot>) => {
    setSlots(slots.map(slot => slot.id === id ? { ...slot, ...updates } : slot));
  };

  const deleteSlot = (id: string) => {
    setSlots(slots.filter(slot => slot.id !== id));
  };

  const toggleSlotDay = (slotId: string, day: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    const updatedDays = slot.days.includes(day)
      ? slot.days.filter(d => d !== day)
      : [...slot.days, day];

    updateSlot(slotId, { days: updatedDays });
  };

  const addHoliday = () => {
    if (!newHoliday.date || !newHoliday.name) return;
    const holiday: Holiday = {
      id: Date.now().toString(),
      ...newHoliday
    };
    setHolidays([...holidays, holiday]);
    setNewHoliday({ date: '', name: '', description: '' });
  };

  const deleteHoliday = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Delivery Slots</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Configure delivery time slots and capacity</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={addNewSlot} className="w-full sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Add Slot
          </Button>
          <Button className="w-full sm:w-auto">
            <Save className="mr-2 h-5 w-5" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Delivery Slots */}
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
                Set a cut-off time for each delivery slot. Orders placed after the cut-off time will not be accepted for that slot.
                For example, if a slot is 7:00 AM - 9:00 AM with a cut-off at 6:00 AM, customers must order before 6:00 AM to get delivery in that slot.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {slots.map((slot) => (
            <div key={slot.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={slot.isActive}
                    onChange={(e) => updateSlot(slot.id, { isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">{slot.name}</span>
                    <span className="text-sm text-gray-500 ml-2">{slot.startTime} - {slot.endTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteSlot(slot.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slot Name</label>
                  <Input
                    value={slot.name}
                    onChange={(e) => updateSlot(slot.id, { name: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <div className="relative">
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSlot(slot.id, { startTime: e.target.value })}
                      className="w-full"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <div className="relative">
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSlot(slot.id, { endTime: e.target.value })}
                      className="w-full"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cut-off Time
                    <span className="text-xs text-gray-500 ml-1">(Order deadline)</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="time"
                      value={slot.cutoffTime}
                      onChange={(e) => updateSlot(slot.id, { cutoffTime: e.target.value })}
                      className="w-full bg-yellow-50 border-yellow-300"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-yellow-600 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Orders accepted until</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <Input
                    type="number"
                    value={slot.capacity}
                    onChange={(e) => updateSlot(slot.id, { capacity: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                <div className="flex gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.key}
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
      </Card>

      {/* Delivery Settings */}
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
                value={cutoffTime}
                onChange={(e) => setCutoffTime(e.target.value)}
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Orders placed after this time will be scheduled for the next available day
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advance Booking Days
              </label>
              <Input
                type="number"
                value={advanceBookingDays}
                onChange={(e) => setAdvanceBookingDays(parseInt(e.target.value))}
                min="1"
                max="30"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Maximum days in advance customers can book delivery
              </p>
            </div>
          </div>

          <div className="border-t pt-4 sm:pt-6">
            <h3 className="font-medium mb-4 text-sm sm:text-base">Delivery Restrictions</h3>
            <div className="space-y-3">
              {[
                { label: 'Allow same-day delivery', desc: 'Enable delivery on the same day if ordered before cut-off time' },
                { label: 'Block delivery on holidays', desc: 'Automatically disable delivery slots on public holidays' },
                { label: 'Enable express delivery', desc: 'Allow customers to pay extra for priority delivery' },
                { label: 'Weekend delivery', desc: 'Enable delivery slots on weekends' },
              ].map((setting, index) => (
                <div key={index} className="flex items-start sm:items-center justify-between py-2 gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-xs sm:text-sm">{setting.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{setting.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Slot Analytics */}
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
          {slots.filter(slot => slot.isActive).map((slot) => {
            const utilization = Math.floor(Math.random() * 80) + 20;
            return (
              <div key={slot.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{slot.name}</h4>
                  <span className="text-xs text-gray-500">{slot.startTime} - {slot.endTime}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Utilization</span>
                    <span className="font-medium">{utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${utilization}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{Math.floor(slot.capacity * utilization / 100)} / {slot.capacity}</span>
                    <span>orders</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Holiday Management */}
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
              onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
            />
            <Input
              label="Holiday Name"
              value={newHoliday.name}
              onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
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
                      <p className="text-xs text-gray-500">{new Date(holiday.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
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
