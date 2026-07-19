const db = require('./config/db');

const migrateContactTable = async () => {
  try {
    await db.query(`
      ALTER TABLE contact_messages 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';
    `);
    console.log('✅ contact_messages table migrated with status column.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error migrating table:', err);
    process.exit(1);
  }
};

migrateContactTable();
