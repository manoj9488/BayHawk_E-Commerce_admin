export interface PurchaseProduct {
  id: string;
  productId: string;
  productName: string;
  variant: 'small' | 'medium' | 'large';
  countMin: number;
  countMax: number;
  grossWeight: number;
  basePriceMin: number;
  basePriceMax: number;
  purchasePrice: number;
  status: 'processing' | 'purchased' | 'cancelled' | 'alternate';
  remarks?: string;
  originalProductId?: string;
  alternateProductId?: string;
  isAlternate: boolean;
}

export interface Purchase {
  id: string;
  purchaseDate: string;
  supplierName: string;
  moduleType: 'hub' | 'store';
  createdBy: string;
  remarks?: string;
  products: PurchaseProduct[];
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

export interface PurchaseFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  productId?: string;
}
