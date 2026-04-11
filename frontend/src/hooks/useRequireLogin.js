import { useEffect } from 'preact/hooks';
import { apiFetch } from '../utils/api';

export function requireLogin() {
  useEffect(() => {
    const checkLogin = async () => {
      const res = await apiFetch('/api/usuario/logged', {
        method: 'GET'
      });

      const result = await res.json();
      if (!result.ok) {
        globalThis.location.href = '/';
      }
    };

    checkLogin();
  }, []);
}
