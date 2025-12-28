import React, { useEffect, useMemo, useState } from 'react';
import { forceSimulation, forceManyBody, forceCenter, forceLink } from 'd3-force';
import { useSearchParams } from 'react-router-dom';
import { fetchGraph } from '../api/client';

function layoutGraph(width, height, inputNodes, inputLinks) {
  const nodes = inputNodes.map((n) => ({ ...n }));
  const links = inputLinks.map((l) => ({ ...l }));

  const sim = forceSimulation(nodes)
    .force(
      'link',
      forceLink(links)
        .id((d) => d.id)
        .distance(110)
    )
    .force('charge', forceManyBody().strength(-180))
    .force('center', forceCenter(width / 2, height / 2))
    .stop();

  // run a few ticks synchronously just for initial layout
  for (let i = 0; i < 80; i += 1) {
    sim.tick();
  }

  return { nodes, links };
}

function colorForType(type) {
  switch (type) {
    case 'home':
      return '#4f46e5';
    case 'internal':
      return '#3b82f6';
    case 'error':
      return '#ef4444';
    case 'external':
      return '#6b7280';
    default:
      return '#6b7280';
  }
}

function GraphView() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') || undefined;

  const size = { width: 720, height: 420 };
  const [rawNodes, setRawNodes] = useState([]);
  const [rawLinks, setRawLinks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchGraph(jobId)
      .then((data) => {
        if (cancelled || !data) return;
        setRawNodes(Array.isArray(data.nodes) ? data.nodes : []);
        setRawLinks(Array.isArray(data.links) ? data.links : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load graph.');
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const { nodes, links } = useMemo(
    () =>
      rawNodes.length && rawLinks.length
        ? layoutGraph(size.width, size.height, rawNodes, rawLinks)
        : { nodes: [], links: [] },
    [rawNodes, rawLinks, size.width, size.height]
  );

  return (
    <section className="glass-panel">
      <div
        style={{
          marginBottom: '0.75rem',
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
            Link Graph
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)'
            }}
          >
            Visualizes internal links as a force-directed graph. When wired up,
            each node corresponds to a crawled URL.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)'
          }}
        >
          <span>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: 999,
                background: '#4f46e5',
                marginRight: 4
              }}
            />
            Home
          </span>
          <span>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: 999,
                background: '#3b82f6',
                marginRight: 4
              }}
            />
            Internal
          </span>
          <span>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: 999,
                background: '#ef4444',
                marginRight: 4
              }}
            />
            Error
          </span>
          <span>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: 999,
                background: '#6b7280',
                marginRight: 4
              }}
            />
            External
          </span>
        </div>
      </div>

      <div
        style={{
          borderRadius: 16,
          border: '1px solid rgba(148,163,184,0.6)',
          background: 'radial-gradient(circle at top, #f9fafb, #e5e7eb)',
          overflow: 'hidden'
        }}
      >
        <svg width="100%" height={size.height} viewBox={`0 0 ${size.width} ${size.height}`}>
          <defs>
            <filter id="shadow">
              <feDropShadow
                dx="0"
                dy="6"
                stdDeviation="8"
                floodColor="rgba(15,23,42,0.35)"
              />
            </filter>
          </defs>

          {links.map((l) => {
            // After forceLink processing, source/target may be node objects or string IDs
            const source = typeof l.source === 'object' ? l.source : nodes.find((n) => n.id === l.source);
            const target = typeof l.target === 'object' ? l.target : nodes.find((n) => n.id === l.target);
            if (!source || !target || !source.x || !source.y || !target.x || !target.y) return null;
            const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
            const targetId = typeof l.target === 'object' ? l.target.id : l.target;
            return (
              <line
                key={`${sourceId}-${targetId}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="rgba(148,163,184,0.7)"
                strokeWidth={1.2}
              />
            );
          })}

          {nodes.map((n) => (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={n.type === 'home' ? 16 : 11}
                fill={colorForType(n.type)}
                filter="url(#shadow)"
              />
              <text
                x={n.x}
                y={n.y + (n.type === 'home' ? 28 : 24)}
                textAnchor="middle"
                style={{
                  fontSize: 10,
                  fill: '#111827',
                  paintOrder: 'stroke',
                  stroke: '#f9fafb',
                  strokeWidth: 3
                }}
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div
        style={{
          marginTop: '0.6rem',
          fontSize: '0.78rem',
          color: 'var(--color-text-muted)'
        }}
      >
        Graph data is now loaded from the Spring Boot backend. You can change the
        implementation of <code>getGraph</code> in the backend to emit real nodes
        and links from your crawler results.
      </div>
      {error && (
        <div
          style={{
            marginTop: '0.5rem',
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

export default GraphView;


