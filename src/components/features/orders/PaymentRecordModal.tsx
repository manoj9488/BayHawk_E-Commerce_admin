import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Input, Select, Badge } from '../../ui';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Building, 
  FileText, 
  CheckCircle,
  Calculator,
  Receipt,
  AlertCircle} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';
import type { Order } from '../../../types';

const paymentRecordSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'online']),
  paymentMode: z.enum(['full', 'partial', 'advance']),
  transactionId: z.string().optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentRecordFormData = z.infer<typeof paymentRecordSchema>;
type PaymentMethod = PaymentRecordFormData['paymentMethod'];
type PaymentMode = PaymentRecordFormData['paymentMode'];

interface PaymentRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSubmit: (paymentData: PaymentRecordFormData) => Promise<void>;
}

const paymentMethods: Array<{ value: PaymentMethod; label: string; icon: typeof CreditCard; color: string }> = [
  { value: 'cash', label: 'Cash', icon: Banknote, color: 'green' },
  { value: 'card', label: 'Card (Debit/Credit)', icon: CreditCard, color: 'blue' },
  { value: 'upi', label: 'UPI', icon: Smartphone, color: 'purple' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: Building, color: 'indigo' },
  { value: 'cheque', label: 'Cheque', icon: FileText, color: 'gray' },
  { value: 'online', label: 'Online Payment', icon: CreditCard, color: 'blue' },
];

const paymentModes: Array<{ value: PaymentMode; label: string; description: string }> = [
  { value: 'full', label: 'Full Payment', description: 'Complete payment for the order' },
  { value: 'partial', label: 'Partial Payment', description: 'Part payment, balance pending' },
  { value: 'advance', label: 'Advance Payment', description: 'Advance payment for pre-orders' },
];

export function PaymentRecordModal({ isOpen, onClose, order, onSubmit }: PaymentRecordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | ''>('');

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<PaymentRecordFormData>({
    resolver: zodResolver(paymentRecordSchema),
    defaultValues: {
      paymentMode: 'partial'
    }
  });

  const watchedAmount = watch('amount');
  const watchedMode = watch('paymentMode');

  // Calculate payment details
  const totalAmount = order.totalAmount;
  const paidAmount = order.paidAmount || 0;
  const pendingAmount = totalAmount - paidAmount;
  const remainingAfterPayment = pendingAmount - (watchedAmount || 0);

  const handleFormSubmit = async (data: PaymentRecordFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
      setSelectedMethod('');
      onClose();
    } catch (error) {
      console.error('Failed to record payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setValue('paymentMethod', method);
  };

  const handleQuickAmount = (amount: number) => {
    setValue('amount', amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment" size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
              <p className="text-sm text-gray-600">{order.customerName} • {order.customerPhone}</p>
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
            <div className="text-center p-3 bg-white rounded-lg border-2 border-orange-400 shadow-md">
              <p className="text-sm font-semibold text-orange-700">Balance to Pay</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(pendingAmount)}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Payment Status</p>
              <Badge 
                variant={
                  order.paymentStatus === 'paid' ? 'success' : 
                  order.paymentStatus === 'partial' ? 'warning' : 'danger'
                }
              >
                {order.paymentStatus === 'partial' ? 'PARTIALLY PAID' : order.paymentStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Balance Alert for Partial Payments */}
        {order.paymentStatus === 'partial' && pendingAmount > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900">Partial Payment Pending</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Customer needs to pay <span className="font-bold">{formatCurrency(pendingAmount)}</span> to complete this order.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Amount */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calculator className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Payment Amount</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Amount to Record"
                type="number"
                step="0.01"
                min="0.01"
                max={pendingAmount}
                {...register('amount', { valueAsNumber: true })}
                error={errors.amount?.message}
                placeholder="Enter amount received"
              />
              
              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleQuickAmount(pendingAmount)}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                >
                  Full ({formatCurrency(pendingAmount)})
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(pendingAmount / 2)}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                >
                  Half ({formatCurrency(pendingAmount / 2)})
                </button>
              </div>
            </div>

            <div>
              <Select
                label="Payment Mode"
                {...register('paymentMode')}
                error={errors.paymentMode?.message}
                options={[
                  { value: '', label: 'Select payment mode' },
                  ...paymentModes.map(mode => ({ 
                    value: mode.value, 
                    label: mode.label 
                  }))
                ]}
              />
              
              {watchedMode && (
                <p className="text-xs text-gray-600 mt-1">
                  {paymentModes.find(m => m.value === watchedMode)?.description}
                </p>
              )}
            </div>
          </div>

          {/* Payment Calculation */}
          {watchedAmount && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Payment Calculation</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Recording:</span>
                  <p className="font-bold text-blue-900">{formatCurrency(watchedAmount)}</p>
                </div>
                <div>
                  <span className="text-blue-700">Remaining:</span>
                  <p className="font-bold text-blue-900">{formatCurrency(Math.max(0, remainingAfterPayment))}</p>
                </div>
                <div>
                  <span className="text-blue-700">New Status:</span>
                  <p className="font-bold text-blue-900">
                    {remainingAfterPayment <= 0 ? 'PAID' : 'PARTIALLY PAID'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Payment Method</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {paymentMethods.map((method) => {
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
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional notes about this payment..."
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
            className="flex-1"
            disabled={isLoading || !watchedAmount || !selectedMethod}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Recording...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Record Payment
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
