import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { signup } from '../api/auth';

// Password strength calculation
function getPasswordStrength(pwd) {
  if (!pwd) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)                    score++;
  if (/[A-Z]/.test(pwd))                  score++;
  if (/\d/.test(pwd))                     score++;
  if (/[^A-Za-z\d]/.test(pwd))           score++;
  if (pwd.length >= 12)                   score++;

  if (score <= 1) return { level: 1, label: 'Weak',   color: '#ef4444' };
  if (score <= 2) return { level: 2, label: 'Fair',   color: '#f59e0b' };
  if (score <= 3) return { level: 3, label: 'Good',   color: '#3b82f6' };
  return              { level: 4, label: 'Strong', color: '#10b981' };
}

function PasswordCriteria({ password }) {
  const criteria = [
    { label: 'At least 8 characters',     met: password.length >= 8 },
    { label: 'One uppercase letter (A–Z)', met: /[A-Z]/.test(password) },
    { label: 'One number (0–9)',           met: /\d/.test(password) },
    { label: 'One special character',      met: /[^A-Za-z\d]/.test(password) },
  ];
  return (
    <ul className="auth-criteria">
      {criteria.map((c, i) => (
        <li key={i} className={`auth-criteria-item ${c.met ? 'auth-criteria-item--met' : ''}`}>
          <span className="auth-criteria-dot" />
          {c.label}
        </li>
      ))}
    </ul>
  );
}

function Signup() {
  const [username, setUsername]             = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [agreed, setAgreed]                 = useState(false);
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('Please accept the terms of service to continue.');
      return;
    }

    setLoading(true);
    try {
      const response = await signup({ username, email, password });
      if (response.success) {
        authLogin(response.token, response.refreshToken, response.username);
        navigate('/');
      } else {
        setError(response.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* ── Left branding ── */}
      <div className="auth-branding">
        <div className="auth-branding-inner">
          <div className="auth-logo">
            <div className="auth-logo-mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            </div>
            <span className="auth-logo-name">WebCrawl</span>
          </div>

          <div className="auth-branding-content">
            <h2 className="auth-branding-title">
              Join the<br />platform.
            </h2>
            <p className="auth-branding-desc">
              Get started in seconds. Monitor unlimited crawls, visualize link graphs, and track analytics — all from one dashboard.
            </p>
          </div>

          <div className="auth-feature-list">
            {[
              { icon: '🚀', text: 'Start crawling in minutes' },
              { icon: '📈', text: 'Track progress with live metrics' },
              { icon: '🌐', text: 'Visualize the entire web graph' },
              { icon: '🛡️', text: 'Enterprise-grade security' },
            ].map((f, i) => (
              <div key={i} className="auth-feature-item">
                <span className="auth-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          <div className="auth-orbit">
            <div className="auth-orbit-ring auth-orbit-ring--outer" />
            <div className="auth-orbit-ring auth-orbit-ring--inner" />
            <div className="auth-orbit-dot auth-orbit-dot--1" />
            <div className="auth-orbit-dot auth-orbit-dot--2" />
            <div className="auth-orbit-dot auth-orbit-dot--3" />
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="auth-card-header">
            <h1 className="auth-card-title">Create your account</h1>
            <p className="auth-card-subtitle">Fill in the details below to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Username */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-username">Username</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="signup-username"
                  type="text"
                  className="auth-input"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  minLength={3}
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-email">Email</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="signup-email"
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input auth-input--with-right"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="auth-strength">
                  <div className="auth-strength-bar">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="auth-strength-segment"
                        style={{
                          background: i <= strength.level ? strength.color : 'rgba(148,163,184,0.2)',
                          transition: 'background 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                  <span className="auth-strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}

              {/* Criteria checklist */}
              {password && <PasswordCriteria password={password} />}
            </div>

            {/* Terms */}
            <label className="auth-checkbox">
              <input
                id="signup-terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="auth-checkbox-box" />
              <span className="auth-checkbox-label">
                I agree to the <a href="#" className="auth-link">Terms of Service</a> and <a href="#" className="auth-link">Privacy Policy</a>
              </span>
            </label>

            {/* Error */}
            {error && (
              <motion.div
                className="auth-error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`auth-submit${loading ? ' auth-submit--loading' : ''}`}
              disabled={loading || !agreed}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
