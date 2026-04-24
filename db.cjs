const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',      // check kar kahin 'local host' (space) to nahi hai
  database: 'Patient',    // Database ka naam pgAdmin mein bilkul yahi hona chahiye
  password: 'mayuri25@u', 
  port: 5433,             // Isko check kar pgAdmin se
});

// Ye connection test code help karega error pechanne mein
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Connection error detail:', err.message);
  }
  console.log('✅ Database connected successfully!');
  release();
});

module.exports = pool;