


const findAll = async () => {
  const res = await fetch('/api/usuario', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await res.json();
  console.log(result);
  return result;
};

const isLoggedIn = async () => {
  const res = await fetch('/api/usuario/logged', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await res.json();
  return result.ok;
};

const isAdmin = async () => {
  const res = await fetch('/api/usuario/admin', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await res.json();
  return result.ok;
};

const logout = async () => {
  const res = await fetch('/api/usuario/logout', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await res.json();
  console.log(result);
  window.location.href = '/signin.html';
};