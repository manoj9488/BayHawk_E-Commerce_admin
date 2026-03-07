import { Input, Badge } from '../../ui';
import { Percent, DollarSign, Tag, Calculator } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

interface SimpleDiscountEntryProps {
  discountType: 'percentage' | 'amount';
  discountValue: number;
  subtotal: number;
  onDiscountTypeChange: (type: 'percentage' | 'amount') => void;
  onDiscountValueChange: (value: number) => void;
  error?: string;
  className?: string;
}

export function SimpleDiscountEntry({
  discountType,
  discountValue,
  subtotal,
  onDiscountTypeChange,
  onDiscountValueChange,
  error,
  className = ''
}: SimpleDiscountEntryProps) {
  // Calculate discount amount based on type
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * discountValue) / 100 
    : discountValue;

  const finalAmount = Math.max(0, subtotal - discountAmount);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200">
        <h4 className="text-lg font-bold text-gray-800 mb-2">🎯 Discount Configuration</h4>
        <p className="text-sm text-gray-600">
          {discountAmount > 0 
            ? `Current discount: ${formatCurrency(discountAmount)} (${((discountAmount / Math.max(subtotal, 1)) * 100).toFixed(1)}%)`
            : 'No discount applied - Enter discount below'
          }
        </p>
      </div>

      {/* Discount Type Toggle */}
      <div className="space-y-3">
        <label className="block text-lg font-semibold text-gray-800">Choose Discount Type:</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onDiscountTypeChange('percentage')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              discountType === 'percentage'
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Percent className="h-6 w-6" />
              <span className="text-lg font-bold">Percentage Discount</span>
            </div>
            <p className="text-sm opacity-90">Apply discount as % of subtotal</p>
          </button>
          <button
            type="button"
            onClick={() => onDiscountTypeChange('amount')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              discountType === 'amount'
                ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105'
                : 'bg-white text-gray-700 border-gray-300 hover:border-green-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-lg font-bold">Fixed Amount</span>
            </div>
            <p className="text-sm opacity-90">Apply discount as fixed rupee amount</p>
          </button>
        </div>
      </div>

      {/* Discount Value Input */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-lg font-semibold text-gray-800">
            Enter Discount {discountType === 'percentage' ? 'Percentage' : 'Amount'}
          </label>
          <div className="relative">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center ${
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
              max={discountType === 'percentage' ? 100 : Math.max(subtotal, 1)}
              value={discountValue || ''}
              onChange={(e) => onDiscountValueChange(parseFloat(e.target.value) || 0)}
              placeholder={discountType === 'percentage' ? 'Enter percentage (0-100)' : 'Enter amount in ₹'}
              error={error}
              className="pl-14 pr-4 py-3 text-lg font-medium border-2 focus:ring-2"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {discountType === 'percentage' ? 'Range: 0% - 100%' : `Range: ₹0 - ${formatCurrency(Math.max(subtotal, 1))}`}
            </span>
            <span className="font-medium text-gray-800">
              Current: {discountType === 'percentage' ? `${discountValue}%` : formatCurrency(discountValue)}
            </span>
          </div>
        </div>

        {/* Live Calculation Preview */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">Live Preview</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-lg">{formatCurrency(subtotal || 0)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-red-600 bg-red-50 px-3 py-2 rounded">
                <span className="font-medium">Discount:</span>
                <span className="font-bold text-lg">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-bold text-lg">
                <span className="text-gray-800">After Discount:</span>
                <span className="text-green-600">{formatCurrency(finalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Percentage Options */}
      {discountType === 'percentage' && (
        <div className="space-y-3">
          <p className="text-lg font-semibold text-gray-800">⚡ Quick Discount Options:</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[5, 10, 15, 20, 25, 30].map((percent) => (
              <button
                key={percent}
                type="button"
                onClick={() => onDiscountValueChange(percent)}
                className={`px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${
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
              🗑️ Clear Discount
            </button>
          </div>
        </div>
      )}

      {/* Current Discount Display */}
      {discountAmount > 0 && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-green-800">
                  ✅ Discount Applied: {discountType === 'percentage' ? `${discountValue}%` : formatCurrency(discountValue)}
                </span>
                <p className="text-sm text-green-700">Order total will be reduced</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="success" className="text-lg px-4 py-2">
                💰 Saves {formatCurrency(discountAmount)}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}