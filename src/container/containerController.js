const express = require('express');
const router = express.Router();
const { getStatus } = require('./containerService');

router.get('/container/status/:containerId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }

    const { containerId } = req.params;
    if (!containerId) {
        return res.status(400).json({ ok: false, message: 'Container ID required' });
    }

    const containerIds = [process.env.CONTAINER_ID_MINECRAFT, process.env.CONTAINER_ID_VINTAGESTORY];
    if (!containerIds.includes(containerId)) {
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

    const containerIds = [process.env.CONTAINER_ID_MINECRAFT, process.env.CONTAINER_ID_VINTAGESTORY];
    if (!containerIds.includes(containerId)) {
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

    const containerIds = [process.env.CONTAINER_ID_MINECRAFT, process.env.CONTAINER_ID_VINTAGESTORY];
    if (!containerIds.includes(containerId)) {
        return res.status(400).json({ ok: false, message: 'Invalid container ID' });
    }

    try {
        const { exec } = require('child_process');
        exec(`docker stop ${containerId}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error turning on container: ${error.message}`);
                return res.status(500).json({ ok: false, message: 'Error turning on container' });
            }
            if (stderr) {
                console.error(`Error turning on container: ${stderr}`);
                return res.status(500).json({ ok: false, message: 'Error turning on container' });
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
        const minecraftStatus = await getStatus(process.env.CONTAINER_ID_MINECRAFT);
        const vintageStoryStatus = await getStatus(process.env.CONTAINER_ID_VINTAGESTORY);

        const result = {
            minecraft: {
                id: process.env.CONTAINER_ID_MINECRAFT,
                name: 'Minecraft',
                status: minecraftStatus
            },
            vintageStory: {
                id: process.env.CONTAINER_ID_VINTAGESTORY,
                name: 'Vintage Story',
                status: vintageStoryStatus
            }
        };

        console.log(result);
        return res.json(result);
    } catch (err) {
        return res.status(401).json({ ok: false, message: err.message });
    }
}
);

module.exports = router;
