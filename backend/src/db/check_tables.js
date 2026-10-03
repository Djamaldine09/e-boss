const mysql = require('mysql2/promise');

/**
 * Check database tables
 */
async function checkTables() {
  let connection;
  
  try {
    // Connect to database
    const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/e_boss';
    connection = await mysql.createConnection({
      uri: dbUrl,
    });
    
    console.log('Connected to database, checking tables...');
    
    // Check if database exists and get tables
    const [tables] = await connection.execute('SHOW TABLES');
    
    console.log(`Found ${tables.length} tables:`);
    tables.forEach((row, index) => {
      console.log(`${index + 1}. ${Object.values(row)[0]}`);
    });
    
    if (tables.length === 0) {
      console.log('No tables found. Database might be empty.');
      
      // Check if we can create a test table
      try {
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS test_table (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255)
          )
        `);
        console.log('Successfully created test table');
        await connection.execute('DROP TABLE IF EXISTS test_table');
        console.log('Successfully dropped test table');
        console.log('Database connection is working. Running migrations...');
        
        // Run migrations
        const { runMigrations } = require('./migrate');
        await runMigrations();
        
      } catch (error) {
        console.error('Error creating test table:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Database connection error:', error.message);
    
    if (error.message.includes('Unknown database')) {
      console.log('Database does not exist. Creating it...');
      
      // Try to create database
      const url = new URL(process.env.DATABASE_URL || 'mysql://root:@localhost:3306/e_boss');
      const dbName = url.pathname.substring(1);
      
      try {
        const connectionWithoutDb = await mysql.createConnection({
          host: url.hostname,
          port: url.port || 3306,
          user: url.username,
          password: url.password,
        });
        
        await connectionWithoutDb.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`Database '${dbName}' created successfully`);
        await connectionWithoutDb.end();
        
        // Now run migrations
        const { runMigrations } = require('./migrate');
        await runMigrations();
        
      } catch (createError) {
        console.error('Error creating database:', createError.message);
      }
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Run check if called directly
 */
if (require.main === module) {
  require('dotenv').config();
  checkTables()
    .then(() => {
      console.log('Database check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkTables };
