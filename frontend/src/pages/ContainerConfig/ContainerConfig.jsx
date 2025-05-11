import { useState, useEffect } from 'preact/hooks';
import { Trash2 } from 'lucide-preact';
import Toogle from '../../components/Toogle';
import AlertMessage from '../../components/AlertMessage';

const ContainerConfig = () => {
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [containerConfigs, setContainerConfigs] = useState([]);

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

  return (
    <div class="overflow-x-auto">
      <AlertMessage message={message} isSuccess={isSuccess} />

      <table class="table table-zebra">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {containerConfigs.map((contConfig) => (
            <tr>
              <td>{contConfig.container_key}</td>
              <td>{contConfig.name}</td>
              <td>{contConfig.description}</td>
              <td>{contConfig.active}</td>
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
    </div>
  );
};

export default ContainerConfig;
