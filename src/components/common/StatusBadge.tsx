import { Badge } from '../ui';

interface StatusConfig {
  [key: string]: {
    variant: string;
    label?: string;
  };
}

interface StatusBadgeProps {
  status: string;
  config?: StatusConfig;
  className?: string;
}

const defaultStatusConfig: StatusConfig = {
  // Order statuses
  received: { variant: 'bg-blue-100 text-blue-700', label: 'Received' },
  processing: { variant: 'bg-yellow-100 text-yellow-700', label: 'Processing' },
  packed: { variant: 'bg-purple-100 text-purple-700', label: 'Packed' },
  out_for_delivery: { variant: 'bg-orange-100 text-orange-700', label: 'Out for Delivery' },
  delivered: { variant: 'bg-green-100 text-green-700', label: 'Delivered' },
  cancelled: { variant: 'bg-red-100 text-red-700', label: 'Cancelled' },
  
  // Payment statuses
  pending: { variant: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
  paid: { variant: 'bg-green-100 text-green-700', label: 'Paid' },
  failed: { variant: 'bg-red-100 text-red-700', label: 'Failed' },
  
  // General statuses
  active: { variant: 'bg-green-100 text-green-700', label: 'Active' },
  inactive: { variant: 'bg-gray-100 text-gray-700', label: 'Inactive' },
  approved: { variant: 'bg-green-100 text-green-700', label: 'Approved' },
  rejected: { variant: 'bg-red-100 text-red-700', label: 'Rejected' },
  draft: { variant: 'bg-gray-100 text-gray-700', label: 'Draft' },
  published: { variant: 'bg-green-100 text-green-700', label: 'Published' },
  
  // Stock levels
  in_stock: { variant: 'bg-green-100 text-green-700', label: 'In Stock' },
  low_stock: { variant: 'bg-yellow-100 text-yellow-700', label: 'Low Stock' },
  out_of_stock: { variant: 'bg-red-100 text-red-700', label: 'Out of Stock' },
};

export function StatusBadge({ status, config = defaultStatusConfig, className = '' }: StatusBadgeProps) {
  const statusConfig = config[status] || { variant: 'bg-gray-100 text-gray-700', label: status };
  const displayLabel = statusConfig.label || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <Badge variant={statusConfig.variant} className={className}>
      {displayLabel}
    </Badge>
  );
}