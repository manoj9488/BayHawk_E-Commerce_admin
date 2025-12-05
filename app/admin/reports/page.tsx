"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DataTable } from "@/components/admin/data-table"
import type { Report } from "@/lib/types"
import {
  Plus,
  FileText,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Printer,
  Share2,
  BarChart3,
  Package,
  Truck,
  ShoppingCart,
  TrendingUp,
  RotateCcw,
} from "lucide-react"

const reportTemplates = [
  { id: "sales", name: "Sales Report", icon: TrendingUp, description: "Daily/weekly/monthly sales analytics" },
  { id: "packing", name: "Packing Report", icon: Package, description: "Packing lists and requirements" },
  {
    id: "procurement",
    name: "Procurement Report",
    icon: ShoppingCart,
    description: "Procurement needs and cutting types",
  },
  { id: "stock", name: "Stock Report", icon: BarChart3, description: "Inventory levels and movements" },
  { id: "delivery", name: "Delivery Report", icon: Truck, description: "Delivery performance and routes" },
  { id: "labeling", name: "Labeling Report", icon: FileText, description: "Product labels for printing" },
]

interface GeneratedReport extends Report {
  hub?: string
  dateRange?: string
}

const mockGeneratedReports: GeneratedReport[] = [
  {
    id: "RPT-001",
    name: "Daily Sales Report - Jan 15",
    type: "sales",
    period: "daily",
    generatedAt: "2024-01-15T08:00:00Z",
    status: "ready",
    hub: "All Hubs",
    dateRange: "Jan 15, 2024",
  },
  {
    id: "RPT-002",
    name: "Weekly Stock Report",
    type: "stock",
    period: "weekly",
    generatedAt: "2024-01-14T00:00:00Z",
    status: "ready",
    hub: "Chennai Central",
    dateRange: "Jan 8-14, 2024",
  },
  {
    id: "RPT-003",
    name: "Packing Report - Morning Slot",
    type: "packing",
    period: "daily",
    generatedAt: "2024-01-15T06:00:00Z",
    status: "ready",
    hub: "Chennai Central",
    dateRange: "Jan 15, 2024",
  },
  {
    id: "RPT-004",
    name: "Procurement Cutting Report",
    type: "procurement",
    period: "daily",
    generatedAt: "2024-01-15T05:30:00Z",
    status: "generating",
    hub: "All Hubs",
    dateRange: "Jan 15, 2024",
  },
  {
    id: "RPT-005",
    name: "Monthly Delivery Performance",
    type: "delivery",
    period: "monthly",
    generatedAt: "2024-01-01T00:00:00Z",
    status: "ready",
    hub: "All Hubs",
    dateRange: "December 2023",
  },
]

export default function ReportsPage() {
  const [generateOpen, setGenerateOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [reports, setReports] = useState<GeneratedReport[]>(mockGeneratedReports)
  const [period, setPeriod] = useState<string>("")
  const [hub, setHub] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [exportFormat, setExportFormat] = useState<string>("pdf")

  const generateReport = () => {
    if (!selectedTemplate) return

    const template = reportTemplates.find(t => t.id === selectedTemplate)
    if (!template) return

    const hubName = hub === 'all' ? 'All Hubs' : hub === 'central' ? 'Chennai Central' : hub === 'south' ? 'Chennai South' : hub === 'north' ? 'Chennai North' : 'All Hubs'
    const reportDate = date || new Date().toLocaleDateString()

    const newReport: GeneratedReport = {
      id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
      name: `${template.name} - ${reportDate}`,
      type: selectedTemplate,
      period: period || 'daily',
      generatedAt: new Date().toISOString(),
      status: 'generating',
      hub: hubName,
      dateRange: reportDate
    }

    setReports(prev => [newReport, ...prev])

    // Generate file based on format
    setTimeout(() => {
      const reportData = `Report: ${newReport.name}\nType: ${template.name}\nPeriod: ${period || 'daily'}\nHub: ${hubName}\nDate: ${reportDate}\nGenerated: ${new Date().toLocaleString()}`
      
      if (exportFormat === 'pdf') {
        const blob = new Blob([reportData], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${newReport.id}_${template.name}.pdf`
        a.click()
        URL.revokeObjectURL(url)
      } else if (exportFormat === 'excel') {
        const csvData = `Report Name,Type,Period,Hub,Date,Generated\n"${newReport.name}","${template.name}","${period || 'daily'}","${hubName}","${reportDate}","${new Date().toLocaleString()}"`
        const blob = new Blob([csvData], { type: 'application/vnd.ms-excel' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${newReport.id}_${template.name}.xls`
        a.click()
        URL.revokeObjectURL(url)
      } else if (exportFormat === 'csv') {
        const csvData = `Report Name,Type,Period,Hub,Date,Generated\n"${newReport.name}","${template.name}","${period || 'daily'}","${hubName}","${reportDate}","${new Date().toLocaleString()}"`
        const blob = new Blob([csvData], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${newReport.id}_${template.name}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }

      setReports(prev => prev.map(r => 
        r.id === newReport.id ? { ...r, status: 'ready' } : r
      ))
    }, 2000)

    setGenerateOpen(false)
    setSelectedTemplate(null)
    setPeriod("")
    setHub("")
    setDate("")
    setExportFormat("pdf")
  }

  const quickGenerate = (templateId: string, selectedPeriod: string = 'daily') => {
    const template = reportTemplates.find(t => t.id === templateId)
    if (!template) return

    const today = new Date()
    let dateRange = today.toLocaleDateString()
    
    if (selectedPeriod === 'weekly') {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - 7)
      dateRange = `${weekStart.toLocaleDateString()} - ${today.toLocaleDateString()}`
    } else if (selectedPeriod === 'monthly') {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      dateRange = `${monthStart.toLocaleDateString()} - ${today.toLocaleDateString()}`
    }

    const newReport: GeneratedReport = {
      id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
      name: `${template.name} - ${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}`,
      type: templateId,
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      status: 'generating',
      hub: 'All Hubs',
      dateRange: dateRange
    }

    setReports(prev => [newReport, ...prev])

    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === newReport.id ? { ...r, status: 'ready' } : r
      ))
    }, 2000)
  }

  const handleDownload = (report: GeneratedReport) => {
    const data = `Report: ${report.name}\nType: ${report.type}\nPeriod: ${report.period}\nHub: ${report.hub}\nDate Range: ${report.dateRange}\nGenerated: ${new Date(report.generatedAt).toLocaleString()}\nStatus: ${report.status}`
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.id}_${report.name}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = (report: GeneratedReport) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${report.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .info { margin: 10px 0; }
            </style>
          </head>
          <body>
            <h1>${report.name}</h1>
            <div class="info"><strong>Type:</strong> ${report.type}</div>
            <div class="info"><strong>Period:</strong> ${report.period}</div>
            <div class="info"><strong>Hub:</strong> ${report.hub}</div>
            <div class="info"><strong>Date Range:</strong> ${report.dateRange}</div>
            <div class="info"><strong>Generated:</strong> ${new Date(report.generatedAt).toLocaleString()}</div>
            <div class="info"><strong>Status:</strong> ${report.status}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleShare = (report: GeneratedReport) => {
    if (navigator.share) {
      navigator.share({
        title: report.name,
        text: `${report.name} - ${report.dateRange}`,
        url: window.location.href
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(`${report.name} - ${report.dateRange} - ${window.location.href}`)
      alert('Report link copied to clipboard!')
    }
  }

  const handleRefresh = (report: GeneratedReport) => {
    setReports(prev => prev.map(r => 
      r.id === report.id 
        ? { ...r, status: 'generating', generatedAt: new Date().toISOString() }
        : r
    ))
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === report.id 
          ? { ...r, status: 'ready' }
          : r
      ))
    }, 2000)
  }

  const statusColors: Record<string, string> = {
    ready: "bg-success/20 text-success border-success/30",
    generating: "bg-warning/20 text-warning border-warning/30",
    failed: "bg-destructive/20 text-destructive border-destructive/30",
  }

  const statusIcons: Record<string, React.ElementType> = {
    ready: CheckCircle,
    generating: RefreshCw,
    failed: AlertCircle,
  }

  const columns = [
    {
      key: "name",
      header: "Report Name",
      cell: (report: GeneratedReport) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{report.name}</p>
            <p className="text-sm text-muted-foreground capitalize">{report.type} Report</p>
          </div>
        </div>
      ),
    },
    {
      key: "period",
      header: "Period",
      cell: (report: GeneratedReport) => (
        <div>
          <Badge variant="outline" className="capitalize mb-1">
            {report.period}
          </Badge>
          <p className="text-sm text-muted-foreground">{report.dateRange}</p>
        </div>
      ),
    },
    {
      key: "hub",
      header: "Hub",
      cell: (report: GeneratedReport) => <span className="text-sm">{report.hub}</span>,
    },
    {
      key: "generatedAt",
      header: "Generated",
      cell: (report: GeneratedReport) => (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(report.generatedAt).toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (report: GeneratedReport) => {
        const Icon = statusIcons[report.status]
        return (
          <Badge variant="outline" className={statusColors[report.status]}>
            <Icon className={`h-3 w-3 mr-1 ${report.status === "generating" ? "animate-spin" : ""}`} />
            {report.status}
          </Badge>
        )
      },
    },
    {
      key: "actions",
      header: "Actions",
      cell: (report: GeneratedReport) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" disabled={report.status !== "ready"} onClick={() => handleDownload(report)}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={report.status !== "ready"} onClick={() => handlePrint(report)}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={report.status !== "ready"} onClick={() => handleShare(report)}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleRefresh(report)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report Center</h1>
          <p className="text-muted-foreground">Generate and manage customizable reports</p>
        </div>
        <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>Select a report type and configure options</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Report Templates */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {reportTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <template.icon className="h-6 w-6 text-primary mb-2" />
                    <p className="font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </button>
                ))}
              </div>

              {selectedTemplate && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="period">Period</Label>
                      <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger id="period">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hub">Hub</Label>
                      <Select value={hub} onValueChange={setHub}>
                        <SelectTrigger id="hub">
                          <SelectValue placeholder="Select hub" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Hubs</SelectItem>
                          <SelectItem value="central">Chennai Central</SelectItem>
                          <SelectItem value="south">Chennai South</SelectItem>
                          <SelectItem value="north">Chennai North</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex-1 ${exportFormat === 'pdf' ? 'bg-primary text-primary-foreground' : 'bg-transparent'}`}
                        onClick={() => setExportFormat('pdf')}
                      >
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex-1 ${exportFormat === 'excel' ? 'bg-primary text-primary-foreground' : 'bg-transparent'}`}
                        onClick={() => setExportFormat('excel')}
                      >
                        Excel
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex-1 ${exportFormat === 'csv' ? 'bg-primary text-primary-foreground' : 'bg-transparent'}`}
                        onClick={() => setExportFormat('csv')}
                      >
                        CSV
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setGenerateOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={!selectedTemplate} onClick={generateReport}>Generate Report</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTemplates.slice(0, 3).map((template) => (
          <Card key={template.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <template.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => quickGenerate(template.id, 'daily')}>
                  Daily
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => quickGenerate(template.id, 'weekly')}>
                  Weekly
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => quickGenerate(template.id, 'monthly')}>
                  Monthly
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>View and download previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={reports} columns={columns} searchPlaceholder="Search reports..." />
        </CardContent>
      </Card>
    </div>
  )
}
