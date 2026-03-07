import { useState, useEffect } from 'react';
import { X, Truck, DollarSign, User, AlertCircle } from 'lucide-react';

interface BatchDeliveryAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { agentId: string; pricePerOrder?: number }) => void;
  orderCount: number;
  agents: Array<{ id: string; name: string; agentType: 'employee' | 'partner' }>;
}

export function BatchDeliveryAssignmentModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  orderCount,
  agents 
}: BatchDeliveryAssignmentModalProps) {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [pricePerOrder, setPricePerOrder] = useState('');
  const [selectedAgentType, setSelectedAgentType] = useState<'employee' | 'partner' | null>(null);

  useEffect(() => {
    if (selectedAgent) {
      const agent = agents.find(a => a.id === selectedAgent);
      setSelectedAgentType(agent?.agentType || null);
      // Always clear price when agent changes - force manual entry
      setPricePerOrder('');
    } else {
      setSelectedAgentType(null);
      setPricePerOrder('');
    }
  }, [selectedAgent, agents]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAgent('');
      setPricePerOrder('');
      setSelectedAgentType(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate price for partner agents - must be manually entered
    if (selectedAgentType === 'partner') {
      if (!pricePerOrder || pricePerOrder.trim() === '' || parseFloat(pricePerOrder) <= 0) {
        alert('⚠️ Please manually enter a valid delivery price per order for partner agent.\n\nThe price field cannot be empty or zero.');
        return;
      }
    }

    onSubmit({
      agentId: selectedAgent,
      pricePerOrder: selectedAgentType === 'partner' ? parseFloat(pricePerOrder) : undefined
    });
    
    // Reset form after successful submission
    setSelectedAgent('');
    setPricePerOrder('');
    setSelectedAgentType(null);
    onClose();
  };

  const totalAmount = selectedAgentType === 'partner' && pricePerOrder 
    ? parseFloat(pricePerOrder) * orderCount 
    : 0;

  const selectedAgentData = agents.find(a => a.id === selectedAgent);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Batch Delivery Assignment</h2>
              <p className="text-sm text-gray-600">Assign multiple orders to delivery partner</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Order Count Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">
                <span className="text-2xl font-bold">{orderCount}</span> orders selected for batch assignment
              </p>
            </div>
          </div>

          {/* Select Delivery Agent */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Select Delivery Agent *
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            >
              <option value="">Choose delivery agent...</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.agentType === 'employee' ? '👤 Employee' : '🤝 Partner'}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Agent Info */}
          {selectedAgentData && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">SELECTED AGENT</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{selectedAgentData.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedAgentData.agentType === 'employee' ? 'Employee Agent' : 'Partner Agent'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedAgentData.agentType === 'employee' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {selectedAgentData.agentType.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Price Per Order - Manual Entry Field */}
          {selectedAgent && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-4">
                <label className="block text-sm font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  ✍️ MANUAL PRICE ENTRY - Type Delivery Charge Per Order
                  {selectedAgentType === 'partner' && <span className="text-red-600 text-lg">*</span>}
                </label>
                
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-gray-700 font-bold text-xl">₹</span>
                  </div>
                  <input
                    type="number"
                    value={pricePerOrder}
                    onChange={(e) => setPricePerOrder(e.target.value)}
                    className="w-full rounded-lg border-3 border-orange-400 pl-12 pr-24 py-4 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all text-2xl font-bold text-gray-900 bg-white placeholder-gray-400"
                    placeholder="Type amount here..."
                    min="0"
                    step="0.01"
                    required={selectedAgentType === 'partner'}
                    disabled={selectedAgentType === 'employee'}
                    autoFocus={selectedAgentType === 'partner'}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    per order
                  </div>
                </div>
                
                <div className="mt-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  {selectedAgentType === 'employee' ? (
                    <p className="text-sm text-gray-600">
                      <strong>Employee Agent:</strong> No delivery charge required. This field is disabled.
                    </p>
                  ) : (
                    <div className="text-sm text-orange-800">
                      <p className="font-bold mb-1">⚠️ IMPORTANT - Manual Entry Required:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>You must <strong>manually type</strong> the delivery charge amount</li>
                        <li>No auto-fill or pre-set prices</li>
                        <li>Enter the exact amount you want to pay per order</li>
                        <li>Example: Type "50" for ₹50.00 per order</li>
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Empty State Message */}
                {selectedAgentType === 'partner' && !pricePerOrder && (
                  <div className="mt-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 font-semibold text-center">
                      👆 Please type the delivery price in the field above
                    </p>
                  </div>
                )}
              </div>

              {/* Live Calculation Display */}
              {selectedAgentType === 'partner' && pricePerOrder && parseFloat(pricePerOrder) > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-3 border-green-400 rounded-lg p-5 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wide">Live Calculation</p>
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b-2 border-green-200">
                      <span className="text-sm text-green-700">Price per order:</span>
                      <span className="text-xl font-bold text-green-900">₹{parseFloat(pricePerOrder).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-3 border-b-2 border-green-200">
                      <span className="text-sm text-green-700">Number of orders:</span>
                      <span className="text-xl font-bold text-green-900">× {orderCount}</span>
                    </div>
                    
                    <div className="bg-green-600 rounded-lg p-4 mt-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-semibold text-green-100 mb-1">TOTAL PAYMENT TO PARTNER</p>
                          <p className="text-4xl font-bold text-white">₹{totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-100">Amount to be</p>
                          <p className="text-xs text-green-100">paid to partner</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border-2 border-green-200">
                      <p className="text-xs text-green-700 text-center">
                        💡 <strong>Calculation:</strong> {orderCount} orders × ₹{parseFloat(pricePerOrder).toFixed(2)} = ₹{totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedAgent}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Assign {orderCount} Orders
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
