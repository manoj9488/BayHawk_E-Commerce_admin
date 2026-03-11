import { useState } from 'react';
import { FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '../../components/ui';
import { CuttingFiltersComponent } from '../../components/cutting/CuttingFilters';
import { CuttingTable } from '../../components/cutting/CuttingTable';
import { CuttingDetailsModal } from '../../components/cutting/CuttingDetailsModal';
import { useAuth } from '../../context/AuthContext';
import type { CuttingEntry, CuttingFilters } from '../../types/cutting';

// Mock data
const mockProducts = [
  { id: '1', name: 'Sea Crab' },
  { id: '2', name: 'Pomfret Fish' },
  { id: '3', name: 'Salmon' },
];

const mockCuttingTypes = [
  { id: '1', name: 'Uncleaned' },
  { id: '2', name: 'Headed and Gutted' },
  { id: '3', name: 'Gilled and Gutted' },
  { id: '4', name: 'Steaks' },
  { id: '5', name: 'Fillet' },
  { id: '6', name: 'Whole Cleaned' },
];

const mockEntries: CuttingEntry[] = [
  {
    id: 'CUT-001',
    referenceType: 'purchase',
    referenceId: 'PUR-001',
    date: '2026-02-16',
    moduleType: 'hub',
    createdBy: 'John Doe',
    products: [
      {
        id: 'prod-1',
        productId: '1',
        productName: 'Sea Crab',
        variant: 'large',
        variantImage: 'https://images.unsplash.com/photo-1559717201-fbb671ff56b7?w=100&h=100&fit=crop',
        cuttingType: 'Whole Cleaned',
        grossWeight: 25.5,
        netWeight: 22.0,
        status: 'completed',
        isAlternate: false,
        remarks: 'Cleaned and ready for packing',
      },
    ],
    createdAt: '2026-02-16T10:00:00Z',
    updatedAt: '2026-02-16T10:00:00Z',
    statusHistory: [
      {
        status: 'completed',
        changedBy: 'John Doe',
        changedAt: '2026-02-16T10:30:00Z',
      },
    ],
  },
  {
    id: 'CUT-002',
    referenceType: 'order',
    referenceId: 'ORD-123',
    date: '2026-02-16',
    moduleType: 'hub',
    createdBy: 'Jane Smith',
    products: [
      {
        id: 'prod-2',
        productId: '2',
        productName: 'Pomfret Fish',
        variant: 'medium',
        variantImage: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=100&h=100&fit=crop',
        cuttingType: 'Fillet',
        grossWeight: 15.0,
        status: 'processing',
        isAlternate: false,
      },
    ],
    createdAt: '2026-02-16T09:00:00Z',
    updatedAt: '2026-02-16T09:00:00Z',
  },
];

export function CuttingManagementPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<CuttingEntry[]>(mockEntries);
  const [filters, setFilters] = useState<CuttingFilters>({});
  const [viewingEntry, setViewingEntry] = useState<CuttingEntry | null>(null);

  const moduleType = user?.loginType === 'hub' ? 'hub' : 'store';

  const filteredEntries = entries.filter(entry => {
    if (filters.dateFrom && entry.date < filters.dateFrom) return false;
    if (filters.dateTo && entry.date > filters.dateTo) return false;
    if (filters.status && !entry.products.some(p => p.status === filters.status)) return false;
    if (filters.cuttingType && !entry.products.some(p => p.cuttingType === filters.cuttingType)) return false;
    if (filters.productId && !entry.products.some(p => p.productId === filters.productId)) return false;
    return true;
  });

  const handleViewEntry = (entry: CuttingEntry) => {
    setViewingEntry(entry);
  };

  const handleEditEntry = (entry: CuttingEntry) => {
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

    // Update the viewing entry to reflect changes
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
    const headers = ['Cutting ID', 'Date', 'Reference Type', 'Reference ID', 'Product', 'Variant', 'Cutting Type', 'Gross Weight', 'Net Weight', 'Status', 'Alternate'];
    const rows = filteredEntries.flatMap(e => 
      e.products.map(prod => [
        e.id,
        e.date,
        e.referenceType,
        e.referenceId,
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
    a.download = `cutting_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Cutting & Cleaning Report', 14, 20);
        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
        
        const tableData = filteredEntries.flatMap(e => 
          e.products.map(prod => [
            e.id,
            e.date,
            `${e.referenceType.toUpperCase()}\n${e.referenceId}`,
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
          head: [['ID', 'Date', 'Reference', 'Product', 'Variant', 'Cutting Type', 'Gross', 'Net', 'Status']],
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
        
        doc.save(`cutting_${new Date().toISOString().split('T')[0]}.pdf`);
      });
    });
  };

  const exportToExcel = () => {
    import('xlsx').then((XLSX) => {
      const data = filteredEntries.flatMap(e => 
        e.products.map(prod => ({
          'Cutting ID': e.id,
          'Date': e.date,
          'Reference Type': e.referenceType,
          'Reference ID': e.referenceId,
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Cutting');
      
      XLSX.writeFile(workbook, `cutting_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 md:p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">🔪 Cutting & Cleaning Management</h1>
          <p className="text-green-100 mt-1 md:mt-2 text-sm md:text-base">
            Operations Module - {moduleType.toUpperCase()} | {user?.name}
          </p>
        </div>

        {/* Filters */}
        <CuttingFiltersComponent
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          products={mockProducts}
          cuttingTypes={mockCuttingTypes}
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

        {/* Cutting Table */}
        <CuttingTable
          entries={filteredEntries}
          onView={handleViewEntry}
          onEdit={handleEditEntry}
        />

        {/* Cutting Details Modal */}
        <CuttingDetailsModal
          isOpen={!!viewingEntry}
          onClose={() => setViewingEntry(null)}
          entry={viewingEntry}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
}
