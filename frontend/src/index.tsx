import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';
import SignIn from './pages/SignIn/SignIn.jsx';

export function App() {
	return (
		<LocationProvider>
			<Header />
			<main className="flex items-center justify-center h-[calc(100vh-3rem)] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
				<Router>
					<Route path="/" component={Home} />
					<Route path="/signin" component={SignIn} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
