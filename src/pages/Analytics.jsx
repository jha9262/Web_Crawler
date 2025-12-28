import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend
} from 'recharts';

import { useSearchParams } from 'react-router-dom';
import { fetchAnalytics } from '../api/client';

const pieColors = ['#4f46e5', '#10b981', '#f59e0b', '#6366f1'];

function statusClass(code) {
  if (code >= 200 && code < 300) return 'status-2xx';
  if (code >= 300 && code < 400) return 'status-3xx';
  if (code >= 400 && code < 500) return 'status-4xx';
  return 'status-5xx';
}

function Analytics() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') || undefined;

  const [depthData, setDepthData] = useState([]);
  const [mimeData, setMimeData] = useState([]);
  const [responseTimeline, setResponseTimeline] = useState([]);
  const [statusRows, setStatusRows] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchAnalytics(jobId)
      .then((data) => {
        if (cancelled || !data) return;
        if (data.depthHistogram) {
          setDepthData(
            Object.entries(data.depthHistogram).map(([depth, pages]) => ({
              depth,
              pages
            }))
          );
        }
        if (data.mimeHistogram) {
          setMimeData(
            Object.entries(data.mimeHistogram).map(([name, value]) => ({
              name,
              value
            }))
          );
        }
        if (data.responseTimeline) {
          setResponseTimeline(
            Object.entries(data.responseTimeline).map(([t, ms]) => ({
              t,
              ms
            }))
          );
        }
        if (Array.isArray(data.statusRows)) {
          setStatusRows(data.statusRows);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load analytics.');
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);
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
            Crawl Analytics
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)'
            }}
          >
            A multi-visual view of depth distribution, MIME types, and response
            times.
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="glass-panel">
          <div
            style={{
              fontSize: '0.8rem',
              marginBottom: 8,
              color: 'var(--color-text-muted)'
            }}
          >
            Pages per Depth Level
          </div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={depthData}>
                <XAxis dataKey="depth" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pages" radius={[6, 6, 0, 0]} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <div
            style={{
              fontSize: '0.8rem',
              marginBottom: 8,
              color: 'var(--color-text-muted)'
            }}
          >
            MIME Type Distribution
          </div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={mimeData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {mimeData.map((entry, index) => (
                    <Cell
                      // eslint-disable-next-line react/no-array-index-key
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <div
            style={{
              fontSize: '0.8rem',
              marginBottom: 8,
              color: 'var(--color-text-muted)'
            }}
          >
            Response Time over Timeline
          </div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={responseTimeline}>
                <XAxis dataKey="t" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="ms"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <div
          style={{
            fontSize: '0.85rem',
            marginBottom: 6,
            fontWeight: 500
          }}
        >
          Status Overview
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Status</th>
                <th>Type</th>
                <th>Depth</th>
              </tr>
            </thead>
            <tbody>
              {statusRows.map((row) => (
                <tr key={`${row.url}-${row.status}`}>
                  <td
                    style={{
                      maxWidth: 260,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {row.url}
                  </td>
                  <td>
                    <span
                      className={`status-pill ${statusClass(row.status)}`}
                    >
                      <span>●</span>
                      <span>{row.status}</span>
                    </span>
                  </td>
                  <td>{row.type}</td>
                  <td>{row.depth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error && (
          <div
            style={{
              marginTop: 6,
              fontSize: '0.78rem',
              color: 'var(--color-error)'
            }}
          >
            {error}
          </div>
        )}
      </div>
    </section>
  );
}

export default Analytics;


