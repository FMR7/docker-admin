const express = require('express');
const router = express.Router();
const { getStatus, getName, turnOnContainer, turnOffContainer, getContainers } = require('./containerService');

router.get('/container/status/:containerId', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ ok: false, message: 'Not authenticated' });
        }

        const { containerId } = req.params;

        if (!process.env.CONTAINERS.includes(containerId)) {
            return res.status(400).json({ ok: false, message: 'Invalid container ID' });
        }

        const result = await getStatus(containerId);
        if (!result.ok) {
            return res.status(500).json({ ok: false, message: result.message });
        }

        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: 'Internal server error' });
    }
});


router.get('/container/turn-on/:containerId', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ ok: false, message: 'Not authenticated' });
        }

        const { containerId } = req.params;

        if (!process.env.CONTAINERS.includes(containerId)) {
            return res.status(400).json({ ok: false, message: 'Invalid container ID' });
        }

        const result = await turnOnContainer(containerId);
        if (!result.ok) {
            return res.status(500).json({ ok: false, message: result.message });
        }

        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: 'Internal server error' });
    }
});

router.get('/container/turn-off/:containerId', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ ok: false, message: 'Not authenticated' });
        }

        const { containerId } = req.params;

        if (!process.env.CONTAINERS.includes(containerId)) {
            return res.status(400).json({ ok: false, message: 'Invalid container ID' });
        }

        const result = await turnOffContainer(containerId);
        if (!result.ok) {
            return res.status(500).json({ ok: false, message: result.message });
        }

        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: 'Internal server error' });
    }
});

router.get('/container', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }

    try {
        const containers = await getContainers();
        return res.json({ ok: true, containers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: 'Internal server error' });
    }
});

module.exports = router;
