interface RollbackEntry {
  id: string;
  timestamp: Date;
  action: string;
  entityType: string;
  entityId: string;
  previousState: any;
  currentState: any;
  userId: string;
  userName: string;
}

class RollbackManager {
  private static instance: RollbackManager;
  private history: RollbackEntry[] = [];
  private maxHistorySize = 100;

  static getInstance(): RollbackManager {
    if (!RollbackManager.instance) {
      RollbackManager.instance = new RollbackManager();
    }
    return RollbackManager.instance;
  }

  saveState(
    action: string,
    entityType: string,
    entityId: string,
    previousState: any,
    currentState: any,
    userId: string,
    userName: string
  ): void {
    const entry: RollbackEntry = {
      id: `rollback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      action,
      entityType,
      entityId,
      previousState: JSON.parse(JSON.stringify(previousState)),
      currentState: JSON.parse(JSON.stringify(currentState)),
      userId,
      userName
    };

    this.history.unshift(entry);
    
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize);
    }

    this.persistToStorage();
  }

  getHistory(entityType?: string, entityId?: string): RollbackEntry[] {
    let filtered = this.history;
    
    if (entityType) {
      filtered = filtered.filter(entry => entry.entityType === entityType);
    }
    
    if (entityId) {
      filtered = filtered.filter(entry => entry.entityId === entityId);
    }
    
    return filtered;
  }

  rollback(entryId: string): RollbackEntry | null {
    const entry = this.history.find(h => h.id === entryId);
    if (!entry) return null;

    // Create a new rollback entry for the rollback action itself
    this.saveState(
      `Rollback: ${entry.action}`,
      entry.entityType,
      entry.entityId,
      entry.currentState,
      entry.previousState,
      'system',
      'System Rollback'
    );

    return entry;
  }

  clearHistory(entityType?: string): void {
    if (entityType) {
      this.history = this.history.filter(entry => entry.entityType !== entityType);
    } else {
      this.history = [];
    }
    this.persistToStorage();
  }

  private persistToStorage(): void {
    try {
      localStorage.setItem('rollback_history', JSON.stringify(this.history));
    } catch (error) {
      console.warn('Failed to persist rollback history:', error);
    }
  }

  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('rollback_history');
      if (stored) {
        this.history = JSON.parse(stored).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load rollback history:', error);
      this.history = [];
    }
  }
}

export { RollbackManager, type RollbackEntry };
