//lib/db.ts
import * as mariadb from 'mariadb';

declare global {
  var mariadbPool: mariadb.Pool | undefined;
}

const dbConfig = {
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
  connectionLimit: 5,
};

// Singleton
const pool = globalThis.mariadbPool || mariadb.createPool(dbConfig);
// Evitar problemas con NextJS Hot reload si se hace npm run dev
if (process.env.NODE_ENV !== 'production') {
  globalThis.mariadbPool = pool;
}

export async function query(sql: string, params?: any[]) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(sql, params);
    return res;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
}