
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, needsVerification } = useAuth();
  
  if (!isAuthenticated && !needsVerification) {
    return <Navigate to="/login" replace />;
  }
  
  if (needsVerification) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
