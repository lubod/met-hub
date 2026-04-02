import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DB || "postgres",
  password: process.env.PG_PASSWORD || "postgres",
  port: parseInt(process.env.PG_PORT, 10) || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => console.error("Unexpected PG pool error", err));

export default pool;
