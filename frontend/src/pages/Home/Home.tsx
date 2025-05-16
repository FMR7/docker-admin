import { useState, useEffect, useRef } from 'preact/hooks';
import AlertMessage from '../../components/AlertMessage';
import Toogle from '../../components/Toogle';
import { requireLogin } from '../../hooks/useRequireLogin';
import { LoaderCircle } from 'lucide-preact';
import Spinner from '../../components/Spinner';

export function Home() {
	requireLogin();

	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [containers, setContainers] = useState([]);
	const [localStatus, setLocalStatus] = useState({});
	const [loadingContainers, setLoadingContainers] = useState(new Set());
	const successTimeoutRef = useRef(null);

	const showSuccessMessage = (msg, duration = 3000) => {
		setSuccessMessage(msg);
		if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
		successTimeoutRef.current = setTimeout(() => setSuccessMessage(null), duration);
	};

	const findAll = async () => {
		const res = await fetch('/api/container', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		}).then(res => res.json()).catch(err => {
			console.log(err);
			setErrorMessage('Error fetching containers');
		});

		if (res.ok) {
			setContainers(res.containers);

			const statusMap = {};
			res.containers.forEach(c => {
				statusMap[c.container_key] = c.status;
			});
			setLocalStatus(statusMap);

			if (res.messages && res.messages.length > 0) {
				// Mostrar mensajes como error (por ejemplo)
				setErrorMessage(res.messages.join('\n'));
			}
		} else if (res) {
			setErrorMessage(res.message ?? 'Unknown error');
		}
	};

	const turnOn = async (container_key) => {
		const res = await fetch('/api/container/turn-on/' + container_key, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		return await res.json();
	};

	const turnOff = async (container_key) => {
		const res = await fetch('/api/container/turn-off/' + container_key, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		return await res.json();
	};

	async function onActiveSwitchChange(event, container_key) {
		const isChecked = event.target.checked;

		setLocalStatus(prev => ({ ...prev, [container_key]: isChecked }));
		setLoadingContainers(prev => new Set(prev).add(container_key));

		const result = isChecked
			? await turnOn(container_key)
			: await turnOff(container_key);

		if (result.ok) {
			showSuccessMessage(result.message);
		} else {
			setErrorMessage(result.message);
		}

		setLoadingContainers(prev => {
			const copy = new Set(prev);
			copy.delete(container_key);
			return copy;
		});

		findAll();
	}

	// ✅ Solo se ejecuta una vez cuando se monta el componente
	useEffect(() => {
		findAll();

		return () => {
			if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
		};
	}, []);

	return (
		<div class="overflow-x-auto">
			{successMessage && <AlertMessage message={successMessage} isSuccess={true} />}
			{errorMessage && <AlertMessage message={errorMessage} isSuccess={false} />}

			<table class="table table-zebra">
				<thead>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Active</th>
					</tr>
				</thead>
				<tbody>
					{containers.map((container) => (
						<tr>
							<td>{container.name}</td>
							<td dangerouslySetInnerHTML={{ __html: container.description }}></td>
							<td>
								{loadingContainers.has(container.container_key) ? (
									<Spinner />
								) : (
									<Toogle
										id={'active' + container.container_key}
										active={localStatus[container.container_key]}
										label=""
										onChange={e => onActiveSwitchChange(e, container.container_key)}
									/>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
