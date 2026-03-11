import { useEffect, useMemo, useState } from "react";
import { Card, Badge, PageHeader } from "../../components/ui";
import { ManualOrderForm } from "../../components/features/orders/ManualOrderForm";
import { Fish, Store } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Product } from "../../types";
import { ordersApi } from "../../utils/api";
import {
  listProducts,
  mapBackendProductToAdminProduct,
  listHubOptions,
  listStoreOptions,
} from "../../utils/productBackend";

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export function ManualOrderPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"hub" | "store">("hub");
  const [products, setProducts] = useState<Product[]>([]);
  const [hubOptions, setHubOptions] = useState<Array<{ id: string; name: string; type: string; location: string }>>([]);
  const [storeOptions, setStoreOptions] = useState<Array<{ id: string; name: string; type: string; location: string }>>([]);
  const [loading, setLoading] = useState(false);

  // Filter products based on module type
  const hubProducts = useMemo(
    () => products.filter((product) => product.sourceType === "hub"),
    [products]
  );
  const storeProducts = useMemo(
    () => products.filter((product) => product.sourceType === "store" || product.sourceType === "hub"),
    [products]
  );

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const [productRecords, hubs, stores] = await Promise.all([
          listProducts({ approvalStatus: "approved", active: "true", limit: "200" }),
          listHubOptions(),
          listStoreOptions(),
        ]);
        if (!cancelled) {
          setProducts(productRecords.map(mapBackendProductToAdminProduct));
          setHubOptions(hubs.map((hub) => ({ ...hub, type: "hub" })));
          setStoreOptions(stores.map((store) => ({ ...store, type: "store" })));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load manual order data", error);
          setProducts([]);
          setHubOptions([]);
          setStoreOptions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleOrderSubmit = async (data: any) => {
    try {
      const locationId = data.hubId || "";
      const payload = {
        moduleScope: activeTab,
        entrySource: activeTab,
        hubId: activeTab === "hub" ? locationId : undefined,
        storeId: activeTab === "store" ? locationId : undefined,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        alternatePhone: data.customerSecondaryPhone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        addressType: data.addressType,
        items: data.items,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        advanceAmount: data.advanceAmount,
        discountType: data.discountType,
        discountValue: data.discountValue,
        applySurgeCharges: data.applySurgeCharges,
        orderSource: data.orderSource,
        specialInstructions: data.specialInstructions,
        deliverySlot: isUuid(data.deliverySlot || "") ? data.deliverySlot : undefined,
        adminId: user?.id,
      };

      await ordersApi.createManual(payload);
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
          hubs={hubOptions}
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
          hubs={storeOptions}
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
                    {hubOptions.length}
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
                    {storeOptions.length}
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
          hubs={hubOptions}
          onSubmit={handleOrderSubmit}
        />
      )}

      {activeTab === "store" && (
        <ManualOrderForm
          moduleType="store"
          products={storeProducts}
          hubs={storeOptions}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
}
