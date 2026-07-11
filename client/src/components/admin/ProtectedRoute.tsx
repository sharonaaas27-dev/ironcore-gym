import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import LoadingScreen from '@components/ui/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'trainer' | 'admin')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={
      user.role === 'admin' ? '/admin' :
      user.role === 'trainer' ? '/trainer/dashboard' :
      '/dashboard'
    } replace />;
  }

  return <>{children}</>;
}
