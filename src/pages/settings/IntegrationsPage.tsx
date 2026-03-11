import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { Save, Link, CheckCircle, XCircle, Settings, Globe, Smartphone, Mail, CreditCard, MapPin, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { settingsBackend, type IntegrationRecord } from '../../utils/settingsBackend';

const categoryMeta = {
  payment: { label: 'Payment Gateways', color: 'bg-green-50 text-green-700', icon: CreditCard },
  analytics: { label: 'Analytics & SEO', color: 'bg-orange-50 text-orange-700', icon: BarChart3 },
  location: { label: 'Location Services', color: 'bg-purple-50 text-purple-700', icon: MapPin },
  communication: { label: 'Communication', color: 'bg-blue-50 text-blue-700', icon: Mail },
} as const;

function getStatusColor(status: IntegrationRecord['status']) {
  switch (status) {
    case 'active':
      return 'text-green-600';
    case 'error':
      return 'text-red-600';
    default:
      return 'text-gray-500';
  }
}

function parseConfigValue(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    return { value: trimmed };
  }
}

export function IntegrationsPage() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<IntegrationRecord[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationRecord | null>(null);
  const [configDraft, setConfigDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadIntegrations();
  }, [user?.loginType, user?.hubId, user?.storeId]);

  const summary = useMemo(
    () => ({
      active: integrations.filter((item) => item.status === 'active').length,
      error: integrations.filter((item) => item.status === 'error').length,
      inactive: integrations.filter((item) => item.status === 'inactive').length,
      total: integrations.length,
    }),
    [integrations]
  );

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const payload = await settingsBackend.loadIntegrations(user);
      setIntegrations(payload.integrations);
    } catch (error) {
      console.error('Failed to load integrations:', error);
      setIntegrations([]);
    } finally {
      setLoading(false);
    }
  };

  const saveIntegrations = async (nextIntegrations = integrations) => {
    try {
      setSaving(true);
      const payload = await settingsBackend.saveIntegrations(
        {
          integrations: nextIntegrations,
        },
        user
      );
      setIntegrations(payload.integrations);
      alert('Integration settings saved successfully.');
    } catch (error) {
      console.error('Failed to save integrations:', error);
      alert('Failed to save integration settings.');
    } finally {
      setSaving(false);
    }
  };

  const toggleIntegration = (id: string) => {
    setIntegrations((current) =>
      current.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              connected: !integration.connected,
              status: !integration.connected ? 'active' : 'inactive',
            }
          : integration
      )
    );
  };

  const openConfigModal = (integration: IntegrationRecord) => {
    setSelectedIntegration(integration);
    setConfigDraft(
      integration.configValue ? JSON.stringify(integration.configValue, null, 2) : ''
    );
  };

  const saveConfig = () => {
    if (!selectedIntegration) {
      return;
    }

    const parsedConfig = parseConfigValue(configDraft);
    setIntegrations((current) =>
      current.map((integration) =>
        integration.id === selectedIntegration.id
          ? { ...integration, configValue: parsedConfig }
          : integration
      )
    );
    setSelectedIntegration(null);
    setConfigDraft('');
  };

  const groupedIntegrations = Object.entries(categoryMeta).map(([key, meta]) => ({
    key,
    meta,
    items: integrations.filter((integration) => integration.category === key),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-gray-600">Connect and configure third-party services</p>
        </div>
        <Button onClick={() => void saveIntegrations()} disabled={saving}>
          <Save className="mr-2 h-5 w-5" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      {loading ? (
        <Card>
          <p className="text-sm text-gray-500">Loading integration settings...</p>
        </Card>
      ) : (
        groupedIntegrations.map(({ key, meta, items }) => {
          if (items.length === 0) {
            return null;
          }

          const HeaderIcon = meta.icon;

          return (
            <Card key={key}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`rounded-lg p-2 ${meta.color.replace('text-', 'bg-').replace('-700', '-100')}`}>
                  <HeaderIcon className={`h-5 w-5 ${meta.color}`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{meta.label}</h2>
                  <p className="text-sm text-gray-600">{items.length} services available</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((integration) => {
                  const StatusIcon = integration.status === 'active' ? CheckCircle : XCircle;

                  return (
                    <div key={integration.id} className="border rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-gray-100 p-2">
                            <HeaderIcon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{integration.name}</h3>
                            <p className="text-sm text-gray-500">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${getStatusColor(integration.status)}`} />
                          <span className={`text-sm ${getStatusColor(integration.status)}`}>
                            {integration.connected
                              ? integration.status === 'error'
                                ? 'Error'
                                : 'Connected'
                              : 'Not Connected'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={integration.connected}
                              onChange={() => toggleIntegration(integration.id)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                          </label>
                          <span className="text-sm text-gray-600">
                            {integration.connected ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openConfigModal(integration)}
                          disabled={!integration.connected}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                      </div>

                      {integration.configPreview && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                          <div className="font-medium mb-1">Saved Config Preview</div>
                          <pre className="overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(integration.configPreview, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })
      )}

      {selectedIntegration && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedIntegration(null)} />
            <Card className="relative w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedIntegration.name} Configuration</h2>
                    <p className="text-sm text-gray-600">{selectedIntegration.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedIntegration(null)}>
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Config JSON / Value"
                  value={configDraft}
                  onChange={(event) => setConfigDraft(event.target.value)}
                  placeholder='{"apiKey":"..."}'
                />
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="secondary" onClick={() => setSelectedIntegration(null)}>
                    Cancel
                  </Button>
                  <Button onClick={saveConfig}>
                    <Save className="h-5 w-5 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-indigo-50 p-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Integration Status</h2>
            <p className="text-sm text-gray-600">Overview of all integrations</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{summary.active}</div>
            <div className="text-sm text-green-600">Active</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{summary.error}</div>
            <div className="text-sm text-red-600">Errors</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{summary.inactive}</div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
            <div className="text-sm text-blue-600">Total</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
