"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MessageCircle,
  Instagram,
  Facebook,
  CreditCard,
  MapPin,
  Bell,
  Mail,
  Phone,
  Settings,
  Check,
  X,
  ExternalLink,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ElementType
  status: "connected" | "disconnected" | "error"
  category: "messaging" | "payment" | "maps" | "notifications" | "other"
  lastSync?: Date
}

const integrations: Integration[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Receive orders and send notifications via WhatsApp",
    icon: MessageCircle,
    status: "connected",
    category: "messaging",
    lastSync: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect your Instagram shop for order management",
    icon: Instagram,
    status: "connected",
    category: "messaging",
    lastSync: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Integrate with Facebook Shop and Messenger",
    icon: Facebook,
    status: "disconnected",
    category: "messaging",
  },
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Accept online payments via UPI, cards, and wallets",
    icon: CreditCard,
    status: "connected",
    category: "payment",
    lastSync: new Date(),
  },
  {
    id: "phonepe",
    name: "PhonePe",
    description: "Accept PhonePe payments",
    icon: Phone,
    status: "connected",
    category: "payment",
  },
  {
    id: "googlemaps",
    name: "Google Maps",
    description: "Address lookup, route planning, and geo-pinning",
    icon: MapPin,
    status: "connected",
    category: "maps",
    lastSync: new Date(),
  },
  {
    id: "firebase",
    name: "Firebase Cloud Messaging",
    description: "Send push notifications to mobile apps",
    icon: Bell,
    status: "connected",
    category: "notifications",
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Send transactional and marketing emails",
    icon: Mail,
    status: "error",
    category: "notifications",
  },
  {
    id: "twilio",
    name: "Twilio SMS",
    description: "Send SMS notifications to customers",
    icon: Phone,
    status: "disconnected",
    category: "notifications",
  },
]

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredIntegrations = integrations.filter((int) => {
    const matchesSearch = int.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || int.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-success/20 text-success border-success/30">Connected</Badge>
      case "disconnected":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Disconnected
          </Badge>
        )
      case "error":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Error</Badge>
      default:
        return null
    }
  }

  const categories = [
    { id: "all", name: "All" },
    { id: "messaging", name: "Messaging" },
    { id: "payment", name: "Payment" },
    { id: "maps", name: "Maps" },
    { id: "notifications", name: "Notifications" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect third-party services to extend functionality</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Check className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{integrations.filter((i) => i.status === "connected").length}</p>
              <p className="text-sm text-muted-foreground">Connected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <X className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{integrations.filter((i) => i.status === "disconnected").length}</p>
              <p className="text-sm text-muted-foreground">Disconnected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <X className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{integrations.filter((i) => i.status === "error").length}</p>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-1/10">
              <Settings className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">{integrations.length}</p>
              <p className="text-sm text-muted-foreground">Total Available</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-64"
            />
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={categoryFilter === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <integration.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    {getStatusBadge(integration.status)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>{integration.description}</CardDescription>

              {integration.lastSync && integration.status === "connected" && (
                <p className="text-xs text-muted-foreground">
                  Last synced: {integration.lastSync.toLocaleTimeString()}
                </p>
              )}

              <div className="flex gap-2">
                {integration.status === "connected" ? (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Configure {integration.name}</DialogTitle>
                          <DialogDescription>Update your integration settings</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="apiKey">API Key</Label>
                            <Input id="apiKey" type="password" defaultValue="••••••••••••••••" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="webhook">Webhook URL</Label>
                            <Input id="webhook" defaultValue="https://api.freshmart.com/webhooks/..." />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Auto-sync</Label>
                              <p className="text-sm text-muted-foreground">Sync data automatically</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Test Connection</Button>
                          <Button>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                      Disconnect
                    </Button>
                  </>
                ) : integration.status === "error" ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Settings className="h-4 w-4 mr-1" />
                      Fix Issues
                    </Button>
                    <Button variant="outline" size="sm">
                      Reconnect
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
