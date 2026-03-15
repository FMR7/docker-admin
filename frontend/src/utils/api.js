const CSRF_ENDPOINT = '/api/csrf-token';
let csrfTokenCache = null;

export const getCsrfToken = async () => {
  if (csrfTokenCache) {
    return csrfTokenCache;
  }

  const res = await fetch(CSRF_ENDPOINT, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Unable to retrieve CSRF token');
  }

  const body = await res.json();
  if (!body.ok || !body.csrfToken) {
    throw new Error('Invalid CSRF token response');
  }

  csrfTokenCache = body.csrfToken;
  return csrfTokenCache;
};

export const apiFetch = async (url, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const token = await getCsrfToken();
    headers['X-CSRF-Token'] = token;
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