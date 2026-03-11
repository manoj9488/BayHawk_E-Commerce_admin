import { useMemo } from 'react';
import { Select, Badge } from '../../ui';
import { Clock, AlertTriangle, Calendar, Truck } from 'lucide-react';

interface DeliverySlot {
  value: string;
  label: string;
  type: 'regular' | 'next_day' | 'exotic';
  availableDate: string;
  isAvailable: boolean;
}

interface EnhancedDeliverySlotSelectorProps {
  hasExoticProducts: boolean;
  hasRareProducts: boolean;
  selectedSlot: string;
  onSlotChange: (slot: string) => void;
  error?: string;
  className?: string;
}

export function EnhancedDeliverySlotSelector({
  hasExoticProducts,
  hasRareProducts,
  selectedSlot,
  onSlotChange,
  error,
  className = ''
}: EnhancedDeliverySlotSelectorProps) {
  const availableSlots = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const slots: DeliverySlot[] = [];

    if (hasExoticProducts) {
      // Exotic products: 2-7 days delivery
      for (let i = 2; i <= 7; i++) {
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + i);
        
        slots.push({
          value: `exotic_day_${i}`,
          label: `Day ${i} - ${deliveryDate.toLocaleDateString('en-IN', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })} (Exotic Delivery)`,
          type: 'exotic',
          availableDate: deliveryDate.toISOString(),
          isAvailable: true
        });
      }
    } else {
      // Regular delivery slots for today and tomorrow
      const regularSlots = [
        { time: '7:00 AM - 9:00 AM', available: !hasRareProducts },
        { time: '10:00 AM - 12:00 PM', available: true },
        { time: '1:00 PM - 3:00 PM', available: true },
        { time: '4:00 PM - 6:00 PM', available: true },
        { time: '7:00 PM - 9:00 PM', available: true },
      ];

      // Today's slots (only if no rare products and current time allows)
      const currentHour = today.getHours();
      if (!hasRareProducts && currentHour < 15) { // Allow same day until 3 PM
        regularSlots.forEach((slot, index) => {
          const slotHour = index === 0 ? 7 : index === 1 ? 10 : index === 2 ? 13 : index === 3 ? 16 : 19;
          if (currentHour < slotHour - 2 && slot.available) { // 2 hour buffer
            slots.push({
              value: `today_slot_${index + 1}`,
              label: `Today - ${slot.time}`,
              type: 'regular',
              availableDate: today.toISOString(),
              isAvailable: true
            });
          }
        });
      }

      // Tomorrow's slots
      regularSlots.forEach((slot, index) => {
        if (slot.available) {
          slots.push({
            value: `tomorrow_slot_${index + 1}`,
            label: `Tomorrow - ${slot.time}`,
            type: hasRareProducts ? 'next_day' : 'regular',
            availableDate: tomorrow.toISOString(),
            isAvailable: true
          });
        }
      });

      // Next day slots for rare products
      if (hasRareProducts) {
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);
        
        regularSlots.forEach((slot, index) => {
          if (slot.available) {
            slots.push({
              value: `day_after_slot_${index + 1}`,
              label: `${dayAfterTomorrow.toLocaleDateString('en-IN', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })} - ${slot.time}`,
              type: 'next_day',
              availableDate: dayAfterTomorrow.toISOString(),
              isAvailable: true
            });
          }
        });
      }
    }

    return slots;
  }, [hasExoticProducts, hasRareProducts]);

  const getSlotTypeInfo = () => {
    if (hasExoticProducts) {
      return {
        icon: Clock,
        color: 'purple',
        title: 'Exotic Products Delivery',
        description: 'Exotic products require 2-7 days for delivery due to import and quality checks.'
      };
    } else if (hasRareProducts) {
      return {
        icon: AlertTriangle,
        color: 'orange',
        title: 'Rare Products Delivery',
        description: 'Rare products are available for next available slot delivery.'
      };
    } else {
      return {
        icon: Truck,
        color: 'green',
        title: 'Regular Delivery',
        description: 'Same day or next day delivery available for regular products.'
      };
    }
  };

  const slotInfo = getSlotTypeInfo();
  const SlotIcon = slotInfo.icon;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-gray-700">Delivery Slot</label>
        <Badge 
          variant={slotInfo.color} 
          className="flex items-center gap-1"
        >
          <SlotIcon className="h-3 w-3" />
          {hasExoticProducts ? 'Exotic' : hasRareProducts ? 'Rare' : 'Regular'}
        </Badge>
      </div>

      <div className={`p-3 rounded-lg border ${
        hasExoticProducts ? 'bg-purple-50 border-purple-200' :
        hasRareProducts ? 'bg-orange-50 border-orange-200' :
        'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-start gap-2">
          <SlotIcon className={`h-4 w-4 mt-0.5 ${
            hasExoticProducts ? 'text-purple-600' :
            hasRareProducts ? 'text-orange-600' :
            'text-green-600'
          }`} />
          <div className={`text-xs ${
            hasExoticProducts ? 'text-purple-800' :
            hasRareProducts ? 'text-orange-800' :
            'text-green-800'
          }`}>
            <p className="font-medium">{slotInfo.title}</p>
            <p>{slotInfo.description}</p>
          </div>
        </div>
      </div>

      <Select
        value={selectedSlot}
        onChange={(e) => onSlotChange(e.target.value)}
        error={error}
        options={[
          { value: '', label: 'Select Delivery Slot' },
          ...availableSlots.map(slot => ({
            value: slot.value,
            label: slot.label,
            disabled: !slot.isAvailable
          }))
        ]}
      />

      {selectedSlot && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              <span className="font-medium">Selected:</span> {
                availableSlots.find(slot => slot.value === selectedSlot)?.label
              }
            </span>
          </div>
          
          {hasExoticProducts && (
            <div className="mt-2 text-xs text-blue-700">
              <p>• Exotic products will be imported and quality-checked before delivery</p>
              <p>• You will receive updates on the delivery progress</p>
            </div>
          )}
          
          {hasRareProducts && (
            <div className="mt-2 text-xs text-blue-700">
              <p>• Rare products will be procured based on availability</p>
              <p>• Alternate products will be delivered if rare items are unavailable</p>
            </div>
          )}
        </div>
      )}

      {availableSlots.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No delivery slots available</p>
        </div>
      )}
    </div>
  );
}
