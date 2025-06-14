import database from "infra/database";

async function status(request, response) {
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

export default status;
