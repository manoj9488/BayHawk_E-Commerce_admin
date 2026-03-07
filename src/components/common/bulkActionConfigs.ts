export const bulkActionConfigs = {
  'update-status': {
    title: 'Update Status',
    fields: [
      {
        id: 'status',
        label: 'New Status',
        type: 'select' as const,
        required: true,
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' }
        ]
      },
      {
        id: 'reason',
        label: 'Reason (Optional)',
        type: 'textarea' as const,
        placeholder: 'Enter reason for status change...'
      }
    ]
  },
  'bulk-edit': {
    title: 'Bulk Edit',
    fields: [
      {
        id: 'category',
        label: 'Category',
        type: 'select' as const,
        options: [
          { value: '', label: 'Keep current' },
          { value: 'electronics', label: 'Electronics' },
          { value: 'clothing', label: 'Clothing' },
          { value: 'books', label: 'Books' }
        ]
      },
      {
        id: 'discount',
        label: 'Discount (%)',
        type: 'number' as const,
        placeholder: '0'
      },
      {
        id: 'notes',
        label: 'Notes',
        type: 'textarea' as const,
        placeholder: 'Add notes for this bulk edit...'
      }
    ]
  },
  'send-notification': {
    title: 'Send Notification',
    fields: [
      {
        id: 'subject',
        label: 'Subject',
        type: 'text' as const,
        required: true,
        placeholder: 'Enter notification subject...'
      },
      {
        id: 'message',
        label: 'Message',
        type: 'textarea' as const,
        required: true,
        placeholder: 'Enter your message...'
      },
      {
        id: 'type',
        label: 'Notification Type',
        type: 'select' as const,
        required: true,
        options: [
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
          { value: 'push', label: 'Push Notification' },
          { value: 'all', label: 'All Methods' }
        ]
      }
    ]
  },
  'archive': {
    title: 'Archive Items',
    fields: [
      {
        id: 'reason',
        label: 'Archive Reason',
        type: 'select' as const,
        required: true,
        options: [
          { value: 'outdated', label: 'Outdated' },
          { value: 'discontinued', label: 'Discontinued' },
          { value: 'seasonal', label: 'Seasonal' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'notes',
        label: 'Additional Notes',
        type: 'textarea' as const,
        placeholder: 'Add any additional notes...'
      }
    ]
  },
  'delete': {
    title: 'Delete Items',
    fields: [
      {
        id: 'confirmation',
        label: 'Type "DELETE" to confirm',
        type: 'text' as const,
        required: true,
        placeholder: 'DELETE'
      }
    ]
  }
};
