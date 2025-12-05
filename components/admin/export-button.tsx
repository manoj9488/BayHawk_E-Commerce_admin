"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileSpreadsheet, FileText, FileJson } from "lucide-react"

interface ExportButtonProps {
  data: Record<string, unknown>[]
  filename?: string
  onExport?: (format: string) => void
}

export function ExportButton({ data, filename = "export", onExport }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)

  const exportToCSV = () => {
    setExporting(true)
    try {
      if (data.length === 0) return

      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header]
              if (typeof value === "string" && value.includes(",")) {
                return `"${value}"`
              }
              return value
            })
            .join(","),
        ),
      ].join("\n")

      downloadFile(csvContent, `${filename}.csv`, "text/csv")
      onExport?.("csv")
    } finally {
      setExporting(false)
    }
  }

  const exportToJSON = () => {
    setExporting(true)
    try {
      const jsonContent = JSON.stringify(data, null, 2)
      downloadFile(jsonContent, `${filename}.json`, "application/json")
      onExport?.("json")
    } finally {
      setExporting(false)
    }
  }

  const exportToExcel = () => {
    // For a real implementation, you'd use a library like xlsx
    // This is a simplified CSV export that Excel can open
    exportToCSV()
    onExport?.("excel")
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={exporting || data.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          {exporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
