import React from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StartCrawl from './pages/StartCrawl';
import LiveMonitor from './pages/LiveMonitor';
import GraphView from './pages/GraphView';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Signup from './pages/Signup';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = React.useContext(AuthContext);

  const routeMeta = {
    '/': {
      title: 'Dashboard',
      subtitle: 'AI-powered overview of your latest crawl activity.'
    },
    '/start': {
      title: 'Start Crawl',
      subtitle: 'Configure and launch a new crawling session.'
    },
    '/live': {
      title: 'Live Monitor',
      subtitle: 'Watch the crawler progress in real-time.'
    },
    '/graph': {
      title: 'Graph View',
      subtitle: 'Explore your site as a link graph.'
    },
    '/analytics': {
      title: 'Analytics',
      subtitle: 'Deep-dive into crawl metrics and distributions.'
    }
  };

  const meta = routeMeta[location.pathname] ?? routeMeta['/'];
  
  // Don't show sidebar and main layout on login/signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }
  
  return (
    <div className="app-root">
      <Sidebar />
      <main className="main-layout">
        <header className="top-bar">
          <div className="top-bar-title">
            <h1>{meta.title}</h1>
            <span>{meta.subtitle}</span>
          </div>
          <div className="top-bar-actions">
            {username && (
              <span style={{ marginRight: '15px', color: '#666', fontSize: '14px' }}>
                Hi, {username}
              </span>
            )}
            <button
              className="neo-button ghost"
              type="button"
              onClick={() => navigate('/analytics')}
            >
              <span>View Analytics</span>
            </button>
            <button
              className="neo-button primary"
              type="button"
              onClick={() => navigate('/start')}
            >
              <span>Start Crawl</span>
            </button>
            {isAuthenticated && (
              <button
                className="neo-button ghost"
                type="button"
                onClick={logout}
                style={{ marginLeft: '10px', fontSize: '14px' }}
              >
                Logout
              </button>
            )}
          </div>
        </header>

        <section className="content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/start"
                  element={
                    <ProtectedRoute>
                      <StartCrawl />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/live"
                  element={
                    <ProtectedRoute>
                      <LiveMonitor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/graph"
                  element={
                    <ProtectedRoute>
                      <GraphView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

// Redirect root to login if not authenticated
export function RootRedirect() {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Navigate to="/" replace />;
}

export default App;





