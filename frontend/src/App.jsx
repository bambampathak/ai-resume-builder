import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Layout from "./components/layout/Layout.jsx";
import AuthScreen from "./pages/auth/AuthScreen.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeBuilder from "./pages/builder/ResumeBuilder.jsx";
import Templates from "./pages/Templates.jsx";
import AITools from "./pages/ai/AITools.jsx";
import AIChat from "./pages/ai/AIChat.jsx";
import ResumeHistory from "./pages/ResumeHistory.jsx";
import Landing from "./pages/Landing.jsx";
import Loader from "./components/ui/Loader.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><AuthScreen initialMode="login" /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><AuthScreen initialMode="signup" /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/builder"
        element={
          <ProtectedRoute>
            <Layout><ResumeBuilder /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/builder/:id"
        element={
          <ProtectedRoute>
            <Layout><ResumeBuilder /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <Layout><Templates /></Layout>
        }
      />
      <Route
        path="/ai-tools"
        element={
          <ProtectedRoute>
            <Layout><AITools /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-chat"
        element={
          <ProtectedRoute>
            <Layout><AIChat /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history/:id"
        element={
          <ProtectedRoute>
            <Layout><ResumeHistory /></Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
