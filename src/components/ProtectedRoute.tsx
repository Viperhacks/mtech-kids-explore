
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: ('student' | 'teacher' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element,
  allowedRoles = ['student', 'teacher', 'admin']
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-mtech-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ showLogin: true }} />;
  }
  
  // Check role-based permissions
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{element}</>;
};

export default ProtectedRoute;
