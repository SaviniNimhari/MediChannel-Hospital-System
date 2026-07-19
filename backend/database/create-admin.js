const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createAdmin = async () => {
  const email = 'admin@medichannel.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const res = await pool.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING RETURNING *',
      ['System Administrator', email, hashedPassword, 'Admin']
    );
    
    if (res.rowCount > 0) {
      console.log('✅ Admin created successfully!');
    } else {
      console.log('ℹ️ Admin already exists.');
    }
    
    console.log('\n--- ADMIN CREDENTIALS ---');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('-------------------------\n');

  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    await pool.end();
  }
};

createAdmin();
