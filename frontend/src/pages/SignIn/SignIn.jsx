import { useState, useEffect } from 'preact/hooks';
import TextInput from '../../components/TextInput';

const SignIn = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [error, setError] = useState(null);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

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
      window.location.href = '/';
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow p-4 flex justify-end">
        <button
          onClick={toggleTheme}
          className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-300"
        >
          <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} fa-xl`}></i>asdf
        </button>
      </header>

      <main className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h1 className="text-2xl font-semibold mb-6 text-center">Sign in</h1>

          {error && (
            <div className="bg-red-100 text-red-800 px-4 py-2 mb-4 rounded border border-red-300">
              {error}
            </div>
          )}

          <TextInput id="username" label="Username" maxLength={50} required />
          <TextInput id="password" label="Password" type="password" required />
          <button type="submit" className="btn">Sign in</button>
          <button class="btn btn-primary">Primary Button</button>

          <p className="text-center mt-4 text-sm">
            Not registered?{' '}
            <a
              href="signup.html"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign up
            </a>
          </p>
        </form>
      </main>
    </div>
  );
};

export default SignIn;
