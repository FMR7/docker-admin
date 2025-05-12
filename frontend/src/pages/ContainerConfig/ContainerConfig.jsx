import { useState, useEffect } from 'preact/hooks';
import { Trash2 } from 'lucide-preact';
import AlertMessage from '../../components/AlertMessage';
import Toogle from '../../components/Toogle';
import useModal from '../../hooks/useModal';
import TextInput from '../../components/TextInput';
import TextArea from '../../components/TextArea';

const ContainerConfig = () => {
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [containerConfigs, setContainerConfigs] = useState([]);
  const { isOpen, open, close } = useModal();

  const findAll = async () => {
    const res = await fetch('/api/container-config', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await res.json();
    console.log(result);
    if (result) {
      setContainerConfigs(result.containerConfigs);
    }
  };

  useEffect(() => {
    findAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      container_key: formData.get('container_key'),
      name: formData.get('name'),
      description: formData.get('description'),
      active: formData.get('active') == 'on'
    };

    const res = await fetch('/api/container-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    setMessage(result.message);
    setIsSuccess(result.ok);

    if (result.ok) {
      e.target.reset();
      close(); // Cierra el modal
      findAll(); // Vuelve a cargar los contenedores
    }
  };

  async function onActiveSwitchChange(event, username) {
    const isChecked = event.target.checked;
    console.log('Set active', isChecked, 'for user:', username);
    const res = await fetch('/api/usuario/active/' + isChecked + '/' + username, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await res.json();
    setMessage(result.message);
    setIsSuccess(result.ok);

    findAll();
  }

  async function onAdminSwitchChange(event, username) {
    const isChecked = event.target.checked;
    console.log('Set admin', isChecked, 'for user:', username);
    const res = await fetch('/api/usuario/admin/' + isChecked + '/' + username, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await res.json();
    setMessage(result.message);
    setIsSuccess(result.ok);

    findAll();
  }

  return (
    <div class="overflow-x-auto">
      <AlertMessage message={message} isSuccess={isSuccess} />

      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Container ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Active</th>
            <th>Admin only</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {containerConfigs.map((contConfig) => (
            <tr>
              <td>{contConfig.container_key}</td>
              <td>{contConfig.name}</td>
              <td>{contConfig.description}</td>
              <td><Toogle id={'active' + contConfig.container_key} active={contConfig.active} label="" onChange={(event) => onActiveSwitchChange(event, contConfig.container_key)} /></td>
              <td><Toogle id={'admin' + contConfig.container_key} active={contConfig.active} label="" onChange={(event) => onAdminSwitchChange(event, contConfig.container_key)} /></td>
              <td>
                <button className="btn btn-error"
                  onClick={async () => {
                    await fetch(`/api/container-config/${contConfig.container_key}`, {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                    });

                    findAll();
                  }}
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



      <button className="btn btn-primary mb-4" onClick={open}>Nuevo</button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/50">
          <div className="w-lg p-6 rounded border border-primary shadow-xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <h2 className="text-lg font-bold mb-4">Create Container Config</h2>
            <form onSubmit={handleSubmit}>
              <label class="floating-label">
                <span>Container ID</span>
                <TextInput id="container_key" label="Container ID" required />
              </label>
              <label class="floating-label">
                <span>Name</span>
                <TextInput id="name" label="Name" maxLength={50} required />
              </label>
              <label class="floating-label">
                <span>Description</span>
                <TextArea id="description" label="Description" maxLength={100} required />
              </label>
              <Toogle id="active" label="Active" active={true} />

              <div className="mt-4 flex justify-evenly space-x-2">
                <button type="submit" className="btn btn-primary">Guardar</button>
                <button type="button" className="btn" onClick={close}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContainerConfig;
