import { FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '../ui';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportData {
  headers: string[];
  data: any[];
  filename: string;
}

interface ExportButtonsProps {
  data: ExportData;
  className?: string;
}

export const ExportButtons = ({ data, className = "" }: ExportButtonsProps) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(data.filename.replace(/-/g, ' ').toUpperCase(), 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);
    
    autoTable(doc, {
      head: [data.headers],
      body: data.data.map(row => data.headers.map(header => row[header] || '')),
      startY: 28,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], fontSize: 10 },
      styles: { fontSize: 9 },
    });
    
    doc.save(`${data.filename}.pdf`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${data.filename}.xlsx`);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button size="sm" variant="secondary" onClick={exportToPDF}>
        <FileText className="h-4 w-4 mr-1" />
        PDF
      </Button>
      <Button size="sm" variant="secondary" onClick={exportToExcel}>
        <FileSpreadsheet className="h-4 w-4 mr-1" />
        Excel
      </Button>
    </div>
  );
};
