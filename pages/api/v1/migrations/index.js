import { createRouter } from "next-connect";

import controller from "infra/controller";
import migrator from "infra/model/migrator";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorsHandlers);

async function getHandler(request, response) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();

  let status = 200;
  if (migratedMigrations.length > 0) status = 201;

  return response.status(status).json(migratedMigrations);
}
