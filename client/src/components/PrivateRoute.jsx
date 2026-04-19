import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PrivateRoute({ children }) {
  const { isLoading, agent } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark text-text-muted">
        Loading...
      </div>
    );
  }

  if (!agent) return <Navigate to="/agent/login" replace />;
  return children;
}

export default PrivateRoute;
