import { useState, useEffect } from 'react';
import { Package, Filter, Download, AlertCircle, Eye, XCircle } from 'lucide-react';
import type { DeliveryEntry, DeliveryFilters } from '../../types/delivery';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DeliveryAdminPage() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<DeliveryEntry[]>([]);
  const [filters, setFilters] = useState<DeliveryFilters>({});
  const [loading, setLoading] = useState(false);
  const [deliveryAgents, setDeliveryAgents] = useState<any[]>([]);
  const [viewProof, setViewProof] = useState<string | null>(null);

  useEffect(() => {
    loadDeliveries();
    loadDeliveryAgents();
  }, [filters]);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      // API call to fetch all deliveries
      // const response = await fetch('/api/delivery', { params: filters });
      // setDeliveries(response.data);
      
      // Mock data
      setDeliveries([
        {
          id: 'DEL001',
          dispatchId: 'DSP001',
          billNumber: 'BH2024001',
          partyName: 'John Doe',
          totalPayment: 1250.00,
          paymentStatus: 'paid',
          paymentMode: 'online',
          status: 'delivered',
          deliveryPersonId: 'DP001',
          deliveryPersonName: 'Ravi Kumar',
          customerAddress: '123 Main Street, Chennai - 600001',
          customerPhone: '+91 9876543210',
          proofImageUrl: 'https://via.placeholder.com/400',
          proofUploadedAt: new Date().toISOString(),
          products: [
            {
              id: 'P1',
              billNumber: 'BH2024001',
              partyName: 'John Doe',
              productName: 'Sea Crab',
              grossWeight: 2.5,
              netWeight: 2.3,
              isAlternate: false,
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]);
    } catch (error) {
      console.error('Failed to load deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveryAgents = async () => {
    try {
      // API call to fetch delivery agents
      // const response = await fetch('/api/delivery-agents');
      // setDeliveryAgents(response.data);
      
      setDeliveryAgents([
        { id: 'DP001', name: 'Ravi Kumar' },
        { id: 'DP002', name: 'Suresh M' },
      ]);
    } catch (error) {
      console.error('Failed to load delivery agents:', error);
    }
  };

  const overrideStatus = async (deliveryId: string, newStatus: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    const confirmOverride = confirm(`Are you sure you want to override status to "${newStatus}"?`);
    if (!confirmOverride) return;

    const remarks = prompt('Enter admin remarks:');
    if (!remarks) {
      alert('Remarks are mandatory for admin override');
      return;
    }

    try {
      // await fetch(`/api/delivery/${deliveryId}/override`, {
      //   method: 'PATCH',
      //   body: { status: newStatus, remarks, updatedBy: user?.id }
      // });

      const updatedDeliveries = deliveries.map(d => {
        if (d.id === deliveryId) {
          return {
            ...d,
            status: newStatus as any,
            remarks: `[ADMIN OVERRIDE] ${remarks}`,
            updatedBy: user?.id,
            updatedAt: new Date().toISOString(),
          };
        }
        return d;
      });
      setDeliveries(updatedDeliveries);
      alert('Status overridden successfully');
    } catch (error) {
      console.error('Failed to override status:', error);
      alert('Failed to override status');
    }
  };

  const exportCSV = () => {
    const headers = ['Bill #', 'Customer', 'Total Payment', 'Payment Mode', 'Payment Status', 'Delivery Person', 'Status', 'Delivery Date', 'Remarks', 'Alternate', 'Proof Status'];
    const rows = deliveries.map(d => [
      d.billNumber,
      d.partyName,
      d.totalPayment,
      d.paymentMode.toUpperCase(),
      d.paymentStatus,
      d.deliveryPersonName,
      d.status,
      new Date(d.updatedAt).toLocaleDateString(),
      d.remarks || '-',
      d.products.some(p => p.isAlternate) ? 'Yes' : 'No',
      d.proofImageUrl ? 'Yes' : 'No'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery_admin_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(18);
    doc.text('Bayhawk - Delivery Management Report', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    if (filters.dateFrom || filters.dateTo) {
      doc.text(`Period: ${filters.dateFrom || 'Start'} to ${filters.dateTo || 'End'}`, 14, 34);
    }

    const tableData = deliveries.map(d => [
      d.billNumber,
      d.partyName,
      d.totalPayment.toFixed(2),
      d.paymentMode.toUpperCase(),
      d.paymentStatus,
      d.deliveryPersonName,
      d.status,
      d.proofImageUrl ? 'Yes' : 'No'
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Bill #', 'Customer', 'Amount', 'Payment Mode', 'Payment Status', 'Delivery Person', 'Status', 'Proof']],
      body: tableData,
    });

    doc.save(`delivery_admin_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dispatched': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'undelivered': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-orange-100 text-orange-800';
      case 'failed_delivery': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold">Delivery Management - Admin</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Person</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.deliveryPerson || ''}
              onChange={(e) => setFilters({ ...filters, deliveryPerson: e.target.value })}
            >
              <option value="">All</option>
              {deliveryAgents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.dateFrom || ''}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.dateTo || ''}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <input
              type="text"
              placeholder="Search customer"
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.customer || ''}
              onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="undelivered">Undelivered</option>
              <option value="returned">Returned</option>
              <option value="failed_delivery">Failed Delivery</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Delivery Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bill #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Products</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Payment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment Mode</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Delivery Person</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Proof</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Remarks</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : deliveries.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-500">No delivery records found</td>
                </tr>
              ) : (
                deliveries.map(delivery => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{delivery.billNumber}</td>
                    <td className="px-4 py-3 text-sm">{delivery.partyName}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="space-y-1">
                        {delivery.products.map(product => (
                          <div key={product.id} className="flex items-center gap-2">
                            <span>{product.productName}</span>
                            {product.isAlternate && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded">
                                <AlertCircle className="w-3 h-3" />
                                Alternate
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">₹{delivery.totalPayment.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="uppercase font-medium">{delivery.paymentMode}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(delivery.paymentStatus)}`}>
                        {delivery.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{delivery.deliveryPersonName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                        {delivery.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {delivery.proofImageUrl ? (
                        <button
                          onClick={() => setViewProof(delivery.proofImageUrl || null)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400">
                          <XCircle className="w-4 h-4" />
                          No Proof
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {delivery.remarks || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        className="px-2 py-1 border rounded text-sm"
                        value={delivery.status}
                        onChange={(e) => overrideStatus(delivery.id, e.target.value)}
                      >
                        <option value={delivery.status}>Override Status</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                        <option value="undelivered">Undelivered</option>
                        <option value="returned">Returned</option>
                        <option value="failed_delivery">Failed Delivery</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3">
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Proof Modal */}
      {viewProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setViewProof(null)}>
          <div className="bg-white rounded-lg p-4 max-w-2xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Delivery Proof</h3>
              <button
                onClick={() => setViewProof(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <img src={viewProof} alt="Delivery Proof" className="w-full h-auto rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
