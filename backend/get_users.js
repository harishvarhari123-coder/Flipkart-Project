const db = require('./db');

async function main() {
  try {
    const [rows] = await db.query('SELECT name, email FROM users LIMIT 10');
    console.log('USERS:', JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

main();
