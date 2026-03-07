import React, { useState, useRef, useCallback } from 'react';
import { Input, Button, Card } from '../ui';
import { Trash2, Eye, EyeOff, Type, Grid, ZoomIn, ZoomOut, RotateCcw, MousePointer } from 'lucide-react';

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
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, fieldId: string) => {
    e.preventDefault();
    const field = template.fields.find(f => f.id === fieldId);
    if (!field) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedField(fieldId);
    setSelectedField(fieldId);
  }, [template.fields]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedField || !canvasRef.current) return;

    const containerRect = canvasRef.current.getBoundingClientRect();
    const field = template.fields.find(f => f.id === draggedField);
    if (!field) return;

    const newX = Math.max(0, Math.min(
      template.width - field.width,
      (e.clientX - containerRect.left - dragOffset.x) / zoom
    ));
    const newY = Math.max(0, Math.min(
      template.height - field.height,
      (e.clientY - containerRect.top - dragOffset.y) / zoom
    ));

    onUpdateField(draggedField, {
      position: { x: Math.round(newX), y: Math.round(newY) }
    });
  }, [draggedField, dragOffset, zoom, template.width, template.height, onUpdateField]);

  const handleMouseUp = useCallback(() => {
    setDraggedField(null);
  }, []);

  const renderField = useCallback((field: LabelField) => {
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
      cursor: isDragging ? 'grabbing' : 'grab',
      border: isSelected ? '2px solid #3b82f6' : '1px solid rgba(0,0,0,0.1)',
      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: field.type === 'barcode' || field.type === 'qrcode' ? 'center' : 'flex-start',
      padding: '2px 4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      opacity: field.isVisible ? 1 : 0.5,
      boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
      borderRadius: '2px',
      zIndex: isSelected ? 10 : 1,
    };

    let content;
    switch (field.type) {
      case 'barcode':
        content = (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white">
            <div className="flex space-x-px mb-1">
              {Array.from({ length: Math.min(20, Math.floor(field.width / 3)) }, (_, i) => (
                <div
                  key={i}
                  className="bg-black"
                  style={{
                    width: '2px',
                    height: `${Math.min(field.height - 10, 20)}px`
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: Math.min(field.fontSize, 8) }}>{field.value.slice(0, 12)}</div>
          </div>
        );
        break;

      case 'qrcode':
        content = (
          <div className="w-full h-full bg-white flex items-center justify-center">
            <div className="grid grid-cols-8 gap-px" style={{ width: Math.min(field.width - 4, field.height - 4) }}>
              {Array.from({ length: 64 }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                />
              ))}
            </div>
          </div>
        );
        break;

      case 'image':
        content = (
          <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
            <span style={{ fontSize: Math.min(field.fontSize, 12) }}>IMAGE</span>
          </div>
        );
        break;

      case 'date':
        const formattedDate = field.value ? new Date(field.value).toLocaleDateString() : 'DD/MM/YYYY';
        content = <span>{formattedDate}</span>;
        break;

      case 'number':
        content = <span>{field.value || '0'}</span>;
        break;

      default:
        content = <span>{field.value || field.name}</span>;
    }

    return (
      <div
        key={field.id}
        style={baseStyle}
        onMouseDown={(e) => handleMouseDown(e, field.id)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedField(field.id);
        }}
        className={`
          hover:border-blue-400 transition-all duration-200
          ${isDragging ? 'scale-105' : ''}
          ${!field.isVisible ? 'opacity-50' : ''}
        `}
      >
        {content}
        
        {isSelected && (
          <>
            {/* Selection handles */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            
            {/* Action buttons */}
            <div className="absolute -top-8 -right-1 flex gap-1">
              <button
                className="w-6 h-6 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateField(field.id, { isVisible: !field.isVisible });
                }}
                title={field.isVisible ? 'Hide field' : 'Show field'}
              >
                {field.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
              <button
                className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveField(field.id);
                  setSelectedField(null);
                }}
                title="Remove field"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </div>
    );
  }, [selectedField, draggedField, handleMouseDown, onUpdateField, onRemoveField]);

  const selectedFieldData = template.fields.find(f => f.id === selectedField);

  return (
    <div className="space-y-6">
      {/* Canvas Controls */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Zoom:</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                disabled={zoom >= 2}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setZoom(1)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant={showGrid ? "primary" : "secondary"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid className="mr-2 h-4 w-4" />
              Grid
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            {template.width} × {template.height} mm • {template.fields.length} fields
          </div>
        </div>
      </Card>

      {/* Design Canvas */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Design Canvas</h3>
              <p className="text-sm text-gray-600">
                Click and drag fields to reposition • Click outside to deselect
              </p>
            </div>
          </div>

          <div className="flex justify-center overflow-auto p-4 bg-gray-50 rounded-lg">
            <div
              ref={canvasRef}
              className="relative bg-white shadow-lg"
              style={{
                width: `${template.width * zoom}px`,
                height: `${template.height * zoom}px`,
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                minWidth: `${template.width}px`,
                minHeight: `${template.height}px`,
                border: '1px solid #e5e7eb'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => setSelectedField(null)}
            >
              {template.fields.map(renderField)}
              
              {/* Grid overlay */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#d1d5db" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              )}
              
              {/* Rulers */}
              <div className="absolute -top-4 left-0 right-0 h-4 bg-gray-100 border-b text-xs flex items-center">
                {Array.from({ length: Math.ceil(template.width / 50) }, (_, i) => (
                  <div key={i} className="absolute text-gray-500" style={{ left: `${i * 50}px` }}>
                    {i * 50}
                  </div>
                ))}
              </div>
              <div className="absolute -left-4 top-0 bottom-0 w-4 bg-gray-100 border-r text-xs">
                {Array.from({ length: Math.ceil(template.height / 50) }, (_, i) => (
                  <div 
                    key={i} 
                    className="absolute text-gray-500 transform -rotate-90 origin-center"
                    style={{ top: `${i * 50}px`, left: '2px' }}
                  >
                    {i * 50}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Field Properties */}
      {selectedFieldData && (
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg bg-blue-50 p-2">
                <Type className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Field Properties</h3>
                <p className="text-sm text-gray-600">{selectedFieldData.name} ({selectedFieldData.type})</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Field Value"
                value={selectedFieldData.value}
                onChange={(e) => onUpdateField(selectedFieldData.id, { value: e.target.value })}
                placeholder="Enter field value"
              />
              <Input
                label="Font Size (px)"
                type="number"
                value={selectedFieldData.fontSize}
                onChange={(e) => onUpdateField(selectedFieldData.id, { fontSize: parseInt(e.target.value) || 12 })}
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
              <div className="flex items-center gap-2">
                <Input
                  label="X Position"
                  type="number"
                  value={selectedFieldData.position.x}
                  onChange={(e) => onUpdateField(selectedFieldData.id, { 
                    position: { ...selectedFieldData.position, x: parseInt(e.target.value) || 0 }
                  })}
                  min="0"
                  max={template.width - selectedFieldData.width}
                />
                <Input
                  label="Y Position"
                  type="number"
                  value={selectedFieldData.position.y}
                  onChange={(e) => onUpdateField(selectedFieldData.id, { 
                    position: { ...selectedFieldData.position, y: parseInt(e.target.value) || 0 }
                  })}
                  min="0"
                  max={template.height - selectedFieldData.height}
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  label="Width (px)"
                  type="number"
                  value={selectedFieldData.width}
                  onChange={(e) => onUpdateField(selectedFieldData.id, { width: parseInt(e.target.value) || 50 })}
                  min="10"
                  max={template.width}
                />
                <Input
                  label="Height (px)"
                  type="number"
                  value={selectedFieldData.height}
                  onChange={(e) => onUpdateField(selectedFieldData.id, { height: parseInt(e.target.value) || 20 })}
                  min="10"
                  max={template.height}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => onUpdateField(selectedFieldData.id, { isVisible: !selectedFieldData.isVisible })}
              >
                {selectedFieldData.isVisible ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {selectedFieldData.isVisible ? 'Hide Field' : 'Show Field'}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onRemoveField(selectedFieldData.id);
                  setSelectedField(null);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Field
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Field List */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Fields ({template.fields.length})</h3>
            <div className="text-sm text-gray-500">
              {template.fields.filter(f => f.isVisible).length} visible
            </div>
          </div>
          
          <div className="space-y-2">
            {template.fields.map((field) => (
              <div
                key={field.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedField === field.id 
                    ? 'border-blue-300 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedField(field.id)}
              >
                <div className="flex items-center gap-3">
                  <MousePointer className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="font-medium text-sm">{field.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {field.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {field.position.x}, {field.position.y}
                      </span>
                      <span className="text-xs text-gray-500">
                        {field.width}×{field.height}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateField(field.id, { isVisible: !field.isVisible });
                    }}
                    className={`p-1 rounded transition-colors ${
                      field.isVisible ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={field.isVisible ? 'Hide field' : 'Show field'}
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
                    className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove field"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {template.fields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MousePointer className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No fields added yet</p>
                <p className="text-sm">Add fields from the Data tab</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
