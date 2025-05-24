const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function initializeDatabase() {
  try {
    console.log('[DB INIT] Reading schema file...');
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('[DB INIT] Splitting schema into statements...');
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .filter(statement => statement.trim())
      .map(statement => statement + ';');

    console.log(`[DB INIT] Executing ${statements.length} statements...`);
    // Execute each statement
    for (const statement of statements) {
      console.log('[DB INIT] Executing statement:', statement.substring(0, 80).replace(/\n/g, ' ') + (statement.length > 80 ? '...' : ''));
      await pool.query(statement);
    }

    console.log('[DB INIT] Database schema initialized successfully');
  } catch (error) {
    console.error('[DB INIT] Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase; 