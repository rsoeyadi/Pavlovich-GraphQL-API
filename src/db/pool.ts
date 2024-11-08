import pg from 'pg';
import 'dotenv/config';

// create a pool to reuse connections instead of creating direct connections for every request
const { Pool } = pg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
})
