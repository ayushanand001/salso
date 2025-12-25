const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // This allows the connection even if the certificate is self-signed (standard for cloud DBs)
    rejectUnauthorized: false,
  },
  // Give the "Cold Start" database more time to wake up
  connectionTimeoutMillis: 20000, // Wait 20 seconds for the initial connection
  idleTimeoutMillis: 30000, // How long a client is allowed to sit idle before being closed
  max: 10, // Maximum number of clients in the pool
});

pool.on("connect", () => {
  console.log("PostgreSQL connected successfully");
});

pool.on("error", (err) => {
  console.error("PostgreSQL connection error:", err);
});

module.exports = pool;
