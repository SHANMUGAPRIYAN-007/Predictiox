import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import VoiceAssistant from './components/VoiceAssistant';
import { useMockData } from './hooks/useMockData';
import { useAuth } from './context/AuthContext';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{
      height: '100vh',
      background: 'var(--bg-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary-neon)'
    }}>Loading System...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { alerts } = useMockData();
  const [theme, setTheme] = useState('dark');
  const { user } = useAuth();
  const location = useLocation();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme === 'light' ? 'light-theme' : '';
  };

  // Check if current route is a standalone page (Login/Register)
  const isStandalone = ['/login', '/register'].includes(location.pathname);

  return (
    <div className={`app-container ${theme === 'light' ? 'light-theme' : ''}`}>
      {!isStandalone && user && (
        <Sidebar theme={theme} toggleTheme={toggleTheme} />
      )}

      {/* Main Content Area - Full width if standalone, else has sidebar margin handled by grid/flex */}
      <main className={!isStandalone ? "main-content" : ""} style={isStandalone ? { width: '100vw', height: '100vh' } : {}}>
        <Routes>
          <Route path="/login" element={<Login theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/register" element={<Register theme={theme} toggleTheme={toggleTheme} />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard theme={theme} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin', 'technician']}>
                <Analytics theme={theme} />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['technician']}>
                <Settings />
              </RoleRoute>
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      {/* Only show Voice Assistant if logged in */}
      {!isStandalone && user && <VoiceAssistant alerts={alerts} />}
    </div>
  );
};

export default App;
