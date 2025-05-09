require('dotenv').config({ path: '../../.env' });
const repo = require('./containerConfigRepository');

async function findAll() {
  try {
    const result = await repo.findAll();
    return !result ? [] : result;
  } catch (err) {
    console.error('Error finding user:', err);
    throw err;
  }
};

async function insert(container_key, name) {
  try {
    if (!container_key || !name) throw new Error('Container key and name are required');

    const result = await repo.insert(container_key, name);
    return !result ? undefined : result;
  } catch (err) {
    console.error('Error inserting container config:', err);
    throw err;
  }
};

async function update(container_key, name) {
  try {
    if (!container_key || !name) throw new Error('Container key and name are required');

    const result = await repo.update(container_key, name);
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

module.exports = { findAll, insert, update, deleteContainer };