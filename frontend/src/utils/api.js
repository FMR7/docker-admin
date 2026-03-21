export const apiFetch = async (url, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && !url.includes('/usuario/login') && !url.includes('/usuario/register')) {
    const csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }
  }

  const res = await fetch(url, {
    ...options,
    method,
    headers,
    credentials: 'include',
  });

  if (res.status === 403) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.message || 'Forbidden');
  }

  return res;
};