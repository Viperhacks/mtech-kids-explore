
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: ('STUDENT' | 'TEACHER' | 'ADMIN' | 'PARENT')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element,
  allowedRoles = ['STUDENT', 'TEACHER', 'ADMIN', 'PARENT']
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-mtech-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Store the intended destination for restoration after login
    const returnTo = location.pathname + location.search + location.hash;
    return <Navigate to="/" replace state={{ 
      showLogin: true, 
      returnTo: returnTo !== '/' ? returnTo : undefined 
    }} />;
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{element}</>;
};

export default ProtectedRoute;
