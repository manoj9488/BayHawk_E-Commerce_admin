import { formatCurrency, formatDateTime } from '../../../utils/helpers';
import { Badge } from '../../ui';
import { 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  CreditCard,
  Banknote,
  Building,
  Wallet,
  Gift,
  Package,
  Calculator,
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import type { RefundRecord } from '../../../types';

interface RefundHistoryProps {
  refundRecords: RefundRecord[];
  className?: string;
}

const refundTypeLabels = {
  full: 'Full Refund',
  partial: 'Partial Refund',
  item_return: 'Item Return',
  cancellation: 'Order Cancellation',
  quality_issue: 'Quality Issue'
};

const refundTypeIcons = {
  full: RotateCcw,
  partial: Calculator,
  item_return: Package,
  cancellation: AlertTriangle,
  quality_issue: AlertCircleIcon
};

const refundMethodLabels = {
  original_payment: 'Original Payment Method',
  cash: 'Cash Refund',
  bank_transfer: 'Bank Transfer',
  wallet_credit: 'Wallet Credit',
  store_credit: 'Store Credit'
};

const refundMethodIcons = {
  original_payment: CreditCard,
  cash: Banknote,
  bank_transfer: Building,
  wallet_credit: Wallet,
  store_credit: Gift
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  processed: CheckCircle,
  completed: CheckCircle,
  rejected: XCircle
};

const statusColors = {
  pending: 'orange',
  approved: 'blue',
  processed: 'green',
  completed: 'green',
  rejected: 'red'
};

export function RefundHistory({ refundRecords, className = '' }: RefundHistoryProps) {
  if (!refundRecords || refundRecords.length === 0) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <RotateCcw className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No refund records found</p>
      </div>
    );
  }

  const totalRefunded = refundRecords.reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center">
            <RotateCcw className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Refund History</h3>
            <p className="text-sm text-gray-600">
              {refundRecords.length} refund{refundRecords.length !== 1 ? 's' : ''} • Total: {formatCurrency(totalRefunded)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {refundRecords.map((record) => {
          const TypeIcon = refundTypeIcons[record.refundType];
          const MethodIcon = refundMethodIcons[record.refundMethod];
          const StatusIcon = statusIcons[record.status];
          const statusColor = statusColors[record.status];

          return (
            <div key={record.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <TypeIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        {refundTypeLabels[record.refundType]}
                      </h4>
                      <Badge variant={statusColor} className="text-xs px-2 py-0.5 flex items-center">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{record.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">
                    -{formatCurrency(record.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(record.processedAt)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <MethodIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {refundMethodLabels[record.refundMethod]}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Processed by:</span> {record.processedBy}
                </div>
                {record.transactionId && (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Transaction ID:</span> {record.transactionId}
                  </div>
                )}
                {record.referenceNumber && (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Reference:</span> {record.referenceNumber}
                  </div>
                )}
              </div>

              {/* Item-wise refund details */}
              {record.itemsRefunded && record.itemsRefunded.length > 0 && (
                <div className="bg-white rounded-lg p-3 mb-3">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-600" />
                    Refunded Items
                  </h5>
                  <div className="space-y-2">
                    {record.itemsRefunded.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium text-gray-900">{item.productName}</span>
                          <span className="text-gray-600 ml-2">({item.variant})</span>
                          <span className="text-gray-600 ml-2">× {item.quantity}</span>
                        </div>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(item.refundAmount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional notes */}
              {record.notes && (
                <div className="bg-white rounded-lg p-3">
                  <h5 className="font-medium text-gray-900 mb-1">Notes</h5>
                  <p className="text-sm text-gray-700">{record.notes}</p>
                </div>
              )}

              {/* Approval details */}
              {record.approvedBy && record.approvedAt && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>
                      Approved by <span className="font-medium">{record.approvedBy}</span> on{' '}
                      {formatDateTime(record.approvedAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
