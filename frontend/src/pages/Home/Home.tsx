import { useState, useEffect } from 'preact/hooks';
import AlertMessage from '../../components/AlertMessage';
import Toogle from '../../components/Toogle';

export function Home() {
	const [message, setMessage] = useState(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [containers, setContainers] = useState([]);

	const getLogged = async () => {
		const res = await fetch('/api/usuario/logged', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await res.json();
		setMessage(result.message);
	};

	const findAll = async () => {
		const res = await fetch('/api/container', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		const result = await res.json();
		console.log('Fetched containers:', result.containers);

		if (result) {
			setContainers(result.containers);
		}
	};
	
	const turnOn = async (containerName) => {
		const res = await fetch('/api/container/turn-on/' + containerName, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
	
		return await res.json();
	};
	
	const turnOff = async (containerName) => {
		const res = await fetch('/api/container/turn-off/' + containerName, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
	
		return await res.json();
	};
	
	async function onActiveSwitchChange(event, id) {
		const isChecked = event.target.checked;
		console.log('Set active', isChecked, 'for container:', id);
	
		const result = isChecked
			? await turnOn(id)
			: await turnOff(id);
	
		setMessage(result.message);
		setIsSuccess(result.ok);
	
		findAll();
	}
	

	// ✅ Solo se ejecuta una vez cuando se monta el componente
	useEffect(() => {
		getLogged();
		findAll();
	}, []);

	return (
		<div class="overflow-x-auto">
			<AlertMessage message={message} isSuccess={isSuccess} />

			<table class="table table-zebra">
				<thead>
					<tr>
						<th>Name</th>
						<th>Active</th>
					</tr>
				</thead>
				<tbody>
					{containers.map((container) => (
						<tr>
							<td>{container.name}</td>
							<td>
								<Toogle
									id={'active' + container.id}
									active={container.status}
									label=""
									onChange={(event) => onActiveSwitchChange(event, container.id)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
