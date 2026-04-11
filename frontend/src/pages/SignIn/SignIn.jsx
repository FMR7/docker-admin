import { useEffect, useState } from 'preact/hooks';
import TextInput from '../../components/TextInput';
import AlertMessage from '../../components/AlertMessage';
import { apiFetch } from '../../utils/api';

const SignIn = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simula la lógica de redirección si ya estás logueado
    const checkLogin = async () => {
      const res = await apiFetch('/api/usuario/logged', { method: 'GET' });

      const result = await res.json();
      if (result.ok) {
        globalThis.location.href = '/home';
      }
    };

    checkLogin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userData = Object.fromEntries(data.entries());

    try {
      const res = await apiFetch('/api/usuario/login', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      const result = await res.json();

      if (result.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('csrfToken', result.csrfToken);
        globalThis.location.href = '/home';
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 text-base-content p-8 rounded-lg shadow-md w-full max-w-md"
    >
      <h1 className="text-2xl font-semibold mb-6 text-center">Sign in</h1>

      <AlertMessage message={error} isSuccess={false} />
      <TextInput id="username" label="Username" maxLength={50} required />
      <TextInput id="password" label="Password" type="password" required />
      <button type="submit" className="btn btn-primary w-full px-3 py-2 my-1">Sign in</button>

      <p className="text-center mt-4 text-sm">
        Not registered?{' '}
        <a
          href="/signup"
          className="text-primary hover:underline"
        >
          Sign up
        </a>
      </p>
    </form>
  );
};


export default SignIn;
