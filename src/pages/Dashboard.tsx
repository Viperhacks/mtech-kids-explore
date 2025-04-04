
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace state={{ showLogin: true }} />;
  }
  
  // Render the appropriate dashboard based on user role
  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <StudentDashboard />;
  }
};

export default Dashboard;
