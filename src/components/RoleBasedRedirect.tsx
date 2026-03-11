import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RoleBasedRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  switch (user.role) {
    case 'hub_procurement':
      return <Navigate to="/hub/procurement/purchases" replace />;
    case 'store_procurement':
      return <Navigate to="/store/procurement/purchases" replace />;
    case 'hub_cutting_cleaning':
      return <Navigate to="/hub/cutting/management" replace />;
    case 'store_cutting_cleaning':
      return <Navigate to="/store/cutting/management" replace />;
    case 'hub_packing':
      return <Navigate to="/hub/packing/management" replace />;
    case 'store_packing':
      return <Navigate to="/store/packing/management" replace />;
    case 'hub_dispatch':
      return <Navigate to="/hub/dispatch/management" replace />;
    case 'store_dispatch':
      return <Navigate to="/store/dispatch/management" replace />;
    case 'hub_delivery':
      return <Navigate to="/hub/delivery/agent" replace />;
    case 'store_delivery':
      return <Navigate to="/store/delivery/agent" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
}
