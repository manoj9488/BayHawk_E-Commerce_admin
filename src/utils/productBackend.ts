import type { Product } from "../types";
import {
  categoriesApi,
  cuttingTypesApi,
  hubsApi,
  productApprovalApi,
  productsApi,
  storesApi,
} from "./api";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: {
    message?: string;
  };
}

function unwrapResponse<T>(response: { data?: ApiEnvelope<T> }): T {
  const payload = response.data;

  if (!payload?.success || payload.data === undefined) {
    throw new Error(payload?.error?.message || "Request failed");
  }

  return payload.data;
}

export interface ProductCategoryOption {
  id: string;
  categoryCode: string;
  name: string;
  nameTa: string;
  moduleScope: "hub" | "store";
  isActive: boolean;
}

export interface CuttingTypeOption {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  moduleType: "hub" | "store";
  isActive: boolean;
}

export interface LocationOption {
  id: string;
  name: string;
  location: string;
}

export interface ProductDayPricing {
  enabled: boolean;
  dayPrices: Array<{
    day: string;
    price: number;
    enabled: boolean;
  }>;
}

export interface ProductNutrition {
  servingBaseQty: number;
  servingBaseUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
  selectedNutrition: Record<string, boolean>;
  customNutrients: unknown[];
}

export interface ComboProductData {
  enabled: boolean;
  comboName: string;
  comboDescription: string;
  comboOfferPercent: number;
  comboOriginalPrice: number;
  comboOfferedPrice: number;
  items: Array<{
    id: string;
    productId: string;
    name: string;
    categoryCode: string;
    quantity: number;
    price: number;
  }>;
}

export interface ProductVariantRecord {
  id: string;
  type: string;
  name: string;
  size: string;
  grossWeight: string;
  netWeight: string;
  pieces: string;
  serves: string;
  skuNumber: string;
  actualPrice: number;
  salesPrice: number;
  price: number;
  stock: number;
  discount: number;
  igst: number;
  cgst: number;
  sgst: number;
  cuttingTypeId?: string | null;
  cuttingTypeName?: string | null;
}

export interface ProductRecord {
  id: string;
  moduleScope: "hub" | "store";
  moduleType: "hub" | "store";
  sourceType: "hub" | "store";
  nameEn: string;
  nameTa: string;
  category: string;
  categoryId?: string | null;
  categoryCode: string;
  categoryName: string;
  categoryNameTa?: string;
  description: string;
  images: string[];
  image: string;
  primaryImageIndex: number;
  productType: "fresh" | "frozen" | "processed";
  season: string;
  metaTitle: string;
  metaDescription: string;
  isBestSeller: boolean;
  isRare: boolean;
  isActive: boolean;
  deliveryType: "same_day" | "next_day" | "exotic";
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
  price: number;
  originalPrice?: number;
  weight: string;
  pieces?: string;
  serves?: string;
  sku: string;
  variants: ProductVariantRecord[];
  hsnNumber?: string | null;
  fishSize?: string | null;
  maxSize?: string | null;
  fishCountMin?: number | null;
  fishCountMax?: number | null;
  unit?: string | null;
  quantityLabel?: string | null;
  hubId?: string | null;
  hubName?: string | null;
  storeId?: string | null;
  storeName?: string | null;
  dayBasedPricing: ProductDayPricing;
  productTags: string[];
  nutrition?: ProductNutrition | null;
  combo: ComboProductData;
}

export interface ProductApprovalRecord {
  id: string;
  productId: string;
  sourceType: "hub" | "store";
  requestedBy: string;
  requestedByRole: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  priority: "low" | "medium" | "high";
  reason?: string | null;
  approvalNotes?: string | null;
  product: ProductRecord;
  productName: string;
  productNameTa: string;
  category: string;
  hsnNumber: string;
  variant: string;
  fishSize: string;
  maxSize: string;
  basePriceMin: number;
  basePriceMax: number;
  fishCountMin: number;
  fishCountMax: number;
  description: string;
  price: number;
  unit: string;
  images: string[];
  primaryImageIndex: number;
  isBestSeller: boolean;
  isRareProduct: boolean;
  isActive: boolean;
  productType: "fresh" | "frozen" | "processed";
  season: string;
  metaTitle: string;
  metaDescription: string;
  variants: Array<{
    id: string;
    type: string;
    size: string;
    grossWeight: string;
    netWeight: string;
    pieces: string;
    serves: string;
    skuNumber: string;
    actualPrice: number;
    salesPrice: number;
    stock: number;
    igst: number;
    cgst: number;
    sgst: number;
    cuttingTypeId?: string | null;
    cuttingTypeName?: string | null;
  }>;
  dayBasedPricing: ProductDayPricing;
  productTags: string[];
  nutrition?: ProductNutrition | null;
}

export function mapBackendProductToAdminProduct(product: ProductRecord): Product {
  return {
    id: product.id,
    nameEn: product.nameEn,
    nameTa: product.nameTa,
    sku: product.sku || product.variants[0]?.skuNumber || "",
    category: product.categoryCode as Product["category"],
    description: product.description,
    images: product.images,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      type: variant.type,
      size: variant.size,
      grossWeight: variant.grossWeight,
      netWeight: variant.netWeight,
      pieces: variant.pieces,
      serves: variant.serves,
      price: variant.salesPrice || variant.price,
      stock: variant.stock,
      discount: variant.discount,
      cuttingTypeId: variant.cuttingTypeId || undefined,
    })),
    nutritionalInfo: product.nutrition
      ? {
          calories: product.nutrition.calories,
          protein: product.nutrition.protein,
          fat: product.nutrition.fat,
        }
      : undefined,
    isBestSeller: product.isBestSeller,
    isRare: product.isRare,
    isActive: product.isActive,
    deliveryType: product.deliveryType,
    sourceType: product.sourceType,
    approvalStatus: product.approvalStatus,
    moduleType: product.moduleType,
    hubId: product.hubId || undefined,
    storeId: product.storeId || undefined,
  };
}

export async function listProducts(params?: Record<string, string>): Promise<ProductRecord[]> {
  return unwrapResponse<ProductRecord[]>(await productsApi.getAll(params));
}

export async function getProductById(id: string): Promise<ProductRecord> {
  return unwrapResponse<ProductRecord>(await productsApi.getById(id));
}

export async function createProduct(data: unknown): Promise<ProductRecord> {
  return unwrapResponse<ProductRecord>(await productsApi.create(data));
}

export async function updateProduct(id: string, data: unknown): Promise<ProductRecord> {
  return unwrapResponse<ProductRecord>(await productsApi.update(id, data));
}

export async function deleteProduct(id: string): Promise<{ id: string; deleted: boolean }> {
  return unwrapResponse<{ id: string; deleted: boolean }>(await productsApi.delete(id));
}

export async function bulkUpdateProducts(data: {
  ids: string[];
  action: "activate" | "deactivate" | "archive" | "delete";
}): Promise<{ ids: string[]; action: string; count: number }> {
  return unwrapResponse<{ ids: string[]; action: string; count: number }>(
    await productsApi.bulkUpdate(data)
  );
}

export async function listProductApprovals(
  params?: Record<string, string>
): Promise<ProductApprovalRecord[]> {
  return unwrapResponse<ProductApprovalRecord[]>(await productApprovalApi.getAll(params));
}

export async function decideProductApproval(
  id: string,
  data: {
    action: "approve" | "reject";
    decisionBy: { userId: string; name: string; role: string };
    notes?: string;
    rejectionReason?: string;
  }
): Promise<ProductApprovalRecord> {
  return unwrapResponse<ProductApprovalRecord>(await productApprovalApi.decide(id, data));
}

export async function bulkDecideProductApprovals(data: {
  ids: string[];
  action: "approve" | "reject";
  decisionBy: { userId: string; name: string; role: string };
  notes?: string;
  rejectionReason?: string;
}): Promise<{ ids: string[]; action: string; count: number }> {
  return unwrapResponse<{ ids: string[]; action: string; count: number }>(
    await productApprovalApi.bulkDecide(data)
  );
}

export async function listProductCategories(moduleScope: "hub" | "store") {
  const data = unwrapResponse<
    Array<{
      id: string;
      categoryCode: string;
      name: string;
      nameTa: string;
      type?: "hub" | "store";
      moduleScope?: "hub" | "store";
      isActive: boolean;
    }>
  >(
    await categoriesApi.getAll({
      moduleScope,
      active: "true",
      limit: "100",
    })
  );

  return data.map((item) => ({
    id: item.id,
    categoryCode: item.categoryCode,
    name: item.name,
    nameTa: item.nameTa,
    moduleScope: item.moduleScope || item.type || moduleScope,
    isActive: item.isActive,
  }));
}

export async function listCuttingTypes(moduleScope: "hub" | "store") {
  const data = unwrapResponse<
    Array<{
      id: string;
      name: string;
      description?: string | null;
      category: string;
      moduleType: "hub" | "store";
      isActive: boolean;
    }>
  >(
    await cuttingTypesApi.getAll({
      moduleType: moduleScope,
      active: "true",
      limit: "100",
    })
  );

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    category: item.category,
    moduleType: item.moduleType,
    isActive: item.isActive,
  }));
}

export async function listHubOptions(): Promise<LocationOption[]> {
  const hubs = unwrapResponse<
    Array<{
      id: string;
      name: string;
      address: { city: string; state: string };
    }>
  >(await hubsApi.getAll({ limit: "100" }));

  return hubs.map((hub) => ({
    id: hub.id,
    name: hub.name,
    location: [hub.address.city, hub.address.state].filter(Boolean).join(", "),
  }));
}

export async function listStoreOptions(): Promise<LocationOption[]> {
  const stores = unwrapResponse<
    Array<{
      id: string;
      name: string;
      address: { city: string; state: string };
    }>
  >(await storesApi.getAll({ limit: "100" }));

  return stores.map((store) => ({
    id: store.id,
    name: store.name,
    location: [store.address.city, store.address.state].filter(Boolean).join(", "),
  }));
}
