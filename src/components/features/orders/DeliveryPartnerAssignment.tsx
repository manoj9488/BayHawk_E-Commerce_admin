import { useState, useEffect } from "react";
import { Button } from "../../ui";
import { Truck, User, Phone, Star, MapPin, CheckCircle, Clock } from "lucide-react";
import type { DeliveryAgent } from "../../../types";

interface DeliveryPartnerAssignmentProps {
  orderId: string;
  currentAgentId?: string;
  onAssign: (agentId: string) => Promise<void>;
  className?: string;
}

export function DeliveryPartnerAssignment({
  currentAgentId,
  onAssign,
  className = "",
}: DeliveryPartnerAssignmentProps) {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState(currentAgentId || "");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock data - replace with actual API call
    setAgents([
      {
        id: "1",
        name: "Raj Kumar",
        phone: "9876543210",
        vehicleNo: "TN01AB1234",
        agentType: "employee",
        rating: 4.5,
        deliveries: 120,
        isActive: true,
        status: "available",
      },
      {
        id: "2",
        name: "Suresh M",
        phone: "9876543211",
        vehicleNo: "TN02CD5678",
        agentType: "partner",
        rating: 4.8,
        deliveries: 85,
        isActive: true,
        status: "available",
      },
      {
        id: "3",
        name: "Karthik S",
        phone: "9876543212",
        vehicleNo: "TN03EF9012",
        agentType: "employee",
        rating: 4.2,
        deliveries: 95,
        isActive: true,
        status: "delivering",
      },
      {
        id: "4",
        name: "Vijay R",
        phone: "9876543213",
        vehicleNo: "TN04GH3456",
        agentType: "partner",
        rating: 4.6,
        deliveries: 110,
        isActive: true,
        status: "available",
      },
      {
        id: "5",
        name: "Arun P",
        phone: "9876543214",
        vehicleNo: "TN05IJ7890",
        agentType: "employee",
        rating: 4.3,
        deliveries: 78,
        isActive: true,
        status: "available",
      },
    ]);
  }, []);

  const handleAssign = async () => {
    if (!selectedAgentId) return;
    setLoading(true);
    try {
      await onAssign(selectedAgentId);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone.includes(searchTerm) ||
    agent.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'delivering': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Truck className="h-5 w-5 text-blue-600" />
        Assign Delivery Partner
      </h3>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, phone, or vehicle number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Delivery Partners List */}
      <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedAgentId === agent.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedAgentId === agent.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`}>
                    <User className={`h-5 w-5 ${
                      selectedAgentId === agent.id ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      {agent.name}
                      {selectedAgentId === agent.id && (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        agent.agentType === 'employee' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {agent.agentType === 'employee' ? 'Employee' : 'Partner'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status === 'available' ? '● Available' : 
                         agent.status === 'delivering' ? '● Delivering' : '● Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900">{agent.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="h-4 w-4 flex-shrink-0" />
                  <span>{agent.vehicleNo}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{agent.deliveries} deliveries</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>{agent.status === 'available' ? 'Ready now' : 'On delivery'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No delivery partners found</p>
          </div>
        )}
      </div>

      {/* Selected Agent Summary */}
      {selectedAgentId && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-medium mb-1">Selected Partner:</p>
          <p className="text-sm text-blue-700">
            {agents.find(a => a.id === selectedAgentId)?.name} - {agents.find(a => a.id === selectedAgentId)?.phone}
          </p>
        </div>
      )}

      {/* Assign Button */}
      <Button
        onClick={handleAssign}
        disabled={!selectedAgentId || loading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {loading
          ? "Assigning..."
          : currentAgentId
            ? "Update Assignment"
            : "Assign Selected Partner"}
      </Button>
    </div>
  );
}
