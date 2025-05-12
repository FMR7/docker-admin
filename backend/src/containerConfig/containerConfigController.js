const express = require('express');
const router = express.Router();
const service = require('./containerConfigService');

router.get('/container-config', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ ok: false, message: 'Not authenticated' });
  }
  if (!req.session.user.admin) {
    return res.status(401).json({ ok: false, message: 'Not admin' });
  }

  try {
    const containerConfigs = await service.findAll();
    return res.json({ ok: true, containerConfigs });
  } catch (err) {
    return res.status(401).json({ ok: false, message: err.message });
  }
});

router.post('/container-config', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }
    if (!req.session.user.admin) {
      return res.status(401).json({ ok: false, message: 'Not admin' });
    }

    const { container_key, name, description, active, adminOnly } = req.body;
    const containerConfig = await service.insert(container_key, name, description, active, adminOnly);
    return res.json({ ok: true, containerConfig });
  } catch (err) {
    return res.status(401).json({ ok: false, message: err.message });
  }
});

router.put('/container-config/:container_key', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }
    if (!req.session.user.admin) {
      return res.status(401).json({ ok: false, message: 'Not admin' });
    }

    const { container_key } = req.params;
    const { name, description, active, adminOnly } = req.body;
    const containerConfig = await service.update(container_key, name, description, active, adminOnly);
    return res.json({ ok: true, containerConfig });
  } catch (err) {
    return res.status(401).json({ ok: false, message: err.message });
  }
});

router.delete('/container-config/:container_key', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ ok: false, message: 'Not authenticated' });
  }
  if (!req.session.user.admin) {
    return res.status(401).json({ ok: false, message: 'Not admin' });
  }

  const { container_key } = req.params;
  try {
    const containerConfig = await service.deleteContainer(container_key);
    return res.json({ ok: true, containerConfig });
  } catch (err) {
    return res.status(401).json({ ok: false, message: err.message });
  }
});

module.exports = router;
