const Docker = require('dockerode');
const os = require('os');
const socketPath = os.platform() === 'win32' 
  ? '//./pipe/docker_engine' 
  : '/var/run/docker.sock';
const docker = new Docker({ socketPath });
const containerConfigService = require('../containerConfig/containerConfigService');

async function validateContainer(containerId) {
  try {
    const containerConfigs = await containerConfigService.findAll();
    if (!containerConfigs) {
      throw new Error(`Container ${containerId} not found`);
    }

    const isValid = containerConfigs.some(
      (containerConfig) => containerConfig.container_key === containerId
    );

    if (!isValid) {
      throw new Error(`Container ${containerId} not found`);
    }

    return true;
  } catch (err) {
    console.error(`Error validating container: ${err.message}`);
    throw new Error('Error checking container status');
  }
}

async function getStatus(containerId) {
  try {
    const container = docker.getContainer(containerId);
    const data = await container.inspect();
    return data.State.Running;
  } catch (err) {
    console.error(`Error checking status: ${err.message}`);
    throw new Error('Error checking status');
  }
}

async function getName(containerId) {
  try {
    const container = docker.getContainer(containerId);
    const data = await container.inspect();
    return data.Name.replace('/', '');
  } catch (err) {
    console.error(`Error checking name: ${err.message}`);
    throw new Error('Error checking container name');
  }
}

async function controlContainer(action, containerId, isAdmin) {
  try {
    const containerConfig = await containerConfigService.findById(containerId);

    if (!containerConfig) {
      throw new Error(`Container ${containerId} not found`);
    }

    if (containerConfig.admin_only && !isAdmin) {
      throw new Error(`Container ${containerId} is admin only`);
    }

    if (!containerConfig.active) {
      throw new Error(`Container ${containerId} is disabled`);
    }

    const container = docker.getContainer(containerId);
    await (action === 'start' ? container.start() : container.stop());

    console.log(`Container ${action === 'start' ? 'turned on' : 'turned off'}`);
    return {
      ok: true,
      message: `Container ${action === 'start' ? 'turned on' : 'turned off'}`
    };
  } catch (err) {
    const errorMsg = `Unexpected error when trying to ${action} container: ${err.message}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

function turnOnContainer(containerId, isAdmin) {
  return controlContainer('start', containerId, isAdmin);
}

function turnOffContainer(containerId, isAdmin) {
  return controlContainer('stop', containerId, isAdmin);
}

async function getContainers(isAdmin) {
  const messages = [];
  try {
    const containerConfigsAll = await containerConfigService.findAll();
    const containers = [];

    await Promise.all(containerConfigsAll.map(async (containerConfig) => {
      if (!containerConfig.container_key) throw new Error('Container ID required');
      if (!isAdmin && containerConfig.admin_only) return;
      if (!containerConfig.active) return;

      try {
        const status = await getStatus(containerConfig.container_key);
        containers.push({
          container_key: containerConfig.container_key,
          name: containerConfig.name,
          description: containerConfig.description,
          status
        });
      } catch (err) {
        messages.push(`${err.message} for <strong>${containerConfig.name}</strong>`);
      }
    }));

    // Sort by status and name
    containers.sort((a, b) => {
      if (a.status && !b.status) return -1;
      if (!a.status && b.status) return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    })

    // Sort messages
    messages.sort();

    return { containers, messages };
  } catch (err) {
    console.error(err);
    throw new Error('Error getting containers');
  }
}

module.exports = {
  validateContainer,
  getStatus,
  getName,
  turnOnContainer,
  turnOffContainer,
  getContainers
};
