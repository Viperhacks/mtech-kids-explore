
import React, { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import StudentDashboard from '@/services/StudentDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Update document title based on active tab for admin users
 useEffect(() => {
  if (!user) {
    document.title = 'MTech Kidz Explore'; 
    return;
  }

  switch (user.role) {
    case 'ADMIN': {
      const activeTab = searchParams.get('tab') || 'users';
      const tabTitles = {
        users: 'User Management',
        teachers: 'Teacher Management',
        classes: 'Class Management',
        content: 'Content Management'
      };
      document.title = `Admin Dashboard - ${tabTitles[activeTab as keyof typeof tabTitles] || 'Dashboard'} | MTech Kidz Explore`;
      break;
    }
    case 'TEACHER':
      document.title = 'Teacher Dashboard | MTech Kidz Explore';
      break;
    case 'STUDENT':
      document.title = 'Student Dashboard | MTech Kidz Explore';
      break;
    default:
      document.title = 'MTech Kidz Explore';
  }
}, [user, searchParams]);

  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-mtech-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace state={{ showLogin: true }} />;
  }
  
  // Special case for parent users (who have parentOf property)
  const isParent = user.parentOf && user.parentOf.length > 0 && user.role === 'PARENT';
  
  // Render the appropriate dashboard based on user role
  if (isParent) {
    return <StudentDashboard isParent={true} />;
  }
  
  switch (user.role) {
    case 'STUDENT':
      return <StudentDashboard />;
    case 'TEACHER':
      return <TeacherDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <StudentDashboard />;
  }
};

export default Dashboard;
