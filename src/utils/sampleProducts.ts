import type { Product } from '../types';

export const sampleProducts: Product[] = [
  // Regular Products
  {
    id: 'prod_001',
    nameEn: 'Seer Fish (Vanjaram)',
    nameTa: 'வஞ்சிரம்',
    sku: 'FISH-SEER-001',
    category: 'fish',
    description: 'Fresh Seer Fish, premium quality',
    images: [],
    variants: [
      {
        id: 'var_001',
        type: 'Curry Cut',
        size: 'Medium',
        grossWeight: '1kg',
        netWeight: '900g',
        pieces: '8-10 pieces',
        serves: 'Serves 3-4',
        price: 450,
        stock: 25,
        discount: 0
      },
      {
        id: 'var_002',
        type: 'Steaks',
        size: 'Large',
        grossWeight: '1kg',
        netWeight: '950g',
        pieces: '4-5 pieces',
        serves: 'Serves 3-4',
        price: 480,
        stock: 15,
        discount: 5
      }
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: 'same_day',
    sourceType: 'hub',
    approvalStatus: 'approved',
    moduleType: 'hub',
    hubId: 'hub_1'
  },
  
  // Rare Product
  {
    id: 'prod_002',
    nameEn: 'King Fish (Surmai)',
    nameTa: 'சூரை',
    sku: 'FISH-KING-001',
    category: 'fish',
    description: 'Premium King Fish, limited availability',
    images: [],
    variants: [
      {
        id: 'var_003',
        type: 'Whole Fish',
        size: 'Large',
        grossWeight: '2kg',
        netWeight: '1.8kg',
        pieces: '1 piece',
        serves: 'Serves 6-8',
        price: 800,
        stock: 5,
        discount: 0
      },
      {
        id: 'var_004',
        type: 'Steaks',
        size: 'Medium',
        grossWeight: '1kg',
        netWeight: '950g',
        pieces: '6-8 pieces',
        serves: 'Serves 4-5',
        price: 650,
        stock: 3,
        discount: 0
      }
    ],
    isBestSeller: false,
    isRare: true,
    isActive: true,
    deliveryType: 'next_day',
    sourceType: 'hub',
    approvalStatus: 'approved',
    moduleType: 'hub',
    hubId: 'hub_1'
  },

  // Exotic Product
  {
    id: 'prod_003',
    nameEn: 'Norwegian Salmon',
    nameTa: 'நார்வே சால்மன்',
    sku: 'FISH-SALMON-001',
    category: 'fish',
    description: 'Imported Norwegian Salmon, premium exotic delicacy',
    images: [],
    variants: [
      {
        id: 'var_005',
        type: 'Fillet',
        size: 'Premium',
        grossWeight: '500g',
        netWeight: '480g',
        pieces: '2 fillets',
        serves: 'Serves 2-3',
        price: 1200,
        stock: 8,
        discount: 0
      },
      {
        id: 'var_006',
        type: 'Steaks',
        size: 'Premium',
        grossWeight: '500g',
        netWeight: '480g',
        pieces: '4-5 steaks',
        serves: 'Serves 2-3',
        price: 1100,
        stock: 6,
        discount: 0
      }
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: 'exotic',
    sourceType: 'hub',
    approvalStatus: 'approved',
    moduleType: 'hub',
    hubId: 'hub_1'
  },

  // Another Rare Product
  {
    id: 'prod_004',
    nameEn: 'Red Snapper',
    nameTa: 'சிவப்பு ஸ்னாப்பர்',
    sku: 'FISH-SNAPPER-001',
    category: 'fish',
    description: 'Fresh Red Snapper, rare catch',
    images: [],
    variants: [
      {
        id: 'var_007',
        type: 'Whole Fish',
        size: 'Medium',
        grossWeight: '1.5kg',
        netWeight: '1.3kg',
        pieces: '1 piece',
        serves: 'Serves 4-5',
        price: 750,
        stock: 2,
        discount: 0
      }
    ],
    isBestSeller: false,
    isRare: true,
    isActive: true,
    deliveryType: 'next_day',
    sourceType: 'hub',
    approvalStatus: 'approved',
    moduleType: 'hub',
    hubId: 'hub_1'
  },

  // Regular Alternative Products (for rare product alternates)
  {
    id: 'prod_005',
    nameEn: 'Pomfret',
    nameTa: 'வாவல்',
    sku: 'FISH-POMFRET-001',
    category: 'fish',
    description: 'Fresh Pomfret, excellent alternative',
    images: [],
    variants: [
      {
        id: 'var_008',
        type: 'Whole Fish',
        size: 'Medium',
        grossWeight: '1kg',
        netWeight: '900g',
        pieces: '2-3 pieces',
        serves: 'Serves 3-4',
        price: 400,
        stock: 20,
        discount: 0
      },
      {
        id: 'var_009',
        type: 'Curry Cut',
        size: 'Medium',
        grossWeight: '1kg',
        netWeight: '900g',
        pieces: '8-10 pieces',
        serves: 'Serves 3-4',
        price: 420,
        stock: 18,
        discount: 0
      }
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: 'same_day',
    sourceType: 'hub',
    approvalStatus: 'approved',
    moduleType: 'hub',
    hubId: 'hub_1'
  },

  // Another Exotic Product
  {
    id: 'prod_006',
    nameEn: 'Tuna Steaks',
    nameTa: 'டுனா ஸ்டீக்ஸ்',
    sku: 'FISH-TUNA-001',
    category: 'fish',
    description: 'Premium Tuna Steaks, imported delicacy',
    images: [],
    variants: [
      {
        id: 'var_010',
        type: 'Steaks',
        size: 'Premium',
        grossWeight: '500g',
        netWeight: '480g',
        pieces: '3-4 steaks',
        serves: 'Serves 2-3',
        price: 950,
        stock: 4,
        discount: 0
      }
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: 'exotic',
    sourceType: 'hub',
    approvalStatus: 'approved',
    moduleType: 'hub',
    hubId: 'hub_1'
  },

  // Regular Store Products
  {
    id: 'prod_007',
    nameEn: 'Chicken Curry Cut',
    nameTa: 'கோழி கறி வெட்டு',
    sku: 'CHICKEN-CURRY-001',
    category: 'chicken',
    description: 'Fresh chicken curry cut',
    images: [],
    variants: [
      {
        id: 'var_011',
        type: 'Curry Cut',
        size: '1kg',
        grossWeight: '1kg',
        netWeight: '950g',
        pieces: '12-15 pieces',
        serves: 'Serves 4-5',
        price: 280,
        stock: 50,
        discount: 0
      }
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: 'same_day',
    sourceType: 'store',
    approvalStatus: 'approved',
    moduleType: 'store',
    storeId: 'store_1'
  }
];

export const sampleHubs = [
  {
    id: 'hub_1',
    name: 'Chennai Central Hub',
    type: 'hub',
    location: 'T. Nagar, Chennai'
  },
  {
    id: 'store_1',
    name: 'Velachery Store',
    type: 'store',
    location: 'Velachery, Chennai'
  },
  {
    id: 'store_2',
    name: 'Anna Nagar Store',
    type: 'store',
    location: 'Anna Nagar, Chennai'
  }
];