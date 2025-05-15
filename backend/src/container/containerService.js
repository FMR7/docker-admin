const { exec } = require('child_process');
const containerConfigService = require('../containerConfig/containerConfigService');

function validateContainer(containerId) {
  return new Promise((resolve, reject) => {
    try {
      const containerConfigs = containerConfigService.findAll();

      if (!containerConfigs) {
        return reject(new Error(`Container ${containerId} not found`));
      }

      if (containerConfigs.some((containerConfig) => containerConfig.container_key === containerId)) {
        return resolve(true);
      }

      return reject(new Error(`Container ${containerId} not found`));

    } catch (err) {
      console.error(`Error checking status: ${err.message}`);
      return reject(new Error('Error checking container status'));
    }
  });
}

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

function controlContainer(action, containerId, isAdmin) {
  return new Promise((resolve, reject) => {
    try {
      containerConfigService.findById(containerId).then((containerConfig) => {
        if (!containerConfig) {
          return reject(new Error(`Container ${containerId} not found`));
        }

        if (containerConfig.admin_only && !isAdmin) {
          return reject(new Error(`Container ${containerId} is admin only`));
        }

        if (!containerConfig.active) {
          return reject(new Error(`Container ${containerId} is disabled`));
        }

        exec(`docker ${action} ${containerId}`, (error, stdout, stderr) => {
          if (error || stderr) {
            const errorMsg = `Error ${action === 'start' ? 'turning on' : 'turning off'} container: ${error?.message || stderr}`;
            console.error(errorMsg);
            return reject(new Error(errorMsg));
          }
          console.log(`Container ${action === 'start' ? 'turned on' : 'turned off'}: ${stdout}`);
          return resolve({ ok: true, message: `Container ${action === 'start' ? 'turned on' : 'turned off'}` });
        });
      })
    } catch (err) {
      const errorMsg = `Unexpected error when trying to ${action} container: ${err.message}`;
      console.error(errorMsg);
      return reject(new Error(errorMsg));
    }
  });
}

function turnOnContainer(containerId, isAdmin) {
  return controlContainer('start', containerId, isAdmin);
}

function turnOffContainer(containerId, isAdmin) {
  return controlContainer('stop', containerId, isAdmin);
}

async function getContainers(isAdmin) {
  try {
    const containerConfigsAll = await containerConfigService.findAll();
    const containers = [];

    await Promise.all(containerConfigsAll.map(async (containerConfig) => {
      if (!containerConfig.container_key) throw new Error('Container ID required');
      if (!isAdmin && containerConfig.admin_only) return;
      if (!containerConfig.active) return;

      const status = await getStatus(containerConfig.container_key);
      containers.push({
        container_key: containerConfig.container_key,
        name: containerConfig.name,
        description: containerConfig.description,
        status
      });
    }));

    return containers;
  } catch (err) {
    console.error(err);
    throw new Error('Error getting containers');
  }
}

module.exports = { validateContainer, getStatus, getName, turnOnContainer, turnOffContainer, getContainers };
