const express = require('express');
const router = express.Router();


router.get('/container', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }

    try {
        return res.json({ ok: true, message: 'Containers status' });
    } catch (err) {
        return res.status(401).json({ ok: false, message: err.message });
    }
});

router.get('/container/turn-on/:containerId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }

    const { containerId } = req.params;
    if (!containerId) {
        return res.status(400).json({ ok: false, message: 'Container ID required' });
    }

    // TODO move to env
    const minecraftServerContainerId = '266bb1d1af974856308a5d46a8e10b5468fba7f848215ff12637877a073c52cd';
    const vintageStoryServerContainerId = '13891f9cd5204912f44f64d684849640725dd4f3a8638434f9467c566b304f05';
    const containerIds = [minecraftServerContainerId, vintageStoryServerContainerId];
    if (!containerIds.includes(containerId)) {
        return res.status(400).json({ ok: false, message: 'Invalid container ID' });
    }

    try {
        // execute command to turn on the container
        const { exec } = require('child_process');
        exec(`echo ${containerId}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error turning on container: ${error.message}`);
                return res.status(500).json({ ok: false, message: 'Error turning on container' });
            }
            if (stderr) {
                console.error(`Error turning on container: ${stderr}`);
                return res.status(500).json({ ok: false, message: 'Error turning on container' });
            }
            console.log(`Container turned on: ${stdout}`);
        });
        return res.json({ ok: true, message: 'Container turned on' });
    } catch (err) {
        return res.status(401).json({ ok: false, message: err.message });
    }
    
});

module.exports = router;
