import { Client } from "pg";

function getClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    port: process.env.POSTGRES_PORT,
    password: process.env.POSTGRES_PASSWORD,
  });
  return client;
}

async function query(queryObject) {
  const client = getClient();

  try {
    await client.connect();

    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};

async function version() {
  const result = await query('SHOW server_version');
  return result.rows[0].server_version;
};

async function maxConnections() {
  const result = await query('SHOW max_connections');
  return result.rows[0].max_connections;
};

async function usedConnections(databaseName = undefined) {
  if (databaseName === undefined) {
    databaseName = process.env.POSTGRES_DB;
  }

  const queryString = 'SELECT COUNT(*) FROM pg_stat_activity WHERE datname = $1;';
  const result = await query({
    text: queryString,
    values: [databaseName],
  });

  return result.rows[0].count;
};

export default {
  query,
  version,
  maxConnections,
  usedConnections,
};
