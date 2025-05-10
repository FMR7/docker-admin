import { useLocation } from 'preact-iso';
import { useEffect, useState } from 'preact/hooks';

export function Header() {
	const { url } = useLocation();
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
	};

	useEffect(() => {
		document.documentElement.classList.remove('dark', 'light');
		document.documentElement.classList.add(theme);
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
				<a href="/" class={url == '/' && 'active'}>Home</a>
				<a href="/signin" class={url == '/signin' && 'active'}>Sign In</a>
				<a href="/signup" class={url == '/signup' && 'active'}>Sign Up</a>
				<a href="/users" class={url == '/users' && 'active'}>Users</a>
				<button onClick={logout}>Logout</button>


				<button onClick={toggleTheme}>
					<i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} fa-xl`}></i>{theme}
				</button>
			</nav>
		</header>
	);
}
