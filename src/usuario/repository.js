const db = require('../config/db');
const bcrypt = require('bcrypt');

async function findAll() {
    const res = await db.query('SELECT * FROM public.usuarios');
    return res.rows;
}

async function findByUsername(username) {
    const res = await db.query('SELECT * FROM public.usuarios WHERE username = $1', [username]);
    return res.rows[0];
}

async function findByUsernameAndActive(username) {
    const res = await db.query('SELECT * FROM public.usuarios WHERE username = $1 and active = true', [username]);
    return res.rows[0];
}

async function createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await db.query(
        'INSERT INTO usuarios (username, password, password_wrong_tries, active, admin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, hashedPassword, 0, false, false]
    );
    return res.rows[0];
}

async function updatePasswordWrongTries(username) {
    const res = await db.query('UPDATE usuarios SET password_wrong_tries = password_wrong_tries + 1 WHERE username = $1 RETURNING *', [username]);
    return res.rows[0];
}

async function disableUser(username) {
    const res = await db.query('UPDATE usuarios SET active = false, password_wrong_tries = 0 WHERE username = $1 RETURNING *', [username]);
    return res.rows[0];
}

module.exports = { findAll, findByUsername, findByUsernameAndActive, createUser, updatePasswordWrongTries, disableUser };
