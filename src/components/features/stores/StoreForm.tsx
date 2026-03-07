import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select, Button, Checkbox } from '../../ui';
import { storeSchema, type StoreInput } from '../../../utils/validations';
import type { Store } from '../../../types';

interface StoreFormProps {
  onSubmit: (data: StoreInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<Store>;
}

const workingDaysOptions = [
  { value: 'Monday', label: 'Mon' },
  { value: 'Tuesday', label: 'Tue' },
  { value: 'Wednesday', label: 'Wed' },
  { value: 'Thursday', label: 'Thu' },
  { value: 'Friday', label: 'Fri' },
  { value: 'Saturday', label: 'Sat' },
  { value: 'Sunday', label: 'Sun' },
];

export function StoreForm({ onSubmit, onCancel, isSubmitting = false, initialData }: StoreFormProps) {
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<StoreInput>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      ...initialData,
      isActive: initialData?.isActive ?? true,
      address: initialData?.address || {},
      location: initialData?.location || { latitude: 0, longitude: 0 },
      contactInfo: initialData?.contactInfo || {},
      operatingHours: initialData?.operatingHours || { workingDays: [] },
      capacity: initialData?.capacity || {},
      assignAllSlots: initialData?.deliverySlots ? false : true,
      deliverySlots: initialData?.deliverySlots || [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">
      {/* Basic Information */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h3 className="font-semibold mb-4 text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Store Name" 
            {...register('name')} 
            error={errors.name?.message}
            placeholder="Enter store name"
          />
          <Input 
            label="Store Code" 
            {...register('code')} 
            error={errors.code?.message}
            placeholder="STR-XXX-001"
          />
        </div>
        <div className="mt-4">
          <Input 
            label="Description" 
            {...register('description')} 
            error={errors.description?.message}
            placeholder="Brief description of the store"
          />
        </div>
        <div className="mt-4">
          <Select 
            label="Store Type" 
            {...register('storeType')} 
            error={errors.storeType?.message}
            options={[
              { value: '', label: 'Select store type' },
              { value: 'retail', label: 'Retail Store' }, 
              { value: 'warehouse', label: 'Warehouse' }, 
              { value: 'pickup_point', label: 'Pickup Point' }
            ]}
          />
        </div>
      </div>

      {/* Address */}
      <fieldset className="border rounded-lg p-4 bg-green-50">
        <legend className="text-sm font-medium px-2">Address Information</legend>
        <div className="space-y-4">
          <Input 
            label="Street Address" 
            {...register('address.street')} 
            error={errors.address?.street?.message}
            placeholder="Building name, street name"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="City" 
              {...register('address.city')} 
              error={errors.address?.city?.message}
              placeholder="Chennai"
            />
            <Input 
              label="State" 
              {...register('address.state')} 
              error={errors.address?.state?.message}
              placeholder="Tamil Nadu"
            />
            <Input 
              label="Pincode" 
              {...register('address.pincode')} 
              error={errors.address?.pincode?.message}
              placeholder="600001"
            />
          </div>
          <Input 
            label="Country" 
            {...register('address.country')} 
            error={errors.address?.country?.message}
            placeholder="India"
          />
        </div>
      </fieldset>

      {/* Location */}
      <fieldset className="border rounded-lg p-4 bg-purple-50">
        <legend className="text-sm font-medium px-2">GPS Location</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Latitude" 
            type="number" 
            step="any" 
            {...register('location.latitude', { valueAsNumber: true })} 
            error={errors.location?.latitude?.message}
            placeholder="13.0827"
          />
          <Input 
            label="Longitude" 
            type="number" 
            step="any" 
            {...register('location.longitude', { valueAsNumber: true })} 
            error={errors.location?.longitude?.message}
            placeholder="80.2707"
          />
        </div>
      </fieldset>

      {/* Contact Info */}
      <fieldset className="border rounded-lg p-4 bg-pink-50">
        <legend className="text-sm font-medium px-2">Contact Information</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            label="Phone" 
            {...register('contactInfo.phone')} 
            error={errors.contactInfo?.phone?.message}
            placeholder="+91 9876543210"
          />
          <Input 
            label="Email" 
            type="email" 
            {...register('contactInfo.email')} 
            error={errors.contactInfo?.email?.message}
            placeholder="store@example.com"
          />
          <Input 
            label="Manager Name" 
            {...register('contactInfo.manager')} 
            error={errors.contactInfo?.manager?.message}
            placeholder="Manager name"
          />
        </div>
      </fieldset>

      <fieldset className="border rounded-lg p-4 bg-orange-50">
        <legend className="text-sm font-medium px-2">Operating Hours</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Opening Time" 
            type="time" 
            {...register('operatingHours.open')} 
            error={errors.operatingHours?.open?.message}
          />
          <Input 
            label="Closing Time" 
            type="time" 
            {...register('operatingHours.close')} 
            error={errors.operatingHours?.close?.message}
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
            <Controller
                name="operatingHours.workingDays"
                control={control}
                render={({ field }) => (
                    <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
                        {workingDaysOptions.map(day => (
                            <label key={day.value} className={`flex items-center justify-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${field.value?.includes(day.value) ? 'bg-blue-50 border-blue-300' : ''}`}>
                                <input type="checkbox" className="hidden" value={day.value} checked={field.value?.includes(day.value)} onChange={e => {
                                    const newDays = e.target.checked ? [...(field.value || []), day.value] : field.value?.filter(d => d !== day.value);
                                    field.onChange(newDays);
                                }} />
                                <span>{day.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            />
            {errors.operatingHours?.workingDays && <p className="text-sm text-red-600 mt-1">{errors.operatingHours.workingDays.message}</p>}
        </div>

        {/* Delivery Slots Assignment */}
        <div className="border-t pt-4 mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Slots Assignment
          </label>
          <Controller
            name="assignAllSlots"
            control={control}
            render={({ field }) => (
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => {
                      field.onChange(true);
                      setValue('deliverySlots', []);
                    }}
                    className="rounded-full border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Assign All Slots</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                    className="rounded-full border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Partially Select Slots</span>
                </label>
              </div>
            )}
          />

          <Controller
            name="deliverySlots"
            control={control}
            render={({ field }) => (
              <>
                {watch('assignAllSlots') === false && (
                  <div className="bg-white border rounded-lg p-3 mt-3">
                    <p className="text-xs text-gray-600 mb-3">Select specific delivery time slots:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { id: '6-9', label: '6 AM - 9 AM', value: '06:00-09:00' },
                        { id: '9-12', label: '9 AM - 12 PM', value: '09:00-12:00' },
                        { id: '12-15', label: '12 PM - 3 PM', value: '12:00-15:00' },
                        { id: '15-18', label: '3 PM - 6 PM', value: '15:00-18:00' },
                        { id: '18-21', label: '6 PM - 9 PM', value: '18:00-21:00' },
                        { id: '21-24', label: '9 PM - 12 AM', value: '21:00-24:00' }
                      ].map(slot => (
                        <label key={slot.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.value?.includes(slot.value) || false}
                            onChange={(e) => {
                              const slots = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...slots, slot.value]);
                              } else {
                                field.onChange(slots.filter(s => s !== slot.value));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{slot.label}</span>
                        </label>
                      ))}
                    </div>
                    {field.value && field.value.length > 0 && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ {field.value.length} slot(s) selected
                      </p>
                    )}
                  </div>
                )}
                {watch('assignAllSlots') === true && (
                  <p className="text-xs text-blue-600 mt-2">
                    ✓ All delivery slots will be available (6 AM - 12 AM)
                  </p>
                )}
              </>
            )}
          />
        </div>
      </fieldset>

      <fieldset className="border rounded-lg p-4 bg-yellow-50">
        <legend className="text-sm font-medium px-2">Capacity & Resources</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            label="Storage Capacity (units)" 
            type="number" 
            {...register('capacity.storage', { valueAsNumber: true })} 
            error={errors.capacity?.storage?.message}
            placeholder="1000"
          />
          <Input 
            label="Daily Orders Capacity" 
            type="number" 
            {...register('capacity.dailyOrders', { valueAsNumber: true })} 
            error={errors.capacity?.dailyOrders?.message}
            placeholder="200"
          />
          <Input 
            label="Staff Count" 
            type="number" 
            {...register('capacity.staff', { valueAsNumber: true })} 
            error={errors.capacity?.staff?.message}
            placeholder="8"
          />
        </div>
      </fieldset>

      <fieldset className="border rounded-lg p-4 bg-gray-50">
        <legend className="text-sm font-medium px-2">Configuration</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Connected Hub ID" 
            {...register('hubId')} 
            error={errors.hubId?.message}
            placeholder="HUB-XXX-001"
          />
          <Input 
            label="Delivery Radius (km)" 
            type="number" 
            {...register('deliveryRadius', { valueAsNumber: true })} 
            error={errors.deliveryRadius?.message}
            placeholder="5"
          />
        </div>
        <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
                <Checkbox label="Store is active" checked={field.value} onChange={field.onChange} />
            )}
        />
      </fieldset>
      
      <div className="flex gap-4 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1" disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (initialData?.id ? 'Save Changes' : 'Create Store')}
        </Button>
      </div>
    </form>
  );
}