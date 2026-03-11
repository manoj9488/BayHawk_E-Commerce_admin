import { api } from './api';

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: {
    message?: string;
  };
  meta?: {
    pagination?: PaginationMeta;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataField {
  id: string;
  label: string;
  type: 'text' | 'barcode' | 'qrcode' | 'image' | 'date' | 'number';
  sourceCategory?: string;
}

export interface DataCategory {
  id?: string;
  category: string;
  fields: DataField[];
}

export interface LabelField {
  id: string;
  name: string;
  type: 'text' | 'barcode' | 'qrcode' | 'image' | 'date' | 'number';
  value: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  position: { x: number; y: number };
  width: number;
  height: number;
  isVisible: boolean;
  sourceCategory?: string | null;
}

export interface SlipField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'phone' | 'address' | 'qr' | 'image' | 'barcode';
  required: boolean;
  enabled: boolean;
  position: { x: number; y: number };
  fontSize: number;
  fontWeight: 'normal' | 'bold';
}

export interface SlipConfig {
  deliverySlip: SlipField[];
  packingSlip: SlipField[];
}

export interface BillTemplate {
  id: string;
  name: string;
  includeTaxBreakdown: boolean;
  includePaymentSummary: boolean;
  supportContact?: string | null;
  footerNotes?: string | null;
  isActive: boolean;
}

export interface LabelTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  fields: LabelField[];
  paperSize: string;
  orientation: 'portrait' | 'landscape';
  backgroundImage?: string | null;
  isActive?: boolean;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  slipConfig?: SlipConfig;
  billTemplate?: BillTemplate | null;
}

export interface PrintOrder {
  id: string;
  orderNumber: string;
  date: string;
  customer: string;
  invoiceNumber?: string | null;
  product?: string | null;
  amount: number;
  moduleScope?: string;
  hubId?: string | null;
  storeId?: string | null;
}

export interface PrintJob {
  id: string;
  templateId: string;
  templateName?: string | null;
  status: string;
  printCount: number;
  filters?: Record<string, unknown> | null;
  selectedOrders?: string[] | null;
  scheduledAt?: string | null;
  completedAt?: string | null;
  createdAt?: string | null;
}

export interface LabelingBootstrap {
  templates: LabelTemplate[];
  defaults: {
    template: LabelTemplate;
    slipConfig: SlipConfig;
  };
  dataSources: DataCategory[];
  slipPreview: Record<string, string>;
}

function unwrapResponse<T>(response: { data?: ApiEnvelope<T> }): { data: T; meta?: ApiEnvelope<T>['meta'] } {
  const payload = response.data;

  if (!payload?.success || payload.data === undefined) {
    throw new Error(payload?.error?.message || 'Request failed');
  }

  return { data: payload.data, meta: payload.meta };
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value?: string | null) {
  if (!value) return false;
  return UUID_REGEX.test(value);
}

export const labelingBackend = {
  async getBootstrap() {
    const response = await api.get('/labeling/bootstrap');
    const { data } = unwrapResponse<LabelingBootstrap>(response);
    return data;
  },

  async listTemplates() {
    const response = await api.get('/labeling/templates');
    const { data } = unwrapResponse<LabelTemplate[]>(response);
    return data;
  },

  async saveTemplate(template: LabelTemplate, slipConfig: SlipConfig) {
    const payload = {
      name: template.name,
      paperSize: template.paperSize,
      orientation: template.orientation,
      width: template.width,
      height: template.height,
      backgroundImage: template.backgroundImage ?? null,
      isActive: template.isActive ?? true,
      fields: template.fields,
      slipConfig,
    };

    if (isUuid(template.id)) {
      const response = await api.patch(`/labeling/templates/${template.id}`, payload);
      const { data } = unwrapResponse<LabelTemplate>(response);
      return data;
    }

    const response = await api.post('/labeling/templates', payload);
    const { data } = unwrapResponse<LabelTemplate>(response);
    return data;
  },

  async listPrintOrders(params?: Record<string, string>) {
    const response = await api.get('/labeling/print-orders', { params });
    const { data, meta } = unwrapResponse<PrintOrder[]>(response);
    return { items: data, pagination: meta?.pagination } as {
      items: PrintOrder[];
      pagination?: PaginationMeta;
    };
  },

  async createPrintJob(payload: {
    templateId: string;
    slipType?: string;
    printCount?: number;
    filters?: Record<string, unknown> | null;
    selectedOrders?: string[];
  }) {
    const response = await api.post('/labeling/print-jobs', payload);
    const { data } = unwrapResponse<PrintJob>(response);
    return data;
  },
};
