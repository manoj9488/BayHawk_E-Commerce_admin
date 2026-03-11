import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  loginType: z.enum(['hub', 'store', 'super_admin']),
  locationId: z.string().optional(),
  role: z.string().optional(),
});

// Order schemas
export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().regex(/^\+91\s?\d{10}$/, 'Invalid phone number'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  addressType: z.enum(['home', 'work', 'other']),
  deliverySlot: z.string().min(1, 'Select delivery slot'),
  paymentMethod: z.enum(['cod', 'online', 'wallet']),
  source: z.enum(['whatsapp', 'instagram', 'facebook', 'manual']),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string(),
    quantity: z.number().min(1),
  })).min(1, 'Add at least one item'),
});

// Product schemas
export const productSchema = z.object({
  nameEn: z.string().min(2, 'English name is required'),
  nameTa: z.string().min(2, 'Tamil name is required'),
  sku: z.string().optional(),
  category: z.enum(['fish', 'prawns', 'crab', 'squid', 'lobster', 'chicken', 'mutton', 'egg', 'spices']),
  description: z.string().optional(),
  deliveryType: z.enum(['same_day', 'next_day', 'exotic']),
  sourceType: z.enum(['hub', 'store']),
  isBestSeller: z.boolean().default(false),
  isRare: z.boolean().default(false),
  isActive: z.boolean().default(true),
  variants: z.array(z.object({
    type: z.string().min(1, 'Type is required'),
    size: z.string().min(1, 'Size is required'),
    grossWeight: z.string(),
    netWeight: z.string(),
    pieces: z.string(),
    serves: z.string(),
    price: z.number().min(1, 'Price is required'),
    stock: z.number().min(0),
    discount: z.number().min(0).max(100).optional(),
  })).min(1, 'Add at least one variant'),
});

// Team member schema
export const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+91\s?\d{10}$/, 'Invalid phone number'),
  department: z.string().min(1, 'Select department'),
  role: z.enum(['hub_main_admin', 'hub_procurement', 'hub_cutting_cleaning', 'hub_packing', 'hub_dispatch', 'hub_delivery', 'store_main_admin', 'store_procurement', 'store_cutting_cleaning', 'store_packing', 'store_dispatch', 'store_delivery']),
  locationId: z.string().min(1, 'Select location'),
});

// Delivery agent schema
export const deliveryAgentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^\+91\s?\d{10}$/, 'Invalid phone number'),
  vehicleNo: z.string().min(5, 'Vehicle number is required'),
});

// Coupon schema
export const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(20),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.number().min(1, 'Discount value is required'),
  minOrderValue: z.number().min(0),
  maxDiscount: z.number().optional(),
  validFrom: z.string().min(1, 'Start date is required'),
  validTo: z.string().min(1, 'End date is required'),
  usageLimit: z.number().min(1),
});

// Zone schema
export const zoneSchema = z.object({
  name: z.string().min(2, 'Zone name is required'),
  pincodes: z.string().min(6, 'Add at least one pincode'),
});

// Store schema
export const storeSchema = z.object({
  name: z.string().min(2, 'Store name is required'),
  code: z.string().min(3, 'Code is required'),
  description: z.string().optional(),
  storeType: z.enum(['retail', 'warehouse', 'pickup_point']),
  address: z.object({
    street: z.string().min(5, 'Street is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
    country: z.string().min(2, 'Country is required'),
  }),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  contactInfo: z.object({
    phone: z.string().regex(/^\+91\s?\d{10}$/, 'Invalid phone number'),
    email: z.string().email('Invalid email'),
    manager: z.string().min(2, 'Manager name is required'),
  }),
  operatingHours: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    workingDays: z.array(z.string()).min(1, 'Select at least one working day'),
  }),
  capacity: z.object({
    storage: z.number().min(0),
    dailyOrders: z.number().min(0),
    staff: z.number().min(0),
  }),
  hubId: z.string().min(1, 'Hub is required'),
  deliveryRadius: z.number().min(0),
  assignAllSlots: z.boolean().optional(),
  deliverySlots: z.array(z.string()).optional(),
  isActive: z.boolean(),
  zoneId: z.string().optional(),
});

// Wallet credit schema
export const walletCreditSchema = z.object({
  customerSearch: z.string().min(3, 'Enter customer phone or email'),
  amount: z.number().min(1, 'Amount must be at least ₹1'),
  reason: z.enum(['refund', 'compensation', 'promotion', 'other']),
  notes: z.string().optional(),
});

// FAQ schema
export const faqSchema = z.object({
  category: z.string().min(1, 'Select category'),
  question: z.string().min(10, 'Question is required'),
  answer: z.string().min(20, 'Answer is required'),
  keywords: z.string().optional(),
  isPublished: z.boolean().default(false),
});

// Recipe schema
export const recipeSchema = z.object({
  name: z.string().min(3, 'Recipe name is required'),
  description: z.string().min(10, 'Description is required'),
  category: z.string().min(1, 'Select category'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  prepTime: z.number().min(1),
  cookTime: z.number().min(1),
  serves: z.number().min(1),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    quantity: z.string().min(1),
    productId: z.string().optional(),
  })).min(1, 'Add at least one ingredient'),
  instructions: z.array(z.string().min(5)).min(1, 'Add at least one step'),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type DeliveryAgentInput = z.infer<typeof deliveryAgentSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type ZoneInput = z.infer<typeof zoneSchema>;
export type StoreInput = z.infer<typeof storeSchema>;
export type WalletCreditInput = z.infer<typeof walletCreditSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
export type RecipeInput = z.infer<typeof recipeSchema>;
