import { useAuth } from '../../context/AuthContext';
import { getRoleDefinition } from '../../utils/rbac';
import { Shield, Package, Box, Truck, Users, MapPin, Phone, Mail } from 'lucide-react';

const iconMap = {
  Shield,
  Package,
  Box,
  Truck,
  Users,
};

export function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  const roleDefinition = getRoleDefinition(user.role);
  const IconComponent = roleDefinition ? iconMap[roleDefinition.icon as keyof typeof iconMap] || Users : Users;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-white">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          
          {/* Role Badge */}
          {roleDefinition && (
            <div className="flex items-center gap-2 mt-2">
              <div className={`h-8 w-8 rounded-lg ${roleDefinition.color} flex items-center justify-center`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{roleDefinition.displayName}</p>
                <p className="text-sm text-gray-600">{roleDefinition.description}</p>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{user.phone}</span>
            </div>
            {(user.hubId || user.storeId) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {user.loginType === 'hub' ? `Hub: ${user.hubId}` : `Store: ${user.storeId}`}
                </span>
              </div>
            )}
          </div>

          {/* Login Type Badge */}
          <div className="mt-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user.loginType === 'super_admin' 
                ? 'bg-purple-100 text-purple-800'
                : user.loginType === 'hub'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {user.loginType === 'super_admin' ? 'Super Admin' : 
               user.loginType === 'hub' ? 'Hub Access' : 'Store Access'}
            </span>
          </div>
        </div>
      </div>

      {/* Permissions Preview */}
      {roleDefinition && roleDefinition.permissions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Key Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {roleDefinition.permissions.slice(0, 4).map((permission) => (
              <span
                key={permission}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
              >
                {permission.replace(/_/g, ' ').toLowerCase()}
              </span>
            ))}
            {roleDefinition.permissions.length > 4 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                +{roleDefinition.permissions.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}