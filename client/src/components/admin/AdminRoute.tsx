import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import LoadingScreen from '@components/ui/LoadingScreen';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    if (user.role === 'trainer') return <Navigate to="/trainer/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
