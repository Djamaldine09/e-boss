const mysql = require('mysql2/promise');

async function checkTables() {
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
    
    console.log('Connected to database, checking tables...');
    
    // Get all tables
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('No tables found. Database might be empty.');
    } else {
      console.log(`Found ${tables.length} tables:`);
      tables.forEach((row, index) => {
        const tableName = Object.values(row)[0];
        console.log(`  ${index + 1}. ${tableName}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkTables();
