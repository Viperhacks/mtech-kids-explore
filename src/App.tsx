
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Revision from "./pages/Revision";
import Teachers from "./pages/Teachers";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import Tutorials from "./pages/Tutorials";
import Exercises from "./pages/Exercises";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";
import GradeResources from "./pages/GradeResources";
import SubjectResources from "./pages/SubjectResources";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/teachers" element={<ProtectedRoute allowedRoles={["teacher", "admin"]} element={<Teachers />} />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/about" element={<About />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/grade/:gradeId" element={<ProtectedRoute element={<GradeResources />} />} />
            <Route path="/grade/:gradeId/subject/:subjectId" element={<ProtectedRoute element={<SubjectResources />} />} />
            {/* Catch-all route for any undefined routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
