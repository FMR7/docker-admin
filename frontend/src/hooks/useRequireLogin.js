import { useEffect } from 'preact/hooks';

export function requireLogin() {
  useEffect(() => {
    const checkLogin = async () => {
      const res = await fetch('/api/usuario/logged', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await res.json();
      if (!result.ok) {
        window.location.href = '/';
      }
    };

    checkLogin();
  }, []);
}
