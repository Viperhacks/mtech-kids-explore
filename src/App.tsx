
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './context/AuthContext';
import ScrollToTop from './components/SrollToTop';
import TitleReset from './components/TitleReset';
import { CompletionProvider } from '@/context/CompletionContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import './App.css';

// Import existing pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Revision from "./pages/Revision";
import Teachers from "./pages/Teachers";
import Contacts from "./pages/Contacts";
import Tutorials from "./pages/Tutorials";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import GradeResources from "./pages/GradeResources";
import SubjectResources from "./pages/SubjectResources";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// React Query setup
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
                  <Route path="/tutorials" element={<Tutorials />} />
                  <Route path="/privacy" element={<Privacy />} />
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
