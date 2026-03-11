import { api } from './api';

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: {
    message?: string;
  };
  meta?: {
    pagination?: PaginationMeta;
    filters?: AuditFilters;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuditFilters {
  modules: string[];
  actions: string[];
  actorTypes?: string[];
  moduleScopes?: string[];
}

export interface AuditLogRecord {
  id: string;
  userId?: string | null;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress?: string | null;
  timestamp: string;
  moduleType?: 'hub' | 'store' | string | null;
  hubId?: string | null;
  storeId?: string | null;
}

function unwrapResponse<T>(response: { data?: ApiEnvelope<T> }): { data: T; meta?: ApiEnvelope<T>['meta'] } {
  const payload = response.data;

  if (!payload?.success || payload.data === undefined) {
    throw new Error(payload?.error?.message || 'Request failed');
  }

  return { data: payload.data, meta: payload.meta };
}

export const auditBackend = {
  async listAuditLogs(params?: Record<string, string>) {
    const response = await api.get('/audit/logs', { params });
    const { data, meta } = unwrapResponse<AuditLogRecord[]>(response);
    return {
      items: data,
      pagination: meta?.pagination,
      filters: meta?.filters,
    } as {
      items: AuditLogRecord[];
      pagination?: PaginationMeta;
      filters?: AuditFilters;
    };
  },

  async exportAuditLogs(params?: Record<string, string>) {
    const response = await api.get('/audit/logs/export', {
      params,
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};
