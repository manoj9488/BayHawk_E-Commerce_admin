import { Badge } from '../../ui';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Building, 
  FileText, 
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  User,
  Calendar
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';
import type { PaymentRecord } from '../../../types';

interface PaymentHistoryProps {
  paymentRecords: PaymentRecord[];
  className?: string;
}

const paymentMethodIcons = {
  cash: Banknote,
  card: CreditCard,
  upi: Smartphone,
  bank_transfer: Building,
  cheque: FileText,
  online: CreditCard,
};

const paymentMethodColors = {
  cash: 'green',
  card: 'blue',
  upi: 'purple',
  bank_transfer: 'indigo',
  cheque: 'gray',
  online: 'blue',
};

const statusIcons = {
  confirmed: CheckCircle,
  pending_verification: Clock,
  failed: XCircle,
  refunded: RotateCcw,
};

const statusColors = {
  confirmed: 'success',
  pending_verification: 'warning',
  failed: 'danger',
  refunded: 'info',
};

export function PaymentHistory({ paymentRecords, className = '' }: PaymentHistoryProps) {
  if (!paymentRecords || paymentRecords.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Records</h3>
        <p className="text-gray-600">No payments have been recorded for this order yet.</p>
      </div>
    );
  }

  const totalPaid = paymentRecords
    .filter(record => record.status === 'confirmed')
    .reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Payment Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900">Total Payments Received</h3>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(totalPaid)}</p>
          </div>
        </div>
      </div>

      {/* Payment Records */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Payment History</h3>
        
        {paymentRecords.map((record, index) => {
          const PaymentIcon = paymentMethodIcons[record.paymentMethod];
          const StatusIcon = statusIcons[record.status];
          const methodColor = paymentMethodColors[record.paymentMethod];
          
          return (
            <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Payment Method Icon */}
                  <div className={`h-10 w-10 rounded-lg bg-${methodColor}-100 flex items-center justify-center`}>
                    <PaymentIcon className={`h-5 w-5 text-${methodColor}-600`} />
                  </div>
                  
                  {/* Payment Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {formatCurrency(record.amount)}
                      </h4>
                      <Badge 
                        variant={statusColors[record.status]}
                        className="flex items-center gap-1"
                      >
                        <StatusIcon className="h-3 w-3" />
                        {record.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="default" className="capitalize">
                        {record.paymentMode}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="flex items-center gap-2">
                          <PaymentIcon className="h-4 w-4" />
                          <span className="capitalize">{record.paymentMethod.replace('_', ' ')}</span>
                        </p>
                        {record.transactionId && (
                          <p className="mt-1">
                            <span className="font-medium">Transaction ID:</span> {record.transactionId}
                          </p>
                        )}
                        {record.referenceNumber && (
                          <p className="mt-1">
                            <span className="font-medium">Reference:</span> {record.referenceNumber}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <p className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Received by: {record.receivedBy}</span>
                        </p>
                        <p className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(record.receivedAt)}</span>
                        </p>
                      </div>
                    </div>
                    
                    {record.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {record.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Record Number */}
                <div className="text-right">
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
