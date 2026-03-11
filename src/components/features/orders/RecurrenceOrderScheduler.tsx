import { useState, useEffect } from 'react';
import { Input, Select, Badge, Card } from '../../ui';
import { 
  Calendar, 
  Clock, 
  Repeat, 
  Tag, 
  AlertCircle, 
  CheckCircle,
  Percent,
  DollarSign,
  Gift,
  Zap
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

interface RecurrenceOrderSchedulerProps {
  onRecurrenceChange: (recurrenceData: RecurrenceData) => void;
  subtotal: number;
  className?: string;
}

export interface RecurrenceData {
  isRecurring: boolean;
  startDate: string;
  endDate: string;
  selectedDays: string[];
  numberOfTimes: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  discountType: 'percentage' | 'amount';
  discountValue: number;
  totalOccurrences: number;
  estimatedTotal: number;
}

const daysOfWeek = [
  { value: 'monday', label: 'Mon', fullName: 'Monday' },
  { value: 'tuesday', label: 'Tue', fullName: 'Tuesday' },
  { value: 'wednesday', label: 'Wed', fullName: 'Wednesday' },
  { value: 'thursday', label: 'Thu', fullName: 'Thursday' },
  { value: 'friday', label: 'Fri', fullName: 'Friday' },
  { value: 'saturday', label: 'Sat', fullName: 'Saturday' },
  { value: 'sunday', label: 'Sun', fullName: 'Sunday' }
];

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly', description: 'Every week on selected days' },
  { value: 'biweekly', label: 'Bi-weekly', description: 'Every 2 weeks on selected days' },
  { value: 'monthly', label: 'Monthly', description: 'Every month on selected days' }
];

const isFrequency = (value: string): value is RecurrenceData['frequency'] => {
  return value === 'weekly' || value === 'biweekly' || value === 'monthly';
};

export function RecurrenceOrderScheduler({ 
  onRecurrenceChange, 
  subtotal, 
  className = '' 
}: RecurrenceOrderSchedulerProps) {
  const [isRecurring, setIsRecurring] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [numberOfTimes, setNumberOfTimes] = useState(1);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);

  // Calculate total occurrences and estimated total
  const calculateOccurrences = () => {
    if (!isRecurring || !startDate || !endDate || selectedDays.length === 0) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let multiplier = 1;
    switch (frequency) {
      case 'weekly':
        multiplier = Math.floor(diffDays / 7) + 1;
        break;
      case 'biweekly':
        multiplier = Math.floor(diffDays / 14) + 1;
        break;
      case 'monthly':
        multiplier = Math.floor(diffDays / 30) + 1;
        break;
    }

    const totalOccurrences = Math.min(multiplier * selectedDays.length, numberOfTimes);
    return totalOccurrences;
  };

  const totalOccurrences = calculateOccurrences();
  
  // Calculate discount
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * discountValue) / 100 
    : discountValue;
  
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const estimatedTotal = discountedSubtotal * totalOccurrences;

  // Update parent component when data changes
  useEffect(() => {
    const recurrenceData: RecurrenceData = {
      isRecurring,
      startDate,
      endDate,
      selectedDays,
      numberOfTimes,
      frequency,
      discountType,
      discountValue,
      totalOccurrences,
      estimatedTotal
    };
    onRecurrenceChange(recurrenceData);
  }, [
    isRecurring, startDate, endDate, selectedDays, numberOfTimes, 
    frequency, discountType, discountValue, totalOccurrences, estimatedTotal, onRecurrenceChange
  ]);

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  // Set minimum dates
  const today = new Date().toISOString().split('T')[0];
  const maxEndDate = new Date();
  maxEndDate.setFullYear(maxEndDate.getFullYear() + 1);
  const maxEndDateStr = maxEndDate.toISOString().split('T')[0];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Recurrence Toggle */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
            <Repeat className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-900">🔄 Recurring Order Setup</h3>
            <p className="text-sm text-purple-700">Create recurring orders with automatic scheduling</p>
          </div>
        </div>
        <div className="ml-auto">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-purple-800">Enable Recurring Orders</span>
          </label>
        </div>
      </div>

      {isRecurring && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="space-y-6">
            {/* Date Range Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h4 className="text-lg font-semibold text-purple-900">📅 Date Range</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={today}
                    max={maxEndDateStr}
                    className="border-purple-300 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || today}
                    max={maxEndDateStr}
                    className="border-purple-300 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Days of Week Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-purple-600" />
                <h4 className="text-lg font-semibold text-purple-900">📆 Days of the Week</h4>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
                      selectedDays.includes(day.value)
                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-bold">{day.label}</div>
                      <div className="text-xs opacity-80">{day.fullName.slice(0, 3)}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedDays.length > 0 && (
                <div className="p-3 bg-purple-100 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Selected Days:</strong> {selectedDays.map(day => 
                      daysOfWeek.find(d => d.value === day)?.fullName
                    ).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Frequency and Number of Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Repeat className="h-4 w-4 inline mr-1" />
                  Frequency
                </label>
                <Select
                  value={frequency}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setFrequency(isFrequency(nextValue) ? nextValue : 'weekly');
                  }}
                  className="border-purple-300 focus:border-purple-500"
                  options={[
                    { value: '', label: 'Select Frequency' },
                    ...frequencyOptions.map(opt => ({
                      value: opt.value,
                      label: `${opt.label} - ${opt.description}`
                    }))
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Zap className="h-4 w-4 inline mr-1" />
                  Maximum Number of Times
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={numberOfTimes}
                  onChange={(e) => setNumberOfTimes(parseInt(e.target.value) || 1)}
                  placeholder="Enter max occurrences"
                  className="border-purple-300 focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum number of recurring orders (1-100)
                </p>
              </div>
            </div>

            {/* Discount Configuration */}
            <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-green-600" />
                <h4 className="text-lg font-semibold text-green-900">💰 Recurring Order Discount</h4>
                <Badge variant="success">Special Offer</Badge>
              </div>

              {/* Discount Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDiscountType('percentage')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    discountType === 'percentage'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Percent className="h-5 w-5" />
                    <span className="font-semibold">Percentage Discount</span>
                  </div>
                  <p className="text-sm opacity-90">Apply % discount on each order</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDiscountType('amount')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    discountType === 'amount'
                      ? 'bg-green-600 text-white border-green-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-semibold">Fixed Amount</span>
                  </div>
                  <p className="text-sm opacity-90">Fixed discount per order</p>
                </button>
              </div>

              {/* Discount Value Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount {discountType === 'percentage' ? 'Percentage' : 'Amount'}
                  </label>
                  <div className="relative">
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      discountType === 'percentage' ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {discountType === 'percentage' ? (
                        <Percent className="h-5 w-5" />
                      ) : (
                        <DollarSign className="h-5 w-5" />
                      )}
                    </div>
                    <Input
                      type="number"
                      step={discountType === 'percentage' ? '0.1' : '0.01'}
                      min="0"
                      max={discountType === 'percentage' ? 50 : subtotal}
                      value={discountValue || ''}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                      placeholder={discountType === 'percentage' ? 'Enter %' : 'Enter ₹'}
                      className="pl-10 border-green-300 focus:border-green-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {discountType === 'percentage' ? 'Max: 50%' : `Max: ${formatCurrency(subtotal)}`}
                  </p>
                </div>

                {/* Quick Discount Options */}
                {discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Options</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[5, 10, 15].map((percent) => (
                        <button
                          key={percent}
                          type="button"
                          onClick={() => setDiscountValue(percent)}
                          className={`px-3 py-2 text-sm rounded transition-colors ${
                            discountValue === percent
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Discount Preview */}
              {discountAmount > 0 && (
                <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Discount Applied: {discountType === 'percentage' ? `${discountValue}%` : formatCurrency(discountValue)}
                      </span>
                    </div>
                    <Badge variant="success">
                      Saves {formatCurrency(discountAmount)} per order
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            {totalOccurrences > 0 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-blue-900">📊 Recurring Order Summary</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selected Days:</span>
                      <span className="font-medium">{selectedDays.length} days/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-medium capitalize">{frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Occurrences:</span>
                      <span className="font-medium text-blue-600">{totalOccurrences} orders</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Per Order Amount:</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount per Order:</span>
                        <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span className="text-gray-800">Estimated Total:</span>
                      <span className="text-purple-600">{formatCurrency(estimatedTotal)}</span>
                    </div>
                  </div>
                </div>

                {discountAmount > 0 && (
                  <div className="mt-3 p-2 bg-green-100 rounded text-center">
                    <p className="text-sm font-medium text-green-800">
                      💰 Total Savings: {formatCurrency(discountAmount * totalOccurrences)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Validation Messages */}
            {isRecurring && (
              <div className="space-y-2">
                {!startDate && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Please select a start date</span>
                  </div>
                )}
                {!endDate && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Please select an end date</span>
                  </div>
                )}
                {selectedDays.length === 0 && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Please select at least one day of the week</span>
                  </div>
                )}
                {totalOccurrences > 0 && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Recurring order configuration is complete!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
