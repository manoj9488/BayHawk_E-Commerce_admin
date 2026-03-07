import { useState, useEffect } from 'react';
import { Clock, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, Input, Select } from '../../ui';

interface SchedulingCardProps {
  preOrderType: string;
  isEliteMember?: boolean;
  onDateChange: (date: string) => void;
  onSlotChange: (slot: string) => void;
  onOccasionChange: (occasion: string) => void;
  selectedDate?: string;
  selectedSlot?: string;
  selectedOccasion?: string;
  errors?: {
    scheduledDate?: string;
    scheduledSlot?: string;
  };
}

const deliverySlots = [
  { value: '', label: 'Select Time Slot' },
  { value: 'slot1', label: 'Slot 1 (7:00 AM - 9:00 AM)', premium: false },
  { value: 'slot2', label: 'Slot 2 (10:00 AM - 12:00 PM)', premium: false },
  { value: 'slot3', label: 'Slot 3 (1:00 PM - 3:00 PM)', premium: true },
  { value: 'slot4', label: 'Slot 4 (4:00 PM - 6:00 PM)', premium: true },
  { value: 'slot5', label: 'Slot 5 (7:00 PM - 9:00 PM)', premium: true },
];

const occasionTypes = [
  { value: '', label: 'No Special Occasion' },
  { value: 'birthday', label: 'Birthday Celebration', emoji: '🎂' },
  { value: 'anniversary', label: 'Anniversary', emoji: '💕' },
  { value: 'festival', label: 'Festival (Pongal, Deepavali, etc.)', emoji: '🎉' },
  { value: 'wedding', label: 'Wedding Function', emoji: '💒' },
  { value: 'party', label: 'House Party', emoji: '🎊' },
  { value: 'business', label: 'Business Event', emoji: '🏢' },
  { value: 'other', label: 'Other Special Occasion', emoji: '🎁' }
];

const preOrderTypeConfig = {
  advance_booking: { minDays: 1, maxDays: 7, eliteMaxDays: 30 },
  rare_product: { minDays: 2, maxDays: 7, eliteMaxDays: 7 },
  bulk_order: { minDays: 3, maxDays: 14, eliteMaxDays: 14 },
  subscription: { minDays: 7, maxDays: 90, eliteMaxDays: 90 }
};

export function SchedulingCard({
  preOrderType,
  isEliteMember = false,
  onDateChange,
  onSlotChange,
  onOccasionChange,
  selectedDate,
  selectedSlot,
  selectedOccasion,
  errors
}: SchedulingCardProps) {
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState(deliverySlots);

  useEffect(() => {
    if (preOrderType && preOrderTypeConfig[preOrderType as keyof typeof preOrderTypeConfig]) {
      const config = preOrderTypeConfig[preOrderType as keyof typeof preOrderTypeConfig];
      const today = new Date();
      
      const minDays = config.minDays;
      const maxDays = isEliteMember ? config.eliteMaxDays : config.maxDays;
      
      const minDate = new Date(today.getTime() + minDays * 24 * 60 * 60 * 1000);
      const maxDate = new Date(today.getTime() + maxDays * 24 * 60 * 60 * 1000);
      
      setMinDate(minDate.toISOString().split('T')[0]);
      setMaxDate(maxDate.toISOString().split('T')[0]);
    }
  }, [preOrderType, isEliteMember]);

  useEffect(() => {
    // Simulate slot availability check based on selected date
    if (selectedDate) {
      const dayOfWeek = new Date(selectedDate).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Weekend slots might have different availability
      const updatedSlots = deliverySlots.map(slot => ({
        ...slot,
        label: slot.premium && isWeekend 
          ? `${slot.label} (Premium - Weekend)` 
          : slot.label
      }));
      
      setAvailableSlots(updatedSlots);
    }
  }, [selectedDate]);

  const getDateHelperText = () => {
    if (!preOrderType) return '';
    
    const config = preOrderTypeConfig[preOrderType as keyof typeof preOrderTypeConfig];
    const maxDays = isEliteMember ? config.eliteMaxDays : config.maxDays;
    
    return `Available from ${new Date(minDate).toLocaleDateString()} to ${new Date(maxDate).toLocaleDateString()} (${config.minDays}-${maxDays} days advance)`;
  };

  const getSlotAvailability = (slotValue: string) => {
    if (!selectedDate || !slotValue) return null;
    
    // Simulate slot availability (in real app, this would come from API)
    const availability = Math.random();
    
    if (availability > 0.8) {
      return { status: 'available', message: 'Available', color: 'green' };
    } else if (availability > 0.5) {
      return { status: 'limited', message: 'Limited slots', color: 'orange' };
    } else {
      return { status: 'full', message: 'Fully booked', color: 'red' };
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Delivery Scheduling</h3>
          <p className="text-sm text-gray-600">Select delivery date and time slot for your pre-order</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Scheduled Delivery Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                min={minDate}
                max={maxDate}
                error={errors?.scheduledDate}
                className="pl-10"
              />
            </div>
            {minDate && (
              <p className="text-xs text-gray-500 mt-1">
                {getDateHelperText()}
              </p>
            )}
          </div>

          {/* Slot Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Delivery Time Slot
            </label>
            <Select
              value={selectedSlot}
              onChange={(e) => onSlotChange(e.target.value)}
              options={availableSlots}
              error={errors?.scheduledSlot}
            />
            
            {selectedSlot && selectedDate && (
              <div className="mt-2">
                {(() => {
                  const availability = getSlotAvailability(selectedSlot);
                  if (!availability) return null;
                  
                  return (
                    <div className={`flex items-center gap-2 text-sm text-${availability.color}-600`}>
                      {availability.status === 'available' && <CheckCircle className="h-4 w-4" />}
                      {availability.status === 'limited' && <AlertTriangle className="h-4 w-4" />}
                      {availability.status === 'full' && <AlertTriangle className="h-4 w-4" />}
                      <span>{availability.message}</span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Occasion Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Special Occasion (Optional)
          </label>
          <Select
            value={selectedOccasion}
            onChange={(e) => onOccasionChange(e.target.value)}
            options={occasionTypes.map(occasion => ({
              value: occasion.value,
              label: occasion.emoji ? `${occasion.emoji} ${occasion.label}` : occasion.label
            }))}
          />
          {selectedOccasion && selectedOccasion !== '' && (
            <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 text-purple-800">
                <span className="text-lg">
                  {occasionTypes.find(o => o.value === selectedOccasion)?.emoji}
                </span>
                <span className="font-medium">Special Occasion Detected!</span>
              </div>
              <p className="text-sm text-purple-700 mt-1">
                We'll add special care and presentation for your {occasionTypes.find(o => o.value === selectedOccasion)?.label.toLowerCase()}.
              </p>
            </div>
          )}
        </div>

        {/* Elite Member Scheduling Benefits */}
        {isEliteMember && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-semibold">Elite Member Scheduling Benefits</span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Extended booking window (up to 30 days for advance bookings)</li>
              <li>• Priority slot allocation during peak times</li>
              <li>• Free slot changes up to 12 hours before delivery</li>
              <li>• Dedicated customer support for scheduling conflicts</li>
            </ul>
          </div>
        )}

        {/* Scheduling Guidelines */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Scheduling Guidelines</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Delivery slots are subject to availability</li>
            <li>• Premium slots (afternoon/evening) may have additional charges</li>
            <li>• Weekend deliveries have limited availability</li>
            <li>• Rare products may require flexible delivery timing</li>
            <li>• Bulk orders may need extended delivery windows</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}