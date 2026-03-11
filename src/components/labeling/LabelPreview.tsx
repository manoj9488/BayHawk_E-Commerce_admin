import React from 'react';

interface LabelField {
  id: string;
  name: string;
  type: 'text' | 'barcode' | 'qrcode' | 'image' | 'date' | 'number';
  value: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
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
  orientation: 'portrait' | 'landscape';
}

interface LabelPreviewProps {
  template: LabelTemplate;
  quantity: number;
}

export function LabelPreview({ template, quantity }: LabelPreviewProps) {
  const renderField = (field: LabelField) => {
    if (!field.isVisible) return null;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${field.position.x}px`,
      top: `${field.position.y}px`,
      width: `${field.width}px`,
      height: `${field.height}px`,
      fontSize: `${field.fontSize}px`,
      fontWeight: field.fontWeight,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    };

    switch (field.type) {
      case 'barcode':
        return (
          <div key={field.id} style={baseStyle}>
            <div className="w-full h-full bg-white border flex flex-col items-center justify-center">
              <div className="flex space-x-px mb-1">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-black"
                    style={{
                      width: '2px',
                      height: `${Math.random() * 15 + 10}px`
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize: '8px' }}>{field.value}</div>
            </div>
          </div>
        );

      case 'qrcode':
        return (
          <div key={field.id} style={baseStyle}>
            <div className="w-full h-full bg-white border flex items-center justify-center">
              <div className="grid grid-cols-8 gap-px">
                {Array.from({ length: 64 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div key={field.id} style={baseStyle}>
            <div className="w-full h-full bg-gray-200 border flex items-center justify-center text-xs text-gray-500">
              IMG
            </div>
          </div>
        );

      case 'date':
        const formattedDate = new Date(field.value).toLocaleDateString();
        return (
          <div key={field.id} style={baseStyle}>
            {formattedDate}
          </div>
        );

      default:
        return (
          <div key={field.id} style={baseStyle}>
            {field.value}
          </div>
        );
    }
  };

  const renderSingleLabel = (index: number) => (
    <div
      key={index}
      className="relative border border-gray-300 bg-white"
      style={{
        width: `${template.width}px`,
        height: `${template.height}px`,
        minWidth: `${template.width}px`,
        minHeight: `${template.height}px`
      }}
    >
      {template.fields.map(renderField)}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Preview: {template.name}</h3>
          <p className="text-sm text-gray-500">
            {template.width} × {template.height} mm • {quantity} label{quantity > 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Scale: 1:1
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50 overflow-auto">
        <div 
          className="flex flex-wrap gap-4"
          style={{
            maxHeight: '600px',
            overflowY: 'auto'
          }}
        >
          {Array.from({ length: quantity }, (_, index) => renderSingleLabel(index))}
        </div>
      </div>

      {/* Label Information */}
      <div className="grid gap-4 sm:grid-cols-3 text-sm">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="font-medium text-blue-900">Dimensions</div>
          <div className="text-blue-700">{template.width} × {template.height} mm</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="font-medium text-green-900">Fields</div>
          <div className="text-green-700">{template.fields.filter(f => f.isVisible).length} visible</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="font-medium text-purple-900">Paper Size</div>
          <div className="text-purple-700">{template.paperSize}</div>
        </div>
      </div>
    </div>
  );
}