import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/DashboardLayout';
import Login from './components/Login';
import Register from './components/Register';
import AuthCallback from './components/AuthCallback';
import Dashboard from './components/Dashboard';
import MissionList from './components/MissionList';
import MissionForm from './components/MissionForm';
import MissionDetail from './components/MissionDetail';
import Reports from './components/Reports';
import DroneFleet from './components/DroneFleet';
import Analytics from './components/Analytics';
import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuth(!!token);
    };

    checkAuth();

    // Listen for storage changes (when token is added/removed)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom auth events
    window.addEventListener('authStateChanged', checkAuth);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', checkAuth);
    };
  }, []);

  const isAuthenticated = () => {
    return isAuth;
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
          <Route path="/login" element={
            isAuthenticated() ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated() ? <Navigate to="/" replace /> : <Register />
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/missions" element={
            <ProtectedRoute>
              <DashboardLayout>
                <MissionList />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/missions/create" element={
            <ProtectedRoute>
              <DashboardLayout>
                <MissionForm />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/missions/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <MissionDetail />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/missions/:id/edit" element={
            <ProtectedRoute>
              <DashboardLayout>
                <MissionForm />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/drones" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DroneFleet />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/auth-callback" element={
            <AuthCallback />
          } />

          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={
            isAuthenticated() ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;