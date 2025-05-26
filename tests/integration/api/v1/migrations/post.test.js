import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
});

test('POST to /api/v1/migrations should return 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/migrations', {
    method: "POST",
  });
  const response2 = await fetch('http://localhost:3000/api/v1/migrations', {
    method: "POST",
  });
  const responseBody = await response.json();
  const responseBody2 = await response2.json();

  expect(response.status).toBe(201);
  expect(Array.isArray(responseBody)).toBe(true);
  expect(response2.status).toBe(200);
  expect(Array.isArray(responseBody2)).toBe(true);
});
