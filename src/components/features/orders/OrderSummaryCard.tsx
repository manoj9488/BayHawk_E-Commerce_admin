import { Crown, Zap, Truck, CreditCard, AlertTriangle } from 'lucide-react';
import { Card, Badge } from '../../ui';
import { formatCurrency } from '../../../utils/helpers';

interface OrderItem {
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  discount?: number;
}

interface OrderSummaryCardProps {
  items: OrderItem[];
  isEliteMember?: boolean;
  deliveryCharges?: number;
  surgeCharges?: number;
  applySurgeCharges?: boolean;
  freeDeliveryThreshold?: number;
}

export function OrderSummaryCard({
  items,
  isEliteMember = false,
  deliveryCharges = 50,
  surgeCharges = 30,
  applySurgeCharges = false,
  freeDeliveryThreshold = 349
}: OrderSummaryCardProps) {
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate elite discount (5% on subtotal)
  const eliteDiscount = isEliteMember ? subtotal * 0.05 : 0;
  
  // Calculate delivery charges
  const finalDeliveryCharges = isEliteMember && subtotal >= freeDeliveryThreshold ? 0 : deliveryCharges;
  
  // Calculate surge charges
  const finalSurgeCharges = applySurgeCharges ? (isEliteMember ? 0 : surgeCharges) : 0;
  
  // Calculate total
  const total = subtotal - eliteDiscount + finalDeliveryCharges + finalSurgeCharges;
  
  // Calculate total savings for elite members
  const totalSavings = eliteDiscount + (deliveryCharges - finalDeliveryCharges) + (applySurgeCharges && isEliteMember ? surgeCharges : 0);

  if (items.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-gray-400 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
            <p className="text-sm text-gray-600">Add items to see order summary</p>
          </div>
        </div>
        <div className="text-center py-8 text-gray-500">
          <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No items added yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
          <p className="text-sm text-gray-600">Review your order details and pricing</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium text-gray-900">Items ({items.length})</h4>
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.productName}</p>
              <p className="text-sm text-gray-600">{item.variantName}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(item.price * item.quantity)}
              </p>
              <p className="text-sm text-gray-600">
                {formatCurrency(item.price)} each
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
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
          <span className="flex items-center gap-1 text-gray-600">
            <Truck className="h-5 w-5" />
            Delivery Charges
            {isEliteMember && subtotal >= freeDeliveryThreshold && (
              <Badge variant="success">FREE</Badge>
            )}
          </span>
          <span className={finalDeliveryCharges === 0 ? 'text-green-600 font-medium' : ''}>
            {finalDeliveryCharges === 0 ? 'FREE' : formatCurrency(finalDeliveryCharges)}
          </span>
        </div>
        
        {applySurgeCharges && (
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-orange-600">
              <Zap className="h-5 w-5" />
              Surge Charges
              {isEliteMember && (
                <Badge variant="success">WAIVED</Badge>
              )}
            </span>
            <span className={isEliteMember ? 'text-green-600 line-through' : 'text-orange-600'}>
              {isEliteMember ? (
                <>
                  <span className="line-through">{formatCurrency(surgeCharges)}</span>
                  <span className="ml-2 no-underline">FREE</span>
                </>
              ) : (
                `+${formatCurrency(finalSurgeCharges)}`
              )}
            </span>
          </div>
        )}
        
        {applySurgeCharges && !isEliteMember && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">Surge Charges Applied</span>
            </div>
            <p className="text-xs text-orange-700 mt-1">
              Additional charges for rain/peak day delivery
            </p>
          </div>
        )}
        
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount</span>
            <span className="text-green-600">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Elite Member Benefits Summary */}
        {isEliteMember && totalSavings > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 mb-2">
              <Crown className="h-5 w-5" />
              <span className="font-semibold">Elite Member Savings</span>
            </div>
            <div className="space-y-1 text-sm text-yellow-700">
              {eliteDiscount > 0 && (
                <div className="flex justify-between">
                  <span>Product Discount (5%)</span>
                  <span>-{formatCurrency(eliteDiscount)}</span>
                </div>
              )}
              {subtotal >= freeDeliveryThreshold && (
                <div className="flex justify-between">
                  <span>Free Delivery</span>
                  <span>-{formatCurrency(deliveryCharges)}</span>
                </div>
              )}
              {applySurgeCharges && (
                <div className="flex justify-between">
                  <span>Surge Charges Waived</span>
                  <span>-{formatCurrency(surgeCharges)}</span>
                </div>
              )}
              <div className="border-t pt-1 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Savings</span>
                  <span className="text-green-600">{formatCurrency(totalSavings)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Free Delivery Progress */}
        {!isEliteMember && subtotal < freeDeliveryThreshold && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Truck className="h-5 w-5" />
              <span className="text-sm font-medium">Free Delivery Available</span>
            </div>
            <p className="text-xs text-blue-700">
              Add {formatCurrency(freeDeliveryThreshold - subtotal)} more to get free delivery
            </p>
            <div className="mt-2 bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((subtotal / freeDeliveryThreshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}