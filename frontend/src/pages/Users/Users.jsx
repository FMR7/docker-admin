import { useState, useEffect } from 'preact/hooks';
import { Trash2 } from 'lucide-preact';
import Toogle from '../../components/Toogle';
import AlertMessage from '../../components/AlertMessage';

const Users = () => {
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [users, setUsers] = useState([]);

  const findAll = async () => {
    const res = await fetch('/api/usuario', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await res.json();
    if (result) {
      setUsers(result.users);
    }
  };

  useEffect(() => {
    // Simula la lógica de redirección si ya estás logueado
    const checkLogin = async () => {
      const res = await fetch('/api/usuario/logged', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await res.json();
      if (!result.ok) {
        //window.location.href = '/';
      }
    };

    checkLogin();
    findAll();
  }, []);

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
            <th>Username</th>
            <th>Active</th>
            <th>Admin</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr>
              <td>{user.username}</td>
              <td><Toogle active={user.active} onChange={(event) => onActiveSwitchChange(event, user.username)} /></td>
              <td><Toogle active={user.admin} onChange={(event) => onAdminSwitchChange(event, user.username)} /></td>
              <td>
                <button className="btn btn-error"
                  onClick={async () => {
                    await fetch(`/api/usuario/${user.username}`, {
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

export default Users;
