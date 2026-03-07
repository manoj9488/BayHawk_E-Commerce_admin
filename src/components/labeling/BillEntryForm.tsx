import { useState } from "react";
import { Card, Button, Input, Select } from "../ui";
import { Receipt, Plus, Minus, Save, Eye } from "lucide-react";

interface BillItem {
  id: string;
  productName: string;
  weight: string;
  cuttingType: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

interface BillData {
  // Customer Details
  customerName: string;
  customerAddress: string;
  phoneNumber: string;
  alternatePhone: string;
  
  // Bill Details
  invoiceNumber: string;
  billDate: string;
  dueDate: string;
  
  // Delivery Details
  deliveryDate: string;
  deliverySlot: string;
  deliveryInstructions: string;
  
  // Items
  items: BillItem[];
  
  // Payment Details
  paymentMode: string;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  deliveryCharges: number;
  netAmount: number;
  
  // Additional Details
  supportPhone: string;
  notes: string;
}

interface BillEntryFormProps {
  onSave: (billData: BillData) => void;
  className?: string;
}

export const BillEntryForm = ({ onSave, className }: BillEntryFormProps) => {
  const [billData, setBillData] = useState<BillData>({
    customerName: "",
    customerAddress: "",
    phoneNumber: "",
    alternatePhone: "",
    invoiceNumber: `INV-${Date.now()}`,
    billDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    deliveryDate: "",
    deliverySlot: "",
    deliveryInstructions: "",
    items: [{
      id: "1",
      productName: "",
      weight: "",
      cuttingType: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      total: 0
    }],
    paymentMode: "cash",
    subtotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    deliveryCharges: 0,
    netAmount: 0,
    supportPhone: "+91 1800-123-456",
    notes: ""
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateBillData = (field: keyof BillData, value: any) => {
    setBillData(prev => ({ ...prev, [field]: value }));
  };

  const updateItem = (index: number, field: keyof BillItem, value: any) => {
    const updatedItems = billData.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          const subtotal = updatedItem.quantity * updatedItem.unitPrice;
          const discountAmount = (subtotal * updatedItem.discount) / 100;
          const taxableAmount = subtotal - discountAmount;
          const taxAmount = (taxableAmount * updatedItem.taxRate) / 100;
          updatedItem.total = taxableAmount + taxAmount;
        }
        return updatedItem;
      }
      return item;
    });
    
    setBillData(prev => {
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const totalDiscount = updatedItems.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.discount) / 100), 0);
      const totalTax = updatedItems.reduce((sum, item) => {
        const itemSubtotal = item.quantity * item.unitPrice;
        const itemDiscount = (itemSubtotal * item.discount) / 100;
        const taxableAmount = itemSubtotal - itemDiscount;
        return sum + ((taxableAmount * item.taxRate) / 100);
      }, 0);
      const netAmount = subtotal - totalDiscount + totalTax + prev.deliveryCharges;
      
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        totalDiscount,
        totalTax,
        netAmount
      };
    });
  };

  const addItem = () => {
    setBillData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: Date.now().toString(),
        productName: "",
        weight: "",
        cuttingType: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        taxRate: 18,
        total: 0
      }]
    }));
  };

  const removeItem = (index: number) => {
    if (billData.items.length > 1) {
      setBillData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const paymentModeOptions = [
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
    { value: "upi", label: "UPI" },
    { value: "netbanking", label: "Net Banking" },
    { value: "cod", label: "Cash on Delivery" },
  ];

  const deliverySlotOptions = [
    { value: "9-12", label: "9:00 AM - 12:00 PM" },
    { value: "12-15", label: "12:00 PM - 3:00 PM" },
    { value: "15-18", label: "3:00 PM - 6:00 PM" },
    { value: "18-21", label: "6:00 PM - 9:00 PM" },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2">
              <Receipt className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Bill Entry</h2>
              <p className="text-sm text-gray-600">Create detailed invoice with delivery information</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
            <Button onClick={() => onSave(billData)}>
              <Save className="mr-2 h-4 w-4" />
              Save Bill
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-md font-medium mb-4">Customer Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Customer Name *"
                value={billData.customerName}
                onChange={(e) => updateBillData('customerName', e.target.value)}
                placeholder="Enter customer name"
              />
              <Input
                label="Phone Number *"
                value={billData.phoneNumber}
                onChange={(e) => updateBillData('phoneNumber', e.target.value)}
                placeholder="+91 9876543210"
              />
              <div className="md:col-span-2">
                <Input
                  label="Address *"
                  value={billData.customerAddress}
                  onChange={(e) => updateBillData('customerAddress', e.target.value)}
                  placeholder="Complete delivery address"
                />
              </div>
              <Input
                label="Alternate Phone"
                value={billData.alternatePhone}
                onChange={(e) => updateBillData('alternatePhone', e.target.value)}
                placeholder="+91 9876543211"
              />
            </div>
          </div>

          {/* Bill Details */}
          <div>
            <h3 className="text-md font-medium mb-4">Bill Details</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Invoice Number *"
                value={billData.invoiceNumber}
                onChange={(e) => updateBillData('invoiceNumber', e.target.value)}
              />
              <Input
                label="Bill Date *"
                type="date"
                value={billData.billDate}
                onChange={(e) => updateBillData('billDate', e.target.value)}
              />
              <Input
                label="Due Date"
                type="date"
                value={billData.dueDate}
                onChange={(e) => updateBillData('dueDate', e.target.value)}
              />
            </div>
          </div>

          {/* Delivery Information */}
          <div>
            <h3 className="text-md font-medium mb-4">Delivery Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Delivery Date"
                type="date"
                value={billData.deliveryDate}
                onChange={(e) => updateBillData('deliveryDate', e.target.value)}
              />
              <Select
                label="Delivery Slot"
                value={billData.deliverySlot}
                onChange={(e) => updateBillData('deliverySlot', e.target.value)}
                options={deliverySlotOptions}
              />
              <div className="md:col-span-2">
                <Input
                  label="Delivery Instructions"
                  value={billData.deliveryInstructions}
                  onChange={(e) => updateBillData('deliveryInstructions', e.target.value)}
                  placeholder="Special delivery instructions"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium">Items</h3>
              <Button variant="secondary" size="sm" onClick={addItem}>
                <Plus className="mr-1 h-4 w-4" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {billData.items.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="grid md:grid-cols-7 gap-3">
                    <div className="md:col-span-2">
                      <Input
                        label="Product Name *"
                        value={item.productName}
                        onChange={(e) => updateItem(index, 'productName', e.target.value)}
                        placeholder="Product name"
                      />
                    </div>
                    <Input
                      label="Weight"
                      value={item.weight}
                      onChange={(e) => updateItem(index, 'weight', e.target.value)}
                      placeholder="1.5 kg"
                    />
                    <Input
                      label="Cutting Type"
                      value={item.cuttingType}
                      onChange={(e) => updateItem(index, 'cuttingType', e.target.value)}
                      placeholder="Fillet"
                    />
                    <Input
                      label="Qty *"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      label="Unit Price *"
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Input
                          label="Discount %"
                          type="number"
                          value={item.discount}
                          onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      {billData.items.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-sm text-gray-600">Total: </span>
                    <span className="font-medium">₹{item.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-4">Payment Details</h3>
              <div className="space-y-4">
                <Select
                  label="Payment Mode *"
                  value={billData.paymentMode}
                  onChange={(e) => updateBillData('paymentMode', e.target.value)}
                  options={paymentModeOptions}
                />
                <Input
                  label="Delivery Charges"
                  type="number"
                  value={billData.deliveryCharges}
                  onChange={(e) => updateBillData('deliveryCharges', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Support Phone"
                  value={billData.supportPhone}
                  onChange={(e) => updateBillData('supportPhone', e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={billData.notes}
                    onChange={(e) => updateBillData('notes', e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes or terms"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium mb-4">Bill Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{billData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-₹{billData.totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (GST):</span>
                  <span>₹{billData.totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span>₹{billData.deliveryCharges.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Net Amount:</span>
                  <span>₹{billData.netAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Preview */}
      {showPreview && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Bill Preview</h3>
          <div className="bg-white border rounded-lg p-6 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">INVOICE</h2>
              <p className="text-sm text-gray-600">#{billData.invoiceNumber}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium mb-2">Bill To:</h4>
                <p className="text-sm">{billData.customerName}</p>
                <p className="text-sm text-gray-600">{billData.customerAddress}</p>
                <p className="text-sm text-gray-600">{billData.phoneNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm"><strong>Date:</strong> {billData.billDate}</p>
                <p className="text-sm"><strong>Delivery:</strong> {billData.deliveryDate}</p>
                <p className="text-sm"><strong>Payment:</strong> {billData.paymentMode}</p>
              </div>
            </div>

            <div className="mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Item</th>
                    <th className="text-right p-2">Qty</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {billData.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">
                        <div>{item.productName}</div>
                        {item.weight && <div className="text-xs text-gray-500">{item.weight}</div>}
                        {item.cuttingType && <div className="text-xs text-gray-500">{item.cuttingType}</div>}
                      </td>
                      <td className="text-right p-2">{item.quantity}</td>
                      <td className="text-right p-2">₹{item.unitPrice}</td>
                      <td className="text-right p-2">₹{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right space-y-1 mb-6">
              <p className="text-sm">Subtotal: ₹{billData.subtotal.toFixed(2)}</p>
              <p className="text-sm text-red-600">Discount: -₹{billData.totalDiscount.toFixed(2)}</p>
              <p className="text-sm">Tax: ₹{billData.totalTax.toFixed(2)}</p>
              <p className="text-sm">Delivery: ₹{billData.deliveryCharges.toFixed(2)}</p>
              <p className="text-lg font-bold">Total: ₹{billData.netAmount.toFixed(2)}</p>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>Support: {billData.supportPhone}</p>
              {billData.notes && <p className="mt-2">{billData.notes}</p>}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
