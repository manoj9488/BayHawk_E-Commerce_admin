import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button, 
  Input, 
  Select, 
  Modal, 
  PageHeader, 
  ActionButtons,
  LoadingWrapper,
  EmptyState,
  Card,
  Badge,
  StatsGrid
} from '../../components/ui';
import { StatusBadge } from '../../components/common';
import { OrdersList } from '../../components/features/orders/OrdersList';
import { OrderDetails } from '../../components/features/orders/OrderDetails';
import { ThirdPartyDeliveryModal } from '../../components/features/orders/ThirdPartyDeliveryModal';
import { BatchDeliveryAssignmentModal } from '../../components/features/orders/BatchDeliveryAssignmentModal';
import { DeliveryPartnerAssignment } from '../../components/features/orders/DeliveryPartnerAssignment';
import { OrderLocationSwitch } from '../../components/features/orders/OrderLocationSwitch';
import { AddressSelector } from '../../components/features/orders/AddressSelector';
import { PackedPhotoUpload } from '../../components/features/orders/PackedPhotoUpload';
import { SurgeCharges } from '../../components/features/orders/SurgeCharges';
import { RefundRecordModal } from '../../components/features/orders/RefundRecordModal';
import { RefundHistory } from '../../components/features/orders/RefundHistory';
import { ShoppingCart, Fish, Store, Package, TrendingUp, Clock, CheckCircle, Printer, Download, MapPin, Tag, Truck, Receipt, RotateCcw } from 'lucide-react';
import { ordersApi } from '../../utils/api';
import { createOrderSchema, type CreateOrderInput } from '../../utils/validations';
import { useOrderUpdates, useNewOrders, type OrderUpdateEvent, type NewOrderEvent } from '../../utils/socket';
import { useLoading } from '../../hooks/useLoading';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { filterDataByModule } from '../../utils/rbac';
import type { Order } from '../../types';

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'hub' | 'store'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showThirdPartyModal, setShowThirdPartyModal] = useState(false);
  const [thirdPartyOrderId, setThirdPartyOrderId] = useState<string>('');
  const [showBatchDeliveryModal, setShowBatchDeliveryModal] = useState(false);
  const [batchOrderIds, setBatchOrderIds] = useState<string[]>([]);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const { isLoading, withLoading } = useLoading(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { addressType: 'home', paymentMethod: 'cod', source: 'manual', items: [] },
  });

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await ordersApi.getAll();
      const payload = response?.data?.data ?? response?.data;
      setOrders(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error('Failed to load orders', error);
      setOrders([]);
      /* mock fallback removed
        // Hub Orders
        {
          id: 'HUB-001',
          invoiceNumber: 'INV-2024-001',
          customerId: '1',
          customerName: 'Rajesh Kumar',
          customerPhone: '+91 9876543210',
          customerEmail: 'rajesh.kumar@email.com',
          billingAddress: {
            street: '123 Marina Beach Road',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600001',
            country: 'India'
          },
          shippingAddress: {
            street: '123 Marina Beach Road, Apt 4B',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600001',
            country: 'India'
          },
          deliveryInstructions: 'Please call before delivery. Ring the bell twice.',
          promoCode: 'FISH20',
          discountAmount: 90,
          deliveryCharges: 50,
          gstAmount: 81,
          subtotalAmount: 450,
          source: 'app',
          status: 'processing',
          paymentStatus: 'paid',
          paymentMethod: 'online',
          items: [
            { productId: '1', productName: 'Seer Fish (Vanjaram)', variant: 'Medium Cut', quantity: 1, price: 450 }
          ],
          totalAmount: 491,
          paidAmount: 491,
          pendingAmount: 0,
          paymentRecords: [
            {
              id: 'payment_001',
              orderId: 'HUB-001',
              amount: 491,
              paymentMethod: 'upi',
              paymentMode: 'full',
              transactionId: 'UPI123456789',
              referenceNumber: 'REF001',
              notes: 'Full payment received via UPI',
              receivedBy: 'Admin User',
              receivedAt: new Date(Date.now() - 3600000).toISOString(),
              status: 'confirmed',
              attachments: []
            }
          ],
          deliverySlot: '10:00 AM - 12:00 PM',
          orderType: 'regular',
          moduleType: 'hub',
          hubId: 'hub_1',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'HUB-002',
          invoiceNumber: 'INV-2024-002',
          customerId: '2',
          customerName: 'Arun Patel',
          customerPhone: '+91 9876543212',
          customerEmail: 'arun.patel@email.com',
          billingAddress: {
            street: '456 T. Nagar Main Road',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600017',
            country: 'India'
          },
          deliveryInstructions: 'Leave at security gate if not available.',
          promoCode: 'NEWUSER',
          discountAmount: 60,
          deliveryCharges: 0,
          gstAmount: 108,
          subtotalAmount: 600,
          source: 'whatsapp',
          status: 'packed',
          paymentStatus: 'paid',
          paymentMethod: 'cod',
          items: [
            { productId: '2', productName: 'King Fish', variant: 'Steaks', quantity: 2, price: 600 }
          ],
          totalAmount: 648,
          paidAmount: 648,
          refundedAmount: 100,
          netAmount: 548,
          refundRecords: [
            {
              id: 'refund_001',
              orderId: 'HUB-002',
              amount: 100,
              refundType: 'partial',
              refundMethod: 'original_payment',
              reason: 'Customer requested partial refund due to quality issue with one piece',
              transactionId: 'REF123456789',
              referenceNumber: 'REFUND001',
              notes: 'Partial refund processed for quality issue',
              processedBy: 'Admin User',
              processedAt: new Date(Date.now() - 1800000).toISOString(),
              approvedBy: 'Manager',
              approvedAt: new Date(Date.now() - 1800000).toISOString(),
              status: 'completed',
              attachments: []
            }
          ],
          deliverySlot: '2:00 PM - 4:00 PM',
          orderType: 'regular',
          moduleType: 'hub',
          hubId: 'hub_1',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'HUB-003',
          invoiceNumber: 'INV-2024-003',
          customerId: '3',
          customerName: 'Lakshmi Devi',
          customerPhone: '+91 9876543213',
          customerEmail: 'lakshmi.devi@email.com',
          shippingAddress: {
            street: '789 Anna Salai, Near Landmark',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600002',
            country: 'India'
          },
          deliveryCharges: 40,
          gstAmount: 144,
          subtotalAmount: 800,
          source: 'website',
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'online',
          items: [
            { productId: '3', productName: 'Pomfret', variant: 'Whole Fish', quantity: 1, price: 800 }
          ],
          totalAmount: 984,
          deliverySlot: '7:00 AM - 9:00 AM',
          orderType: 'regular',
          moduleType: 'hub',
          hubId: 'hub_1',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        // Store Orders
        {
          id: 'STR-001',
          invoiceNumber: 'INV-2024-004',
          customerId: '4',
          customerName: 'Priya Sharma',
          customerPhone: '+91 9876543211',
          customerEmail: 'priya.sharma@email.com',
          billingAddress: {
            street: '321 Velachery Main Road',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600042',
            country: 'India'
          },
          shippingAddress: {
            street: '321 Velachery Main Road, Block C, Flat 201',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600042',
            country: 'India'
          },
          deliveryInstructions: 'Deliver between 6-7 PM only. Contact before arrival.',
          promoCode: 'COMBO50',
          discountAmount: 80,
          deliveryCharges: 30,
          gstAmount: 144,
          subtotalAmount: 800,
          source: 'app',
          status: 'received',
          paymentStatus: 'partial',
          paymentMethod: 'cod',
          items: [
            { productId: '4', productName: 'Chicken Curry Cut', variant: '1kg', quantity: 1, price: 280 },
            { productId: '5', productName: 'Tiger Prawns', variant: 'Large', quantity: 1, price: 520 }
          ],
          totalAmount: 894,
          paidAmount: 400,
          pendingAmount: 494,
          paymentRecords: [
            {
              id: 'payment_002',
              orderId: 'STR-001',
              amount: 400,
              paymentMethod: 'cash',
              paymentMode: 'advance',
              transactionId: '',
              referenceNumber: 'ADV001',
              notes: 'Advance payment received in cash',
              receivedBy: 'Store Manager',
              receivedAt: new Date(Date.now() - 1200000).toISOString(),
              status: 'confirmed',
              attachments: []
            }
          ],
          deliverySlot: '6:00 PM - 8:00 PM',
          orderType: 'regular',
          moduleType: 'store',
          storeId: 'store_1',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: 'STR-002',
          invoiceNumber: 'INV-2024-005',
          customerId: '5',
          customerName: 'Karthik Raj',
          customerPhone: '+91 9876543214',
          customerEmail: 'karthik.raj@email.com',
          billingAddress: {
            street: '654 OMR Road, Thoraipakkam',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600097',
            country: 'India'
          },
          deliveryInstructions: 'Ring doorbell. Apartment is on 3rd floor.',
          deliveryCharges: 25,
          gstAmount: 96.12,
          subtotalAmount: 534,
          source: 'instagram',
          status: 'processing',
          paymentStatus: 'paid',
          paymentMethod: 'online',
          items: [
            { productId: '6', productName: 'Mutton Curry Cut', variant: '500g', quantity: 1, price: 450 },
            { productId: '7', productName: 'Eggs', variant: '12 pieces', quantity: 1, price: 84 }
          ],
          totalAmount: 655.12,
          deliverySlot: '10:00 AM - 12:00 PM',
          orderType: 'regular',
          moduleType: 'store',
          storeId: 'store_2',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 'STR-003',
          invoiceNumber: 'INV-2024-006',
          customerId: '6',
          customerName: 'Meera Nair',
          customerPhone: '+91 9876543215',
          customerEmail: 'meera.nair@email.com',
          shippingAddress: {
            street: '987 ECR Road, Sholinganallur',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600119',
            country: 'India'
          },
          deliveryInstructions: 'Please handle seafood with care. Keep refrigerated.',
          promoCode: 'SEAFOOD15',
          discountAmount: 67.5,
          deliveryCharges: 35,
          gstAmount: 81,
          subtotalAmount: 450,
          source: 'facebook',
          status: 'out_for_delivery',
          paymentStatus: 'refunded',
          paymentMethod: 'online',
          items: [
            { productId: '8', productName: 'Crab', variant: 'Medium Size', quantity: 2, price: 400 },
            { productId: '9', productName: 'Spices Mix', variant: 'Fish Curry', quantity: 1, price: 50 }
          ],
          totalAmount: 498.5,
          paidAmount: 498.5,
          refundedAmount: 498.5,
          netAmount: 0,
          refundRecords: [
            {
              id: 'refund_002',
              orderId: 'STR-003',
              amount: 498.5,
              refundType: 'full',
              refundMethod: 'original_payment',
              reason: 'Order cancelled by customer before delivery',
              itemsRefunded: [
                {
                  productId: '8',
                  productName: 'Crab',
                  variant: 'Medium Size',
                  quantity: 2,
                  refundAmount: 400
                },
                {
                  productId: '9',
                  productName: 'Spices Mix',
                  variant: 'Fish Curry',
                  quantity: 1,
                  refundAmount: 50
                }
              ],
              transactionId: 'REF987654321',
              referenceNumber: 'REFUND002',
              notes: 'Full refund processed due to order cancellation',
              processedBy: 'Store Manager',
              processedAt: new Date(Date.now() - 3600000).toISOString(),
              approvedBy: 'Store Admin',
              approvedAt: new Date(Date.now() - 3600000).toISOString(),
              status: 'completed',
              attachments: []
            }
          ],
          deliverySlot: '4:00 PM - 6:00 PM',
          orderType: 'regular',
          moduleType: 'store',
          storeId: 'store_1',
          createdAt: new Date(Date.now() - 10800000).toISOString(),
        }
      */
    }
  }, []);

  useEffect(() => {
    withLoading(fetchOrders);
  }, [fetchOrders, withLoading]);
  // Filter orders based on user's module access
  const filteredOrders = filterDataByModule(orders, user);

  // Real-time order updates
  const handleOrderUpdate = useCallback((data: OrderUpdateEvent) => {
    setOrders((prev) => prev.map((o) => o.id === data.orderId ? { ...o, status: data.status as Order['status'] } : o));
  }, []);
  useOrderUpdates(handleOrderUpdate);

  // Real-time new orders
  const handleNewOrder = useCallback((data: NewOrderEvent) => {
    const newOrder: Order = {
      id: data.order.id,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      customerId: '',
      customerName: data.order.customerName,
      customerPhone: '',
      source: data.order.source as Order['source'],
      status: 'received',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      items: [],
      totalAmount: data.order.totalAmount,
      deliverySlot: '',
      orderType: 'regular',
      moduleType: 'store',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  }, []);
  useNewOrders(handleNewOrder);

  // Create order
  const onCreateOrder = async (data: CreateOrderInput) => {
    try {
      await ordersApi.create(data);
      setShowCreateModal(false);
      reset();
      await fetchOrders();
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  // Order actions
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowEditModal(true);
  };

  const handleUpdateOrder = async (updatedOrder: Partial<Order>) => {
    if (!editingOrder) return;
    
    try {
      // Update order via API
      await ordersApi.update(editingOrder.id, updatedOrder);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id 
          ? { ...order, ...updatedOrder }
          : order
      ));
      
      setShowEditModal(false);
      setEditingOrder(null);
    } catch (error) {
      // For demo purposes, update locally
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id 
          ? { ...order, ...updatedOrder }
          : order
      ));
      
      setShowEditModal(false);
      setEditingOrder(null);
      console.log('Order updated successfully');
    }
  };

  const handlePaymentRecord = async (orderId: string, paymentData: any) => {
    try {
      // Create payment record
      const paymentRecord = {
        id: `payment_${Date.now()}`,
        orderId: orderId,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        paymentMode: paymentData.paymentMode,
        transactionId: paymentData.transactionId,
        referenceNumber: paymentData.referenceNumber,
        notes: paymentData.notes,
        receivedBy: user?.name || 'System',
        receivedAt: new Date().toISOString(),
        status: 'confirmed' as const,
        attachments: []
      };

      // Update order with payment record
      setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
          const currentPaid = order.paidAmount || 0;
          const newPaidAmount = currentPaid + paymentData.amount;
          const newPendingAmount = order.totalAmount - newPaidAmount;
          
          let newPaymentStatus: Order['paymentStatus'] = 'pending';
          if (newPendingAmount <= 0) {
            newPaymentStatus = 'paid';
          } else if (newPaidAmount > 0) {
            newPaymentStatus = 'partial';
          }

          return {
            ...order,
            paidAmount: newPaidAmount,
            pendingAmount: Math.max(0, newPendingAmount),
            paymentStatus: newPaymentStatus,
            paymentRecords: [...(order.paymentRecords || []), paymentRecord]
          };
        }
        return order;
      }));

      // Update selectedOrder if it's the same order
      if (selectedOrder?.id === orderId) {
        const updatedOrder = orders.find(o => o.id === orderId);
        if (updatedOrder) {
          const newPaidAmount = (updatedOrder.paidAmount || 0) + paymentData.amount;
          const newPendingAmount = Math.max(0, updatedOrder.totalAmount - newPaidAmount);
          const newPaymentStatus = newPendingAmount <= 0 ? 'paid' : (newPaidAmount > 0 ? 'partial' : 'pending');
          
          setSelectedOrder({
            ...updatedOrder,
            paidAmount: newPaidAmount,
            pendingAmount: newPendingAmount,
            paymentStatus: newPaymentStatus as Order['paymentStatus'],
            paymentRecords: [...(updatedOrder.paymentRecords || []), paymentRecord]
          });
        }
      }

      // Update editingOrder if it's the same order
      if (editingOrder?.id === orderId) {
        const updatedOrder = orders.find(o => o.id === orderId);
        if (updatedOrder) {
          const newPaidAmount = (updatedOrder.paidAmount || 0) + paymentData.amount;
          const newPendingAmount = Math.max(0, updatedOrder.totalAmount - newPaidAmount);
          const newPaymentStatus = newPendingAmount <= 0 ? 'paid' : (newPaidAmount > 0 ? 'partial' : 'pending');
          
          setEditingOrder({
            ...updatedOrder,
            paidAmount: newPaidAmount,
            pendingAmount: newPendingAmount,
            paymentStatus: newPaymentStatus as Order['paymentStatus'],
            paymentRecords: [...(updatedOrder.paymentRecords || []), paymentRecord]
          });
        }
      }

      console.log('Payment recorded successfully');
    } catch (error) {
      console.error('Failed to record payment:', error);
      throw error;
    }
  };

  const handleAssignDeliveryPartner = async (orderId: string, agentId: string) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, deliveryAgentId: agentId } : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, deliveryAgentId: agentId });
      }
      
      if (editingOrder?.id === orderId) {
        setEditingOrder({ ...editingOrder, deliveryAgentId: agentId });
      }
      
      console.log(`Assigned delivery partner ${agentId} to order ${orderId}`);
    } catch (error) {
      console.error('Failed to assign delivery partner:', error);
      throw error;
    }
  };

  const handleSwitchLocation = async (orderId: string, type: 'hub' | 'store', locationId: string) => {
    try {
      const updates: Partial<Order> = {
        moduleType: type,
        ...(type === 'hub' ? { hubId: locationId, storeId: undefined } : { storeId: locationId, hubId: undefined })
      };
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, ...updates });
      }
      
      if (editingOrder?.id === orderId) {
        setEditingOrder({ ...editingOrder, ...updates });
      }
      
      console.log(`Switched order ${orderId} to ${type} ${locationId}`);
    } catch (error) {
      console.error('Failed to switch location:', error);
      throw error;
    }
  };

  const handleUpdateAddress = async (orderId: string, address: any) => {
    try {
      const shippingAddress = {
        street: address.line1 + (address.line2 ? `, ${address.line2}` : ''),
        city: address.city,
        state: address.state,
        zipCode: address.pincode,
        country: 'India'
      };
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, shippingAddress } : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, shippingAddress });
      }
      
      if (editingOrder?.id === orderId) {
        setEditingOrder({ ...editingOrder, shippingAddress });
      }
      
      console.log(`Updated address for order ${orderId}`);
    } catch (error) {
      console.error('Failed to update address:', error);
      throw error;
    }
  };

  const handleUploadPackedPhotos = async (orderId: string, photos: File[]) => {
    try {
      // In real implementation, upload photos to server and get URLs
      const photoUrls = photos.map((_, idx) => `https://example.com/photos/${orderId}_${idx}.jpg`);
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, packedPhotos: [...(order.packedPhotos || []), ...photoUrls] }
          : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ 
          ...selectedOrder, 
          packedPhotos: [...(selectedOrder.packedPhotos || []), ...photoUrls] 
        });
      }
      
      if (editingOrder?.id === orderId) {
        setEditingOrder({ 
          ...editingOrder, 
          packedPhotos: [...(editingOrder.packedPhotos || []), ...photoUrls] 
        });
      }
      
      console.log(`Uploaded ${photos.length} photos for order ${orderId}`);
    } catch (error) {
      console.error('Failed to upload photos:', error);
      throw error;
    }
  };

  const handleUpdateSurgeCharges = async (orderId: string, charges: number, reason: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      
      const updates: Partial<Order> = {
        surgeCharges: charges,
        surgeChargesReason: reason,
        totalAmount: (order.subtotalAmount || order.totalAmount) + 
                     (order.deliveryCharges || 0) + 
                     charges + 
                     (order.additionalCharges || 0) + 
                     (order.gstAmount || 0) - 
                     (order.discountAmount || 0)
      };
      
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, ...updates } : o
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, ...updates });
      }
      
      if (editingOrder?.id === orderId) {
        setEditingOrder({ ...editingOrder, ...updates });
      }
      
      console.log(`Updated surge charges for order ${orderId}: ${charges}`);
    } catch (error) {
      console.error('Failed to update surge charges:', error);
      throw error;
    }
  };

  const handleRefundRecord = async (orderId: string, refundData: any) => {
    try {
      // Create refund record
      const refundRecord = {
        id: `refund_${Date.now()}`,
        orderId: orderId,
        amount: refundData.amount,
        refundType: refundData.refundType,
        refundMethod: refundData.refundMethod,
        reason: refundData.reason,
        itemsRefunded: refundData.itemsRefunded,
        transactionId: refundData.transactionId,
        referenceNumber: refundData.referenceNumber,
        notes: refundData.notes,
        processedBy: user?.name || 'System',
        processedAt: new Date().toISOString(),
        approvedBy: user?.name || 'System',
        approvedAt: new Date().toISOString(),
        status: 'completed' as const,
        attachments: []
      };

      // Update order with refund record
      setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
          const currentRefunded = order.refundedAmount || 0;
          const newRefundedAmount = currentRefunded + refundData.amount;
          const newNetAmount = order.totalAmount - newRefundedAmount;
          
          // Update payment status if fully refunded
          let newPaymentStatus = order.paymentStatus;
          if (newRefundedAmount >= order.totalAmount) {
            newPaymentStatus = 'refunded';
          }

          return {
            ...order,
            refundedAmount: newRefundedAmount,
            netAmount: Math.max(0, newNetAmount),
            paymentStatus: newPaymentStatus,
            refundRecords: [...(order.refundRecords || []), refundRecord]
          };
        }
        return order;
      }));

      // Update selectedOrder if it's the same order
      if (selectedOrder?.id === orderId) {
        const updatedOrder = orders.find(o => o.id === orderId);
        if (updatedOrder) {
          const newRefundedAmount = (updatedOrder.refundedAmount || 0) + refundData.amount;
          const newNetAmount = updatedOrder.totalAmount - newRefundedAmount;
          
          setSelectedOrder({
            ...updatedOrder,
            refundedAmount: newRefundedAmount,
            netAmount: Math.max(0, newNetAmount),
            paymentStatus: newRefundedAmount >= updatedOrder.totalAmount ? 'refunded' : updatedOrder.paymentStatus,
            refundRecords: [...(updatedOrder.refundRecords || []), refundRecord]
          });
        }
      }

      // Update editingOrder if it's the same order
      if (editingOrder?.id === orderId) {
        const updatedOrder = orders.find(o => o.id === orderId);
        if (updatedOrder) {
          const newRefundedAmount = (updatedOrder.refundedAmount || 0) + refundData.amount;
          const newNetAmount = updatedOrder.totalAmount - newRefundedAmount;
          
          setEditingOrder({
            ...updatedOrder,
            refundedAmount: newRefundedAmount,
            netAmount: Math.max(0, newNetAmount),
            paymentStatus: newRefundedAmount >= updatedOrder.totalAmount ? 'refunded' : updatedOrder.paymentStatus,
            refundRecords: [...(updatedOrder.refundRecords || []), refundRecord]
          });
        }
      }

      console.log('Refund recorded successfully');
    } catch (error) {
      console.error('Failed to record refund:', error);
      throw error;
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    if (!confirm(`Are you sure you want to delete order ${order.id}? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete order via API
      await ordersApi.cancel(order.id, '');
      
      // Update local state
      setOrders(prev => prev.filter(o => o.id !== order.id));
    } catch (error) {
      // For demo purposes, delete locally
      setOrders(prev => prev.filter(o => o.id !== order.id));
      console.log('Order deleted successfully');
    }
  };

  // Third-party delivery handler
  const handleThirdPartyDelivery = (details: any) => {
    setOrders(prev => prev.map(order => 
      order.id === thirdPartyOrderId
        ? { ...order, thirdPartyDelivery: details }
        : order
    ));
    console.log(`Assigned third-party delivery for order ${thirdPartyOrderId}`, details);
  };

  // Mock delivery agents
  const deliveryAgents = [
    { id: 'agent-1', name: 'Rajesh Kumar', agentType: 'employee' as const },
    { id: 'agent-2', name: 'Amit Sharma', agentType: 'employee' as const },
    { id: 'agent-3', name: 'Priya Patel', agentType: 'partner' as const },
    { id: 'agent-4', name: 'Suresh Reddy', agentType: 'partner' as const },
  ];

  // Batch delivery handler
  const handleBatchDeliveryAssignment = (data: { agentId: string; pricePerOrder?: number }) => {
    const agent = deliveryAgents.find(a => a.id === data.agentId);
    console.log(`Assigned ${batchOrderIds.length} orders to ${agent?.name}`, {
      agentType: agent?.agentType,
      pricePerOrder: data.pricePerOrder,
      totalAmount: data.pricePerOrder ? data.pricePerOrder * batchOrderIds.length : 0
    });
    // Update orders with delivery agent assignment
    setOrders(prev => prev.map(order => 
      batchOrderIds.includes(order.id)
        ? { ...order, deliveryAgentId: data.agentId }
        : order
    ));
  };

  // Bulk actions handler
  const handleBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      switch (actionId) {
        case 'assign-batch-delivery':
          // Open batch delivery modal
          setBatchOrderIds(selectedIds);
          setShowBatchDeliveryModal(true);
          break;

        case 'assign-third-party-delivery':
          // Open modal for first selected order (for single assignment)
          if (selectedIds.length === 1) {
            setThirdPartyOrderId(selectedIds[0]);
            setShowThirdPartyModal(true);
          } else {
            alert('Please select only one order to assign third-party delivery');
          }
          break;

        case 'update-status':
          // Update status for selected orders
          setOrders(prev => prev.map(order => 
            selectedIds.includes(order.id) 
              ? { ...order, status: data.status as Order['status'] }
              : order
          ));
          console.log(`Updated status to ${data.status} for ${selectedIds.length} orders`);
          break;

        case 'update-delivery-slot':
          // Update delivery slot for selected orders
          setOrders(prev => prev.map(order => 
            selectedIds.includes(order.id) 
              ? { ...order, deliverySlot: data.deliverySlot }
              : order
          ));
          console.log(`Updated delivery slot for ${selectedIds.length} orders`);
          break;

        case 'mark-priority':
          // Mark orders as priority (this would typically update a priority field)
          console.log(`Marked ${selectedIds.length} orders as ${data.priority} priority`);
          break;

        case 'send-notification':
          // Send notification to customers
          console.log(`Sent ${data.type} notification to ${selectedIds.length} customers`);
          break;

        case 'delete':
          // Delete selected orders
          setOrders(prev => prev.filter(order => !selectedIds.includes(order.id)));
          console.log(`Deleted ${selectedIds.length} orders`);
          break;

        default:
          console.log(`Bulk action ${actionId} performed on ${selectedIds.length} orders`, data);
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    }
  };

  // Filter orders based on active tab and date
  const tabFilteredOrders = filteredOrders.filter(order => {
    // Tab filter
    if (activeTab !== 'all' && order.moduleType !== activeTab) return false;
    
    // Date filter
    if (dateFilter.startDate || dateFilter.endDate) {
      const orderDate = new Date(order.createdAt);
      if (dateFilter.startDate && orderDate < new Date(dateFilter.startDate)) return false;
      if (dateFilter.endDate) {
        const endDate = new Date(dateFilter.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }
    }
    
    return true;
  });

  // Calculate statistics using RBAC filtered orders
  const hubOrders = filteredOrders.filter(order => order.moduleType === 'hub');
  const storeOrders = filteredOrders.filter(order => order.moduleType === 'store');
  
  const hubStats = {
    total: hubOrders.length,
    revenue: hubOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    pending: hubOrders.filter(order => ['received', 'processing'].includes(order.status)).length,
    delivered: hubOrders.filter(order => order.status === 'delivered').length,
  };
  
  const storeStats = {
    total: storeOrders.length,
    revenue: storeOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    pending: storeOrders.filter(order => ['received', 'processing'].includes(order.status)).length,
    delivered: storeOrders.filter(order => order.status === 'delivered').length,
  };

  const handleExport = async () => {
    try {
      const params: any = { export: 'csv' };
      if (activeTab !== 'all') {
        params.moduleType = activeTab;
      }
      const response = await ordersApi.getAll(params);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}-orders-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Determine which tabs to show based on user type
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'all', label: 'All Orders', icon: ShoppingCart, count: filteredOrders.length },
      { id: 'hub', label: 'Hub Orders', icon: Fish, count: hubOrders.length },
      { id: 'store', label: 'Store Orders', icon: Store, count: storeOrders.length },
    ];

    if (user?.loginType === 'hub') {
      return allTabs.filter(tab => tab.id === 'hub');
    } else if (user?.loginType === 'store') {
      return allTabs.filter(tab => tab.id === 'store');
    } else {
      // Super admin sees all tabs
      return allTabs;
    }
  };

  const tabs = getAvailableTabs();

  // Set default active tab based on user type
  useState(() => {
    const defaultTab = user?.loginType === 'hub' ? 'hub' : user?.loginType === 'store' ? 'store' : 'all';
    setActiveTab(defaultTab as 'all' | 'hub' | 'store');
  });

  return (
    <LoadingWrapper isLoading={isLoading} type="page" text="Loading orders..." variant="branded">
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title={
            user?.loginType === 'hub' ? 'Hub Orders Management' : 
            user?.loginType === 'store' ? 'Store Orders Management' : 
            'All Orders Management'
          }
          description={
            user?.loginType === 'hub' ? 'Manage and track hub orders and deliveries' : 
            user?.loginType === 'store' ? 'Manage and track store orders and deliveries' : 
            'Manage and track orders across Hub and Store operations'
          }
          actions={
            <ActionButtons
              onDownload={handleExport}
              onRefresh={() => withLoading(fetchOrders)}
              downloadLabel={`Export ${activeTab === 'all' ? 'All' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders`}
            />
          }
        />

        {/* Tab Navigation */}
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-4">
              {/* Tabs on the left */}
              <nav className="flex overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'all' | 'hub' | 'store')}
                      className={`
                        flex items-center gap-2 py-2 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap
                        ${isActive
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                      <Badge variant={isActive ? 'info' : 'default'} className="ml-1 text-xs">
                        {tab.count}
                      </Badge>
                    </button>
                  );
                })}
              </nav>

              {/* Date Filter on the right */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                  placeholder="Start Date"
                  className="w-36 text-sm"
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                  placeholder="End Date"
                  className="w-36 text-sm"
                />
                {(dateFilter.startDate || dateFilter.endDate) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDateFilter({ startDate: '', endDate: '' })}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="p-4 sm:p-6">
            {activeTab === 'all' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Hub Statistics */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Fish className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-blue-900">Hub Orders</h3>
                      <p className="text-xs sm:text-sm text-blue-700">Fish products • Next day delivery</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-blue-900">{hubStats.total}</p>
                      <p className="text-xs sm:text-sm text-blue-700">Total Orders</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-blue-900">{formatCurrency(hubStats.revenue)}</p>
                      <p className="text-xs sm:text-sm text-blue-700">Revenue</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-orange-600">{hubStats.pending}</p>
                      <p className="text-xs sm:text-sm text-blue-700">Pending</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-green-600">{hubStats.delivered}</p>
                      <p className="text-xs sm:text-sm text-blue-700">Delivered</p>
                    </div>
                  </div>
                </div>

                {/* Store Statistics */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-green-600 flex items-center justify-center">
                      <Store className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-green-900">Store Orders</h3>
                      <p className="text-xs sm:text-sm text-green-700">All products • Same/Next day delivery</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-green-900">{storeStats.total}</p>
                      <p className="text-xs sm:text-sm text-green-700">Total Orders</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-green-900">{formatCurrency(storeStats.revenue)}</p>
                      <p className="text-xs sm:text-sm text-green-700">Revenue</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-orange-600">{storeStats.pending}</p>
                      <p className="text-xs sm:text-sm text-green-700">Pending</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-green-600">{storeStats.delivered}</p>
                      <p className="text-xs sm:text-sm text-green-700">Delivered</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hub' && (
              <StatsGrid
                stats={[
                  { label: 'Total Hub Orders', value: hubStats.total, icon: Package, color: 'blue' },
                  { label: 'Hub Revenue', value: formatCurrency(hubStats.revenue), icon: TrendingUp, color: 'green' },
                  { label: 'Pending Orders', value: hubStats.pending, icon: Clock, color: 'orange' },
                  { label: 'Delivered Orders', value: hubStats.delivered, icon: CheckCircle, color: 'green' },
                ]}
                columns={2}
                className="mb-4 sm:mb-6"
              />
            )}

            {activeTab === 'store' && (
              <StatsGrid
                stats={[
                  { label: 'Total Store Orders', value: storeStats.total, icon: Package, color: 'green' },
                  { label: 'Store Revenue', value: formatCurrency(storeStats.revenue), icon: TrendingUp, color: 'green' },
                  { label: 'Pending Orders', value: storeStats.pending, icon: Clock, color: 'orange' },
                  { label: 'Delivered Orders', value: storeStats.delivered, icon: CheckCircle, color: 'green' },
                ]}
                columns={2}
                className="mb-4 sm:mb-6"
              />
            )}
          </div>
        </Card>

        {/* Orders List */}
        {tabFilteredOrders.length === 0 ? (
          <EmptyState
            icon={activeTab === 'hub' ? Fish : activeTab === 'store' ? Store : ShoppingCart}
            title={`No ${activeTab === 'all' ? '' : activeTab} orders found`}
            description={`No ${activeTab === 'all' ? '' : activeTab} orders are currently available. Orders will appear here once customers place them.`}
          />
        ) : (
          <OrdersList
            orders={tabFilteredOrders}
            loading={isLoading}
            onView={handleViewOrder}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onRefresh={() => withLoading(fetchOrders)}
            onBulkAction={handleBulkAction}
          />
        )}

        {/* Create Order Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Order" size="lg">
          <form onSubmit={handleSubmit(onCreateOrder)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Customer Name" 
                {...register('customerName')} 
                placeholder="Full Name" 
                error={errors.customerName?.message} 
              />
              <Input 
                label="Phone Number" 
                {...register('customerPhone')} 
                placeholder="+91 9876543210" 
                error={errors.customerPhone?.message} 
              />
            </div>
            
            <Input 
              label="Email (Optional)" 
              {...register('customerEmail')} 
              type="email" 
              placeholder="customer@email.com" 
            />

            {/* Order Type Selection */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-3 text-gray-900">Order Type</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center p-3 border-2 border-blue-200 bg-blue-50 rounded-lg">
                  <Fish className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">Hub Order</p>
                    <p className="text-xs text-blue-700">Fish products • Next day delivery</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border-2 border-green-200 bg-green-50 rounded-lg">
                  <Store className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-900">Store Order</p>
                    <p className="text-xs text-green-700">All products • Same/Next day</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Delivery Address</h3>
              <div className="space-y-3">
                <Input 
                  label="Address Line 1" 
                  {...register('addressLine1')} 
                  placeholder="House no, Building name, Street" 
                  error={errors.addressLine1?.message} 
                />
                <Input 
                  label="Address Line 2 (Optional)" 
                  {...register('addressLine2')} 
                  placeholder="Landmark, Area" 
                />
                <div className="grid grid-cols-3 gap-3">
                  <Input 
                    label="Pincode" 
                    {...register('pincode')} 
                    placeholder="600001" 
                    error={errors.pincode?.message} 
                  />
                  <Input 
                    label="City" 
                    {...register('city')} 
                    placeholder="Chennai" 
                    error={errors.city?.message} 
                  />
                  <Input 
                    label="State" 
                    {...register('state')} 
                    placeholder="Tamil Nadu" 
                    error={errors.state?.message} 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                label="Delivery Slot" 
                {...register('deliverySlot')} 
                error={errors.deliverySlot?.message} 
                options={[
                  { value: '', label: 'Select Slot' }, 
                  { value: 'slot1', label: 'Slot 1 (7AM-9AM)' }, 
                  { value: 'slot2', label: 'Slot 2 (1PM-3PM)' }, 
                  { value: 'slot3', label: 'Slot 3 (7PM-9PM)' }
                ]} 
              />
              <Select 
                label="Payment Method" 
                {...register('paymentMethod')} 
                error={errors.paymentMethod?.message} 
                options={[
                  { value: 'cod', label: 'Cash on Delivery' }, 
                  { value: 'online', label: 'Online Payment' }
                ]} 
              />
            </div>
            
            <Select 
              label="Order Source" 
              {...register('source')} 
              error={errors.source?.message} 
              options={[
                { value: 'whatsapp', label: 'WhatsApp' }, 
                { value: 'instagram', label: 'Instagram' }, 
                { value: 'facebook', label: 'Facebook' }, 
                { value: 'manual', label: 'Manual' }
              ]} 
            />
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowCreateModal(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Order
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Order Modal */}
        <Modal 
          isOpen={showEditModal} 
          onClose={() => {
            setShowEditModal(false);
            setEditingOrder(null);
          }} 
          title={`Edit Order - ${editingOrder?.id}`}
          size="xl"
        >
          {editingOrder && (
            <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
              {/* Header with Print/Download Invoice */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{editingOrder.id}</h2>
                  <p className="text-sm text-gray-600">
                    Placed on {formatDateTime(editingOrder.createdAt)}
                  </p>
                  {editingOrder.invoiceNumber && (
                    <p className="text-sm text-blue-600 font-medium">
                      Invoice: {editingOrder.invoiceNumber}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={editingOrder.status} />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => alert(`Printing invoice for order ${editingOrder.id}...`)}
                      className="flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      <span className="hidden sm:inline">Print Invoice</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => alert(`Downloading invoice for order ${editingOrder.id}...`)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download Invoice</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Status-based restrictions info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Editing Restrictions</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• <strong>Products:</strong> Can be modified at any time</p>
                  <p>• <strong>Delivery Slot:</strong> {['out_for_delivery', 'delivered'].includes(editingOrder.status) ? 'Cannot be modified after dispatch' : 'Can be modified'}</p>
                  <p>• <strong>Customer Info:</strong> {editingOrder.status === 'delivered' ? 'Cannot be modified after delivery' : 'Can be modified'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Order Status and Payment */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                        <select
                          value={editingOrder.status}
                          onChange={(e) => setEditingOrder({
                            ...editingOrder,
                            status: e.target.value as Order['status']
                          })}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="received">Received</option>
                          <option value="processing">Processing</option>
                          <option value="packed">Packed</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                        <select
                          value={editingOrder.paymentStatus}
                          onChange={(e) => setEditingOrder({
                            ...editingOrder,
                            paymentStatus: e.target.value as Order['paymentStatus']
                          })}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="partial">Partially Paid</option>
                          <option value="paid">Paid</option>
                          <option value="refunded">Refunded</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment Tracking */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Payment Tracking</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(editingOrder.totalAmount)}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Paid Amount</p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(editingOrder.paidAmount || 0)}</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Pending Amount</p>
                          <p className="text-lg font-bold text-orange-600">{formatCurrency((editingOrder.totalAmount - (editingOrder.paidAmount || 0)))}</p>
                        </div>
                      </div>
                      
                      {(editingOrder.totalAmount - (editingOrder.paidAmount || 0)) > 0 && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(editingOrder);
                            setShowEditModal(false);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Record Payment
                        </Button>
                      )}
                      
                      {editingOrder.paymentRecords && editingOrder.paymentRecords.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-700 mb-2">Payment History ({editingOrder.paymentRecords.length} records)</p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {editingOrder.paymentRecords.map((record, idx) => (
                              <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                                <div className="flex justify-between">
                                  <span className="font-medium">{formatCurrency(record.amount)}</span>
                                  <span className="text-gray-600">{record.paymentMethod}</span>
                                </div>
                                <div className="text-gray-500 mt-1">{formatDateTime(record.receivedAt)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Refund Tracking */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <RotateCcw className="h-5 w-5 text-red-600" />
                      Refund Tracking
                    </h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Original Amount</p>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(editingOrder.totalAmount)}</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Refunded Amount</p>
                          <p className="text-lg font-bold text-red-600">{formatCurrency(editingOrder.refundedAmount || 0)}</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Net Amount</p>
                          <p className="text-lg font-bold text-blue-600">{formatCurrency(editingOrder.totalAmount - (editingOrder.refundedAmount || 0))}</p>
                        </div>
                      </div>
                      
                      {(editingOrder.paidAmount || 0) > 0 && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setShowRefundModal(true)}
                          className="w-full"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Record Refund
                        </Button>
                      )}
                      
                      {editingOrder.refundRecords && editingOrder.refundRecords.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <RefundHistory refundRecords={editingOrder.refundRecords} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                        <input
                          type="text"
                          value={editingOrder.customerName}
                          onChange={(e) => setEditingOrder({
                            ...editingOrder,
                            customerName: e.target.value
                          })}
                          disabled={editingOrder.status === 'delivered'}
                          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            editingOrder.status === 'delivered' 
                              ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' 
                              : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="text"
                          value={editingOrder.customerPhone}
                          onChange={(e) => setEditingOrder({
                            ...editingOrder,
                            customerPhone: e.target.value
                          })}
                          disabled={editingOrder.status === 'delivered'}
                          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            editingOrder.status === 'delivered' 
                              ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' 
                              : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={editingOrder.customerEmail || ''}
                          onChange={(e) => setEditingOrder({
                            ...editingOrder,
                            customerEmail: e.target.value
                          })}
                          disabled={editingOrder.status === 'delivered'}
                          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            editingOrder.status === 'delivered' 
                              ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' 
                              : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Slot</label>
                        <select
                          value={editingOrder.deliverySlot}
                          onChange={(e) => setEditingOrder({
                            ...editingOrder,
                            deliverySlot: e.target.value
                          })}
                          disabled={['out_for_delivery', 'delivered'].includes(editingOrder.status)}
                          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            ['out_for_delivery', 'delivered'].includes(editingOrder.status) 
                              ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' 
                              : 'border-gray-300'
                          }`}
                        >
                          <option value="7:00 AM - 9:00 AM">7:00 AM - 9:00 AM</option>
                          <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                          <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                          <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                          <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Assign Delivery Partner */}
                  <DeliveryPartnerAssignment
                    orderId={editingOrder.id}
                    currentAgentId={editingOrder.deliveryAgentId}
                    onAssign={(agentId) => handleAssignDeliveryPartner(editingOrder.id, agentId)}
                  />

                  {/* Switch Hub/Store Location */}
                  <OrderLocationSwitch
                    orderId={editingOrder.id}
                    currentType={editingOrder.moduleType}
                    currentLocationId={editingOrder.hubId || editingOrder.storeId}
                    onSwitch={(type, locationId) => handleSwitchLocation(editingOrder.id, type, locationId)}
                  />

                  {/* Address Selector */}
                  <AddressSelector
                    customerId={editingOrder.customerId}
                    currentAddress={editingOrder.shippingAddress as any}
                    onSelect={(address) => handleUpdateAddress(editingOrder.id, address)}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Order Items */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Order Items</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">Always editable</span>
                        <span className="text-blue-600 text-xs">Items: {editingOrder.items?.length || 0}</span>
                      </div>
                    </div>
                    
                    {editingOrder.items && editingOrder.items.length > 0 ? (
                      <div className="space-y-3">
                        {editingOrder.items.map((item, index) => (
                          <div key={index} className="border rounded-lg p-3 bg-gray-50">
                            <div className="space-y-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Product Name</label>
                                <input
                                  type="text"
                                  value={item.productName}
                                  onChange={(e) => {
                                    const updatedItems = [...editingOrder.items!];
                                    updatedItems[index] = { ...item, productName: e.target.value };
                                    setEditingOrder({
                                      ...editingOrder,
                                      items: updatedItems
                                    });
                                  }}
                                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Variant</label>
                                  <input
                                    type="text"
                                    value={item.variant}
                                    onChange={(e) => {
                                      const updatedItems = [...editingOrder.items!];
                                      updatedItems[index] = { ...item, variant: e.target.value };
                                      setEditingOrder({
                                        ...editingOrder,
                                        items: updatedItems
                                      });
                                    }}
                                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Qty</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const updatedItems = [...editingOrder.items!];
                                      const newQuantity = parseInt(e.target.value) || 1;
                                      updatedItems[index] = { ...item, quantity: newQuantity };
                                      
                                      // Recalculate subtotal
                                      const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                      const discount = editingOrder.discountAmount || 0;
                                      const delivery = editingOrder.deliveryCharges || 0;
                                      const gst = editingOrder.gstAmount || (newSubtotal * 0.18);
                                      const newTotal = newSubtotal - discount + delivery + gst;
                                      
                                      setEditingOrder({
                                        ...editingOrder,
                                        items: updatedItems,
                                        subtotalAmount: newSubtotal,
                                        gstAmount: gst,
                                        totalAmount: newTotal
                                      });
                                    }}
                                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Price</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.price}
                                    onChange={(e) => {
                                      const updatedItems = [...editingOrder.items!];
                                      const newPrice = parseFloat(e.target.value) || 0;
                                      updatedItems[index] = { ...item, price: newPrice };
                                      
                                      // Recalculate subtotal
                                      const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                      const discount = editingOrder.discountAmount || 0;
                                      const delivery = editingOrder.deliveryCharges || 0;
                                      const gst = editingOrder.gstAmount || (newSubtotal * 0.18);
                                      const newTotal = newSubtotal - discount + delivery + gst;
                                      
                                      setEditingOrder({
                                        ...editingOrder,
                                        items: updatedItems,
                                        subtotalAmount: newSubtotal,
                                        gstAmount: gst,
                                        totalAmount: newTotal
                                      });
                                    }}
                                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900">
                                  Total: {formatCurrency(item.price * item.quantity)}
                                </span>
                                {editingOrder.items!.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedItems = editingOrder.items!.filter((_, i) => i !== index);
                                      const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                      const discount = editingOrder.discountAmount || 0;
                                      const delivery = editingOrder.deliveryCharges || 0;
                                      const gst = editingOrder.gstAmount || (newSubtotal * 0.18);
                                      const newTotal = newSubtotal - discount + delivery + gst;
                                      
                                      setEditingOrder({
                                        ...editingOrder,
                                        items: updatedItems,
                                        subtotalAmount: newSubtotal,
                                        gstAmount: gst,
                                        totalAmount: newTotal
                                      });
                                    }}
                                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => {
                            const newItem = {
                              productId: `new_${Date.now()}`,
                              productName: 'New Product',
                              variant: 'Standard',
                              quantity: 1,
                              price: 0
                            };
                            setEditingOrder({
                              ...editingOrder,
                              items: [...(editingOrder.items || []), newItem]
                            });
                          }}
                          className="w-full border-2 border-dashed border-blue-300 rounded-lg p-4 text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add New Item
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No items in this order
                      </div>
                    )}
                  </div>

                  {/* Pricing Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Pricing Details</h3>
                    
                    {/* Promo Code */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Promo Code Applied
                        </label>
                        <input
                          type="text"
                          value={editingOrder.promoCode || ''}
                          onChange={(e) => setEditingOrder({
                            ...editingOrder,
                            promoCode: e.target.value
                          })}
                          placeholder="Enter promo code"
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Amount</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingOrder.discountAmount || 0}
                          onChange={(e) => {
                            const discount = parseFloat(e.target.value) || 0;
                            const subtotal = editingOrder.subtotalAmount || 0;
                            const delivery = editingOrder.deliveryCharges || 0;
                            const gst = editingOrder.gstAmount || 0;
                            const newTotal = subtotal - discount + delivery + gst;
                            
                            setEditingOrder({
                              ...editingOrder,
                              discountAmount: discount,
                              totalAmount: newTotal
                            });
                          }}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Charges</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingOrder.deliveryCharges || 0}
                          onChange={(e) => {
                            const delivery = parseFloat(e.target.value) || 0;
                            const subtotal = editingOrder.subtotalAmount || 0;
                            const discount = editingOrder.discountAmount || 0;
                            const gst = editingOrder.gstAmount || 0;
                            const newTotal = subtotal - discount + delivery + gst;
                            
                            setEditingOrder({
                              ...editingOrder,
                              deliveryCharges: delivery,
                              totalAmount: newTotal
                            });
                          }}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GST (18%)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingOrder.gstAmount || 0}
                          onChange={(e) => {
                            const gst = parseFloat(e.target.value) || 0;
                            const subtotal = editingOrder.subtotalAmount || 0;
                            const discount = editingOrder.discountAmount || 0;
                            const delivery = editingOrder.deliveryCharges || 0;
                            const newTotal = subtotal - discount + delivery + gst;
                            
                            setEditingOrder({
                              ...editingOrder,
                              gstAmount: gst,
                              totalAmount: newTotal
                            });
                          }}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="font-medium">
                            {formatCurrency(editingOrder.subtotalAmount || editingOrder.totalAmount)}
                          </span>
                        </div>
                        
                        {editingOrder.promoCode && (
                          <div className="flex justify-between items-center text-green-600">
                            <span className="text-sm">Discount ({editingOrder.promoCode})</span>
                            <span className="font-medium">
                              -{formatCurrency(editingOrder.discountAmount || 0)}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Delivery Charges</span>
                          <span className="font-medium">
                            {editingOrder.deliveryCharges ? formatCurrency(editingOrder.deliveryCharges) : 'Free'}
                          </span>
                        </div>
                        
                        {editingOrder.gstAmount && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">GST (18%)</span>
                            <span className="font-medium">{formatCurrency(editingOrder.gstAmount)}</span>
                          </div>
                        )}
                        
                        <div className="border-t border-gray-300 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Final Amount</span>
                            <span className="text-xl font-bold text-gray-900">
                              {formatCurrency(editingOrder.totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Packed Photos */}
                  <PackedPhotoUpload
                    orderId={editingOrder.id}
                    existingPhotos={editingOrder.packedPhotos || []}
                    onUpload={(photos) => handleUploadPackedPhotos(editingOrder.id, photos)}
                  />

                  {/* Surge & Additional Charges */}
                  <SurgeCharges
                    currentCharges={editingOrder.surgeCharges || 0}
                    onUpdate={(charges, reason) => handleUpdateSurgeCharges(editingOrder.id, charges, reason)}
                  />

                  {/* Billing & Shipping Address */}
                  <div className="space-y-4">
                    {/* Billing Address */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-blue-600" />
                        Billing Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                          <input
                            type="text"
                            value={editingOrder.billingAddress?.street || ''}
                            onChange={(e) => setEditingOrder({
                              ...editingOrder,
                              billingAddress: {
                                ...editingOrder.billingAddress,
                                street: e.target.value,
                                city: editingOrder.billingAddress?.city || '',
                                state: editingOrder.billingAddress?.state || '',
                                zipCode: editingOrder.billingAddress?.zipCode || '',
                                country: editingOrder.billingAddress?.country || 'India'
                              }
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            value={editingOrder.billingAddress?.city || ''}
                            onChange={(e) => setEditingOrder({
                              ...editingOrder,
                              billingAddress: {
                                ...editingOrder.billingAddress,
                                street: editingOrder.billingAddress?.street || '',
                                city: e.target.value,
                                state: editingOrder.billingAddress?.state || '',
                                zipCode: editingOrder.billingAddress?.zipCode || '',
                                country: editingOrder.billingAddress?.country || 'India'
                              }
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            value={editingOrder.billingAddress?.state || ''}
                            onChange={(e) => setEditingOrder({
                              ...editingOrder,
                              billingAddress: {
                                ...editingOrder.billingAddress,
                                street: editingOrder.billingAddress?.street || '',
                                city: editingOrder.billingAddress?.city || '',
                                state: e.target.value,
                                zipCode: editingOrder.billingAddress?.zipCode || '',
                                country: editingOrder.billingAddress?.country || 'India'
                              }
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <input
                            type="text"
                            value={editingOrder.billingAddress?.zipCode || ''}
                            onChange={(e) => setEditingOrder({
                              ...editingOrder,
                              billingAddress: {
                                ...editingOrder.billingAddress,
                                street: editingOrder.billingAddress?.street || '',
                                city: editingOrder.billingAddress?.city || '',
                                state: editingOrder.billingAddress?.state || '',
                                zipCode: e.target.value,
                                country: editingOrder.billingAddress?.country || 'India'
                              }
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            value={editingOrder.billingAddress?.country || 'India'}
                            onChange={(e) => setEditingOrder({
                              ...editingOrder,
                              billingAddress: {
                                ...editingOrder.billingAddress,
                                street: editingOrder.billingAddress?.street || '',
                                city: editingOrder.billingAddress?.city || '',
                                state: editingOrder.billingAddress?.state || '',
                                zipCode: editingOrder.billingAddress?.zipCode || '',
                                country: e.target.value
                              }
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        Shipping Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                          <input
                            type="text"
                            value={editingOrder.shippingAddress?.street || ''}
                            onChange={(e) => setEditingOrder({
                              ...editingOrder,
                              shippingAddress: {
                                ...editingOrder.shippingAddress,
                                street: e.target.value,
                                city: editingOrder.shippingAddress?.city || '',
                                state: editingOrder.shippingAddress?.state || '',
                                zipCode: editingOrder.shippingAddress?.zipCode || '',
                                country: editingOrder.shippingAddress?.country || 'India'
                              }
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            value={editingOrder.shippingAddress?.city || ''}
                            onChange={(e) => setEditingOrder({
                              ...editingOrder,
                              shippingAddress: {
                                ...editingOrder.shippingAddress,
                                street: editingOrder.shippingAddress?.street || '',
                                city: e.target.value,
                                state: editingOrder.shippingAddress?.state || '',
                                zipCode: editingOrder.shippingAddress?.zipCode || '',
                                country: editingOrder.shippingAddress?.country || 'India'
                              }
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            value={editingOrder.shippingAddress?.state || ''}
                            onChange={(e) => setEditingOrder({
                              ...editingOrder,
                              shippingAddress: {
                                ...editingOrder.shippingAddress,
                                street: editingOrder.shippingAddress?.street || '',
                                city: editingOrder.shippingAddress?.city || '',
                                state: e.target.value,
                                zipCode: editingOrder.shippingAddress?.zipCode || '',
                                country: editingOrder.shippingAddress?.country || 'India'
                              }
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <input
                            type="text"
                            value={editingOrder.shippingAddress?.zipCode || ''}
                            onChange={(e) => setEditingOrder({
                              ...editingOrder,
                              shippingAddress: {
                                ...editingOrder.shippingAddress,
                                street: editingOrder.shippingAddress?.street || '',
                                city: editingOrder.shippingAddress?.city || '',
                                state: editingOrder.shippingAddress?.state || '',
                                zipCode: e.target.value,
                                country: editingOrder.shippingAddress?.country || 'India'
                              }
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            value={editingOrder.shippingAddress?.country || 'India'}
                            onChange={(e) => setEditingOrder({
                              ...editingOrder,
                              shippingAddress: {
                                ...editingOrder.shippingAddress,
                                street: editingOrder.shippingAddress?.street || '',
                                city: editingOrder.shippingAddress?.city || '',
                                state: editingOrder.shippingAddress?.state || '',
                                zipCode: editingOrder.shippingAddress?.zipCode || '',
                                country: e.target.value
                              }
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-yellow-600" />
                      Delivery Instructions
                    </h3>
                    <textarea
                      value={editingOrder.deliveryInstructions || ''}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        deliveryInstructions: e.target.value
                      })}
                      placeholder="Enter special delivery instructions..."
                      rows={3}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingOrder(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleUpdateOrder(editingOrder)}
                  className="flex-1"
                >
                  Update Order
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Order Details Modal */}
        <Modal 
          isOpen={!!selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          title={`Order Details - ${selectedOrder?.id}`}
          size="xl"
        >
          {selectedOrder && (
            <OrderDetails 
              order={selectedOrder} 
              onPaymentRecord={(paymentData) => handlePaymentRecord(selectedOrder.id, paymentData)}
              onRefundRecord={(refundData) => handleRefundRecord(selectedOrder.id, refundData)}
              onAssignThirdParty={() => {
                setThirdPartyOrderId(selectedOrder.id);
                setShowThirdPartyModal(true);
              }}
            />
          )}
        </Modal>

        {/* Third-Party Delivery Modal */}
        <ThirdPartyDeliveryModal
          isOpen={showThirdPartyModal}
          onClose={() => {
            setShowThirdPartyModal(false);
            setThirdPartyOrderId('');
          }}
          onSubmit={handleThirdPartyDelivery}
          orderId={thirdPartyOrderId}
        />

        {/* Batch Delivery Assignment Modal */}
        <BatchDeliveryAssignmentModal
          isOpen={showBatchDeliveryModal}
          onClose={() => {
            setShowBatchDeliveryModal(false);
            setBatchOrderIds([]);
          }}
          onSubmit={handleBatchDeliveryAssignment}
          orderCount={batchOrderIds.length}
          agents={deliveryAgents}
        />

        {/* Refund Record Modal */}
        {editingOrder && (
          <RefundRecordModal
            isOpen={showRefundModal}
            onClose={() => setShowRefundModal(false)}
            order={editingOrder}
            onSubmit={async (refundData) => {
              await handleRefundRecord(editingOrder.id, refundData);
              setShowRefundModal(false);
            }}
          />
        )}
      </div>
    </LoadingWrapper>
  );
}
