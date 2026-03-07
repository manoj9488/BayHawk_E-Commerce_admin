import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
  login: (data: { email: string; password: string; loginType: string; locationId?: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
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
};

// Products APIs
export const productsApi = {
  getAll: (params?: Record<string, string>) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: unknown) => api.post('/products', data),
  update: (id: string, data: unknown) => api.patch(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  updateStock: (id: string, variantId: string, stock: number) =>
    api.patch(`/products/${id}/variants/${variantId}/stock`, { stock }),
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
};

// Delivery Agents APIs
export const deliveryApi = {
  getAll: () => api.get('/delivery-agents'),
  create: (data: unknown) => api.post('/delivery-agents', data),
  update: (id: string, data: unknown) => api.patch(`/delivery-agents/${id}`, data),
};

// Reports APIs
export const reportsApi = {
  getSales: (params: { from: string; to: string }) => api.get('/reports/sales', { params }),
  getStock: () => api.get('/reports/stock'),
  getDelivery: (params: { from: string; to: string }) => api.get('/reports/delivery', { params }),
  export: (type: string, params: Record<string, string>) =>
    api.get(`/reports/${type}/export`, { params, responseType: 'blob' }),
};

// Marketing APIs
export const marketingApi = {
  getCoupons: () => api.get('/coupons'),
  createCoupon: (data: unknown) => api.post('/coupons', data),
  updateCoupon: (id: string, data: unknown) => api.patch(`/coupons/${id}`, data),
  deleteCoupon: (id: string) => api.delete(`/coupons/${id}`),
  sendNotification: (data: unknown) => api.post('/notifications/send', data),
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

// Zones APIs
export const zonesApi = {
  getAll: () => api.get('/zones'),
  create: (data: unknown) => api.post('/zones', data),
  update: (id: string, data: unknown) => api.patch(`/zones/${id}`, data),
  delete: (id: string) => api.delete(`/zones/${id}`),
};

// Stores APIs
export const storesApi = {
  getAll: () => api.get('/stores'),
  create: (data: unknown) => api.post('/stores', data),
  update: (id: string, data: unknown) => api.patch(`/stores/${id}`, data),
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
