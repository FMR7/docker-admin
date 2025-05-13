import { useState, useEffect } from 'preact/hooks';
import { Plus, Edit2, Trash2 } from 'lucide-preact';
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
  const [editingItem, setEditingItem] = useState(null);


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

  const openEditModal = (item) => {
    setEditingItem(item);
    open();
  };

  const handleClose = () => {
    close();
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      container_key: formData.get('container_key'),
      name: formData.get('name'),
      description: formData.get('description'),
      active: formData.get('active') === 'on',
      admin_only: formData.get('admin_only') === 'on',
    };

    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/container-config/${editingItem.container_key}` : '/api/container-config';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setMessage(result.message);
    setIsSuccess(result.ok);

    if (result.ok) {
      e.target.reset();
      handleClose();
      findAll();
    }
  };

  return (
    <div class="overflow-x-auto">
      <button className="btn btn-primary mb-4" onClick={open}><Plus /></button>

      <AlertMessage message={message} isSuccess={isSuccess} />

      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Container ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Active</th>
            <th>Admin only</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {containerConfigs.map((contConfig) => (
            <tr>
              <td>{contConfig.container_key}</td>
              <td>{contConfig.name}</td>
              <td>{contConfig.description}</td>
              <td>{contConfig.active ? <div class="badge badge-success">Yes</div> : <div class="badge badge-error">No</div>}</td>
              <td>{contConfig.admin_only ? <div class="badge badge-success">Yes</div> : <div class="badge badge-error">No</div>}</td>
              <td>
                <button className="btn btn-primary mr-1" onClick={() => openEditModal(contConfig)}>
                  <Edit2 />
                </button>

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

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/50">
          <div className="w-lg p-6 rounded border border-primary shadow-xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <AlertMessage message={message} isSuccess={isSuccess} />
            
            <h2 className="text-lg font-bold mb-4">Create Container Config</h2>
            <form onSubmit={handleSubmit}>
              <label class="floating-label">
                <span>Container ID</span>
                <TextInput id="container_key" label="Container ID" defaultValue={editingItem?.container_key} required />
              </label>
              <label class="floating-label">
                <span>Name</span>
                <TextInput id="name" label="Name" maxLength={50} defaultValue={editingItem?.name} required />
              </label>
              <label class="floating-label">
                <span>Description</span>
                <TextArea id="description" label="Description" defaultValue={editingItem?.description} maxLength={100} />
              </label>
              <Toogle id="active" label="Active" active={editingItem?.active ?? true} />
              <Toogle id="admin_only" label="Admin only" active={editingItem?.admin_only ?? false} />

              <div className="mt-4 flex justify-end space-x-2">
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
