import { Crown, Clock, ArrowRight } from 'lucide-react';

interface SpecialProductNoticeProps {
  hasRareProducts: boolean;
  hasExoticProducts: boolean;
}

export function SpecialProductNotice({ hasRareProducts, hasExoticProducts }: SpecialProductNoticeProps) {
  if (!hasRareProducts && !hasExoticProducts) return null;

  return (
    <div className="space-y-3">
      {hasRareProducts && (
        <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Crown className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                Rare Products in Order
              </h4>
              <div className="space-y-2 text-sm text-orange-800">
                <div className="flex gap-2">
                  <span className="font-medium min-w-[120px]">Availability:</span>
                  <span>Can order for the next available delivery slot</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium min-w-[120px]">Requirement:</span>
                  <span>Must ask customer for an alternate product preference</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium min-w-[120px]">Fallback:</span>
                  <span>If unavailable during procurement, the alternate product will be delivered</span>
                </div>
              </div>
              
              {/* Demo Format */}
              <div className="mt-3 p-3 bg-white border border-orange-300 rounded">
                <p className="text-xs font-semibold text-orange-700 mb-2">Example Format:</p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1">
                    <div className="font-medium text-gray-700">Ordered: Rare Tuna (500g)</div>
                    <div className="text-gray-500">₹1,200</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-orange-500" />
                  <div className="flex-1">
                    <div className="font-medium text-green-700">Alternate: Fresh Salmon (500g)</div>
                    <div className="text-gray-500">₹1,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasExoticProducts && (
        <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                Exotic Products in Order
              </h4>
              <div className="space-y-2 text-sm text-purple-800">
                <div className="flex gap-2">
                  <span className="font-medium min-w-[120px]">Delivery Time:</span>
                  <span>Requires 2-7 days for delivery</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium min-w-[120px]">Reason:</span>
                  <span>Imported delicacies require quality checks and import procedures</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
