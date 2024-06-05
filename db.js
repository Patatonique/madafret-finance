const { createConnection } = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

async function connect() {
  try {
    const connection = await createConnection(config);
    console.log('Database connection successful');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

module.exports = { connect };
