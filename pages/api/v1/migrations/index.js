import migrationRunner from "node-pg-migrate";
import { createRouter } from "next-connect";
import { resolve } from "node:path";
import controller from "infra/controller";

import database from "infra/database";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorsHandlers);

const defaultMigrationOptions = {
  dir: resolve("infra", "migrations"),
  migrationsTable: "pgmigrations",
  dryRun: true,
  direction: "up",
  verbose: true,
};

async function getHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    await dbClient.end();
    return response.status(200).json(migratedMigrations);
  } finally {
    if (dbClient) await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
      dbClient,
    });
    let status = 200;

    await dbClient.end();
    if (pendingMigrations.length > 0) status = 201;

    return response.status(status).json(pendingMigrations);
  } finally {
    if (dbClient) await dbClient.end();
  }
}
