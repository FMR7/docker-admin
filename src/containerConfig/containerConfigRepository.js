const db = require('../config/db');

async function findAll() {
  const res = await db.query('SELECT * FROM public.container_config ORDER BY name');
  return res.rows;
}

async function insert(container_key, name) {
  const res = await db.query(
    'INSERT INTO log (container_key, name) VALUES ($1, $2) RETURNING *',
    [container_key, name]
  );
  return res.rows[0];
}

async function update(container_key, name) {
  const res = await db.query(
    'UPDATE container_config SET name = $2 WHERE container_key = $1 RETURNING *',
    [container_key, name]
  );
  return res.rows[0];
}

async function deleteContainer(container_key) {
  const res = await db.query('DELETE FROM container_config WHERE container_key = $1 RETURNING *', [container_key]);
  return res.rows[0];
}

module.exports = { findAll, insert, update, deleteContainer };
