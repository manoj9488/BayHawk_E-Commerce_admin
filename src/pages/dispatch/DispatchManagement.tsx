import { useState, useEffect } from 'react';
import { Package, Filter, Download, AlertCircle } from 'lucide-react';
import type { DispatchEntry, DispatchFilters } from '../../types/dispatch';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DispatchManagement() {
  const { user } = useAuth();
  const [dispatches, setDispatches] = useState<DispatchEntry[]>([]);
  const [filters, setFilters] = useState<DispatchFilters>({});
  const [loading, setLoading] = useState(false);
  const [deliveryAgents, setDeliveryAgents] = useState<any[]>([]);

  useEffect(() => {
    loadDispatches();
    loadDeliveryAgents();
  }, [filters]);

  const loadDispatches = async () => {
    setLoading(true);
    try {
      // API call to fetch dispatches from packed orders
      // const response = await fetch('/api/dispatch', { params: filters });
      // setDispatches(response.data);
      
      // Mock data
      setDispatches([
        {
          id: 'DSP001',
          billNumber: 'BH2024001',
          orderDate: '2024-02-15',
          customerName: 'John Doe',
          moduleType: user?.loginType === 'hub' ? 'hub' : 'store',
          assignedBy: user?.name || '',
          packingId: 'PCK001',
          products: [
            {
              id: 'P1',
              billNumber: 'BH2024001',
              partyName: 'John Doe',
              productName: 'Sea Crab',
              grossWeight: 2.5,
              netWeight: 2.3,
              status: 'processing',
              isAlternate: false,
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]);
    } catch (error) {
      console.error('Failed to load dispatches:', error);
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
        { id: '1', name: 'Agent 1' },
        { id: '2', name: 'Agent 2' },
      ]);
    } catch (error) {
      console.error('Failed to load delivery agents:', error);
    }
  };

  const updateDeliveryPerson = (dispatchId: string, productIdx: number, deliveryPersonId: string) => {
    const updatedDispatches = dispatches.map(d => {
      if (d.id === dispatchId) {
        const updatedProducts = [...d.products];
        updatedProducts[productIdx] = {
          ...updatedProducts[productIdx],
          deliveryPersonId,
          deliveryPersonName: deliveryAgents.find(a => a.id === deliveryPersonId)?.name || ''
        };
        return { ...d, products: updatedProducts };
      }
      return d;
    });
    setDispatches(updatedDispatches);
  };

  const updateStatus = async (dispatchId: string, productIdx: number, newStatus: string) => {
    const dispatch = dispatches.find(d => d.id === dispatchId);
    if (!dispatch) return;

    const product = dispatch.products[productIdx];

    if (newStatus === 'dispatched' && !product.deliveryPersonId) {
      alert('Please assign a delivery person before dispatching');
      return;
    }

    let remarks: string | null = null;
    if (newStatus === 'cancelled' || newStatus === 'failed' || newStatus === 'returned') {
      remarks = prompt(`Enter remarks for ${newStatus}:`);
      if (!remarks) {
        alert('Remarks are mandatory for this status');
        return;
      }
    }

    try {
      // API call to update status
      // await fetch(`/api/dispatch/${dispatchId}/product/${product.id}`, {
      //   method: 'PATCH',
      //   body: { status: newStatus, deliveryPersonId: product.deliveryPersonId, remarks, updatedBy: user?.id }
      // });
      
      const updatedDispatches = dispatches.map(d => {
        if (d.id === dispatchId) {
          const updatedProducts = [...d.products];
          updatedProducts[productIdx] = {
            ...updatedProducts[productIdx],
            status: newStatus as any,
            remarks: remarks || updatedProducts[productIdx].remarks
          };
          return { ...d, products: updatedProducts, updatedBy: user?.id, updatedAt: new Date().toISOString() };
        }
        return d;
      });
      setDispatches(updatedDispatches);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const exportCSV = () => {
    const headers = ['Dispatch ID', 'Bill #', 'Order Date', 'Customer', 'Product', 'Gross Weight', 'Net Weight', 'Delivery Person', 'Status', 'Remarks'];
    const rows = dispatches.flatMap(d => 
      d.products.map(p => [
        d.id,
        d.billNumber,
        d.orderDate,
        d.customerName,
        p.isAlternate ? `${p.productName} (Alternate)` : p.productName,
        p.grossWeight,
        p.netWeight,
        p.deliveryPersonName || '-',
        p.status,
        p.remarks || '-'
      ])
    );

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dispatch_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Bayhawk - Dispatch Report', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    if (filters.dateFrom || filters.dateTo) {
      doc.text(`Period: ${filters.dateFrom || 'Start'} to ${filters.dateTo || 'End'}`, 14, 34);
    }

    const tableData = dispatches.flatMap(d =>
      d.products.map(p => [
        d.id,
        d.billNumber,
        d.customerName,
        p.isAlternate ? `${p.productName} (Alt)` : p.productName,
        p.grossWeight,
        p.netWeight,
        p.deliveryPersonName || '-',
        p.status
      ])
    );

    autoTable(doc, {
      startY: 40,
      head: [['Dispatch ID', 'Bill #', 'Customer', 'Product', 'Gross Wt', 'Net Wt', 'Delivery Person', 'Status']],
      body: tableData,
    });

    doc.save(`dispatch_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportExcel = () => {
    // Similar to CSV but with .xlsx extension
    exportCSV();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'dispatched': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-orange-100 text-orange-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">Dispatch Management</h1>
                </div>
                <p className="text-base text-gray-600">
                  Manage and track dispatch operations for packed orders
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All</option>
              <option value="processing">Processing</option>
              <option value="dispatched">Dispatched</option>
              <option value="cancelled">Cancelled</option>
              <option value="failed">Failed</option>
              <option value="returned">Returned</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({})}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Dispatch Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Dispatch Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bill #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gross Wt</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Net Wt</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Delivery Person</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Remarks</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : dispatches.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">No dispatch records found</td>
                </tr>
              ) : (
                dispatches.flatMap(dispatch =>
                  dispatch.products.map((product, idx) => (
                    <tr key={`${dispatch.id}-${idx}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{dispatch.billNumber}</td>
                      <td className="px-4 py-3 text-sm">{dispatch.customerName}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          {product.productName}
                          {product.isAlternate && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                              <AlertCircle className="w-3 h-3" />
                              Alternate
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{product.grossWeight} kg</td>
                      <td className="px-4 py-3 text-sm">{product.netWeight} kg</td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          className="px-2 py-1 border rounded text-sm"
                          value={product.deliveryPersonId || ''}
                          onChange={(e) => updateDeliveryPerson(dispatch.id, idx, e.target.value)}
                          disabled={product.status === 'dispatched' || product.status === 'cancelled'}
                        >
                          <option value="">Select Agent</option>
                          {deliveryAgents.map(agent => (
                            <option key={agent.id} value={agent.id}>{agent.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {product.remarks || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          className="px-2 py-1 border rounded text-sm"
                          value={product.status}
                          onChange={(e) => updateStatus(dispatch.id, idx, e.target.value)}
                          disabled={product.status === 'dispatched' || product.status === 'cancelled'}
                        >
                          <option value="processing">Processing</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="failed">Failed</option>
                          <option value="returned">Returned</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )
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
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
