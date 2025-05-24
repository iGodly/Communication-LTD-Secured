require('dotenv').config();
const pool = require('./src/config/database');

async function testConnection() {
  try {
    // Test basic connection
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    
    // Test database selection
    await connection.query('USE communication_ltd2');
    console.log('Successfully selected database: communication_ltd2');
    
    // Test table creation
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\nExisting tables:');
    tables.forEach(table => {
      console.log(`- ${Object.values(table)[0]}`);
    });
    
    connection.release();
  } catch (error) {
    console.error('Database connection test failed:', error);
  } finally {
    process.exit();
  }
}

testConnection(); 