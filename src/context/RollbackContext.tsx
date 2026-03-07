import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { RollbackManager } from '../utils/rollbackManager';
import type { RollbackEntry } from '../utils/rollbackManager';
import { useAuth } from './AuthContext';

interface RollbackContextType {
  saveState: (action: string, entityType: string, entityId: string, previousState: any, currentState: any) => void;
  getHistory: (entityType?: string, entityId?: string) => RollbackEntry[];
  rollback: (entryId: string, onRollback: (previousState: any) => void) => Promise<boolean>;
  clearHistory: (entityType?: string) => void;
}

const RollbackContext = createContext<RollbackContextType | undefined>(undefined);

interface RollbackProviderProps {
  children: ReactNode;
}

export const RollbackProvider = ({ children }: RollbackProviderProps) => {
  const { user } = useAuth();
  const rollbackManager = RollbackManager.getInstance();

  const saveState = useCallback((
    action: string,
    entityType: string,
    entityId: string,
    previousState: any,
    currentState: any
  ) => {
    if (!user) return;
    
    rollbackManager.saveState(
      action,
      entityType,
      entityId,
      previousState,
      currentState,
      user.id || 'unknown',
      user.name || 'Unknown User'
    );
  }, [user, rollbackManager]);

  const getHistory = useCallback((entityType?: string, entityId?: string) => {
    return rollbackManager.getHistory(entityType, entityId);
  }, [rollbackManager]);

  const rollback = useCallback(async (
    entryId: string,
    onRollback: (previousState: any) => void
  ): Promise<boolean> => {
    try {
      const entry = rollbackManager.rollback(entryId);
      if (!entry) return false;

      await onRollback(entry.previousState);
      return true;
    } catch (error) {
      console.error('Rollback failed:', error);
      return false;
    }
  }, [rollbackManager]);

  const clearHistory = useCallback((entityType?: string) => {
    rollbackManager.clearHistory(entityType);
  }, [rollbackManager]);

  // Load history on mount
  rollbackManager.loadFromStorage();

  return (
    <RollbackContext.Provider value={{ saveState, getHistory, rollback, clearHistory }}>
      {children}
    </RollbackContext.Provider>
  );
};

export const useRollback = () => {
  const context = useContext(RollbackContext);
  if (!context) {
    throw new Error('useRollback must be used within a RollbackProvider');
  }
  return context;
};
