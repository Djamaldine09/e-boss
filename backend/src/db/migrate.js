const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

/**
 * Database migration runner
 */
async function runMigrations() {
  let connection;
  
  try {
    // Connect to MySQL without database to create it if needed
    const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/e_boss';
    const url = new URL(dbUrl);
    const dbName = url.pathname.substring(1);
    
    // Connect without specifying database first
    connection = await mysql.createConnection({
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
    });
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`Database '${dbName}' created or already exists`);
    
    // Close connection and reconnect to the specific database
    await connection.end();
    
    connection = await mysql.createConnection({
      uri: dbUrl,
    });
    
    console.log('Connected to database, running migrations...');
    
    // Read and execute migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = await fs.readdir(migrationsDir);
    
    // Sort migration files to ensure proper order
    migrationFiles.sort();
    
    for (const file of migrationFiles) {
      if (file.endsWith('.sql')) {
        console.log(`Running migration: ${file}`);
        
        const migrationPath = path.join(migrationsDir, file);
        const migrationSQL = await fs.readFile(migrationPath, 'utf8');
        
        // Split SQL file into individual statements
        const statements = migrationSQL
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        // Execute each statement
        for (const statement of statements) {
          try {
            await connection.execute(statement);
          } catch (error) {
            // Skip errors for "IF NOT EXISTS" statements that might already exist
            if (!error.message.includes('already exists') && !error.message.includes('Duplicate key name')) {
              throw error;
            }
          }
        }
        
        console.log(`Migration ${file} completed successfully`);
      }
    }
    
    console.log('All migrations completed successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Run migrations if called directly
 */
if (require.main === module) {
  require('dotenv').config();
  runMigrations()
    .then(() => {
      console.log('Database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };
