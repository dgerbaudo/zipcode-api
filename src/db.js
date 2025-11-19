const { Pool } = require('pg');
require('dotenv').config();

const useSsl = process.env.DB_SSL === 'true';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 21212,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
