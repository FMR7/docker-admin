const express = require('express');
const router = express.Router();
const { getStatus, getName } = require('./containerService');

router.get('/container/status/:containerId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }

    const { containerId } = req.params;
    if (!containerId) {
        return res.status(400).json({ ok: false, message: 'Container ID required' });
    }

    if (!process.env.CONTAINERS.includes(containerId)) {
        return res.status(400).json({ ok: false, message: 'Invalid container ID' });
    }

    const result = await getStatus(containerId);
    if (!result.ok) {
        return res.status(500).json({ ok: false, message: result.message });
    }
    return res.json(result);
});

router.get('/container/turn-on/:containerId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }

    const { containerId } = req.params;
    if (!containerId) {
        return res.status(400).json({ ok: false, message: 'Container ID required' });
    }

    if (!process.env.CONTAINERS.includes(containerId)) {
        return res.status(400).json({ ok: false, message: 'Invalid container ID' });
    }

    try {
        const { exec } = require('child_process');
        exec(`docker start ${containerId}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error turning on container: ${error.message}`);
                return res.status(500).json({ ok: false, message: 'Error turning on container' });
            }
            if (stderr) {
                console.error(`Error turning on container: ${stderr}`);
                return res.status(500).json({ ok: false, message: 'Error turning on container' });
            }
            console.log(`Container turned on: ${stdout}`);
            return res.json({ ok: true, message: 'Container turned on' });
        });
    } catch (err) {
        return res.status(401).json({ ok: false, message: err.message });
    }
});

router.get('/container/turn-off/:containerId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }

    const { containerId } = req.params;
    if (!containerId) {
        return res.status(400).json({ ok: false, message: 'Container ID required' });
    }

    if (!process.env.CONTAINERS.includes(containerId)) {
        return res.status(400).json({ ok: false, message: 'Invalid container ID' });
    }

    try {
        const { exec } = require('child_process');
        exec(`docker stop ${containerId}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error turning on container: ${error.message}`);
                return res.status(500).json({ ok: false, message: 'Error turning off container' });
            }
            if (stderr) {
                console.error(`Error turning on container: ${stderr}`);
                return res.status(500).json({ ok: false, message: 'Error turning off container' });
            }
            console.log(`Container turned on: ${stdout}`);
            return res.json({ ok: true, message: 'Container turned off' });
        });
    } catch (err) {
        return res.status(401).json({ ok: false, message: err.message });
    }
});

router.get('/container', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }

    try {
        let result = {ok: true, containers: []};
        const containerIds = process.env.CONTAINERS.split(',');
        for (const containerId of containerIds) {
            if (!containerId) {
                return res.status(400).json({ ok: false, message: 'Container ID required' });
            }

            const status = await getStatus(containerId);
            const name = await getName(containerId);
            result.containers.push = {
                id: containerId,
                name: name,
                status: status
            };
        }        

        console.log(result);
        return res.json(result);
    } catch (err) {
        return res.status(401).json({ ok: false, message: err.message });
    }
});

module.exports = router;
