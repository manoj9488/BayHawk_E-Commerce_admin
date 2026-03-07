import { useState } from 'react';
import { Button, Input } from '../../ui';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface SurgeChargesProps {
  currentCharges?: number;
  onUpdate: (charges: number, reason: string) => Promise<void>;
  className?: string;
}

export function SurgeCharges({ 
  currentCharges = 0,
  onUpdate,
  className = '' 
}: SurgeChargesProps) {
  const [charges, setCharges] = useState(currentCharges.toString());
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    const amount = parseFloat(charges);
    if (isNaN(amount) || amount < 0) return;
    
    setLoading(true);
    try {
      await onUpdate(amount, reason);
      setReason('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-orange-600" />
        Surge & Additional Charges
      </h3>

      <div className="space-y-4">
        <Input
          type="number"
          label="Charge Amount (₹)"
          value={charges}
          onChange={(e) => setCharges(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
        />

        <Input
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Peak hour delivery, Remote location"
        />

        {parseFloat(charges) > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-medium">Additional charge will be added to order total</p>
                <p className="text-xs mt-1">Customer will be notified about the extra charges</p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleUpdate}
          disabled={loading || !charges || parseFloat(charges) < 0}
          className="w-full"
        >
          {loading ? 'Updating...' : 'Update Charges'}
        </Button>
      </div>
    </div>
  );
}
