import { useState, useRef } from "react";
import { Card, Button, Input, Select } from "../../components/ui";
import {
  Printer,
  Download,
  Eye,
  Settings,
  Plus,
  Minus,
  RotateCcw,
  Save,
  FileText,
  Package,
  Calendar,
  Barcode,
  QrCode,
  Truck,
  Receipt,
} from "lucide-react";
import { LabelPreview } from "../../components/labeling/LabelPreview";
import { LabelDesigner } from "../../components/labeling/ImprovedLabelDesigner";
import { DataSelector } from "../../components/labeling/DataSelector";
import { SlipConfigurator } from "../../components/labeling/SlipConfigurator";
import type { SlipConfig } from "../../components/labeling/SlipConfigurator";
import { BillEntryForm } from "../../components/labeling/BillEntryForm";

interface LabelField {
  id: string;
  name: string;
  type: "text" | "barcode" | "qrcode" | "image" | "date" | "number";
  value: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  position: { x: number; y: number };
  width: number;
  height: number;
  isVisible: boolean;
}

interface LabelTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  fields: LabelField[];
  paperSize: string;
  orientation: "portrait" | "landscape";
}

interface DataField {
  id: string;
  label: string;
  type: "text" | "barcode" | "qrcode" | "image" | "date" | "number";
}

interface DataCategory {
  category: string;
  fields: DataField[];
}

const defaultFields: LabelField[] = [
  {
    id: "product_name",
    name: "Product Name",
    type: "text",
    value: "Fresh Salmon - 1kg",
    fontSize: 16,
    fontWeight: "bold",
    position: { x: 10, y: 10 },
    width: 200,
    height: 25,
    isVisible: true,
  },
  {
    id: "product_code",
    name: "Product Code",
    type: "text",
    value: "SAL001",
    fontSize: 12,
    fontWeight: "normal",
    position: { x: 10, y: 40 },
    width: 100,
    height: 20,
    isVisible: true,
  },
  {
    id: "price",
    name: "Price",
    type: "text",
    value: "₹450.00",
    fontSize: 14,
    fontWeight: "bold",
    position: { x: 120, y: 40 },
    width: 80,
    height: 20,
    isVisible: true,
  },
  {
    id: "barcode",
    name: "Barcode",
    type: "barcode",
    value: "1234567890123",
    fontSize: 10,
    fontWeight: "normal",
    position: { x: 10, y: 70 },
    width: 150,
    height: 30,
    isVisible: true,
  },
  {
    id: "expiry_date",
    name: "Expiry Date",
    type: "date",
    value: "2024-02-15",
    fontSize: 10,
    fontWeight: "normal",
    position: { x: 10, y: 110 },
    width: 100,
    height: 15,
    isVisible: true,
  },
  {
    id: "batch_number",
    name: "Batch Number",
    type: "text",
    value: "B240115001",
    fontSize: 10,
    fontWeight: "normal",
    position: { x: 120, y: 110 },
    width: 80,
    height: 15,
    isVisible: true,
  },
];

const availableDataSources: DataCategory[] = [
  {
    category: "Product Information",
    fields: [
      { id: "product_name", label: "Product Name", type: "text" },
      { id: "product_code", label: "Product Code", type: "text" },
      { id: "product_description", label: "Description", type: "text" },
      { id: "category", label: "Category", type: "text" },
      { id: "brand", label: "Brand", type: "text" },
      { id: "weight", label: "Weight", type: "text" },
      { id: "unit", label: "Unit", type: "text" },
    ],
  },
  {
    category: "Pricing",
    fields: [
      { id: "price", label: "Price", type: "text" },
      { id: "mrp", label: "MRP", type: "text" },
      { id: "discount", label: "Discount", type: "text" },
      { id: "tax_rate", label: "Tax Rate", type: "text" },
      { id: "final_price", label: "Final Price", type: "text" },
    ],
  },
  {
    category: "Inventory",
    fields: [
      { id: "batch_number", label: "Batch Number", type: "text" },
      { id: "lot_number", label: "Lot Number", type: "text" },
      { id: "manufacturing_date", label: "Manufacturing Date", type: "date" },
      { id: "expiry_date", label: "Expiry Date", type: "date" },
      { id: "stock_quantity", label: "Stock Quantity", type: "number" },
    ],
  },
  {
    category: "Barcodes & QR",
    fields: [
      { id: "barcode", label: "Barcode", type: "barcode" },
      { id: "qr_code", label: "QR Code", type: "qrcode" },
      { id: "sku", label: "SKU", type: "text" },
    ],
  },
  {
    category: "Business Info",
    fields: [
      { id: "company_name", label: "Company Name", type: "text" },
      { id: "company_logo", label: "Company Logo", type: "image" },
      { id: "address", label: "Address", type: "text" },
      { id: "phone", label: "Phone", type: "text" },
      { id: "email", label: "Email", type: "text" },
    ],
  },
];

export function LabelingPage() {
  const [currentTemplate, setCurrentTemplate] = useState<LabelTemplate>({
    id: "1",
    name: "Product Label",
    width: 220,
    height: 140,
    fields: defaultFields,
    paperSize: "A4",
    orientation: "portrait",
  });

  const [activeTab, setActiveTab] = useState<"design" | "data" | "preview" | "slips" | "bill" | "print">(
    "design",
  );
  const [selectedFields, setSelectedFields] = useState<string[]>(
    defaultFields.map((f) => f.id),
  );
  const [labelQuantity, setLabelQuantity] = useState(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Print Filters State
  const [printFilters, setPrintFilters] = useState({
    dateFrom: '',
    dateTo: '',
    customer: '',
    invoiceNumber: '',
    product: '',
    selectedOrders: [] as string[]
  });

  const [slipType, setSlipType] = useState<'delivery' | 'packing'>('delivery');

  // Mock Orders Data
  const mockOrders = [
    { id: 'ORD-001', date: '2024-02-10', customer: 'Rajesh Kumar', invoice: 'INV-2024-001', product: 'Fresh Salmon', amount: 850 },
    { id: 'ORD-002', date: '2024-02-10', customer: 'Priya Sharma', invoice: 'INV-2024-002', product: 'Tuna Steak', amount: 1200 },
    { id: 'ORD-003', date: '2024-02-11', customer: 'Arun Patel', invoice: 'INV-2024-003', product: 'Prawns', amount: 650 },
    { id: 'ORD-004', date: '2024-02-11', customer: 'Lakshmi Devi', invoice: 'INV-2024-004', product: 'Crab', amount: 1450 },
    { id: 'ORD-005', date: '2024-02-12', customer: 'Rajesh Kumar', invoice: 'INV-2024-005', product: 'Lobster', amount: 2100 },
  ];

  // Slip Configuration State
  const [slipConfig, setSlipConfig] = useState<SlipConfig>({
    deliverySlip: [
      { id: "customer_name", label: "Customer Name", type: "text" as const, required: true, enabled: true, position: { x: 20, y: 20 }, fontSize: 14, fontWeight: "bold" as const },
      { id: "customer_address", label: "Delivery Address", type: "address" as const, required: true, enabled: true, position: { x: 20, y: 45 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "phone_number", label: "Phone Number", type: "phone" as const, required: true, enabled: true, position: { x: 20, y: 85 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "alternate_phone", label: "Alternate Phone", type: "phone" as const, required: false, enabled: true, position: { x: 150, y: 85 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "invoice_number", label: "Invoice Number", type: "text" as const, required: true, enabled: true, position: { x: 20, y: 110 }, fontSize: 12, fontWeight: "bold" as const },
      { id: "net_amount", label: "Net Amount", type: "number" as const, required: true, enabled: true, position: { x: 150, y: 110 }, fontSize: 12, fontWeight: "bold" as const },
      { id: "payment_mode", label: "Payment Mode", type: "text" as const, required: true, enabled: true, position: { x: 20, y: 135 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "delivery_date", label: "Delivery Date", type: "date" as const, required: true, enabled: true, position: { x: 20, y: 160 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "delivery_slot", label: "Delivery Slot", type: "text" as const, required: false, enabled: true, position: { x: 150, y: 160 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "delivery_instructions", label: "Delivery Instructions", type: "text" as const, required: false, enabled: true, position: { x: 20, y: 185 }, fontSize: 10, fontWeight: "normal" as const },
      { id: "support_phone", label: "Support Phone", type: "phone" as const, required: true, enabled: true, position: { x: 20, y: 210 }, fontSize: 10, fontWeight: "normal" as const },
      { id: "qr_code", label: "QR Code", type: "qr" as const, required: false, enabled: true, position: { x: 200, y: 20 }, fontSize: 10, fontWeight: "normal" as const },
      { id: "brand_logo", label: "Brand Logo", type: "image" as const, required: false, enabled: true, position: { x: 200, y: 60 }, fontSize: 10, fontWeight: "normal" as const },
    ],
    packingSlip: [
      { id: "customer_name", label: "Customer Name", type: "text" as const, required: true, enabled: true, position: { x: 20, y: 20 }, fontSize: 14, fontWeight: "bold" as const },
      { id: "invoice_number", label: "Invoice Number", type: "text" as const, required: true, enabled: true, position: { x: 20, y: 45 }, fontSize: 12, fontWeight: "bold" as const },
      { id: "product_name", label: "Product Name", type: "text" as const, required: true, enabled: true, position: { x: 20, y: 70 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "product_weight", label: "Weight", type: "text" as const, required: true, enabled: true, position: { x: 150, y: 70 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "cutting_type", label: "Cutting Type", type: "text" as const, required: false, enabled: true, position: { x: 20, y: 95 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "quantity", label: "Quantity", type: "number" as const, required: true, enabled: true, position: { x: 150, y: 95 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "net_amount", label: "Net Amount", type: "number" as const, required: true, enabled: true, position: { x: 20, y: 120 }, fontSize: 12, fontWeight: "bold" as const },
      { id: "payment_mode", label: "Payment Mode", type: "text" as const, required: true, enabled: true, position: { x: 150, y: 120 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "packing_date", label: "Packing Date", type: "date" as const, required: true, enabled: true, position: { x: 20, y: 145 }, fontSize: 12, fontWeight: "normal" as const },
      { id: "barcode", label: "Product Barcode", type: "barcode" as const, required: false, enabled: true, position: { x: 20, y: 170 }, fontSize: 10, fontWeight: "normal" as const },
      { id: "brand_logo", label: "Brand Logo", type: "image" as const, required: false, enabled: true, position: { x: 200, y: 20 }, fontSize: 10, fontWeight: "normal" as const },
      { id: "support_phone", label: "Support Phone", type: "phone" as const, required: true, enabled: true, position: { x: 20, y: 200 }, fontSize: 10, fontWeight: "normal" as const },
    ],
  });

  const paperSizes = [
    { value: "A4", label: "A4 (210 × 297 mm)" },
    { value: "A5", label: "A5 (148 × 210 mm)" },
    { value: "Letter", label: "Letter (8.5 × 11 in)" },
    { value: "Custom", label: "Custom Size" },
  ];

  const labelTemplates = [
    { value: "product", label: "Product Label" },
    { value: "shipping", label: "Shipping Label" },
    { value: "barcode", label: "Barcode Label" },
    { value: "price", label: "Price Tag" },
    { value: "custom", label: "Custom Template" },
  ];

  const updateField = (fieldId: string, updates: Partial<LabelField>) => {
    setCurrentTemplate((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field,
      ),
    }));
  };

  const addField = (dataField: any) => {
    const newField: LabelField = {
      id: dataField.id,
      name: dataField.label,
      type: dataField.type,
      value: `Sample ${dataField.label}`,
      fontSize: 12,
      fontWeight: "normal",
      position: { x: 10, y: 10 },
      width: 150,
      height: 20,
      isVisible: true,
    };

    setCurrentTemplate((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
    setSelectedFields((prev) => [...prev, dataField.id]);
  };

  const removeField = (fieldId: string) => {
    setCurrentTemplate((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
    }));
    setSelectedFields((prev) => prev.filter((id) => id !== fieldId));
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Labels</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .label-container { display: flex; flex-wrap: wrap; gap: 10px; }
                .label { border: 1px solid #ccc; page-break-inside: avoid; }
                @media print {
                  body { margin: 0; padding: 0; }
                  .label-container { gap: 0; }
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownload = () => {
    // Implementation for downloading labels as PDF
    console.log("Downloading labels...");
  };

  const resetTemplate = () => {
    setCurrentTemplate({
      id: "1",
      name: "Product Label",
      width: 220,
      height: 140,
      fields: defaultFields,
      paperSize: "A4",
      orientation: "portrait",
    });
    setSelectedFields(defaultFields.map((f) => f.id));
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Label Generator</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Create and customize labels for your products
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={resetTemplate} className="text-sm">
            <RotateCcw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Reset
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="text-sm"
          >
            <Eye className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {isPreviewMode ? "Edit" : "Preview"}
          </Button>
          <Button className="text-sm">
            <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Save Template
          </Button>
        </div>
      </div>

      {/* Template Settings */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-blue-50 p-2">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Template Settings</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Configure label dimensions and layout
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Template Name"
            value={currentTemplate.name}
            onChange={(e) =>
              setCurrentTemplate((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Select
            label="Paper Size"
            value={currentTemplate.paperSize}
            onChange={(e) =>
              setCurrentTemplate((prev) => ({
                ...prev,
                paperSize: e.target.value,
              }))
            }
            options={paperSizes}
          />
          <Input
            label="Width (mm)"
            type="number"
            value={currentTemplate.width}
            onChange={(e) =>
              setCurrentTemplate((prev) => ({
                ...prev,
                width: parseInt(e.target.value),
              }))
            }
          />
          <Input
            label="Height (mm)"
            type="number"
            value={currentTemplate.height}
            onChange={(e) =>
              setCurrentTemplate((prev) => ({
                ...prev,
                height: parseInt(e.target.value),
              }))
            }
          />
        </div>
      </Card>

      {!isPreviewMode ? (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Design Panel */}
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-50 p-2">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">Label, Slip & Bill Designer</h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Design labels, create delivery slips, packing slips, and bills
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === "design" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setActiveTab("design")}
                    className="text-xs sm:text-sm"
                  >
                    Design
                  </Button>
                  <Button
                    variant={activeTab === "data" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setActiveTab("data")}
                    className="text-xs sm:text-sm"
                  >
                    Data
                  </Button>
                  <Button
                    variant={activeTab === "slips" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setActiveTab("slips")}
                    className="text-xs sm:text-sm"
                  >
                    <Truck className="mr-1 h-3 w-3" />
                    Slips
                  </Button>
                  <Button
                    variant={activeTab === "bill" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setActiveTab("bill")}
                    className="text-xs sm:text-sm"
                  >
                    <Receipt className="mr-1 h-3 w-3" />
                    Bill
                  </Button>
                  <Button
                    variant={activeTab === "print" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setActiveTab("print")}
                    className="text-xs sm:text-sm"
                  >
                    <Printer className="mr-1 h-3 w-3" />
                    Print Slips
                  </Button>
                </div>
              </div>

              {activeTab === "design" && (
                <LabelDesigner
                  template={currentTemplate}
                  onUpdateField={updateField}
                  onRemoveField={removeField}
                />
              )}

              {activeTab === "data" && (
                <DataSelector
                  availableFields={availableDataSources}
                  selectedFields={selectedFields}
                  onAddField={addField}
                  onRemoveField={removeField}
                />
              )}

              {activeTab === "slips" && (
                <SlipConfigurator
                  config={slipConfig}
                  onChange={setSlipConfig}
                />
              )}

              {activeTab === "bill" && (
                <BillEntryForm
                  onSave={(billData) => {
                    console.log("Saving bill:", billData);
                    // Here you would typically save to your backend
                    alert("Bill saved successfully!");
                  }}
                />
              )}

              {activeTab === "print" && (
                <div className="space-y-6">
                  {/* Slip Type Selector */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={slipType === 'delivery' ? 'primary' : 'secondary'}
                      onClick={() => setSlipType('delivery')}
                      className="flex-1"
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Delivery Slips
                    </Button>
                    <Button
                      variant={slipType === 'packing' ? 'primary' : 'secondary'}
                      onClick={() => setSlipType('packing')}
                      className="flex-1"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Packing Slips
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Filter Orders for {slipType === 'delivery' ? 'Delivery' : 'Packing'} Slips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="From Date"
                        type="date"
                        value={printFilters.dateFrom}
                        onChange={(e) => setPrintFilters({ ...printFilters, dateFrom: e.target.value })}
                      />
                      <Input
                        label="To Date"
                        type="date"
                        value={printFilters.dateTo}
                        onChange={(e) => setPrintFilters({ ...printFilters, dateTo: e.target.value })}
                      />
                      <Input
                        label="Customer Name"
                        value={printFilters.customer}
                        onChange={(e) => setPrintFilters({ ...printFilters, customer: e.target.value })}
                        placeholder="Search customer..."
                      />
                      <Input
                        label="Invoice Number"
                        value={printFilters.invoiceNumber}
                        onChange={(e) => setPrintFilters({ ...printFilters, invoiceNumber: e.target.value })}
                        placeholder="INV-2024-001"
                      />
                      <Input
                        label="Product Name"
                        value={printFilters.product}
                        onChange={(e) => setPrintFilters({ ...printFilters, product: e.target.value })}
                        placeholder="Search product..."
                      />
                      <div className="flex items-end">
                        <Button
                          variant="secondary"
                          onClick={() => setPrintFilters({ dateFrom: '', dateTo: '', customer: '', invoiceNumber: '', product: '', selectedOrders: [] })}
                          className="w-full"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Orders List */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">
                        Orders ({printFilters.selectedOrders.length} selected)
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setPrintFilters({ ...printFilters, selectedOrders: mockOrders.map(o => o.id) })}
                        >
                          Select All
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setPrintFilters({ ...printFilters, selectedOrders: [] })}
                        >
                          Deselect All
                        </Button>
                        <Button
                          size="sm"
                          disabled={printFilters.selectedOrders.length === 0}
                          onClick={() => alert(`Printing ${printFilters.selectedOrders.length} ${slipType} slips...`)}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Print {slipType === 'delivery' ? 'Delivery' : 'Packing'} Slips
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {mockOrders
                        .filter(order => {
                          if (printFilters.dateFrom && order.date < printFilters.dateFrom) return false;
                          if (printFilters.dateTo && order.date > printFilters.dateTo) return false;
                          if (printFilters.customer && !order.customer.toLowerCase().includes(printFilters.customer.toLowerCase())) return false;
                          if (printFilters.invoiceNumber && !order.invoice.toLowerCase().includes(printFilters.invoiceNumber.toLowerCase())) return false;
                          if (printFilters.product && !order.product.toLowerCase().includes(printFilters.product.toLowerCase())) return false;
                          return true;
                        })
                        .map(order => (
                          <div
                            key={order.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              printFilters.selectedOrders.includes(order.id)
                                ? 'bg-blue-50 border-blue-300'
                                : 'bg-white hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              const selected = printFilters.selectedOrders.includes(order.id)
                                ? printFilters.selectedOrders.filter(id => id !== order.id)
                                : [...printFilters.selectedOrders, order.id];
                              setPrintFilters({ ...printFilters, selectedOrders: selected });
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <input
                                  type="checkbox"
                                  checked={printFilters.selectedOrders.includes(order.id)}
                                  onChange={() => {}}
                                  className="h-4 w-4 rounded"
                                />
                                <div>
                                  <p className="font-semibold">{order.id}</p>
                                  <p className="text-sm text-gray-600">{order.date}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{order.customer}</p>
                                  <p className="text-xs text-gray-500">{order.invoice}</p>
                                </div>
                                <div>
                                  <p className="text-sm">{order.product}</p>
                                  <p className="text-xs text-gray-500">₹{order.amount}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(`Printing ${slipType} slip for ${order.id}...`);
                                }}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Field Properties */}
          <div>
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="rounded-lg bg-purple-50 p-2">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">Field Properties</h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Customize selected field
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-xs sm:text-sm text-gray-500 text-center py-6 sm:py-8">
                  Select a field to edit its properties
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4 sm:mt-6 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="rounded-lg bg-orange-50 p-2">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold">Quick Actions</h3>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start text-xs sm:text-sm"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Add Text Field
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start text-xs sm:text-sm"
                  size="sm"
                >
                  <Barcode className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Add Barcode
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start text-xs sm:text-sm"
                  size="sm"
                >
                  <QrCode className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Add QR Code
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start text-xs sm:text-sm"
                  size="sm"
                >
                  <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Add Date Field
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Preview Mode */
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">Label Preview</h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Preview your labels before printing
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="secondary" onClick={handleDownload} className="text-xs sm:text-sm">
                    <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                  <Button onClick={handlePrint} className="text-xs sm:text-sm">
                    <Printer className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Print
                  </Button>
                </div>
              </div>

              <div ref={printRef}>
                <LabelPreview
                  template={currentTemplate}
                  quantity={labelQuantity}
                />
              </div>
            </Card>
          </div>

          {/* Print Settings */}
          <div>
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="rounded-lg bg-red-50 p-2">
                  <Printer className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">Print Settings</h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Configure printing options
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Number of Labels
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setLabelQuantity(Math.max(1, labelQuantity - 1))
                      }
                      className="p-1 sm:p-2"
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={labelQuantity}
                      onChange={(e) =>
                        setLabelQuantity(
                          Math.max(1, parseInt(e.target.value) || 1),
                        )
                      }
                      className="text-center text-xs sm:text-sm"
                      min="1"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setLabelQuantity(labelQuantity + 1)}
                      className="p-1 sm:p-2"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>

                <Select
                  label="Print Quality"
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "normal", label: "Normal" },
                    { value: "high", label: "High Quality" },
                  ]}
                  className="text-xs sm:text-sm"
                />

                <Select
                  label="Printer"
                  options={[
                    { value: "default", label: "Default Printer" },
                    { value: "thermal", label: "Thermal Printer" },
                    { value: "laser", label: "Laser Printer" },
                  ]}
                  className="text-xs sm:text-sm"
                />

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-xs sm:text-sm">Print borders</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-xs sm:text-sm">Print in grayscale</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-xs sm:text-sm">Fit to page</span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Template Library */}
            <Card className="mt-4 sm:mt-6 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="rounded-lg bg-yellow-50 p-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold">Templates</h3>
                </div>
              </div>

              <div className="space-y-2">
                {labelTemplates.map((template) => (
                  <button
                    key={template.value}
                    className="w-full text-left p-2 rounded hover:bg-gray-50 text-xs sm:text-sm"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
