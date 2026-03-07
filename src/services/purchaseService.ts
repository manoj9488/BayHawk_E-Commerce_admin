import { api } from '../utils/api';
import type { Purchase, PurchaseFilters } from '../types/purchase';

export const purchaseApi = {
  // Get all purchases with filters
  getPurchases: async (filters?: PurchaseFilters): Promise<Purchase[]> => {
    const params = new URLSearchParams();
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.productId) params.append('productId', filters.productId);

    const response = await api.get(`/purchases?${params.toString()}`);
    return response.data;
  },

  // Get single purchase by ID
  getPurchaseById: async (id: string): Promise<Purchase> => {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  },

  // Create new purchase
  createPurchase: async (purchase: Partial<Purchase>): Promise<Purchase> => {
    const response = await api.post('/purchases', purchase);
    return response.data;
  },

  // Update existing purchase
  updatePurchase: async (id: string, purchase: Partial<Purchase>): Promise<Purchase> => {
    const response = await api.put(`/purchases/${id}`, purchase);
    return response.data;
  },

  // Update product status
  updateProductStatus: async (
    purchaseId: string,
    productId: string,
    status: string,
    remarks: string,
    updatedBy: string
  ): Promise<Purchase> => {
    const response = await api.patch(`/purchases/${purchaseId}/products/${productId}/status`, {
      status,
      remarks,
      updatedBy,
    });
    return response.data;
  },

  // Delete purchase
  deletePurchase: async (id: string): Promise<void> => {
    await api.delete(`/purchases/${id}`);
  },

  // Export purchases
  exportPurchases: async (filters?: PurchaseFilters, format: 'csv' | 'pdf' | 'excel' = 'csv'): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.productId) params.append('productId', filters.productId);
    params.append('format', format);

    const response = await api.get(`/purchases/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
