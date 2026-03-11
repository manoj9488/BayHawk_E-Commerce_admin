import { Calendar, Star, Package, Zap, AlertCircle } from 'lucide-react';
import { Card } from '../../ui';

interface PreOrderType {
  value: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  minDays: number;
  maxDays: number;
  guidelines: string[];
}

interface PreOrderTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
  isEliteMember?: boolean;
}

const preOrderTypes: PreOrderType[] = [
  {
    value: 'advance_booking',
    label: 'Advance Booking',
    description: 'Book products in advance for future delivery',
    icon: Calendar,
    color: 'blue',
    minDays: 1,
    maxDays: 30,
    guidelines: [
      'Elite members can book up to 30 days in advance',
      'Regular customers can book up to 7 days in advance',
      'Prices locked at time of booking',
      'Free cancellation up to 24 hours before delivery'
    ]
  },
  {
    value: 'rare_product',
    label: 'Rare Product Order',
    description: 'Special order for rare/exotic products',
    icon: Star,
    color: 'purple',
    minDays: 2,
    maxDays: 7,
    guidelines: [
      'Rare products require 48-72 hours advance notice',
      '50% advance payment required for confirmation',
      'Subject to availability from suppliers',
      'SMS notification when product arrives'
    ]
  },
  {
    value: 'bulk_order',
    label: 'Bulk Order',
    description: 'Large quantity orders for events/parties',
    icon: Package,
    color: 'green',
    minDays: 3,
    maxDays: 14,
    guidelines: [
      'Minimum order value: ₹2,000 for bulk orders',
      'Special packaging and handling charges may apply',
      'Delivery time slots may be extended for large orders',
      'Dedicated customer support for bulk orders'
    ]
  },
  {
    value: 'subscription',
    label: 'Subscription Order',
    description: 'Recurring orders on scheduled basis',
    icon: Zap,
    color: 'orange',
    minDays: 7,
    maxDays: 90,
    guidelines: [
      'Recurring orders with flexible scheduling',
      '10% discount on subscription orders',
      'Can pause or modify anytime',
      'Priority delivery slots for subscribers'
    ]
  }
];

export function PreOrderTypeSelector({ 
  selectedType, 
  onTypeSelect, 
  isEliteMember = false 
}: PreOrderTypeSelectorProps) {
  const selectedTypeConfig = preOrderTypes.find(type => type.value === selectedType);

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pre-Order Type</h3>
          <p className="text-sm text-gray-600">Select the type of advance booking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {preOrderTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.value;
          
          // Adjust max days for non-elite members on advance booking
          const maxDays = type.value === 'advance_booking' && !isEliteMember ? 7 : type.maxDays;
          
          return (
            <div
              key={type.value}
              onClick={() => onTypeSelect(type.value)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                isSelected 
                  ? `border-${type.color}-500 bg-${type.color}-50 shadow-md` 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-8 w-8 rounded-lg bg-${type.color}-600 flex items-center justify-center`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">{type.label}</h4>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{type.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {type.minDays}-{maxDays} days notice
                </span>
                {isSelected && (
                  <div className={`h-2 w-2 rounded-full bg-${type.color}-600`} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Guidelines for Selected Type */}
      {selectedTypeConfig && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 mb-3">
            <AlertCircle className="h-4 w-4" />
            <span className="font-semibold">Pre-Order Guidelines - {selectedTypeConfig.label}</span>
          </div>
          
          <ul className="text-sm text-blue-700 space-y-1">
            {selectedTypeConfig.guidelines.map((guideline, index) => (
              <li key={index}>• {guideline}</li>
            ))}
          </ul>

          {/* Elite Member Special Notice */}
          {selectedType === 'advance_booking' && isEliteMember && (
            <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <Star className="h-4 w-4" />
                <span className="font-medium">Elite Member Benefit</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                As an Elite member, you can book up to 30 days in advance with priority slot allocation!
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}