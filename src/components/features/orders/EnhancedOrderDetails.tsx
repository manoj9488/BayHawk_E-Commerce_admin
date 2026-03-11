import { useState } from 'react';
import { StatusBadge } from '../../common';
import { Button } from '../../ui';
import { PaymentRecordModal } from './PaymentRecordModal';
import { PaymentHistory } from './PaymentHistory';
import { RefundRecordModal } from './RefundRecordModal';
import { RefundHistory } from './RefundHistory';
import { DeliveryPartnerAssignment } from './DeliveryPartnerAssignment';
import { OrderLocationSwitch } from './OrderLocationSwitch';
import { AddressSelector } from './AddressSelector';
import { PackedPhotoUpload } from './PackedPhotoUpload';
import { SurgeCharges } from './SurgeCharges';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';
import { Printer, Download, MapPin, Tag, Truck, Receipt, CreditCard, Plus, AlertCircle, RotateCcw } from 'lucide-react';
import type { Order } from '../../../types';

interface AddressUpdate {
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface EnhancedOrderDetailsProps {
  order: Order;
  className?: string;
  isEditing?: boolean;
  onPaymentRecord?: (paymentData: Record<string, unknown>) => Promise<void>;
  onRefundRecord?: (refundData: Record<string, unknown>) => Promise<void>;
  onAssignThirdParty?: () => void;
  onAssignDeliveryPartner?: (agentId: string) => Promise<void>;
  onSwitchLocation?: (type: 'hub' | 'store', locationId: string) => Promise<void>;
  onUpdateAddress?: (address: AddressUpdate) => Promise<void>;
  onUploadPackedPhotos?: (photos: File[]) => Promise<void>;
  onUpdateSurgeCharges?: (charges: number, reason: string) => Promise<void>;
}

const mapShippingAddressToSelectorAddress = (
  shippingAddress?: Order['shippingAddress']
): AddressUpdate | undefined => {
  if (!shippingAddress) {
    return undefined;
  }

  return {
    type: 'home',
    line1: shippingAddress.street,
    city: shippingAddress.city,
    state: shippingAddress.state,
    pincode: shippingAddress.zipCode,
  };
};

export function EnhancedOrderDetails({ 
  order, 
  className = '', 
  isEditing = false, 
  onPaymentRecord, 
  onRefundRecord, 
  onAssignThirdParty,
  onAssignDeliveryPartner,
  onSwitchLocation,
  onUpdateAddress,
  onUploadPackedPhotos,
  onUpdateSurgeCharges
}: EnhancedOrderDetailsProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    alert(`Downloading invoice for order ${order.id}...`);
  };

  const handleRecordPayment = async (paymentData: Record<string, unknown>) => {
    if (onPaymentRecord) {
      await onPaymentRecord(paymentData);
    }
  };

  const handleRecordRefund = async (refundData: Record<string, unknown>) => {
    if (onRefundRecord) {
      await onRefundRecord(refundData);
    }
  };

  // Calculate payment status
  const totalAmount = order.totalAmount;
  const paidAmount = order.paidAmount || 0;
  const refundedAmount = order.refundedAmount || 0;
  const netAmount = order.netAmount || (totalAmount - refundedAmount);
  const pendingAmount = totalAmount - paidAmount;
  const isFullyPaid = pendingAmount <= 0;
  const isPartiallyPaid = paidAmount > 0 && pendingAmount > 0;
  const hasRefunds = refundedAmount > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Order Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{order.id}</h2>
          <p className="text-gray-600">
            Placed on {formatDateTime(order.createdAt)}
          </p>
          {order.invoiceNumber && (
            <p className="text-sm text-blue-600 font-medium">
              Invoice: {order.invoiceNumber}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          {!isEditing && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handlePrintInvoice}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Invoice
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* New Features Grid */}
      {isEditing && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Assign Delivery Partner */}
          {onAssignDeliveryPartner && (
            <DeliveryPartnerAssignment
              orderId={order.id}
              currentAgentId={order.deliveryAgentId}
              onAssign={onAssignDeliveryPartner}
            />
          )}

          {/* Switch Hub/Store */}
          {onSwitchLocation && (
            <OrderLocationSwitch
              orderId={order.id}
              currentType={order.moduleType}
              currentLocationId={order.hubId || order.storeId}
              onSwitch={onSwitchLocation}
            />
          )}

          {/* Address Selector */}
          {onUpdateAddress && (
            <AddressSelector
              customerId={order.customerId}
              currentAddress={mapShippingAddressToSelectorAddress(order.shippingAddress)}
              onSelect={onUpdateAddress}
            />
          )}

          {/* Upload Packed Photos */}
          {onUploadPackedPhotos && (
            <PackedPhotoUpload
              orderId={order.id}
              existingPhotos={[]}
              onUpload={onUploadPackedPhotos}
            />
          )}

          {/* Surge Charges */}
          {onUpdateSurgeCharges && (
            <SurgeCharges
              currentCharges={0}
              onUpdate={onUpdateSurgeCharges}
            />
          )}
        </div>
      )}

      {/* Customer Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{order.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{order.customerPhone}</p>
          </div>
          {order.customerEmail && (
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{order.customerEmail}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Order Source</p>
            <p className="font-medium capitalize">{order.source}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Delivery Slot</p>
            <p className="font-medium">{order.deliverySlot}</p>
          </div>
        </div>
      </div>

      {/* Payment Tracking */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
              isFullyPaid ? 'bg-green-600' : isPartiallyPaid ? 'bg-orange-600' : 'bg-red-600'
            }`}>
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Payment Tracking</h3>
              <p className="text-sm text-gray-600">
                {isFullyPaid ? 'Payment completed' : isPartiallyPaid ? 'Partially paid' : 'Payment pending'}
              </p>
            </div>
          </div>
          
          {!isFullyPaid && !isEditing && onPaymentRecord && (
            <Button
              size="sm"
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Record Payment
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Paid Amount</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(paidAmount)}</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Pending Amount</p>
            <p className="text-lg font-bold text-orange-600">{formatCurrency(pendingAmount)}</p>
          </div>
        </div>

        {pendingAmount > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Payment Pending:</span> {formatCurrency(pendingAmount)} remaining to be collected
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Refund Tracking */}
      {(hasRefunds || !isEditing) && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                hasRefunds ? 'bg-red-600' : 'bg-gray-400'
              }`}>
                <RotateCcw className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Refund Tracking</h3>
                <p className="text-sm text-gray-600">
                  {hasRefunds ? `${formatCurrency(refundedAmount)} refunded` : 'No refunds processed'}
                </p>
              </div>
            </div>
            
            {paidAmount > 0 && !isEditing && onRefundRecord && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => setShowRefundModal(true)}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Record Refund
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Original Amount</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Refunded Amount</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(refundedAmount)}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Net Amount</p>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(netAmount)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Refund History */}
      {order.refundRecords && order.refundRecords.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <RefundHistory refundRecords={order.refundRecords} />
        </div>
      )}

      {/* Payment History */}
      {order.paymentRecords && order.paymentRecords.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <PaymentHistory paymentRecords={order.paymentRecords} />
        </div>
      )}

      {/* Billing & Shipping Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            Billing Address
          </h3>
          {order.billingAddress ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-900">{order.billingAddress.street}</p>
              <p className="text-sm text-gray-900">
                {order.billingAddress.city}, {order.billingAddress.state}
              </p>
              <p className="text-sm text-gray-900">
                {order.billingAddress.zipCode}, {order.billingAddress.country}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Same as customer information</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Shipping Address
          </h3>
          {order.shippingAddress ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-900">{order.shippingAddress.street}</p>
              <p className="text-sm text-gray-900">
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p className="text-sm text-gray-900">
                {order.shippingAddress.zipCode}, {order.shippingAddress.country}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Same as billing address</p>
          )}
        </div>
      </div>

      {/* Delivery Instructions */}
      {order.deliveryInstructions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Truck className="h-5 w-5 text-yellow-600" />
            Delivery Instructions
          </h3>
          <p className="text-sm text-gray-700">{order.deliveryInstructions}</p>
        </div>
      )}

      {/* Third-Party Delivery Info */}
      {!isEditing && (
        <div className={order.thirdPartyDelivery ? "bg-blue-50 border border-blue-200 rounded-lg p-4" : "bg-gray-50 border border-gray-200 rounded-lg p-4"}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Truck className={order.thirdPartyDelivery ? "h-5 w-5 text-blue-600" : "h-5 w-5 text-gray-600"} />
              Third-Party Delivery
            </h3>
            {onAssignThirdParty && (
              <Button
                size="sm"
                onClick={onAssignThirdParty}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {order.thirdPartyDelivery ? 'Update' : 'Assign'}
              </Button>
            )}
          </div>
          {order.thirdPartyDelivery ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Service</p>
                <p className="font-medium capitalize">{order.thirdPartyDelivery.service}</p>
              </div>
              <div>
                <p className="text-gray-600">Person Name</p>
                <p className="font-medium">{order.thirdPartyDelivery.personName}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{order.thirdPartyDelivery.personPhone}</p>
              </div>
              {order.thirdPartyDelivery.vehicleNumber && (
                <div>
                  <p className="text-gray-600">Vehicle</p>
                  <p className="font-medium">{order.thirdPartyDelivery.vehicleNumber}</p>
                </div>
              )}
              {order.thirdPartyDelivery.trackingId && (
                <div className="col-span-2">
                  <p className="text-gray-600">Tracking ID</p>
                  <p className="font-medium">{order.thirdPartyDelivery.trackingId}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">Assign delivery to Porter, Rapido, Swiggy, etc.</p>
          )}
        </div>
      )}

      {/* Order Items */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {order.items.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-sm text-gray-600">{item.variant}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No items details available
            </div>
          )}
        </div>
      </div>

      {/* Order Summary with Enhanced Pricing */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-medium">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Module</p>
            <p className="font-medium uppercase text-blue-600">{order.moduleType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-medium uppercase">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Status</p>
            <StatusBadge status={order.paymentStatus} />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-medium">
                {formatCurrency(order.subtotalAmount || order.totalAmount)}
              </span>
            </div>

            {order.promoCode && (
              <div className="flex justify-between items-center text-green-600">
                <span className="text-sm flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Promo Code ({order.promoCode})
                </span>
                <span className="font-medium">
                  -{formatCurrency(order.discountAmount || 0)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Truck className="h-4 w-4" />
                Delivery Charges
              </span>
              <span className="font-medium">
                {order.deliveryCharges ? formatCurrency(order.deliveryCharges) : 'Free'}
              </span>
            </div>

            {order.gstAmount && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">GST (18%)</span>
                <span className="font-medium">{formatCurrency(order.gstAmount)}</span>
              </div>
            )}

            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Final Amount</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPaymentModal && (
        <PaymentRecordModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          order={order}
          onSubmit={handleRecordPayment}
        />
      )}

      {showRefundModal && (
        <RefundRecordModal
          isOpen={showRefundModal}
          onClose={() => setShowRefundModal(false)}
          order={order}
          onSubmit={handleRecordRefund}
        />
      )}
    </div>
  );
}
