import { Input, Badge } from '../../ui';
import { Percent, DollarSign, Tag, Calculator, Gift } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

interface DiscountSelectorProps {
  discountType: 'percentage' | 'amount';
  discountValue: number;
  subtotal: number;
  onDiscountTypeChange: (type: 'percentage' | 'amount') => void;
  onDiscountValueChange: (value: number) => void;
  error?: string;
  className?: string;
}

export function DiscountSelector({
  discountType,
  discountValue,
  subtotal,
  onDiscountTypeChange,
  onDiscountValueChange,
  error,
  className = ''
}: DiscountSelectorProps) {
  // Calculate discount amount based on type
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * discountValue) / 100 
    : discountValue;

  const finalAmount = Math.max(0, subtotal - discountAmount);
  const effectivePercentage = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;

  // Validation limits
  const maxPercentage = 100;
  const maxAmount = subtotal;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Current Discount Status */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Tag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Discount Configuration</h3>
            <p className="text-sm text-gray-600">
              {discountAmount > 0 
                ? `Current discount: ${formatCurrency(discountAmount)} (${effectivePercentage.toFixed(1)}%)`
                : 'No discount applied'
              }
            </p>
          </div>
        </div>
        {discountAmount > 0 && (
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">-{formatCurrency(discountAmount)}</p>
            <p className="text-xs text-gray-500">Discount Amount</p>
          </div>
        )}
      </div>
      {/* Discount Type Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="block text-lg font-semibold text-gray-800">Choose Discount Type</label>
          <Badge variant="info" className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {discountType === 'percentage' ? 'Percentage Based' : 'Fixed Amount'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onDiscountTypeChange('percentage')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              discountType === 'percentage'
                ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25 text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                discountType === 'percentage' ? 'bg-blue-600' : 'bg-gray-400'
              }`}>
                <Percent className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Percentage Discount</span>
            </div>
            <p className="text-sm opacity-80">
              Apply discount as percentage of subtotal (0% - 100%)
            </p>
            {discountType === 'percentage' && discountValue > 0 && (
              <div className="mt-2 p-2 bg-blue-100 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Current: {discountValue}% = {formatCurrency(discountAmount)}
                </p>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => onDiscountTypeChange('amount')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              discountType === 'amount'
                ? 'border-green-500 bg-green-50 text-green-900 shadow-md'
                : 'border-gray-200 hover:border-green-300 hover:bg-green-25 text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                discountType === 'amount' ? 'bg-green-600' : 'bg-gray-400'
              }`}>
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Fixed Amount</span>
            </div>
            <p className="text-sm opacity-80">
              Apply discount as fixed rupee amount
            </p>
            {discountType === 'amount' && discountValue > 0 && (
              <div className="mt-2 p-2 bg-green-100 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Current: {formatCurrency(discountValue)} ({effectivePercentage.toFixed(1)}%)
                </p>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Discount Value Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="block text-lg font-semibold text-gray-800">
            Enter Discount {discountType === 'percentage' ? 'Percentage' : 'Amount'}
          </label>
          {discountValue > 0 && (
            <Badge variant="success" className="px-3 py-1">
              {discountType === 'percentage' ? `${discountValue}%` : formatCurrency(discountValue)}
            </Badge>
          )}
        </div>

        <div className="relative">
          <div className={`absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full flex items-center justify-center ${
            discountType === 'percentage' ? 'bg-blue-600' : 'bg-green-600'
          }`}>
            {discountType === 'percentage' ? (
              <Percent className="h-4 w-4 text-white" />
            ) : (
              <DollarSign className="h-4 w-4 text-white" />
            )}
          </div>
          <Input
            type="number"
            step={discountType === 'percentage' ? '0.1' : '0.01'}
            min="0"
            max={discountType === 'percentage' ? maxPercentage : maxAmount}
            value={discountValue || ''}
            onChange={(e) => onDiscountValueChange(parseFloat(e.target.value) || 0)}
            placeholder={discountType === 'percentage' ? 'Enter percentage (0-100)' : `Enter amount (0-${formatCurrency(maxAmount)})`}
            error={error}
            className="pl-14 pr-4 py-3 text-lg font-medium border-2 focus:ring-2"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            {discountType === 'percentage' ? (
              <span>Range: 0% - {maxPercentage}%</span>
            ) : (
              <span>Range: ₹0 - {formatCurrency(maxAmount)}</span>
            )}
          </div>
          <div className="text-gray-800 font-medium">
            Current: {discountType === 'percentage' ? `${discountValue}%` : formatCurrency(discountValue)}
          </div>
        </div>
      </div>

      {/* Discount Preview */}
      {subtotal > 0 && (
        <div className={`p-4 rounded-lg border ${
          discountAmount > 0 
            ? 'bg-green-50 border-green-200' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
              discountAmount > 0 ? 'bg-green-600' : 'bg-gray-400'
            }`}>
              <Calculator className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${
                discountAmount > 0 ? 'text-green-900' : 'text-gray-700'
              }`}>
                Discount Calculation
              </h4>
              
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>
                        Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Fixed'}):
                      </span>
                      <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                    </div>
                    
                    {discountType === 'amount' && effectivePercentage > 0 && (
                      <div className="flex justify-between text-green-600 text-xs">
                        <span>Effective Percentage:</span>
                        <span>{effectivePercentage.toFixed(1)}%</span>
                      </div>
                    )}
                  </>
                )}
                
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Amount after Discount:</span>
                    <span className={discountAmount > 0 ? 'text-green-600' : 'text-gray-900'}>
                      {formatCurrency(finalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Discount Buttons */}
      {discountType === 'percentage' && subtotal > 0 && (
        <div className="space-y-3">
          <p className="text-lg font-semibold text-gray-800">Quick Discount Options:</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[5, 10, 15, 20, 25, 30].map((percent) => (
              <button
                key={percent}
                type="button"
                onClick={() => onDiscountValueChange(percent)}
                className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  discountValue === percent
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105'
                }`}
              >
                {percent}%
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onDiscountValueChange(0)}
              className="px-6 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Clear Discount
            </button>
          </div>
        </div>
      )}

      {/* Discount Validation Messages */}
      {discountValue > 0 && (
        <div className="space-y-2">
          {discountType === 'percentage' && discountValue > 50 && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <div className="flex items-center gap-1">
                <Gift className="h-3 w-3" />
                <span>High discount: {discountValue}% - Please verify authorization</span>
              </div>
            </div>
          )}
          
          {discountType === 'amount' && discountAmount > subtotal * 0.5 && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <div className="flex items-center gap-1">
                <Gift className="h-3 w-3" />
                <span>Large discount: {formatCurrency(discountAmount)} - Please verify authorization</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}