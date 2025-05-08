const { exec } = require('child_process');

function getStatus(containerId) {
  return new Promise((resolve, reject) => {
    try {
      exec(`docker inspect -f '{{.State.Running}}' ${containerId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error checking status: ${error.message}`);
          return reject(new Error('Error checking container status'));
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return reject(new Error('Error checking container status'));
        }

        return resolve(stdout.trim().replace("\n", "") === 'true');
      });
    } catch (err) {
      console.error(`Error checking status: ${err.message}`);
      return reject(new Error('Error checking container status'));
    }
  });
}

function getName(containerId) {
  return new Promise((resolve, reject) => {
    try {
      exec(`docker inspect -f '{{.Name}}' ${containerId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error checking status: ${error.message}`);
          return reject(new Error('Error checking container name'));
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return reject(new Error('Error checking container name'));
        }

        return resolve(stdout.trim().replace("\n", "").replace("/", ""));
      });
    } catch (err) {
      console.error(`Error checking name: ${err.message}`);
      return reject(new Error('Error checking container name'));
    }
  });
}

function turnOnContainer(containerId) {
  return new Promise((resolve, reject) => {
    try {
      const { exec } = require('child_process');
      exec(`docker start ${containerId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error turning on container: ${error.message}`);
          return reject(new Error('Error turning on container'));
        }
        if (stderr) {
          console.error(`Error turning on container: ${stderr}`);
          return reject(new Error('Error turning on container'));
        }
        console.log(`Container turned on: ${stdout}`);
        return resolve({ ok: true, message: 'Container turned on' });
      });
    } catch (err) {
      console.error(`Error turning on container: ${err.message}`);
      return reject(new Error('Error turning on container'));
    }
  });
}

function turnOffContainer(containerId) {
  return new Promise((resolve, reject) => {
    try {
      const { exec } = require('child_process');
      exec(`docker stop ${containerId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error turning off container: ${error.message}`);
          return reject(new Error('Error turning off container'));
        }
        if (stderr) {
          console.error(`Error turning off container: ${stderr}`);
          return reject(new Error('Error turning off container'));
        }
        console.log(`Container turned off: ${stdout}`);
        return resolve({ ok: true, message: 'Container turned off' });
      });
    } catch (err) {
      console.error(`Error turning off container: ${err.message}`);
      return reject(new Error('Error turning off container'));
    }
  });
}

function getContainers() {
  return new Promise((resolve, reject) => {
    const containerIds = process.env.CONTAINERS.split(',');
    const containers = [];

    Promise.all(containerIds.map(async (containerId) => {
      if (!containerId) throw new Error('Container ID required');
      const status = await getStatus(containerId);
      const name = await getName(containerId);
      containers.push({ id: containerId, name, status });
    }))
      .then(() => {
        console.log(containers);
        resolve(containers);
      })
      .catch((err) => {
        reject(new Error('Error getting containers'));
      });
  });
}


module.exports = { getStatus, getName, turnOnContainer, turnOffContainer, getContainers };
