import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
<<<<<<< HEAD
=======
import { ThemeProvider } from './contexts/ThemeContext';
>>>>>>> 4a36452 (Build With AI 2 - fixed login, signup, env and dependencies)
import { Toaster } from 'sonner';
import './App.css';

import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import InterviewStart from './pages/InterviewStart';
import InterviewFlow from './pages/InterviewFlow';
import EvaluationPage from './pages/EvaluationPage';
import PracticePage from './pages/PracticePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserDetail from './pages/AdminUserDetail';
<<<<<<< HEAD
=======
import HowItWorksPage from './pages/HowItWorksPage';
import InterviewTypesPage from './pages/InterviewTypesPage';
import FeaturesPage from './pages/FeaturesPage';
import WhyUsPage from './pages/WhyUsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactSupportPage from './pages/ContactSupportPage';
import CareersPage from './pages/CareersPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

>>>>>>> 4a36452 (Build With AI 2 - fixed login, signup, env and dependencies)

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
<<<<<<< HEAD
=======
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/interview-types" element={<InterviewTypesPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/why-us" element={<WhyUsPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/contact" element={<ContactSupportPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
>>>>>>> 4a36452 (Build With AI 2 - fixed login, signup, env and dependencies)
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/interview/start"
        element={
          <ProtectedRoute>
            <InterviewStart />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/interview/:interviewId"
        element={
          <ProtectedRoute>
            <InterviewFlow />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/evaluation/:interviewId"
        element={
          <ProtectedRoute>
            <EvaluationPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <PracticePage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/users/:userId"
        element={
          <ProtectedRoute adminOnly>
            <AdminUserDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
<<<<<<< HEAD
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
=======
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
>>>>>>> 4a36452 (Build With AI 2 - fixed login, signup, env and dependencies)
  );
}

export default App;