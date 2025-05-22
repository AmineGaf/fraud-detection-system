import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  requiredRole?: number;
}

export function PrivateRoute({ requiredRole }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role_id !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}