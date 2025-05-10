import { useState, useEffect } from 'preact/hooks';

const SignIn = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [error, setError] = useState(null);

  // Switch theme function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
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
    <div class="bg-body-tertiary">
      <header class="d-flex flex-wrap justify-content-center p-3 mb-4 border-bottom bg-body sticky-top">
        <nav class="navbar navbar-expand-sm">
          <div class="container-fluid">
            <button
              id="btnSwitch"
              class="navbar-toggler btn"
              type="button"
              onClick={toggleTheme}
            >
              <i class={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} fa-xl`}></i>
            </button>
          </div>
        </nav>
      </header>

      <main class="custom-form position-absolute top-50 start-50 translate-middle w-100">
        {error && <div id="signUpDangerAlert" class="alert alert-danger">{error}</div>}

        <form id="loginForm" onSubmit={handleSubmit}>
          <h1 class="h3 mb-3 fw-normal">Sign in</h1>

          <div class="form-floating">
            <input
              type="text"
              class="form-control"
              id="username"
              placeholder="name@example.com"
              name="username"
              maxlength={50}
            />
            <label for="username">Username</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Password"
              name="password"
              maxlength={50}
            />
            <label for="password">Password</label>
          </div>

          <button class="btn btn-primary w-100 py-2" type="submit">
            Sign in
          </button>

          <label for="signupLink" class="mt-3">
            Not registered? <a id="signupLink" href="signup.html">Sign up</a>
          </label>
        </form>
      </main>
    </div>
  );
};

export default SignIn;
