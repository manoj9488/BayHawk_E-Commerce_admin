import { Shield, Package, Box, Truck, Users } from 'lucide-react';
import type { RoleDefinition } from '../../types';

interface RoleCardProps {
  role: RoleDefinition;
  isSelected?: boolean;
  onClick?: () => void;
  showPermissions?: boolean;
}

const iconMap = {
  Shield,
  Package,
  Box,
  Truck,
  Users,
};

export function RoleCard({ role, isSelected = false, onClick, showPermissions = false }: RoleCardProps) {
  const IconComponent = iconMap[role.icon as keyof typeof iconMap] || Users;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-lg ${role.color} flex items-center justify-center flex-shrink-0`}>
          <IconComponent className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
            {role.displayName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{role.description}</p>
          
          {showPermissions && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Permissions:</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map((permission) => (
                  <span
                    key={permission}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                  >
                    {permission.replace(/_/g, ' ').toLowerCase()}
                  </span>
                ))}
                {role.permissions.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                    +{role.permissions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}