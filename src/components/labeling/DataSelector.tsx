import { useState } from 'react';
import { Button, Input } from '../ui';
import { Plus, Search, Package, DollarSign, Calendar, Barcode, Building, ChevronDown, ChevronRight } from 'lucide-react';

interface DataField {
  id: string;
  label: string;
  type: 'text' | 'barcode' | 'qrcode' | 'image' | 'date' | 'number';
}

interface DataCategory {
  category: string;
  fields: DataField[];
}

interface DataSelectorProps {
  availableFields: DataCategory[];
  selectedFields: string[];
  onAddField: (field: DataField) => void;
  onRemoveField: (fieldId: string) => void;
}

const categoryIcons = {
  'Product Information': Package,
  'Pricing': DollarSign,
  'Inventory': Calendar,
  'Barcodes & QR': Barcode,
  'Business Info': Building
};

export function DataSelector({ availableFields, selectedFields, onAddField, onRemoveField }: DataSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Product Information']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredFields = availableFields.map(category => ({
    ...category,
    fields: category.fields.filter(field =>
      field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.fields.length > 0);

  const isFieldSelected = (fieldId: string) => selectedFields.includes(fieldId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Fields</h3>
          <p className="text-sm text-gray-600">Select fields to include in your label</p>
        </div>
        <div className="text-sm text-gray-500">
          {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''} selected
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Fields Summary */}
      {selectedFields.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900">Selected Fields</h4>
            <span className="text-sm text-blue-700">{selectedFields.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFields.map(fieldId => {
              const field = availableFields
                .flatMap(cat => cat.fields)
                .find(f => f.id === fieldId);
              if (!field) return null;
              
              return (
                <div
                  key={fieldId}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{field.label}</span>
                  <button
                    onClick={() => onRemoveField(fieldId)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <Plus className="h-3 w-3 rotate-45" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Fields */}
      <div className="space-y-4">
        {filteredFields.map(category => {
          const IconComponent = categoryIcons[category.category as keyof typeof categoryIcons] || Package;
          const isExpanded = expandedCategories.includes(category.category);

          return (
            <div key={category.category} className="border rounded-lg">
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <IconComponent className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">{category.category}</h4>
                    <p className="text-sm text-gray-500">
                      {category.fields.length} field{category.fields.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t bg-gray-50">
                  <div className="p-4 space-y-2">
                    {category.fields.map(field => {
                      const isSelected = isFieldSelected(field.id);
                      
                      return (
                        <div
                          key={field.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            isSelected
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{field.label}</span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {field.type}
                              </span>
                            </div>
                          </div>
                          
                          {isSelected ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onRemoveField(field.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Plus className="h-4 w-4 rotate-45" />
                              Remove
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onAddField(field)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Plus className="h-4 w-4" />
                              Add
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFields.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No fields found matching "{searchTerm}"</p>
          <p className="text-sm">Try adjusting your search terms</p>
        </div>
      )}

      {/* Quick Add Buttons */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Quick Add Common Fields</h4>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const productNameField = availableFields
                .flatMap(cat => cat.fields)
                .find(f => f.id === 'product_name');
              if (productNameField && !isFieldSelected('product_name')) {
                onAddField(productNameField);
              }
            }}
            disabled={isFieldSelected('product_name')}
            className="justify-start"
          >
            <Package className="mr-2 h-4 w-4" />
            Product Name
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const priceField = availableFields
                .flatMap(cat => cat.fields)
                .find(f => f.id === 'price');
              if (priceField && !isFieldSelected('price')) {
                onAddField(priceField);
              }
            }}
            disabled={isFieldSelected('price')}
            className="justify-start"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Price
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const barcodeField = availableFields
                .flatMap(cat => cat.fields)
                .find(f => f.id === 'barcode');
              if (barcodeField && !isFieldSelected('barcode')) {
                onAddField(barcodeField);
              }
            }}
            disabled={isFieldSelected('barcode')}
            className="justify-start"
          >
            <Barcode className="mr-2 h-4 w-4" />
            Barcode
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const expiryField = availableFields
                .flatMap(cat => cat.fields)
                .find(f => f.id === 'expiry_date');
              if (expiryField && !isFieldSelected('expiry_date')) {
                onAddField(expiryField);
              }
            }}
            disabled={isFieldSelected('expiry_date')}
            className="justify-start"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Expiry Date
          </Button>
        </div>
      </div>
    </div>
  );
}