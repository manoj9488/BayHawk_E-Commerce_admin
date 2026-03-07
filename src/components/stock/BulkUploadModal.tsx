import { useState, useRef } from 'react';
import { Modal, Button } from '../ui';
import { Upload, Download, AlertTriangle, FileText, RefreshCw } from 'lucide-react';
import type { StockBatchData } from './StockBatchForm';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: StockBatchData[]) => void;
}

const TEMPLATE_HEADERS = [
  'Batch Number',
  'Traceability Code',
  'Product Name',
  'Category',
  'Quantity',
  'Unit (kg/g/pcs)',
  'Individual Weight',
  'Catch Date (YYYY-MM-DD)',
  'Received Date (YYYY-MM-DD)',
  'Expiry Date (YYYY-MM-DD)',
  'Harvest Origin',
  'Country',
  'Catch Type (wild/farmed)',
  'Quality Grade (grade-a/b/c)',
  'Packaging Type',
  'Storage Temp'
];

const SAMPLE_ROW = [
  'BATCH-005',
  'LOT-20260128-TEMP',
  'Mackerel',
  'sea-fish',
  '100',
  'kg',
  '0.5',
  '2026-01-27',
  '2026-01-28',
  '2026-02-01',
  'Arabian Sea',
  'India',
  'wild',
  'grade-a',
  'Ice Packed',
  '0-4°C (Fresh)'
];

export function BulkUploadModal({ isOpen, onClose, onUpload }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<StockBatchData[]>([]);
  const [errors, setErrors] = useState<{ row: number; message: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const csvContent = [
      TEMPLATE_HEADERS.join(','),
      SAMPLE_ROW.join(',')
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock_batch_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const data: StockBatchData[] = [];
    const newErrors: { row: number; message: string }[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV split (handling commas inside quotes would require a more complex regex)
      // For this simple version, we assume no commas in fields or standard CSV format
      const values = line.split(',').map(v => v.trim());

      if (values.length < 5) { // Basic check for minimum columns
        newErrors.push({ row: i + 1, message: 'Insufficient columns' });
        continue;
      }

      const [
        batchNumber, traceabilityCode, productName, category, 
        quantity, quantityUnit, individualWeight, 
        catchSlaughterDate, receivedDate, expiryDate,
        harvestOrigin, countryOfOrigin, catchType, qualityGrade,
        packagingType, storageTemperature
      ] = values;

      // Validation
      if (!productName) {
        newErrors.push({ row: i + 1, message: 'Product Name is required' });
        continue;
      }
      if (!category) {
        newErrors.push({ row: i + 1, message: 'Category is required' });
        continue;
      }
      if (isNaN(Number(quantity))) {
        newErrors.push({ row: i + 1, message: 'Quantity must be a number' });
        continue;
      }

      const batch: StockBatchData = {
        batchNumber: batchNumber || `BATCH-${Date.now()}-${i}`,
        traceabilityCode: traceabilityCode || `LOT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
        productName,
        category,
        quantity: Number(quantity),
        quantityUnit: quantityUnit || 'kg',
        individualWeight: Number(individualWeight) || 0,
        catchSlaughterDate: catchSlaughterDate || new Date().toISOString().slice(0, 10),
        receivedDate: receivedDate || new Date().toISOString().slice(0, 10),
        expiryDate: expiryDate || '',
        harvestOrigin: harvestOrigin || '',
        countryOfOrigin: countryOfOrigin || 'India',
        catchType: (catchType as any) || 'wild',
        qualityGrade: qualityGrade || 'grade-a',
        packagingType: packagingType || '',
        storageTemperature: storageTemperature || '0-4°C (Fresh)',
        // Default values for fields not in CSV
        certifications: [],
        chemicalFree: 'no',
        createdBy: 'Bulk Upload',
        createdByRole: 'System',
        status: 'pending'
      };

      data.push(batch);
    }

    setParsedData(data);
    setErrors(newErrors);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'text/csv' || droppedFile?.name.endsWith('.csv')) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(droppedFile);
    }
  };

  const handleConfirm = () => {
    onUpload(parsedData);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bulk Upload Stock Batches"
      size="xl"
    >
      <div className="space-y-6">
        {/* Upload Area */}
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload CSV File
            </h3>
            <p className="text-gray-500 mb-6">
              Drag and drop your CSV file here, or click to browse
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => fileInputRef.current?.click()}>
                Browse Files
              </Button>
              <Button variant="secondary" onClick={handleDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          /* File Preview & Actions */
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {parsedData.length} valid records found
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => { setFile(null); setParsedData([]); }}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Change File
              </Button>
            </div>

            {/* Error Display */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="flex items-center text-red-800 font-medium mb-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Found {errors.length} errors
                </h4>
                <ul className="list-disc list-inside text-sm text-red-700 max-h-32 overflow-y-auto">
                  {errors.map((err, idx) => (
                    <li key={idx}>Row {err.row}: {err.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Data Preview Table */}
            {parsedData.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b font-medium text-sm text-gray-700">
                  Preview (First 5 records)
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parsedData.slice(0, 5).map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.productName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.quantity} {row.quantityUnit}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.expiryDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.length > 5 && (
                  <div className="px-4 py-2 bg-gray-50 border-t text-sm text-gray-500 text-center">
                    ...and {parsedData.length - 5} more records
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!file || parsedData.length === 0 || errors.length > 0}
            className={errors.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload {parsedData.length} Batches
          </Button>
        </div>
      </div>
    </Modal>
  );
}
