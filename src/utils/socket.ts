import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => console.log('Socket connected'));
    this.socket.on('disconnect', () => console.log('Socket disconnected'));
    this.socket.on('error', (err) => console.error('Socket error:', err));

    // Re-register all listeners on reconnect
    this.socket.on('connect', () => {
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((cb) => this.socket?.on(event, cb));
      });
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  on<T>(event: string, callback: (data: T) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as (data: unknown) => void);
    this.socket?.on(event, callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback as (data: unknown) => void);
      this.socket?.off(event, callback);
    };
  }

  emit(event: string, data?: unknown) {
    this.socket?.emit(event, data);
  }

  // Join specific rooms
  joinRoom(room: string) {
    this.socket?.emit('join', room);
  }

  leaveRoom(room: string) {
    this.socket?.emit('leave', room);
  }
}

export const socketService = new SocketService();

// Event types
export interface OrderUpdateEvent {
  orderId: string;
  status: string;
  updatedAt: string;
}

export interface NewOrderEvent {
  order: {
    id: string;
    customerName: string;
    totalAmount: number;
    source: string;
  };
}

export interface StockUpdateEvent {
  productId: string;
  variantId: string;
  newStock: number;
}

export interface DeliveryUpdateEvent {
  orderId: string;
  agentId: string;
  location: { lat: number; lng: number };
  status: string;
}

// Hook for using socket in components
import { useEffect } from 'react';

export function useSocket<T>(event: string, callback: (data: T) => void) {
  useEffect(() => {
    const unsubscribe = socketService.on(event, callback);
    return unsubscribe;
  }, [event, callback]);
}

// Predefined event hooks
export function useNewOrders(callback: (data: NewOrderEvent) => void) {
  useSocket('new_order', callback);
}

export function useOrderUpdates(callback: (data: OrderUpdateEvent) => void) {
  useSocket('order_update', callback);
}

export function useStockUpdates(callback: (data: StockUpdateEvent) => void) {
  useSocket('stock_update', callback);
}

export function useDeliveryTracking(callback: (data: DeliveryUpdateEvent) => void) {
  useSocket('delivery_update', callback);
}
