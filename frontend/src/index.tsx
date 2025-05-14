import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/Home.js';
import { NotFound } from './pages/_404.jsx';
import './style.css';
import SignIn from './pages/SignIn/SignIn.jsx';
import SignUp from './pages/SignUp/SignUp.jsx';
import Users from './pages/Users/Users.jsx';
import ContainerConfig from './pages/ContainerConfig/ContainerConfig.jsx';

export function App() {
	return (
		<LocationProvider>
			<Header />
			<main className="flex items-center justify-center h-[calc(100vh-3rem)] bg-base-300 text-base-content">
				<Router>
					<Route path="/" component={SignIn} />
					<Route path="/home" component={Home} />
					<Route path="/signin" component={SignIn} />
					<Route path="/signup" component={SignUp} />
					<Route path="/users" component={Users} />
					<Route path="/container-config" component={ContainerConfig} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
