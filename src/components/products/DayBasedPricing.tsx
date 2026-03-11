import { Card, Button } from '../ui';
import { Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

interface DayPrice {
  day: string;
  price: number;
  enabled: boolean;
}

interface DayBasedPricingData {
  enabled: boolean;
  dayPrices: DayPrice[];
}

interface DayBasedPricingProps {
  data: DayBasedPricingData;
  onChange: (data: DayBasedPricingData) => void;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export function DayBasedPricing({ data, onChange }: DayBasedPricingProps) {
  const handleToggleEnabled = () => {
    onChange({
      ...data,
      enabled: !data.enabled
    });
  };

  const handleDayPriceChange = (dayKey: string, price: number) => {
    const updatedDayPrices = data.dayPrices.map(dayPrice =>
      dayPrice.day === dayKey ? { ...dayPrice, price } : dayPrice
    );
    onChange({
      ...data,
      dayPrices: updatedDayPrices
    });
  };

  const handleDayToggle = (dayKey: string) => {
    const updatedDayPrices = data.dayPrices.map(dayPrice =>
      dayPrice.day === dayKey ? { ...dayPrice, enabled: !dayPrice.enabled } : dayPrice
    );
    onChange({
      ...data,
      dayPrices: updatedDayPrices
    });
  };

  const setPresetPricing = () => {
    // Example preset: Mon, Tue, Thu = 1000; Wed, Fri, Sun = 1200; Sat = disabled
    const presetPrices = data.dayPrices.map(dayPrice => {
      switch (dayPrice.day) {
        case 'monday':
        case 'tuesday':
        case 'thursday':
          return { ...dayPrice, price: 1000, enabled: true };
        case 'wednesday':
        case 'friday':
        case 'sunday':
          return { ...dayPrice, price: 1200, enabled: true };
        case 'saturday':
          return { ...dayPrice, price: 0, enabled: false };
        default:
          return dayPrice;
      }
    });
    
    onChange({
      ...data,
      dayPrices: presetPrices
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-600" />
          <h2 className="text-lg font-semibold">Day-based Pricing</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={setPresetPricing}
            disabled={!data.enabled}
          >
            Set Example Pricing
          </Button>
          <button
            type="button"
            onClick={handleToggleEnabled}
            className="flex items-center gap-2 text-sm"
          >
            {data.enabled ? (
              <ToggleRight className="h-5 w-5 text-green-600" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-gray-400" />
            )}
            <span className={data.enabled ? 'text-green-600 font-medium' : 'text-gray-500'}>
              {data.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </button>
        </div>
      </div>

      {!data.enabled && (
        <p className="text-sm text-gray-600 mb-4">
          Enable day-based pricing to set different prices for different days of the week
        </p>
      )}

      {data.enabled && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Set different prices for different days. Example: Monday-Thursday ₹1000, Friday-Sunday ₹1200
          </p>
          
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {DAYS_OF_WEEK.map(({ key, label }) => {
              const dayPrice = data.dayPrices.find(dp => dp.day === key);
              return (
                <div key={key} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDayToggle(key)}
                      className="flex items-center"
                    >
                      {dayPrice?.enabled ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={dayPrice?.price || 0}
                      onChange={(e) => handleDayPriceChange(key, Number(e.target.value))}
                      disabled={!dayPrice?.enabled}
                      className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                        !dayPrice?.enabled ? 'bg-gray-100 text-gray-400' : ''
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Pricing Summary:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              {data.dayPrices
                .filter(dp => dp.enabled && dp.price > 0)
                .map(dp => (
                  <div key={dp.day} className="flex justify-between">
                    <span className="capitalize">{dp.day}:</span>
                    <span className="font-medium">₹{dp.price}</span>
                  </div>
                ))}
              {data.dayPrices.filter(dp => dp.enabled && dp.price > 0).length === 0 && (
                <p className="text-blue-600">No pricing set for any day</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export type { DayBasedPricingData };