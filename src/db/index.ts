import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema.ts';

declare global {
  var _postgresPool: any | undefined;
}

export const createPool = () => {
  const host = process.env.SQL_HOST;
  const user = process.env.SQL_USER;
  const password = process.env.SQL_PASSWORD;
  const database = process.env.SQL_DB_NAME;

  if (!host || !user || !database) {
    console.warn("Missing DB environment variables. SQL_HOST, SQL_USER, or SQL_DB_NAME is undefined.");
  }

  const config = {
    host,
    user,
    password,
    database,
    max: 1, 
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
  };

  if (!global._postgresPool) {
    try {
      global._postgresPool = new Pool(config);
      global._postgresPool.on('error', (err: any) => {
        console.error('Unexpected error on idle SQL pool client:', err);
      });
    } catch (e) {
      console.error('Error creating PG Pool:', e);
      throw e;
    }
  }
  return global._postgresPool;
};

export const getDb = () => {
  try {
    const pool = createPool();
    return drizzle(pool, { schema });
  } catch (error) {
    console.error('getDb failed:', error);
    throw error;
  }
};

// Default export for simplicity in some contexts
export const db = getDb();
