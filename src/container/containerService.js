const { exec } = require('child_process');

function getStatus(containerId) {
    return new Promise((resolve) => {
        exec(`docker inspect -f '{{.State.Running}}' ${containerId}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error checking status: ${error.message}`);
                return resolve({ ok: false, message: 'Error checking container status' });
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return resolve({ ok: false, message: 'Error checking container status' });
            }

            const running = stdout.trim() === 'true';
            return resolve({ ok: true, running });
        });
    });
}

module.exports = { getStatus };
