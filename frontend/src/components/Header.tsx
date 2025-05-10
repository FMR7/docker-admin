import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	// Logout
	const logout = async () => {
		const res = await fetch('/api/usuario/logout', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		window.location.href = '/';
	};
	

	return (
		<header>
			<nav>
				<a href="/" class={url == '/' && 'active'}>
					Home
				</a>
				<a href="/signin" class={url == '/signin' && 'active'}>
					Sign In
				</a>
				<a href="/signup" class={url == '/signup' && 'active'}>
					Sign Up
				</a>
				<a onClick={logout}>Logout</a>
			</nav>
		</header>
	);
}
