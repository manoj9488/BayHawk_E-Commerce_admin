import { useState } from 'react';
import { FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '../../components/ui';
import { PackingFiltersComponent } from '../../components/packing/PackingFilters';
import { PackingTable } from '../../components/packing/PackingTable';
import { PackingDetailsModal } from '../../components/packing/PackingDetailsModal';
import { useAuth } from '../../context/AuthContext';
import type { PackingEntry, PackingFilters } from '../../types/packing';

// Mock data
const mockProducts = [
  { id: '1', name: 'Sea Crab' },
  { id: '2', name: 'Pomfret Fish' },
  { id: '3', name: 'Salmon' },
];

const mockCustomers = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Robert Johnson' },
];

const mockEntries: PackingEntry[] = [
  {
    id: 'PACK-001',
    billNumber: 'BILL-2026-001',
    orderDate: '2026-02-16',
    customerName: 'John Doe',
    moduleType: 'hub',
    assignedTo: 'Packing Team A',
    products: [
      {
        id: 'prod-1',
        productId: '1',
        productName: 'Sea Crab',
        variant: 'large',
        cuttingType: 'Whole Cleaned',
        grossWeight: 22.0,
        netWeight: 20.5,
        status: 'packed',
        isAlternate: false,
        remarks: 'Packed and ready for dispatch',
      },
    ],
    createdAt: '2026-02-16T10:00:00Z',
    updatedAt: '2026-02-16T11:00:00Z',
    statusHistory: [
      {
        status: 'packed',
        changedBy: 'Packing Team A',
        changedAt: '2026-02-16T11:00:00Z',
      },
    ],
  },
  {
    id: 'PACK-002',
    billNumber: 'BILL-2026-002',
    orderDate: '2026-02-16',
    customerName: 'Jane Smith',
    moduleType: 'hub',
    assignedTo: 'Packing Team B',
    products: [
      {
        id: 'prod-2',
        productId: '2',
        productName: 'Pomfret Fish',
        variant: 'medium',
        cuttingType: 'Fillet',
        grossWeight: 13.5,
        status: 'processing',
        isAlternate: false,
      },
    ],
    createdAt: '2026-02-16T09:00:00Z',
    updatedAt: '2026-02-16T09:00:00Z',
  },
];

export function PackingManagementPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<PackingEntry[]>(mockEntries);
  const [filters, setFilters] = useState<PackingFilters>({});
  const [viewingEntry, setViewingEntry] = useState<PackingEntry | null>(null);

  const moduleType = user?.loginType === 'hub' ? 'hub' : 'store';

  const filteredEntries = entries.filter(entry => {
    if (filters.dateFrom && entry.orderDate < filters.dateFrom) return false;
    if (filters.dateTo && entry.orderDate > filters.dateTo) return false;
    if (filters.status && !entry.products.some(p => p.status === filters.status)) return false;
    if (filters.customer && entry.customerName !== filters.customer) return false;
    if (filters.productId && !entry.products.some(p => p.productId === filters.productId)) return false;
    return true;
  });

  const handleViewEntry = (entry: PackingEntry) => {
    setViewingEntry(entry);
  };

  const handleEditEntry = (entry: PackingEntry) => {
    setViewingEntry(entry);
  };

  const handleStatusUpdate = (newStatus: string, netWeight: number | undefined, remarks: string) => {
    if (!viewingEntry) return;

    setEntries(entries.map(entry => {
      if (entry.id === viewingEntry.id) {
        const updatedProducts = entry.products.map(product => ({
          ...product,
          status: newStatus as any,
          netWeight: netWeight || product.netWeight,
          remarks,
        }));

        const statusHistory = entry.statusHistory || [];
        statusHistory.push({
          status: newStatus,
          changedBy: user?.name || 'Unknown',
          changedAt: new Date().toISOString(),
        });

        return {
          ...entry,
          products: updatedProducts,
          statusHistory,
          updatedAt: new Date().toISOString(),
          updatedBy: user?.name || 'Unknown',
        };
      }
      return entry;
    }));

    const updatedEntry = entries.find(e => e.id === viewingEntry.id);
    if (updatedEntry) {
      setViewingEntry({
        ...updatedEntry,
        products: updatedEntry.products.map(p => ({
          ...p,
          status: newStatus as any,
          netWeight: netWeight || p.netWeight,
          remarks,
        })),
      });
    }
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const exportToCSV = () => {
    const headers = ['Bill #', 'Order Date', 'Customer', 'Product', 'Variant', 'Cutting Type', 'Gross Weight', 'Net Weight', 'Status', 'Alternate'];
    const rows = filteredEntries.flatMap(e => 
      e.products.map(prod => [
        e.billNumber,
        e.orderDate,
        e.customerName,
        prod.productName,
        prod.variant,
        prod.cuttingType,
        prod.grossWeight,
        prod.netWeight || '',
        prod.status,
        prod.isAlternate ? 'Yes' : 'No',
      ])
    );
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packing_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Packing Management Report', 14, 20);
        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
        
        const tableData = filteredEntries.flatMap(e => 
          e.products.map(prod => [
            e.billNumber,
            e.orderDate,
            e.customerName,
            prod.productName,
            prod.variant,
            prod.cuttingType,
            `${prod.grossWeight.toFixed(2)} kg`,
            prod.netWeight ? `${prod.netWeight.toFixed(2)} kg` : '-',
            prod.status,
          ])
        );
        
        (doc as any).autoTable({
          startY: 35,
          head: [['Bill #', 'Date', 'Customer', 'Product', 'Variant', 'Cutting', 'Gross', 'Net', 'Status']],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [37, 99, 235] },
        });
        
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
        }
        
        doc.save(`packing_${new Date().toISOString().split('T')[0]}.pdf`);
      });
    });
  };

  const exportToExcel = () => {
    import('xlsx').then((XLSX) => {
      const data = filteredEntries.flatMap(e => 
        e.products.map(prod => ({
          'Bill #': e.billNumber,
          'Order Date': e.orderDate,
          'Customer': e.customerName,
          'Product': prod.productName,
          'Variant': prod.variant,
          'Cutting Type': prod.cuttingType,
          'Gross Weight (kg)': prod.grossWeight,
          'Net Weight (kg)': prod.netWeight || '',
          'Status': prod.status,
          'Alternate': prod.isAlternate ? 'Yes' : 'No',
          'Remarks': prod.remarks || '',
        }))
      );
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Packing');
      
      XLSX.writeFile(workbook, `packing_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 md:p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">📦 Packing Management</h1>
          <p className="text-purple-100 mt-1 md:mt-2 text-sm md:text-base">
            Operations Module - {moduleType.toUpperCase()} | {user?.name}
          </p>
        </div>

        {/* Filters */}
        <PackingFiltersComponent
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          products={mockProducts}
          customers={mockCustomers}
        />

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" onClick={exportToCSV} className="flex-1 sm:flex-none">
              <FileText className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button size="sm" onClick={exportToPDF} className="flex-1 sm:flex-none">
              <FileDown className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button size="sm" onClick={exportToExcel} className="flex-1 sm:flex-none">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>

        {/* Packing Table */}
        <PackingTable
          entries={filteredEntries}
          onView={handleViewEntry}
          onEdit={handleEditEntry}
        />

        {/* Packing Details Modal */}
        <PackingDetailsModal
          isOpen={!!viewingEntry}
          onClose={() => setViewingEntry(null)}
          entry={viewingEntry}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
}
