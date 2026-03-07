import { useState } from "react";
import { Card, Badge, PageHeader } from "../../components/ui";
import { ManualOrderForm } from "../../components/features/orders/ManualOrderForm";
import { Fish, Store } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Product } from "../../types";

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
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
    id: "2",
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
  {
    id: "3",
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
    id: "4",
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

export function ManualOrderPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"hub" | "store">("hub");

  // Filter products based on module type
  const hubProducts = mockProducts.filter(
    (product) => product.sourceType === "hub",
  );
  const storeProducts = mockProducts.filter(
    (product) => product.sourceType === "store" || product.sourceType === "hub",
  );

  const handleOrderSubmit = async (data: any) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Order created:", data);
      alert(`${activeTab.toUpperCase()} Order created successfully!`);
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  // For specific user types, show only their relevant section
  if (user?.loginType === "hub") {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <PageHeader
          title="Hub Manual Order Creation"
          description="Create manual orders for fish products with next-day delivery"
        />
        <ManualOrderForm
          moduleType="hub"
          products={hubProducts}
          hubs={mockHubs}
          onSubmit={handleOrderSubmit}
        />
      </div>
    );
  }

  if (user?.loginType === "store") {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <PageHeader
          title="Store Manual Order Creation"
          description="Create manual orders for all products with same-day/next-day delivery"
        />
        <ManualOrderForm
          moduleType="store"
          products={storeProducts}
          hubs={mockStores}
          onSubmit={handleOrderSubmit}
        />
      </div>
    );
  }

  // Super Admin sees both Hub and Store in tabs
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Manual Order Creation"
        description="Create manual orders for both hub and store operations"
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
              <span className="hidden sm:inline">Hub Orders</span>
              <span className="sm:hidden">Hub</span>
              <Badge
                variant={activeTab === "hub" ? "info" : "default"}
                className="ml-1 text-xs"
              >
                <span className="hidden sm:inline">Fish Products</span>
                <span className="sm:hidden">Fish</span>
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
              Store Orders
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
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Fish className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-900">
                    Hub Order Creation
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-700">
                    Fish products • Next day delivery • Premium quality
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                  <p className="text-lg sm:text-2xl font-bold text-blue-900">
                    {hubProducts.length}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700">Available Products</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                  <p className="text-lg sm:text-2xl font-bold text-blue-900">
                    {mockHubs.length}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700">Active Hubs</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                  <p className="text-lg sm:text-2xl font-bold text-blue-900">Next Day</p>
                  <p className="text-xs sm:text-sm text-blue-700">Delivery Type</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                  <p className="text-lg sm:text-2xl font-bold text-blue-900">Premium</p>
                  <p className="text-xs sm:text-sm text-blue-700">Quality Grade</p>
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
                    Store Order Creation
                  </h3>
                  <p className="text-xs sm:text-sm text-green-700">
                    All products • Same/Next day delivery • Wide variety
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                  <p className="text-lg sm:text-2xl font-bold text-green-900">
                    {storeProducts.length}
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
                  <p className="text-lg sm:text-2xl font-bold text-green-900">Same Day</p>
                  <p className="text-xs sm:text-sm text-green-700">Delivery Type</p>
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

      {/* Order Form */}
      {activeTab === "hub" && (
        <ManualOrderForm
          moduleType="hub"
          products={hubProducts}
          hubs={mockHubs}
          onSubmit={handleOrderSubmit}
        />
      )}

      {activeTab === "store" && (
        <ManualOrderForm
          moduleType="store"
          products={storeProducts}
          hubs={mockStores}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
}
