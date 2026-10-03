const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

/**
 * Database migration runner
 *
 * Connects directly to the database specified by DATABASE_URL.
 * This is required for managed MySQL services such as Aiven, where
 * the application user should not need CREATE DATABASE privileges.
 */
async function runMigrations() {
  let connection;

  try {
    const dbUrl =
      process.env.DATABASE_URL || 'mysql://root:@localhost:3306/e_boss';

    // Connect directly to the configured database.
    connection = await mysql.createConnection({
      uri: dbUrl,
    });

    console.log('Connected to database, running migrations...');

    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);

      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = await fs.readFile(migrationPath, 'utf8');

      // Remove SQL line comments before splitting statements.
      // Previously, a CREATE TABLE preceded by a comment was discarded
      // because the whole statement started with "--", so no tables were created.
      const cleanedSQL = migrationSQL
        .replace(/^\s*--.*$/gm, '')
        .trim();

      const statements = cleanedSQL
        .split(';')
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      for (const statement of statements) {
        try {
          await connection.execute(statement);
        } catch (error) {
          // Safe to ignore idempotency errors from IF NOT EXISTS / duplicate indexes.
          if (
            !error.message.includes('already exists') &&
            !error.message.includes('Duplicate key name') &&
            !error.message.includes('Duplicate column name')
          ) {
            throw error;
          }
        }
      }

      console.log(`Migration ${file} completed successfully`);
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
