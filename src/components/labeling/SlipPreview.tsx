import { Card } from "../ui";
import { Package, Truck, QrCode, Barcode } from "lucide-react";

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

interface SlipPreviewProps {
  fields: SlipField[];
  type: "delivery" | "packing";
  className?: string;
}

const mockData: Record<string, string> = {
  customer_name: "John Doe",
  customer_address: "123 Main St, City, State 12345",
  phone_number: "+91 9876543210",
  alternate_phone: "+91 9876543211",
  invoice_number: "INV-2024-001",
  net_amount: "₹1,250.00",
  payment_mode: "Online Payment",
  delivery_date: "2024-01-30",
  delivery_slot: "10:00 AM - 12:00 PM",
  delivery_instructions: "Ring the doorbell twice",
  support_phone: "+91 1800-123-456",
  product_name: "Fresh Salmon - Premium Cut",
  product_weight: "1.5 kg",
  cutting_type: "Fillet",
  quantity: "2",
  packing_date: "2024-01-29",
};

export const SlipPreview = ({ fields, type, className }: SlipPreviewProps) => {
  const enabledFields = fields.filter(field => field.enabled);
  
  const renderField = (field: SlipField) => {
    const value = mockData[field.id] || `{${field.label}}`;
    
    const style = {
      position: 'absolute' as const,
      left: `${field.position.x}px`,
      top: `${field.position.y}px`,
      fontSize: `${field.fontSize}px`,
      fontWeight: field.fontWeight,
    };

    if (field.type === 'qr') {
      return (
        <div key={field.id} style={style} className="flex items-center gap-1">
          <QrCode className="h-6 w-6" />
          <span className="text-xs">QR Code</span>
        </div>
      );
    }

    if (field.type === 'barcode') {
      return (
        <div key={field.id} style={style} className="flex items-center gap-1">
          <Barcode className="h-4 w-4" />
          <span className="text-xs">|||||||||||</span>
        </div>
      );
    }

    if (field.type === 'image') {
      return (
        <div key={field.id} style={style} className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-xs text-gray-500">Logo</span>
        </div>
      );
    }

    return (
      <div key={field.id} style={style} className="text-gray-800">
        {field.required && <span className="text-red-500 mr-1">*</span>}
        {value}
      </div>
    );
  };

  return (
    <Card className={className}>
      <div className="flex items-center gap-2 mb-4">
        {type === 'delivery' ? (
          <Truck className="h-5 w-5 text-blue-600" />
        ) : (
          <Package className="h-5 w-5 text-green-600" />
        )}
        <h3 className="font-medium">
          {type === 'delivery' ? 'Delivery Slip Preview' : 'Packing Slip Preview'}
        </h3>
      </div>
      
      <div className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg" style={{ height: '300px', width: '100%' }}>
        {enabledFields.map(renderField)}
        
        {enabledFields.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No fields enabled</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        {enabledFields.length} field(s) enabled • {enabledFields.filter(f => f.required).length} required
      </div>
    </Card>
  );
};
