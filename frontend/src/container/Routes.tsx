import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Home from "@/pages/Home";
import DriverDashboard from "@/pages/DriverDashboard";
import LoginPage from "@/pages/Login";
import SignUpPage from "@/pages/Signup";
import AdminDashboard from "@/pages/Admin";
import Home2 from "@/pages/Home2";
import Parent from "@/pages/parent/Parent";
import Tracking from "@/pages/parent/Tracking";
import School from "@/pages/School/School";
import DriverView from "@/pages/Views/DriverView";

// Define allowed roles type
type AllowedRoles = 'admin' | 'driver' | 'parent' | 'school' | 'user';

// Protected Route Component
function ProtectedRoute({ 
  children, 
  roles 
}: { 
  children: JSX.Element, 
  roles?: AllowedRoles[] 
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user and role exist and are allowed
  if (roles && user?.role && !roles.includes(user.role as AllowedRoles)) {
    // Get default route based on user role
    const defaultRoute = getDefaultRoute(user.role as AllowedRoles);
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
}

// Helper function to get default route
function getDefaultRoute(role: AllowedRoles): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'driver':
      return '/driver';
    case 'parent':
      return '/parent';
    case 'school':
      return '/school';
    default:
      return '/';
  }
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home2 />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/home2" element={<Home />} />

      {/* Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver"
        element={
          <ProtectedRoute roles={['driver','admin']}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/parent"
        element={
          <ProtectedRoute roles={['parent','admin']}>
            <Parent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tracking"
        element={
          <ProtectedRoute roles={['parent','admin']}>
            <Tracking />
          </ProtectedRoute>
        }
      />

      <Route
        path="/school"
        element={
          <ProtectedRoute roles={['school','admin']}>
            <School />
          </ProtectedRoute>
        }
      />

      {/* Testing Route */}
      <Route
        path="/DriverView"
        element={
          <ProtectedRoute roles={['admin', 'driver']}>
            <DriverView />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/?badRoute=1" replace />} />
    </Routes>
  );
}