import { Select, Input, Badge } from '../../ui';
import { CreditCard, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

interface PaymentStatusSelectorProps {
  paymentStatus: string;
  paymentMethod: string;
  advanceAmount?: number;
  totalAmount: number;
  onPaymentStatusChange: (status: string) => void;
  onAdvanceAmountChange: (amount: number) => void;
  error?: string;
  advanceError?: string;
  className?: string;
}

const paymentStatusOptions = [
  {
    value: 'pending',
    label: 'Pending',
    description: 'No payment received yet',
    icon: Clock,
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800'
  },
  {
    value: 'partial',
    label: 'Partially Paid',
    description: 'Advance payment received',
    icon: AlertCircle,
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800'
  },
  {
    value: 'paid',
    label: 'Paid',
    description: 'Full payment received',
    icon: CheckCircle,
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800'
  }
];

export function PaymentStatusSelector({
  paymentStatus,
  paymentMethod,
  advanceAmount = 0,
  totalAmount,
  onPaymentStatusChange,
  onAdvanceAmountChange,
  error,
  advanceError,
  className = ''
}: PaymentStatusSelectorProps) {
  const selectedStatus = paymentStatusOptions.find(option => option.value === paymentStatus);
  const StatusIcon = selectedStatus?.icon || Clock;

  const pendingAmount = totalAmount - advanceAmount;
  const isPartialPayment = paymentStatus === 'partial';
  const isFullPayment = paymentStatus === 'paid';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Payment Status Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">Payment Status</label>
          <Badge variant={selectedStatus?.color} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {selectedStatus?.label}
          </Badge>
        </div>

        <Select
          value={paymentStatus}
          onChange={(e) => onPaymentStatusChange(e.target.value)}
          error={error}
          options={[
            { value: '', label: 'Select Payment Status' },
            ...paymentStatusOptions.map(option => ({
              value: option.value,
              label: `${option.label} - ${option.description}`
            }))
          ]}
        />
      </div>

      {/* Payment Status Information */}
      {selectedStatus && (
        <div className={`p-4 rounded-lg border ${selectedStatus.bgColor} ${selectedStatus.borderColor}`}>
          <div className="flex items-start gap-3">
            <div className={`h-8 w-8 rounded-lg bg-${selectedStatus.color}-600 flex items-center justify-center`}>
              <StatusIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${selectedStatus.textColor}`}>
                {selectedStatus.label}
              </h4>
              <p className={`text-sm ${selectedStatus.textColor} opacity-80 mt-1`}>
                {selectedStatus.description}
              </p>
              
              {/* Payment Method Info */}
              <div className="mt-2 flex items-center gap-2">
                <CreditCard className={`h-4 w-4 ${selectedStatus.textColor} opacity-60`} />
                <span className={`text-sm ${selectedStatus.textColor} opacity-80`}>
                  Payment Method: {paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advance Amount Input for Partial Payment */}
      {isPartialPayment && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700">Advance Amount</label>
            <Badge variant="blue">Required for Partial Payment</Badge>
          </div>
          
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max={totalAmount - 0.01}
              value={advanceAmount || ''}
              onChange={(e) => onAdvanceAmountChange(parseFloat(e.target.value) || 0)}
              placeholder="Enter advance amount"
              error={advanceError}
              className="pl-10"
            />
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Maximum advance: {formatCurrency(totalAmount - 0.01)}</p>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      {totalAmount > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Summary
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Order Amount:</span>
              <span className="font-medium text-gray-900">{formatCurrency(totalAmount)}</span>
            </div>
            
            {isPartialPayment && advanceAmount > 0 && (
              <>
                <div className="flex justify-between text-blue-600">
                  <span>Advance Payment:</span>
                  <span className="font-medium">{formatCurrency(advanceAmount)}</span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span>Pending Amount:</span>
                  <span className="font-medium">{formatCurrency(pendingAmount)}</span>
                </div>
              </>
            )}
            
            {isFullPayment && (
              <div className="flex justify-between text-green-600">
                <span>Payment Status:</span>
                <span className="font-medium">Fully Paid</span>
              </div>
            )}
            
            {paymentStatus === 'pending' && (
              <div className="flex justify-between text-orange-600">
                <span>Payment Status:</span>
                <span className="font-medium">Payment Pending</span>
              </div>
            )}
          </div>
          
          {/* Payment Instructions */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              {paymentMethod === 'cod' && (
                <p>💰 Cash on Delivery - Collect payment upon delivery</p>
              )}
              {paymentMethod === 'online' && (
                <p>💳 Online Payment - Payment processed through gateway</p>
              )}
              {paymentMethod === 'wallet' && (
                <p>👛 Wallet Payment - Deducted from customer wallet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
