export interface DispatchProduct {
  id: string;
  billNumber: string;
  partyName: string;
  productName: string;
  grossWeight: number;
  netWeight: number;
  status: 'processing' | 'dispatched' | 'cancelled' | 'failed' | 'returned';
  deliveryPersonId?: string;
  deliveryPersonName?: string;
  remarks?: string;
  originalProductId?: string;
  isAlternate: boolean;
}

export interface DispatchEntry {
  id: string;
  billNumber: string;
  orderDate: string;
  customerName: string;
  moduleType: 'hub' | 'store';
  assignedBy: string;
  packingId: string;
  products: DispatchProduct[];
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  statusHistory?: StatusHistory[];
}

export interface StatusHistory {
  status: string;
  changedBy: string;
  changedAt: string;
}

export interface DispatchFilters {
  deliveryPerson?: string;
  dateFrom?: string;
  dateTo?: string;
  customer?: string;
  status?: string;
  productId?: string;
}
