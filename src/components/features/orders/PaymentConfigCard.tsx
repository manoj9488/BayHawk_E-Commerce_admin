import { useState, useEffect } from 'react';
import { CreditCard, AlertCircle, CheckCircle, Info, DollarSign } from 'lucide-react';
import { Card, Input, Select } from '../../ui';
import { formatCurrency } from '../../../utils/helpers';

interface PaymentConfigCardProps {
  preOrderType: string;
  totalAmount: number;
  onPaymentMethodChange: (method: string) => void;
  onAdvancePaymentChange: (amount: number) => void;
  onOrderSourceChange: (source: string) => void;
  selectedPaymentMethod?: string;
  advancePayment?: number;
  selectedOrderSource?: string;
  errors?: {
    paymentMethod?: string;
    advancePayment?: string;
    orderSource?: string;
  };
}

const paymentMethods = [
  { 
    value: 'advance_full', 
    label: 'Full Advance Payment', 
    description: 'Pay complete amount now',
    icon: '💳',
    recommended: false
  },
  { 
    value: 'advance_partial', 
    label: 'Partial Advance Payment', 
    description: 'Pay partial amount now, rest on delivery',
    icon: '💰',
    recommended: true
  },
  { 
    value: 'cod_on_delivery', 
    label: 'Cash on Delivery', 
    description: 'Pay full amount on delivery',
    icon: '💵',
    recommended: false
  }
];

const orderSources = [
  { value: 'manual', label: 'Manual Entry', icon: '📝' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'subscription', label: 'Subscription', icon: '🔄' }
];

const preOrderPaymentRules = {
  rare_product: {
    minAdvancePercent: 50,
    description: 'Rare products require minimum 50% advance payment for confirmation'
  },
  bulk_order: {
    minAdvancePercent: 30,
    description: 'Bulk orders require minimum 30% advance payment'
  },
  advance_booking: {
    minAdvancePercent: 0,
    description: 'Advance bookings can be paid on delivery or in advance'
  },
  subscription: {
    minAdvancePercent: 100,
    description: 'Subscription orders require full advance payment'
  }
};

export function PaymentConfigCard({
  preOrderType,
  totalAmount,
  onPaymentMethodChange,
  onAdvancePaymentChange,
  onOrderSourceChange,
  selectedPaymentMethod,
  advancePayment = 0,
  selectedOrderSource,
  errors
}: PaymentConfigCardProps) {
  const [recommendedAdvance, setRecommendedAdvance] = useState(0);
  const [minAdvanceAmount, setMinAdvanceAmount] = useState(0);

  useEffect(() => {
    if (preOrderType && totalAmount > 0) {
      const rules = preOrderPaymentRules[preOrderType as keyof typeof preOrderPaymentRules];
      if (rules) {
        const minAmount = (totalAmount * rules.minAdvancePercent) / 100;
        const recommendedAmount = preOrderType === 'subscription' ? totalAmount : Math.max(minAmount, totalAmount * 0.5);
        
        setMinAdvanceAmount(minAmount);
        setRecommendedAdvance(recommendedAmount);
        
        // Auto-set advance payment based on payment method
        if (selectedPaymentMethod === 'advance_full') {
          onAdvancePaymentChange(totalAmount);
        } else if (selectedPaymentMethod === 'advance_partial' && advancePayment === 0) {
          onAdvancePaymentChange(recommendedAmount);
        } else if (selectedPaymentMethod === 'cod_on_delivery') {
          onAdvancePaymentChange(0);
        }
      }
    }
  }, [preOrderType, totalAmount, selectedPaymentMethod]);

  const remainingAmount = totalAmount - advancePayment;
  const advancePercent = totalAmount > 0 ? (advancePayment / totalAmount) * 100 : 0;
  
  const isValidAdvanceAmount = () => {
    if (selectedPaymentMethod === 'cod_on_delivery') return true;
    if (selectedPaymentMethod === 'advance_full') return advancePayment === totalAmount;
    return advancePayment >= minAdvanceAmount;
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Configuration</h3>
          <p className="text-sm text-gray-600">Configure advance payment and delivery options</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {paymentMethods.map((method) => {
              const isSelected = selectedPaymentMethod === method.value;
              const isDisabled = preOrderType === 'subscription' && method.value !== 'advance_full';
              
              return (
                <div
                  key={method.value}
                  onClick={() => !isDisabled && onPaymentMethodChange(method.value)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-green-500 bg-green-50' 
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{method.icon}</span>
                    <h4 className="font-medium text-gray-900">{method.label}</h4>
                    {method.recommended && !isDisabled && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              );
            })}
          </div>
          {errors?.paymentMethod && (
            <p className="text-sm text-red-600 mt-2">{errors.paymentMethod}</p>
          )}
        </div>

        {/* Advance Payment Amount */}
        {selectedPaymentMethod && selectedPaymentMethod !== 'cod_on_delivery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Advance Payment Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  value={advancePayment}
                  onChange={(e) => onAdvancePaymentChange(Number(e.target.value))}
                  placeholder="0"
                  min={minAdvanceAmount}
                  max={totalAmount}
                  error={errors?.advancePayment}
                  className="pl-10"
                  disabled={selectedPaymentMethod === 'advance_full'}
                />
              </div>
              
              {/* Payment Rules */}
              <div className="mt-2 space-y-1">
                {minAdvanceAmount > 0 && (
                  <p className="text-xs text-gray-600">
                    Minimum: {formatCurrency(minAdvanceAmount)} ({Math.round((minAdvanceAmount / totalAmount) * 100)}%)
                  </p>
                )}
                <p className="text-xs text-gray-600">
                  Recommended: {formatCurrency(recommendedAdvance)} ({Math.round((recommendedAdvance / totalAmount) * 100)}%)
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-2">
                {[25, 50, 75, 100].map(percent => {
                  const amount = (totalAmount * percent) / 100;
                  const isDisabled = amount < minAdvanceAmount || 
                    (selectedPaymentMethod === 'advance_full' && percent !== 100) ||
                    (selectedPaymentMethod === 'advance_partial' && percent === 100);
                  
                  return (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => !isDisabled && onAdvancePaymentChange(amount)}
                      disabled={isDisabled}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        isDisabled
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {percent}%
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Advance Payment:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(advancePayment)} ({Math.round(advancePercent)}%)
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Remaining on Delivery:</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(remainingAmount)}
                  </span>
                </div>
              </div>

              {/* Validation Status */}
              <div className="mt-3">
                {isValidAdvanceAmount() ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Payment configuration valid</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">
                      Minimum advance payment: {formatCurrency(minAdvanceAmount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Order Source
          </label>
          <Select
            value={selectedOrderSource}
            onChange={(e) => onOrderSourceChange(e.target.value)}
            options={orderSources.map(source => ({
              value: source.value,
              label: `${source.icon} ${source.label}`
            }))}
            error={errors?.orderSource}
          />
        </div>

        {/* Pre-Order Type Specific Rules */}
        {preOrderType && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Info className="h-4 w-4" />
              <span className="font-medium">Payment Rules for {preOrderType.replace('_', ' ').toUpperCase()}</span>
            </div>
            <p className="text-sm text-blue-700">
              {preOrderPaymentRules[preOrderType as keyof typeof preOrderPaymentRules]?.description}
            </p>
          </div>
        )}

        {/* Payment Security Notice */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Payment Security</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• All payments are processed securely through encrypted channels</li>
            <li>• Advance payments are refundable as per our cancellation policy</li>
            <li>• Payment confirmation will be sent via SMS and email</li>
            <li>• For COD orders, exact change is recommended</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}