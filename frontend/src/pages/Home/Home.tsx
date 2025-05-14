import { useState, useEffect } from 'preact/hooks';
import AlertMessage from '../../components/AlertMessage';
import Toogle from '../../components/Toogle';
import { requireLogin } from '../../hooks/useRequireLogin';

export function Home() {
	requireLogin();
	
	const [message, setMessage] = useState(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [containers, setContainers] = useState([]);

	const findAll = async () => {
		const res = await fetch('/api/container', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		}).then((res) => res.json()).catch((err) => console.log(err));

		if (res.ok) {
			console.log('Fetched containers:', res.containers);
			setContainers(res.containers);
		} else {
			setIsSuccess(false);
			setMessage(res.message);
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
		console.log('Set active', isChecked, 'for container:', container_key);

		const result = isChecked
			? await turnOn(container_key)
			: await turnOff(container_key);

		setMessage(result.message);
		setIsSuccess(result.ok);

		findAll();
	}


	// ✅ Solo se ejecuta una vez cuando se monta el componente
	useEffect(() => {
		findAll();
	}, []);

	return (
		<div class="overflow-x-auto">
			<AlertMessage message={message} isSuccess={isSuccess} />

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
								<Toogle
									id={'active' + container.container_key}
									active={container.status}
									label=""
									onChange={(event) => onActiveSwitchChange(event, container.container_key)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
