const express = require('express');
const router = express.Router();
const { getStatus, getName, turnOnContainer, turnOffContainer } = require('./containerService');

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
        return res.status(401).json({ ok: false, message: err.message });
    }
});

router.get('/container', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }

    try {
        let result = { ok: true, containers: [] };
        const containerIds = process.env.CONTAINERS.split(',');
        for (const containerId of containerIds) {
            if (!containerId) {
                return res.status(400).json({ ok: false, message: 'Container ID required' });
            }

            const status = await getStatus(containerId);
            const name = await getName(containerId);
            result.containers.push({
                id: containerId,
                name: name,
                status: status
            });
        }

        console.log(result);
        return res.json(result);
    } catch (err) {
        return res.status(401).json({ ok: false, message: err.message });
    }
});

module.exports = router;
