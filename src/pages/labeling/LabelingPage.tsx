import { useEffect, useMemo, useRef, useState } from "react";
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
import { BillEntryForm } from "../../components/labeling/BillEntryForm";
import { useAuth } from "../../context/AuthContext";
import { labelingBackend, type LabelField, type LabelTemplate, type DataCategory, type PrintOrder, type SlipConfig } from "../../utils/labelingBackend";

export function LabelingPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<LabelTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<LabelTemplate | null>(null);
  const [defaultTemplate, setDefaultTemplate] = useState<LabelTemplate | null>(null);
  const [defaultSlipConfig, setDefaultSlipConfig] = useState<SlipConfig | null>(null);
  const [slipConfig, setSlipConfig] = useState<SlipConfig>({ deliverySlip: [], packingSlip: [] });
  const [dataSources, setDataSources] = useState<DataCategory[]>([]);
  const [slipPreviewValues, setSlipPreviewValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<PrintOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"design" | "data" | "preview" | "slips" | "bill" | "print">(
    "design",
  );
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [labelQuantity, setLabelQuantity] = useState(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Print Filters State
  const [printFilters, setPrintFilters] = useState({
    dateFrom: "",
    dateTo: "",
    customer: "",
    invoiceNumber: "",
    product: "",
    selectedOrders: [] as string[],
  });

  const [slipType, setSlipType] = useState<"delivery" | "packing">("delivery");

  const cloneTemplate = (template: LabelTemplate) =>
    JSON.parse(JSON.stringify(template)) as LabelTemplate;

  const applyTemplate = (template: LabelTemplate, slipOverride?: SlipConfig | null) => {
    const cloned = cloneTemplate(template);
    setCurrentTemplate(cloned);
    setSelectedFields(cloned.fields.map((field) => field.id));
    if (slipOverride) {
      setSlipConfig(slipOverride);
    } else if (cloned.slipConfig) {
      setSlipConfig(cloned.slipConfig);
    } else if (defaultSlipConfig) {
      setSlipConfig(defaultSlipConfig);
    }
  };

  const isUuid = (value?: string | null) => {
    if (!value) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  };

  useEffect(() => {
    let active = true;

    const loadBootstrap = async () => {
      try {
        setLoading(true);
        const data = await labelingBackend.getBootstrap();

        if (!active) return;

        setTemplates(data.templates);
        setDataSources(data.dataSources || []);
        setDefaultTemplate(data.defaults?.template || null);
        setDefaultSlipConfig(data.defaults?.slipConfig || null);
        setSlipPreviewValues(data.slipPreview || {});

        const initialTemplate = data.templates[0] || data.defaults?.template;
        const initialSlipConfig = data.templates[0]?.slipConfig || data.defaults?.slipConfig;

        if (initialTemplate) {
          applyTemplate(initialTemplate, initialSlipConfig || null);
          setActiveTemplateId(initialTemplate.id ?? null);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to load labeling bootstrap", err);
        if (active) {
          setError("Failed to load label templates.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadBootstrap();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setOrdersLoading(true);
        const params: Record<string, string> = {};
        if (user?.loginType === "hub") {
          params.moduleScope = "hub";
          if (user.hubId) params.hubId = user.hubId;
        }
        if (user?.loginType === "store") {
          params.moduleScope = "store";
          if (user.storeId) params.storeId = user.storeId;
        }

        const result = await labelingBackend.listPrintOrders(Object.keys(params).length ? params : undefined);

        if (!active) return;

        setOrders(result.items);
      } catch (err) {
        console.error("Failed to load print orders", err);
        if (active) {
          setOrders([]);
        }
      } finally {
        if (active) {
          setOrdersLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      active = false;
    };
  }, [user?.loginType, user?.hubId, user?.storeId]);

  const paperSizes = [
    { value: "A4", label: "A4 (210 × 297 mm)" },
    { value: "A5", label: "A5 (148 × 210 mm)" },
    { value: "Letter", label: "Letter (8.5 × 11 in)" },
    { value: "Custom", label: "Custom Size" },
  ];

  const updateField = (fieldId: string, updates: Partial<LabelField>) => {
    setCurrentTemplate((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        fields: prev.fields.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field,
        ),
      };
    });
  };

  const addField = (dataField: { id: string; label: string; type: LabelField["type"]; sourceCategory?: string }) => {
    if (!currentTemplate) return;
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
      sourceCategory: dataField.sourceCategory ?? null,
    };

    setCurrentTemplate((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        fields: [...prev.fields, newField],
      };
    });
    setSelectedFields((prev) => [...prev, dataField.id]);
  };

  const removeField = (fieldId: string) => {
    setCurrentTemplate((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        fields: prev.fields.filter((field) => field.id !== fieldId),
      };
    });
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
    if (!printRef.current) {
      return;
    }
    const blob = new Blob([printRef.current.innerHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `labels-${new Date().toISOString().split("T")[0]}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSaveTemplate = async () => {
    if (!currentTemplate) return;

    try {
      setSaving(true);
      const saved = await labelingBackend.saveTemplate(currentTemplate, slipConfig);
      setTemplates((prev) => {
        const index = prev.findIndex((template) => template.id === saved.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      setActiveTemplateId(saved.id);
      applyTemplate(saved, saved.slipConfig || slipConfig);
    } catch (err) {
      console.error("Failed to save template", err);
      alert("Failed to save template. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const resetTemplate = () => {
    const baseline = templates.find((template) => template.id === activeTemplateId) || defaultTemplate;
    if (baseline) {
      applyTemplate(baseline, baseline.slipConfig || defaultSlipConfig);
    }
  };

  const handleCreatePrintJob = async (orderIds: string[]) => {
    if (!currentTemplate || !isUuid(currentTemplate.id)) {
      alert("Please save the template before printing slips.");
      return;
    }

    if (!orderIds.length) {
      return;
    }

    try {
      await labelingBackend.createPrintJob({
        templateId: currentTemplate.id,
        slipType,
        printCount: Math.max(1, labelQuantity),
        filters: {
          dateFrom: printFilters.dateFrom,
          dateTo: printFilters.dateTo,
          customer: printFilters.customer,
          invoiceNumber: printFilters.invoiceNumber,
          product: printFilters.product,
        },
        selectedOrders: orderIds,
      });
      alert(`Queued ${orderIds.length} ${slipType} slip(s) for printing.`);
    } catch (err) {
      console.error("Failed to create print job", err);
      alert("Failed to create print job. Please try again.");
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];

    return orders.filter((order) => {
      const orderDate = order.date ? new Date(order.date).toISOString().split("T")[0] : "";

      if (printFilters.dateFrom && orderDate < printFilters.dateFrom) return false;
      if (printFilters.dateTo && orderDate > printFilters.dateTo) return false;
      if (printFilters.customer && !order.customer.toLowerCase().includes(printFilters.customer.toLowerCase())) return false;
      if (printFilters.invoiceNumber && !(order.invoiceNumber || "").toLowerCase().includes(printFilters.invoiceNumber.toLowerCase())) return false;
      if (printFilters.product && !(order.product || "").toLowerCase().includes(printFilters.product.toLowerCase())) return false;
      return true;
    });
  }, [orders, printFilters]);

  const templateLibrary = templates.length ? templates : defaultTemplate ? [defaultTemplate] : [];

  if (loading || !currentTemplate) {
    return (
      <div className="p-6 text-sm text-gray-600">
        {loading ? "Loading labeling workspace..." : "No label template data available."}
      </div>
    );
  }

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
          <Button className="text-sm" onClick={handleSaveTemplate} disabled={saving}>
            <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {saving ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 text-sm text-red-600 border border-red-200 bg-red-50">
          {error}
        </Card>
      )}

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
              setCurrentTemplate((prev) => (prev ? { ...prev, name: e.target.value } : prev))
            }
          />
          <Select
            label="Paper Size"
            value={currentTemplate.paperSize}
            onChange={(e) =>
              setCurrentTemplate((prev) =>
                prev
                  ? {
                      ...prev,
                      paperSize: e.target.value,
                    }
                  : prev
              )
            }
            options={paperSizes}
          />
          <Input
            label="Width (mm)"
            type="number"
            value={currentTemplate.width}
            onChange={(e) =>
              setCurrentTemplate((prev) =>
                prev
                  ? {
                      ...prev,
                      width: parseInt(e.target.value, 10),
                    }
                  : prev
              )
            }
          />
          <Input
            label="Height (mm)"
            type="number"
            value={currentTemplate.height}
            onChange={(e) =>
              setCurrentTemplate((prev) =>
                prev
                  ? {
                      ...prev,
                      height: parseInt(e.target.value, 10),
                    }
                  : prev
              )
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
                  availableFields={dataSources}
                  selectedFields={selectedFields}
                  onAddField={addField}
                  onRemoveField={removeField}
                />
              )}

              {activeTab === "slips" && (
                <SlipConfigurator
                  config={slipConfig}
                  onChange={setSlipConfig}
                  previewValues={slipPreviewValues}
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
                          onClick={() => setPrintFilters({ dateFrom: "", dateTo: "", customer: "", invoiceNumber: "", product: "", selectedOrders: [] })}
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
                          onClick={() => setPrintFilters({ ...printFilters, selectedOrders: filteredOrders.map(o => o.id) })}
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
                          onClick={() => handleCreatePrintJob(printFilters.selectedOrders)}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Print {slipType === 'delivery' ? 'Delivery' : 'Packing'} Slips
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ordersLoading && (
                        <div className="text-sm text-gray-500">Loading orders...</div>
                      )}
                      {!ordersLoading && filteredOrders.length === 0 && (
                        <div className="text-sm text-gray-500">No orders match the current filters.</div>
                      )}
                      {!ordersLoading && filteredOrders.map(order => (
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
                                  <p className="font-semibold">{order.orderNumber}</p>
                                  <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{order.customer}</p>
                                  <p className="text-xs text-gray-500">{order.invoiceNumber || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-sm">{order.product || '-'}</p>
                                  <p className="text-xs text-gray-500">Rs {order.amount}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void handleCreatePrintJob([order.id]);
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
                {templateLibrary.length === 0 && (
                  <div className="text-xs sm:text-sm text-gray-500">No templates available.</div>
                )}
                {templateLibrary.map((template) => (
                  <button
                    key={template.id}
                    className={`w-full text-left p-2 rounded text-xs sm:text-sm ${
                      activeTemplateId === template.id ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      applyTemplate(template, template.slipConfig || defaultSlipConfig);
                      setActiveTemplateId(template.id);
                    }}
                  >
                    {template.name}
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
