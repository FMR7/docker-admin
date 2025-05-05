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
            console.error(`Error checking status: ${err.message}`);
            return resolve({ ok: false, message: 'Error checking container status' });
        }
    });
}

function getName(containerId) {
    return new Promise((resolve) => {
        try {
            exec(`docker inspect -f '{{.Name}}' ${containerId} | sed 's/^\/\+//'`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error checking status: ${error.message}`);
                    return resolve({ ok: false, message: 'Error checking container name' });
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    return resolve({ ok: false, message: 'Error checking container name' });
                }

                return resolve({ ok: stdout.trim().replace("\n", "")});
            });
        } catch (err) {
            console.error(`Error checking name: ${err.message}`);
            return resolve({ ok: false, message: 'Error checking container name' });
        }
    });
}

module.exports = { getStatus, getName };
