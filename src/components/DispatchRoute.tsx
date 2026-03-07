import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission, PERMISSIONS } from '../utils/rbac';

interface DispatchRouteProps {
  children: React.ReactNode;
}

export default function DispatchRoute({ children }: DispatchRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasDispatchAccess = 
    hasPermission(user, PERMISSIONS.DISPATCH_VIEW) ||
    hasPermission(user, PERMISSIONS.DISPATCH_MANAGE);

  if (!hasDispatchAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
