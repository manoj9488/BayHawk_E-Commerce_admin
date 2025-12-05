export type UserRole = "super_admin" | "procurement" | "packing" | "delivery" | "custom"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  status: "active" | "inactive"
  createdAt: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    phone: string
    email: string
    address: string
  }
  items: OrderItem[]
  status: "received" | "processing" | "packed" | "out_for_delivery" | "delivered" | "cancelled"
  source: "app" | "web" | "whatsapp" | "instagram" | "facebook" | "manual"
  paymentMethod: "cod" | "online" | "wallet"
  paymentStatus: "pending" | "paid" | "failed"
  total: number
  deliverySlot: string
  assignedTo?: string
  hub: string
  zone: string
  createdAt: string
  updatedAt: string
  history?: OrderHistory[]
}

export interface OrderHistory {
  status: string
  timestamp: string
  updatedBy?: string
  note?: string
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
  unit: string
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  unit: string
  stock: number
  lowStockThreshold: number
  status: "active" | "inactive"
  image?: string
  description?: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  department: "packing" | "procurement" | "delivery" | "admin"
  status: "active" | "inactive"
  assignedOrders: number
  completedOrders: number
  rating?: number
  hub: string
}

export interface DeliveryAgent extends TeamMember {
  vehicleType: string
  vehicleNumber: string
  verified: boolean
  currentLocation?: { lat: number; lng: number }
}

export interface Report {
  id: string
  name: string
  type: "packing" | "procurement" | "labeling" | "stock" | "sales" | "delivery"
  period: "daily" | "weekly" | "monthly"
  generatedAt: string
  status: "ready" | "generating" | "failed"
  downloadUrl?: string
}

export interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrderValue: number
  maxDiscount?: number
  validFrom: string
  validTo: string
  usageLimit: number
  usedCount: number
  status: "active" | "inactive" | "expired"
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "push" | "in_app" | "sms" | "email"
  targetAudience: "all" | "specific" | "segment"
  sentAt?: string
  status: "draft" | "scheduled" | "sent"
  scheduledFor?: string
}

export interface Hub {
  id: string
  name: string
  address: string
  zones: string[]
  status: "active" | "inactive"
}

export interface DashboardStats {
  totalOrders: number
  totalSales: number
  totalUsers: number
  totalProducts: number
  pendingOrders: number
  lowStockItems: number
  activeDeliveries: number
  todayOrders: number
}
