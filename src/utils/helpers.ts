import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric'
});

export const formatDateTime = (date: string) => new Date(date).toLocaleString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
});

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    received: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    packed: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
