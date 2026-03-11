import { useState } from "react";
import { Card, Button, Input, Select, Modal } from "../ui";
import { Plus, Edit, Copy, Trash2, FileText, Package, Truck } from "lucide-react";

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

interface TemplateManagerProps {
  templates: SlipTemplate[];
  activeTemplateId: string;
  onTemplateChange: (templateId: string) => void;
  onTemplateCreate: (template: Omit<SlipTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTemplateUpdate: (templateId: string, template: Partial<SlipTemplate>) => void;
  onTemplateDelete: (templateId: string) => void;
  className?: string;
}

export const TemplateManager = ({
  templates,
  activeTemplateId,
  onTemplateChange,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
  className
}: TemplateManagerProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateType, setNewTemplateType] = useState<"delivery" | "packing">("delivery");

  const activeTemplate = templates.find(t => t.id === activeTemplateId);
  const deliveryTemplates = templates.filter(t => t.type === "delivery");
  const packingTemplates = templates.filter(t => t.type === "packing");

  const createTemplate = () => {
    if (!newTemplateName.trim()) return;
    
    const defaultFields: SlipField[] = newTemplateType === "delivery" ? [
      { id: "customer_name", label: "Customer Name", type: "text", required: true, enabled: true, position: { x: 20, y: 20 }, fontSize: 14, fontWeight: "bold" },
      { id: "customer_address", label: "Delivery Address", type: "address", required: true, enabled: true, position: { x: 20, y: 45 }, fontSize: 12, fontWeight: "normal" },
      { id: "phone_number", label: "Phone Number", type: "phone", required: true, enabled: true, position: { x: 20, y: 85 }, fontSize: 12, fontWeight: "normal" },
      { id: "invoice_number", label: "Invoice Number", type: "text", required: true, enabled: true, position: { x: 20, y: 110 }, fontSize: 12, fontWeight: "bold" },
      { id: "net_amount", label: "Net Amount", type: "number", required: true, enabled: true, position: { x: 150, y: 110 }, fontSize: 12, fontWeight: "bold" },
      { id: "delivery_date", label: "Delivery Date", type: "date", required: true, enabled: true, position: { x: 20, y: 160 }, fontSize: 12, fontWeight: "normal" },
      { id: "support_phone", label: "Support Phone", type: "phone", required: true, enabled: true, position: { x: 20, y: 210 }, fontSize: 10, fontWeight: "normal" },
    ] : [
      { id: "customer_name", label: "Customer Name", type: "text", required: true, enabled: true, position: { x: 20, y: 20 }, fontSize: 14, fontWeight: "bold" },
      { id: "invoice_number", label: "Invoice Number", type: "text", required: true, enabled: true, position: { x: 20, y: 45 }, fontSize: 12, fontWeight: "bold" },
      { id: "product_name", label: "Product Name", type: "text", required: true, enabled: true, position: { x: 20, y: 70 }, fontSize: 12, fontWeight: "normal" },
      { id: "product_weight", label: "Weight", type: "text", required: true, enabled: true, position: { x: 150, y: 70 }, fontSize: 12, fontWeight: "normal" },
      { id: "quantity", label: "Quantity", type: "number", required: true, enabled: true, position: { x: 150, y: 95 }, fontSize: 12, fontWeight: "normal" },
      { id: "net_amount", label: "Net Amount", type: "number", required: true, enabled: true, position: { x: 20, y: 120 }, fontSize: 12, fontWeight: "bold" },
    ];

    onTemplateCreate({
      name: newTemplateName,
      type: newTemplateType,
      fields: defaultFields
    });

    setNewTemplateName("");
    setShowCreateModal(false);
  };

  const duplicateTemplate = (template: SlipTemplate) => {
    onTemplateCreate({
      name: `${template.name} (Copy)`,
      type: template.type,
      fields: [...template.fields]
    });
  };

  const TemplateCard = ({ template }: { template: SlipTemplate }) => (
    <div className={`p-3 border rounded-lg cursor-pointer transition-all ${
      template.id === activeTemplateId 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {template.type === 'delivery' ? (
            <Truck className="h-4 w-4 text-blue-600" />
          ) : (
            <Package className="h-4 w-4 text-green-600" />
          )}
          <span className="font-medium text-sm">{template.name}</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setEditingTemplate(template.id);
              setNewTemplateName(template.name);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              duplicateTemplate(template);
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (templates.length > 1) {
                onTemplateDelete(template.id);
              }
            }}
            disabled={templates.length <= 1}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        {template.fields.filter(f => f.enabled).length} fields enabled
      </div>
      <Button
        variant={template.id === activeTemplateId ? "primary" : "secondary"}
        size="sm"
        className="w-full mt-2"
        onClick={() => onTemplateChange(template.id)}
      >
        {template.id === activeTemplateId ? "Active" : "Use Template"}
      </Button>
    </div>
  );

  return (
    <div className={className}>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Template Manager</h3>
              <p className="text-sm text-gray-600">Manage slip templates</p>
            </div>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>

        {activeTemplate && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              {activeTemplate.type === 'delivery' ? (
                <Truck className="h-4 w-4 text-blue-600" />
              ) : (
                <Package className="h-4 w-4 text-green-600" />
              )}
              <span className="font-medium">Active: {activeTemplate.name}</span>
            </div>
            <div className="text-sm text-gray-600">
              {activeTemplate.fields.filter(f => f.enabled).length} of {activeTemplate.fields.length} fields enabled
            </div>
          </div>
        )}

        <div className="space-y-6">
          {deliveryTemplates.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                Delivery Slip Templates ({deliveryTemplates.length})
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {deliveryTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </div>
          )}

          {packingTemplates.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-green-600" />
                Packing Slip Templates ({packingTemplates.length})
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {packingTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Create Template Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Template"
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="Enter template name"
          />
          <Select
            label="Template Type"
            value={newTemplateType}
            onChange={(e) => setNewTemplateType(e.target.value as "delivery" | "packing")}
            options={[
              { value: "delivery", label: "Delivery Slip" },
              { value: "packing", label: "Packing Slip" },
            ]}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={createTemplate} disabled={!newTemplateName.trim()}>
              Create Template
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Template Modal */}
      <Modal
        isOpen={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        title="Edit Template Name"
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="Enter template name"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setEditingTemplate(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (editingTemplate && newTemplateName.trim()) {
                  onTemplateUpdate(editingTemplate, { name: newTemplateName });
                  setEditingTemplate(null);
                  setNewTemplateName("");
                }
              }}
              disabled={!newTemplateName.trim()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
