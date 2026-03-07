import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  Badge,
  LoadingWrapper
} from '../../ui';
import { 
  Calendar,
  Clock,
  Crown,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  Star,
  Zap,
  Gift,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';
import { CustomerSearchCard } from './CustomerSearchCard';
import { ProductSelector } from './ProductSelector';
import { RecurrenceOrderScheduler, type RecurrenceData } from './RecurrenceOrderScheduler';
import type { Product, Customer } from '../../../types';

// Pre-order specific validation schema
const preOrderSchema = z.object({
  // Customer Information
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid phone number format'),
  customerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  
  // Delivery Address
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  addressType: z.enum(['home', 'work', 'other']),
  
  // Pre-order Specific Fields
  preOrderType: z.enum(['advance_booking', 'rare_product', 'exotic_product', 'bulk_order', 'subscription']),
  scheduledDate: z.string().min(1, 'Scheduled delivery date is required'),
  scheduledSlot: z.string().min(1, 'Delivery slot is required'),
  advancePayment: z.number().min(0, 'Advance payment must be positive'),
  
  // Order Items
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    variantId: z.string().min(1, 'Variant is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price must be positive'),
    isRareProduct: z.boolean().optional(),
    isExoticProduct: z.boolean().optional(),
  })).min(1, 'At least one item is required'),
  
  // Payment & Delivery
  hubId: z.string().min(1, 'Hub/Store selection is required'),
  paymentMethod: z.enum(['advance_full', 'advance_partial', 'cod_on_delivery']),
  orderSource: z.enum(['whatsapp', 'instagram', 'facebook', 'manual', 'subscription']),
  
  // Bulk Order Charges
  packingCharges: z.number().min(0, 'Packing charges must be positive').optional(),
  deliveryCharges: z.number().min(0, 'Delivery charges must be positive').optional(),
  
  // Special Instructions
  specialInstructions: z.string().optional(),
  occasionType: z.string().optional(),
});

type PreOrderFormData = z.infer<typeof preOrderSchema>;
type PreOrderType = PreOrderFormData['preOrderType'];

interface PreOrderSubmitData extends PreOrderFormData {
  total: number;
  remainingAmount: number;
  isEliteMember: boolean;
  recurrenceData: RecurrenceData | null;
}

interface PreOrderFormProps {
  moduleType: 'hub' | 'store';
  products: Product[];
  hubs: Array<{ id: string; name: string; type: string; location: string }>;
  onSubmit: (data: PreOrderSubmitData) => Promise<void>;
}

const preOrderTypes: Array<{
  value: PreOrderType;
  label: string;
  description: string;
  icon: typeof Calendar;
  color: string;
  minDays: number;
  maxDays: number;
}> = [
  { 
    value: 'advance_booking', 
    label: 'Advance Booking', 
    description: 'Book products in advance for future delivery',
    icon: Calendar,
    color: 'blue',
    minDays: 1,
    maxDays: 30
  },
  { 
    value: 'rare_product', 
    label: 'Rare Product Order', 
    description: 'Limited availability products - seasonal/premium',
    icon: Crown,
    color: 'amber',
    minDays: 2,
    maxDays: 7
  },
  { 
    value: 'exotic_product', 
    label: 'Exotic Product Order', 
    description: 'Imported delicacies - special handling required',
    icon: Star,
    color: 'purple',
    minDays: 3,
    maxDays: 10
  },
  { 
    value: 'bulk_order', 
    label: 'Bulk Order', 
    description: 'Large quantity orders for events/parties',
    icon: Package,
    color: 'green',
    minDays: 3,
    maxDays: 14
  },
  { 
    value: 'subscription', 
    label: 'Subscription Order', 
    description: 'Recurring orders on scheduled basis',
    icon: Zap,
    color: 'orange',
    minDays: 7,
    maxDays: 90
  }
];

const occasionTypes = [
  { value: '', label: 'No Special Occasion' },
  { value: 'birthday', label: 'Birthday Celebration' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'festival', label: 'Festival (Pongal, Deepavali, etc.)' },
  { value: 'wedding', label: 'Wedding Function' },
  { value: 'party', label: 'House Party' },
  { value: 'business', label: 'Business Event' },
  { value: 'other', label: 'Other Special Occasion' }
];

export function PreOrderForm({ moduleType, products, hubs, onSubmit }: PreOrderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEliteMember, setIsEliteMember] = useState(false);
  const [selectedPreOrderType, setSelectedPreOrderType] = useState<PreOrderType | ''>('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [recurrenceData, setRecurrenceData] = useState<RecurrenceData | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<PreOrderFormData>({
    resolver: zodResolver(preOrderSchema),
    defaultValues: {
      addressType: 'home',
      paymentMethod: 'advance_partial',
      orderSource: 'manual',
      advancePayment: 0,
      preOrderType: 'advance_booking'
    }
  });

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const watchedAdvancePayment = watch('advancePayment');

  // Calculate dates based on pre-order type
  const updateDateLimits = (type: PreOrderType) => {
    const typeConfig = preOrderTypes.find(t => t.value === type);
    if (typeConfig) {
      const today = new Date();
      const minDate = new Date(today.getTime() + typeConfig.minDays * 24 * 60 * 60 * 1000);
      const maxDate = new Date(today.getTime() + typeConfig.maxDays * 24 * 60 * 60 * 1000);
      
      setMinDate(minDate.toISOString().split('T')[0]);
      setMaxDate(maxDate.toISOString().split('T')[0]);
    }
  };

  // Calculate totals with recurrence discount
  const subtotal = watchedItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const eliteDiscount = isEliteMember ? subtotal * 0.05 : 0;
  const recurrenceDiscount = recurrenceData?.isRecurring ? 
    (recurrenceData.discountType === 'percentage' 
      ? (subtotal * recurrenceData.discountValue) / 100 
      : recurrenceData.discountValue) : 0;
  const totalDiscount = eliteDiscount + recurrenceDiscount;
  const baseDeliveryCharges = isEliteMember && subtotal >= 349 ? 0 : 50;
  
  // Add bulk order charges
  const watchedPackingCharges = watch('packingCharges') || 0;
  const watchedDeliveryCharges = watch('deliveryCharges') || 0;
  
  const finalDeliveryCharges = selectedPreOrderType === 'bulk_order' 
    ? watchedDeliveryCharges 
    : baseDeliveryCharges;
  
  const total = Math.max(0, subtotal - totalDiscount + finalDeliveryCharges + (selectedPreOrderType === 'bulk_order' ? watchedPackingCharges : 0));
  const remainingAmount = total - (watchedAdvancePayment || 0);

  const handleCustomerDataChange = (data: { name: string; phone: string; email: string; isElite: boolean }) => {
    setValue('customerName', data.name);
    setValue('customerPhone', data.phone);
    setValue('customerEmail', data.email);
    setIsEliteMember(data.isElite);
  };

  const handlePreOrderTypeChange = (type: PreOrderType) => {
    setSelectedPreOrderType(type);
    setValue('preOrderType', type);
    updateDateLimits(type);
  };

  const addProduct = (product: Product, variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) return;

    appendItem({
      productId: product.id,
      variantId: variantId,
      quantity: 1,
      price: variant.price,
      isRareProduct: product.isRare,
      isExoticProduct: product.deliveryType === 'exotic'
    });
  };

  const handleFormSubmit = async (data: PreOrderFormData) => {
    setIsLoading(true);
    try {
      const submitData = { 
        ...data, 
        total, 
        remainingAmount, 
        isEliteMember,
        recurrenceData: recurrenceData?.isRecurring ? recurrenceData : null
      };
      await onSubmit(submitData);
      reset();
      setSelectedCustomer(null);
      setIsEliteMember(false);
      setSelectedPreOrderType('');
      setRecurrenceData(null);
    } catch (error) {
      console.error('Failed to create pre-order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const moduleColor = moduleType === 'hub' ? 'blue' : 'green';
  const moduleTitle = moduleType === 'hub' ? 'Hub Pre-Order' : 'Store Pre-Order';

  // Filter products based on pre-order type
  const availableProducts = (() => {
    switch (selectedPreOrderType) {
      case 'rare_product':
        return products.filter(p => p.isRare && p.deliveryType === 'next_day');
      case 'exotic_product':
        return products.filter(p => !p.isRare && p.deliveryType === 'exotic');
      default:
        return products;
    }
  })();

  return (
    <LoadingWrapper isLoading={isLoading} type="page" text="Creating pre-order..." variant="branded">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Pre-Order Type Selection */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleColor}-600 flex items-center justify-center`}>
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pre-Order Type</h3>
              <p className="text-sm text-gray-600">Select the type of advance booking for {moduleTitle.toLowerCase()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {preOrderTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedPreOrderType === type.value;
              
              return (
                <div
                  key={type.value}
                  onClick={() => handlePreOrderTypeChange(type.value)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? `border-${type.color}-500 bg-${type.color}-50` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-8 w-8 rounded-lg bg-${type.color}-600 flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{type.label}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                  <p className="text-xs text-gray-500">
                    {type.minDays}-{type.maxDays} days advance notice
                  </p>
                </div>
              );
            })}
          </div>

          {selectedPreOrderType && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">Pre-Order Guidelines</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                {selectedPreOrderType === 'rare_product' && (
                  <>
                    <li>• Rare products require 48-72 hours advance notice</li>
                    <li>• 50% advance payment required for confirmation</li>
                    <li>• Subject to availability from suppliers</li>
                  </>
                )}
                {selectedPreOrderType === 'bulk_order' && (
                  <>
                    <li>• Minimum order value: ₹2,000 for bulk orders</li>
                    <li>• Special packaging and handling charges may apply</li>
                    <li>• Delivery time slots may be extended for large orders</li>
                  </>
                )}
                {selectedPreOrderType === 'advance_booking' && (
                  <>
                    <li>• Elite members can book up to 30 days in advance</li>
                    <li>• Regular customers can book up to 7 days in advance</li>
                    <li>• Prices locked at time of booking</li>
                  </>
                )}
                {selectedPreOrderType === 'subscription' && (
                  <>
                    <li>• Recurring orders with flexible scheduling</li>
                    <li>• 10% discount on subscription orders</li>
                    <li>• Can pause or modify anytime</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </Card>

        {/* Customer Search */}
        <CustomerSearchCard
          onCustomerSelect={setSelectedCustomer}
          selectedCustomer={selectedCustomer}
          onCustomerDataChange={handleCustomerDataChange}
        />

        {/* Customer Information Form */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleColor}-600 flex items-center justify-center`}>
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
              <p className="text-sm text-gray-600">Confirm customer information for pre-order</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('customerName')}
                  placeholder="Customer full name"
                  error={errors.customerName?.message}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('customerPhone')}
                  placeholder="+91 9876543210"
                  error={errors.customerPhone?.message}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (Optional)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                {...register('customerEmail')}
                type="email"
                placeholder="customer@email.com"
                error={errors.customerEmail?.message}
                className="pl-10"
              />
            </div>
          </div>

          {isEliteMember && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <Crown className="h-5 w-5" />
                <span className="font-semibold">Elite Member - Extended Pre-Order Benefits</span>
              </div>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                <li>• Book up to 30 days in advance (vs 7 days for regular customers)</li>
                <li>• Priority slot allocation for pre-orders</li>
                <li>• 5% additional discount on pre-orders</li>
                <li>• Free delivery on pre-orders above ₹349</li>
              </ul>
            </div>
          )}
        </Card>

        {/* Delivery Address */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleColor}-600 flex items-center justify-center`}>
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
              <p className="text-sm text-gray-600">Enter delivery address for the scheduled date</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Address Line 1"
              {...register('addressLine1')}
              placeholder="House no, Building name, Street"
              error={errors.addressLine1?.message}
            />
            
            <Input
              label="Address Line 2 (Optional)"
              {...register('addressLine2')}
              placeholder="Landmark, Area"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Pincode"
                {...register('pincode')}
                placeholder="600001"
                error={errors.pincode?.message}
              />
              <Input
                label="City"
                {...register('city')}
                placeholder="Chennai"
                error={errors.city?.message}
              />
              <Input
                label="State"
                {...register('state')}
                placeholder="Tamil Nadu"
                error={errors.state?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
              <div className="flex gap-4">
                {[
                  { value: 'home', label: 'Home' },
                  { value: 'work', label: 'Work' },
                  { value: 'other', label: 'Other' }
                ].map((type) => (
                  <label key={type.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      {...register('addressType')}
                      value={type.value}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Scheduling */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleColor}-600 flex items-center justify-center`}>
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delivery Scheduling</h3>
              <p className="text-sm text-gray-600">Select delivery date and time slot</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Scheduled Date</label>
              <Input
                type="date"
                {...register('scheduledDate')}
                min={minDate}
                max={maxDate}
                error={errors.scheduledDate?.message}
              />
              {minDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Available from {new Date(minDate).toLocaleDateString()} to {new Date(maxDate).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <Select
              label="Delivery Slot"
              {...register('scheduledSlot')}
              error={errors.scheduledSlot?.message}
              options={[
                { value: '', label: 'Select Time Slot' },
                { value: 'slot1', label: 'Slot 1 (7:00 AM - 9:00 AM)' },
                { value: 'slot2', label: 'Slot 2 (10:00 AM - 12:00 PM)' },
                { value: 'slot3', label: 'Slot 3 (1:00 PM - 3:00 PM)' },
                { value: 'slot4', label: 'Slot 4 (4:00 PM - 6:00 PM)' },
                { value: 'slot5', label: 'Slot 5 (7:00 PM - 9:00 PM)' },
              ]}
            />
          </div>

          <Select
            label="Occasion Type (Optional)"
            {...register('occasionType')}
            options={occasionTypes}
          />
        </Card>

        {/* Recurrence Order Scheduler */}
        <RecurrenceOrderScheduler
          onRecurrenceChange={setRecurrenceData}
          subtotal={subtotal}
        />

        {/* Hub/Store Selection */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleColor}-600 flex items-center justify-center`}>
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {moduleType === 'hub' ? 'Hub Selection' : 'Store Selection'}
              </h3>
              <p className="text-sm text-gray-600">
                Select {moduleType} for order processing and delivery
              </p>
            </div>
          </div>

          <Select
            label={moduleType === 'hub' ? 'Select Hub' : 'Select Store'}
            {...register('hubId')}
            error={errors.hubId?.message}
            options={[
              { value: '', label: `Choose ${moduleType}...` },
              ...hubs.map(hub => ({
                value: hub.id,
                label: `${hub.name} - ${hub.location}`
              }))
            ]}
          />
        </Card>

        {/* Product Selection */}
        <ProductSelector
          products={availableProducts}
          onProductAdd={addProduct}
          isEliteMember={isEliteMember}
          moduleType={moduleType}
        />

        {/* Selected Items Display */}
        {itemFields.length > 0 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-10 w-10 rounded-lg bg-${moduleColor}-600 flex items-center justify-center`}>
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pre-Order Items</h3>
                <p className="text-sm text-gray-600">Items scheduled for delivery</p>
              </div>
            </div>

            <div className="space-y-3">
              {itemFields.map((field, index) => {
                const item = watchedItems[index];
                return (
                  <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-gray-900">Product {index + 1}</h5>
                        {item?.isRareProduct && (
                          <Badge variant="warning" className="bg-amber-100 text-amber-800">
                            <Crown className="h-3 w-3 mr-1" />
                            Rare
                          </Badge>
                        )}
                        {item?.isExoticProduct && (
                          <Badge variant="info" className="bg-purple-100 text-purple-800">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Exotic
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Quantity: {item?.quantity}</p>
                      <p className="text-sm text-gray-500">Price: {formatCurrency(item?.price || 0)} each</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency((item?.price || 0) * (item?.quantity || 0))}
                      </p>
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 ml-4"
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Payment Configuration */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleColor}-600 flex items-center justify-center`}>
              <Gift className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment Configuration</h3>
              <p className="text-sm text-gray-600">Configure advance payment and delivery options</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Payment Method"
              {...register('paymentMethod')}
              error={errors.paymentMethod?.message}
              options={[
                { value: 'advance_full', label: 'Full Advance Payment' },
                { value: 'advance_partial', label: 'Partial Advance Payment' },
                { value: 'cod_on_delivery', label: 'Cash on Delivery' }
              ]}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Advance Payment Amount
              </label>
              <Input
                type="number"
                {...register('advancePayment', { valueAsNumber: true })}
                placeholder="0"
                error={errors.advancePayment?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 50% advance payment required for rare products
              </p>
            </div>
          </div>

          {/* Bulk Order Charges - Only show for bulk_order type */}
          {selectedPreOrderType === 'bulk_order' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Packing Charges
                </label>
                <Input
                  type="number"
                  {...register('packingCharges', { valueAsNumber: true })}
                  placeholder="0"
                  error={errors.packingCharges?.message}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Special packaging charges for bulk orders
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Delivery Charges
                </label>
                <Input
                  type="number"
                  {...register('deliveryCharges', { valueAsNumber: true })}
                  placeholder="0"
                  error={errors.deliveryCharges?.message}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Additional delivery charges for bulk quantity
                </p>
              </div>
            </div>
          )}

          <Select
            label="Order Source"
            {...register('orderSource')}
            error={errors.orderSource?.message}
            options={[
              { value: 'manual', label: 'Manual Entry' },
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'instagram', label: 'Instagram' },
              { value: 'facebook', label: 'Facebook' },
              { value: 'subscription', label: 'Subscription' }
            ]}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              {...register('specialInstructions')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special instructions for the pre-order..."
            />
          </div>
        </Card>

        {/* Order Summary */}
        {itemFields.length > 0 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-10 w-10 rounded-lg bg-${moduleColor}-600 flex items-center justify-center`}>
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pre-Order Summary</h3>
                <p className="text-sm text-gray-600">Review your pre-order details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Order Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    {isEliteMember && eliteDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Elite Discount (5%):</span>
                        <span>-{formatCurrency(eliteDiscount)}</span>
                      </div>
                    )}
                    {recurrenceDiscount > 0 && (
                      <div className="flex justify-between text-purple-600">
                        <span>Recurring Order Discount:</span>
                        <span>-{formatCurrency(recurrenceDiscount)}</span>
                      </div>
                    )}
                    {selectedPreOrderType === 'bulk_order' && watchedPackingCharges > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Packing Charges:</span>
                        <span>+{formatCurrency(watchedPackingCharges)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charges:</span>
                      <span className={finalDeliveryCharges === 0 ? 'text-green-600' : ''}>
                        {finalDeliveryCharges === 0 ? 'FREE' : formatCurrency(finalDeliveryCharges)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total Amount:</span>
                      <span className="text-green-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payment Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Advance Payment:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(watchedAdvancePayment || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining Amount:</span>
                      <span className="font-medium text-orange-600">{formatCurrency(remainingAmount)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Remaining amount will be collected on delivery
                    </div>
                  </div>
                </div>
              </div>

              {(isEliteMember || recurrenceData?.isRecurring) && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 mb-2">
                    <Crown className="h-5 w-5" />
                    <span className="font-semibold">
                      {isEliteMember && recurrenceData?.isRecurring 
                        ? 'Elite Member + Recurring Order Benefits' 
                        : isEliteMember 
                        ? 'Elite Member Pre-Order Benefits'
                        : 'Recurring Order Benefits'
                      }
                    </span>
                  </div>
                  <div className="text-sm text-yellow-700">
                    <p>Total Savings: {formatCurrency(totalDiscount + (50 - finalDeliveryCharges))}</p>
                    <p className="text-xs mt-1">
                      {isEliteMember && 'Includes Elite member discount and free delivery'}
                      {recurrenceData?.isRecurring && (isEliteMember ? ' + recurring order discount' : 'Includes recurring order discount')}
                    </p>
                    {recurrenceData?.isRecurring && (
                      <p className="text-xs mt-1 font-medium">
                        🔄 This order will repeat {recurrenceData.totalOccurrences} times
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
              setSelectedCustomer(null);
              setIsEliteMember(false);
              setSelectedPreOrderType('');
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={itemFields.length === 0 || !selectedPreOrderType || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Creating Pre-Order...' : `Create ${moduleTitle}`}
          </Button>
        </div>
      </form>
    </LoadingWrapper>
  );
}
