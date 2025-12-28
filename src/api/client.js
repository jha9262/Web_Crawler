// Use environment variable for API URL, fallback to localhost for dev
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/crawl';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const resp = await fetch(`${API_BASE}${path}`, {
      headers,
      ...options
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('API Error:', resp.status, text); // debug
      
      // if unauthorized, might need to login again
      if (resp.status === 401 || resp.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(`Request failed ${resp.status}: ${text || resp.statusText}`);
    }

    if (resp.status === 204) return null;
    return resp.json();
  } catch (error) {
    // network error or fetch failed
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.error('Network error - is backend running?');
      throw new Error('Cannot connect to server. Make sure backend is running on http://localhost:8080');
    }
    throw error;
  }
}

export function startCrawl(payload) {
  console.log('startCrawl called with:', payload); // debug
  const token = localStorage.getItem('token');
  console.log('Token exists:', !!token); // debug
  
  return request('/start', {
    method: 'POST',
    body: JSON.stringify({
      url: payload.url,
      maxDepth: payload.depth,
      restrictToDomain: payload.domainOnly,
      speed: payload.speed,
      extractMetadata: payload.metadata
    })
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





