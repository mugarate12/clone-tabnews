test('Get to /api/v1/status should return 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/status');
  const body = await response.json();
  const updated_at = new Date(body.updated_at).toISOString();
  console.log(body);

  expect(response.status).toBe(200);
  expect(body.updated_at).toBeDefined();
  expect(updated_at).toEqual(body.updated_at);
  expect(body.dependencies.database.version).toBeDefined();
  expect(body.dependencies.database.version).toBe('16.0');
  expect(body.dependencies.database.max_connections).toBeDefined();
  expect(typeof body.dependencies.database.max_connections).toBe('number');
  expect(body.dependencies.database.opened_connections).toBeDefined();
  expect(typeof body.dependencies.database.opened_connections).toBe('number');
  expect(body.dependencies.database.opened_connections).toBe(1);
});
