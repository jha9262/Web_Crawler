import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { startCrawl } from '../api/client';

function StartCrawl() {
  const [url, setUrl] = useState('https://example.com');
  const [depth, setDepth] = useState(3);
  const [domainOnly, setDomainOnly] = useState(true);
  const [speed, setSpeed] = useState('balanced');
  const [metadata, setMetadata] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  // check if logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      console.warn('Not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      console.log('Starting crawl with:', { url, depth, domainOnly, speed, metadata });
      const result = await startCrawl({
        url,
        depth,
        domainOnly,
        speed,
        metadata
      });
      console.log('Crawl started:', result);
      
      // go to live monitor page
      if (result?.jobId) {
        navigate(`/live?jobId=${encodeURIComponent(result.jobId)}`);
      } else {
        navigate('/live');
      }
    } catch (err) {
      console.error('Error starting crawl:', err);
      // show better error message
      let errorMsg = err.message || 'Failed to start crawl.';
      if (errorMsg.includes('Cannot connect') || errorMsg.includes('Failed to fetch')) {
        errorMsg = 'Cannot connect to backend. Make sure backend is running on http://localhost:8080';
      } else if (errorMsg.includes('401') || errorMsg.includes('403')) {
        errorMsg = 'Authentication failed. Please login again.';
        // redirect to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    setUrl('');
    setDepth(3);
    setDomainOnly(true);
    setSpeed('balanced');
    setMetadata(true);
  };

  return (
    <motion.section
      className="glass-panel"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 style={{ marginTop: 0, marginBottom: '0.75rem' }}>
        Configure New Crawl
      </h2>
      <p
        style={{
          marginTop: 0,
          marginBottom: '1.25rem',
          fontSize: '0.9rem',
          color: 'var(--color-text-muted)'
        }}
      >
        Define the starting URL, crawl depth, and constraints. This panel is
        designed as your command center for launching new jobs.
      </p>

      <div
        style={{
          background: 'rgba(255,255,255,0.45)',
          borderRadius: 20,
          backdropFilter: 'blur(8px)',
          padding: '1.4rem 1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
          border: '1px solid rgba(148,163,184,0.35)'
        }}
      >
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div>
              <div className="field-label">Start URL</div>
              <input
                className="field-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-domain.com"
                required
              />
              {url && (() => {
                try {
                  const parsed = new URL(url);
                  const hostname = parsed.hostname || '';
                  const firstLetter = hostname[0]?.toUpperCase() || 'W';
                  return (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '0.45rem',
                    padding: '0.4rem 0.55rem',
                    borderRadius: '0.75rem',
                    border: '1px dashed rgba(148,163,184,0.7)',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(249,250,251,0.9)'
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background:
                        'linear-gradient(135deg,#4f46e5,#9333ea)',
                      color: 'white',
                      fontSize: '0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                        {firstLetter}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>
                          {hostname}
                    </div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--color-text-muted)'
                      }}
                    >
                      Title: Homepage (preview once metadata is wired)
                    </div>
                  </div>
                </motion.div>
                  );
                } catch {
                  return null;
                }
              })()}
            </div>

            <div>
              <div className="field-label">
                Max Depth &nbsp;
                <span style={{ color: 'var(--color-text-muted)' }}>
                  ({depth})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                style={{ width: '100%' }}
              />

              <div className="field-label" style={{ marginTop: '0.7rem' }}>
                Crawl Speed
              </div>
              <select
                className="field-select"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
              >
                <option value="safe">Safe (low concurrency)</option>
                <option value="balanced">Balanced</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            <div>
              <div className="field-label">Constraints</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  type="button"
                  className={`switch ${domainOnly ? 'switch-on' : ''}`}
                  onClick={() => setDomainOnly((v) => !v)}
                >
                  <div className="switch-track">
                    <div className="switch-thumb" />
                  </div>
                  <span>Restrict to starting domain</span>
                </button>

                <button
                  type="button"
                  className={`switch ${metadata ? 'switch-on' : ''}`}
                  onClick={() => setMetadata((v) => !v)}
                >
                  <div className="switch-track">
                    <div className="switch-thumb" />
                  </div>
                  <span>Extract metadata (title, description, OG tags)</span>
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)'
              }}
            >
              When connected to your backend, this form will trigger a crawl job
              and redirect you to the Live Monitor page.
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                type="button"
                className="neo-button ghost"
                onClick={onReset}
              >
                Reset
              </button>
              <button type="submit" className="neo-button primary" disabled={submitting}>
                {submitting ? 'Starting…' : 'Start Crawl'}
              </button>
            </div>
          </div>
          {error && (
            <div
              style={{
                marginTop: '0.75rem',
                fontSize: '0.8rem',
                color: 'var(--color-error)'
              }}
            >
              {error}
            </div>
          )}
        </form>
      </div>
    </motion.section>
  );
}

export default StartCrawl;


