export type UserRole = 'super_admin' | 'hub_admin' | 'store_admin' | 'hub_main_admin' | 'hub_procurement' | 'hub_cutting_cleaning' | 'hub_packing' | 'hub_dispatch' | 'hub_delivery' | 'store_main_admin' | 'store_procurement' | 'store_cutting_cleaning' | 'store_packing' | 'store_dispatch' | 'store_delivery';
export type LoginType = 'hub' | 'store' | 'super_admin';
export type ModuleType = 'hub' | 'store' | 'both';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  loginType: LoginType;
  hubId?: string;
  storeId?: string;
  permissions?: string[];
  department?: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  moduleType: 'hub' | 'store';
  permissions: string[];
  color: string;
  icon: string;
}

export interface Order {
  id: string;
  invoiceNumber?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  deliveryInstructions?: string;
  promoCode?: string;
  discountAmount?: number;
  deliveryCharges?: number;
  surgeCharges?: number;
  surgeChargesReason?: string;
  additionalCharges?: number;
  additionalChargesReason?: string;
  gstAmount?: number;
  subtotalAmount?: number;
  source: 'app' | 'website' | 'whatsapp' | 'instagram' | 'facebook';
  status: 'received' | 'processing' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
  paymentMethod: 'cod' | 'online' | 'wallet';
  items: OrderItem[];
  totalAmount: number;
  paidAmount?: number;
  pendingAmount?: number;
  refundedAmount?: number;
  netAmount?: number;
  paymentRecords?: PaymentRecord[];
  refundRecords?: RefundRecord[];
  deliverySlot: string;
  hubId?: string;
  storeId?: string;
  deliveryAgentId?: string;
  packedPhotos?: string[];
  thirdPartyDelivery?: {
    service: 'porter' | 'rapido' | 'swiggy' | 'other';
    personName: string;
    personPhone: string;
    vehicleNumber?: string;
    trackingId?: string;
  };
  orderType: 'regular' | 'pre_order' | 'manual';
  moduleType: 'hub' | 'store';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variant: string;
  quantity: number;
  price: number;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque' | 'online';
  paymentMode: 'full' | 'partial' | 'advance';
  transactionId?: string;
  referenceNumber?: string;
  notes?: string;
  receivedBy: string;
  receivedAt: string;
  status: 'confirmed' | 'pending_verification' | 'failed' | 'refunded';
  attachments?: string[];
}

export interface RefundRecord {
  id: string;
  orderId: string;
  amount: number;
  refundType: 'full' | 'partial' | 'item_return' | 'cancellation' | 'quality_issue';
  refundMethod: 'original_payment' | 'cash' | 'bank_transfer' | 'wallet_credit' | 'store_credit';
  reason: string;
  itemsRefunded?: {
    productId: string;
    productName: string;
    variant: string;
    quantity: number;
    refundAmount: number;
  }[];
  transactionId?: string;
  referenceNumber?: string;
  notes?: string;
  processedBy: string;
  processedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'pending' | 'approved' | 'processed' | 'completed' | 'rejected';
  attachments?: string[];
}

export interface Product {
  id: string;
  nameEn: string;
  nameTa: string;
  sku: string;
  category: ProductCategory;
  description: string;
  images: string[];
  variants: ProductVariant[];
  nutritionalInfo?: NutritionalInfo;
  isBestSeller: boolean;
  isRare: boolean;
  isActive: boolean;
  deliveryType: 'same_day' | 'next_day' | 'exotic';
  sourceType: 'hub' | 'store';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  moduleType?: string;
  hubId?: string;
  storeId?: string;
}

export type ProductCategory = 'fish' | 'prawns' | 'crab' | 'squid' | 'lobster' | 'chicken' | 'mutton' | 'egg' | 'spices';

export interface ProductVariant {
  id: string;
  type: string;
  size: string;
  grossWeight: string;
  netWeight: string;
  pieces: string;
  serves: string;
  price: number;
  stock: number;
  discount?: number;
  cuttingTypeId?: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  fat: number;
  omega3?: number;
  iron?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: UserRole;
  hubId?: string;
  storeId?: string;
  moduleType: 'hub' | 'store';
  permissions?: string[];
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  addresses?: Array<{
    type: 'home' | 'work' | 'other';
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }>;
  totalOrders: number;
  totalSpent: number;
  walletBalance: number;
  membershipPlan?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  vehicleNo: string;
  vehicleType?: string;
  agentType: 'employee' | 'partner';
  monthlySalary?: number; // For employees only
  drivingLicenseNo?: string;
  licenseExpiryDate?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
  rating: number;
  deliveries: number;
  isActive: boolean;
  status: 'available' | 'delivering' | 'returning' | 'offline';
  currentOrder?: {
    orderId: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    orderValue: number;
    estimatedTime: string;
    currentLocation: string;
  };
}

export interface BatchDeliveryAssignment {
  id: string;
  batchId: string;
  agentId: string;
  agentName: string;
  agentType: 'employee' | 'partner';
  orderIds: string[];
  orderCount: number;
  partnerPricing?: {
    pricePerOrder: number;
    totalAmount: number;
    paymentStatus: 'pending' | 'paid';
  };
  assignedAt: string;
  completedAt?: string;
}

export interface Zone {
  id: string;
  name: string;
  pincodes: string[];
  storeIds: string[];
}

export interface DeliverySlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  capacity: number;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  isActive: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  serves: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  images: string[];
  videoUrl?: string; // Mandatory video URL
  additionalVideos?: Array<{
    id: string;
    type: 'url' | 'file';
    url: string;
    name: string;
    thumbnail?: string;
  }>; // Optional additional videos
  isPublished: boolean;
  moduleType?: 'hub' | 'store';
  hubId?: string;
  storeId?: string;
  // Engagement data
  likes?: number;
  dislikes?: number;
  rating?: number;
  reviewCount?: number;
  reviews?: RecipeReview[];
  tips?: RecipeTip[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RecipeReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerified?: boolean;
}

export interface RecipeTip {
  id: string;
  userId: string;
  userName: string;
  tip: string;
  likes: number;
  createdAt: string;
}

export interface RecipeIngredient {
  productId?: string;
  name: string;
  quantity: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  isActive: boolean;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  isPublished: boolean;
  viewCount: number;
}

export interface Review {
  id: string;
  type: 'product' | 'recipe' | 'order';
  targetId: string;
  customerId: string;
  customerName: string;
  rating: number;
  text: string;
  photos?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
  moduleType?: 'hub' | 'store';
  hubId?: string;
  storeId?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  variantId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  hubId?: string;
  storeId?: string;
  createdBy: string;
  createdAt: string;
}

export interface CustomRole {
  id: string;
  name: string;
  moduleType: 'hub' | 'store';
  permissions: string[];
  description: string;
  isActive: boolean;
}

export interface ScratchCard {
  id: string;
  name: string;
  description: string;
  cardType: 'percentage' | 'fixed_amount' | 'free_item' | 'points';
  rewardValue: number;
  minOrderValue: number;
  maxRedemptions: number;
  usedRedemptions: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  targetAudience: 'all' | 'new_users' | 'premium' | 'frequent_buyers';
  cardDesign: string;
  scratchArea: {
    width: number;
    height: number;
    position: { x: number; y: number };
  };
  winProbability: number;
  createdBy: string;
  createdAt: string;
}

export interface SpinWheel {
  id: string;
  name: string;
  description: string;
  segments: SpinWheelSegment[];
  minOrderValue: number;
  maxSpinsPerUser: number;
  totalSpins: number;
  usedSpins: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  targetAudience: 'all' | 'new_users' | 'premium' | 'frequent_buyers';
  wheelDesign: {
    theme: string;
    colors: string[];
    centerImage?: string;
  };
  spinCooldown: number; // hours
  createdBy: string;
  createdAt: string;
}

export interface SpinWheelSegment {
  id: string;
  label: string;
  rewardType: 'discount' | 'cashback' | 'free_item' | 'points' | 'no_reward';
  rewardValue: number;
  probability: number;
  color: string;
  icon?: string;
}

export interface FlashSale {
  id: string;
  name: string;
  description: string;
  saleType: 'time_based' | 'quantity_based' | 'buy_x_get_y' | 'bundle_deal';
  products: FlashSaleProduct[];
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  originalPrice: number;
  salePrice: number;
  startTime: string;
  endTime: string;
  totalQuantity?: number;
  soldQuantity: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  isActive: boolean;
  targetAudience: 'all' | 'new_users' | 'premium' | 'frequent_buyers';
  saleConfig: {
    buyQuantity?: number;
    getQuantity?: number;
    bundleItems?: string[];
    timerDisplay: boolean;
    stockDisplay: boolean;
    urgencyMessages: string[];
  };
  createdBy: string;
  createdAt: string;
}

export interface FlashSaleProduct {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  stock: number;
  sold: number;
  image?: string;
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  subscriptionType: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  price: number;
  originalPrice: number;
  discount: number;
  duration: number; // in days
  features: string[];
  products: SubscriptionProduct[];
  deliverySchedule: {
    frequency: 'weekly' | 'bi_weekly' | 'monthly';
    preferredDay: string;
    timeSlot: string;
  };
  isActive: boolean;
  totalSubscribers: number;
  activeSubscribers: number;
  targetAudience: 'all' | 'new_users' | 'premium' | 'frequent_buyers';
  benefits: {
    freeDelivery: boolean;
    prioritySupport: boolean;
    exclusiveDeals: boolean;
    customization: boolean;
  };
  createdBy: string;
  createdAt: string;
}

export interface SubscriptionProduct {
  id: string;
  name: string;
  category: string;
  quantity: string;
  price: number;
  isOptional: boolean;
  image?: string;
}

export interface OfferNotification {
  id: string;
  title: string;
  message: string;
  notificationType: 'push' | 'sms' | 'email' | 'in_app';
  targetAudience: 'all' | 'new_users' | 'premium' | 'frequent_buyers' | 'custom';
  customSegment?: {
    minOrderValue?: number;
    maxOrderValue?: number;
    location?: string[];
    ageRange?: { min: number; max: number };
    lastOrderDays?: number;
  };
  offerDetails: {
    offerType: 'discount' | 'cashback' | 'free_delivery' | 'free_item' | 'flash_sale';
    value: number;
    unit: string;
    validFrom: string;
    validTo: string;
    minOrderValue?: number;
    maxDiscount?: number;
  };
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  totalRecipients: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  createdAt: string;
}

export interface CouponCode {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_delivery' | 'buy_x_get_y';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  targetAudience: 'all' | 'new_users' | 'premium' | 'frequent_buyers';
  applicableProducts: string[];
  excludedProducts: string[];
  stackable: boolean;
  autoGenerated: boolean;
  generationRules?: {
    prefix?: string;
    suffix?: string;
    length: number;
    includeNumbers: boolean;
    includeLetters: boolean;
    excludeSimilar: boolean;
  };
  createdBy: string;
  createdAt: string;
}

export interface InAppCurrency {
  id: string;
  name: string;
  symbol: string;
  description: string;
  exchangeRate: number; // 1 INR = X currency units
  minPurchase: number;
  maxPurchase: number;
  bonusRules: BonusRule[];
  isActive: boolean;
  totalIssued: number;
  totalRedeemed: number;
  walletConfig: WalletConfig;
  createdBy: string;
  createdAt: string;
}

export interface BonusRule {
  id: string;
  minAmount: number;
  bonusPercentage: number;
  bonusAmount: number;
  description: string;
}

export interface WalletConfig {
  theme: 'default' | 'premium' | 'festive' | 'minimal';
  primaryColor: string;
  secondaryColor: string;
  backgroundImage?: string;
  showBalance: boolean;
  showTransactionHistory: boolean;
  enableNotifications: boolean;
  autoTopup: {
    enabled: boolean;
    threshold: number;
    amount: number;
  };
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit' | 'bonus' | 'refund';
  amount: number;
  description: string;
  orderId?: string;
  balanceBefore: number;
  balanceAfter: number;
  timestamp: string;
}

export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  referrerReward: ReferralReward;
  refereeReward: ReferralReward;
  conditions: ReferralConditions;
  customization: ReferralCustomization;
  totalReferrals: number;
  successfulReferrals: number;
  totalRewards: number;
  createdBy: string;
  createdAt: string;
}

export interface ReferralReward {
  type: 'cashback' | 'discount' | 'free_delivery' | 'points' | 'free_item';
  value: number;
  unit: string;
  maxReward?: number;
  conditions?: string[];
}

export interface ReferralConditions {
  minOrderValue: number;
  validityDays: number;
  maxReferrals?: number;
  requireFirstOrder: boolean;
  allowSelfReferral: boolean;
}

export interface ReferralCustomization {
  shareMessage: string;
  shareImage?: string;
  landingPageTitle: string;
  landingPageDescription: string;
  buttonText: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  socialPlatforms: string[];
}

export interface Hub {
  id: string;
  name: string;
  code: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  contactInfo: {
    phone: string;
    email: string;
    manager: string;
  };
  operatingHours: {
    open: string;
    close: string;
    workingDays: string[];
  };
  capacity: {
    storage: number;
    dailyOrders: number;
    staff: number;
  };
  deliveryRadius?: number;
  selectedZones?: string[];
  deliverySlots?: string[];
  isActive: boolean;
  connectedStores: string[];
  createdBy: string;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  description?: string;
  storeType: 'retail' | 'warehouse' | 'pickup_point';
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  contactInfo: {
    phone: string;
    email: string;
    manager: string;
  };
  operatingHours: {
    open: string;
    close: string;
    workingDays: string[];
  };
  capacity: {
    storage: number;
    dailyOrders: number;
    staff: number;
  };
  hubId: string;
  deliveryRadius: number;
  selectedZones?: string[];
  deliverySlots?: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  zoneId?: string;
}

export interface CuttingType {
  id: string;
  name: string;
  description: string;
  category: 'fish' | 'chicken' | 'mutton' | 'other';
  moduleType: 'hub' | 'store';
  method: string;
  imageUrl?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}
