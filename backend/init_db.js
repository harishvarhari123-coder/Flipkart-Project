const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
    try {
        console.log("Connecting to Aiven MySQL database...");
        
        // Connect directly to the host without specifying a DB initially, or use DB_NAME
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306,
            multipleStatements: true, // Crucial for running a full SQL file
            ssl: { rejectUnauthorized: false } // Required for Aiven
        });

        const sqlFilePath = path.join(__dirname, '..', 'database_queries.sql');
        const sqlQueries = fs.readFileSync(sqlFilePath, 'utf8');

        console.log("Running SQL queries to create tables...");
        await pool.query(sqlQueries);

        console.log("✅ Successfully created all tables and sample data in Aiven Database!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error running database script:");
        console.error(err.message);
        process.exit(1);
    }
}

initDB();
