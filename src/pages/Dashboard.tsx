
import React, { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Update document title based on active tab for all dashboard types
 useEffect(() => {
  if (!user) {
    document.title = 'Mtech Academy'; 
    return;
  }

  const activeTab = searchParams.get('tab');
  
  switch (user.role) {
    case 'ADMIN': {
      const tabTitles = {
        users: 'User Management',
        teachers: 'Teacher Management',
        classes: 'Class Management',
        content: 'Content Management'
      };
      const tabTitle = tabTitles[activeTab as keyof typeof tabTitles] || 'Dashboard';
      document.title = `Admin Dashboard - ${tabTitle} | Mtech Academy`;
      break;
    }
    case 'TEACHER': {
      const tabTitles = {
        students: 'My Students',
        resources: 'Resources',
        progress: 'Progress Tracking',
        assignments: 'Assignments'
      };
      const tabTitle = tabTitles[activeTab as keyof typeof tabTitles] || 'Dashboard';
      document.title = `Teacher Dashboard - ${tabTitle} | Mtech Academy`;
      break;
    }
    case 'STUDENT': {
      const tabTitles = {
        progress: 'My Progress',
        quizzes: 'Quizzes',
        'quiz-history': 'Quiz History',
        achievements: 'Achievements'
      };
      const tabTitle = tabTitles[activeTab as keyof typeof tabTitles] || 'My Progress';
      document.title = `Student Dashboard - ${tabTitle} | Mtech Academy`;
      break;
    }
    default:
      document.title = 'Mtech Academy';
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
