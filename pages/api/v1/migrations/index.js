import migrationRunner from 'node-pg-migrate';
import { join } from 'node:path';

import database from 'infra/database';

async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient,
    dir: join('infra', 'migrations'),
    migrationsTable: 'pgmigrations',
    dryRun: true,
    direction: 'up',
    verbose: true,
  };

  if (request.method === 'POST') {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });
    let status = 200;

    await dbClient.end();
    if (pendingMigrations.length > 0) status = 201;
    return response.status(status).json(pendingMigrations);
  }

  if (request.method === 'GET') {
    const migratedMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}

export default migrations;
