"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import type { Order } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AssignAgentDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssignAgent: (orderId: string, agentId: string) => void
}

export function AssignAgentDialog({
  order,
  open,
  onOpenChange,
  onAssignAgent,
}: AssignAgentDialogProps) {
  const { deliveryAgents } = useStore()
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const handleAssign = () => {
    if (order && selectedAgent) {
      onAssignAgent(order.id, selectedAgent)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Delivery Agent</DialogTitle>
          <DialogDescription>
            Assign order {order?.orderNumber} to a delivery agent.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {deliveryAgents.map((agent) => (
                    <div key={agent.id} className={`p-4 border rounded-lg cursor-pointer ${selectedAgent === agent.id ? 'border-primary' : ''}`} onClick={() => setSelectedAgent(agent.id)}>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={agent.avatar} />
                                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{agent.name}</p>
                                <p className="text-sm text-muted-foreground">{agent.phone}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          <Button onClick={handleAssign} disabled={!selectedAgent}>
            Assign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
