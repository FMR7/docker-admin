require('dotenv').config({ path: '../../.env' });
const repo = require('./containerConfigRepository');

async function findAll() {
  try {
    const result = await repo.findAll();
    return !result ? [] : result;
  } catch (err) {
    console.error('Error finding container configs:', err);
    throw err;
  }
};

async function findById(id) {
  try {
    const result = await repo.findById(id);
    return !result ? undefined : result;
  } catch (err) {
    console.error('Error finding container config:', err);
    throw err;
  }
};

async function insert(container_key, name, description, active, admin_only) {
  try {
    if (!container_key) {
      throw new Error('Container key required');
    }
    if (!name) {
      throw new Error('Name required');
    }
    if (active == null || active == undefined) {
      throw new Error('Container key required');
    }
    if (admin_only == null || admin_only == undefined) {
      throw new Error('Admin only required');
    }

    const result = await repo.insert(container_key, name, description, active, admin_only);
    return !result ? undefined : result;
  } catch (err) {
    console.error('Error inserting container config:', err);
    throw err;
  }
};

async function update(container_key, name, description, active, admin_only) {
  try {
    if (!container_key) {
      throw new Error('Container key required');
    }
    if (!name) {
      throw new Error('Name required');
    }
    if (active == null || active == undefined) {
      throw new Error('Container key required');
    }
    if (admin_only == null || admin_only == undefined) {
      throw new Error('Admin only required');
    }

    const result = await repo.update(container_key, name, description, active, admin_only);
    return !result ? undefined : result;
  } catch (err) {
    console.error('Error updating container config:', err);
    throw err;
  }
};

async function deleteContainer(container_key) {
  try {
    if (!container_key) throw new Error('Container key is required');

    const result = await repo.deleteContainer(container_key);
    return !result ? undefined : result;
  } catch (err) {
    console.error('Error deleting container config:', err);
    throw err;
  }
};

module.exports = { findAll, findById, insert, update, deleteContainer };