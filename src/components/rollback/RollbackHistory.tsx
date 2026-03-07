import { useState } from 'react';
import { Card, Button } from '../ui';
import { RotateCcw, Clock, User, Eye, Trash2 } from 'lucide-react';
import { useRollback } from '../../context/RollbackContext';
import type { RollbackEntry } from '../../utils/rollbackManager';

interface RollbackHistoryProps {
  entityType?: string;
  entityId?: string;
  onRollback?: (previousState: any) => void;
  className?: string;
}

export const RollbackHistory = ({ 
  entityType, 
  entityId, 
  onRollback,
  className = "" 
}: RollbackHistoryProps) => {
  const { getHistory, rollback, clearHistory } = useRollback();
  const [selectedEntry, setSelectedEntry] = useState<RollbackEntry | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);

  const history = getHistory(entityType, entityId);

  const handleRollback = async (entry: RollbackEntry) => {
    if (!onRollback) return;
    
    setIsRollingBack(true);
    try {
      const success = await rollback(entry.id, onRollback);
      if (success) {
        alert('Rollback completed successfully');
      } else {
        alert('Rollback failed');
      }
    } catch (error) {
      alert('Rollback failed: ' + error);
    } finally {
      setIsRollingBack(false);
      setSelectedEntry(null);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionColor = (action: string) => {
    if (action.toLowerCase().includes('delete')) return 'text-red-600';
    if (action.toLowerCase().includes('create')) return 'text-green-600';
    if (action.toLowerCase().includes('update')) return 'text-blue-600';
    if (action.toLowerCase().includes('rollback')) return 'text-purple-600';
    return 'text-gray-600';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Rollback History</h3>
          <span className="text-sm text-gray-500">({history.length} entries)</span>
        </div>
        {history.length > 0 && (
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => {
              if (confirm('Clear all history? This cannot be undone.')) {
                clearHistory(entityType);
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear History
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="p-8 text-center">
          <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No History Available</h4>
          <p className="text-gray-500">No rollback entries found for this item.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {history.map((entry) => (
            <Card key={entry.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`font-medium ${getActionColor(entry.action)}`}>
                      {entry.action}
                    </span>
                    <span className="text-sm text-gray-500">
                      {entry.entityType} #{entry.entityId}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTimestamp(entry.timestamp)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {entry.userName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onRollback && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Rollback to previous state? This will restore the data to how it was before "${entry.action}".`)) {
                          handleRollback(entry);
                        }
                      }}
                      disabled={isRollingBack}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      {isRollingBack ? 'Rolling back...' : 'Rollback'}
                    </Button>
                  )}
                </div>
              </div>

              {selectedEntry?.id === entry.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Previous State</h5>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(entry.previousState, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Current State</h5>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(entry.currentState, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {isRollingBack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm">
            <div className="flex items-center gap-3">
              <RotateCcw className="h-6 w-6 text-blue-600 animate-spin" />
              <div>
                <h4 className="font-medium">Rolling back...</h4>
                <p className="text-sm text-gray-600">Please wait while we restore the previous state.</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
