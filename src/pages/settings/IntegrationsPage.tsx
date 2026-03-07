import { useState } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { Save, Link, CheckCircle, XCircle, Settings, Globe, Smartphone, Mail, CreditCard, MapPin, BarChart3 } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  connected: boolean;
  status: 'active' | 'inactive' | 'error';
  category: 'payment' | 'communication' | 'analytics' | 'location';
  config?: Record<string, any>;
}

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    // Payment
    { id: 'razorpay', name: 'Razorpay', description: 'Payment Gateway for secure online transactions', icon: CreditCard, connected: true, status: 'active', category: 'payment', config: { keyId: 'rzp_test_****' } },
    { id: 'gpay', name: 'Google Pay (GPay)', description: 'UPI payment integration', icon: CreditCard, connected: false, status: 'inactive', category: 'payment' },
    // Analytics & SEO
    { id: 'google-analytics-4', name: 'Google Analytics 4', description: 'Free baseline tracking', icon: BarChart3, connected: false, status: 'inactive', category: 'analytics' },
    { id: 'google-search-console', name: 'Google Search Console', description: 'Free SEO monitoring', icon: Globe, connected: false, status: 'inactive', category: 'analytics' },
    { id: 'google-merchant-center', name: 'Google Merchant Center', description: 'Free product feed', icon: Globe, connected: false, status: 'inactive', category: 'analytics' },
    { id: 'schema-markup', name: 'Schema Markup', description: 'Technical SEO', icon: Globe, connected: false, status: 'inactive', category: 'analytics' },
    { id: 'google-ads', name: 'Google Ads', description: 'Paid search + Shopping campaigns', icon: BarChart3, connected: false, status: 'inactive', category: 'analytics' },
    { id: 'meta-pixel', name: 'Meta Pixel + Meta Ads', description: 'Retargeting + social ads', icon: BarChart3, connected: false, status: 'inactive', category: 'analytics' },
    { id: 'google-tag-manager', name: 'Google Tag Manager', description: 'Event tracking setup', icon: BarChart3, connected: false, status: 'inactive', category: 'analytics' },
    { id: 'rank-math', name: 'Rank Math', description: 'On-page optimization', icon: Globe, connected: false, status: 'inactive', category: 'analytics' },
    { id: 'robots-txt', name: 'Robots.txt Configuration', description: 'Search engine crawling rules', icon: Globe, connected: false, status: 'inactive', category: 'analytics' },
    { id: 'bing-webmaster', name: 'Bing Webmaster', description: 'Bing search engine optimization and monitoring', icon: Globe, connected: false, status: 'inactive', category: 'analytics' },
    { id: 'microsoft-clarity', name: 'Microsoft Clarity', description: 'Free user behavior analytics and heatmaps', icon: BarChart3, connected: false, status: 'inactive', category: 'analytics' },
    // Location
    { id: 'google-maps', name: 'Google Maps', description: 'Location services and route optimization', icon: MapPin, connected: true, status: 'active', category: 'location', config: { apiKey: 'AIza****' } },
    // Communication
    { id: 'sms-gateway', name: 'SMS Gateway', description: 'OTP and notification SMS service', icon: Smartphone, connected: true, status: 'active', category: 'communication', config: { apiKey: 'sms_****' } },
    { id: 'whatsapp-business', name: 'WhatsApp Business', description: 'Order updates and customer communication', icon: Smartphone, connected: false, status: 'inactive', category: 'communication' },
    { id: 'sendgrid', name: 'SendGrid', description: 'Email delivery service for notifications', icon: Mail, connected: false, status: 'inactive', category: 'communication' }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id ? { ...integration, connected: !integration.connected, status: !integration.connected ? 'active' : 'inactive' } : integration
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => status === 'active' ? CheckCircle : XCircle;

  const categories = [
    { key: 'payment', label: 'Payment Gateways', color: 'bg-green-50 text-green-700' },
    { key: 'analytics', label: 'Analytics & SEO', color: 'bg-orange-50 text-orange-700' },
    { key: 'location', label: 'Location Services', color: 'bg-purple-50 text-purple-700' },
    { key: 'communication', label: 'Communication', color: 'bg-blue-50 text-blue-700' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-gray-600">Connect and configure third-party services</p>
        </div>
        <Button><Save className="mr-2 h-5 w-5" />Save All Changes</Button>
      </div>

      {categories.map(category => {
        const categoryIntegrations = integrations.filter(i => i.category === category.key);
        if (categoryIntegrations.length === 0) return null;

        return (
          <Card key={category.key}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`rounded-lg p-2 ${category.color.replace('text-', 'bg-').replace('-700', '-100')}`}>
                <Link className={`h-5 w-5 ${category.color}`} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{category.label}</h2>
                <p className="text-sm text-gray-600">{categoryIntegrations.length} services available</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {categoryIntegrations.map((integration) => {
                const StatusIcon = getStatusIcon(integration.status);
                return (
                  <div key={integration.id} className="border rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-100 p-2">
                          <integration.icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{integration.name}</h3>
                          <p className="text-sm text-gray-500">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(integration.status)}`} />
                        <span className={`text-sm ${getStatusColor(integration.status)}`}>
                          {integration.connected ? (integration.status === 'error' ? 'Error' : 'Connected') : 'Not Connected'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={integration.connected} onChange={() => toggleIntegration(integration.id)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                        <span className="text-sm text-gray-600">{integration.connected ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => setSelectedIntegration(integration)} disabled={!integration.connected}>
                        <Settings className="h-4 w-4 mr-1" />Configure
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}

      {selectedIntegration && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedIntegration(null)} />
            <Card className="relative w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <selectedIntegration.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedIntegration.name} Configuration</h2>
                    <p className="text-sm text-gray-600">{selectedIntegration.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedIntegration(null)}>×</Button>
              </div>

              <div className="space-y-4">
                <Input label="API Key / Configuration" placeholder="Enter configuration details" />
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="secondary" onClick={() => setSelectedIntegration(null)}>Cancel</Button>
                  <Button><Save className="h-5 w-5 mr-2" />Save Configuration</Button>
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
            <div className="text-2xl font-bold text-green-600">{integrations.filter(i => i.status === 'active').length}</div>
            <div className="text-sm text-green-600">Active</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{integrations.filter(i => i.status === 'error').length}</div>
            <div className="text-sm text-red-600">Errors</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{integrations.filter(i => i.status === 'inactive').length}</div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{integrations.length}</div>
            <div className="text-sm text-blue-600">Total</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
