import { useEffect, useState } from 'preact/hooks';
import TextInput from '../../components/TextInput';
import AlertMessage from '../../components/AlertMessage';

const SignIn = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simula la lógica de redirección si ya estás logueado
    const checkLogin = async () => {
      const res = await fetch('/api/usuario/logged', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await res.json();
      if (result.ok) {
        window.location.href = '/home';
      }
    };

    checkLogin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userData = Object.fromEntries(data.entries());

    const res = await fetch('/api/usuario/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result.ok) {
      window.location.href = '/home';
    } else {
      setError(result.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
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
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Sign up
        </a>
      </p>
    </form>
  );
};

export default SignIn;
