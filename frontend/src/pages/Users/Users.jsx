import { useState, useEffect } from 'preact/hooks';
import { Trash2 } from 'lucide-preact';
import Toogle from '../../components/Toogle';

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

  return (
    <div class="overflow-x-auto">
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
              <td><Toogle active={user.active} /></td>
              <td><Toogle active={user.admin} /></td>
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
                  <Trash2/>
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
