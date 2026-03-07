import { useState } from 'react';
import { Card, Button, Input, Select } from '../../components/ui';
import { Save, Cloud, Sun, CloudRain, Thermometer, Wind, Eye, MapPin, Settings, AlertTriangle, BarChart3 } from 'lucide-react';

interface WeatherAlert {
  id: string;
  condition: string;
  threshold: number;
  action: string;
  isActive: boolean;
  message: string;
}

export function WeatherCustomizationPage() {
  const [weatherSettings, setWeatherSettings] = useState({
    enableWeatherAlerts: true,
    showWeatherOnDashboard: true,
    enableDeliveryRestrictions: true,
    enableCustomerNotifications: true,
    weatherProvider: 'openweather',
    updateInterval: 30,
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh'
  });

  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([
    {
      id: '1',
      condition: 'heavy_rain',
      threshold: 50,
      action: 'suspend_delivery',
      isActive: true,
      message: 'Delivery suspended due to heavy rainfall. We will resume once conditions improve.'
    },
    {
      id: '2',
      condition: 'high_temperature',
      threshold: 40,
      action: 'notify_customers',
      isActive: true,
      message: 'Due to extreme heat, delivery times may be extended to ensure product quality.'
    },
    {
      id: '3',
      condition: 'strong_wind',
      threshold: 60,
      action: 'restrict_zones',
      isActive: true,
      message: 'Delivery restricted in certain areas due to strong winds.'
    },
    {
      id: '4',
      condition: 'thunderstorm',
      threshold: 0,
      action: 'delay_delivery',
      isActive: true,
      message: 'Deliveries may be delayed due to thunderstorm conditions.'
    }
  ]);

  const [locations, setLocations] = useState([
    { id: '1', name: 'Chennai Central', lat: 13.0827, lng: 80.2707, isActive: true },
    { id: '2', name: 'Anna Nagar', lat: 13.0850, lng: 80.2101, isActive: true },
    { id: '3', name: 'T Nagar', lat: 13.0418, lng: 80.2341, isActive: true },
    { id: '4', name: 'Adyar', lat: 13.0067, lng: 80.2206, isActive: true }
  ]);

  const weatherConditions = [
    { value: 'heavy_rain', label: 'Heavy Rain', icon: CloudRain, unit: 'mm/hr' },
    { value: 'high_temperature', label: 'High Temperature', icon: Thermometer, unit: '°C' },
    { value: 'low_temperature', label: 'Low Temperature', icon: Thermometer, unit: '°C' },
    { value: 'strong_wind', label: 'Strong Wind', icon: Wind, unit: 'km/h' },
    { value: 'thunderstorm', label: 'Thunderstorm', icon: CloudRain, unit: 'intensity' },
    { value: 'fog', label: 'Dense Fog', icon: Cloud, unit: 'visibility km' }
  ];

  const actionTypes = [
    { value: 'suspend_delivery', label: 'Suspend All Deliveries' },
    { value: 'delay_delivery', label: 'Delay Deliveries' },
    { value: 'restrict_zones', label: 'Restrict Specific Zones' },
    { value: 'notify_customers', label: 'Notify Customers Only' },
    { value: 'alert_staff', label: 'Alert Staff Only' }
  ];

  const weatherProviders = [
    { value: 'openweather', label: 'OpenWeatherMap' },
    { value: 'weatherapi', label: 'WeatherAPI' },
    { value: 'accuweather', label: 'AccuWeather' },
    { value: 'darksky', label: 'Dark Sky (Apple)' }
  ];

  const mockWeatherData = {
    temperature: 32,
    humidity: 78,
    windSpeed: 15,
    condition: 'Partly Cloudy',
    rainfall: 0,
    visibility: 10,
    uvIndex: 7
  };

  const addNewAlert = () => {
    const newAlert: WeatherAlert = {
      id: Date.now().toString(),
      condition: 'heavy_rain',
      threshold: 25,
      action: 'notify_customers',
      isActive: false,
      message: 'Weather alert message'
    };
    setWeatherAlerts([...weatherAlerts, newAlert]);
  };

  const updateAlert = (id: string, updates: Partial<WeatherAlert>) => {
    setWeatherAlerts(weatherAlerts.map(alert => 
      alert.id === id ? { ...alert, ...updates } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setWeatherAlerts(weatherAlerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Weather Customization</h1>
          <p className="text-gray-600">Configure weather-based delivery controls and alerts</p>
        </div>
        <Button>
          <Save className="mr-2 h-5 w-5" />
          Save All Changes
        </Button>
      </div>

      {/* Current Weather Display */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-blue-50 p-2">
            <Sun className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Current Weather Conditions</h2>
            <p className="text-sm text-gray-600">Live weather data for your delivery areas</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Thermometer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{mockWeatherData.temperature}°C</div>
            <div className="text-sm text-blue-600">Temperature</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CloudRain className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{mockWeatherData.rainfall}mm</div>
            <div className="text-sm text-green-600">Rainfall</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Wind className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{mockWeatherData.windSpeed} km/h</div>
            <div className="text-sm text-purple-600">Wind Speed</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Eye className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{mockWeatherData.visibility} km</div>
            <div className="text-sm text-orange-600">Visibility</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Overall Condition: {mockWeatherData.condition}</p>
              <p className="text-sm text-gray-600">Humidity: {mockWeatherData.humidity}% • UV Index: {mockWeatherData.uvIndex}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated: 5 minutes ago</p>
              <Button variant="secondary" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Weather Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-green-50 p-2">
            <Settings className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Weather Settings</h2>
            <p className="text-sm text-gray-600">Configure weather monitoring preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Weather Data Provider"
              value={weatherSettings.weatherProvider}
              onChange={(e) => setWeatherSettings({
                ...weatherSettings,
                weatherProvider: e.target.value
              })}
              options={weatherProviders}
            />
            <Input
              label="Update Interval (minutes)"
              type="number"
              value={weatherSettings.updateInterval}
              onChange={(e) => setWeatherSettings({
                ...weatherSettings,
                updateInterval: parseInt(e.target.value)
              })}
              min="5"
              max="120"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Temperature Unit"
              value={weatherSettings.temperatureUnit}
              onChange={(e) => setWeatherSettings({
                ...weatherSettings,
                temperatureUnit: e.target.value
              })}
              options={[
                { value: 'celsius', label: 'Celsius (°C)' },
                { value: 'fahrenheit', label: 'Fahrenheit (°F)' }
              ]}
            />
            <Select
              label="Wind Speed Unit"
              value={weatherSettings.windSpeedUnit}
              onChange={(e) => setWeatherSettings({
                ...weatherSettings,
                windSpeedUnit: e.target.value
              })}
              options={[
                { value: 'kmh', label: 'km/h' },
                { value: 'mph', label: 'mph' },
                { value: 'ms', label: 'm/s' }
              ]}
            />
          </div>

          <div className="space-y-3">
            {[
              { key: 'enableWeatherAlerts', label: 'Enable Weather Alerts', desc: 'Receive alerts for severe weather conditions' },
              { key: 'showWeatherOnDashboard', label: 'Show Weather on Dashboard', desc: 'Display current weather information on main dashboard' },
              { key: 'enableDeliveryRestrictions', label: 'Enable Delivery Restrictions', desc: 'Automatically restrict deliveries based on weather conditions' },
              { key: 'enableCustomerNotifications', label: 'Customer Weather Notifications', desc: 'Notify customers about weather-related delivery changes' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{setting.label}</p>
                  <p className="text-xs text-gray-500">{setting.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weatherSettings[setting.key as keyof typeof weatherSettings] as boolean}
                    onChange={(e) => setWeatherSettings({
                      ...weatherSettings,
                      [setting.key]: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Weather Alerts Configuration */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Weather Alerts</h2>
              <p className="text-sm text-gray-600">Configure automatic actions for weather conditions</p>
            </div>
          </div>
          <Button variant="secondary" onClick={addNewAlert}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Add Alert
          </Button>
        </div>

        <div className="space-y-4">
          {weatherAlerts.map((alert) => {
            const condition = weatherConditions.find(c => c.value === alert.condition);
            const action = actionTypes.find(a => a.value === alert.action);
            const ConditionIcon = condition?.icon || AlertTriangle;

            return (
              <div key={alert.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={alert.isActive}
                      onChange={(e) => updateAlert(alert.id, { isActive: e.target.checked })}
                      className="rounded"
                    />
                    <ConditionIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <span className="font-medium">{condition?.label}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {alert.threshold} {condition?.unit}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {action?.label}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => deleteAlert(alert.id)}>
                      ×
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Select
                    label="Weather Condition"
                    value={alert.condition}
                    onChange={(e) => updateAlert(alert.id, { condition: e.target.value })}
                    options={weatherConditions.map(c => ({ value: c.value, label: c.label }))}
                  />
                  <Input
                    label={`Threshold (${condition?.unit})`}
                    type="number"
                    value={alert.threshold}
                    onChange={(e) => updateAlert(alert.id, { threshold: parseFloat(e.target.value) })}
                  />
                  <Select
                    label="Action"
                    value={alert.action}
                    onChange={(e) => updateAlert(alert.id, { action: e.target.value })}
                    options={actionTypes}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Message</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    value={alert.message}
                    onChange={(e) => updateAlert(alert.id, { message: e.target.value })}
                    placeholder="Message to display to customers when this alert is triggered"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Monitoring Locations */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-purple-50 p-2">
            <MapPin className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Monitoring Locations</h2>
            <p className="text-sm text-gray-600">Weather monitoring points for your delivery areas</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {locations.map((location) => (
            <div key={location.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={location.isActive}
                    onChange={(e) => {
                      setLocations(locations.map(loc => 
                        loc.id === location.id ? { ...loc, isActive: e.target.checked } : loc
                      ));
                    }}
                    className="rounded"
                  />
                  <span className="font-medium">{location.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  location.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {location.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <p>Lat: {location.lat}, Lng: {location.lng}</p>
                <p>Weather: {mockWeatherData.condition} • {mockWeatherData.temperature}°C</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Add New Location</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input placeholder="Location Name" />
            <Input placeholder="Latitude" type="number" step="any" />
            <Input placeholder="Longitude" type="number" step="any" />
          </div>
          <Button variant="secondary" size="sm" className="mt-3">
            Add Location
          </Button>
        </div>
      </Card>

      {/* Weather Impact Summary */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-orange-50 p-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Weather Impact Summary</h2>
            <p className="text-sm text-gray-600">Recent weather-related delivery impacts</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="text-sm text-red-600">Suspended Deliveries</div>
            <div className="text-xs text-gray-500">Last 7 days</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">28</div>
            <div className="text-sm text-yellow-600">Delayed Deliveries</div>
            <div className="text-xs text-gray-500">Last 7 days</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">156</div>
            <div className="text-sm text-blue-600">Customer Notifications</div>
            <div className="text-xs text-gray-500">Last 7 days</div>
          </div>
        </div>
      </Card>
    </div>
  );
}