import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button } from '../../components/ui';
import { 
  Globe, 
  Clock, 
  Truck, 
  CreditCard, 
  Bell, 
  Shield, 
  Cloud, 
  ArrowRight,
  Settings as SettingsIcon,
  CheckCircle,
  AlertTriangle,
  Play,
  Tag
} from 'lucide-react';

const settingsCategories = [
  {
    id: 'general',
    title: 'General Settings',
    description: 'Business information, logo, and basic configuration',
    icon: Globe,
    path: '/settings',
    hubPath: '/hub/settings',
    storePath: '/store/settings',
    status: 'complete',
    superAdminOnly: false
  },
  {
    id: 'delivery-slots',
    title: 'Delivery Slots',
    description: 'Configure delivery time slots and capacity',
    icon: Clock,
    path: '/settings/delivery-slots',
    hubPath: '/hub/settings/delivery-slots',
    storePath: '/store/settings/delivery-slots',
    status: 'complete',
    superAdminOnly: false
  },
  {
    id: 'shipping-charges',
    title: 'Shipping Charges',
    description: 'Set up delivery charges and shipping zones',
    icon: Truck,
    path: '/settings/shipping-charges',
    hubPath: '/hub/settings/shipping-charges',
    storePath: '/store/settings/shipping-charges',
    status: 'complete',
    superAdminOnly: false
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect third-party services and APIs',
    icon: CreditCard,
    path: '/settings/integrations',
    hubPath: '/hub/settings/integrations',
    storePath: '/store/settings/integrations',
    status: 'warning',
    superAdminOnly: false
  },
  {
    id: 'weather',
    title: 'Weather Customization',
    description: 'Weather-based delivery controls and alerts',
    icon: Cloud,
    path: '/settings/weather',
    hubPath: '/hub/settings/weather',
    storePath: '/store/settings/weather',
    status: 'complete',
    superAdminOnly: false
  },
  {
    id: 'notifications',
    title: 'Notification Customization',
    description: 'Configure notification templates and settings',
    icon: Bell,
    path: '/settings/notification',
    hubPath: '/hub/settings/notification',
    storePath: '/store/settings/notification',
    status: 'complete',
    superAdminOnly: false
  },
  {
    id: 'legal',
    title: 'Legal Documents',
    description: 'Manage privacy policy, terms, and compliance',
    icon: Shield,
    path: '/settings/legal',
    hubPath: '/hub/settings/legal',
    storePath: '/store/settings/legal',
    status: 'incomplete',
    superAdminOnly: false
  },
  {
    id: 'advertisement',
    title: 'Advertisement Management',
    description: 'Manage video ads for customer app (9:16 format)',
    icon: Play,
    path: '/settings/advertisement',
    hubPath: '/hub/settings/advertisement',
    storePath: '/store/settings/advertisement',
    status: 'complete',
    superAdminOnly: false
  },
  {
    id: 'offer-templates',
    title: 'Offer Templates',
    description: 'Manage carousel and promotional offer templates',
    icon: Tag,
    path: '/settings/offer-templates',
    hubPath: '/hub/settings/offer-templates',
    storePath: '/store/settings/offer-templates',
    status: 'complete',
    superAdminOnly: true
  }
];

export function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the current module based on the path
  const getCurrentModule = () => {
    if (location.pathname.startsWith('/hub/')) return 'hub';
    if (location.pathname.startsWith('/store/')) return 'store';
    return 'super_admin';
  };

  const currentModule = getCurrentModule();

  // Filter settings based on module
  const filteredSettings = settingsCategories.filter(setting => {
    if (setting.superAdminOnly && currentModule !== 'super_admin') {
      return false;
    }
    return true;
  });

  const handleSettingClick = (setting: typeof settingsCategories[0]) => {
    let targetPath = setting.path;
    
    if (currentModule === 'hub') {
      targetPath = setting.hubPath;
    } else if (currentModule === 'store') {
      targetPath = setting.storePath;
    }
    
    navigate(targetPath);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'incomplete': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'incomplete': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600">Configure your admin panel settings and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">
            {filteredSettings.filter(s => s.status === 'complete').length} of {filteredSettings.length} configured
          </span>
        </div>
      </div>

      {/* Settings Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSettings.map(setting => {
          const StatusIcon = getStatusIcon(setting.status);
          const statusColor = getStatusColor(setting.status);
          
          return (
            <Card
              key={setting.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-blue-300 group"
              onClick={() => handleSettingClick(setting)}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-50 p-3 group-hover:bg-blue-100 transition-colors">
                  <setting.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{setting.title}</h3>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-green-50 p-2">
            <SettingsIcon className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <p className="text-sm text-gray-600">Common settings tasks</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="secondary"
            className="h-auto p-4 flex-col items-start"
            onClick={() => handleSettingClick(settingsCategories[0])}
          >
            <Globe className="h-5 w-5 mb-2" />
            <span className="font-medium">Update Business Info</span>
            <span className="text-xs text-gray-500">Logo, contact details</span>
          </Button>

          <Button
            variant="secondary"
            className="h-auto p-4 flex-col items-start"
            onClick={() => handleSettingClick(settingsCategories[1])}
          >
            <Clock className="h-5 w-5 mb-2" />
            <span className="font-medium">Manage Delivery Slots</span>
            <span className="text-xs text-gray-500">Time slots, capacity</span>
          </Button>

          <Button
            variant="secondary"
            className="h-auto p-4 flex-col items-start"
            onClick={() => handleSettingClick(settingsCategories[3])}
          >
            <CreditCard className="h-5 w-5 mb-2" />
            <span className="font-medium">Setup Integrations</span>
            <span className="text-xs text-gray-500">Payment, SMS, Maps</span>
          </Button>

          <Button
            variant="secondary"
            className="h-auto p-4 flex-col items-start"
            onClick={() => handleSettingClick(settingsCategories[6])}
          >
            <Shield className="h-5 w-5 mb-2" />
            <span className="font-medium">Legal Documents</span>
            <span className="text-xs text-gray-500">Privacy, terms</span>
          </Button>
        </div>
      </Card>

      {/* Settings Status */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-purple-50 p-2">
            <CheckCircle className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Configuration Status</h2>
            <p className="text-sm text-gray-600">Overview of your settings completion</p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredSettings.map(setting => {
            const StatusIcon = getStatusIcon(setting.status);
            const statusColor = getStatusColor(setting.status);
            
            return (
              <div key={setting.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <setting.icon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">{setting.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                  <span className={`text-xs font-medium ${statusColor}`}>
                    {setting.status === 'complete' ? 'Configured' : 
                     setting.status === 'warning' ? 'Needs Attention' : 'Not Configured'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">
              {Math.round((filteredSettings.filter(s => s.status === 'complete').length / filteredSettings.length) * 100)}% Complete
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${(filteredSettings.filter(s => s.status === 'complete').length / filteredSettings.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
