const express = require('express');
const router = express.Router();
const {
  getStatus,
  turnOnContainer,
  turnOffContainer,
  getContainers,
} = require('./containerService');

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ ok: false, message: 'Not authenticated' });
  }
  next();
}

// Middleware to validate container ID
function validateContainerId(req, res, next) {
  const { containerId } = req.params;
  if (!process.env.CONTAINERS.includes(containerId)) {
    return res.status(400).json({ ok: false, message: 'Invalid container ID' });
  }
  next();
}

// Generic async handler wrapper
function handleRequest(action) {
  return async (req, res) => {
    try {
      const { containerId } = req.params;
      const result = await action(containerId);
      if (!result.ok) {
        return res.status(500).json({ ok: false, message: result.message });
      }
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  };
}

// Routes
router.get('/container/status/:containerId',
  isAuthenticated,
  validateContainerId,
  handleRequest(getStatus)
);

router.get('/container/turn-on/:containerId',
  isAuthenticated,
  validateContainerId,
  handleRequest(turnOnContainer)
);

router.get('/container/turn-off/:containerId',
  isAuthenticated,
  validateContainerId,
  handleRequest(turnOffContainer)
);

router.get('/container', isAuthenticated, async (req, res) => {
  try {
    const containers = await getContainers();
    return res.json({ ok: true, containers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

module.exports = router;
