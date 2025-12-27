import database from "infra/database";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
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
  } catch (error) {
    console.log('erro no controller de status');
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.error(publicErrorObject);

    return response.status(500).json(publicErrorObject);
  }
}

export default status;
