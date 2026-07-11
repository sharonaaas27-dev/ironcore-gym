import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import LoadingScreen from '@components/ui/LoadingScreen';

export default function TrainerRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user || (user.role !== 'trainer' && user.role !== 'admin')) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
