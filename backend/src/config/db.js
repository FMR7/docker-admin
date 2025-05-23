if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../../.env' });
}
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: `-c search_path=${process.env.DB_SCHEMA || 'public'}`
});

module.exports = pool;
