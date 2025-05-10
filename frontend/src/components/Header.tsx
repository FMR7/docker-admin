import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

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
			</nav>
		</header>
	);
}
