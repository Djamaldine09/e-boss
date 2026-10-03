const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function createTablesDirectly() {
  let connection;
  
  try {
    // Connect to MySQL
    const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/e_boss';
    const url = new URL(dbUrl);
    const dbName = url.pathname.substring(1);
    
    connection = await mysql.createConnection({
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: dbName,
    });
    
    console.log('Connected to database, creating tables directly...');
    
    // Read and execute the first migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_create_tables.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    console.log('Migration SQL content preview:', migrationSQL.substring(0, 200));
    
    // Split SQL file into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements:`);
    statements.forEach((stmt, i) => console.log(`${i + 1}: ${stmt.substring(0, 100)}...`));
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await connection.execute(statement);
        console.log(`Statement ${i + 1} executed successfully`);
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`, error.message);
        console.log('Statement:', statement.substring(0, 100) + '...');
      }
    }
    
    // Check if tables were created
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`\nTables created successfully! Found ${tables.length} tables:`);
    tables.forEach((row, index) => {
      const tableName = Object.values(row)[0];
      console.log(`  ${index + 1}. ${tableName}`);
    });
    
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTablesDirectly();
