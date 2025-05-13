const db = require('../config/db');

async function findAll() {
  const res = await db.query('SELECT * FROM public.container_config ORDER BY name');
  return res.rows;
}

async function findById(id) {
  const res = await db.query('SELECT * FROM public.container_config WHERE container_key = $1', [id]);
  return res.rows[0];
}

async function insert(container_key, name, description, active, admin_only) {
  const res = await db.query(
    'INSERT INTO container_config (container_key, name, description, active, admin_only) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [container_key, name, description, active, admin_only]
  );
  return res.rows[0];
}

async function update(container_key, name, description, active, admin_only) {
  const res = await db.query(
    'UPDATE container_config SET name = $2, description = $3, active = $4, admin_only = $5 WHERE container_key = $1 RETURNING *',
    [container_key, name, description, active, admin_only]
  );
  return res.rows[0];
}

async function deleteContainer(container_key) {
  const res = await db.query('DELETE FROM container_config WHERE container_key = $1 RETURNING *', [container_key]);
  return res.rows[0];
}

module.exports = { findAll, insert, update, deleteContainer };
