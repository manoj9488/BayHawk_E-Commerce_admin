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
import { RareProductSelector } from './RareProductSelector';
import { EnhancedDeliverySlotSelector } from './EnhancedDeliverySlotSelector';
import { EnhancedOrderItem } from './EnhancedOrderItem';
import { SavedAddressSelector, type SavedAddress } from './SavedAddressSelector';
import { PaymentStatusSelector } from './PaymentStatusSelector';
import { SimpleDiscountEntry } from './SimpleDiscountEntry';
import { SpecialProductNotice } from './SpecialProductNotice';
import { 
  X, 
  Search, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Package,
  Truck,
  CreditCard,
  Crown,
  Zap,
  AlertTriangle,
  Clock,
  Tag
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';
import { customersApi } from '../../../utils/api';
import type { Product, Customer } from '../../../types';

// Validation schema
const manualOrderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid phone number format'),
  customerSecondaryPhone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid secondary phone number format').optional().or(z.literal('')),
  customerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  addressType: z.enum(['home', 'work', 'other']),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    variantId: z.string().min(1, 'Variant is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price must be positive'),
    alternateProductId: z.string().optional(),
    alternateVariantId: z.string().optional(),
  })).min(1, 'At least one item is required'),
  hubId: z.string().min(1, 'Hub/Store selection is required'),
  deliverySlot: z.string().min(1, 'Delivery slot is required'),
  paymentMethod: z.enum(['cod', 'online', 'wallet']),
  paymentStatus: z.enum(['pending', 'paid', 'partial']),
  advanceAmount: z.number().min(0, 'Advance amount must be positive').optional(),
  discountType: z.enum(['percentage', 'amount']).optional(),
  discountValue: z.number().min(0, 'Discount value must be positive').optional(),
  orderSource: z.enum(['whatsapp', 'instagram', 'facebook', 'manual']),
  applySurgeCharges: z.boolean().optional(),
  specialInstructions: z.string().optional(),
});

type ManualOrderForm = z.infer<typeof manualOrderSchema>;

const isAddressType = (value: string): value is ManualOrderForm['addressType'] => {
  return value === 'home' || value === 'work' || value === 'other';
};

const isPaymentStatus = (value: string): value is ManualOrderForm['paymentStatus'] => {
  return value === 'pending' || value === 'paid' || value === 'partial';
};

interface ManualOrderFormProps {
  moduleType: 'hub' | 'store';
  products: Product[];
  hubs: Array<{ id: string; name: string; type: string; location: string }>;
  onSubmit: (data: ManualOrderForm & { total: number; isEliteMember: boolean }) => Promise<void>;
}

export function ManualOrderForm({ moduleType, products = [], hubs = [], onSubmit }: ManualOrderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [isEliteMember, setIsEliteMember] = useState(false);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<SavedAddress | null>(null);
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapLocation, setMapLocation] = useState<{lat: number; lng: number} | null>(null);
  
  const surgeCharges = 30;
  const deliveryCharges = 50;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<ManualOrderForm>({
    resolver: zodResolver(manualOrderSchema),
    defaultValues: {
      addressType: 'home',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      discountType: 'percentage',
      discountValue: 0,
      orderSource: 'manual',
      applySurgeCharges: false,
      items: []
    }
  });

  const { fields: itemFields, append: appendItem, remove: removeItem, update: updateItem } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const watchedApplySurgeCharges = watch('applySurgeCharges');
  const watchedAddressType = watch('addressType');
  const watchedPaymentStatus = watch('paymentStatus');
  const watchedAdvanceAmount = watch('advanceAmount');
  const watchedDiscountType = watch('discountType');
  const watchedDiscountValue = watch('discountValue');

  // Calculate totals
  const subtotal = watchedItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const eliteDiscount = isEliteMember ? subtotal * 0.05 : 0;
  
  // Calculate manual discount
  const manualDiscountAmount = watchedDiscountType === 'percentage' 
    ? (subtotal * (watchedDiscountValue || 0)) / 100 
    : (watchedDiscountValue || 0);
  
  const totalDiscount = eliteDiscount + manualDiscountAmount;
  const finalSurgeCharges = watchedApplySurgeCharges ? surgeCharges : 0;
  const finalDeliveryCharges = isEliteMember && subtotal >= 349 ? 0 : deliveryCharges;
  const total = Math.max(0, subtotal - totalDiscount + finalSurgeCharges + finalDeliveryCharges);

  // Check for special product types
  const hasRareProducts = watchedItems?.some(item => {
    const product = products.find(p => p.id === item.productId);
    return product?.isRare;
  }) || false;

  const hasExoticProducts = watchedItems?.some(item => {
    const product = products.find(p => p.id === item.productId);
    return product?.deliveryType === 'exotic';
  }) || false;

  const handleCustomerSearch = async (phone: string) => {
    setCustomerSearch(phone);
    if (phone.length < 3) {
      setSelectedCustomer(null);
      setIsEliteMember(false);
      return;
    }

    try {
      const response = await customersApi.getAll({ search: phone, limit: '1' });
      const items = Array.isArray(response?.data?.data) ? response.data.data : [];
      const foundCustomer = items[0] as Customer | undefined;

      if (foundCustomer) {
        setSelectedCustomer(foundCustomer);
        setIsEliteMember(!!foundCustomer.membershipPlan);
        setValue('customerName', foundCustomer.name);
        setValue('customerPhone', foundCustomer.phone);
        setValue('customerSecondaryPhone', foundCustomer.secondaryPhone || '');
        setValue('customerEmail', foundCustomer.email || '');
      } else {
        setSelectedCustomer(null);
        setIsEliteMember(false);
      }
    } catch (error) {
      console.error('Failed to search customer', error);
      setSelectedCustomer(null);
      setIsEliteMember(false);
    }
  };

  const addProduct = (productId: string, variantId: string, alternateProductId?: string, alternateVariantId?: string) => {
    const product = products.find(p => p.id === productId);
    const variant = product?.variants.find(v => v.id === variantId);
    if (!product || !variant) return;

    const existingItemIndex = itemFields.findIndex(
      item => item.productId === productId && item.variantId === variantId
    );

    if (existingItemIndex >= 0) {
      const existingItem = watchedItems[existingItemIndex];
      updateItem(existingItemIndex, {
        ...existingItem,
        quantity: existingItem.quantity + 1
      });
    } else {
      appendItem({
        productId: productId,
        variantId: variantId,
        quantity: 1,
        price: variant.price,
        alternateProductId,
        alternateVariantId
      });
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(index);
    } else {
      const item = watchedItems[index];
      updateItem(index, { ...item, quantity: newQuantity });
    }
  };

  const handleFormSubmit = async (data: ManualOrderForm) => {
    // Custom validation for partial payment
    if (data.paymentStatus === 'partial' && (!data.advanceAmount || data.advanceAmount <= 0)) {
      alert('Advance amount is required for partial payment');
      return;
    }
    
    if (data.paymentStatus === 'partial' && data.advanceAmount && data.advanceAmount >= total) {
      alert('Advance amount cannot be equal to or greater than total amount');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({ ...data, total, isEliteMember });
      reset();
      setSelectedCustomer(null);
      setIsEliteMember(false);
      setSelectedSavedAddress(null);
      setShowManualAddress(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavedAddressSelect = (address: SavedAddress) => {
    setSelectedSavedAddress(address);
    setShowManualAddress(false);
    
    // Auto-fill form with selected address
    setValue('addressLine1', address.addressLine1);
    setValue('addressLine2', address.addressLine2 || '');
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('pincode', address.pincode);
    setValue('addressType', address.type);
  };

  const handleAddNewAddress = () => {
    setSelectedSavedAddress(null);
    setShowManualAddress(true);
    
    // Clear address fields for manual entry
    setValue('addressLine1', '');
    setValue('addressLine2', '');
    setValue('city', '');
    setValue('state', '');
    setValue('pincode', '');
  };

  const moduleInfo = {
    hub: {
      title: 'Hub Manual Order Creation',
      description: 'Create manual orders for fish products with next-day delivery',
      color: 'blue'
    },
    store: {
      title: 'Store Manual Order Creation', 
      description: 'Create manual orders for all products with same-day/next-day delivery',
      color: 'green'
    }
  }[moduleType];

  return (
    <LoadingWrapper isLoading={isLoading} type="page" text="Creating order..." variant="branded">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Discount Feature Highlight */}
        <div className="bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-100 border-2 border-orange-300 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Tag className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-bold text-orange-800">💰 Discount & Offers Available!</h2>
            <Tag className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-orange-700 font-medium">
            Apply percentage discounts or fixed amount offers to reduce order total. 
            <span className="font-bold"> Scroll down to "Apply Discount" section after adding customer details.</span>
          </p>
        </div>
        {/* Customer Information */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleInfo.color}-600 flex items-center justify-center`}>
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
              <p className="text-sm text-gray-600">Search existing customer or add new customer details</p>
            </div>
          </div>

          {/* Customer Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search customer by phone number (+91XXXXXXXXXX)"
                value={customerSearch}
                onChange={(e) => handleCustomerSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {selectedCustomer && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">{selectedCustomer.name}</p>
                    <div className="flex items-center gap-3 text-sm text-green-700">
                      <span>{selectedCustomer.phone}</span>
                      {selectedCustomer.secondaryPhone && (
                        <>
                          <span className="text-green-600">•</span>
                          <span>{selectedCustomer.secondaryPhone} (Secondary)</span>
                        </>
                      )}
                    </div>
                  </div>
                  {selectedCustomer.membershipPlan && (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Crown className="h-4 w-4" />
                      Elite Member
                    </Badge>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCustomer(null);
                    setIsEliteMember(false);
                    setValue('customerName', '');
                    setValue('customerPhone', '');
                    setValue('customerSecondaryPhone', '');
                    setValue('customerEmail', '');
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Phone Number</label>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Secondary Phone Number 
                <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('customerSecondaryPhone')}
                  placeholder="+91 9876543211"
                  error={errors.customerSecondaryPhone?.message}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Alternative contact number for delivery coordination
              </p>
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
          </div>

          {isEliteMember && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <Crown className="h-5 w-5" />
                <span className="font-semibold">Elite Member Benefits Active</span>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1 mb-3">
                <li>• Free delivery on orders above ₹349</li>
                <li>• 5% extra discount on selected products</li>
                <li>• No surge charges</li>
                <li>• Priority order processing</li>
              </ul>
              <div className="text-xs text-yellow-600 bg-yellow-100 rounded p-2">
                <p className="font-medium">Contact Numbers on File:</p>
                <div className="flex items-center gap-4 mt-1">
                  <span>Primary: {watch('customerPhone') || 'Not provided'}</span>
                  {watch('customerSecondaryPhone') && (
                    <span>Secondary: {watch('customerSecondaryPhone')}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Delivery Address */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleInfo.color}-600 flex items-center justify-center`}>
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
              <p className="text-sm text-gray-600">Enter complete delivery address details</p>
            </div>
          </div>

          <div className="space-y-4">

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
                      onChange={(e) => {
                        const nextAddressType = e.target.value;
                        if (isAddressType(nextAddressType)) {
                          setValue('addressType', nextAddressType);
                        }
                        if (e.target.value !== 'other') {
                          setSelectedSavedAddress(null);
                          setShowManualAddress(false);
                        }
                      }}
                    />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Saved Address Selector for "Other" type */}
            {watchedAddressType === 'other' && (
              <SavedAddressSelector
                customer={selectedCustomer}
                selectedAddressId={selectedSavedAddress?.id}
                onAddressSelect={handleSavedAddressSelect}
                onAddNewAddress={handleAddNewAddress}
              />
            )}

            {/* Manual Address Entry (show when no saved address selected or adding new) */}
            {(watchedAddressType !== 'other' || showManualAddress || !selectedSavedAddress) && watchedAddressType && (
              <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    {watchedAddressType === 'other' ? 'Manual Address Entry' : 'Address Details'}
                  </h4>
                  {watchedAddressType === 'other' && selectedSavedAddress && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowManualAddress(false)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Use Saved Address
                    </Button>
                  )}
                </div>
                
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

                {/* Pin Map Location */}
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <h5 className="font-semibold text-blue-900">Pin Map Location</h5>
                        <p className="text-xs text-blue-700">Mark exact delivery location on map</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowMapPicker(!showMapPicker)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {showMapPicker ? 'Close Map' : 'Open Map'}
                    </Button>
                  </div>

                  {mapLocation && (
                    <div className="flex items-center gap-2 text-sm text-blue-800 bg-white p-2 rounded border border-blue-300">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Location Pinned:</span>
                      <span className="text-xs">Lat: {mapLocation.lat.toFixed(6)}, Lng: {mapLocation.lng.toFixed(6)}</span>
                    </div>
                  )}

                  {showMapPicker && (
                    <div className="mt-3 space-y-3">
                      <div className="bg-white border-2 border-blue-300 rounded-lg p-4 h-64 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-3">Click on map to pin location</p>
                          <div className="text-xs text-gray-500">
                            <p>Map integration placeholder</p>
                            <p className="mt-1">Integrate Google Maps / Leaflet here</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Location Buttons */}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition((position) => {
                                const location = {
                                  lat: position.coords.latitude,
                                  lng: position.coords.longitude
                                };
                                setMapLocation(location);
                                setValue('latitude', location.lat);
                                setValue('longitude', location.lng);
                              });
                            }
                          }}
                          className="flex-1"
                        >
                          Use Current Location
                        </Button>
                        {mapLocation && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setMapLocation(null);
                              setValue('latitude', undefined);
                              setValue('longitude', undefined);
                            }}
                            className="text-red-600"
                          >
                            Clear Location
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

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
              </div>
            )}
          </div>
        </Card>

        {/* Order Items */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg bg-${moduleInfo.color}-600 flex items-center justify-center`}>
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                <p className="text-sm text-gray-600">Add products to the order</p>
              </div>
            </div>
          </div>

          {/* Product Search & Add */}
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              {products
                .filter(product => 
                  product.nameEn.toLowerCase().includes(productSearch.toLowerCase()) ||
                  product.nameTa.includes(productSearch) ||
                  product.sku.toLowerCase().includes(productSearch.toLowerCase())
                )
                .map((product) => (
                  <div key={product.id}>
                    {product.variants.map((variant) => (
                      <RareProductSelector
                        key={`${product.id}-${variant.id}`}
                        product={product}
                        variant={variant}
                        onAddToOrder={addProduct}
                        availableProducts={products}
                        className="mb-3"
                      />
                    ))}
                  </div>
                ))}
            </div>
          </div>

          {/* Selected Items */}
          {itemFields.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Selected Items ({itemFields.length})</h4>
                <div className="flex items-center gap-2">
                  {hasRareProducts && (
                    <Badge variant="danger" className="flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Has Rare Products
                    </Badge>
                  )}
                  {hasExoticProducts && (
                    <Badge variant="purple" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Has Exotic Products
                    </Badge>
                  )}
                </div>
              </div>
              
              {itemFields.map((field, index) => {
                const product = products.find(p => p.id === field.productId);
                const variant = product?.variants.find(v => v.id === field.variantId);
                const alternateProduct = field.alternateProductId ? 
                  products.find(p => p.id === field.alternateProductId) : undefined;
                const alternateVariant = alternateProduct && field.alternateVariantId ? 
                  alternateProduct.variants.find(v => v.id === field.alternateVariantId) : undefined;
                
                if (!product || !variant) return null;

                return (
                  <EnhancedOrderItem
                    key={field.id}
                    item={watchedItems[index]}
                    product={product}
                    variant={variant}
                    alternateProduct={alternateProduct}
                    alternateVariant={alternateVariant}
                    index={index}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                  />
                );
              })}
            </div>
          )}

          {errors.items && (
            <p className="text-sm text-red-600 mt-2">{errors.items.message}</p>
          )}
        </Card>

        {/* Delivery Information */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleInfo.color}-600 flex items-center justify-center`}>
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
              <p className="text-sm text-gray-600">Configure delivery and payment details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={moduleType === 'hub' ? 'Hub' : 'Store'}
              {...register('hubId')}
              error={errors.hubId?.message}
              options={[
                { value: '', label: `Select ${moduleType === 'hub' ? 'Hub' : 'Store'}` },
                ...hubs.map(hub => ({
                  value: hub.id,
                  label: `${hub.name} (${hub.location})`
                }))
              ]}
            />
            
            <div>
              <EnhancedDeliverySlotSelector
                hasExoticProducts={hasExoticProducts}
                hasRareProducts={hasRareProducts}
                selectedSlot={watch('deliverySlot') || ''}
                onSlotChange={(slot) => setValue('deliverySlot', slot)}
                error={errors.deliverySlot?.message}
              />
            </div>
            
            <Select
              label="Payment Method"
              {...register('paymentMethod')}
              error={errors.paymentMethod?.message}
              options={[
                { value: 'cod', label: 'Cash on Delivery' },
                { value: 'online', label: 'Online Payment' },
                { value: 'wallet', label: 'Wallet Payment' }
              ]}
            />
            
            <Select
              label="Order Source"
              {...register('orderSource')}
              error={errors.orderSource?.message}
              options={[
                { value: 'manual', label: 'Manual Entry' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'instagram', label: 'Instagram' },
                { value: 'facebook', label: 'Facebook' }
              ]}
            />
          </div>

          {/* Payment Status Section */}
          <div className="mt-6">
            <PaymentStatusSelector
              paymentStatus={watchedPaymentStatus || 'pending'}
              paymentMethod={watch('paymentMethod') || 'cod'}
              advanceAmount={watchedAdvanceAmount || 0}
              totalAmount={total}
              onPaymentStatusChange={(status) => {
                if (isPaymentStatus(status)) {
                  setValue('paymentStatus', status);
                }
              }}
              onAdvanceAmountChange={(amount) => setValue('advanceAmount', amount)}
              error={errors.paymentStatus?.message}
              advanceError={errors.advanceAmount?.message}
            />
          </div>

          {/* Surge Charges */}
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('applySurgeCharges')}
                className="rounded text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Apply Surge Charges</span>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </label>
            <p className="text-xs text-gray-600 mt-1">
              Apply surge charges for rain/peak day delivery
            </p>
            {watchedApplySurgeCharges && (
              <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  Surge charges: {formatCurrency(surgeCharges)} (Rain/Peak day delivery)
                </p>
              </div>
            )}
          </div>

          {/* Special Instructions */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              {...register('specialInstructions')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special delivery instructions..."
            />
          </div>
        </Card>

        {/* Manual Discount Entry - Always Visible */}
        <Card className="border-2 border-dashed border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-900">💰 Apply Discount / Offer</h3>
              <p className="text-sm text-orange-700">Enter discount percentage or fixed amount to reduce order total</p>
            </div>
            <Badge variant="warning" className="ml-auto">
              Optional
            </Badge>
          </div>

          <div className="bg-white rounded-lg p-6 border border-orange-200">
            <SimpleDiscountEntry
              discountType={watchedDiscountType || 'percentage'}
              discountValue={watchedDiscountValue || 0}
              subtotal={subtotal || 0}
              onDiscountTypeChange={(type) => setValue('discountType', type)}
              onDiscountValueChange={(value) => setValue('discountValue', value)}
              error={errors.discountValue?.message}
            />
            
            {subtotal === 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Add products to see discount calculations
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Order Summary */}
        {itemFields.length > 0 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-10 w-10 rounded-lg bg-${moduleInfo.color}-600 flex items-center justify-center`}>
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                <p className="text-sm text-gray-600">Review order details and pricing</p>
              </div>
            </div>

            {/* Discount Summary Header */}
            {manualDiscountAmount > 0 && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Discount Applied: {watchedDiscountType === 'percentage' ? `${watchedDiscountValue || 0}%` : formatCurrency(watchedDiscountValue || 0)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">-{formatCurrency(manualDiscountAmount)}</p>
                    <p className="text-xs text-green-700">Total Savings</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({itemFields.length} items)</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              
              {manualDiscountAmount > 0 && (
                <div className="flex justify-between text-green-600 bg-green-50 px-3 py-2 rounded">
                  <span className="flex items-center gap-1 font-medium">
                    <Tag className="h-4 w-4" />
                    Manual Discount ({watchedDiscountType === 'percentage' ? `${watchedDiscountValue}%` : 'Fixed Amount'})
                  </span>
                  <span className="font-semibold">-{formatCurrency(manualDiscountAmount)}</span>
                </div>
              )}
              
              {isEliteMember && eliteDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Crown className="h-5 w-5" />
                    Elite Discount (5%)
                  </span>
                  <span>-{formatCurrency(eliteDiscount)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charges</span>
                <span className={finalDeliveryCharges === 0 ? 'text-green-600' : ''}>
                  {finalDeliveryCharges === 0 ? 'FREE' : formatCurrency(finalDeliveryCharges)}
                </span>
              </div>
              
              {finalSurgeCharges > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span className="flex items-center gap-1">
                    <Zap className="h-5 w-5" />
                    Surge Charges
                  </span>
                  <span>+{formatCurrency(finalSurgeCharges)}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-green-600">{formatCurrency(total)}</span>
                </div>
              </div>

              {(isEliteMember || manualDiscountAmount > 0) && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    Total Savings: {formatCurrency(totalDiscount + (deliveryCharges - finalDeliveryCharges))}
                    {manualDiscountAmount > 0 && (
                      <span className="block text-xs mt-1">
                        Manual Discount: {formatCurrency(manualDiscountAmount)}
                        {isEliteMember && ` • Elite Discount: ${formatCurrency(eliteDiscount)}`}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Special Product Notices */}
            <SpecialProductNotice 
              hasRareProducts={hasRareProducts}
              hasExoticProducts={hasExoticProducts}
            />
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
              setSelectedSavedAddress(null);
              setShowManualAddress(false);
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={itemFields.length === 0 || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Creating Order...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </LoadingWrapper>
  );
}
