// Sales Report Data
export const salesData = {
  super_admin: {
    metrics: [
      { title: 'Total Revenue', value: '₹1,24,500', change: '+12% from yesterday', changeType: 'positive' as const },
      { title: 'Total Orders', value: '156', change: '+8% from yesterday', changeType: 'positive' as const },
      { title: 'Avg Order Value', value: '₹798', change: '+3% from yesterday', changeType: 'positive' as const },
      { title: 'Conversion Rate', value: '4.2%', change: '-0.5% from yesterday', changeType: 'negative' as const },
    ],
    topProducts: [
      { name: 'Fresh Salmon', sales: '₹45,200', orders: 89, growth: '+15%' },
      { name: 'Tiger Prawns', sales: '₹38,900', orders: 67, growth: '+12%' },
      { name: 'Sea Bass', sales: '₹32,100', orders: 54, growth: '+8%' },
      { name: 'Lobster', sales: '₹28,700', orders: 23, growth: '+22%' },
    ]
  },
  hub: {
    metrics: [
      { title: 'Hub Revenue', value: '₹68,200', change: '+15% from yesterday', changeType: 'positive' as const },
      { title: 'Hub Orders', value: '89', change: '+12% from yesterday', changeType: 'positive' as const },
      { title: 'Avg Order Value', value: '₹766', change: '+5% from yesterday', changeType: 'positive' as const },
      { title: 'Hub Conversion', value: '4.8%', change: '+0.3% from yesterday', changeType: 'positive' as const },
    ],
    topProducts: [
      { name: 'Fresh Salmon', sales: '₹28,400', orders: 52, growth: '+18%' },
      { name: 'Tiger Prawns', sales: '₹22,100', orders: 38, growth: '+14%' },
      { name: 'Sea Bass', sales: '₹17,700', orders: 28, growth: '+10%' },
    ]
  },
  store: {
    metrics: [
      { title: 'Store Revenue', value: '₹56,300', change: '+9% from yesterday', changeType: 'positive' as const },
      { title: 'Store Orders', value: '67', change: '+5% from yesterday', changeType: 'positive' as const },
      { title: 'Avg Order Value', value: '₹840', change: '+2% from yesterday', changeType: 'positive' as const },
      { title: 'Store Conversion', value: '3.6%', change: '-0.8% from yesterday', changeType: 'negative' as const },
    ],
    topProducts: [
      { name: 'Fresh Salmon', sales: '₹16,800', orders: 37, growth: '+12%' },
      { name: 'Tiger Prawns', sales: '₹16,800', orders: 29, growth: '+10%' },
      { name: 'Lobster', sales: '₹14,500', orders: 15, growth: '+25%' },
    ]
  }
};

// Packing Report Data
export const packingData = {
  super_admin: {
    metrics: [
      { title: 'Items Packed', value: '1,247', change: '+18% from yesterday', changeType: 'positive' as const },
      { title: 'Avg Pack Time', value: '4.2m', change: '-0.8m from yesterday', changeType: 'positive' as const },
      { title: 'Active Packers', value: '12', change: '2 on break', changeType: 'neutral' as const },
      { title: 'Completion Rate', value: '98.5%', change: '+1.2% from yesterday', changeType: 'positive' as const },
    ]
  },
  hub: {
    metrics: [
      { title: 'Hub Items Packed', value: '687', change: '+22% from yesterday', changeType: 'positive' as const },
      { title: 'Hub Pack Time', value: '3.8m', change: '-1.2m from yesterday', changeType: 'positive' as const },
      { title: 'Hub Packers', value: '7', change: '1 on break', changeType: 'neutral' as const },
      { title: 'Hub Completion', value: '99.2%', change: '+0.8% from yesterday', changeType: 'positive' as const },
    ]
  },
  store: {
    metrics: [
      { title: 'Store Items Packed', value: '560', change: '+14% from yesterday', changeType: 'positive' as const },
      { title: 'Store Pack Time', value: '4.6m', change: '-0.4m from yesterday', changeType: 'positive' as const },
      { title: 'Store Packers', value: '5', change: '1 on break', changeType: 'neutral' as const },
      { title: 'Store Completion', value: '97.8%', change: '+1.6% from yesterday', changeType: 'positive' as const },
    ]
  }
};

// Delivery Report Data
export const deliveryData = {
  super_admin: {
    metrics: [
      { title: 'Total Deliveries', value: '142', change: '+8% from yesterday', changeType: 'positive' as const },
      { title: 'On-Time Rate', value: '94.2%', change: '+2.1% from yesterday', changeType: 'positive' as const },
      { title: 'Avg Delivery Time', value: '28m', change: '-3m from yesterday', changeType: 'positive' as const },
      { title: 'Failed Deliveries', value: '8', change: '+2 from yesterday', changeType: 'negative' as const },
    ]
  },
  hub: {
    metrics: [
      { title: 'Hub Deliveries', value: '89', change: '+12% from yesterday', changeType: 'positive' as const },
      { title: 'Hub On-Time Rate', value: '96.1%', change: '+1.8% from yesterday', changeType: 'positive' as const },
      { title: 'Hub Delivery Time', value: '25m', change: '-4m from yesterday', changeType: 'positive' as const },
      { title: 'Hub Failed', value: '3', change: '+1 from yesterday', changeType: 'negative' as const },
    ]
  },
  store: {
    metrics: [
      { title: 'Store Deliveries', value: '53', change: '+3% from yesterday', changeType: 'positive' as const },
      { title: 'Store On-Time Rate', value: '91.5%', change: '+2.5% from yesterday', changeType: 'positive' as const },
      { title: 'Store Delivery Time', value: '32m', change: '-2m from yesterday', changeType: 'positive' as const },
      { title: 'Store Failed', value: '5', change: '+1 from yesterday', changeType: 'negative' as const },
    ]
  }
};

// Stock Report Data
export const stockData = {
  super_admin: {
    metrics: [
      { title: 'Total Items', value: '2,847', change: 'Across 156 products', changeType: 'neutral' as const },
      { title: 'Stock Value', value: '₹4.2L', change: '+8% from last week', changeType: 'positive' as const },
      { title: 'Low Stock Items', value: '23', change: 'Needs restocking', changeType: 'negative' as const },
      { title: 'Turnover Rate', value: '12.5x', change: '+0.8x from last month', changeType: 'positive' as const },
    ]
  },
  hub: {
    metrics: [
      { title: 'Hub Stock Items', value: '1,642', change: 'Across 98 products', changeType: 'neutral' as const },
      { title: 'Hub Stock Value', value: '₹2.4L', change: '+12% from last week', changeType: 'positive' as const },
      { title: 'Hub Low Stock', value: '14', change: 'Needs restocking', changeType: 'negative' as const },
      { title: 'Hub Turnover', value: '14.2x', change: '+1.2x from last month', changeType: 'positive' as const },
    ]
  },
  store: {
    metrics: [
      { title: 'Store Stock Items', value: '1,205', change: 'Across 78 products', changeType: 'neutral' as const },
      { title: 'Store Stock Value', value: '₹1.8L', change: '+4% from last week', changeType: 'positive' as const },
      { title: 'Store Low Stock', value: '9', change: 'Needs restocking', changeType: 'negative' as const },
      { title: 'Store Turnover', value: '10.8x', change: '+0.4x from last month', changeType: 'positive' as const },
    ]
  }
};

// Customer Report Data
export const customerData = {
  super_admin: {
    metrics: [
      { title: 'Total Customers', value: '2,847', change: '+12% from last month', changeType: 'positive' as const },
      { title: 'New Customers', value: '23', change: '+18% from yesterday', changeType: 'positive' as const },
      { title: 'Avg Lifetime Value', value: '₹8,450', change: '+5% from last month', changeType: 'positive' as const },
      { title: 'Retention Rate', value: '78.5%', change: '+2.3% from last month', changeType: 'positive' as const },
    ]
  },
  hub: {
    metrics: [
      { title: 'Hub Customers', value: '1,642', change: '+15% from last month', changeType: 'positive' as const },
      { title: 'Hub New Customers', value: '14', change: '+22% from yesterday', changeType: 'positive' as const },
      { title: 'Hub Avg LTV', value: '₹9,200', change: '+8% from last month', changeType: 'positive' as const },
      { title: 'Hub Retention', value: '82.1%', change: '+3.1% from last month', changeType: 'positive' as const },
    ]
  },
  store: {
    metrics: [
      { title: 'Store Customers', value: '1,205', change: '+8% from last month', changeType: 'positive' as const },
      { title: 'Store New Customers', value: '9', change: '+12% from yesterday', changeType: 'positive' as const },
      { title: 'Store Avg LTV', value: '₹7,650', change: '+2% from last month', changeType: 'positive' as const },
      { title: 'Store Retention', value: '74.8%', change: '+1.5% from last month', changeType: 'positive' as const },
    ]
  }
};
