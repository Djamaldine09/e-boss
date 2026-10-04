const mysql = require('mysql2/promise');

async function connectMySQL() {
  const databaseUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/e_boss';
  const pool = mysql.createPool(databaseUrl);
  await pool.query('SELECT 1');
  console.log('Connected to MySQL database (pool)');
  return pool;
}

class DatabaseManager {
  constructor() {
    this.connection = null;
    this.type = process.env.DB_TYPE || 'mysql';
  }

  async connect() {
    if (this.type === 'mysql') {
      this.connection = await connectMySQL();
    } else if (this.type === 'none') {
      console.log('Running without database (MVP mode)');
    } else {
      throw new Error('Unsupported database type: ' + this.type);
    }
  }

  async disconnect() {
    if (!this.connection) return;
    await this.connection.end();
    this.connection = null;
    console.log('Database connection closed');
  }

  isConnected() {
    return this.connection !== null;
  }
}

const dbManager = new DatabaseManager();

module.exports = { connectMySQL, DatabaseManager, dbManager };
