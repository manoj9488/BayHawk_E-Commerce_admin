import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select, Button } from '../../ui';
import { createOrderSchema, type CreateOrderInput } from '../../../utils/validations';

interface OrderFormProps {
  onSubmit: (data: CreateOrderInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<CreateOrderInput>;
}

export function OrderForm({ onSubmit, onCancel, isSubmitting = false, initialData }: OrderFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      addressType: 'home',
      paymentMethod: 'cod',
      source: 'manual',
      items: [],
      ...initialData
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input 
        label="Customer Name" 
        {...register('customerName')} 
        placeholder="Full Name" 
        error={errors.customerName?.message} 
      />
      <Input 
        label="Phone Number" 
        {...register('customerPhone')} 
        placeholder="+91 9876543210" 
        error={errors.customerPhone?.message} 
      />
      <Input 
        label="Email (Optional)" 
        {...register('customerEmail')} 
        type="email" 
        placeholder="customer@email.com" 
      />
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Delivery Address</h3>
        <div className="space-y-3">
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
          <div className="grid grid-cols-3 gap-3">
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
      </div>
      
      <Select 
        label="Delivery Slot" 
        {...register('deliverySlot')} 
        error={errors.deliverySlot?.message} 
        options={[
          { value: '', label: 'Select Slot' }, 
          { value: 'slot1', label: 'Slot 1 (7AM-9AM)' }, 
          { value: 'slot2', label: 'Slot 2 (1PM-3PM)' }, 
          { value: 'slot3', label: 'Slot 3 (7PM-9PM)' }
        ]} 
      />
      <Select 
        label="Payment Method" 
        {...register('paymentMethod')} 
        error={errors.paymentMethod?.message} 
        options={[
          { value: 'cod', label: 'Cash on Delivery' }, 
          { value: 'online', label: 'Online Payment' }
        ]} 
      />
      <Select 
        label="Order Source" 
        {...register('source')} 
        error={errors.source?.message} 
        options={[
          { value: 'whatsapp', label: 'WhatsApp' }, 
          { value: 'instagram', label: 'Instagram' }, 
          { value: 'facebook', label: 'Facebook' }, 
          { value: 'manual', label: 'Manual' }
        ]} 
      />
      
      <div className="flex gap-3 pt-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel} 
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
}