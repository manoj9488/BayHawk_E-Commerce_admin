import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Input } from '../../ui';
import { 
  RotateCcw, 
  AlertTriangle, 
  CreditCard, 
  Banknote, 
  Building, 
  Wallet,
  Gift,
  Calculator,
  Package,
  Minus,
  Plus
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';
import type { Order } from '../../../types';

const refundRecordSchema = z.object({
  amount: z.number().min(0.01, 'Refund amount must be greater than 0'),
  refundType: z.enum(['full', 'partial', 'item_return', 'cancellation', 'quality_issue']),
  refundMethod: z.enum(['original_payment', 'cash', 'bank_transfer', 'wallet_credit', 'store_credit']),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  itemsRefunded: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    variant: z.string(),
    quantity: z.number().min(1),
    refundAmount: z.number().min(0),
  })).optional(),
  transactionId: z.string().optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type RefundRecordFormData = z.infer<typeof refundRecordSchema>;
type RefundType = RefundRecordFormData['refundType'];
type RefundMethod = RefundRecordFormData['refundMethod'];

interface RefundRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSubmit: (refundData: RefundRecordFormData) => Promise<void>;
}

const refundTypes: Array<{ value: RefundType; label: string; description: string; icon: typeof RotateCcw; color: string }> = [
  { value: 'full', label: 'Full Refund', description: 'Complete order refund', icon: RotateCcw, color: 'red' },
  { value: 'partial', label: 'Partial Refund', description: 'Partial amount refund', icon: Calculator, color: 'orange' },
  { value: 'item_return', label: 'Item Return', description: 'Specific item return', icon: Package, color: 'blue' },
  { value: 'cancellation', label: 'Order Cancellation', description: 'Order cancelled by customer', icon: AlertTriangle, color: 'gray' },
  { value: 'quality_issue', label: 'Quality Issue', description: 'Product quality problem', icon: AlertTriangle, color: 'red' },
];

const refundMethods: Array<{ value: RefundMethod; label: string; icon: typeof CreditCard; color: string }> = [
  { value: 'original_payment', label: 'Original Payment Method', icon: CreditCard, color: 'blue' },
  { value: 'cash', label: 'Cash Refund', icon: Banknote, color: 'green' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: Building, color: 'indigo' },
  { value: 'wallet_credit', label: 'Wallet Credit', icon: Wallet, color: 'purple' },
  { value: 'store_credit', label: 'Store Credit', icon: Gift, color: 'pink' },
];

export function RefundRecordModal({ isOpen, onClose, order, onSubmit }: RefundRecordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<RefundType | ''>('');
  const [selectedMethod, setSelectedMethod] = useState<RefundMethod | ''>('');

  const { register, handleSubmit, formState: { errors }, watch, setValue, control, reset } = useForm<RefundRecordFormData>({
    resolver: zodResolver(refundRecordSchema),
    defaultValues: {
      refundType: 'partial',
      refundMethod: 'original_payment',
      itemsRefunded: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itemsRefunded'
  });

  const watchedAmount = watch('amount');
  const watchedType = watch('refundType');

  // Calculate refund details
  const totalAmount = order.totalAmount;
  const paidAmount = order.paidAmount || 0;
  const refundedAmount = order.refundedAmount || 0;
  const maxRefundable = paidAmount - refundedAmount;
  const netAmountAfterRefund = totalAmount - refundedAmount - (watchedAmount || 0);

  const handleFormSubmit = async (data: RefundRecordFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
      setSelectedType('');
      setSelectedMethod('');
      onClose();
    } catch (error) {
      console.error('Failed to record refund:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeSelect = (type: RefundType) => {
    setSelectedType(type);
    setValue('refundType', type);
    
    // Auto-set amount for full refund
    if (type === 'full') {
      setValue('amount', maxRefundable);
    }
  };

  const handleMethodSelect = (method: RefundMethod) => {
    setSelectedMethod(method);
    setValue('refundMethod', method);
  };

  const handleQuickAmount = (amount: number) => {
    setValue('amount', amount);
  };

  const addItemRefund = (item: Order['items'][number]) => {
    append({
      productId: item.productId,
      productName: item.productName,
      variant: item.variant,
      quantity: 1,
      refundAmount: item.price
    });
  };

  const calculateItemsTotal = () => {
    return fields.reduce((sum, field) => sum + (field.refundAmount || 0), 0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Refund" size="xl">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Order Summary */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-red-600 flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Refund for Order #{order.id}</h3>
              <p className="text-sm text-red-700">{order.customerName} • {order.customerPhone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(paidAmount)}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Already Refunded</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(refundedAmount)}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Max Refundable</p>
              <p className="text-lg font-bold text-orange-600">{formatCurrency(maxRefundable)}</p>
            </div>
          </div>
        </div>

        {/* Refund Type Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Refund Type</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {refundTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.value;
              
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeSelect(type.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`h-6 w-6 mb-2 ${
                    isSelected ? `text-${type.color}-600` : 'text-gray-400'
                  }`} />
                  <p className={`font-medium text-sm ${
                    isSelected ? `text-${type.color}-900` : 'text-gray-700'
                  }`}>
                    {type.label}
                  </p>
                  <p className={`text-xs ${
                    isSelected ? `text-${type.color}-700` : 'text-gray-500'
                  }`}>
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Refund Amount */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calculator className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Refund Amount</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Amount to Refund"
                type="number"
                step="0.01"
                min="0.01"
                max={maxRefundable}
                {...register('amount', { valueAsNumber: true })}
                error={errors.amount?.message}
                placeholder="Enter refund amount"
              />
              
              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleQuickAmount(maxRefundable)}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                >
                  Full ({formatCurrency(maxRefundable)})
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(maxRefundable / 2)}
                  className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
                >
                  Half ({formatCurrency(maxRefundable / 2)})
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Refund Reason</label>
              <textarea
                {...register('reason')}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter reason for refund..."
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>
          </div>

          {/* Refund Calculation */}
          {watchedAmount && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">Refund Impact</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-red-700">Refunding:</span>
                  <p className="font-bold text-red-900">{formatCurrency(watchedAmount)}</p>
                </div>
                <div>
                  <span className="text-red-700">Total Refunded:</span>
                  <p className="font-bold text-red-900">{formatCurrency(refundedAmount + watchedAmount)}</p>
                </div>
                <div>
                  <span className="text-red-700">Net Order Value:</span>
                  <p className="font-bold text-red-900">{formatCurrency(Math.max(0, netAmountAfterRefund))}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Item-wise Refund (for item_return type) */}
        {watchedType === 'item_return' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-gray-900">Items to Refund</h3>
              </div>
              <div className="text-sm text-gray-600">
                Total: {formatCurrency(calculateItemsTotal())}
              </div>
            </div>

            {/* Available Items */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">{item.variant} • Qty: {item.quantity} • {formatCurrency(item.price)} each</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addItemRefund(item)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      <Plus className="h-4 w-4 inline mr-1" />
                      Add to Refund
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Items for Refund */}
            {fields.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Items Selected for Refund</h4>
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{field.productName}</p>
                        <p className="text-sm text-gray-600">{field.variant}</p>
                        
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              {...register(`itemsRefunded.${index}.quantity`, { valueAsNumber: true })}
                              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Refund Amount</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              {...register(`itemsRefunded.${index}.refundAmount`, { valueAsNumber: true })}
                              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="ml-3 p-1 text-red-600 hover:text-red-800"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Refund Method Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Refund Method</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {refundMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.value;
              
              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => handleMethodSelect(method.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? `border-${method.color}-500 bg-${method.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${
                    isSelected ? `text-${method.color}-600` : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    isSelected ? `text-${method.color}-900` : 'text-gray-700'
                  }`}>
                    {method.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Additional Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Transaction ID (Optional)"
              {...register('transactionId')}
              placeholder="Enter transaction ID"
            />
            <Input
              label="Reference Number (Optional)"
              {...register('referenceNumber')}
              placeholder="Enter reference number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Add any additional notes about this refund..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            className="flex-1"
            disabled={isLoading || !watchedAmount || !selectedType || !selectedMethod}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Record Refund
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
