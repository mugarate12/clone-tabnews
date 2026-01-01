import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

import database from "infra/database";
import { ServiceError } from "infra/errors";

const defaultMigrationOptions = {
  dir: resolve("infra", "migrations"),
  migrationsTable: "pgmigrations",
  dryRun: true,
  direction: "up",
  verbose: true,
  log: () => {},
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
      dbClient,
    });

    return migratedMigrations;
  } catch (error) {
    throw new ServiceError({
      cause: error,
      message: 'Erro ao executar as "migrações" no banco de dados',
    });
  } finally {
    await dbClient?.end();
  }
}


const migrator = {
  listPendingMigrations,
  runPendingMigrations,
}

export default migrator;
