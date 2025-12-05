"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, Mail, Lock, Phone, Loader2, Eye, EyeOff } from "lucide-react"
import { UserRole } from "@/lib/types"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"email" | "otp">("email")
  const [otpSent, setOtpSent] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>("super_admin")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    localStorage.setItem("userRole", selectedRole)
    setIsLoading(false)
    router.push("/admin")
  }

  const handleSendOTP = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOtpSent(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Store className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription className="mt-2">Sign in to access the admin dashboard</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="email" onValueChange={(v) => setLoginMethod(v as "email" | "otp")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email">Email & Password</TabsTrigger>
              <TabsTrigger value="otp">Phone OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="admin@example.com" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Login as</Label>
                  <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="procurement">Procurement</SelectItem>
                      <SelectItem value="packing">Packing</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center">
                  <button type="button" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="otp">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" className="pl-10" required />
                  </div>
                </div>

                {!otpSent ? (
                  <Button type="button" className="w-full" onClick={handleSendOTP} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className="text-center tracking-widest text-lg"
                        required
                      />
                      <p className="text-sm text-muted-foreground text-center">OTP sent to your phone number</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role-otp">Login as</Label>
                      <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                        <SelectTrigger id="role-otp">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                          <SelectItem value="procurement">Procurement</SelectItem>
                          <SelectItem value="packing">Packing</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                            </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Sign In"
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-sm text-primary hover:underline"
                      >
                        Change phone number
                      </button>
                    </div>
                  </>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
