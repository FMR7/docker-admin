import { useLocation } from 'preact-iso';
import { useEffect, useState } from 'preact/hooks';

export function Header() {
	const { url } = useLocation();
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
	const [loggedIn, setLoggedIn] = useState(false);
	const [admin, setAdmin] = useState(false);

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
	};

	const checkLogin = async () => {
		const res = await fetch('/api/usuario/logged', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await res.json();
		setLoggedIn(result.ok);
	};

	const checkAdmin = async () => {
		const res = await fetch('/api/usuario/admin', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await res.json();
		setAdmin(result.ok);
	};

	useEffect(() => {
		document.documentElement.classList.remove('dark', 'light');
		document.documentElement.classList.add(theme);

		checkLogin();
		checkAdmin();
	}, [theme]);


	// Logout
	const logout = async () => {
		await fetch('/api/usuario/logout', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		window.location.href = '/';
	};


	return (
		<header>
			<nav>
				<a href="/" class={url == '/home' && 'active'} hidden={!loggedIn}>Home</a>
				<a href="/signin" class={(url == '/signin' || url == '/') && 'active'} hidden={loggedIn}>Sign In</a>
				<a href="/signup" class={url == '/signup' && 'active'} hidden={loggedIn}>Sign Up</a>
				<a href="/users" class={url == '/users' && 'active'} hidden={!loggedIn || !admin}>Users</a>
				<a href="/container-config" class={url == '/container-config' && 'active'} hidden={!loggedIn || !admin}>Container Config</a>
				<button onClick={logout} hidden={!loggedIn}>Logout</button>


				<button onClick={toggleTheme}>
					<i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} fa-xl`}></i>{theme}
				</button>
			</nav>
		</header>
	);
}
