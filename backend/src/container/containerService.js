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

function controlContainer(action, containerId) {
  return new Promise((resolve, reject) => {
    try {
      exec(`docker ${action} ${containerId}`, (error, stdout, stderr) => {
        if (error || stderr) {
          const errorMsg = `Error ${action === 'start' ? 'turning on' : 'turning off'} container: ${error?.message || stderr}`;
          console.error(errorMsg);
          return reject(new Error(errorMsg));
        }
        console.log(`Container ${action === 'start' ? 'turned on' : 'turned off'}: ${stdout}`);
        return resolve({ ok: true, message: `Container ${action === 'start' ? 'turned on' : 'turned off'}` });
      });
    } catch (err) {
      const errorMsg = `Unexpected error when trying to ${action} container: ${err.message}`;
      console.error(errorMsg);
      return reject(new Error(errorMsg));
    }
  });
}

function turnOnContainer(containerId) {
  return controlContainer('start', containerId);
}

function turnOffContainer(containerId) {
  return controlContainer('stop', containerId);
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
