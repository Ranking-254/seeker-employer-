import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// COMPONENTS
import { ProtectedRoute } from "./components/ProtectedRoute";

// PAGE IMPORTS
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SavedJobs from "./pages/SavedJobs";
import Profile from "./pages/Profile";
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJob from "./pages/PostJob";
import FindTalent from "./pages/FindTalent";
import Pricing from "./pages/pricing";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import ApplyJob from "./pages/ApplyJob";  

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* --- PROTECTED SEEKER ROUTES --- */}
            {/* Accessible by any logged-in user (default) */}
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/saved-jobs" 
              element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} 
            />
            <Route 
              path="/profile" 
              element={<ProtectedRoute><Profile /></ProtectedRoute>} 
            /> 
            <Route 
            path="/apply/:id" 
             element={<ProtectedRoute allowedRoles={['job_seeker']}>
                <ApplyJob />
                </ProtectedRoute>
                       } 
              />

            {/* --- PROTECTED EMPLOYER ROUTES --- */}
            {/* Only accessible if user.role === 'employer' */}
            <Route 
              path="/employers" 
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post-job" 
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <PostJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/talent" 
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <FindTalent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pricing" 
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <Pricing />
                </ProtectedRoute>
              } 
            />

            {/* --- 404 CATCH-ALL --- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;