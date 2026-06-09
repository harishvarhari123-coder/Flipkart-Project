const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function importSQL() {
  console.log('Connecting to Aiven Cloud Database...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connected! Reading SQL file...');
    const sql = fs.readFileSync('../database_queries.sql', 'utf8');
    
    console.log('Executing SQL queries...');
    await connection.query(sql);
    console.log('✅ Database imported successfully!');
  } catch (err) {
    console.error('❌ Error importing database:', err.message);
  } finally {
    await connection.end();
  }
}

importSQL();
