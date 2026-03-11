import { useState } from 'react';
import { Card, Button } from '../ui';
import { ProductRollbackDemo } from '../examples/rollback/ProductRollbackDemo';
import { SystemRollbackDemo } from '../examples/rollback/SystemRollbackDemo';
import { RollbackHistory } from './RollbackHistory';
import { RotateCcw, Package, Settings, History, Shield, Clock, Database, AlertCircle, CheckCircle } from 'lucide-react';

export const RollbackDashboard = () => {
  const [activeTab, setActiveTab] = useState('product');

  const tabs = [
    { id: 'product', label: 'Product Management', icon: Package },
    { id: 'system', label: 'System Management', icon: Settings },
    { id: 'history', label: 'Global History', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center">
              <RotateCcw className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Rollback & Data Recovery</h1>
              <p className="text-purple-100 mt-1">Restore previous states and recover data with confidence</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Protected System</span>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Snapshots</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">247</p>
              <p className="text-xs text-gray-600 mt-1">Across all entities</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Successful Restores</p>
              <p className="text-3xl font-bold text-green-600 mt-2">98.5%</p>
              <p className="text-xs text-gray-600 mt-1">Recovery success rate</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Rollback</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">2h</p>
              <p className="text-xs text-gray-600 mt-1">2 hours ago</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Retention Period</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">30d</p>
              <p className="text-xs text-gray-600 mt-1">Auto-cleanup enabled</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card className="p-1">
        <nav className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </Card>

      {/* Tab Content */}
      {activeTab === 'product' && <ProductRollbackDemo />}
      {activeTab === 'system' && <SystemRollbackDemo />}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <Card className="p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Global Rollback History</h2>
                <p className="text-gray-600 mt-1">
                  View all rollback entries across the entire system. This includes all entity types and operations.
                </p>
              </div>
              <Button variant="secondary" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>
            <RollbackHistory />
          </Card>
        </div>
      )}

      {/* Enhanced Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-md">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-3">How Rollback Works</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Every data change is automatically tracked with timestamps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Previous states are stored securely for recovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Rollback operations create new history entries for audit trails</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Each rollback requires confirmation to prevent accidental data loss</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-3">Data Protection Features</h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Point-in-time recovery for critical data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Automatic backup before major operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>30-day retention with configurable policies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Role-based access control for restore operations</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
