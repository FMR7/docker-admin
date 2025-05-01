const bcrypt = require('bcrypt');
const usuarioRepo = require('./repository');


async function getUserByUsername(username) {
    try {
        const result = await usuarioRepo.findByUsername(username);
        if (!result) return undefined;  // Si no se encuentra el usuario, devuelve undefined

        // Si se encuentra, devuelve el usuario sin la contraseña
        delete result.password;
        return result;
    } catch (err) {
        console.error('Error al obtener el usuario:', err);
        throw err;
    }
};

async function signin(username, password) {
    const user = await usuarioRepo.findByUsername(username);
    if (!user) throw new Error('Usuario no encontrado o inactivo');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Contraseña incorrecta');

    return { username: user.username };
}

async function signup(username, password) {
    const existingUser = await usuarioRepo.findByUsername(username);
    if (existingUser) throw new Error('El usuario ya existe');

    const newUser = await usuarioRepo.createUser(username, password);
    delete newUser.password;
    return newUser;
}

module.exports = { getUserByUsername, signin: signin, signup: signup };
