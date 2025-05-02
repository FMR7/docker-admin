const { exec } = require('child_process');

function getStatus(containerId) {
    return new Promise((resolve) => {
        try {
            exec(`docker inspect -f '{{.State.Running}}' ${containerId}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error checking status: ${error.message}`);
                    return resolve({ ok: false, message: 'Error checking container status' });
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    return resolve({ ok: false, message: 'Error checking container status' });
                }

                return resolve({ ok: stdout.trim().replace("\n", "") === 'true'});
            });
        } catch (err) {
            return resolve({ ok: false, message: 'Error checking container status' });
        }
    });
}

module.exports = { getStatus };
