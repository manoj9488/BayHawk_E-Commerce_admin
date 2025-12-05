import type { Order } from "./types"

export interface Notification {
  id: string
  userId: string
  orderId: string
  title: string
  message: string
  timestamp: string
  read: boolean
}

const statusMessages: Record<Order["status"], { title: string; message: string }> = {
  received: {
    title: "Order Received",
    message: "Your order has been received and is being processed.",
  },
  processing: {
    title: "Order Processing",
    message: "Your order is being prepared by our team.",
  },
  packed: {
    title: "Order Packed",
    message: "Your order has been packed and is ready for delivery.",
  },
  out_for_delivery: {
    title: "Out for Delivery",
    message: "Your order is on the way! Our delivery partner will reach you soon.",
  },
  delivered: {
    title: "Order Delivered",
    message: "Your order has been delivered successfully. Thank you for shopping with us!",
  },
  cancelled: {
    title: "Order Cancelled",
    message: "Your order has been cancelled. If you have any questions, please contact support.",
  },
}

export function sendOrderStatusNotification(order: Order, status: Order["status"]): Notification {
  const statusInfo = statusMessages[status]
  
  const notification: Notification = {
    id: `notif-${Date.now()}`,
    userId: order.customer.phone, // Using phone as user ID
    orderId: order.id,
    title: statusInfo.title,
    message: `${statusInfo.message}\n\nOrder: ${order.orderNumber}\nExpected Delivery: ${order.deliverySlot}`,
    timestamp: new Date().toISOString(),
    read: false,
  }

  // Store notification in localStorage
  if (typeof window !== "undefined") {
    const notifications = JSON.parse(localStorage.getItem("userNotifications") || "[]")
    notifications.push(notification)
    localStorage.setItem("userNotifications", JSON.stringify(notifications))
  }

  // In production, this would send:
  // - Push notification to user's mobile app
  // - SMS to user's phone
  // - WhatsApp message
  // - Email notification
  
  console.log(`📱 Notification sent to ${order.customer.name}:`, notification)
  
  return notification
}

export function getUserNotifications(userId: string): Notification[] {
  if (typeof window === "undefined") return []
  
  const notifications = JSON.parse(localStorage.getItem("userNotifications") || "[]")
  return notifications.filter((n: Notification) => n.userId === userId)
}
