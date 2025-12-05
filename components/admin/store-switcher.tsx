"use client"

import { Store, Building2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useState } from "react"

const stores = [
  { id: "hub", name: "Central Hub", type: "hub" },
  { id: "store-1", name: "Store - Anna Nagar", type: "store" },
  { id: "store-2", name: "Store - T Nagar", type: "store" },
  { id: "store-3", name: "Store - Velachery", type: "store" },
]

export function StoreSwitcher() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(stores[0])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {selected.type === "hub" ? <Building2 className="mr-2 h-4 w-4" /> : <Store className="mr-2 h-4 w-4" />}
          {selected.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search store..." />
          <CommandList>
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Hub">
              {stores.filter(s => s.type === "hub").map((store) => (
                <CommandItem
                  key={store.id}
                  onSelect={() => {
                    setSelected(store)
                    setOpen(false)
                  }}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  {store.name}
                  {selected.id === store.id && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Stores">
              {stores.filter(s => s.type === "store").map((store) => (
                <CommandItem
                  key={store.id}
                  onSelect={() => {
                    setSelected(store)
                    setOpen(false)
                  }}
                >
                  <Store className="mr-2 h-4 w-4" />
                  {store.name}
                  {selected.id === store.id && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
