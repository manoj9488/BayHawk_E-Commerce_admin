export interface DeliveryProduct {
  id: string;
  billNumber: string;
  partyName: string;
  productName: string;
  grossWeight: number;
  netWeight: number;
  isAlternate: boolean;
  originalProductName?: string;
}

export interface DeliveryEntry {
  id: string;
  dispatchId: string;
  billNumber: string;
  partyName: string;
  totalPayment: number;
  paymentStatus: 'paid' | 'unpaid';
  paymentMode: 'online' | 'cod';
  status: 'dispatched' | 'delivered' | 'undelivered' | 'returned' | 'failed_delivery';
  deliveryPersonId: string;
  deliveryPersonName: string;
  customerAddress: string;
  customerPhone: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
  proofImageUrl?: string;
  proofUploadedAt?: string;
  proofUploadedBy?: string;
  collectedAmount?: number;
  collectedAt?: string;
  products: DeliveryProduct[];
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  statusHistory?: DeliveryStatusHistory[];
}

export interface DeliveryStatusHistory {
  status: string;
  changedBy: string;
  changedAt: string;
  remarks?: string;
}

export interface DeliveryFilters {
  dateFrom?: string;
  dateTo?: string;
  customer?: string;
  status?: string;
  deliveryPerson?: string;
}
