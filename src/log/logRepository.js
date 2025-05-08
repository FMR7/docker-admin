const db = require('../config/db');

async function findAll() {
  const res = await db.query('SELECT * FROM public.log ORDER BY fecha DESC');
  return res.rows;
}

async function insert(username, action, detail) {
  const res = await db.query(
    'INSERT INTO log (username, action, detail) VALUES ($1, $2, $3) RETURNING *',
    [username, action, detail]
  );
  return res.rows[0];
}

module.exports = { findAll, insert };
