import { createRouter } from "next-connect";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorsHandlers);

async function getHandler(request, response) {
  const { databaseName } = request.query;

  const updatedAt = new Date().toISOString();
  const version = await database.version();
  const maxConnections = await database.maxConnections();
  const usedConnections = await database.usedConnections(databaseName);

  return response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: version,
        max_connections: Number(maxConnections),
        opened_connections: Number(usedConnections),
      },
    },
  });

}
