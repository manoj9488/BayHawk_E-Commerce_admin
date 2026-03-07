export interface PackingProduct {
  id: string;
  productId: string;
  productName: string;
  variant: 'small' | 'medium' | 'large';
  cuttingType: string;
  grossWeight: number;
  netWeight?: number;
  status: 'processing' | 'packed' | 'cancelled' | 'alternate';
  remarks?: string;
  originalProductId?: string;
  isAlternate: boolean;
}

export interface PackingEntry {
  id: string;
  billNumber: string;
  orderDate: string;
  customerName: string;
  moduleType: 'hub' | 'store';
  assignedTo: string;
  products: PackingProduct[];
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

export interface PackingFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  customer?: string;
  productId?: string;
}
