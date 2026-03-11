export interface CuttingProduct {
  id: string;
  productId: string;
  productName: string;
  variant: 'small' | 'medium' | 'large';
  variantImage?: string;
  cuttingType: string;
  grossWeight: number;
  netWeight?: number;
  status: 'processing' | 'completed' | 'misprocessed' | 'cancelled';
  remarks?: string;
  originalProductId?: string;
  isAlternate: boolean;
}

export interface CuttingEntry {
  id: string;
  referenceType: 'purchase' | 'order';
  referenceId: string;
  date: string;
  moduleType: 'hub' | 'store';
  createdBy: string;
  products: CuttingProduct[];
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

export interface CuttingFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  cuttingType?: string;
  productId?: string;
}

export interface CuttingType {
  id: string;
  name: string;
  isActive: boolean;
}
