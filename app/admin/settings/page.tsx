"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Settings, Bell, Shield, Globe, Save } from "lucide-react"

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your application settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Store Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Store Information
              </CardTitle>
              <CardDescription>Basic information about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue="Fresh Mart" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Support Email</Label>
                  <Input id="storeEmail" type="email" defaultValue="support@freshmart.com" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input id="storePhone" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeWebsite">Website</Label>
                  <Input id="storeWebsite" defaultValue="https://freshmart.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Address</Label>
                <Textarea id="storeAddress" defaultValue="123, Main Street, Chennai - 600001" rows={2} />
              </div>
            </CardContent>
          </Card>

          {/* Localization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization
              </CardTitle>
              <CardDescription>Language and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <select
                    id="defaultLanguage"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="en">English</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select id="currency" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Multi-language Support</Label>
                  <p className="text-sm text-muted-foreground">Allow users to switch between English and Tamil</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Legal Documents
              </CardTitle>
              <CardDescription>Manage your Privacy Policy and Terms of Service.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/admin/settings/legal">
                    <Button variant="outline">Manage Legal Pages</Button>
                </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert when products are running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Customer Messages</Label>
                  <p className="text-sm text-muted-foreground">Notifications for support requests</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Delivery Updates</Label>
                  <p className="text-sm text-muted-foreground">Track delivery status changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Promotional and newsletter emails</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add extra security to admin accounts</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                </div>
                <select className="h-10 px-3 rounded-md border border-input bg-background">
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="0">Never</option>
                </select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Login Notifications</Label>
                  <p className="text-sm text-muted-foreground">Email alerts for new logins</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>IP Whitelisting</Label>
                  <p className="text-sm text-muted-foreground">Restrict access to specific IPs</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable app features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Spinner Wheel Rewards</Label>
                  <p className="text-sm text-muted-foreground">Enable spin-to-win feature for users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Scratch Card Rewards</Label>
                  <p className="text-sm text-muted-foreground">Enable scratch card feature for users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>In-App Wallet</Label>
                  <p className="text-sm text-muted-foreground">Allow users to use wallet balance</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Subscription Plans</Label>
                  <p className="text-sm text-muted-foreground">Enable subscription-based purchases</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>AI Demand Forecasting</Label>
                  <p className="text-sm text-muted-foreground">Predictive analytics for inventory</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Live Chat Support</Label>
                  <p className="text-sm text-muted-foreground">Enable in-app chat with customers</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
