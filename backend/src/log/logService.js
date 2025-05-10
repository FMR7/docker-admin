require('dotenv').config({ path: '../../.env' });
const logRepo = require('./logRepository');

const ACTIONS = Object.freeze({
  USER_CREATE: 'USER_CREATE',
  USER_LOGIN: 'USER_LOGIN',
  USER_DELETE: 'USER_DELETE',
  USER_ACTIVATE_TRUE: 'USER_ACTIVATE_TRUE',
  USER_ACTIVATE_FALSE: 'USER_ACTIVATE_FALSE',
  USER_ADMIN_TRUE: 'USER_ADMIN_TRUE',
  USER_ADMIN_FALSE: 'USER_ADMIN_FALSE',
  CONTAINER_TURN_ON: 'CONTAINER_TURN_ON',
  CONTAINER_TURN_OFF: 'CONTAINER_TURN_OFF',
});

async function findAll() {
  try {
    const result = await logRepo.findAll();
    return !result ? [] : result;
  } catch (err) {
    console.error('Error finding user:', err);
    throw err;
  }
};

async function insert(username, action, detail) {
  if (process.env.ENABLE_DB_LOGS !== 'true') {
    console.log('DB logs are disabled. Skipping log insertion.');
    return;
  }
  
  try {
    if (!username || !action) throw new Error('Username and action are required');
    if (!Object.values(ACTIONS).includes(action)) throw new Error('Invalid action');

    const result = await logRepo.insert(username, action, detail);
    return !result ? undefined : result;
  }
  catch (err) {
    console.error('Error inserting log:', err);
    throw err;
  }
}

module.exports = { findAll, insert, ACTIONS };
