import { useState } from 'react';
import { 
  DataTable, 
  SearchFilter, 
  StatusBadge, 
  ActionButtons,
  BulkActions,
  BulkActionCheckbox,
  BulkActionModal,
  useBulkSelection,
  bulkActionConfigs
} from '../../common';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';
import { Clock, Send, Printer, Download, Package, Scale, Pause, CheckCircle, XCircle, Calendar, Truck } from 'lucide-react';
import type { Order } from '../../../types';

interface OrdersListProps {
  orders: Order[];
  loading?: boolean;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
  onRefresh?: () => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: Record<string, unknown>) => Promise<void>;
}

export function OrdersList({ 
  orders, 
  loading = false, 
  onView, 
  onEdit, 
  onDelete,
  onRefresh,
  onBulkAction
}: OrdersListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [hubStoreFilter, setHubStoreFilter] = useState('');
  const [deliverySlotFilter, setDeliverySlotFilter] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('');
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionId: string;
    actionType: string;
  }>({ isOpen: false, actionId: '', actionType: '' });

  // Helper function to get date range based on filter
  const getDateRange = (filter: string) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    switch (filter) {
      case 'today':
        return { start: startOfDay, end: endOfDay };
      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { 
          start: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          end: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59)
        };
      }
      case 'last7days': {
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        return { start: last7Days, end: endOfDay };
      }
      case 'last30days': {
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return { start: last30Days, end: endOfDay };
      }
      case 'thisMonth':
        return { 
          start: new Date(today.getFullYear(), today.getMonth(), 1),
          end: endOfDay
        };
      case 'lastMonth': {
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
        return { start: lastMonth, end: lastMonthEnd };
      }
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(customEndDate + 'T23:59:59')
          };
        }
        return null;
      default:
        return null;
    }
  };

  // Filter orders by date
  const filterOrdersByDate = (orders: Order[]) => {
    if (dateFilter === 'all') return orders;
    
    const dateRange = getDateRange(dateFilter);
    if (!dateRange) return orders;

    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= dateRange.start && orderDate <= dateRange.end;
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchValue.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesSource = !sourceFilter || order.source === sourceFilter;
    const matchesHubStore = !hubStoreFilter || order.moduleType === hubStoreFilter;
    const matchesDeliverySlot = !deliverySlotFilter || order.deliverySlot === deliverySlotFilter;
    const matchesPaymentMode = !paymentModeFilter || order.paymentMethod === paymentModeFilter;
    
    return matchesSearch && matchesStatus && matchesSource && matchesHubStore && matchesDeliverySlot && matchesPaymentMode;
  });

  // Apply date filter to the already filtered orders
  const dateFilteredOrders = filterOrdersByDate(filteredOrders);

  const {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected
  } = useBulkSelection(dateFilteredOrders);

  // Client-requested bulk actions for orders
  const orderBulkActions = [
    {
      id: 'send-sms',
      label: 'Send SMS',
      icon: Send,
      variant: 'default' as const
    },
    {
      id: 'assign-third-party-delivery',
      label: 'Assign Third-Party Delivery',
      icon: Truck,
      variant: 'default' as const
    },
    {
      id: 'assign-batch-delivery',
      label: 'Assign Batch Delivery',
      icon: Truck,
      variant: 'default' as const
    },
    {
      id: 'print-invoices',
      label: 'Print Invoice',
      icon: Printer,
      variant: 'default' as const
    },
    {
      id: 'download-invoices',
      label: 'Download Invoices',
      icon: Download,
      variant: 'default' as const
    },
    {
      id: 'print-packing-slip',
      label: 'Print Packing Slip',
      icon: Package,
      variant: 'default' as const
    },
    {
      id: 'update-order-weight',
      label: 'Update Order Weight',
      icon: Scale,
      variant: 'default' as const
    },
    {
      id: 'change-status-processing',
      label: 'Change Status to Processing',
      icon: Clock,
      variant: 'default' as const
    },
    {
      id: 'change-status-on-hold',
      label: 'Change Status to on-hold',
      icon: Pause,
      variant: 'warning' as const
    },
    {
      id: 'change-status-completed',
      label: 'Change Status to completed',
      icon: CheckCircle,
      variant: 'success' as const
    },
    {
      id: 'change-status-canceled',
      label: 'Change Status to Canceled',
      icon: XCircle,
      variant: 'danger' as const
    }
  ];

  const handleBulkAction = async (actionId: string, selectedIds: string[]) => {
    // Handle direct document actions
    if (actionId === 'print-invoices') {
      handlePrintInvoices(selectedIds);
      return;
    }

    if (actionId === 'download-invoices') {
      handleDownloadInvoices(selectedIds);
      return;
    }

    if (actionId === 'print-packing-slip') {
      handlePrintPackingSlips(selectedIds);
      return;
    }

    // For actions that require modal input, open modal
    setBulkActionModal({
      isOpen: true,
      actionId,
      actionType: actionId
    });
  };

  const handleBulkActionConfirm = async (data: Record<string, unknown>) => {
    if (onBulkAction) {
      await onBulkAction(bulkActionModal.actionId, selectedItems, data);
      deselectAll();
    }
    setBulkActionModal({ isOpen: false, actionId: '', actionType: '' });
  };

  const handlePrintInvoices = (orderIds: string[]) => {
    const selectedOrders = orders.filter(order => orderIds.includes(order.id));
    alert(`Printing invoices for ${selectedOrders.length} orders...`);
    deselectAll();
  };

  const handleDownloadInvoices = (orderIds: string[]) => {
    const selectedOrders = orders.filter(order => orderIds.includes(order.id));
    alert(`Downloading invoices for ${selectedOrders.length} orders...`);
    deselectAll();
  };

  const handlePrintPackingSlips = (orderIds: string[]) => {
    const selectedOrders = orders.filter(order => orderIds.includes(order.id));
    alert(`Printing packing slips for ${selectedOrders.length} orders...`);
    deselectAll();
  };

  const columns = [
    {
      key: 'select',
      label: '',
      width: '50px',
      render: (_: unknown, order: Order) => (
        <BulkActionCheckbox
          id={order.id}
          checked={isSelected(order.id)}
          onChange={toggleItem}
        />
      )
    },
    {
      key: 'id',
      label: 'Order ID',
      render: (value: unknown) => (
        <span className="font-mono text-sm font-medium">{String(value)}</span>
      )
    },
    {
      key: 'invoiceNumber',
      label: 'Invoice Number',
      render: (value: unknown, order: Order) => (
        <span className="font-mono text-sm font-medium text-blue-600">
          {String(value || `INV-${order.id.slice(-6).toUpperCase()}`)}
        </span>
      )
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value: unknown, order: Order) => (
        <div>
          <p className="font-medium text-gray-900">{String(value)}</p>
          <p className="text-sm text-gray-500">{order.customerPhone}</p>
        </div>
      )
    },
    {
      key: 'source',
      label: 'Source',
      render: (value: unknown) => (
        <span className="capitalize px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
          {String(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={String(value)} />
    },
    {
      key: 'deliverySlot',
      label: 'Delivery Slot',
      render: (value: unknown) => (
        <div className="text-sm">
          <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
            {String(value || 'Not Scheduled')}
          </span>
        </div>
      )
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (value: unknown, order: Order) => (
        <div>
          <span className="font-semibold text-gray-900">{formatCurrency(Number(value) || 0)}</span>
          {order.paymentStatus && (
            <div className="mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 border-green-200' :
                order.paymentStatus === 'partial' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                order.paymentStatus === 'refunded' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700 border-red-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {order.paymentStatus === 'paid' ? 'Paid' :
                 order.paymentStatus === 'partial' ? 'Partial' :
                 order.paymentStatus === 'pending' ? 'Unpaid' :
                 order.paymentStatus === 'refunded' ? 'Refunded' :
                 order.paymentStatus === 'failed' ? 'Failed' : order.paymentStatus}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: unknown) => (
        <span className="text-sm text-gray-600">{formatDateTime(String(value))}</span>
      )
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'received', label: 'Received' },
        { value: 'processing', label: 'Processing' },
        { value: 'packed', label: 'Packed' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    {
      key: 'source',
      label: 'Source',
      value: sourceFilter,
      onChange: setSourceFilter,
      options: [
        { value: 'app', label: 'Mobile App' },
        { value: 'website', label: 'Website' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'facebook', label: 'Facebook' }
      ]
    },
    {
      key: 'date',
      label: 'Date Range',
      value: dateFilter,
      onChange: setDateFilter,
      options: [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'last7days', label: 'Last 7 Days' },
        { value: 'last30days', label: 'Last 30 Days' },
        { value: 'thisMonth', label: 'This Month' },
        { value: 'lastMonth', label: 'Last Month' },
        { value: 'custom', label: 'Custom Range' }
      ]
    },
    {
      key: 'hubStore',
      label: 'Hub/Store',
      value: hubStoreFilter,
      onChange: setHubStoreFilter,
      options: [
        { value: 'hub', label: 'Hub Orders' },
        { value: 'store', label: 'Store Orders' }
      ]
    },
    {
      key: 'deliverySlot',
      label: 'Delivery Slot',
      value: deliverySlotFilter,
      onChange: setDeliverySlotFilter,
      options: [
        { value: '7:00 AM - 9:00 AM', label: '7:00 AM - 9:00 AM' },
        { value: '10:00 AM - 12:00 PM', label: '10:00 AM - 12:00 PM' },
        { value: '2:00 PM - 4:00 PM', label: '2:00 PM - 4:00 PM' },
        { value: '4:00 PM - 6:00 PM', label: '4:00 PM - 6:00 PM' },
        { value: '6:00 PM - 8:00 PM', label: '6:00 PM - 8:00 PM' }
      ]
    },
    {
      key: 'paymentMode',
      label: 'Payment Mode',
      value: paymentModeFilter,
      onChange: setPaymentModeFilter,
      options: [
        { value: 'cod', label: 'Cash on Delivery' },
        { value: 'online', label: 'Online Payment' },
        { value: 'wallet', label: 'Wallet Payment' }
      ]
    }
  ];

  // Get bulk action config for modal
  const getBulkActionConfig = () => {
    const config = bulkActionConfigs[bulkActionModal.actionId as keyof typeof bulkActionConfigs];
    if (config) return config;

    // Custom configurations for client-requested actions
    switch (bulkActionModal.actionId) {
      case 'send-sms':
        return {
          title: 'Send SMS to Customers',
          fields: [
            {
              id: 'message',
              label: 'SMS Message',
              type: 'textarea' as const,
              required: true,
              placeholder: 'Enter your SMS message...'
            },
            {
              id: 'template',
              label: 'Use Template',
              type: 'select' as const,
              options: [
                { value: '', label: 'Custom Message' },
                { value: 'order_confirmed', label: 'Order Confirmed' },
                { value: 'order_packed', label: 'Order Packed' },
                { value: 'out_for_delivery', label: 'Out for Delivery' },
                { value: 'delivered', label: 'Order Delivered' }
              ]
            }
          ]
        };
      case 'update-order-weight':
        return {
          title: 'Update Order Weight',
          fields: [
            {
              id: 'weight',
              label: 'New Weight (kg)',
              type: 'number' as const,
              required: true,
              placeholder: 'Enter weight in kg...'
            },
            {
              id: 'reason',
              label: 'Reason for Weight Update',
              type: 'textarea' as const,
              placeholder: 'Enter reason for weight change...'
            }
          ]
        };
      case 'change-status-processing':
        return {
          title: 'Change Status to Processing',
          fields: [
            {
              id: 'notes',
              label: 'Processing Notes',
              type: 'textarea' as const,
              placeholder: 'Add notes about processing status...'
            }
          ]
        };
      case 'change-status-on-hold':
        return {
          title: 'Change Status to on-hold',
          fields: [
            {
              id: 'reason',
              label: 'Reason for Hold',
              type: 'select' as const,
              required: true,
              options: [
                { value: 'payment_pending', label: 'Payment Pending' },
                { value: 'stock_unavailable', label: 'Stock Unavailable' },
                { value: 'customer_request', label: 'Customer Request' },
                { value: 'quality_issue', label: 'Quality Issue' },
                { value: 'other', label: 'Other' }
              ]
            },
            {
              id: 'notes',
              label: 'Additional Notes',
              type: 'textarea' as const,
              placeholder: 'Add additional details...'
            }
          ]
        };
      case 'change-status-completed':
        return {
          title: 'Change Status to completed',
          fields: [
            {
              id: 'completedBy',
              label: 'Completed By',
              type: 'text' as const,
              placeholder: 'Enter staff name...'
            },
            {
              id: 'notes',
              label: 'Completion Notes',
              type: 'textarea' as const,
              placeholder: 'Add completion notes...'
            }
          ]
        };
      case 'change-status-canceled':
        return {
          title: 'Change Status to Canceled',
          fields: [
            {
              id: 'reason',
              label: 'Cancellation Reason',
              type: 'select' as const,
              required: true,
              options: [
                { value: 'customer_request', label: 'Customer Request' },
                { value: 'payment_failed', label: 'Payment Failed' },
                { value: 'stock_unavailable', label: 'Stock Unavailable' },
                { value: 'quality_issue', label: 'Quality Issue' },
                { value: 'delivery_issue', label: 'Delivery Issue' },
                { value: 'other', label: 'Other' }
              ]
            },
            {
              id: 'refundAmount',
              label: 'Refund Amount',
              type: 'number' as const,
              placeholder: 'Enter refund amount...'
            },
            {
              id: 'notes',
              label: 'Cancellation Notes',
              type: 'textarea' as const,
              placeholder: 'Add cancellation details...'
            }
          ]
        };
      default:
        return { title: 'Bulk Action', fields: [] };
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Actions Bar */}
      <BulkActions
        selectedItems={selectedItems}
        totalItems={dateFilteredOrders.length}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        actions={orderBulkActions}
        onAction={handleBulkAction}
        itemName="orders"
      />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          placeholder="Search orders by ID or customer name..."
          className="flex-1"
        />
        
        <ActionButtons
          onRefresh={onRefresh}
          refreshLabel="Refresh Orders"
        />
      </div>

      {/* Custom Date Range Section */}
      {dateFilter === 'custom' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-orange-800 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Custom Date Range
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-orange-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-orange-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          {customStartDate && customEndDate && (
            <div className="mt-3 p-2 bg-orange-100 rounded border border-orange-300">
              <p className="text-xs text-orange-800">
                <strong>Selected Range:</strong> {new Date(customStartDate).toLocaleDateString()} - {new Date(customEndDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      <DataTable
        data={dateFilteredOrders}
        columns={columns}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        loading={loading}
        emptyMessage="No orders found"
      />

      {/* Bulk Action Modal */}
      <BulkActionModal
        isOpen={bulkActionModal.isOpen}
        onClose={() => setBulkActionModal({ isOpen: false, actionId: '', actionType: '' })}
        title={getBulkActionConfig().title}
        actionType={bulkActionModal.actionType}
        selectedCount={selectedItems.length}
        itemName="orders"
        onConfirm={handleBulkActionConfirm}
        fields={getBulkActionConfig().fields}
      />
    </div>
  );
}
