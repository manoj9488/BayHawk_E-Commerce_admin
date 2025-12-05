"use client"

import { useState } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface MapAddressPickerProps {
  onAddressSelect?: (address: { lat: number; lng: number; formatted: string }) => void
}

export function MapAddressPicker({ onAddressSelect }: MapAddressPickerProps) {
  const [address, setAddress] = useState("")
  const [coordinates, setCoordinates] = useState({ lat: 13.0827, lng: 80.2707 }) // Chennai default

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCoordinates(coords)
          // In production, use reverse geocoding API
          setAddress(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`)
          onAddressSelect?.({ ...coords, formatted: address })
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Delivery Address</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter address or search location"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button type="button" variant="outline" size="icon" onClick={handleGetCurrentLocation}>
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-muted/50">
        <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Map view (Google Maps integration)
            </p>
            <p className="text-xs text-muted-foreground">
              Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
            </p>
          </div>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Note: Add Google Maps API key in environment variables for full functionality
      </p>
    </div>
  )
}
