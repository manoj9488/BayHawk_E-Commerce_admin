import { useState, useEffect } from 'react';
import { Package, MapPin, Phone, Camera, Filter, Download, AlertCircle, CheckCircle } from 'lucide-react';
import type { DeliveryEntry, DeliveryFilters } from '../../types/delivery';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DeliveryAgentPage() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<DeliveryEntry[]>([]);
  const [filters, setFilters] = useState<DeliveryFilters>({});
  const [loading, setLoading] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);

  useEffect(() => {
    loadDeliveries();
  }, [filters]);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      // API call to fetch deliveries assigned to logged-in delivery person
      // const response = await fetch(`/api/delivery/agent/${user?.id}`, { params: filters });
      // setDeliveries(response.data);
      
      // Mock data
      setDeliveries([
        {
          id: 'DEL001',
          dispatchId: 'DSP001',
          billNumber: 'BH2024001',
          partyName: 'John Doe',
          totalPayment: 1250.00,
          paymentStatus: 'unpaid',
          paymentMode: 'cod',
          status: 'dispatched',
          deliveryPersonId: user?.id || '',
          deliveryPersonName: user?.name || '',
          customerAddress: '123 Main Street, Chennai - 600001',
          customerPhone: '+91 9876543210',
          latitude: 13.0827,
          longitude: 80.2707,
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

  const updateStatus = async (deliveryId: string, newStatus: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    // Validate proof upload for delivered status
    if (newStatus === 'delivered' && !proofFile && !delivery.proofImageUrl) {
      alert('Photo proof is mandatory for marking delivery as completed');
      return;
    }

    // Validate COD payment collection
    if (newStatus === 'delivered' && delivery.paymentMode === 'cod' && delivery.paymentStatus === 'unpaid') {
      const confirmPayment = confirm('Has the COD payment been collected?');
      if (!confirmPayment) {
        alert('Please collect payment before marking as delivered');
        return;
      }
    }

    let remarks: string | null = null;
    if (newStatus === 'undelivered' || newStatus === 'returned' || newStatus === 'failed_delivery') {
      remarks = prompt(`Enter remarks for ${newStatus.replace('_', ' ')}:`);
      if (!remarks) {
        alert('Remarks are mandatory for this status');
        return;
      }
    }

    try {
      // Upload proof if available
      let proofUrl = delivery.proofImageUrl;
      if (proofFile) {
        const formData = new FormData();
        formData.append('proof', proofFile);
        // const uploadResponse = await fetch(`/api/delivery/${deliveryId}/proof`, {
        //   method: 'POST',
        //   body: formData
        // });
        // proofUrl = uploadResponse.data.url;
        proofUrl = URL.createObjectURL(proofFile); // Mock
      }

      // Update delivery status
      // await fetch(`/api/delivery/${deliveryId}`, {
      //   method: 'PATCH',
      //   body: {
      //     status: newStatus,
      //     remarks,
      //     proofImageUrl: proofUrl,
      //     proofUploadedAt: new Date().toISOString(),
      //     proofUploadedBy: user?.id,
      //     updatedBy: user?.id,
      //     paymentStatus: newStatus === 'delivered' && delivery.paymentMode === 'cod' ? 'paid' : delivery.paymentStatus,
      //     collectedAmount: newStatus === 'delivered' && delivery.paymentMode === 'cod' ? delivery.totalPayment : undefined,
      //     collectedAt: newStatus === 'delivered' && delivery.paymentMode === 'cod' ? new Date().toISOString() : undefined
      //   }
      // });

      const updatedDeliveries = deliveries.map(d => {
        if (d.id === deliveryId) {
          return {
            ...d,
            status: newStatus as any,
            remarks: remarks || d.remarks,
            proofImageUrl: proofUrl,
            proofUploadedAt: proofUrl ? new Date().toISOString() : d.proofUploadedAt,
            proofUploadedBy: proofUrl ? user?.id : d.proofUploadedBy,
            paymentStatus: newStatus === 'delivered' && d.paymentMode === 'cod' ? 'paid' as const : d.paymentStatus,
            collectedAmount: newStatus === 'delivered' && d.paymentMode === 'cod' ? d.totalPayment : d.collectedAmount,
            collectedAt: newStatus === 'delivered' && d.paymentMode === 'cod' ? new Date().toISOString() : d.collectedAt,
            updatedBy: user?.id,
            updatedAt: new Date().toISOString(),
          };
        }
        return d;
      });
      setDeliveries(updatedDeliveries);
      setProofFile(null);
      setSelectedDelivery(null);
      alert('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleNavigate = (address: string, lat?: number, lng?: number) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };

  const exportCSV = () => {
    const headers = ['Bill #', 'Customer', 'Total Payment', 'Payment Mode', 'Payment Status', 'Status', 'Delivery Date', 'Remarks', 'Proof Status'];
    const rows = deliveries.map(d => [
      d.billNumber,
      d.partyName,
      d.totalPayment,
      d.paymentMode.toUpperCase(),
      d.paymentStatus,
      d.status,
      new Date(d.updatedAt).toLocaleDateString(),
      d.remarks || '-',
      d.proofImageUrl ? 'Yes' : 'No'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Bayhawk - Delivery Report', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Delivery Person: ${user?.name}`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);

    const tableData = deliveries.map(d => [
      d.billNumber,
      d.partyName,
      d.totalPayment.toFixed(2),
      d.paymentMode.toUpperCase(),
      d.paymentStatus,
      d.status,
      d.proofImageUrl ? 'Yes' : 'No'
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Bill #', 'Customer', 'Amount', 'Payment Mode', 'Payment Status', 'Status', 'Proof']],
      body: tableData,
    });

    doc.save(`delivery_${new Date().toISOString().split('T')[0]}.pdf`);
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
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
                    <p className="text-sm text-gray-600 mt-1">Delivery Person: {user?.name}</p>
                  </div>
                </div>
                <p className="text-base text-gray-600">
                  Manage and track your assigned deliveries
                </p>
              </div>
            </div>
          </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Deliveries</h3>
        </div>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Call</th>
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
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-500">No deliveries assigned</td>
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
                                {product.originalProductName && (
                                  <span className="text-xs">for {product.originalProductName}</span>
                                )}
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
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                        {delivery.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleNavigate(delivery.customerAddress, delivery.latitude, delivery.longitude)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        <MapPin className="w-4 h-4" />
                        Navigate
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleCallCustomer(delivery.customerPhone)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {delivery.remarks || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {delivery.status === 'dispatched' ? (
                        <div className="space-y-2">
                          {selectedDelivery === delivery.id && (
                            <div className="mb-2">
                              <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded cursor-pointer hover:bg-gray-100">
                                <Camera className="w-4 h-4" />
                                <span className="text-xs">
                                  {proofFile ? proofFile.name : 'Upload Proof'}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  className="hidden"
                                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                                />
                              </label>
                            </div>
                          )}
                          <select
                            className="w-full px-2 py-1 border rounded text-sm"
                            value={delivery.status}
                            onChange={(e) => {
                              if (e.target.value === 'delivered') {
                                setSelectedDelivery(delivery.id);
                              }
                              updateStatus(delivery.id, e.target.value);
                            }}
                          >
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="undelivered">Undelivered</option>
                            <option value="returned">Returned</option>
                            <option value="failed_delivery">Failed Delivery</option>
                          </select>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Completed</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
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
      </div>
        </div>
      </div>
    </div>
  );
}
