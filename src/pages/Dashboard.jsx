import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { fetchSummary } from '../api/client';

const responseTimeSpark = [
  { t: 0, v: 180 },
  { t: 1, v: 220 },
  { t: 2, v: 160 },
  { t: 3, v: 190 },
  { t: 4, v: 210 },
  { t: 5, v: 170 }
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    // fetch dashboard data
    fetchSummary()
      .then((data) => {
        if (!cancelled) {
          console.log('Dashboard data:', data); // debug
          setStats({
            totalPages: data.totalPages,
            errors: data.totalErrors,
            avgResponse: data.avgResponseMs,
            depth: data.maxDepth
          });
        }
      })
      .catch((err) => {
        console.error('Error loading summary:', err);
        if (!cancelled) setError(err.message || 'Failed to load summary.');
      });
    
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-kicker">
            <span>Real-time</span>
            <span>•</span>
            <span>AI-Powered Crawl Insights</span>
          </div>
          <h2 className="hero-title">
            Website Crawler Dashboard – AI-Powered Insights
          </h2>
          <p className="hero-subtitle">
            Monitor, analyze, and visualize your website&apos;s structure in
            real time. Designed for search engineers, SEOs, and platform teams.
          </p>
          <div className="hero-meta">
            <span>Live crawl health checks</span>
            <span>•</span>
            <span>Graph-based structure view</span>
            <span>•</span>
            <span>Production-ready UI</span>
          </div>
        </div>
        <div className="hero-orbit">
          <div className="hero-orbit-inner">
            <span>Live crawl topology &amp; latency at a glance</span>
          </div>
          <div className="hero-node" />
          <div className="hero-node" />
          <div className="hero-node" />
        </div>
      </section>

      <section className="glass-panel highlight">
        <div className="stat-grid">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="stat-card-label">
              <span>Total Pages Crawled</span>
              <span className="badge accent">Live</span>
            </div>
            <div className="stat-card-value">
              {stats ? stats.totalPages.toLocaleString() : '—'}
            </div>
            <div className="stat-card-footer">
              <span>Updated on last crawl run</span>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <div className="stat-card-label">
              <span>Errors Found</span>
              <span className="badge error">4xx / 5xx</span>
            </div>
            <div className="stat-card-value" style={{ color: '#ef4444' }}>
              {stats ? stats.errors.toLocaleString() : '—'}
            </div>
            <div className="stat-card-footer">
              <span className="blink">●</span>
              <span>Spike detection enabled</span>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div className="stat-card-label">
              <span>Average Response Time</span>
              <span>ms</span>
            </div>
            <div className="stat-card-value">
              {stats ? stats.avgResponse : '—'}
              <span style={{ fontSize: '0.8rem', marginLeft: 4 }}>ms</span>
            </div>
            <div style={{ height: 40, marginTop: 4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeSpark}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    dot={false}
                    stroke="#4f46e5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <div className="stat-card-label">
              <span>Crawl Depth</span>
              <span>levels</span>
            </div>
            <div className="stat-card-value">
              <span className="badge depth">
                {stats ? stats.depth : '—'}
              </span>
            </div>
            <div className="stat-card-footer">
              <span>Deepest reachable path in last crawl</span>
            </div>
          </motion.div>
        </div>
      </section>
      {error && (
        <section className="glass-panel" style={{ padding: '0.75rem 1rem' }}>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-error)'
            }}
          >
            {error}
          </div>
        </section>
      )}
    </>
  );
}

export default Dashboard;


