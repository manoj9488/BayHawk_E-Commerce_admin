import type { Product } from '../../types';

export type LocationOption = {
  id: string;
  name: string;
  type: string;
  location: string;
};

type ScopedOrderConfig = {
  scope: 'Hub' | 'Store';
  moduleType: 'hub' | 'store';
  title: string;
  description: string;
  products: Product[];
  hubs: LocationOption[];
};

const hubLocations: LocationOption[] = [
  { id: 'hub_1', name: 'Central Hub', type: 'hub', location: 'Chennai Central' },
  { id: 'hub_2', name: 'North Hub', type: 'hub', location: 'Chennai North' },
];

const storeLocations: LocationOption[] = [
  { id: 'store_1', name: 'Anna Nagar Store', type: 'store', location: 'Anna Nagar' },
  { id: 'store_2', name: 'T. Nagar Store', type: 'store', location: 'T. Nagar' },
  { id: 'store_3', name: 'Velachery Store', type: 'store', location: 'Velachery' },
];

const hubManualProducts: Product[] = [
  {
    id: '1',
    nameEn: 'Seer Fish (Vanjaram)',
    nameTa: 'வஞ்சிரம்',
    sku: 'FISH-001',
    category: 'fish',
    description: 'Premium quality seer fish',
    images: [],
    variants: [
      { id: 'v1', type: 'Whole Cleaned', size: 'Medium', grossWeight: '1000-1250g', netWeight: '800-1000g', pieces: '1 piece', serves: '3-4', price: 1200, stock: 25, discount: 10 },
      { id: 'v2', type: 'Curry Cut', size: 'Medium', grossWeight: '1000g', netWeight: '800g', pieces: '8-10 pieces', serves: '3-4', price: 1300, stock: 20 },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: 'next_day',
    sourceType: 'hub',
    approvalStatus: 'approved'
  },
  {
    id: '2',
    nameEn: 'Tiger Prawns',
    nameTa: 'இறால்',
    sku: 'PRWN-001',
    category: 'prawns',
    description: 'Fresh tiger prawns',
    images: [],
    variants: [
      { id: 'v3', type: 'Cleaned', size: 'Large', grossWeight: '500g', netWeight: '400g', pieces: '15-20 pieces', serves: '2-3', price: 650, stock: 15 },
      { id: 'v4', type: 'Uncleaned', size: 'Large', grossWeight: '500g', netWeight: '450g', pieces: '15-20 pieces', serves: '2-3', price: 580, stock: 18 },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: 'next_day',
    sourceType: 'hub',
    approvalStatus: 'approved'
  }
];

const storeOnlyManualProducts: Product[] = [
  {
    id: '3',
    nameEn: 'Chicken Breast',
    nameTa: 'சிக்கன் மார்பு',
    sku: 'CHKN-001',
    category: 'chicken',
    description: 'Boneless chicken breast',
    images: [],
    variants: [
      { id: 'v5', type: 'Boneless', size: 'Pack', grossWeight: '500g', netWeight: '500g', pieces: '2-3 pieces', serves: '2-3', price: 280, stock: 50 },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: 'same_day',
    sourceType: 'store',
    approvalStatus: 'approved'
  },
  {
    id: '4',
    nameEn: 'Mutton Curry Cut',
    nameTa: 'ஆட்டு இறைச்சி',
    sku: 'MUTN-001',
    category: 'mutton',
    description: 'Fresh mutton curry cut',
    images: [],
    variants: [
      { id: 'v6', type: 'Curry Cut', size: 'Pack', grossWeight: '500g', netWeight: '500g', pieces: '8-10 pieces', serves: '2-3', price: 450, stock: 30 },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: 'same_day',
    sourceType: 'store',
    approvalStatus: 'approved'
  }
];

const hubPreOrderProducts: Product[] = [
  {
    id: 'rare_1',
    nameEn: 'King Fish (Premium)',
    nameTa: 'கிங் மீன்',
    sku: 'RARE-001',
    category: 'fish',
    description: 'Premium king fish - advance booking required',
    images: [],
    variants: [
      { id: 'rv1', type: 'Whole Cleaned', size: 'Large', grossWeight: '2000-2500g', netWeight: '1800-2200g', pieces: '1 piece', serves: '6-8', price: 2500, stock: 5 },
    ],
    isBestSeller: false,
    isRare: true,
    isActive: true,
    deliveryType: 'exotic',
    sourceType: 'hub',
    approvalStatus: 'approved'
  },
  {
    id: 'hub_1',
    nameEn: 'Seer Fish (Vanjaram)',
    nameTa: 'வஞ்சிரம்',
    sku: 'FISH-001',
    category: 'fish',
    description: 'Premium quality seer fish',
    images: [],
    variants: [
      { id: 'v1', type: 'Whole Cleaned', size: 'Medium', grossWeight: '1000-1250g', netWeight: '800-1000g', pieces: '1 piece', serves: '3-4', price: 1200, stock: 25, discount: 10 },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: 'next_day',
    sourceType: 'hub',
    approvalStatus: 'approved'
  }
];

const storeOnlyPreOrderProducts: Product[] = [
  {
    id: 'store_1',
    nameEn: 'Chicken Breast',
    nameTa: 'சிக்கன் மார்பு',
    sku: 'CHKN-001',
    category: 'chicken',
    description: 'Boneless chicken breast',
    images: [],
    variants: [
      { id: 'v5', type: 'Boneless', size: 'Pack', grossWeight: '500g', netWeight: '500g', pieces: '2-3 pieces', serves: '2-3', price: 280, stock: 50 },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: 'same_day',
    sourceType: 'store',
    approvalStatus: 'approved'
  },
  {
    id: 'store_2',
    nameEn: 'Mutton Curry Cut',
    nameTa: 'ஆட்டு இறைச்சி',
    sku: 'MUTN-001',
    category: 'mutton',
    description: 'Fresh mutton curry cut',
    images: [],
    variants: [
      { id: 'v6', type: 'Curry Cut', size: 'Pack', grossWeight: '500g', netWeight: '500g', pieces: '8-10 pieces', serves: '2-3', price: 450, stock: 30 },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: 'same_day',
    sourceType: 'store',
    approvalStatus: 'approved'
  }
];

const storeManualProducts: Product[] = [...hubManualProducts, ...storeOnlyManualProducts];
const storePreOrderProducts: Product[] = [...hubPreOrderProducts, ...storeOnlyPreOrderProducts];

export const MANUAL_ORDER_CONFIGS: Record<'hub' | 'store', ScopedOrderConfig> = {
  hub: {
    scope: 'Hub',
    moduleType: 'hub',
    title: 'Hub Manual Order Creation',
    description: 'Create manual orders for fish products with next-day delivery',
    products: hubManualProducts,
    hubs: hubLocations,
  },
  store: {
    scope: 'Store',
    moduleType: 'store',
    title: 'Store Manual Order Creation',
    description: 'Create manual orders for all products with same-day/next-day delivery',
    products: storeManualProducts,
    hubs: storeLocations,
  },
};

export const PRE_ORDER_CONFIGS: Record<'hub' | 'store', ScopedOrderConfig> = {
  hub: {
    scope: 'Hub',
    moduleType: 'hub',
    title: 'Hub Pre-Order Creation',
    description: 'Create advance bookings for fish products and rare items',
    products: hubPreOrderProducts,
    hubs: hubLocations,
  },
  store: {
    scope: 'Store',
    moduleType: 'store',
    title: 'Store Pre-Order Creation',
    description: 'Create advance bookings for all products and bulk orders',
    products: storePreOrderProducts,
    hubs: storeLocations,
  },
};
