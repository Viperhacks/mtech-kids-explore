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


import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Revision from "./pages/Revision";
import Teachers from "./pages/Teachers";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import Tutorials from "./pages/Tutorials";
import Exercises from "./components/Exercises";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import GradeResources from "./pages/GradeResources";
import SubjectResources from "./pages/SubjectResources";
import Dashboard from "./pages/Dashboard";
import { isElectron } from "./lib/Electron";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ScrollToTop from "./components/SrollToTop";
import TitleReset from "./components/TitleReset";
import { CompletionProvider } from "./context/CompletionContext";

// 🧠 Google OAuth Client ID (replace with yours if needed)
const googleClientId =
  "102147016941-lcucaktk0sioga2o5irssqcuedih5l0p.apps.googleusercontent.com";

const Router =
  window.location.protocol === "file:" ? HashRouter : BrowserRouter;

// 🧠 React Query setup
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CompletionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />

              <ScrollToTop />
              <TitleReset />
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/revision" element={<Revision />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/contacts" element={<Contacts />} />
                  {/*<Route path="/about" element={<About />} />*}
                {/*<Route path="/tutorials" element={<Tutorials />} />*/}
                  {/*<Route path="/exercises" element={<Exercises />} />*/}
                  <Route path="/privacy" element={<Privacy />} />
                  {/*<Route path="/terms" element={<Terms />} />*/}
                  <Route path="/faq" element={<FAQ />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute
                        allowedRoles={["STUDENT", "TEACHER", "ADMIN", "PARENT"]}
                        element={<Profile />}
                      />
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute
                        allowedRoles={["STUDENT", "TEACHER", "ADMIN", "PARENT"]}
                        element={<Dashboard />}
                      />
                    }
                  />
                  <Route
                    path="/grade/:gradeId"
                    element={
                      <ProtectedRoute
                        allowedRoles={["STUDENT", "TEACHER", "ADMIN", "PARENT"]}
                        element={<GradeResources />}
                      />
                    }
                  />
                  <Route
                    path="/grade/:gradeId/subject/:subjectId"
                    element={
                      <ProtectedRoute
                        allowedRoles={["STUDENT", "TEACHER", "ADMIN", "PARENT"]}
                        element={<SubjectResources />}
                      />
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </TooltipProvider>
          </CompletionProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
