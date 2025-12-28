// Use environment variable for API URL, fallback to localhost for dev
const getAuthBase = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/crawl';
  // Convert crawl URL to auth URL
  return apiUrl.replace('/api/crawl', '/api/auth');
};
const API_BASE = getAuthBase();

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };

  // add token if exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const resp = await fetch(`${API_BASE}${path}`, {
    headers: headers,
    ...options
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `Error: ${resp.status}`);
  }

  return resp.json();
}

export function login(credentials) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password
    })
  });
}

export function signup(userData) {
  return request('/signup', {
    method: 'POST',
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password
    })
  });
}

export function validateToken(token) {
  return request('/validate', {
    method: 'POST',
    body: JSON.stringify(token)
  });
}

