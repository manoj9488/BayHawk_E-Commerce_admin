"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Menu, Globe, User, Settings, LogOut, HelpCircle, Check } from "lucide-react"
import { useState } from "react"
import { StoreSwitcher } from "./store-switcher"


interface HeaderProps {
  onMenuClick: () => void
}

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
]

export function Header({ onMenuClick }: HeaderProps) {
  const [currentLanguage, setCurrentLanguage] = useState("en")

  const handleLogout = () => {
    localStorage.removeItem("userRole")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders, products, users..."
              className="w-[300px] lg:w-[400px] pl-9 bg-secondary border-none"
            />
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Store Switcher */}
        <StoreSwitcher />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{languages.find((l) => l.code === currentLanguage)?.nativeName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setCurrentLanguage(lang.code)}
                className="flex items-center justify-between"
              >
                <span>
                  {lang.nativeName} <span className="text-muted-foreground">({lang.name})</span>
                </span>
                {currentLanguage === lang.code && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>



        {/* Help */}
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground">
                5
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium">New order received</span>
                <span className="text-sm text-muted-foreground">Order #ORD-2024-006 from Rajesh</span>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium">Low stock alert</span>
                <span className="text-sm text-muted-foreground">Coconut Oil is running low</span>
                <span className="text-xs text-muted-foreground">15 min ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium">Delivery completed</span>
                <span className="text-sm text-muted-foreground">Order #ORD-2024-005 delivered</span>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <Link href="/admin/notifications">
              <DropdownMenuItem className="text-center text-primary justify-center cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/admin-avatar.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">Admin User</span>
                <span className="text-xs text-muted-foreground">Super Admin</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-destructive">
              <Link href="/" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
