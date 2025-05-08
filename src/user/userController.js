const express = require('express');
const router = express.Router();
const usuarioService = require('./userService');

router.post('/usuario/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ ok: false, message: 'Username required' });
  }
  if (!password) {
    return res.status(400).json({ ok: false, message: 'Password required' });
  }

  try {
    const user = await usuarioService.signin(username, password);
    req.session.user = user;
    return res.json({ ok: true, user });
  } catch (err) {
    return res.status(401).json({ ok: false, message: err.message });
  }
});

router.post('/usuario/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({ ok: false, message: 'Username required' });
    }
    if (!password) {
      return res.status(400).json({ ok: false, message: 'Password required' });
    }

    const existingUser = await usuarioService.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ ok: false, message: 'Username already exists' });
    }

    const newUser = await usuarioService.signup(username, password);
    return res.json({ ok: true, user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Error signup' });
  }
});

router.delete('/usuario/:username', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ ok: false, message: 'Not authenticated' });
  }
  if (!req.session.user.admin) {
    return res.status(401).json({ ok: false, message: 'Not admin' });
  }

  const { username } = req.params;

  try {
    const user = await usuarioService.deleteUser(username);
    return res.json({ ok: true, user });
  } catch (err) {
    return res.status(401).json({ ok: false, message: err.message });
  }
});

router.get('/usuario', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ ok: false, message: 'Not authenticated' });
  }
  if (!req.session.user.admin) {
    return res.status(401).json({ ok: false, message: 'Not admin' });
  }

  try {
    const users = await usuarioService.findAll();
    return res.json({ ok: true, users });
  } catch (err) {
    return res.status(401).json({ ok: false, message: err.message });
  }
});

router.put('/usuario/active/:active/:username', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ ok: false, message: 'Not authenticated' });
  }
  if (!req.session.user.admin) {
    return res.status(401).json({ ok: false, message: 'Not admin' });
  }

  const { username, active } = req.params;
  if (active !== 'true' && active !== 'false') {
    return res.status(400).json({ ok: false, message: 'Active must be true or false' });
  }

  try {
    const user = await usuarioService.setActive(username, active === 'true');
    const msg = 'User <strong>' + username + '</strong> ' + (active === 'true' ? 'activated' : 'deactivated');
    return res.json({ ok: true, user, message: msg });
  } catch (err) {
    return res.status(401).json({ ok: false, message: err.message });
  }
});

router.put('/usuario/admin/:admin/:username', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ ok: false, message: 'Not authenticated' });
  }
  if (!req.session.user.admin) {
    return res.status(401).json({ ok: false, message: 'Not admin' });
  }

  const { username, admin } = req.params;
  if (admin !== 'true' && admin !== 'false') {
    return res.status(400).json({ ok: false, message: 'Admin must be true or false' });
  }

  try {
    const user = await usuarioService.setAdmin(username, admin === 'true');
    const msg = 'User <strong>' + username + '</strong> ' + (admin === 'true' ? ' promoted to admin' : ' demoted from admin');
    return res.json({ ok: true, user, message: msg });
  } catch (err) {
    return res.status(401).json({ ok: false, message: err.message });
  }
});

router.get('/usuario/logout', async (req, res) => {
  if (!req.session?.user) {
    return res.status(400).json({ ok: false, message: 'No active session to destroy' });
  }

  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ ok: false, message: 'Error closing session' });
    }
    return res.json({ ok: true, message: 'Session closed' });
  });
});

router.get('/usuario/logged', async (req, res) => {
  if (!req.session.user) {
    return res.json({ ok: false, message: 'Not authenticated' });
  }
  return res.json({ ok: true, message: 'Authenticated' });
});

router.get('/usuario/admin', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ ok: false, message: 'Not authenticated' });
  }
  if (!req.session.user.admin) {
    return res.status(401).json({ ok: false, message: 'Not admin' });
  }
  return res.json({ ok: true, message: 'Authenticated as admin' });
});

module.exports = router;
