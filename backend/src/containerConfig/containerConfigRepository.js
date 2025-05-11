const db = require('../config/db');

async function findAll() {
  const res = await db.query('SELECT * FROM public.container_config ORDER BY name');
  return res.rows;
}

async function insert(container_key, name, description, active) {
  const res = await db.query(
    'INSERT INTO log (container_key, name, description, active) VALUES ($1, $2, $3, $4) RETURNING *',
    [container_key, name, description, active]
  );
  return res.rows[0];
}

async function update(container_key, name, description, active) {
  const res = await db.query(
    'UPDATE container_config SET name = $2, description = $3, active = $4 WHERE container_key = $1 RETURNING *',
    [container_key, name, description, active]
  );
  return res.rows[0];
}

async function setActive(container_key, active) {
  const res = await db.query('UPDATE container_config SET active = $1 WHERE container_key = $2 RETURNING *', [active, container_key]);
  return res.rows[0];
}

async function deleteContainer(container_key) {
  const res = await db.query('DELETE FROM container_config WHERE container_key = $1 RETURNING *', [container_key]);
  return res.rows[0];
}

module.exports = { findAll, insert, update, setActive, deleteContainer };
