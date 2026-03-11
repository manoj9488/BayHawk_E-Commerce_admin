import { useEffect, useState } from 'react';
import { Card, Button, Input, Select } from '../../components/ui';
import { Save, Cloud, Sun, CloudRain, Thermometer, Wind, Eye, MapPin, Settings, AlertTriangle, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  settingsBackend,
  type WeatherAlertRecord,
  type WeatherLocationRecord,
  type WeatherSettingsPayload,
} from '../../utils/settingsBackend';

const defaultWeatherSettings: WeatherSettingsPayload['weatherSettings'] = {
  enableWeatherAlerts: true,
  showWeatherOnDashboard: true,
  enableDeliveryRestrictions: true,
  enableCustomerNotifications: true,
  weatherProvider: 'openweather',
  updateInterval: 30,
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
};

const defaultCurrentWeather: WeatherSettingsPayload['currentWeather'] = {
  temperature: 32,
  humidity: 78,
  windSpeed: 15,
  condition: 'Partly Cloudy',
  rainfall: 0,
  visibility: 10,
  uvIndex: 7,
};

const weatherConditions = [
  { value: 'heavy_rain', label: 'Heavy Rain', icon: CloudRain, unit: 'mm/hr' },
  { value: 'high_temperature', label: 'High Temperature', icon: Thermometer, unit: '°C' },
  { value: 'low_temperature', label: 'Low Temperature', icon: Thermometer, unit: '°C' },
  { value: 'strong_wind', label: 'Strong Wind', icon: Wind, unit: 'km/h' },
  { value: 'thunderstorm', label: 'Thunderstorm', icon: CloudRain, unit: 'intensity' },
  { value: 'fog', label: 'Dense Fog', icon: Cloud, unit: 'visibility km' },
];

const actionTypes = [
  { value: 'suspend_delivery', label: 'Suspend All Deliveries' },
  { value: 'delay_delivery', label: 'Delay Deliveries' },
  { value: 'restrict_zones', label: 'Restrict Specific Zones' },
  { value: 'notify_customers', label: 'Notify Customers Only' },
  { value: 'alert_staff', label: 'Alert Staff Only' },
];

export function WeatherCustomizationPage() {
  const { user } = useAuth();
  const [weatherSettings, setWeatherSettings] = useState(defaultWeatherSettings);
  const [currentWeather, setCurrentWeather] = useState(defaultCurrentWeather);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlertRecord[]>([]);
  const [locations, setLocations] = useState<WeatherLocationRecord[]>([]);
  const [impactSummary, setImpactSummary] = useState({
    suspendedDeliveries: 0,
    delayedDeliveries: 0,
    customerNotifications: 0,
  });
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lng: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadSettings();
  }, [user?.loginType, user?.hubId, user?.storeId]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const payload = await settingsBackend.loadWeather(user);
      setWeatherSettings(payload.weatherSettings);
      setCurrentWeather(payload.currentWeather);
      setWeatherAlerts(payload.weatherAlerts);
      setLocations(payload.locations);
      setImpactSummary(payload.impactSummary);
    } catch (error) {
      console.error('Failed to load weather settings:', error);
      setWeatherSettings(defaultWeatherSettings);
      setCurrentWeather(defaultCurrentWeather);
      setWeatherAlerts([]);
      setLocations([]);
      setImpactSummary({
        suspendedDeliveries: 0,
        delayedDeliveries: 0,
        customerNotifications: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const payload = await settingsBackend.saveWeather(
        {
          weatherSettings,
          weatherAlerts,
          locations,
        },
        user
      );
      setWeatherSettings(payload.weatherSettings);
      setCurrentWeather(payload.currentWeather);
      setWeatherAlerts(payload.weatherAlerts);
      setLocations(payload.locations);
      setImpactSummary(payload.impactSummary);
      alert('Weather settings saved successfully.');
    } catch (error) {
      console.error('Failed to save weather settings:', error);
      alert('Failed to save weather settings.');
    } finally {
      setSaving(false);
    }
  };

  const addNewAlert = () => {
    setWeatherAlerts((current) => [
      ...current,
      {
        id: `draft-weather-alert-${Date.now()}`,
        condition: 'heavy_rain',
        threshold: 25,
        action: 'notify_customers',
        isActive: false,
        message: 'Weather alert message',
        thresholdUnit: 'mm/hr',
      },
    ]);
  };

  const updateAlert = (id: string, updates: Partial<WeatherAlertRecord>) => {
    setWeatherAlerts((current) =>
      current.map((alert) => (alert.id === id ? { ...alert, ...updates } : alert))
    );
  };

  const deleteAlert = (id: string) => {
    setWeatherAlerts((current) => current.filter((alert) => alert.id !== id));
  };

  const addLocation = () => {
    if (!newLocation.name || !newLocation.lat || !newLocation.lng) {
      return;
    }

    setLocations((current) => [
      ...current,
      {
        id: `draft-weather-location-${Date.now()}`,
        name: newLocation.name,
        lat: Number.parseFloat(newLocation.lat) || 0,
        lng: Number.parseFloat(newLocation.lng) || 0,
        isActive: true,
      },
    ]);
    setNewLocation({ name: '', lat: '', lng: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Weather Customization</h1>
          <p className="text-gray-600">Configure weather-based delivery controls and alerts</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="mr-2 h-5 w-5" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

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

        {loading ? (
          <p className="text-sm text-gray-500">Loading weather status...</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Thermometer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{currentWeather.temperature}°C</div>
                <div className="text-sm text-blue-600">Temperature</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CloudRain className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{currentWeather.rainfall}mm</div>
                <div className="text-sm text-green-600">Rainfall</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Wind className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{currentWeather.windSpeed} km/h</div>
                <div className="text-sm text-purple-600">Wind Speed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Eye className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{currentWeather.visibility} km</div>
                <div className="text-sm text-orange-600">Visibility</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Overall Condition: {currentWeather.condition}</p>
                  <p className="text-sm text-gray-600">
                    Humidity: {currentWeather.humidity}% • UV Index: {currentWeather.uvIndex}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Last updated:{' '}
                    {currentWeather.observedAt
                      ? new Date(currentWeather.observedAt).toLocaleString()
                      : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

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
              onChange={(event) =>
                setWeatherSettings({ ...weatherSettings, weatherProvider: event.target.value })
              }
              options={[
                { value: 'openweather', label: 'OpenWeatherMap' },
                { value: 'weatherapi', label: 'WeatherAPI' },
                { value: 'accuweather', label: 'AccuWeather' },
                { value: 'darksky', label: 'Dark Sky (Apple)' },
              ]}
            />
            <Input
              label="Update Interval (minutes)"
              type="number"
              value={weatherSettings.updateInterval}
              onChange={(event) =>
                setWeatherSettings({
                  ...weatherSettings,
                  updateInterval: Number.parseInt(event.target.value, 10) || 5,
                })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Temperature Unit"
              value={weatherSettings.temperatureUnit}
              onChange={(event) =>
                setWeatherSettings({ ...weatherSettings, temperatureUnit: event.target.value })
              }
              options={[
                { value: 'celsius', label: 'Celsius (°C)' },
                { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
              ]}
            />
            <Select
              label="Wind Speed Unit"
              value={weatherSettings.windSpeedUnit}
              onChange={(event) =>
                setWeatherSettings({ ...weatherSettings, windSpeedUnit: event.target.value })
              }
              options={[
                { value: 'kmh', label: 'km/h' },
                { value: 'mph', label: 'mph' },
                { value: 'ms', label: 'm/s' },
              ]}
            />
          </div>

          <div className="space-y-3">
            {[
              { key: 'enableWeatherAlerts', label: 'Enable Weather Alerts' },
              { key: 'showWeatherOnDashboard', label: 'Show Weather on Dashboard' },
              { key: 'enableDeliveryRestrictions', label: 'Enable Delivery Restrictions' },
              { key: 'enableCustomerNotifications', label: 'Customer Weather Notifications' },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 border rounded-lg">
                <p className="font-medium text-sm">{setting.label}</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weatherSettings[setting.key as keyof typeof weatherSettings] as boolean}
                    onChange={(event) =>
                      setWeatherSettings({
                        ...weatherSettings,
                        [setting.key]: event.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </Card>

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
            const condition = weatherConditions.find((item) => item.value === alert.condition);
            const action = actionTypes.find((item) => item.value === alert.action);
            const ConditionIcon = condition?.icon || AlertTriangle;

            return (
              <div key={alert.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={alert.isActive}
                      onChange={(event) => updateAlert(alert.id, { isActive: event.target.checked })}
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
                    onChange={(event) => {
                      const nextCondition = weatherConditions.find((item) => item.value === event.target.value);
                      updateAlert(alert.id, {
                        condition: event.target.value,
                        thresholdUnit: nextCondition?.unit,
                      });
                    }}
                    options={weatherConditions.map((item) => ({ value: item.value, label: item.label }))}
                  />
                  <Input
                    label={`Threshold (${condition?.unit})`}
                    type="number"
                    value={alert.threshold}
                    onChange={(event) =>
                      updateAlert(alert.id, { threshold: Number.parseFloat(event.target.value) || 0 })
                    }
                  />
                  <Select
                    label="Action"
                    value={alert.action}
                    onChange={(event) => updateAlert(alert.id, { action: event.target.value })}
                    options={actionTypes}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Message</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    value={alert.message}
                    onChange={(event) => updateAlert(alert.id, { message: event.target.value })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

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
                    onChange={(event) =>
                      setLocations((current) =>
                        current.map((item) =>
                          item.id === location.id ? { ...item, isActive: event.target.checked } : item
                        )
                      )
                    }
                    className="rounded"
                  />
                  <span className="font-medium">{location.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${location.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {location.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <p>
                  Lat: {location.lat}, Lng: {location.lng}
                </p>
                {location.weather && (
                  <p>
                    Weather: {location.weather.condition} • {location.weather.temperature}°C
                  </p>
                )}
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
            <Input
              placeholder="Location Name"
              value={newLocation.name}
              onChange={(event) => setNewLocation({ ...newLocation, name: event.target.value })}
            />
            <Input
              placeholder="Latitude"
              type="number"
              step="any"
              value={newLocation.lat}
              onChange={(event) => setNewLocation({ ...newLocation, lat: event.target.value })}
            />
            <Input
              placeholder="Longitude"
              type="number"
              step="any"
              value={newLocation.lng}
              onChange={(event) => setNewLocation({ ...newLocation, lng: event.target.value })}
            />
          </div>
          <Button variant="secondary" size="sm" className="mt-3" onClick={addLocation}>
            Add Location
          </Button>
        </div>
      </Card>

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
            <div className="text-2xl font-bold text-red-600">{impactSummary.suspendedDeliveries}</div>
            <div className="text-sm text-red-600">Suspended Deliveries</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{impactSummary.delayedDeliveries}</div>
            <div className="text-sm text-yellow-600">Delayed Deliveries</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{impactSummary.customerNotifications}</div>
            <div className="text-sm text-blue-600">Customer Notifications</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
