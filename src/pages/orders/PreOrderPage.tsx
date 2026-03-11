import { useState } from "react";
import { Card, Badge, PageHeader } from "../../components/ui";
import { PreOrderForm } from "../../components/features/orders/PreOrderForm";
import { Fish, Store, Crown, Sparkles, Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Product } from "../../types";

// Mock data for pre-orders
const mockHubProducts: Product[] = [
  // Rare Products (isRare: true, deliveryType: 'next_day')
  {
    id: "rare_1",
    nameEn: "King Fish (Premium)",
    nameTa: "கிங் மீன்",
    sku: "RARE-001",
    category: "fish",
    description: "Premium king fish - limited availability, advance booking required",
    images: [],
    variants: [
      {
        id: "rv1",
        type: "Whole Cleaned",
        size: "Large",
        grossWeight: "2000-2500g",
        netWeight: "1800-2200g",
        pieces: "1 piece",
        serves: "6-8",
        price: 2500,
        stock: 5,
      },
    ],
    isBestSeller: false,
    isRare: true,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    approvalStatus: "approved",
  },
  {
    id: "rare_2",
    nameEn: "Wild Caught Tuna",
    nameTa: "காட்டு டுனா",
    sku: "RARE-002",
    category: "fish",
    description: "Wild caught tuna - seasonal availability, premium quality",
    images: [],
    variants: [
      {
        id: "rv2",
        type: "Steaks",
        size: "Large",
        grossWeight: "1500g",
        netWeight: "1200g",
        pieces: "6-8 steaks",
        serves: "4-6",
        price: 1800,
        stock: 3,
      },
    ],
    isBestSeller: false,
    isRare: true,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    approvalStatus: "approved",
  },
  // Exotic Products (isRare: false, deliveryType: 'exotic')
  {
    id: "exotic_1",
    nameEn: "Live Lobster",
    nameTa: "நண்டு",
    sku: "EXOTIC-001",
    category: "lobster",
    description: "Fresh live lobster - 48 hours advance notice required, imported quality",
    images: [],
    variants: [
      {
        id: "ev1",
        type: "Live",
        size: "Large",
        grossWeight: "800-1000g",
        netWeight: "800-1000g",
        pieces: "1 piece",
        serves: "3-4",
        price: 3200,
        stock: 2,
      },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: "exotic",
    sourceType: "hub",
    approvalStatus: "approved",
  },
  {
    id: "exotic_2",
    nameEn: "Norwegian Salmon",
    nameTa: "நார்வே சால்மன்",
    sku: "EXOTIC-002",
    category: "fish",
    description: "Imported Norwegian salmon - premium exotic fish, 72 hours advance booking",
    images: [],
    variants: [
      {
        id: "ev2",
        type: "Fillet",
        size: "Premium",
        grossWeight: "1000g",
        netWeight: "900g",
        pieces: "2 fillets",
        serves: "3-4",
        price: 2800,
        stock: 1,
      },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: "exotic",
    sourceType: "hub",
    approvalStatus: "approved",
  },
  {
    id: "exotic_3",
    nameEn: "Blue Crab (Live)",
    nameTa: "நீல நண்டு",
    sku: "EXOTIC-003",
    category: "crab",
    description: "Live blue crab - imported delicacy, requires special handling",
    images: [],
    variants: [
      {
        id: "ev3",
        type: "Live",
        size: "Large",
        grossWeight: "500-600g",
        netWeight: "500-600g",
        pieces: "2-3 pieces",
        serves: "2-3",
        price: 2200,
        stock: 3,
      },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: "exotic",
    sourceType: "hub",
    approvalStatus: "approved",
  },
  // Regular Hub Products
  {
    id: "hub_1",
    nameEn: "Seer Fish (Vanjaram)",
    nameTa: "வஞ்சிரம்",
    sku: "FISH-001",
    category: "fish",
    description: "Premium quality seer fish",
    images: [],
    variants: [
      {
        id: "v1",
        type: "Whole Cleaned",
        size: "Medium",
        grossWeight: "1000-1250g",
        netWeight: "800-1000g",
        pieces: "1 piece",
        serves: "3-4",
        price: 1200,
        stock: 25,
        discount: 10,
      },
      {
        id: "v2",
        type: "Curry Cut",
        size: "Medium",
        grossWeight: "1000g",
        netWeight: "800g",
        pieces: "8-10 pieces",
        serves: "3-4",
        price: 1300,
        stock: 20,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    approvalStatus: "approved",
  },
  {
    id: "hub_2",
    nameEn: "Tiger Prawns",
    nameTa: "இறால்",
    sku: "PRWN-001",
    category: "prawns",
    description: "Fresh tiger prawns",
    images: [],
    variants: [
      {
        id: "v3",
        type: "Cleaned",
        size: "Large",
        grossWeight: "500g",
        netWeight: "400g",
        pieces: "15-20 pieces",
        serves: "2-3",
        price: 650,
        stock: 15,
      },
      {
        id: "v4",
        type: "Uncleaned",
        size: "Large",
        grossWeight: "500g",
        netWeight: "450g",
        pieces: "15-20 pieces",
        serves: "2-3",
        price: 580,
        stock: 18,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    approvalStatus: "approved",
  },
];

const mockStoreProducts: Product[] = [
  ...mockHubProducts, // Store can also sell hub products
  {
    id: "store_1",
    nameEn: "Chicken Breast",
    nameTa: "சிக்கன் மார்பு",
    sku: "CHKN-001",
    category: "chicken",
    description: "Boneless chicken breast",
    images: [],
    variants: [
      {
        id: "v5",
        type: "Boneless",
        size: "Pack",
        grossWeight: "500g",
        netWeight: "500g",
        pieces: "2-3 pieces",
        serves: "2-3",
        price: 280,
        stock: 50,
      },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: "same_day",
    sourceType: "store",
    approvalStatus: "approved",
  },
  {
    id: "store_2",
    nameEn: "Mutton Curry Cut",
    nameTa: "ஆட்டு இறைச்சி",
    sku: "MUTN-001",
    category: "mutton",
    description: "Fresh mutton curry cut",
    images: [],
    variants: [
      {
        id: "v6",
        type: "Curry Cut",
        size: "Pack",
        grossWeight: "500g",
        netWeight: "500g",
        pieces: "8-10 pieces",
        serves: "2-3",
        price: 450,
        stock: 30,
      },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: "same_day",
    sourceType: "store",
    approvalStatus: "approved",
  },
  {
    id: "store_3",
    nameEn: "Country Eggs",
    nameTa: "நாட்டு முட்டை",
    sku: "EGG-001",
    category: "egg",
    description: "Fresh country eggs",
    images: [],
    variants: [
      {
        id: "v7",
        type: "Fresh",
        size: "Medium",
        grossWeight: "12 pieces",
        netWeight: "12 pieces",
        pieces: "12 pieces",
        serves: "4-6",
        price: 120,
        stock: 100,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "same_day",
    sourceType: "store",
    approvalStatus: "approved",
  },
];

const mockHubs = [
  {
    id: "hub_1",
    name: "Central Hub",
    type: "hub",
    location: "Chennai Central",
  },
  { id: "hub_2", name: "North Hub", type: "hub", location: "Chennai North" },
];

const mockStores = [
  {
    id: "store_1",
    name: "Anna Nagar Store",
    type: "store",
    location: "Anna Nagar",
  },
  {
    id: "store_2",
    name: "T. Nagar Store",
    type: "store",
    location: "T. Nagar",
  },
  {
    id: "store_3",
    name: "Velachery Store",
    type: "store",
    location: "Velachery",
  },
];

export function PreOrderPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"hub" | "store">("hub");

  // Helper functions to categorize products
  const getRareProducts = (products: Product[]) => 
    products.filter(p => p.isRare && p.deliveryType === 'next_day');
  
  const getExoticProducts = (products: Product[]) => 
    products.filter(p => !p.isRare && p.deliveryType === 'exotic');
  
  const getRegularProducts = (products: Product[]) => 
    products.filter(p => !p.isRare && p.deliveryType !== 'exotic');

  const handlePreOrderSubmit = async (data: any) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Pre-order created:", data);
      alert(`${activeTab.toUpperCase()} Pre-order created successfully!`);
    } catch (error) {
      console.error("Failed to create pre-order:", error);
      alert("Failed to create pre-order. Please try again.");
    }
  };

  // Calculate product statistics
  const hubRareProducts = getRareProducts(mockHubProducts);
  const hubExoticProducts = getExoticProducts(mockHubProducts);
  const hubRegularProducts = getRegularProducts(mockHubProducts);

  // For specific user types, show only their relevant section
  if (user?.loginType === "hub") {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <PageHeader
          title="Hub Pre-Order Creation"
          description="Create advance bookings for fish products and rare items"
        />
        <PreOrderForm
          moduleType="hub"
          products={mockHubProducts}
          hubs={mockHubs}
          onSubmit={handlePreOrderSubmit}
        />
      </div>
    );
  }

  if (user?.loginType === "store") {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <PageHeader
          title="Store Pre-Order Creation"
          description="Create advance bookings for all products and bulk orders"
        />
        <PreOrderForm
          moduleType="store"
          products={mockStoreProducts}
          hubs={mockStores}
          onSubmit={handlePreOrderSubmit}
        />
      </div>
    );
  }

  // Super Admin sees both Hub and Store in tabs
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Pre-Order Management"
        description="Create advance bookings for both hub and store operations"
      />

      {/* Tab Navigation */}
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto px-4 sm:px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("hub")}
              className={`
                flex items-center gap-2 py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap
                ${
                  activeTab === "hub"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <Fish className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Hub Pre-Orders</span>
              <span className="sm:hidden">Hub</span>
              <Badge
                variant={activeTab === "hub" ? "info" : "default"}
                className="ml-1 text-xs"
              >
                <span className="hidden sm:inline">Rare & Exotic</span>
                <span className="sm:hidden">R&E</span>
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("store")}
              className={`
                flex items-center gap-2 py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap
                ${
                  activeTab === "store"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <Store className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Store Pre-Orders</span>
              <span className="sm:hidden">Store</span>
              <Badge
                variant={activeTab === "store" ? "success" : "default"}
                className="ml-1"
              >
                All Products
              </Badge>
            </button>
          </nav>
        </div>

        {/* Module Information */}
        <div className="p-4 sm:p-6">
          {activeTab === "hub" && (
            <div className="space-y-4">
              {/* Main Hub Info */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Fish className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-blue-900">
                      Hub Pre-Order Creation
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-700">
                      Regular fish • Rare products • Exotic imports • Advance booking
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                    <p className="text-lg sm:text-2xl font-bold text-blue-900">
                      {mockHubProducts.length}
                    </p>
                    <p className="text-xs sm:text-sm text-blue-700">Total Products</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                    <p className="text-lg sm:text-2xl font-bold text-blue-900">
                      {mockHubs.length}
                    </p>
                    <p className="text-xs sm:text-sm text-blue-700">Active Hubs</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                    <p className="text-lg sm:text-2xl font-bold text-blue-900">30 Days</p>
                    <p className="text-xs sm:text-sm text-blue-700">Max Advance</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                    <p className="text-lg sm:text-2xl font-bold text-blue-900">Premium</p>
                    <p className="text-xs sm:text-sm text-blue-700">Quality Grade</p>
                  </div>
                </div>
              </div>

              {/* Product Categories Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Regular Products */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">Regular Products</h4>
                      <p className="text-xs text-green-700">Next day delivery</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Available:</span>
                      <span className="font-bold text-green-900">{hubRegularProducts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Booking:</span>
                      <span className="text-xs text-green-600">24 hours</span>
                    </div>
                  </div>
                </div>

                {/* Rare Products */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-600 flex items-center justify-center">
                      <Crown className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Rare Products</h4>
                      <p className="text-xs text-amber-700">Limited availability</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-amber-700">Available:</span>
                      <span className="font-bold text-amber-900">{hubRareProducts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-amber-700">Booking:</span>
                      <span className="text-xs text-amber-600">48 hours</span>
                    </div>
                  </div>
                </div>

                {/* Exotic Products */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900">Exotic Products</h4>
                      <p className="text-xs text-purple-700">Imported delicacies</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">Available:</span>
                      <span className="font-bold text-purple-900">{hubExoticProducts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-700">Booking:</span>
                      <span className="text-xs text-purple-600">72 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "store" && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6 border border-green-200 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <Store className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-green-900">
                    Store Pre-Order Creation
                  </h3>
                  <p className="text-xs sm:text-sm text-green-700">
                    All products • Bulk orders • Subscriptions • Same/Next day
                    delivery
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                  <p className="text-lg sm:text-2xl font-bold text-green-900">
                    {mockStoreProducts.length}
                  </p>
                  <p className="text-xs sm:text-sm text-green-700">Available Products</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                  <p className="text-lg sm:text-2xl font-bold text-green-900">
                    {mockStores.length}
                  </p>
                  <p className="text-xs sm:text-sm text-green-700">Active Stores</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                  <p className="text-lg sm:text-2xl font-bold text-green-900">90 Days</p>
                  <p className="text-xs sm:text-sm text-green-700">Max Advance</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                  <p className="text-lg sm:text-2xl font-bold text-green-900">Variety</p>
                  <p className="text-xs sm:text-sm text-green-700">Product Range</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Pre-Order Form */}
      {activeTab === "hub" && (
        <PreOrderForm
          moduleType="hub"
          products={mockHubProducts}
          hubs={mockHubs}
          onSubmit={handlePreOrderSubmit}
        />
      )}

      {activeTab === "store" && (
        <PreOrderForm
          moduleType="store"
          products={mockStoreProducts}
          hubs={mockStores}
          onSubmit={handlePreOrderSubmit}
        />
      )}
    </div>
  );
}
