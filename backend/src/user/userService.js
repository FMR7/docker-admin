const bcrypt = require('bcrypt');
const usuarioRepo = require('./userRepository');


async function findAll() {
  try {
    const result = await usuarioRepo.findAll();
    if (!result) return [];

    result.forEach(user => { delete user.password; });
    return result;
  } catch (err) {
    console.error('Error finding user:', err);
    throw err;
  }
};

async function getUserByUsername(username) {
  try {
    const result = await usuarioRepo.findByUsername(username);
    if (!result) return undefined;

    delete result.password;
    return result;
  } catch (err) {
    console.error('Error finding user:', err);
    throw err;
  }
};

async function getUserByUsernameAndActive(username) {
  try {
    const result = await usuarioRepo.findByUsernameAndActive(username);
    if (!result) return undefined;

    delete result.password;
    return result;
  } catch (err) {
    console.error('Error finding user:', err);
    throw err;
  }
};

async function signin(username, password) {
  const user = await usuarioRepo.findByUsernameAndActive(username);
  if (!user) throw new Error('User not found or inactive');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const updatedUser = await usuarioRepo.updatePasswordWrongTries(user.username);
    if (updatedUser.password_wrong_tries >= 3) {
      await usuarioRepo.setActive(user.username, false);
      throw new Error('User disabled due to too many failed login attempts. Contact admin.');
    }

    throw new Error('Invalid password');
  } else {
    await usuarioRepo.resetPasswordWrongTries(user.username);
    return { username: user.username, active: user.active, admin: user.admin };
  }
}

async function signup(username, password) {
  const existingUser = await usuarioRepo.findByUsername(username);
  if (existingUser) throw new Error('User already exists');

  const newUser = await usuarioRepo.createUser(username, password);
  delete newUser.password;
  return newUser;
}

async function deleteUser(username) {
  const user = await usuarioRepo.findByUsername(username);
  if (!user) throw new Error('User not found');

  const deletedUser = await usuarioRepo.deleteUser(user.username);
  delete deletedUser.password;
  return deletedUser;
}

async function setActive(username, active) {
  const user = await usuarioRepo.findByUsername(username);
  if (!user) throw new Error('User not found');

  const updatedUser = await usuarioRepo.setActive(user.username, active);
  delete updatedUser.password;
  return updatedUser;
}

async function setAdmin(username, admin) {
  const user = await usuarioRepo.findByUsername(username);
  if (!user) throw new Error('User not found');

  const updatedUser = await usuarioRepo.setAdmin(user.username, admin);
  delete updatedUser.password;
  return updatedUser;
}

module.exports = { findAll, getUserByUsername, getUserByUsernameAndActive, signin, signup, deleteUser, setActive, setAdmin };
