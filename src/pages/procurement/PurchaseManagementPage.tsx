import { useState } from 'react';
import { Plus, FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '../../components/ui';
import { PurchaseFiltersComponent } from '../../components/procurement/PurchaseFilters';
import { PurchaseTable } from '../../components/procurement/PurchaseTable';
import { PurchaseForm } from '../../components/procurement/PurchaseForm';
import { PurchaseDetailsModal } from '../../components/procurement/PurchaseDetailsModal';
import { useAuth } from '../../context/AuthContext';
import type { Purchase, PurchaseFilters } from '../../types/purchase';

// Mock data
const mockProducts = [
  { id: '1', name: 'Sea Crab', category: 'seafood' },
  { id: '2', name: 'Blue Crab', category: 'seafood' },
  { id: '3', name: 'Pomfret Fish', category: 'fish' },
  { id: '4', name: 'Salmon', category: 'fish' },
  { id: '5', name: 'Prawns', category: 'seafood' },
];

const mockPurchases: Purchase[] = [
  {
    id: 'PUR-001',
    purchaseDate: '2026-02-15',
    supplierName: 'Ocean Fresh Suppliers',
    moduleType: 'hub',
    createdBy: 'John Doe',
    remarks: 'Regular weekly purchase',
    products: [
      {
        id: 'prod-1',
        productId: '1',
        productName: 'Sea Crab',
        variant: 'large',
        countMin: 10,
        countMax: 15,
        grossWeight: 25.5,
        basePriceMin: 800,
        basePriceMax: 1000,
        purchasePrice: 900,
        status: 'purchased',
        isAlternate: false,
      },
    ],
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'PUR-002',
    purchaseDate: '2026-02-14',
    supplierName: 'Marine Traders',
    moduleType: 'hub',
    createdBy: 'Jane Smith',
    remarks: 'Rare product substitution',
    products: [
      {
        id: 'prod-2',
        productId: '2',
        productName: 'Blue Crab',
        variant: 'medium',
        countMin: 20,
        countMax: 25,
        grossWeight: 30.0,
        basePriceMin: 600,
        basePriceMax: 800,
        purchasePrice: 750,
        status: 'alternate',
        originalProductId: '1',
        alternateProductId: '2',
        isAlternate: true,
        remarks: 'Sea Crab unavailable',
      },
    ],
    createdAt: '2026-02-14T09:00:00Z',
    updatedAt: '2026-02-14T09:00:00Z',
  },
];

export function PurchaseManagementPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [filters, setFilters] = useState<PurchaseFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | undefined>();
  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null);

  const moduleType = user?.loginType === 'hub' ? 'hub' : 'store';

  const filteredPurchases = purchases.filter(purchase => {
    if (filters.dateFrom && purchase.purchaseDate < filters.dateFrom) return false;
    if (filters.dateTo && purchase.purchaseDate > filters.dateTo) return false;
    if (filters.status && !purchase.products.some(p => p.status === filters.status)) return false;
    if (filters.productId && !purchase.products.some(p => p.productId === filters.productId)) return false;
    return true;
  });

  const handleCreatePurchase = () => {
    setEditingPurchase(undefined);
    setIsFormOpen(true);
  };

  const handleEditPurchase = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsFormOpen(true);
  };

  const handleViewPurchase = (purchase: Purchase) => {
    setViewingPurchase(purchase);
  };

  const handleSubmitPurchase = (purchaseData: Partial<Purchase>) => {
    if (editingPurchase) {
      setPurchases(purchases.map(p => 
        p.id === editingPurchase.id ? { ...editingPurchase, ...purchaseData } : p
      ));
    } else {
      const newPurchase: Purchase = {
        ...purchaseData as Purchase,
        id: `PUR-${String(purchases.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
      };
      setPurchases([newPurchase, ...purchases]);
    }
    setIsFormOpen(false);
  };

  const handleStatusChange = (purchaseId: string, productId: string, newStatus: string, remarks: string) => {
    setPurchases(purchases.map(purchase => {
      if (purchase.id === purchaseId) {
        const updatedProducts = purchase.products.map(product => {
          if (product.id === productId) {
            return { ...product, status: newStatus as any, remarks };
          }
          return product;
        });

        const statusHistory = purchase.statusHistory || [];
        statusHistory.push({
          status: newStatus,
          changedBy: user?.name || 'Unknown',
          changedAt: new Date().toISOString(),
        });

        return {
          ...purchase,
          products: updatedProducts,
          statusHistory,
          updatedAt: new Date().toISOString(),
          updatedBy: user?.name || 'Unknown',
        };
      }
      return purchase;
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const exportToCSV = () => {
    const headers = ['Purchase ID', 'Date', 'Supplier', 'Product', 'Variant', 'Count Min', 'Count Max', 'Weight', 'Base Min', 'Base Max', 'Purchase Price', 'Status', 'Alternate'];
    const rows = filteredPurchases.flatMap(p => 
      p.products.map(prod => [
        p.id,
        p.purchaseDate,
        p.supplierName,
        prod.productName,
        prod.variant,
        prod.countMin,
        prod.countMax,
        prod.grossWeight,
        prod.basePriceMin,
        prod.basePriceMax,
        prod.purchasePrice,
        prod.status,
        prod.isAlternate ? 'Yes' : 'No',
      ])
    );
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchases_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();
        
        // Add header
        doc.setFontSize(18);
        doc.text('Purchase Management Report', 14, 20);
        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
        
        if (filters.dateFrom || filters.dateTo) {
          doc.text(`Date Range: ${filters.dateFrom || 'Start'} to ${filters.dateTo || 'End'}`, 14, 34);
        }
        
        // Prepare table data
        const tableData = filteredPurchases.flatMap(p => 
          p.products.map(prod => [
            p.id,
            p.purchaseDate,
            p.supplierName,
            prod.productName,
            prod.variant,
            `${prod.countMin}-${prod.countMax}`,
            prod.grossWeight.toFixed(2),
            `₹${prod.basePriceMin}-${prod.basePriceMax}`,
            `₹${prod.purchasePrice}`,
            prod.status,
            prod.isAlternate ? '✓' : '',
          ])
        );
        
        (doc as any).autoTable({
          startY: filters.dateFrom || filters.dateTo ? 40 : 35,
          head: [['ID', 'Date', 'Supplier', 'Product', 'Variant', 'Count', 'Weight', 'Base Price', 'Purchase', 'Status', 'Alt']],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [37, 99, 235] },
        });
        
        // Add footer with page numbers
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
        }
        
        doc.save(`purchases_${new Date().toISOString().split('T')[0]}.pdf`);
      });
    });
  };

  const exportToExcel = () => {
    import('xlsx').then((XLSX) => {
      const workbook = XLSX.utils.book_new();
      
      // Prepare data
      const data = filteredPurchases.flatMap(p => 
        p.products.map(prod => ({
          'Purchase ID': p.id,
          'Date': p.purchaseDate,
          'Supplier': p.supplierName,
          'Product': prod.productName,
          'Variant': prod.variant,
          'Count Min': prod.countMin,
          'Count Max': prod.countMax,
          'Gross Weight (kg)': prod.grossWeight,
          'Base Price Min': prod.basePriceMin,
          'Base Price Max': prod.basePriceMax,
          'Purchase Price': prod.purchasePrice,
          'Status': prod.status,
          'Alternate': prod.isAlternate ? 'Yes' : 'No',
          'Original Product': prod.originalProductId || '',
          'Remarks': prod.remarks || '',
        }))
      );
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchases');
      
      XLSX.writeFile(workbook, `purchases_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 md:p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">🧾 Purchase Management</h1>
          <p className="text-blue-100 mt-1 md:mt-2 text-sm md:text-base">
            Procurement Module - {moduleType.toUpperCase()} | {user?.name}
          </p>
        </div>

        {/* Filters */}
        <PurchaseFiltersComponent
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          products={mockProducts}
        />

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Button onClick={handleCreatePurchase} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Purchase
          </Button>

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

        {/* Purchase Table */}
        <PurchaseTable
          purchases={filteredPurchases}
          onEdit={handleEditPurchase}
          onView={handleViewPurchase}
        />

        {/* Purchase Details Modal */}
        <PurchaseDetailsModal
          isOpen={!!viewingPurchase}
          onClose={() => setViewingPurchase(null)}
          purchase={viewingPurchase}
          onStatusChange={handleStatusChange}
          canEditStatus={true}
        />

        {/* Purchase Form Modal */}
        <PurchaseForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitPurchase}
          purchase={editingPurchase}
          moduleType={moduleType}
          userName={user?.name || 'Unknown'}
          products={mockProducts}
        />
      </div>
    </div>
  );
}
