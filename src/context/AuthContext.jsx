import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { refreshToken as apiRefreshToken } from '../api/auth';

export const AuthContext = createContext();

// Token stored in sessionStorage (safer than localStorage — cleared on tab close)
const TOKEN_KEY = 'token';
const REFRESH_KEY = 'refreshToken';
const USERNAME_KEY = 'username';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  // ── Token expiry helpers ──────────────────────────────────────────────────
  const getTokenExpiry = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // convert to ms
    } catch {
      return null;
    }
  };

  const scheduleRefresh = useCallback((token) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    const msUntilRefresh = expiry - Date.now() - 5 * 60 * 1000; // 5 min before expiry
    if (msUntilRefresh <= 0) return;

    refreshTimerRef.current = setTimeout(async () => {
      const stored = sessionStorage.getItem(REFRESH_KEY);
      if (!stored) return;
      try {
        const response = await apiRefreshToken(stored);
        if (response.success) {
          sessionStorage.setItem(TOKEN_KEY, response.token);
          sessionStorage.setItem(REFRESH_KEY, response.refreshToken);
          scheduleRefresh(response.token);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }, msUntilRefresh);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Initialise from session ───────────────────────────────────────────────
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const storedUsername = sessionStorage.getItem(USERNAME_KEY);

    if (token && storedUsername) {
      const expiry = getTokenExpiry(token);
      if (expiry && expiry > Date.now()) {
        setIsAuthenticated(true);
        setUsername(storedUsername);
        scheduleRefresh(token);
      } else {
        // Expired — clear session
        sessionStorage.clear();
      }
    }
    setLoading(false);
  }, [scheduleRefresh]);

  // ── Listen for 401 events dispatched by API client ────────────────────────
  useEffect(() => {
    const handleExpired = () => logout();
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth actions ──────────────────────────────────────────────────────────
  const login = useCallback((token, refreshTkn, user) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(REFRESH_KEY, refreshTkn);
    sessionStorage.setItem(USERNAME_KEY, user);
    setIsAuthenticated(true);
    setUsername(user);
    scheduleRefresh(token);
  }, [scheduleRefresh]);

  const logout = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
