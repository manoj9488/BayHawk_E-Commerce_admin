import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/rbac';

interface MultiRoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  requiredPermission?: string;
}

export function MultiRoleRoute({ children, allowedRoles, requiredPermission }: MultiRoleRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has any of the allowed roles
  const hasAllowedRole = user?.role && allowedRoles.includes(user.role);
  
  if (!hasAllowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // If specific permission is required, check it
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
