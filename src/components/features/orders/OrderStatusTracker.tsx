import { CheckCircle, Clock, Package, Truck, MapPin } from 'lucide-react';

interface OrderStatusTrackerProps {
  currentStatus: string;
  orderDate: string;
  className?: string;
}

const statusSteps = [
  { key: 'received', label: 'Order Received', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: MapPin }
];

export function OrderStatusTracker({ currentStatus, orderDate, className = '' }: OrderStatusTrackerProps) {
  const getCurrentStepIndex = () => {
    const index = statusSteps.findIndex(step => step.key === currentStatus);
    return index === -1 ? 0 : index;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className={`bg-white rounded-xl p-6 border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>
        <div 
          className="absolute left-6 top-8 w-0.5 bg-blue-600 transition-all duration-500"
          style={{ height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
        ></div>

        {/* Status Steps */}
        <div className="space-y-6">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="relative flex items-center">
                {/* Icon */}
                <div className={`
                  relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                  ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                `}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="ml-4 flex-1">
                  <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-blue-600 font-medium">Current Status</p>
                  )}
                  {index === 0 && (
                    <p className="text-sm text-gray-500">
                      {new Date(orderDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated Delivery */}
      {currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900">Estimated Delivery</p>
          <p className="text-sm text-blue-700">
            {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'short'
            })}
          </p>
        </div>
      )}
    </div>
  );
}