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
          <Button variant="ghost" size="icon" disabled={report.status !== "ready"}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={report.status !== "ready"}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={report.status !== "ready"}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
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
                      <Select>
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
                      <Select>
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
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
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
                <Button disabled={!selectedTemplate}>Generate Report</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTemplates.slice(0, 3).map((template) => (
          <Card key={template.id} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <template.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{template.name}</p>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
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
          <DataTable data={mockGeneratedReports} columns={columns} searchPlaceholder="Search reports..." />
        </CardContent>
      </Card>
    </div>
  )
}
