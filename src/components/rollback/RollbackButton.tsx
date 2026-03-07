import { useState } from 'react';
import { Button } from '../ui';
import { History } from 'lucide-react';
import { RollbackHistory } from './RollbackHistory';

interface RollbackButtonProps {
  entityType: string;
  entityId: string;
  onRollback: (previousState: any) => void;
  className?: string;
  showHistory?: boolean;
}

export const RollbackButton = ({ 
  entityType, 
  entityId, 
  onRollback, 
  className = "",
  showHistory = true 
}: RollbackButtonProps) => {
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  return (
    <div className={className}>
      <div className="flex gap-2">
        {showHistory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistoryPanel(!showHistoryPanel)}
          >
            <History className="h-4 w-4 mr-1" />
            History
          </Button>
        )}
      </div>

      {showHistoryPanel && (
        <div className="mt-4">
          <RollbackHistory
            entityType={entityType}
            entityId={entityId}
            onRollback={onRollback}
          />
        </div>
      )}
    </div>
  );
};
