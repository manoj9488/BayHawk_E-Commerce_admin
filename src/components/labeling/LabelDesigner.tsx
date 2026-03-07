import React, { useState } from 'react';
import { Input, Button } from '../ui';
import { Move, Trash2, Eye, EyeOff, Type } from 'lucide-react';

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

interface LabelDesignerProps {
  template: LabelTemplate;
  onUpdateField: (fieldId: string, updates: Partial<LabelField>) => void;
  onRemoveField: (fieldId: string) => void;
}

export function LabelDesigner({ template, onUpdateField, onRemoveField }: LabelDesignerProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, fieldId: string) => {
    const field = template.fields.find(f => f.id === fieldId);
    if (!field) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedField(fieldId);
    setSelectedField(fieldId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedField) return;

    const containerRect = e.currentTarget.getBoundingClientRect();
    const newX = Math.max(0, Math.min(
      template.width - 50,
      e.clientX - containerRect.left - dragOffset.x
    ));
    const newY = Math.max(0, Math.min(
      template.height - 20,
      e.clientY - containerRect.top - dragOffset.y
    ));

    onUpdateField(draggedField, {
      position: { x: newX, y: newY }
    });
  };

  const handleMouseUp = () => {
    setDraggedField(null);
  };

  const renderField = (field: LabelField) => {
    const isSelected = selectedField === field.id;
    const isDragging = draggedField === field.id;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${field.position.x}px`,
      top: `${field.position.y}px`,
      width: `${field.width}px`,
      height: `${field.height}px`,
      fontSize: `${field.fontSize}px`,
      fontWeight: field.fontWeight,
      cursor: 'move',
      border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      opacity: field.isVisible ? 1 : 0.5
    };

    let content;
    switch (field.type) {
      case 'barcode':
        content = (
          <div className="w-full h-full bg-white border flex flex-col items-center justify-center">
            <div className="flex space-x-px mb-1">
              {Array.from({ length: 15 }, (_, i) => (
                <div
                  key={i}
                  className="bg-black"
                  style={{
                    width: '1px',
                    height: `${Math.random() * 10 + 8}px`
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '6px' }}>{field.value}</div>
          </div>
        );
        break;

      case 'qrcode':
        content = (
          <div className="w-full h-full bg-white border flex items-center justify-center">
            <div className="grid grid-cols-6 gap-px">
              {Array.from({ length: 36 }, (_, i) => (
                <div
                  key={i}
                  className={`w-0.5 h-0.5 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                />
              ))}
            </div>
          </div>
        );
        break;

      case 'image':
        content = (
          <div className="w-full h-full bg-gray-200 border flex items-center justify-center text-xs text-gray-500">
            IMG
          </div>
        );
        break;

      case 'date':
        const formattedDate = new Date(field.value).toLocaleDateString();
        content = formattedDate;
        break;

      default:
        content = field.value;
    }

    return (
      <div
        key={field.id}
        style={baseStyle}
        onMouseDown={(e) => handleMouseDown(e, field.id)}
        onClick={() => setSelectedField(field.id)}
        className={`
          hover:border-blue-300 transition-colors
          ${isDragging ? 'z-10' : ''}
          ${!field.isVisible ? 'opacity-50' : ''}
        `}
      >
        {content}
        {isSelected && (
          <div className="absolute -top-1 -right-1 flex gap-1">
            <button
              className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateField(field.id, { isVisible: !field.isVisible });
              }}
            >
              {field.isVisible ? <Eye className="w-2 h-2" /> : <EyeOff className="w-2 h-2" />}
            </button>
            <button
              className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveField(field.id);
                setSelectedField(null);
              }}
            >
              <Trash2 className="w-2 h-2" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const selectedFieldData = template.fields.find(f => f.id === selectedField);

  return (
    <div className="space-y-6">
      {/* Design Canvas */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium">Design Canvas</h3>
            <p className="text-sm text-gray-500">
              Click and drag fields to reposition them
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {template.width} × {template.height} mm
          </div>
        </div>

        <div className="flex justify-center">
          <div
            className="relative bg-white border-2 border-dashed border-gray-300 overflow-hidden"
            style={{
              width: `${template.width}px`,
              height: `${template.height}px`,
              minWidth: `${template.width}px`,
              minHeight: `${template.height}px`
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {template.fields.map(renderField)}
            
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ccc" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Field Properties */}
      {selectedFieldData && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Type className="h-4 w-4 text-blue-600" />
            <h3 className="font-medium">Field Properties: {selectedFieldData.name}</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Field Value"
              value={selectedFieldData.value}
              onChange={(e) => onUpdateField(selectedFieldData.id, { value: e.target.value })}
            />
            <Input
              label="Font Size"
              type="number"
              value={selectedFieldData.fontSize}
              onChange={(e) => onUpdateField(selectedFieldData.id, { fontSize: parseInt(e.target.value) })}
              min="6"
              max="72"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
              <select
                value={selectedFieldData.fontWeight}
                onChange={(e) => onUpdateField(selectedFieldData.id, { fontWeight: e.target.value as 'normal' | 'bold' })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>
            <Input
              label="X Position"
              type="number"
              value={selectedFieldData.position.x}
              onChange={(e) => onUpdateField(selectedFieldData.id, { 
                position: { ...selectedFieldData.position, x: parseInt(e.target.value) }
              })}
              min="0"
              max={template.width - selectedFieldData.width}
            />
            <Input
              label="Y Position"
              type="number"
              value={selectedFieldData.position.y}
              onChange={(e) => onUpdateField(selectedFieldData.id, { 
                position: { ...selectedFieldData.position, y: parseInt(e.target.value) }
              })}
              min="0"
              max={template.height - selectedFieldData.height}
            />
            <Input
              label="Width"
              type="number"
              value={selectedFieldData.width}
              onChange={(e) => onUpdateField(selectedFieldData.id, { width: parseInt(e.target.value) })}
              min="10"
              max={template.width}
            />
            <Input
              label="Height"
              type="number"
              value={selectedFieldData.height}
              onChange={(e) => onUpdateField(selectedFieldData.id, { height: parseInt(e.target.value) })}
              min="10"
              max={template.height}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onUpdateField(selectedFieldData.id, { isVisible: !selectedFieldData.isVisible })}
            >
              {selectedFieldData.isVisible ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {selectedFieldData.isVisible ? 'Hide' : 'Show'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onRemoveField(selectedFieldData.id);
                setSelectedField(null);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Field List */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Fields ({template.fields.length})</h3>
        <div className="space-y-2">
          {template.fields.map((field) => (
            <div
              key={field.id}
              className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                selectedField === field.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedField(field.id)}
            >
              <div className="flex items-center gap-2">
                <Move className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-sm">{field.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {field.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateField(field.id, { isVisible: !field.isVisible });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {field.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveField(field.id);
                    if (selectedField === field.id) {
                      setSelectedField(null);
                    }
                  }}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}