import { Moon, Sun } from 'lucide-preact';
import { useLocation } from 'preact-iso';
import { useEffect, useState } from 'preact/hooks';
import ThemeSelector from './ThemeSelector';


export function Header() {
	const { url } = useLocation();
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
	const [loggedIn, setLoggedIn] = useState(false);
	const [admin, setAdmin] = useState(false);

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
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
		document.documentElement.setAttribute('data-theme', theme);
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
			<nav class="navbar bg-primary text-primary-content">
				<div class="navbar-start">
					<a href="/home" class={`btn btn-ghost ${url == '/home' && 'active'}`} hidden={!loggedIn}>Home</a>
				</div>

				<div class="navbar-center">
					<a href="/signin" class={`btn btn-ghost ${(url == '/signin' || url == '/') && 'active'}`} hidden={loggedIn}>Sign In</a>
					<a href="/signup" class={`btn btn-ghost ${url == '/signup' && 'active'}`} hidden={loggedIn}>Sign Up</a>
					<a href="/users" class={`btn btn-ghost ${url == '/users' && 'active'}`} hidden={!loggedIn || !admin}>Users</a>
					<a href="/container-config" class={`btn btn-ghost ${url == '/container-config' && 'active'}`} hidden={!loggedIn || !admin}>Container Config</a>
				</div>

				<div class="navbar-end">
					<button onClick={logout} class="btn btn-ghost" hidden={!loggedIn}>Logout</button>

					<button onClick={toggleTheme} class="btn btn-ghost btn-circle">
						<Sun hidden={theme !== 'dark'} />
						<Moon hidden={theme === 'dark'} />
					</button>
					<ThemeSelector />
				</div>
			</nav>
		</header>
	);
}
