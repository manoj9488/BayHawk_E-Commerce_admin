import { useState, useMemo } from 'react';
import { Card, Button } from '../../ui';
import { CheckSquare, Square, Package, MapPin, Clock, User } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  deliveryAddress: string;
  orderValue: number;
  estimatedTime: string;
}

interface BatchOrderAssignmentProps {
  agents: AgentOption[];
  orders: Order[];
  onAssign: (agentId: string, orderIds: string[]) => void;
  onCancel: () => void;
}

interface AgentOption {
  id: string;
  name: string;
  vehicleType?: string;
  status: string;
  currentOrders?: number;
  agentType: 'employee' | 'partner';
  pricePerOrder?: number;
}

export function BatchOrderAssignment({ agents, orders, onAssign, onCancel }: BatchOrderAssignmentProps) {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [manualPrice, setManualPrice] = useState<number | ''>('');
  const [useManualPrice, setUseManualPrice] = useState(false);

  const toggleOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleAssign = () => {
    if (selectedAgent && selectedOrders.length > 0) {
      onAssign(selectedAgent, selectedOrders);
    }
  };

  const availableAgents = agents.filter(a => a.status === 'available' || a.status === 'delivering');

  const selectedAgentData = useMemo(() => 
    availableAgents.find(a => a.id === selectedAgent),
    [selectedAgent, availableAgents]
  );

  const partnerPricing = useMemo(() => {
    if (!selectedAgentData || selectedAgentData.agentType !== 'partner') return null;
    
    if (useManualPrice && manualPrice) {
      return { pricePerOrder: manualPrice, totalAmount: manualPrice * selectedOrders.length };
    }
    
    const pricePerOrder = selectedAgentData.pricePerOrder || 50;
    const totalAmount = pricePerOrder * selectedOrders.length;
    return { pricePerOrder, totalAmount };
  }, [selectedAgentData, selectedOrders.length, useManualPrice, manualPrice]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Delivery Agent</label>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Choose an agent...</option>
          {availableAgents.map(agent => (
            <option key={agent.id} value={agent.id}>
              {agent.name} - {agent.vehicleType} ({agent.currentOrders} orders) - {agent.agentType === 'partner' ? '🤝 Partner' : '👤 Employee'}
            </option>
          ))}
        </select>
      </div>

      {partnerPricing && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Partner Pricing</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useManualPrice}
                  onChange={(e) => {
                    setUseManualPrice(e.target.checked);
                    if (!e.target.checked) setManualPrice('');
                  }}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Manual Entry</span>
              </label>
            </div>

            {useManualPrice ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price per Order</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="Enter price per order"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {manualPrice && selectedOrders.length > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">₹{manualPrice} × {selectedOrders.length} orders</div>
                    <div className="text-lg text-orange-600 font-bold">Total: ₹{partnerPricing.totalAmount}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Auto-calculated:</span>
                <div className="text-right">
                  <div className="text-gray-600">₹{partnerPricing.pricePerOrder} × {selectedOrders.length} orders</div>
                  <div className="text-orange-600 font-semibold">Total: ₹{partnerPricing.totalAmount}</div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Orders ({selectedOrders.length} selected)
        </label>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {orders.map(order => (
            <Card
              key={order.id}
              className={`p-3 cursor-pointer transition-colors ${
                selectedOrders.includes(order.id) ? 'bg-blue-50 border-blue-300' : ''
              }`}
              onClick={() => toggleOrder(order.id)}
            >
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  {selectedOrders.includes(order.id) ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">{order.id}</span>
                    <span className="text-green-600 font-semibold">₹{order.orderValue}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{order.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>ETA: {order.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button
          onClick={handleAssign}
          disabled={!selectedAgent || selectedOrders.length === 0}
          className="flex-1"
        >
          <Package className="h-5 w-5 mr-2" />
          Assign {selectedOrders.length} Orders
        </Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
}
