import { useRollback } from '../context/RollbackContext';

interface UseRollbackStateProps<T> {
  entityType: string;
  entityId: string;
  initialState: T;
}

export function useRollbackState<T>({ entityType, entityId }: UseRollbackStateProps<T>) {
  const { saveState } = useRollback();

  const saveStateChange = (action: string, previousState: T, newState: T) => {
    saveState(action, entityType, entityId, previousState, newState);
  };

  return {
    saveStateChange
  };
}
