const db = require('../config/db');
const bcrypt = require('bcrypt');

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

module.exports = { findByUsername, findByUsernameAndActive, createUser };
