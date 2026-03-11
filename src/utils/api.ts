import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  login: (data: { email: string; password: string; loginType: string; locationId?: string; role?: string }) =>
    api.post('/auth/admin/login', data),
  logout: (refreshToken?: string) => api.post('/auth/logout', { refreshToken }),
  refreshToken: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  me: () => api.get('/auth/me'),
};

// Orders APIs
export const ordersApi = {
  getAll: (params?: Record<string, string>) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: unknown) => api.post('/orders', data),
  update: (id: string, data: unknown) => api.patch(`/orders/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
  cancel: (id: string, reason: string) => api.post(`/orders/${id}/cancel`, { reason }),
  assignDelivery: (id: string, agentId: string) => api.post(`/orders/${id}/assign`, { agentId }),
  listManual: (params?: Record<string, string>) => api.get('/orders/manual', { params }),
  getManualById: (id: string) => api.get(`/orders/manual/${id}`),
  createManual: (data: unknown) => api.post('/orders/manual', data),
  listPreorders: (params?: Record<string, string>) => api.get('/orders/pre-orders', { params }),
  getPreorderById: (id: string) => api.get(`/orders/pre-orders/${id}`),
  createPreorder: (data: unknown) => api.post('/orders/pre-orders', data),
  updatePreorderStatus: (id: string, data: { status: string; comment?: string; adminId?: string }) =>
    api.patch(`/orders/pre-orders/${id}/status`, data),
  convertPreorder: (id: string, data?: unknown) => api.post(`/orders/pre-orders/${id}/convert`, data || {}),
};

// Products APIs
export const productsApi = {
  getAll: (params?: Record<string, string>) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: unknown) => api.post('/products', data),
  update: (id: string, data: unknown) => api.patch(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  bulkUpdate: (data: { ids: string[]; action: 'activate' | 'deactivate' | 'archive' | 'delete' }) =>
    api.patch('/products/bulk', data),
};

export const recipesApi = {
  getAll: (params?: Record<string, string>) => api.get('/recipes', { params }),
  getById: (id: string, params?: Record<string, string>) => api.get(`/recipes/${id}`, { params }),
  create: (data: unknown) => api.post('/recipes', data),
  update: (id: string, data: unknown) => api.patch(`/recipes/${id}`, data),
  delete: (id: string) => api.delete(`/recipes/${id}`),
  react: (id: string, data: { customerId: string; reaction: 'like' | 'dislike' }) =>
    api.post(`/recipes/${id}/reaction`, data),
  createPost: (id: string, data: unknown) => api.post(`/recipes/${id}/posts`, data),
};

export const productApprovalApi = {
  getAll: (params?: Record<string, string>) => api.get('/product-approvals', { params }),
  getById: (id: string) => api.get(`/product-approvals/${id}`),
  decide: (
    id: string,
    data: {
      action: 'approve' | 'reject';
      decisionBy: { userId: string; name: string; role: string };
      notes?: string;
      rejectionReason?: string;
    }
  ) => api.patch(`/product-approvals/${id}/decision`, data),
  bulkDecide: (
    data: {
      ids: string[];
      action: 'approve' | 'reject';
      decisionBy: { userId: string; name: string; role: string };
      notes?: string;
      rejectionReason?: string;
    }
  ) => api.patch('/product-approvals/bulk', data),
};

// Product Reviews APIs
export const productReviewsApi = {
  getAll: (params?: Record<string, string>) => api.get('/reviews', { params }),
  moderate: (
    reviewId: string,
    data: { status: 'approved' | 'rejected'; adminId?: string; adminResponse?: string }
  ) => api.patch(`/reviews/${reviewId}/moderation`, data),
  respond: (reviewId: string, data: { adminResponse: string; adminId?: string }) =>
    api.patch(`/reviews/${reviewId}/response`, data),
};

// Team APIs
export const teamApi = {
  getAll: (params?: Record<string, string>) => api.get('/team', { params }),
  create: (data: unknown) => api.post('/team', data),
  update: (id: string, data: unknown) => api.patch(`/team/${id}`, data),
  delete: (id: string) => api.delete(`/team/${id}`),
};

// Customers APIs
export const customersApi = {
  getAll: (params?: Record<string, string>) => api.get('/customers', { params }),
  getById: (id: string) => api.get(`/customers/${id}`),
  update: (id: string, data: unknown) => api.patch(`/customers/${id}`, data),
  getAddresses: (customerId: string) => api.get(`/customers/${customerId}/addresses`),
  createAddress: (customerId: string, data: unknown) => api.post(`/customers/${customerId}/addresses`, data),
  updateAddress: (customerId: string, addressId: string, data: unknown) =>
    api.patch(`/customers/${customerId}/addresses/${addressId}`, data),
  setDefaultAddress: (customerId: string, addressId: string) =>
    api.post(`/customers/${customerId}/addresses/${addressId}/default`, {}),
  deleteAddress: (customerId: string, addressId: string) =>
    api.delete(`/customers/${customerId}/addresses/${addressId}`),
};

// Delivery Agents APIs
export const deliveryApi = {
  getAll: () => api.get('/delivery-agents'),
  create: (data: unknown) => api.post('/delivery-agents', data),
  update: (id: string, data: unknown) => api.patch(`/delivery-agents/${id}`, data),
};

// Inventory & Procurement APIs
export const inventoryApi = {
  listStockBatches: (params?: Record<string, string>) => api.get('/stock/batches', { params }),
  getStockBatchById: (batchId: string) => api.get(`/stock/batches/${batchId}`),
  createStockBatch: (data: unknown) => api.post('/stock/batches', data),
  updateStockBatch: (batchId: string, data: unknown) => api.patch(`/stock/batches/${batchId}`, data),
  deleteStockBatch: (batchId: string) => api.delete(`/stock/batches/${batchId}`),
  approveStockBatch: (batchId: string, data?: { adminId?: string; note?: string }) =>
    api.post(`/stock/batches/${batchId}/approve`, data || {}),
  rejectStockBatch: (batchId: string, data: { note: string; adminId?: string }) =>
    api.post(`/stock/batches/${batchId}/reject`, data),
  bulkUpdateStockBatches: (data: unknown) => api.post('/stock/batches/bulk', data),
  getStockBatchHistory: (batchId: string) => api.get(`/stock/batches/${batchId}/history`),
  listInventoryLedger: (params?: Record<string, string>) => api.get('/inventory/ledger', { params }),
  createInventoryAdjustment: (data: unknown) => api.post('/inventory/adjustments', data),
  listProcurementPurchases: (params?: Record<string, string>) => api.get('/procurement/purchases', { params }),
  getProcurementPurchaseById: (purchaseId: string) => api.get(`/procurement/purchases/${purchaseId}`),
  createProcurementPurchase: (data: unknown) => api.post('/procurement/purchases', data),
  updateProcurementPurchaseStatus: (purchaseId: string, data: unknown) =>
    api.post(`/procurement/purchases/${purchaseId}/status`, data),
  listCuttingEntries: (params?: Record<string, string>) => api.get('/cutting/entries', { params }),
  updateCuttingStatus: (orderId: string, data: unknown) => api.post(`/orders/${orderId}/cutting-status`, data),
};

// Packing/Dispatch/Tracking Ops APIs
export const opsApi = {
  listPackingEntries: (params?: Record<string, string>) => api.get('/packing/entries', { params }),
  startPacking: (orderId: string, data?: unknown) => api.post(`/orders/${orderId}/packing/start`, data || {}),
  completePacking: (orderId: string, data?: unknown) => api.post(`/orders/${orderId}/packing/complete`, data || {}),
  listDispatchEntries: (params?: Record<string, string>) => api.get('/dispatch/entries', { params }),
  dispatchOrder: (orderId: string, data?: unknown) => api.post(`/orders/${orderId}/dispatch`, data || {}),
  listDeliveryEntries: (params?: Record<string, string>) => api.get('/delivery/entries', { params }),
  getDeliveryEntry: (deliveryEntryId: string) => api.get(`/delivery/entries/${deliveryEntryId}`),
  listDeliveryAgentEntries: (deliveryAgentId: string) =>
    api.get(`/delivery-agents/${deliveryAgentId}/entries`),
  assignDeliveryEntry: (deliveryEntryId: string, data?: unknown) =>
    api.post(`/delivery/entries/${deliveryEntryId}/assign`, data || {}),
  updateDeliveryEntryStatus: (deliveryEntryId: string, data?: unknown) =>
    api.post(`/delivery/entries/${deliveryEntryId}/status`, data || {}),
  overrideDeliveryEntryStatus: (deliveryEntryId: string, data?: unknown) =>
    api.post(`/delivery/entries/${deliveryEntryId}/override`, data || {}),
  updateDeliveryStatus: (orderId: string, data?: unknown) => api.post(`/orders/${orderId}/delivery-status`, data || {}),
};

// Reports APIs
export const reportsApi = {
  getSales: (params: { from: string; to: string }) => api.get('/reports/sales', { params }),
  getStock: () => api.get('/reports/stock'),
  getDelivery: (params: { from: string; to: string }) => api.get('/reports/delivery', { params }),
  getPacking: (params?: Record<string, string>) => api.get('/reports/packing', { params }),
  getCustomer: (params?: Record<string, string>) => api.get('/reports/customer', { params }),
  getTax: (params?: Record<string, string>) => api.get('/reports/tax', { params }),
  getDemand: (params?: Record<string, string>) => api.get('/reports/demand', { params }),
  getTrend: (params?: Record<string, string>) => api.get('/reports/trend', { params }),
  getProcurement: (params?: Record<string, string>) => api.get('/reports/procurement', { params }),
  refresh: (reportType: string, params?: Record<string, string>) =>
    api.post(`/reports/${reportType}/refresh`, params || {}),
  export: (type: string, params: Record<string, string>) =>
    api.get(`/reports/${type}/export`, { params, responseType: 'blob' }),
};

export const walletApi = {
  listTransactions: (params?: Record<string, string>) => api.get('/wallet/transactions', { params }),
  addCredit: (data: {
    customerId: string;
    amount: number;
    reason?: string;
    description?: string;
    orderId?: string;
    paymentId?: string;
    adminId?: string;
    inAppCurrencyId?: string;
  }) => api.post('/wallet/credit', data),
  refund: (data: {
    orderId?: string;
    paymentId?: string;
    amount: number;
    reason?: string;
    adminId?: string;
    inAppCurrencyId?: string;
  }) => api.post('/wallet/refund', data),
};

// Marketing APIs
export const marketingApi = {
  getCoupons: () => api.get('/coupons'),
  createCoupon: (data: unknown) => api.post('/coupons', data),
  updateCoupon: (id: string, data: unknown) => api.patch(`/coupons/${id}`, data),
  deleteCoupon: (id: string) => api.delete(`/coupons/${id}`),
  sendNotification: (data: unknown) => api.post('/notifications/send', data),
};

export const campaignsApi = {
  getFlashSales: (params?: Record<string, string>) => api.get('/flash-sales', { params }),
  getFlashSaleById: (id: string) => api.get(`/flash-sales/${id}`),
  createFlashSale: (data: unknown) => api.post('/flash-sales', data),
  updateFlashSale: (id: string, data: unknown) => api.patch(`/flash-sales/${id}`, data),
  getSpinCampaigns: (params?: Record<string, string>) => api.get('/spin-wheel-campaigns', { params }),
  getSpinCampaignById: (id: string) => api.get(`/spin-wheel-campaigns/${id}`),
  createSpinCampaign: (data: unknown) => api.post('/spin-wheel-campaigns', data),
  updateSpinCampaign: (id: string, data: unknown) => api.patch(`/spin-wheel-campaigns/${id}`, data),
  getScratchCampaigns: (params?: Record<string, string>) => api.get('/scratch-card-campaigns', { params }),
  getScratchCampaignById: (id: string) => api.get(`/scratch-card-campaigns/${id}`),
  createScratchCampaign: (data: unknown) => api.post('/scratch-card-campaigns', data),
  updateScratchCampaign: (id: string, data: unknown) => api.patch(`/scratch-card-campaigns/${id}`, data),
  evaluateScratchCampaigns: (data: unknown) => api.post('/scratch-card-campaigns/evaluate', data),
  getOfferNotifications: (params?: Record<string, string>) => api.get('/offer-notifications', { params }),
  getOfferNotificationById: (id: string) => api.get(`/offer-notifications/${id}`),
  createOfferNotification: (data: unknown) => api.post('/offer-notifications', data),
  updateOfferNotification: (id: string, data: unknown) => api.patch(`/offer-notifications/${id}`, data),
  sendOfferNotification: (id: string, data?: unknown) =>
    api.post(`/offer-notifications/${id}/send`, data || {}),
  getOfferNotificationLogs: (id: string, params?: Record<string, string>) =>
    api.get(`/offer-notifications/${id}/delivery-logs`, { params }),
};

// Referral APIs
export const referralsApi = {
  getPrograms: (params?: Record<string, string>) => api.get('/referrals/programs', { params }),
  createProgram: (data: unknown) => api.post('/referrals/programs', data),
  updateProgram: (programId: string, data: unknown) =>
    api.patch(`/referrals/programs/${programId}`, data),
};

// In-App Currency APIs
export const inAppCurrenciesApi = {
  getAll: (params?: Record<string, string>) => api.get('/in-app-currencies', { params }),
  create: (data: unknown) => api.post('/in-app-currencies', data),
  update: (currencyId: string, data: unknown) => api.patch(`/in-app-currencies/${currencyId}`, data),
};

// Membership APIs
export const membershipPlansApi = {
  getAll: (params?: Record<string, string>) => api.get('/membership-plans', { params }),
  create: (data: unknown) => api.post('/membership-plans', data),
  update: (planId: string, data: unknown) => api.patch(`/membership-plans/${planId}`, data),
  getCustomerMembership: (customerId: string) => api.get(`/customers/${customerId}/membership`),
};

// Categories APIs
export const categoriesApi = {
  getAll: (params?: Record<string, string>) => api.get('/categories', { params }),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: unknown) => api.post('/categories', data),
  update: (id: string, data: unknown) => api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
  reorder: (data: { categoryIds: string[] }) => api.post('/categories/reorder', data),
  bulkUpdate: (data: { ids: string[]; updates: unknown }) => api.patch('/categories/bulk', data),
};

export const cuttingTypesApi = {
  getAll: (params?: Record<string, string>) => api.get('/cutting-types', { params }),
  getById: (id: string) => api.get(`/cutting-types/${id}`),
  create: (data: unknown) => api.post('/cutting-types', data),
  update: (id: string, data: unknown) => api.patch(`/cutting-types/${id}`, data),
  delete: (id: string) => api.delete(`/cutting-types/${id}`),
  bulkUpdate: (data: { ids: string[]; updates: unknown }) =>
    api.patch('/cutting-types/bulk', data),
};

// Zones APIs
export const zonesApi = {
  getAll: () => api.get('/zones'),
  create: (data: unknown) => api.post('/zones', data),
  update: (id: string, data: unknown) => api.patch(`/zones/${id}`, data),
  delete: (id: string) => api.delete(`/zones/${id}`),
};

// Hubs APIs
export const hubsApi = {
  getAll: (params?: Record<string, string>) => api.get('/hubs', { params }),
  getById: (id: string) => api.get(`/hubs/${id}`),
  create: (data: unknown) => api.post('/hubs', data),
  update: (id: string, data: unknown) => api.patch(`/hubs/${id}`, data),
  delete: (id: string) => api.delete(`/hubs/${id}`),
};

// Stores APIs
export const storesApi = {
  getAll: (params?: Record<string, string>) => api.get('/stores', { params }),
  getById: (id: string) => api.get(`/stores/${id}`),
  create: (data: unknown) => api.post('/stores', data),
  update: (id: string, data: unknown) => api.patch(`/stores/${id}`, data),
  delete: (id: string) => api.delete(`/stores/${id}`),
};

// Wallet APIs
export const walletApi = {
  getTransactions: (params?: Record<string, string>) => api.get('/wallet/transactions', { params }),
  addCredit: (data: { customerId: string; amount: number; reason: string }) =>
    api.post('/wallet/credit', data),
  processRefund: (orderId: string, amount: number) =>
    api.post('/wallet/refund', { orderId, amount }),
};

// Dashboard APIs
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentOrders: () => api.get('/dashboard/recent-orders'),
  getLowStock: () => api.get('/dashboard/low-stock'),
  getSalesChart: (days: number) => api.get(`/dashboard/sales-chart?days=${days}`),
};

// File Upload
export const uploadApi = {
  uploadImage: (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadMultiple: (files: File[], folder: string) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('folder', folder);
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (url: string) => api.delete('/upload/image', { data: { url } }),
};
