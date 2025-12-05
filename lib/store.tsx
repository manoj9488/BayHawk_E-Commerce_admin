"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Order, Product, TeamMember, Coupon, Hub } from "./types"
import { mockOrders, mockProducts, mockTeamMembers, mockCoupons, mockHubs, mockDashboardStats } from "./mock-data"
import { toast } from "sonner"

// Audit log type
export interface AuditLog {
  id: string
  action: string
  category: "order" | "product" | "user" | "settings" | "team" | "coupon"
  entityId: string
  entityName: string
  user: { name: string; role: string }
  changes: { field: string; oldValue: string; newValue: string }[]
  timestamp: Date
  ipAddress: string
  canRestore: boolean
}

// Customer type
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  ordersCount: number
  totalSpent: number
  status: "active" | "inactive"
  createdAt: string
}

// Delivery Agent type
export interface DeliveryAgent {
  id: string
  name: string
  email: string
  phone: string
  vehicleType: string
  vehicleNumber: string
  status: "active" | "inactive" | "on_delivery"
  verified: boolean
  rating: number
  completedDeliveries: number
  hub: string
  currentOrders: number
}

// Notification type
export interface Notification {
  id: string
  title: string
  message: string
  type: "push" | "sms" | "email"
  targetAudience: string
  status: "draft" | "scheduled" | "sent"
  scheduledAt?: string
  sentAt?: string
  recipients: number
}

// Delivery Slot type
export interface DeliverySlot {
  id: string
  name: string
  startTime: string
  endTime: string
  maxOrders: number
  currentOrders: number
  status: "active" | "inactive"
  days: string[]
}

// Stock Movement type
export interface StockMovement {
  id: string
  productId: string
  productName: string
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  user: string
  timestamp: Date
}

// Initial customers
const initialCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Rajesh Kumar",
    email: "rajesh@email.com",
    phone: "+91 98765 43210",
    address: "123, Gandhi Street, Chennai",
    ordersCount: 45,
    totalSpent: 12500,
    status: "active",
    createdAt: "2023-06-15",
  },
  {
    id: "CUST-002",
    name: "Priya Sharma",
    email: "priya@email.com",
    phone: "+91 87654 32109",
    address: "456, Nehru Road, Chennai",
    ordersCount: 28,
    totalSpent: 8900,
    status: "active",
    createdAt: "2023-07-20",
  },
  {
    id: "CUST-003",
    name: "Anand Pillai",
    email: "anand@email.com",
    phone: "+91 76543 21098",
    address: "789, MG Road, Chennai",
    ordersCount: 15,
    totalSpent: 4500,
    status: "active",
    createdAt: "2023-09-10",
  },
]

// Initial delivery agents
const initialDeliveryAgents: DeliveryAgent[] = [
  {
    id: "DEL-001",
    name: "Suresh Kumar",
    email: "suresh@delivery.com",
    phone: "+91 98765 11111",
    vehicleType: "Bike",
    vehicleNumber: "TN-01-AB-1234",
    status: "active",
    verified: true,
    rating: 4.8,
    completedDeliveries: 1456,
    hub: "Chennai Central",
    currentOrders: 3,
  },
  {
    id: "DEL-002",
    name: "Ravi Shankar",
    email: "ravi@delivery.com",
    phone: "+91 98765 22222",
    vehicleType: "Bike",
    vehicleNumber: "TN-01-CD-5678",
    status: "on_delivery",
    verified: true,
    rating: 4.6,
    completedDeliveries: 890,
    hub: "Chennai South",
    currentOrders: 5,
  },
  {
    id: "DEL-003",
    name: "Kumar M",
    email: "kumar@delivery.com",
    phone: "+91 98765 33333",
    vehicleType: "Scooter",
    vehicleNumber: "TN-02-EF-9012",
    status: "active",
    verified: false,
    rating: 4.2,
    completedDeliveries: 234,
    hub: "Chennai North",
    currentOrders: 2,
  },
]

// Initial notifications
const initialNotifications: Notification[] = [
  {
    id: "NOT-001",
    title: "Flash Sale!",
    message: "Get 20% off on all vegetables today!",
    type: "push",
    targetAudience: "All Users",
    status: "sent",
    sentAt: "2024-01-15T10:00:00Z",
    recipients: 5000,
  },
  {
    id: "NOT-002",
    title: "New Products",
    message: "Check out our new organic products",
    type: "push",
    targetAudience: "Premium Users",
    status: "scheduled",
    scheduledAt: "2024-01-20T09:00:00Z",
    recipients: 1200,
  },
]

// Initial delivery slots
const initialDeliverySlots: DeliverySlot[] = [
  {
    id: "SLOT-001",
    name: "Early Morning",
    startTime: "06:00",
    endTime: "08:00",
    maxOrders: 50,
    currentOrders: 35,
    status: "active",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: "SLOT-002",
    name: "Morning",
    startTime: "08:00",
    endTime: "10:00",
    maxOrders: 75,
    currentOrders: 60,
    status: "active",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    id: "SLOT-003",
    name: "Late Morning",
    startTime: "10:00",
    endTime: "12:00",
    maxOrders: 100,
    currentOrders: 85,
    status: "active",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    id: "SLOT-004",
    name: "Afternoon",
    startTime: "14:00",
    endTime: "16:00",
    maxOrders: 80,
    currentOrders: 45,
    status: "active",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: "SLOT-005",
    name: "Evening",
    startTime: "16:00",
    endTime: "18:00",
    maxOrders: 90,
    currentOrders: 70,
    status: "active",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    id: "SLOT-006",
    name: "Night",
    startTime: "18:00",
    endTime: "20:00",
    maxOrders: 60,
    currentOrders: 40,
    status: "inactive",
    days: ["Fri", "Sat", "Sun"],
  },
]

// Initial audit logs
const initialAuditLogs: AuditLog[] = [
  {
    id: "1",
    action: "Order Status Updated",
    category: "order",
    entityId: "ORD-001",
    entityName: "Order #ORD-001",
    user: { name: "Admin User", role: "Super Admin" },
    changes: [{ field: "status", oldValue: "packed", newValue: "out_for_delivery" }],
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    ipAddress: "192.168.1.100",
    canRestore: true,
  },
  {
    id: "2",
    action: "Product Price Changed",
    category: "product",
    entityId: "PRD-045",
    entityName: "Fresh Tomatoes",
    user: { name: "Procurement Lead", role: "Procurement" },
    changes: [{ field: "price", oldValue: "₹40", newValue: "₹45" }],
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    ipAddress: "192.168.1.105",
    canRestore: true,
  },
  {
    id: "3",
    action: "User Deactivated",
    category: "user",
    entityId: "USR-089",
    entityName: "Rajesh Kumar",
    user: { name: "Admin User", role: "Super Admin" },
    changes: [{ field: "status", oldValue: "active", newValue: "deactivated" }],
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    ipAddress: "192.168.1.100",
    canRestore: true,
  },
  {
    id: "4",
    action: "Delivery Slot Modified",
    category: "settings",
    entityId: "SLOT-003",
    entityName: "Evening Slot",
    user: { name: "Operations Manager", role: "Operations" },
    changes: [{ field: "startTime", oldValue: "4:00 PM", newValue: "5:00 PM" }],
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    ipAddress: "192.168.1.110",
    canRestore: true,
  },
  {
    id: "5",
    action: "New Team Member Added",
    category: "team",
    entityId: "TM-012",
    entityName: "Priya Sharma",
    user: { name: "HR Manager", role: "HR" },
    changes: [{ field: "department", oldValue: "-", newValue: "Delivery" }],
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    ipAddress: "192.168.1.115",
    canRestore: false,
  },
]

interface StoreContextType {
  // Data
  orders: Order[]
  products: Product[]
  teamMembers: TeamMember[]
  coupons: Coupon[]
  hubs: Hub[]
  customers: Customer[]
  deliveryAgents: DeliveryAgent[]
  notifications: Notification[]
  deliverySlots: DeliverySlot[]
  auditLogs: AuditLog[]
  stockMovements: StockMovement[]
  dashboardStats: typeof mockDashboardStats

  // Order actions
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  deleteOrder: (id: string) => void

  // Product actions
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Team actions
  addTeamMember: (member: TeamMember) => void
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void
  deleteTeamMember: (id: string) => void

  // Coupon actions
  addCoupon: (coupon: Coupon) => void
  updateCoupon: (id: string, updates: Partial<Coupon>) => void
  deleteCoupon: (id: string) => void

  // Hub actions
  addHub: (hub: Hub) => void
  updateHub: (id: string, updates: Partial<Hub>) => void
  deleteHub: (id: string) => void

  // Customer actions
  addCustomer: (customer: Customer) => void
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  // Delivery Agent actions
  addDeliveryAgent: (agent: DeliveryAgent) => void
  updateDeliveryAgent: (id: string, updates: Partial<DeliveryAgent>) => void
  deleteDeliveryAgent: (id: string) => void

  // Notification actions
  addNotification: (notification: Notification) => void
  updateNotification: (id: string, updates: Partial<Notification>) => void
  deleteNotification: (id: string) => void

  // Delivery Slot actions
  addDeliverySlot: (slot: DeliverySlot) => void
  updateDeliverySlot: (id: string, updates: Partial<DeliverySlot>) => void
  deleteDeliverySlot: (id: string) => void

  // Audit log actions
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp" | "ipAddress">) => void
  restoreAuditLog: (id: string) => void

  // Stock actions
  addStockMovement: (movement: Omit<StockMovement, "id" | "timestamp">) => void
  updateProductStock: (productId: string, quantity: number, type: "add" | "remove" | "set") => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)
  const [hubs, setHubs] = useState<Hub[]>(mockHubs)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>(initialDeliveryAgents)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>(initialDeliverySlots)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs)
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [dashboardStats] = useState(mockDashboardStats)

  // Helper to add audit log
  const addAuditLog = useCallback((log: Omit<AuditLog, "id" | "timestamp" | "ipAddress">) => {
    const newLog: AuditLog = {
      ...log,
      id: `audit-${Date.now()}`,
      timestamp: new Date(),
      ipAddress: "192.168.1.100",
    }
    setAuditLogs((prev) => [newLog, ...prev])
  }, [])

  // Order actions
  const addOrder = useCallback(
    (order: Order) => {
      setOrders((prev) => [order, ...prev])
      addAuditLog({
        action: "Order Created",
        category: "order",
        entityId: order.orderNumber,
        entityName: `Order #${order.orderNumber}`,
        user: { name: "Admin User", role: "Super Admin" },
        changes: [{ field: "status", oldValue: "-", newValue: order.status }],
        canRestore: false,
      })
    },
    [addAuditLog],
  )

  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order)),
    )
  }, [])

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id))
  }, [])

  // Product actions
  const addProduct = useCallback(
    (product: Product) => {
      setProducts((prev) => [product, ...prev])
      addAuditLog({
        action: "Product Created",
        category: "product",
        entityId: product.sku,
        entityName: product.name,
        user: { name: "Admin User", role: "Super Admin" },
        changes: [{ field: "stock", oldValue: "-", newValue: String(product.stock) }],
        canRestore: false,
      })
    },
    [addAuditLog],
  )

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...updates } : product)))
  }, [])

  const deleteProduct = useCallback(
    (id: string) => {
      const product = products.find((p) => p.id === id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      if (product) {
        addAuditLog({
          action: "Product Deleted",
          category: "product",
          entityId: product.sku,
          entityName: product.name,
          user: { name: "Admin User", role: "Super Admin" },
          changes: [{ field: "status", oldValue: "active", newValue: "deleted" }],
          canRestore: true,
        })
      }
    },
    [products, addAuditLog],
  )

  // Team member actions
  const addTeamMember = useCallback(
    (member: TeamMember) => {
      setTeamMembers((prev) => [member, ...prev])
      addAuditLog({
        action: "Team Member Added",
        category: "team",
        entityId: member.id,
        entityName: member.name,
        user: { name: "Admin User", role: "Super Admin" },
        changes: [{ field: "department", oldValue: "-", newValue: member.department }],
        canRestore: false,
      })
    },
    [addAuditLog],
  )

  const updateTeamMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) => prev.map((member) => (member.id === id ? { ...member, ...updates } : member)))
  }, [])

  const deleteTeamMember = useCallback((id: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== id))
  }, [])

  // Coupon actions
  const addCoupon = useCallback(
    (coupon: Coupon) => {
      setCoupons((prev) => [coupon, ...prev])
      addAuditLog({
        action: "Coupon Created",
        category: "coupon",
        entityId: coupon.id,
        entityName: coupon.code,
        user: { name: "Admin User", role: "Super Admin" },
        changes: [
          { field: "discount", oldValue: "-", newValue: `${coupon.value}${coupon.type === "percentage" ? "%" : "₹"}` },
        ],
        canRestore: false,
      })
    },
    [addAuditLog],
  )

  const updateCoupon = useCallback((id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((coupon) => (coupon.id === id ? { ...coupon, ...updates } : coupon)))
  }, [])

  const deleteCoupon = useCallback((id: string) => {
    setCoupons((prev) => prev.filter((coupon) => coupon.id !== id))
  }, [])

  // Hub actions
  const addHub = useCallback((hub: Hub) => {
    setHubs((prev) => [hub, ...prev])
  }, [])

  const updateHub = useCallback((id: string, updates: Partial<Hub>) => {
    setHubs((prev) => prev.map((hub) => (hub.id === id ? { ...hub, ...updates } : hub)))
  }, [])

  const deleteHub = useCallback((id: string) => {
    setHubs((prev) => prev.filter((hub) => hub.id !== id))
  }, [])

  // Customer actions
  const addCustomer = useCallback((customer: Customer) => {
    setCustomers((prev) => [customer, ...prev])
  }, [])

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }, [])

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // Delivery Agent actions
  const addDeliveryAgent = useCallback((agent: DeliveryAgent) => {
    setDeliveryAgents((prev) => [agent, ...prev])
  }, [])

  const updateDeliveryAgent = useCallback((id: string, updates: Partial<DeliveryAgent>) => {
    setDeliveryAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }, [])

  const deleteDeliveryAgent = useCallback((id: string) => {
    setDeliveryAgents((prev) => prev.filter((a) => a.id !== id))
  }, [])

  // Notification actions
  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev])
  }, [])

  const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)))
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  // Delivery Slot actions
  const addDeliverySlot = useCallback(
    (slot: DeliverySlot) => {
      setDeliverySlots((prev) => [slot, ...prev])
      addAuditLog({
        action: "Delivery Slot Created",
        category: "settings",
        entityId: slot.id,
        entityName: slot.name,
        user: { name: "Admin User", role: "Super Admin" },
        changes: [{ field: "time", oldValue: "-", newValue: `${slot.startTime} - ${slot.endTime}` }],
        canRestore: false,
      })
    },
    [addAuditLog],
  )

  const updateDeliverySlot = useCallback((id: string, updates: Partial<DeliverySlot>) => {
    setDeliverySlots((prev) => prev.map((slot) => (slot.id === id ? { ...slot, ...updates } : slot)))
  }, [])

  const deleteDeliverySlot = useCallback((id: string) => {
    setDeliverySlots((prev) => prev.filter((slot) => slot.id !== id))
  }, [])

  // Restore audit log
  const restoreAuditLog = useCallback(
    (id: string) => {
      const log = auditLogs.find((l) => l.id === id)
      if (log) {
        toast.success(`Restored: ${log.entityName}`)
        setAuditLogs((prev) => prev.map((l) => (l.id === id ? { ...l, canRestore: false } : l)))
      }
    },
    [auditLogs],
  )

  // Stock movement
  const addStockMovement = useCallback((movement: Omit<StockMovement, "id" | "timestamp">) => {
    const newMovement: StockMovement = {
      ...movement,
      id: `MOV-${Date.now()}`,
      timestamp: new Date(),
    }
    setStockMovements((prev) => [newMovement, ...prev])
  }, [])

  const updateProductStock = useCallback((productId: string, quantity: number, type: "add" | "remove" | "set") => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          let newStock = product.stock
          if (type === "add") newStock += quantity
          else if (type === "remove") newStock = Math.max(0, newStock - quantity)
          else newStock = quantity
          return { ...product, stock: newStock }
        }
        return product
      }),
    )
  }, [])

  const value: StoreContextType = {
    orders,
    products,
    teamMembers,
    coupons,
    hubs,
    customers,
    deliveryAgents,
    notifications,
    deliverySlots,
    auditLogs,
    stockMovements,
    dashboardStats,
    addOrder,
    updateOrder,
    deleteOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    addHub,
    updateHub,
    deleteHub,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addDeliveryAgent,
    updateDeliveryAgent,
    deleteDeliveryAgent,
    addNotification,
    updateNotification,
    deleteNotification,
    addDeliverySlot,
    updateDeliverySlot,
    deleteDeliverySlot,
    addAuditLog,
    restoreAuditLog,
    addStockMovement,
    updateProductStock,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
