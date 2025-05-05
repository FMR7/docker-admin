const { exec } = require('child_process');

function getStatus(containerId) {
    return new Promise((resolve) => {
        try {
            exec(`docker inspect -f '{{.State.Running}}' ${containerId}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error checking status: ${error.message}`);
                    throw new Error('Error checking container status');
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    throw new Error('Error checking container status');
                }

                return resolve(stdout.trim().replace("\n", "") === 'true');
            });
        } catch (err) {
            console.error(`Error checking status: ${err.message}`);
            throw new Error('Error checking container status');
        }
    });
}

function getName(containerId) {
    return new Promise((resolve) => {
        try {
            exec(`docker inspect -f '{{.Name}}' ${containerId}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error checking status: ${error.message}`);
                    throw new Error('Error checking container name');
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    throw new Error('Error checking container name');
                }

                return resolve(stdout.trim().replace("\n", "").replace("/", ""));
            });
        } catch (err) {
            console.error(`Error checking name: ${err.message}`);
            throw new Error('Error checking container name');
        }
    });
}

module.exports = { getStatus, getName };
