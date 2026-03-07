import { useState } from "react";
import { Card, Button, Input, Select, Checkbox } from "../ui";
import { Package, FileText, Truck, Settings } from "lucide-react";
import { SlipPreview } from "./SlipPreview";
import { TemplateManager } from "./TemplateManager";

interface SlipField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "phone" | "address" | "qr" | "image" | "barcode";
  required: boolean;
  enabled: boolean;
  position: { x: number; y: number };
  fontSize: number;
  fontWeight: "normal" | "bold";
}

interface SlipTemplate {
  id: string;
  name: string;
  type: "delivery" | "packing";
  fields: SlipField[];
  createdAt: string;
  updatedAt: string;
}

interface SlipConfig {
  deliverySlip: SlipField[];
  packingSlip: SlipField[];
}

export type { SlipConfig, SlipField };

const defaultDeliveryFields: SlipField[] = [
  { id: "customer_name", label: "Customer Name", type: "text", required: true, enabled: true, position: { x: 20, y: 20 }, fontSize: 14, fontWeight: "bold" },
  { id: "customer_address", label: "Delivery Address", type: "address", required: true, enabled: true, position: { x: 20, y: 45 }, fontSize: 12, fontWeight: "normal" },
  { id: "phone_number", label: "Phone Number", type: "phone", required: true, enabled: true, position: { x: 20, y: 85 }, fontSize: 12, fontWeight: "normal" },
  { id: "alternate_phone", label: "Alternate Phone", type: "phone", required: false, enabled: true, position: { x: 150, y: 85 }, fontSize: 12, fontWeight: "normal" },
  { id: "invoice_number", label: "Invoice Number", type: "text", required: true, enabled: true, position: { x: 20, y: 110 }, fontSize: 12, fontWeight: "bold" },
  { id: "net_amount", label: "Net Amount", type: "number", required: true, enabled: true, position: { x: 150, y: 110 }, fontSize: 12, fontWeight: "bold" },
  { id: "payment_mode", label: "Payment Mode", type: "text", required: true, enabled: true, position: { x: 20, y: 135 }, fontSize: 12, fontWeight: "normal" },
  { id: "delivery_date", label: "Delivery Date", type: "date", required: true, enabled: true, position: { x: 20, y: 160 }, fontSize: 12, fontWeight: "normal" },
  { id: "delivery_slot", label: "Delivery Slot", type: "text", required: false, enabled: true, position: { x: 150, y: 160 }, fontSize: 12, fontWeight: "normal" },
  { id: "delivery_instructions", label: "Delivery Instructions", type: "text", required: false, enabled: true, position: { x: 20, y: 185 }, fontSize: 10, fontWeight: "normal" },
  { id: "support_phone", label: "Support Phone", type: "phone", required: true, enabled: true, position: { x: 20, y: 210 }, fontSize: 10, fontWeight: "normal" },
  { id: "qr_code", label: "QR Code", type: "qr", required: false, enabled: true, position: { x: 200, y: 20 }, fontSize: 10, fontWeight: "normal" },
  { id: "brand_logo", label: "Brand Logo", type: "image", required: false, enabled: true, position: { x: 200, y: 60 }, fontSize: 10, fontWeight: "normal" },
];

const defaultPackingFields: SlipField[] = [
  { id: "customer_name", label: "Customer Name", type: "text", required: true, enabled: true, position: { x: 20, y: 20 }, fontSize: 14, fontWeight: "bold" },
  { id: "invoice_number", label: "Invoice Number", type: "text", required: true, enabled: true, position: { x: 20, y: 45 }, fontSize: 12, fontWeight: "bold" },
  { id: "product_name", label: "Product Name", type: "text", required: true, enabled: true, position: { x: 20, y: 70 }, fontSize: 12, fontWeight: "normal" },
  { id: "product_weight", label: "Weight", type: "text", required: true, enabled: true, position: { x: 150, y: 70 }, fontSize: 12, fontWeight: "normal" },
  { id: "cutting_type", label: "Cutting Type", type: "text", required: false, enabled: true, position: { x: 20, y: 95 }, fontSize: 12, fontWeight: "normal" },
  { id: "quantity", label: "Quantity", type: "number", required: true, enabled: true, position: { x: 150, y: 95 }, fontSize: 12, fontWeight: "normal" },
  { id: "net_amount", label: "Net Amount", type: "number", required: true, enabled: true, position: { x: 20, y: 120 }, fontSize: 12, fontWeight: "bold" },
  { id: "payment_mode", label: "Payment Mode", type: "text", required: true, enabled: true, position: { x: 150, y: 120 }, fontSize: 12, fontWeight: "normal" },
  { id: "packing_date", label: "Packing Date", type: "date", required: true, enabled: true, position: { x: 20, y: 145 }, fontSize: 12, fontWeight: "normal" },
  { id: "barcode", label: "Product Barcode", type: "barcode", required: false, enabled: true, position: { x: 20, y: 170 }, fontSize: 10, fontWeight: "normal" },
  { id: "brand_logo", label: "Brand Logo", type: "image", required: false, enabled: true, position: { x: 200, y: 20 }, fontSize: 10, fontWeight: "normal" },
  { id: "support_phone", label: "Support Phone", type: "phone", required: true, enabled: true, position: { x: 20, y: 200 }, fontSize: 10, fontWeight: "normal" },
];

interface SlipConfiguratorProps {
  config: SlipConfig;
  onChange: (config: SlipConfig) => void;
  className?: string;
}

export const SlipConfigurator = ({ config, onChange, className }: SlipConfiguratorProps) => {
  const [activeTab, setActiveTab] = useState<'delivery' | 'packing'>('delivery');
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  
  // Template management state
  const [templates, setTemplates] = useState<SlipTemplate[]>([
    {
      id: "default-delivery",
      name: "Default Delivery Slip",
      type: "delivery",
      fields: defaultDeliveryFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "default-packing",
      name: "Default Packing Slip", 
      type: "packing",
      fields: defaultPackingFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);
  
  const [activeTemplateId, setActiveTemplateId] = useState("default-delivery");

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setActiveTemplateId(templateId);
      if (template.type === 'delivery') {
        onChange({ ...config, deliverySlip: template.fields });
        setActiveTab('delivery');
      } else {
        onChange({ ...config, packingSlip: template.fields });
        setActiveTab('packing');
      }
    }
  };

  const handleTemplateCreate = (templateData: Omit<SlipTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: SlipTemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates(prev => [...prev, newTemplate]);
    setActiveTemplateId(newTemplate.id);
    
    // Apply the new template
    if (newTemplate.type === 'delivery') {
      onChange({ ...config, deliverySlip: newTemplate.fields });
      setActiveTab('delivery');
    } else {
      onChange({ ...config, packingSlip: newTemplate.fields });
      setActiveTab('packing');
    }
  };

  const handleTemplateUpdate = (templateId: string, updates: Partial<SlipTemplate>) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId 
        ? { ...t, ...updates, updatedAt: new Date().toISOString() }
        : t
    ));
  };

  const handleTemplateDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    if (activeTemplateId === templateId) {
      const remainingTemplate = templates.find(t => t.id !== templateId);
      if (remainingTemplate) {
        handleTemplateChange(remainingTemplate.id);
      }
    }
  };

  // Save current changes to active template
  const saveToTemplate = () => {
    const currentFields = activeTab === 'delivery' ? config.deliverySlip : config.packingSlip;
    handleTemplateUpdate(activeTemplateId, { fields: currentFields });
  };

  const updateField = (slipType: 'delivery' | 'packing', fieldId: string, updates: Partial<SlipField>) => {
    const key = slipType === 'delivery' ? 'deliverySlip' : 'packingSlip';
    const updatedFields = config[key].map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    onChange({ ...config, [key]: updatedFields });
  };

  const FieldRow = ({ field, slipType }: { field: SlipField; slipType: 'delivery' | 'packing' }) => (
    <div className="grid grid-cols-12 gap-3 items-center p-3 border rounded-lg">
      <div className="col-span-3">
        <Checkbox
          checked={field.enabled}
          onChange={(e) => updateField(slipType, field.id, { enabled: e.target.checked })}
          label={field.label}
        />
      </div>
      <div className="col-span-2">
        <Select
          value={field.fontSize.toString()}
          onChange={(e) => updateField(slipType, field.id, { fontSize: parseInt(e.target.value) })}
          options={[
            { value: "8", label: "8px" },
            { value: "10", label: "10px" },
            { value: "12", label: "12px" },
            { value: "14", label: "14px" },
            { value: "16", label: "16px" },
          ]}
        />
      </div>
      <div className="col-span-2">
        <Select
          value={field.fontWeight}
          onChange={(e) => updateField(slipType, field.id, { fontWeight: e.target.value as "normal" | "bold" })}
          options={[
            { value: "normal", label: "Normal" },
            { value: "bold", label: "Bold" },
          ]}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          value={field.position.x}
          onChange={(e) => updateField(slipType, field.id, { 
            position: { ...field.position, x: parseInt(e.target.value) || 0 }
          })}
          placeholder="X"
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          value={field.position.y}
          onChange={(e) => updateField(slipType, field.id, { 
            position: { ...field.position, y: parseInt(e.target.value) || 0 }
          })}
          placeholder="Y"
        />
      </div>
      <div className="col-span-1 text-center">
        {field.required && <span className="text-red-500 text-sm">*</span>}
      </div>
    </div>
  );

  const currentFields = activeTab === 'delivery' ? config.deliverySlip : config.packingSlip;

  return (
    <div className="space-y-6">
      {/* Template Manager Toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">Templates</h3>
              <p className="text-sm text-gray-600">
                Active: {templates.find(t => t.id === activeTemplateId)?.name}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={saveToTemplate}>
              <Settings className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowTemplateManager(!showTemplateManager)}
            >
              <FileText className="mr-2 h-4 w-4" />
              {showTemplateManager ? 'Hide' : 'Manage'} Templates
            </Button>
          </div>
        </div>
      </Card>

      {/* Template Manager */}
      {showTemplateManager && (
        <TemplateManager
          templates={templates}
          activeTemplateId={activeTemplateId}
          onTemplateChange={handleTemplateChange}
          onTemplateCreate={handleTemplateCreate}
          onTemplateUpdate={handleTemplateUpdate}
          onTemplateDelete={handleTemplateDelete}
        />
      )}

      {/* Configuration Interface */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className={className}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                {activeTab === 'delivery' ? 
                  <Truck className="h-5 w-5 text-blue-600" /> : 
                  <Package className="h-5 w-5 text-green-600" />
                }
              </div>
              <div>
                <h2 className="text-lg font-semibold">Field Configuration</h2>
                <p className="text-sm text-gray-600">Configure slip fields</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('delivery')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'delivery'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Truck className="h-4 w-4" />
              Delivery Slip
            </button>
            <button
              onClick={() => setActiveTab('packing')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'packing'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="h-4 w-4" />
              Packing Slip
            </button>
          </div>

          {/* Field Configuration */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-700 px-3">
              <div className="col-span-3">Field Name</div>
              <div className="col-span-2">Font Size</div>
              <div className="col-span-2">Font Weight</div>
              <div className="col-span-2">X Position</div>
              <div className="col-span-2">Y Position</div>
              <div className="col-span-1">Required</div>
            </div>

            <div className="space-y-2">
              {currentFields.map(field => (
                <FieldRow 
                  key={field.id} 
                  field={field} 
                  slipType={activeTab}
                />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Configuration Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Enabled Fields:</span>
                <span className="ml-2 font-medium">{currentFields.filter(f => f.enabled).length}</span>
              </div>
              <div>
                <span className="text-gray-600">Required Fields:</span>
                <span className="ml-2 font-medium">{currentFields.filter(f => f.required && f.enabled).length}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <SlipPreview
          fields={currentFields}
          type={activeTab}
        />
      </div>
    </div>
  );
};
