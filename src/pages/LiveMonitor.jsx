import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { fetchLiveStatus, fetchLogs } from '../api/client';

const demoLogs = [
  '[10:01:12] INIT     ┊ bootstrap crawler session   ┊ seed=https://example.com',
  '[10:01:14] QUEUE    ┊ enqueue sitemap discovery   ┊ /sitemap.xml',
  '[10:01:16] VISIT    ┊ GET 200  142ms              ┊ /',
  '[10:01:16] PARSE    ┊ discovered 24 internal URLs',
  '[10:01:18] VISIT    ┊ GET 200  181ms              ┊ /blog',
  '[10:01:20] VISIT    ┊ GET 404  63ms               ┊ /old-contact',
  '[10:01:20] ERROR    ┊ 404 Not Found               ┊ /old-contact',
  '[10:01:24] VISIT    ┊ GET 500  412ms              ┊ /api/legacy',
  '[10:01:24] ERROR    ┊ 500 Internal Server Error   ┊ /api/legacy',
  '[10:01:29] VISIT    ┊ GET 200  190ms              ┊ /pricing',
  '[10:01:34] VISIT    ┊ GET 200  164ms              ┊ /careers',
  '[10:01:40] QUEUE    ┊ depth limit check           ┊ depth=3'
];

function LiveMonitor() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') || undefined;

  const [stats, setStats] = useState({
    visited: 0,
    queued: 0,
    errors: 0,
    avgResponse: 0,
    progress: 0
  });
  const [logs, setLogs] = useState(demoLogs);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadOnce = async () => {
      try {
        const [statusData, logData] = await Promise.all([
          fetchLiveStatus(jobId),
          fetchLogs(jobId)
        ]);
        if (cancelled) return;
        setStats({
          visited: statusData.pagesVisited,
          queued: statusData.pagesQueued,
          errors: statusData.errors,
          avgResponse: statusData.avgResponseMs,
          progress: statusData.progress
        });
        if (Array.isArray(logData) && logData.length) {
          setLogs(logData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load live data.');
      }
    };

    void loadOnce();
    const timer = setInterval(loadOnce, 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [jobId]);

  const currentUrl = useMemo(() => {
    // Simple heuristic: last VISIT line in logs.
    const visit = [...logs]
      .reverse()
      .find((l) => l.includes('VISIT') || l.includes('GET '));
    if (!visit) return '—';
    const parts = visit.split('┊').map((p) => p.trim());
    return parts[parts.length - 1] || visit;
  }, [logs]);

  return (
    <section className="glass-panel">
      <div
        style={{
          marginBottom: '0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              marginBottom: 4
            }}
          >
            Live Crawl Session
          </div>
          <div
            style={{
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)'
            }}
          >
            This view is meant to be backed by your streaming logs and
            telemetry.
          </div>
        </div>
        <div style={{ minWidth: 200 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              marginBottom: 4
            }}
          >
            <span>Progress</span>
            <span>{stats.progress}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: 8,
              borderRadius: 999,
              background: 'rgba(209,213,219,0.7)',
              overflow: 'hidden'
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 0.6 }}
              style={{
                height: '100%',
                borderRadius: '999px',
                background:
                  'linear-gradient(90deg,#10b981,#4f46e5,#9333ea)'
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: '0.8rem',
          marginBottom: '0.75rem',
          color: 'var(--color-text-muted)'
        }}
      >
        Current URL:{' '}
        <span
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas',
            color: 'var(--color-primary)'
          }}
        >
          {currentUrl}
        </span>
        <span className="blink" style={{ marginLeft: 4 }}>
          |
        </span>
      </div>

      <div className="two-col">
        <div>
          <div className="terminal">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span
                  className="terminal-dot"
                  style={{ background: '#f97316' }}
                />
                <span
                  className="terminal-dot"
                  style={{ background: '#facc15' }}
                />
                <span
                  className="terminal-dot"
                  style={{ background: '#22c55e' }}
                />
              </div>
              <span>live-crawl.log</span>
            </div>
            {logs.map((line) => (
              <div key={line} className="terminal-log-line">
                {line}
              </div>
            ))}
            <div className="terminal-log-line">
              &gt; streaming logs
              <span className="blink">▌</span>
            </div>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-card-label">
              <span>Pages Visited</span>
            </div>
            <div className="stat-card-value">
              {stats.visited.toLocaleString()}
            </div>
            <div className="stat-card-footer">
              <span>Completed fetches</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">
              <span>Pages Queued</span>
            </div>
            <div className="stat-card-value">
              {stats.queued.toLocaleString()}
            </div>
            <div className="stat-card-footer">
              <span>Awaiting crawl</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">
              <span>Errors</span>
            </div>
            <div
              className="stat-card-value"
              style={{ color: 'var(--color-error)' }}
            >
              {stats.errors}
            </div>
            <div className="stat-card-footer">
              <span>4xx / 5xx responses</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">
              <span>Avg Response Time</span>
            </div>
            <div className="stat-card-value">
              {stats.avgResponse}
              <span style={{ fontSize: '0.8rem', marginLeft: 4 }}>ms</span>
            </div>
            <div className="stat-card-footer">
              <span>Rolling window over last N pages</span>
            </div>
          </div>
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
    </section>
  );
}

export default LiveMonitor;


