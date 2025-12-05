"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Send,
  Phone,
  Mail,
  Clock,
  Search,
  MoreVertical,
  CheckCheck,
  AlertCircle,
  Filter,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "admin"
  timestamp: Date
  read: boolean
}

interface Conversation {
  id: string
  customer: {
    name: string
    phone: string
    email: string
    avatar?: string
  }
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  status: "active" | "resolved" | "pending"
  messages: ChatMessage[]
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    customer: {
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      email: "priya@email.com",
    },
    lastMessage: "When will my order be delivered?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    status: "active",
    messages: [
      {
        id: "1",
        content: "Hi, I placed an order yesterday",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: true,
      },
      {
        id: "2",
        content: "Hello! Let me check that for you.",
        sender: "admin",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        read: true,
      },
      {
        id: "3",
        content: "Your order #ORD-001 is out for delivery",
        sender: "admin",
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        read: true,
      },
      {
        id: "4",
        content: "When will my order be delivered?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
      },
    ],
  },
  {
    id: "2",
    customer: {
      name: "Rajesh Kumar",
      phone: "+91 87654 32109",
      email: "rajesh@email.com",
    },
    lastMessage: "Thank you for the help!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
    unreadCount: 0,
    status: "resolved",
    messages: [
      {
        id: "1",
        content: "I need to change my delivery address",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        read: true,
      },
      {
        id: "2",
        content: "Sure, I can help you with that. What's the new address?",
        sender: "admin",
        timestamp: new Date(Date.now() - 1000 * 60 * 115),
        read: true,
      },
      {
        id: "3",
        content: "123 New Street, Chennai",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 110),
        read: true,
      },
      {
        id: "4",
        content: "Updated! Your order will be delivered to the new address.",
        sender: "admin",
        timestamp: new Date(Date.now() - 1000 * 60 * 105),
        read: true,
      },
      {
        id: "5",
        content: "Thank you for the help!",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true,
      },
    ],
  },
  {
    id: "3",
    customer: {
      name: "Anitha M",
      phone: "+91 76543 21098",
      email: "anitha@email.com",
    },
    lastMessage: "Product quality issue",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 120),
    unreadCount: 1,
    status: "pending",
    messages: [
      {
        id: "1",
        content: "Product quality issue",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        read: false,
      },
    ],
  },
]

export default function SupportPage() {
  const [conversations, setConversations] = useState(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "resolved">("all")

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || conv.customer.phone.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "admin",
      timestamp: new Date(),
      read: true,
    }

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, message], lastMessage: newMessage, lastMessageTime: new Date() }
          : conv,
      ),
    )
    setSelectedConversation((prev) =>
      prev
        ? { ...prev, messages: [...prev.messages, message], lastMessage: newMessage, lastMessageTime: new Date() }
        : null,
    )
    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/20 text-success border-success/30"
      case "pending":
        return "bg-warning/20 text-warning border-warning/30"
      case "resolved":
        return "bg-muted text-muted-foreground border-muted"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Live Chat Support</h1>
        <p className="text-muted-foreground">Manage customer conversations and support requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-1/10">
              <MessageSquare className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">{conversations.filter((c) => c.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">Active Chats</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{conversations.filter((c) => c.status === "pending").length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCheck className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{conversations.filter((c) => c.status === "resolved").length}</p>
              <p className="text-sm text-muted-foreground">Resolved Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <Clock className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold">2.5m</p>
              <p className="text-sm text-muted-foreground">Avg Response</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="grid gap-6 lg:grid-cols-3 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter === "all" ? "All" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>Resolved</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px]">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 text-left border-b border-border hover:bg-secondary/50 transition-colors ${
                    selectedConversation?.id === conversation.id ? "bg-secondary" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.customer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{conversation.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium truncate">{conversation.customer.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getStatusColor(conversation.status)}>
                          {conversation.status}
                        </Badge>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-primary text-primary-foreground">{conversation.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.customer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{selectedConversation.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedConversation.customer.name}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {selectedConversation.customer.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {selectedConversation.customer.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Customer Profile</DropdownMenuItem>
                      <DropdownMenuItem>View Order History</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-hidden">
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sender === "admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {message.sender === "admin" && <CheckCheck className="h-3 w-3 opacity-70" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
