const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const runSqlFile = async (fileName) => {
  const filePath = path.join(__dirname, fileName);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  try {
    console.log(`Executing ${fileName}...`);
    await pool.query(sql);
    console.log(`✅ Successfully executed ${fileName}`);
  } catch (err) {
    console.error(`❌ Error executing ${fileName}:`, err.message);
    throw err;
  }
};

const init = async () => {
  try {
    await runSqlFile('schema.sql');
    await runSqlFile('seed.sql');
    console.log('\n🚀 Database setup complete!');
  } catch (err) {
    console.error('\n💥 Database setup failed.');
  } finally {
    await pool.end();
  }
};

init();
