"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Download, Printer, Calendar as CalendarIcon, Scissors } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

const cuttingData = [
  // Today's orders
  { id: "1", product: "Pomfret Fish", cuttingType: "Whole Fish", quantity: 25, unit: "kg", orders: 12, customer: "Rajesh Kumar", orderId: "ORD001", date: "2025-12-05" },
  { id: "2", product: "Seer Fish", cuttingType: "Steak", quantity: 18, unit: "kg", orders: 8, customer: "Priya Sharma", orderId: "ORD002", date: "2025-12-05" },
  { id: "3", product: "Salmon", cuttingType: "Fillet", quantity: 15, unit: "kg", orders: 10, customer: "Arun Patel", orderId: "ORD003", date: "2025-12-05" },
  
  // Yesterday's orders
  { id: "4", product: "Tuna", cuttingType: "Loin", quantity: 14, unit: "kg", orders: 6, customer: "Lakshmi Reddy", orderId: "ORD004", date: "2025-12-04" },
  { id: "5", product: "Kingfish", cuttingType: "Cheeks", quantity: 8, unit: "kg", orders: 4, customer: "Vijay Kumar", orderId: "ORD005", date: "2025-12-04" },
  { id: "6", product: "Sea Bass", cuttingType: "Butterfly Fillet", quantity: 12, unit: "kg", orders: 7, customer: "Anita Singh", orderId: "ORD006", date: "2025-12-04" },
  
  // 2 days ago
  { id: "7", product: "Sole Fish", cuttingType: "Paupiette", quantity: 10, unit: "kg", orders: 5, customer: "Ravi Menon", orderId: "ORD007", date: "2025-12-03" },
  { id: "8", product: "Cod Fish", cuttingType: "Goujons", quantity: 16, unit: "kg", orders: 9, customer: "Meera Nair", orderId: "ORD008", date: "2025-12-03" },
  
  // 3 days ago
  { id: "9", product: "Salmon", cuttingType: "Mignon", quantity: 11, unit: "kg", orders: 6, customer: "Karthik Raj", orderId: "ORD009", date: "2025-12-02" },
  { id: "10", product: "Mackerel", cuttingType: "Darne", quantity: 20, unit: "kg", orders: 11, customer: "Divya Iyer", orderId: "ORD010", date: "2025-12-02" },
  
  // Last week
  { id: "11", product: "Pomfret Fish", cuttingType: "Fillet", quantity: 22, unit: "kg", orders: 10, customer: "Suresh Babu", orderId: "ORD011", date: "2025-11-28" },
  { id: "12", product: "Seer Fish", cuttingType: "Whole Fish", quantity: 30, unit: "kg", orders: 15, customer: "Kavitha Rao", orderId: "ORD012", date: "2025-11-28" },
]

export default function CuttingTypeReportPage() {
  const [date, setDate] = useState<Date>()
  const [selectedHub, setSelectedHub] = useState("all")

  const filteredData = date 
    ? cuttingData.filter(item => item.date === format(date, "yyyy-MM-dd"))
    : cuttingData.filter(item => item.date === format(new Date(), "yyyy-MM-dd"))

  const handleExport = () => {
    toast.success("Cutting type report exported successfully")
  }

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) return
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cutting Type Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 5px 0; color: #666; }
          .info { margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .cutting-type { font-weight: bold; color: #2563eb; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print {
            body { padding: 10px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🐟 BayHawk E-Commerce</h1>
          <p>Cutting Type Requirements Receipt</p>
        </div>
        
        <div class="info">
          <div class="info-row">
            <span><strong>Date:</strong> ${date ? format(date, "PPP") : format(new Date(), "PPP")}</span>
            <span><strong>Hub:</strong> ${selectedHub === 'all' ? 'All Hubs' : selectedHub}</span>
          </div>
          <div class="info-row">
            <span><strong>Total Products:</strong> ${filteredData.length}</span>
            <span><strong>Total Quantity:</strong> ${filteredData.reduce((sum, item) => sum + item.quantity, 0)} kg</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Cutting Type</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(item => `
              <tr>
                <td>${item.orderId}</td>
                <td>${item.customer}</td>
                <td>${item.product}</td>
                <td class="cutting-type">${item.cuttingType}</td>
                <td>${item.quantity} ${item.unit}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Cutting Types: Whole Fish | Fillet | Steak | Loin | Cheeks | Butterfly Fillet | Paupiette | Goujons | Mignon | Darne</p>
          <p>Generated on ${format(new Date(), "PPP 'at' p")}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    toast.success("Printing cutting type receipt...")
  }

  const handlePrintLabel = (item: any) => {
    const printWindow = window.open('', '', 'width=400,height=300')
    if (!printWindow) return
    
    const labelContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Box Label - ${item.orderId}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 15px;
            margin: 0;
          }
          .label {
            border: 3px solid #000;
            padding: 15px;
            width: 350px;
            height: 250px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .logo { 
            text-align: center; 
            font-size: 20px; 
            font-weight: bold;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .order-id {
            font-size: 16px;
            font-weight: bold;
            margin: 5px 0;
          }
          .customer {
            font-size: 14px;
            margin: 5px 0;
          }
          .product {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
            color: #1a1a1a;
          }
          .cutting-type {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            text-align: center;
            padding: 15px;
            background: #f0f9ff;
            border: 2px dashed #2563eb;
            margin: 10px 0;
          }
          .quantity {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin: 5px 0;
          }
          .date {
            font-size: 11px;
            text-align: center;
            color: #666;
            margin-top: 5px;
          }
          @media print {
            body { padding: 0; }
            .label { border: 3px solid #000; }
          }
        </style>
      </head>
      <body>
        <div class="label">
          <div>
            <div class="logo">🐟 BayHawk</div>
            <div class="order-id">Order: ${item.orderId}</div>
            <div class="customer">Customer: ${item.customer}</div>
            <div class="product">${item.product}</div>
          </div>
          <div>
            <div class="cutting-type">${item.cuttingType}</div>
            <div class="quantity">Quantity: ${item.quantity} ${item.unit}</div>
          </div>
          <div class="date">${format(new Date(), "dd/MM/yyyy HH:mm")}</div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>
      </body>
      </html>
    `
    
    printWindow.document.write(labelContent)
    printWindow.document.close()
    toast.success(`Printing label for ${item.orderId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cutting Type Report</h1>
          <p className="text-muted-foreground">Procurement cutting requirements for orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>

            <Select value={selectedHub} onValueChange={setSelectedHub}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Hub" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hubs</SelectItem>
                <SelectItem value="hub1">Central Hub</SelectItem>
                <SelectItem value="hub2">North Hub</SelectItem>
                <SelectItem value="hub3">South Hub</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
            <p className="text-xs text-muted-foreground">Requiring cutting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.reduce((sum, item) => sum + item.quantity, 0)} kg
            </div>
            <p className="text-xs text-muted-foreground">To be processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.reduce((sum, item) => sum + item.orders, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Pending orders</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cutting Requirements {date && `- ${format(date, "PPP")}`}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Cutting Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.orderId}</TableCell>
                    <TableCell>{item.customer}</TableCell>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.cuttingType}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>{format(new Date(item.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handlePrintLabel(item)}>
                        <Printer className="mr-2 h-3 w-3" />
                        Print Label
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No orders found for {date ? format(date, "PPP") : "today"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
