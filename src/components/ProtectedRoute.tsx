import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission, canAccessModule } from '../utils/rbac';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  module?: 'hub' | 'store';
}

export function ProtectedRoute({ children, permission, module }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(user, permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (module && !canAccessModule(user, module)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
