const AUTH_BASE = (() => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/crawl';
  return apiUrl.replace('/api/crawl', '/api/auth');
})();

async function request(path, options = {}) {
  const token = sessionStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let resp;
  try {
    resp = await fetch(`${AUTH_BASE}${path}`, { headers, ...options });
  } catch {
    throw new Error('Cannot connect to server. Check your network or contact support.');
  }

  if (resp.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  }

  let body;
  try {
    body = await resp.json();
  } catch {
    body = {};
  }

  if (!resp.ok) {
    throw new Error(body.message || `Request failed (${resp.status})`);
  }

  return body;
}

export function login(credentials) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });
}

export function signup(userData) {
  return request('/signup', {
    method: 'POST',
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
    }),
  });
}

export function refreshToken(token) {
  return request('/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: token }),
  });
}
