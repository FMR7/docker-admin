const db = require('../config/db');
const bcrypt = require('bcrypt');

async function findByUsername(username) {
    const res = await db.query('SELECT * FROM public.usuarios WHERE username = $1', [username]);
    return res.rows[0];
}

async function createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await db.query(
        'INSERT INTO usuarios (username, password, active) VALUES ($1, $2, $3) RETURNING *',
        [username, hashedPassword, false]
    );
    return res.rows[0];
}

module.exports = { findByUsername, createUser };
