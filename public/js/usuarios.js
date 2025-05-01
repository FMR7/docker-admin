


const testCall = async () => {
  const res = await fetch('/api/usuario/user', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await res.json();
  console.log(result);
};

const isLoggedIn = async () => {
  const res = await fetch('/api/usuario/logged', {
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