import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import TitleReset from './components/TitleReset';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GradeResources from './pages/GradeResources';
import SubjectResources from './pages/SubjectResources';
import StudentDashboard from './components/dashboards/StudentDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OTPVerification from './pages/OTPVerification';
import ResourceDetails from './pages/ResourceDetails';
import Classroom from './pages/Classroom';
import VideoThumbnail from './pages/VideoThumbnail';
import { CompletionProvider } from '@/context/CompletionContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CompletionProvider>
          <Router>
            <ScrollToTop />
            <TitleReset />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/grade/:gradeId" element={<GradeResources />} />
              <Route path="/grade/:gradeId/subject/:subjectId" element={<SubjectResources />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/resource/:resourceId" element={<ResourceDetails />} />
              <Route path="/classroom/:classroomId" element={<Classroom />} />
              <Route path="/video-thumbnail" element={<VideoThumbnail />} />
            </Routes>
          </Router>
        </CompletionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
