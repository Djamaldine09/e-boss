/**
 * Database connection utilities (optional for MVP)
 */

const mysql = require('mysql2/promise');

/**
 * Connect to MySQL
 */
async function connectMySQL() {
  try {
    const connection = await mysql.createConnection({
      uri: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/e_boss',
    });
    
    console.log('Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('MySQL connection error:', error);
    throw error;
  }
}

/**
 * Connect to MongoDB
 */
async function connectMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/education-platform';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Connect to PostgreSQL (alternative)
 */
async function connectPostgreSQL() {
  try {
    const { Pool } = require('pg');
    
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URI,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    
    await pool.connect();
    console.log('Connected to PostgreSQL');
    return pool;
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    throw error;
  }
}

/**
 * Database connection manager
 */
class DatabaseManager {
  constructor() {
    this.connection = null;
    this.type = process.env.DB_TYPE || 'mysql'; // 'mysql', 'mongodb', 'postgresql', or 'none'
  }
  
  async connect() {
    switch (this.type) {
      case 'mysql':
        this.connection = await connectMySQL();
        break;
      case 'mongodb':
        this.connection = await connectMongoDB();
        break;
      case 'postgresql':
        this.connection = await connectPostgreSQL();
        break;
      case 'none':
        console.log('Running without database (MVP mode)');
        break;
      default:
        throw new Error(`Unsupported database type: ${this.type}`);
    }
  }
  
  async disconnect() {
    if (this.connection) {
      if (this.type === 'mysql') {
        await this.connection.end();
      } else if (this.type === 'mongodb') {
        await mongoose.connection.close();
      } else if (this.type === 'postgresql') {
        await this.connection.end();
      }
      console.log('Database connection closed');
    }
  }
  
  isConnected() {
    return this.connection !== null;
  }
}

// Singleton instance
const dbManager = new DatabaseManager();

module.exports = {
  connectMySQL,
  connectMongoDB,
  connectPostgreSQL,
  DatabaseManager,
  dbManager,
};
