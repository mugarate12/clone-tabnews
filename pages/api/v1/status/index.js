import { createRouter } from "next-connect";
import database from "infra/database";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  console.error(publicErrorObject);

  return response.status(405).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  console.log('erro no controller de status');
  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  console.error(publicErrorObject);

  return response.status(500).json(publicErrorObject);
}

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
