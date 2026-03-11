import { useState } from 'react';
import { Card, Button } from '../../ui';
import { RollbackHistory } from '../../rollback/RollbackHistory';
import { useRollback } from '../../../context/RollbackContext';
import { RotateCcw, Package, ShoppingCart, Users, Settings } from 'lucide-react';

interface SystemState {
  orders: number;
  products: number;
  users: number;
  settings: Record<string, any>;
}

export const SystemRollbackDemo = () => {
  const [systemState, setSystemState] = useState<SystemState>({
    orders: 1250,
    products: 450,
    users: 320,
    settings: {
      maintenanceMode: false,
      maxOrdersPerDay: 1000,
      autoBackup: true
    }
  });

  const { saveState } = useRollback();

  const simulateSystemChange = (changeType: string) => {
    const previousState = { ...systemState };
    let newState = { ...systemState };
    let action = '';

    switch (changeType) {
      case 'maintenance':
        newState.settings.maintenanceMode = !newState.settings.maintenanceMode;
        action = `${newState.settings.maintenanceMode ? 'Enable' : 'Disable'} Maintenance Mode`;
        break;
      case 'orders':
        newState.orders += Math.floor(Math.random() * 50) + 10;
        action = 'Process New Orders';
        break;
      case 'products':
        newState.products += Math.floor(Math.random() * 10) - 5;
        action = 'Update Product Inventory';
        break;
      case 'users':
        newState.users += Math.floor(Math.random() * 5) + 1;
        action = 'Add New Users';
        break;
      case 'settings':
        newState.settings.maxOrdersPerDay = Math.floor(Math.random() * 500) + 800;
        action = 'Update System Settings';
        break;
    }

    setSystemState(newState);
    saveState(action, 'system', 'main', previousState, newState);
  };

  const handleSystemRollback = (previousState: SystemState) => {
    setSystemState(previousState);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <RotateCcw className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">System State Management with Rollback</h2>
      </div>

      {/* Current System State */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Orders</p>
              <p className="text-2xl font-bold">{systemState.orders}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Products</p>
              <p className="text-2xl font-bold">{systemState.products}</p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Users</p>
              <p className="text-2xl font-bold">{systemState.users}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className={`text-lg font-bold ${systemState.settings.maintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
                {systemState.settings.maintenanceMode ? 'ON' : 'OFF'}
              </p>
            </div>
            <Settings className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Simulate System Changes</h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => simulateSystemChange('maintenance')}>
            Toggle Maintenance Mode
          </Button>
          <Button onClick={() => simulateSystemChange('orders')}>
            Process Orders
          </Button>
          <Button onClick={() => simulateSystemChange('products')}>
            Update Inventory
          </Button>
          <Button onClick={() => simulateSystemChange('users')}>
            Add Users
          </Button>
          <Button onClick={() => simulateSystemChange('settings')}>
            Update Settings
          </Button>
        </div>
      </Card>

      {/* System Settings Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current System Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Maintenance Mode</p>
            <p className={`font-medium ${systemState.settings.maintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
              {systemState.settings.maintenanceMode ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Max Orders/Day</p>
            <p className="font-medium">{systemState.settings.maxOrdersPerDay}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Auto Backup</p>
            <p className={`font-medium ${systemState.settings.autoBackup ? 'text-green-600' : 'text-red-600'}`}>
              {systemState.settings.autoBackup ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      </Card>

      {/* Rollback History */}
      <RollbackHistory
        entityType="system"
        entityId="main"
        onRollback={handleSystemRollback}
      />
    </div>
  );
};
