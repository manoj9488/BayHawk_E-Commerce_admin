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

export interface PaginatedResult<T> {
  items: T[];
  pagination?: PaginationMeta;
}

export interface ContactMessageRecord {
  id: string;
  customerId?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  submittedAt: string;
}

export interface JobOpeningRecord {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  remoteOption?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobApplicationRecord {
  id: string;
  openingId: string;
  opening?: {
    id: string;
    title: string;
    department?: string;
    location?: string;
  } | null;
  customerId?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  resumeUrl: string;
  coverLetter: string;
  status: string;
  submittedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  note?: string | null;
}

export interface ChatbotMessageRecord {
  id: string;
  senderType: string;
  messageText: string;
  guestToken?: string | null;
  customerId?: string | null;
  sentAt: string;
}

export interface NewsletterSubscriptionRecord {
  id: string;
  email: string;
  status: string;
  subscribedAt: string;
  unsubscribedAt?: string | null;
}

function unwrapResponse<T>(response: { data?: ApiEnvelope<T> }): { data: T; meta?: ApiEnvelope<T>['meta'] } {
  const payload = response.data;

  if (!payload?.success || payload.data === undefined) {
    throw new Error(payload?.error?.message || 'Request failed');
  }

  return { data: payload.data, meta: payload.meta };
}

export const supportBackend = {
  async listContactMessages(params?: Record<string, string>) {
    const response = await api.get('/support/contact-messages', { params });
    const { data, meta } = unwrapResponse<ContactMessageRecord[]>(response);
    return { items: data, pagination: meta?.pagination } as PaginatedResult<ContactMessageRecord>;
  },

  async listJobOpenings(params?: Record<string, string>) {
    const response = await api.get('/support/careers/openings', { params });
    const { data, meta } = unwrapResponse<JobOpeningRecord[]>(response);
    return { items: data, pagination: meta?.pagination } as PaginatedResult<JobOpeningRecord>;
  },

  async createJobOpening(payload: Partial<JobOpeningRecord>) {
    const response = await api.post('/support/careers/openings', payload);
    const { data } = unwrapResponse<JobOpeningRecord>(response);
    return data;
  },

  async updateJobOpening(openingId: string, payload: Partial<JobOpeningRecord>) {
    const response = await api.patch(`/support/careers/openings/${openingId}`, payload);
    const { data } = unwrapResponse<JobOpeningRecord>(response);
    return data;
  },

  async listJobApplications(params?: Record<string, string>) {
    const response = await api.get('/support/careers/applications', { params });
    const { data, meta } = unwrapResponse<JobApplicationRecord[]>(response);
    return { items: data, pagination: meta?.pagination } as PaginatedResult<JobApplicationRecord>;
  },

  async updateJobApplication(applicationId: string, payload: { status?: string; note?: string }) {
    const response = await api.patch(`/support/careers/applications/${applicationId}`, payload);
    const { data } = unwrapResponse<JobApplicationRecord>(response);
    return data;
  },

  async listChatbotMessages(params?: Record<string, string>) {
    const response = await api.get('/support/chatbot/messages', { params });
    const { data, meta } = unwrapResponse<ChatbotMessageRecord[]>(response);
    return { items: data, pagination: meta?.pagination } as PaginatedResult<ChatbotMessageRecord>;
  },

  async listNewsletterSubscriptions(params?: Record<string, string>) {
    const response = await api.get('/support/newsletter/subscriptions', { params });
    const { data, meta } = unwrapResponse<NewsletterSubscriptionRecord[]>(response);
    return { items: data, pagination: meta?.pagination } as PaginatedResult<NewsletterSubscriptionRecord>;
  },
};
