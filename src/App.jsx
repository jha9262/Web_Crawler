import React, { Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StartCrawl from './pages/StartCrawl';
import LiveMonitor from './pages/LiveMonitor';
import GraphView from './pages/GraphView';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <span className="loading-text">Loading…</span>
    </div>
  );
}

// ─── Protected Route ──────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// ─── Route metadata ───────────────────────────────────────────────────────────
const ROUTE_META = {
  '/':          { title: 'Dashboard',    subtitle: 'AI-powered overview of your latest crawl activity.' },
  '/start':     { title: 'Start Crawl',  subtitle: 'Configure and launch a new crawling session.' },
  '/live':      { title: 'Live Monitor', subtitle: 'Watch the crawler progress in real-time.' },
  '/graph':     { title: 'Graph View',   subtitle: 'Explore your site as a link graph.' },
  '/analytics': { title: 'Analytics',   subtitle: 'Deep-dive into crawl metrics and distributions.' },
};

// ─── App Shell ────────────────────────────────────────────────────────────────
function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = React.useContext(AuthContext);

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  const meta = ROUTE_META[location.pathname] ?? ROUTE_META['/'];

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
              <span className="top-bar-user">
                Hi, {username}
              </span>
            )}
            <button className="neo-button ghost" type="button" onClick={() => navigate('/analytics')}>
              <span>Analytics</span>
            </button>
            <button className="neo-button primary" type="button" onClick={() => navigate('/start')}>
              <span>Start Crawl</span>
            </button>
            {isAuthenticated && (
              <button className="neo-button ghost" type="button" onClick={logout}>
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
              <ErrorBoundary>
                <Suspense fallback={<LoadingScreen />}>
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/start" element={<ProtectedRoute><StartCrawl /></ProtectedRoute>} />
                    <Route path="/live" element={<ProtectedRoute><LiveMonitor /></ProtectedRoute>} />
                    <Route path="/graph" element={<ProtectedRoute><GraphView /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
