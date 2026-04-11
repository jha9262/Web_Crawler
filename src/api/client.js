// API base URL — set VITE_API_URL in your .env file
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/crawl';

/**
 * Core fetch wrapper.
 * - Attaches Bearer token from sessionStorage (safer than localStorage)
 * - Handles 401 by dispatching a custom event (let React handle the redirect)
 * - Throws typed errors for network and API failures
 */
async function request(path, options = {}) {
  const token = sessionStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let resp;
  try {
    resp = await fetch(`${API_BASE}${path}`, { headers, ...options });
  } catch {
    throw new Error('Cannot connect to server. Check your network or contact support.');
  }

  if (resp.status === 401 || resp.status === 403) {
    // Dispatch event so AuthContext can handle logout cleanly inside React
    window.dispatchEvent(new CustomEvent('auth:expired'));
    throw new Error('Session expired. Please log in again.');
  }

  if (resp.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  }

  if (!resp.ok) {
    let message = `Request failed (${resp.status})`;
    try {
      const body = await resp.json();
      message = body.message || body.error || message;
    } catch {
      // body isn't JSON — use status text
    }
    throw new Error(message);
  }

  if (resp.status === 204) return null;
  return resp.json();
}

export function startCrawl(payload) {
  return request('/start', {
    method: 'POST',
    body: JSON.stringify({
      url: payload.url,
      maxDepth: payload.depth,
      restrictToDomain: payload.domainOnly,
      speed: payload.speed,
      extractMetadata: payload.metadata,
    }),
  });
}

export function fetchSummary() {
  return request('/summary');
}

export function fetchLiveStatus(jobId) {
  const q = jobId ? `?jobId=${encodeURIComponent(jobId)}` : '';
  return request(`/live${q}`);
}

export function fetchLogs(jobId) {
  const q = jobId ? `?jobId=${encodeURIComponent(jobId)}` : '';
  return request(`/logs${q}`);
}

export function fetchGraph(jobId) {
  const q = jobId ? `?jobId=${encodeURIComponent(jobId)}` : '';
  return request(`/graph${q}`);
}

export function fetchAnalytics(jobId) {
  const q = jobId ? `?jobId=${encodeURIComponent(jobId)}` : '';
  return request(`/analytics${q}`);
}
