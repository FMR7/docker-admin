import { useState, useEffect } from 'preact/hooks';
import TextInput from '../../components/TextInput';

const SignUp = () => {
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Simula la lógica de redirección si ya estás logueado
    const checkLogin = async () => {
      const res = await fetch('/api/usuario/logged', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await res.json();
      if (result.ok) {
        window.location.href = '/';
      }
    };

    checkLogin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    const res = await fetch('/api/usuario/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setMessage(result.message);
    setIsSuccess(result.ok);

    if (result.ok) {
      e.target.reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
    >
      <h1 className="text-2xl font-semibold mb-6 text-center">Sign up</h1>

      {message && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'} mb-4`}>
          {message}
        </div>
      )}

      <TextInput id="username" label="Username" maxLength={50} required />
      <TextInput id="password" label="Password" type="password" required />
      <button type="submit" className="btn btn-primary w-full px-3 py-2 my-1">Sign up</button>

      <p className="text-center mt-4 text-sm">
        Already registered?{' '}
        <a
          href="/signin"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Sign in
        </a>
      </p>
    </form>
  );
};

export default SignUp;
