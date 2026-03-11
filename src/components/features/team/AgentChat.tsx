import { useState, useRef, useEffect } from "react";
import { Button, Input } from "../../ui";
import { Send, X } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "admin" | "agent";
  message: string;
  timestamp: string;
  read: boolean;
}

interface AgentChatProps {
  agentId: string;
  agentName: string;
  onClose: () => void;
}

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "admin-1",
    senderName: "Admin",
    senderType: "admin",
    message: "Hi, are you available for deliveries today?",
    timestamp: "10:30 AM",
    read: true,
  },
  {
    id: "2",
    senderId: "agent-1",
    senderName: "Murugan K",
    senderType: "agent",
    message: "Yes sir, I am ready",
    timestamp: "10:32 AM",
    read: true,
  },
  {
    id: "3",
    senderId: "admin-1",
    senderName: "Admin",
    senderType: "admin",
    message:
      "Great! I have assigned 3 orders to you. Check the batch orders section.",
    timestamp: "10:35 AM",
    read: true,
  },
  {
    id: "4",
    senderId: "agent-1",
    senderName: "Murugan K",
    senderType: "agent",
    message: "Received. Starting delivery now.",
    timestamp: "10:40 AM",
    read: true,
  },
];

export function AgentChat({ agentName, onClose }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "admin-1",
      senderName: "Admin",
      senderType: "admin",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-blue-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {agentName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{agentName}</h3>
            <p className="text-xs text-green-600">● Online</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderType === "admin" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.senderType === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900 border"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.senderType === "admin" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
